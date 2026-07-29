# Security review — openmic

**Target:** `/home/donn/code/openmic` (Cloudflare Worker + D1), live at `https://openmic.techduinn.dpdns.org`
**Date:** 2026-07-29
**Commit reviewed:** `80764b2`
**Authorised by:** the owner, for red-team assessment.

## How this was tested

All active testing was done against a **local** `wrangler dev` instance on `127.0.0.1:8799`,
with a throwaway `ADMIN_KEY`, against a local D1 copy. Four test venues were created locally
(`alpha`, `beta`, `gamma`, `race`, `dup`, `load`, `xssvenue`).

Against production, **six read-only GETs** were made: `/`, `/robots.txt`, `/admin/new` (form
render only, never submitted). No writes, no brute force, no junk data. No application source
was modified; `git status` is clean.

Every finding is labelled **PROVEN** (reproduced against the local server) or **BY READING**
(identified in source, not exercised).

## Summary

The code is in better shape than most things of this size. **SQL injection and XSS are both
genuinely absent** — not "probably fine", but verified across every rendered field and every
query. Cross-venue IDOR is properly blocked. Phone numbers do not leak to unauthenticated
callers. The host token has 144 bits of entropy and does not leak through referrers.

The real problems are not injection. They are **abuse resistance** (anything with the public
URL can vandalise a venue's running order, which then displays on a screen behind a bar),
**credential lifecycle** (the host link is a permanent bearer token with no rotation path),
and **data retention** (phone numbers are kept forever with no deletion route, contradicting
the privacy notice shown to performers).

| # | Severity | Finding |
|---|----------|---------|
| 1 | High | Unauthenticated list flooding / vandalism; capacity and duplicate guards both lose to a race |
| 2 | High | Host token is a permanent, unrotatable, unrevocable bearer credential granting all performer phone numbers |
| 3 | Medium | 100 MB request bodies accepted and fully parsed |
| 4 | Medium | Performer phone numbers retained indefinitely with no deletion mechanism |
| 5 | Medium | `setup.sh` runs `schema.sql` (`DROP TABLE`) against the **remote** database |
| 6 | Low | Free-text "Anything you need?" is published on the public page |
| 7 | Low | `ADMIN_KEY` comparison is not constant-time and has unlimited attempts |
| 8 | Low | No CSP, `X-Frame-Options`, HSTS, or `Permissions-Policy` |
| 9 | Info | Host actions are scoped by venue but not by night |
| 10 | Info | Venue-slug enumeration oracle; HTTP method not enforced on read routes |

---

## 1. HIGH — Unauthenticated list flooding, and both integrity guards lose to a race

**PROVEN.**

**File:** `src/index.js:106-178` (`handleJoin`), `src/index.js:465-467` (route).

`POST /:slug/join` is completely unauthenticated. There is no rate limit, no Turnstile, no
proof of presence in the room, and no per-IP accounting. The two integrity checks that exist
are both read-then-write with no transaction:

```js
const existing = await getPerformers(env, venue.slug, night);   // read
if (existing.length >= venue.capacity) { ... }                  // check
if (existing.some((p) => p.name.toLowerCase() === name.toLowerCase())) { ... }
// ... later, unconditionally:
await env.DB.prepare(`INSERT INTO performers ...`)              // write
```

Nothing in the schema enforces either invariant (`migrations/` adds no unique index on
`(venue_slug, night, name)` and no capacity constraint), so under concurrency both fall over.

### Reproduce

```bash
# Fill a 200-capacity list from one machine
for i in $(seq 1 200); do curl -s -o /dev/null "$B/load/join" -d "name=junk$i&act=Solo" & done; wait
```
Result: **200 entries in 1.26 seconds.**

```bash
# Capacity race — venue capacity is 5
for i in $(seq 1 60); do curl -s -o /dev/null "$B/race/join" -d "name=r$i" & done; wait
curl -s "$B/race" | grep -oE "running order \([0-9]+\)"
```
Result: **`running order (16)`** — 16 rows in a venue whose stated capacity is 5.

```bash
# Duplicate-name race — same name, 30 times concurrently
for i in $(seq 1 30); do curl -s -o /dev/null "$B/dup/join" -d "name=SameName" & done; wait
curl -s "$B/dup" | grep -c '>SameName<'
```
Result: **5** identical `SameName` entries past the duplicate guard.

### What an attacker actually gets

The venue's URL is printed on a poster on the bar, so it is public by design. Anyone who has
seen the poster — or scraped the slug — can, from a phone:

- Fill tonight's entire list with junk in under a second, locking out every real performer
  (`existing.length >= venue.capacity` then rejects genuine sign-ups with "Tonight's list is
  full").
- Put **arbitrary attacker-chosen text at the top of `/:slug/stage`**, which the product
  documentation describes as running on a big screen behind the bar on a 15-second auto-refresh
  (`src/views.js:409-432`, `{ refresh: 15 }`). The text is correctly HTML-escaped so this is
  not XSS — but a slur or a phone number rendered at `clamp(2.4rem, 11vw, 6rem)` behind a bar
  is the actual worst-case harm this product can cause, and it needs no vulnerability beyond
  "there is no rate limit".
- Break the host's mental model of the list by exceeding stated capacity and creating
  duplicates that the UI implies cannot exist.

There is no host-side moderation primitive beyond removing rows one at a time
(`action=remove`, one form submit each) or nuking the whole night (`action=reset`).

### Fix

1. **Enforce the invariants in the database, not in JavaScript.**
   Add to a new migration:
   ```sql
   CREATE UNIQUE INDEX idx_performers_unique_name
     ON performers (venue_slug, night, lower(name));
   ```
   and handle the constraint violation as the "already on the list" error. That closes the
   duplicate race permanently. For capacity, do the check inside the insert:
   ```sql
   INSERT INTO performers (...)
   SELECT ?, ?, ?, ... WHERE (
     SELECT count(*) FROM performers WHERE venue_slug = ? AND night = ?
   ) < ?;
   ```
   and treat `meta.changes === 0` as "list is full".
2. **Add a rate limit.** Cloudflare's Workers Rate Limiting binding is the least-effort option
   and needs no extra infrastructure — bind it in `wrangler.jsonc` and key on
   `cf-connecting-ip` + slug, e.g. 3 sign-ups per IP per hour per venue.
3. **Add Cloudflare Turnstile to the sign-up form.** It is free, it is invisible in managed
   mode, and it costs a real performer nothing.
4. **Give the host a one-tap kill switch on the stage display.** A `stage_paused` column on
   `venues` plus a button on the dashboard, so a host being griefed can blank the big screen
   in one action rather than deleting rows individually.
5. Consider a short join window: only accept sign-ups while `signups_open = 1` **and** within
   N hours of the night's start.

---

## 2. HIGH — The host link is a permanent bearer credential with no rotation or revocation

**BY READING** (entropy and non-leakage were **PROVEN**; the lifecycle gap is a design finding).

**File:** `src/lib.js:41-47` (`newToken`), `src/index.js:56-60` (`getVenueByToken`),
`src/index.js:492-511` (route), `schema.sql:11` (`host_token TEXT NOT NULL UNIQUE`).

### What is actually fine (verified, so you can stop worrying about it)

- **Entropy is more than adequate.** `crypto.getRandomValues(new Uint8Array(18))` base64url-encoded
  = **144 bits**, 24 characters. Observed tokens: `EBcWzYP2unokAGHJLWrcLTu6`,
  `DcwqPB5A0t8x0xJekmIsuX2q`. Not guessable, not enumerable, not sequential.
- **Brute force is infeasible** even with no rate limiting. PROVEN: 100 wrong tokens in 1.00s
  with no lockout and the real token still working afterwards — but 2^144 makes the absence of
  throttling irrelevant here.
- **The token does not leak via Referer.** PROVEN: the host dashboard HTML contains **zero
  external URLs** — CSS is inlined in `src/views.js:3-86`, there are no images, fonts, scripts,
  or third-party links. `referrer-policy: same-origin` is set on every HTML response
  (`src/lib.js:64`). There is no path by which the token reaches a third party through the
  browser.
- **The token does not leak into any error page or redirect to an unauthenticated party.**
  A wrong token returns a bare `403` with the text "Bad host link." and nothing else.
- **Cross-venue IDOR is blocked** — see §"Tested and found safe" below.

### What is the problem

The token is the *only* credential, it lives in the URL, and there is **no code path anywhere
in the application to rotate or revoke it**. `newToken()` is called exactly once, at venue
creation (`src/index.js:347`). There is no "regenerate host link" action in `handleHostAction`
(`src/index.js:180-328`), no expiry column, and no audit trail.

Combined with what the token grants, that is the exposure:

- **Every performer's mobile number for that venue**, rendered on the dashboard
  (`src/views.js:455-457`). PROVEN: `curl $B/beta/host/$TOKEN` returns `0412345678`.
- Full destructive control: `action=reset` deletes the entire night's list
  (`src/index.js:244-249`), `action=remove` deletes individuals.
- The ability to reorder the running order and control the big screen.

A URL-in-the-address-bar credential in this specific context will end up in: the bar's shared
tablet browser history, a screenshot in a venue WhatsApp group, a bookmark on a laptop that
gets sold, an email to a relief host who later falls out with the venue, and Cloudflare's
request logs (`observability.head_sampling_rate: 1` in `wrangler.jsonc` logs 100% of requests,
URL included). Any one of those is permanent, because there is no way to change the token.

The app's own footer acknowledges this: *"Don't share it publicly or punters can reorder the
list"* (`src/views.js:584-585`) — but gives the host no recourse when it happens.

### Fix

1. **Add a rotation action.** In `handleHostAction`, add:
   ```js
   if (action === 'rotate_token') {
     const next = newToken();
     await env.DB.prepare('UPDATE venues SET host_token = ? WHERE slug = ?')
       .bind(next, venue.slug).run();
     return redirect(`/${venue.slug}/host/${next}`);
   }
   ```
   with a confirm step on the dashboard. This is ~10 lines and removes the entire "permanent"
   half of the problem.
2. **Stop putting phone numbers on a page reachable by a URL alone.** Either (a) mask by
   default and reveal per-row behind a second factor, or (b) replace the raw number with a
   `tel:` link whose digits are only rendered on click, or (c) move to a short host PIN set at
   venue creation that must be POSTed to exchange the URL token for a short-lived `HttpOnly`
   session cookie. Option (c) is the correct fix and turns the URL into a *locator* rather than
   a *credential*.
3. **Add an expiry.** `host_token_expires_at` on `venues`, checked in `getVenueByToken`, with
   the dashboard offering "extend". A stale link found in 2028 should not still work.
4. **Reduce log retention of the token.** Either lower `head_sampling_rate`, or move the token
   out of the path (see 2c) so it never lands in Cloudflare's logs at all.

---

## 3. MEDIUM — 100 MB request bodies are accepted and fully parsed

**PROVEN.**

**File:** `src/index.js:108` (`await request.formData()`), same at `:181`, `:331`.

There is no `Content-Length` check anywhere before `request.formData()` is awaited. The Worker
parses the whole body into memory, and only *afterwards* is any field truncated by
`clean(v, max)` (`src/lib.js:82-85`).

### Reproduce

```bash
python3 -c "import sys;sys.stdout.write('name=X'+'A'*104857600)" > big.txt
curl -s -o /dev/null -w "%{http_code}" -X POST $B/beta/join \
  --data-binary @big.txt -H 'Content-Type: application/x-www-form-urlencoded'
```

Measured against the local dev server:

| Body size | Status | Time |
|-----------|--------|------|
| 100 KB | 200 | 0.013 s |
| 1 MB | 200 | 0.017 s |
| 10 MB | 200 | 1.05 s |
| 50 MB | 200 | 1.23 s |
| **100 MB** | **200** | **1.47 s** |

The stored value was correctly truncated to 60 characters — so this is not a storage problem.
It is a compute-and-memory problem: 100 MB is allocated, decoded, and `String.replace(/\s+/g,' ')`
is run over it (`src/lib.js:84`) before anything rejects it.

### What an attacker actually gets

Combined with finding #1 (no rate limiting), a single host can hold open many concurrent
100 MB uploads. Each one consumes CPU time and allocates within the isolate's memory budget.
On Workers this pushes toward the per-request CPU limit and the ~128 MB isolate memory limit,
and every request is billed and logged at 100% sampling. This is a cheap way to burn the
project's Cloudflare budget or make the sign-up endpoint unavailable during a gig.

**Not proven:** whether this actually OOMs or 1102s a production isolate. I did not test it
against production, deliberately. The acceptance of the body and the CPU cost are proven; the
production failure mode is inferred.

### Fix

Reject oversized bodies before parsing. At the top of each handler that calls `formData()`:

```js
const MAX_BODY = 16 * 1024; // no legitimate sign-up is anywhere near this
const len = Number(request.headers.get('content-length') || 0);
if (!len || len > MAX_BODY) {
  return html(errorPage('That request was too large.', 413), 413);
}
```

Also add a Cloudflare WAF rule capping request body size on the `/`*`/join`* and `/admin/new`
paths, so the request is dropped at the edge and never reaches the Worker.

---

## 4. MEDIUM — Phone numbers are retained indefinitely, with no deletion route

**BY READING**, confirmed against the schema and every route.

**File:** `schema.sql:19-32` (`phone TEXT`), `src/index.js:244-249` (`action=reset`),
`src/views.js:181-183` (the privacy notice).

The sign-up form tells every performer, verbatim:

> *"We keep your name and number for tonight's running order only, so the host knows who is up.
> ... You can ask us to delete it any time."*

Neither half of that is currently true in the code.

- **"for tonight's running order only":** `performers` rows are never expired. The host's
  "Clear tonight's list" button runs
  `DELETE FROM performers WHERE venue_slug = ? AND night = ?` (`src/index.js:245`) — scoped to
  *tonight only*. Every previous night's rows, including every phone number, stay in D1
  forever. PROVEN indirectly: I inserted a `2020-01-01` row into `beta` and it was still
  present and mutable after normal operation.
- **"You can ask us to delete it any time":** there is no self-service deletion route, no
  host-side "purge old nights" action, and no scheduled cleanup. `wrangler.jsonc` declares no
  cron trigger. Honouring a deletion request requires a manual `wrangler d1 execute --remote`
  against production.
- `contact_email` (`migrations/002_fair_pay.sql`) has the same problem, with the same
  indefinite retention.

### What an attacker actually gets

Nothing directly — this is not remotely exploitable, and I want to be clear about that. The
exposure is that a single compromise of any *one* venue's host link (finding #2, which is
permanent and unrotatable) yields not one night of phone numbers but **the entire history** of
everyone who has ever played that room. It also puts the project in direct conflict with its
own stated APP 11.2 / retention position — which matters more than usual here, given
`migrations/006_crew_consent.sql` shows the author is explicitly reasoning about the
Privacy Act.

### Fix

1. **Add a scheduled purge.** In `wrangler.jsonc`:
   ```jsonc
   "triggers": { "crons": ["0 19 * * *"] }
   ```
   and a `scheduled()` export that runs:
   ```sql
   UPDATE performers SET phone = '', contact_email = ''
     WHERE night < date('now','-2 days') AND (phone != '' OR contact_email != '');
   ```
   Blanking the contact fields while keeping the row preserves the "who played, where, when"
   record the `/rights` page promises for APRA claims, without keeping the phone number.
2. **Add a delete-me action for the performer.** They already hold an identifying cookie
   (`om_<slug>`), so `POST /:slug/forget` scoped by `getMe()` is a five-line handler and makes
   the privacy notice true.
3. **Add "delete all history" to the host dashboard**, distinct from "clear tonight".
4. Only collect `phone` when the venue actually uses it — make it opt-in per venue, since the
   stated purpose ("so the host can text you") is not universal.

---

## 5. MEDIUM — `setup.sh` runs `schema.sql` against the remote database, and `schema.sql` starts with `DROP TABLE`

**BY READING.** Deliberately not tested — testing it would destroy production data.

**Files:** `setup.sh:87-94`, `schema.sql:3-4`, `package.json` (`db:remote` script).

```sh
# setup.sh:88
$WRANGLER d1 execute "$DB_NAME" --remote --yes --file=./schema.sql >/dev/null 2>&1 \
  || warn "Schema already applied, or partially. Continuing."
```

and `schema.sql` opens with:

```sql
DROP TABLE IF EXISTS performers;
DROP TABLE IF EXISTS venues;
```

`--yes` suppresses the confirmation prompt. `DROP TABLE IF EXISTS` **succeeds** on an existing
database, so the `||` fallback never fires — the drop goes through, the `CREATE TABLE`s
succeed, and the script prints its normal success output. `npm run db:remote` has exactly the
same shape.

### What this costs

Re-running `./setup.sh` against a live deployment — to fix a binding, re-deploy, or onboard a
second machine — **silently and irreversibly destroys every venue and every performer record**,
including every host token. Every printed QR poster in every bar stops working, and there is no
backup step anywhere in the script. D1 point-in-time recovery exists but is not mentioned, not
enabled explicitly, and not something a stressed operator will reach for at 11pm.

This is not an attacker capability. It is a loaded footgun in the installer that ships to users
in `HOWTO.md`, and it is the single most likely way this project loses production data.

### Fix

1. **Split the destructive DDL out of `schema.sql`.** Rename it `schema-init.sql`, remove the
   two `DROP TABLE` lines, and change every `CREATE TABLE` to `CREATE TABLE IF NOT EXISTS`.
   Put the drops in a clearly-named, separately-invoked `scripts/DESTROY-AND-REBUILD.sql` that
   no npm script and no installer ever calls.
2. **Make `setup.sh` idempotent and refuse to touch a populated database:**
   ```sh
   COUNT=$($WRANGLER d1 execute "$DB_NAME" --remote --json \
     --command "SELECT count(*) c FROM venues" 2>/dev/null | grep -oE '"c":[0-9]+' | cut -d: -f2)
   if [ "${COUNT:-0}" -gt 0 ]; then
     die "Database already has $COUNT venues. Refusing to re-run schema. Use migrations."
   fi
   ```
3. **Drop `--yes` from remote executions** in `package.json`'s `db:remote` / `db:migrate:remote`.
4. Add an explicit `wrangler d1 export` backup step before any remote schema operation.

---

## 6. LOW — Free-text "Anything you need?" is published on the public page

**PROVEN.**

**File:** `src/views.js:109-115` (`actLine` includes `p.needs`), `src/views.js:124-135`
(rendered on the public sign-up page), form field at `src/views.js:165-167`.

The field is labelled simply **"Anything you need?"** with the placeholder *"e.g. DI for
acoustic, borrowing a guitar, need a stool"*. Nothing tells the performer it will be shown to
the whole room.

### Reproduce

```bash
curl -s -X POST $B/gamma/join --data-urlencode 'name=Priv Test' \
  --data-urlencode 'needs=wheelchair access, I am deaf in left ear'
curl -s $B/gamma | grep -o 'wheelchair access[^<]*'
```
Result: `wheelchair access, I am deaf in left ear` — rendered on the public, unauthenticated
`/:slug` page for everyone.

### What an attacker actually gets

Nothing to attack. The exposure is that "need a stool" and "I'm autistic and need the room
quiet before I go on" go in the same box, and one of those is health information under the
Privacy Act. A nervous first-timer disclosing an access need has it published to every person
in the bar with the QR code, with no warning and no way to retract it.

### Fix

Keep `needs` **host-only**. Remove `p.needs` from the public `actLine` path and render it only
in `hostPage` (it is already there via the same helper — split the helper in two). Then relabel
the field to "Anything the host should know? (only the host sees this)". If a public
equipment-sharing signal is genuinely wanted, add a separate explicit checkbox
("I need to borrow a guitar") rather than free text.

---

## 7. LOW — `ADMIN_KEY` comparison is not constant-time, and attempts are unlimited

**PROVEN** (attempt rate and absence of lockout); the timing channel is **BY READING**.

**File:** `src/index.js:333`.

```js
if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
  return html(errorPage('Nope.', 403), 403);
}
```

### What is fine

- **It fails closed.** If `env.ADMIN_KEY` is unset, every request is rejected. PROVEN: a POST
  with no `key` field at all returns `403`, and a POST with a wrong key returns `403`.
- **The key is never reflected or logged.** The 403 response body is the fixed string "Nope."
  The `catch` block at `src/index.js:514-523` logs only `path`, `method`, and the error stack —
  never form fields. `console.error` is not reached on a bad key at all.
- **A venue cannot be created without it.** `/admin/new` POST is the only insert into `venues`
  and it is gated before any other work.
- **The default key is strong.** `setup.sh:106` generates `randomBytes(24).toString('base64url')`
  = 192 bits.

### What is the problem

- `!==` on strings short-circuits at the first differing byte, so it is not constant-time. I
  consider this **not practically exploitable** across the internet against a Cloudflare Worker:
  the timing delta is on the order of nanoseconds against millisecond-scale network and
  cold-start jitter, and V8 string comparison on interned strings does not reliably expose a
  per-byte gradient. I am listing it for completeness and because the fix is trivial, not
  because I think anyone will exploit it.
- **The unlimited attempt rate is the real issue.** PROVEN: 100 sequential guesses in 0.74 s;
  300 concurrent guesses in 0.59 s. No lockout, no delay, no alerting. That is ~500 guesses/sec
  from one laptop against a local instance.
- This only matters because `setup.sh:101-103` lets an operator supply their own key via
  `OPENMIC_ADMIN_KEY` with **no strength validation**. If someone sets `openmic2026`, it falls
  in minutes.

### What an attacker gets if they succeed

The ability to create venues. Notably, **not** the ability to read existing venues' tokens or
performer data — `handleAdminCreate` only inserts. So the blast radius is squatting on slugs
and creating decoy venues, not data theft. Worth stating plainly, because "admin key
brute-force" sounds worse than it is here.

### Fix

1. Constant-time compare:
   ```js
   function timingSafeEqual(a, b) {
     const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
     if (ea.length !== eb.length) return false;
     let diff = 0;
     for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
     return diff === 0;
   }
   ```
2. Rate-limit `/admin/new` POST hard (5 attempts per IP per hour) via the Workers Rate Limiting
   binding, and `console.warn` every failure so it shows up in Workers Logs.
3. In `setup.sh`, reject a user-supplied `OPENMIC_ADMIN_KEY` shorter than 24 characters.
4. Better still, put `/admin/*` behind Cloudflare Access. It is free for small teams and removes
   this entire finding.

---

## 8. LOW — Missing security headers

**PROVEN** against both local and production.

**File:** `src/lib.js:58-68` (`html`), `src/lib.js:77-79` (`redirect`).

Present: `cache-control: no-store`, `x-content-type-options: nosniff`,
`referrer-policy: same-origin`. That is a better starting point than most.

Absent on every response, including the host dashboard and the live site:

- `Content-Security-Policy`
- `X-Frame-Options` / `frame-ancestors`
- `Strict-Transport-Security`
- `Permissions-Policy`

Production response headers for `GET /` confirmed identical to local.

### Honest assessment

- **Clickjacking is not currently exploitable.** Framing the host dashboard requires already
  knowing the host token, and an attacker with the token does not need the victim's clicks.
- **CSP would not have stopped any bug found in this review**, because there is no XSS.

The value is purely defence-in-depth: this app renders attacker-controlled strings on a screen
in a public venue, and CSP is what converts a future escaping mistake from "stored XSS on the
bar's big screen" into "a blocked console error". Given the trust placed in the stage display,
that is worth the four lines.

### Fix

In `src/lib.js`, add to the `html()` headers:

```js
'content-security-policy':
  "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; " +
  "form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
'x-frame-options': 'DENY',
'strict-transport-security': 'max-age=31536000; includeSubDomains',
'permissions-policy': 'geolocation=(), microphone=(), camera=(), interest-cohort=()',
```

`style-src 'unsafe-inline'` is required because the CSS is inlined in a `<style>` block
(`src/views.js:104`) and there are inline `style="..."` attributes throughout. `script-src` is
absent from the policy entirely, which is correct — the app ships **no JavaScript at all**
except one `onclick="window.print()"` on the poster page (`src/views.js:609`). Move that to a
nonce'd `<script>` or a `<button form=...>` and the policy can stay script-free, which is a
genuinely strong position.

Also apply the same headers to the 303 in `redirect()`, which currently sets only `location`.

---

## 9. INFO — Host actions are scoped by venue but not by night

**PROVEN.**

**File:** `src/index.js:278-306`.

`remove`, `done`, `noshow`, and `onstage` are scoped `WHERE id = ? AND venue_slug = ?` with no
`AND night = ?`:

```js
'UPDATE performers SET status = ? WHERE id = ? AND venue_slug = ?'
```

### Reproduce

A `2020-01-01` row was inserted directly into `beta`. `POST /beta/host/$TOKEN/act` with
`action=done&id=OLDNIGHT1` changed its status to `done`.

### Impact: effectively zero

The host can only reach rows belonging to **their own venue** — cross-venue was tested and
blocked. `getPerformers` filters by night, so the affected row is not even rendered. The only
way to obtain a historical row id is to have been the host of that venue on that night. This is
a data-hygiene wart, not a vulnerability.

I checked `action=up` / `action=down` (`src/index.js:308-325`) specifically because those run
`UPDATE performers SET position = ? WHERE id = ?` with **no `venue_slug` scoping at all**, which
looks alarming. It is **not exploitable**: both ids are read out of `list`, which is
`getPerformers(env, venue.slug, night)`, and a non-member id gives `findIndex` → `-1`, which
skips the block entirely. An attacker cannot get a foreign id into either bind position.

### Fix

Append `AND night = ?` to the four statements, and add `AND venue_slug = ?` to the two
`position` updates for defence in depth. Low priority.

---

## 10. INFO — Minor observations

**Venue-slug enumeration.** `GET /:slug` returns 200 for a real venue and 404 for a fake one
(`src/index.js:428-429`). PROVEN. Slugs are printed on public posters, so this discloses
nothing that is not already public, but it does let someone enumerate the full customer list.
If that matters commercially, add a small random delay or a uniform response — but it is
probably not worth the complexity.

**HTTP method not enforced on read routes.** `POST /:slug/stage` returns 200 and renders the
stage page (`src/index.js:470-472` checks only the path). PROVEN. Harmless — no state changes —
but it should 405.

**`PAID_LABEL` prototype lookup.** `src/views.js:510` does `PAID_LABEL[c.paid]` where `c.paid`
is attacker-influenced only by the host. `c.paid` is capped at 10 chars by
`clean(form.get('paid'), 10)` (`src/index.js:227`), so `constructor` (11) is truncated, but
`toString` (8) and `__proto__` (9) both resolve to inherited properties and render as
`· function toString() { [native code] }` or `· [object Object]`. The output is passed through
`esc()`, so this is cosmetic corruption, **not XSS and not prototype pollution**. Fix with
`Object.hasOwn(PAID_LABEL, c.paid) ? ... : ''` or `Object.create(null)`.

**`errorPage`'s `status` parameter is unused** inside the function (`src/views.js:666-672`) —
the status is set by the separate `html(body, status)` argument. Both call sites happen to pass
matching values, so no bug today, but it is a trap. Remove the parameter.

**`json` is imported but never used** in `src/index.js:9`. Worth noting positively: **there is
no JSON API at all**, so there is no machine-readable endpoint leaking performer data. Dead
import; remove it.

**`database_id` is committed** in `wrangler.jsonc:13`. This is an identifier, not a credential —
it is useless without authenticated Cloudflare account access. Not a finding, listed so it is
not re-raised.

---

## Tested and found safe

Things that could plausibly have been wrong, that I actively tried to break and could not.
Listing these so effort is not wasted re-checking them.

### SQL injection — none. Verified exhaustively.

All **21** `env.DB.prepare()` call sites use `.bind()`. There are **21** `.bind()` calls. Zero
`${...}` interpolation appears inside any SQL template literal — verified by regex across
`src/index.js`. Every statement is a static string.

Payloads pushed through `name`, `act`, `needs`, `phone`, `songs`, `slug`, and the admin fields:

```
Bobby'); DROP TABLE performers;--
' OR 1=1--
```

Both were stored and rendered as literal text; the `performers` table survived; the list count
was correct afterwards. **PROVEN safe.**

### XSS — none. Verified across every rendered surface.

`esc()` (`src/lib.js:3-11`) escapes `&`, `<`, `>`, `"`, and `'` — the correct set. Every HTML
attribute in `src/views.js` is double-quoted (checked manually), so the unescaped-backtick and
unquoted-attribute classes do not apply.

Payloads injected into **every** field that reaches the DOM — performer `name`, `act`, `needs`,
`phone`; venue `name`, `slug`, `blurb`, `night_label`, `host_name`, `suburb`; crew `name`,
`role`:

```
<script>alert(1)</script>
"><img src=x onerror=alert(2)>
</small><svg/onload=alert(3)>
</div><img src=x onerror=alert(3)>
"><svg onload=alert(4)>
```

Rendering verified on **all four** surfaces: the public sign-up page, the host dashboard, the
`<title>` tag, and — most importantly — **the stage big-screen display**. Every payload came
back entity-encoded. Example from `/gamma/stage`:

```html
<div class="now">&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;</div>
```

The three non-`esc()` interpolations were each checked individually and are all safe:
`venue.capacity` / `venue.max_songs` / `tip_total_cents` are integers from `clampInt` and
`centsFromInput`; `split.total` is `moneyAU()` output; `qrSvg` is `qrcode-svg` output whose
only input is `${origin}/${slug}` with `slug` restricted to `[a-z0-9-]` by `slugify`.

**Stored XSS on the bar's big screen — the stated worst case — does not exist.** PROVEN.

### Cross-venue IDOR — blocked on every state-changing action.

Using venue B's valid host token against venue A's data:

| Attempt | Result |
|---------|--------|
| `GET /alpha/host/<B's token>` | **403** — `getVenueByToken` requires slug + token together |
| `POST /beta/host/<B>/act` `action=remove&id=<alpha performer>` | 303, **no effect** — record intact |
| same with `action=done` / `noshow` / `onstage` | **no effect** — alpha statuses unchanged |
| same with `action=crew_rm&id=<alpha crew>` | **no effect** — crew member still listed |

Every performer and crew mutation carries `AND venue_slug = ?`. Parameter tampering with a
foreign id is accepted syntactically and does nothing. **PROVEN safe.**

### Performer phone numbers are not reachable unauthenticated.

A performer was created with `phone=0412345678` and `contact_email=jane@example.com`. Every
public route was grepped for both strings:

| Route | Hits |
|-------|------|
| `/:slug` | 0 |
| `/:slug/stage` | 0 |
| `/:slug/poster` | 0 |
| `/` | 0 |
| `/rights` | 0 |
| `/robots.txt` | 0 |
| `/:slug/host/:token` | 1 (expected) |

There is no JSON endpoint. `signupPage` never renders `p.phone` or `p.id`. `creditsBlock`
(`src/views.js:240-252`) correctly filters on `credit_optin` and correctly never publishes pay
status against a name, matching the stated intent in `migrations/006_crew_consent.sql`.
**PROVEN safe** — subject to finding #4 (retention) and #2 (the host link itself).

### CSRF — correctly handled, by accident of design but correctly.

- **Host actions carry no ambient credential.** Auth is the URL token, and a cross-site attacker
  who has the token does not need CSRF. There is no cookie to ride. Not a vulnerability.
- **`POST /:slug/claim`** is the only cookie-authenticated state change (`src/index.js:452-462`).
  The cookie is `SameSite=Lax` (`src/lib.js:100`), and Lax cookies are **not** sent on
  cross-site `POST`. **Blocked.** Impact if it were not: a performer's free drink marked as
  poured. Negligible either way.
- **`POST /:slug/join`** has no CSRF token, but also no authentication, so a forged cross-origin
  submit achieves nothing an attacker cannot do directly with `curl`. It is subsumed by
  finding #1.

### Open redirect — none.

`redirect()` is called with `/${venue.slug}/host/${venue.host_token}` and `/${slug}`.
`venue.slug` comes from the DB and is always `slugify`'d to `[a-z0-9-]{1,40}`; `host_token` is
base64url. Neither can produce `//evil.com` or an absolute URL. No user-controlled value ever
reaches a `Location` header. **Safe by construction.**

### Reserved-namespace collisions — no gap.

`RESERVED` (`src/index.js:43-50`) is checked both at creation (`:340`) and at request time
(`:426`). Independently, `slugify` strips `.` and `/`, so `robots.txt` and `favicon.ico` are
unreachable as slugs regardless. `GET /BETA` returns 404 (lookup is case-sensitive; slugs are
always lowercase). Probes for `/admin`, `/api`, `/static`, `/beta/../admin/new`,
`/beta%2f..%2fadmin` all resolved safely. **No route shadowing.**

### Secrets in the repository — none.

`git log -p --all` scanned for admin keys and host tokens. The only matches are the documented
example `ADMIN_KEY=localdevkey` in `HOWTO.md`, which is a local-dev placeholder, not a
production secret. `.gitignore` correctly excludes `.dev.vars`. `wrangler.jsonc` contains a
comment pointing at `wrangler secret put`, not a key. **Clean.**

### Host-token brute force — infeasible.

144 bits. 100 wrong guesses in 1.00 s produced 100 identical 403s with no lockout — and it does
not matter. Reported under finding #2 for completeness, not as an attack path.

### Cookie handling — correct.

`om_<slug>=<uuid>; Path=/<slug>; Max-Age=50400; HttpOnly; Secure; SameSite=Lax`. All four
attributes present. Value is a 122-bit `crypto.randomUUID()`. Checked the cookie-name collision
case (`clean` strips non-alphanumerics, so slugs `a-b` and `ab` share the name `om_ab`) — not
exploitable, because the `Path` values `/a-b` and `/ab` do not match each other under RFC 6265
path-matching, **and** `getMe` re-verifies `venue_slug` in the query regardless. **Safe.**

---

## Recommended order of work

1. **Rate limit + Turnstile on `/:slug/join`**, and a stage-display kill switch (#1). This is
   the only finding an attacker can use today, from a phone, against a live venue.
2. **Database-level unique index and capacity check** (#1) — small, permanent, closes both races.
3. **Body-size cap before `formData()`** (#3) — four lines, removes the DoS lever.
4. **Host-token rotation action** (#2) — ten lines, removes the "permanent credential" problem.
5. **Fix `setup.sh` / `schema.sql`** (#5) — before it costs a night's data.
6. **Scheduled contact-field purge + delete-me route** (#4) — makes the privacy notice true.
7. Move `needs` to host-only (#6), constant-time admin compare + admin rate limit (#7),
   security headers (#8).
8. Housekeeping (#9, #10).

Findings #2's deeper fix — a host PIN exchanged for a short-lived session cookie, so the URL
stops being a credential — is the right long-term design, but the rotation action buys most of
the safety for a fraction of the work. Do the rotation now; plan the PIN.
