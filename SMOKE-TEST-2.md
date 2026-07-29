# SMOKE-TEST-2 — local dev re-run against the hardened build

Date: 2026-07-29
Target: **local only** (`wrangler dev`, `127.0.0.1:8799`). Production was not touched.
No application source was modified.

## What was actually tested

The working tree at `/home/donn/code/openmic` was being edited live while this
test ran (uncommitted work on an Instagram field, and a rewrite of the stage
display from meta-refresh to polling, landed mid-session). To avoid testing a
moving target, the tree was snapshotted once and the snapshot was run:

- snapshot taken from the working tree shortly after commit `e2b277d`
  ("fix: close the abuse and lifecycle holes found by red team and war mode"),
  including the then-uncommitted `migrations/008_instagram.sql` and the
  Instagram handling in `src/index.js` / `src/lib.js` / `src/views.js`
- by the end of the session `src/index.js` had diverged again (stage-display
  polling, `STAGE_JS`). **Findings D1 and D7 below may already be under repair
  in that newer work — re-check them.** Everything else was still current.

Setup ran clean: `npm install`, `npm run db:local` (schema + all 8 migrations),
`.dev.vars` with a chosen `ADMIN_KEY`, `npm run dev`. The unique index,
`signup_hits` table and `contact_purged_at` column all landed correctly on a
fresh database. Driven with curl plus Playwright for viewport and CSP checks.

Zero unhandled exceptions were logged across the entire session.

---

# Defects, ranked by what they cost on a real night in front of fifty people

## D1 — Every sign-up error page turns itself into a bare "Not found." after 45 seconds

**Severity on the night: worst thing here.** It fires on precisely the paths the
hardening added.

- **Did:** POST `/retreat/join` and got rejected (throttle 429; the same applies
  to the duplicate-name and list-full responses). Left the page sitting open, as
  a person would.
- **Expected:** the friendly error stays on screen, or the page falls back to the
  sign-up form.
- **Happened:** the error is rendered at URL `/:slug/join` and carries
  `<meta http-equiv="refresh" content="45">`. 45 seconds later the browser issues
  a GET to `/retreat/join`. That path is only routed for POST, so it falls
  through to the catch-all and returns **HTTP 404, a page reading "Not found."**
  Confirmed in a real browser at 390x844 and directly: `GET /retreat/join` → 404.
- **Where:** `src/views.js:105` (the meta tag), `src/views.js:251`
  (`signupPage` passes `{ refresh: 45 }`), `src/index.js:581` (`join` is
  POST-only), `src/index.js:629` (catch-all 404).
- **On the night:** someone is told "Tonight's list is full" or "that is a lot of
  sign-ups from one phone". They pocket the phone. They pull it out two minutes
  later and the app says *Not found.* They conclude the QR sheet is broken and go
  and tell the host, in the middle of someone's set. With fifty people in the
  room, several will hit an error path, and every one of them ends up here.

## D2 — The two new host actions have no buttons. They cannot be reached from the dashboard.

**Severity: the feature is functionally absent.**

- **Did:** loaded the host dashboard and searched the served HTML for
  `rotate_link` and `purge_contacts`.
- **Expected:** two buttons.
- **Happened:** **zero occurrences of either.** The only actions rendered are
  `add`, `close`, `crew_add`, `done`, `down`, `jar`, `onstage`, `remove`,
  `reset`, `up`. Both new actions had to be exercised by hand-crafting POSTs.
- **Where:** handlers exist and work (`src/index.js:325` rotate, `src/index.js:336`
  purge) but `hostPage` (`src/views.js:467` onward) never renders them.
- **On the night:** the host who screenshotted the link into a group chat has no
  kill switch. The performer who says "delete my number" cannot be honoured
  without waiting a fortnight for the cron. The dashboard footer still says
  "Don't share it publicly" with no remedy offered if they already did.

## D3 — Pressing the privacy button makes email retention permanently worse

- **Did:** signed up "Optin Olive" with the label opt-in ticked and an email, then
  ran `purge_contacts`.
- **Expected:** contact details gone, or at minimum no worse than before.
- **Happened:** `phone` blanked, but `contact_email` still reads
  `olive@example.com` — and `contact_purged_at` is now stamped. The scheduled
  sweep filters `WHERE night < ? AND contact_purged_at IS NULL`, so **that row is
  excluded from the retention sweep forever.** Using the privacy control converts
  a 14-day email retention into an indefinite one.
- **Where:** `src/index.js:336-342` (purge blanks `phone` only, sets the stamp)
  vs `src/index.js:659` (sweep skips stamped rows).
- **On the night:** invisible. Off the night: it is the opposite of what the
  button claims, on data the sign-up form made a specific promise about.

## D4 — Every rejection wipes the whole form

- **Did:** submitted a sign-up that was rejected, then inspected the returned page.
- **Expected:** the name, phone, songs, Instagram and needs still filled in.
- **Happened:** all error paths re-render `signupPage` with a blank form; no
  `value=` repopulation anywhere. Confirmed `#name` is empty on the 429 page.
- **On the night:** someone in a dark pub retypes their name, mobile, handle and
  "I need a DI" from scratch after every knock-back. Compounds directly with D5.

## D5 — Failed and rejected attempts burn the throttle quota

- **Did:** sent four submissions with a blank name (each correctly returned "Put
  a name in so the host knows who to call up"), then one genuine sign-up.
- **Expected:** the genuine sign-up goes through — nothing succeeded yet.
- **Happened:** **429.** A person who has never successfully signed up is locked out.
- **Where:** `src/index.js:144` — `signupThrottled` runs first and
  `src/index.js:122-136` inserts a hit unconditionally, ahead of the
  `signups_open` check, the blank-name check, the capacity check and the
  duplicate check. A hit is also recorded on requests that are themselves being
  429'd, so someone impatiently re-tapping keeps their own rolling window full
  and extends their own lockout.
- **On the night:** the realistic sequence is duplicate-name error → retype →
  error → retype. Four fumbles and they are out for two minutes, on the one
  night they came to play.

## D6 — The throttle is per public IP, and a pub is one public IP

- **Did:** signed up six *different* people (different names, different phones)
  all presenting `cf-connecting-ip: 77.77.77.77`.
- **Expected:** six different people are six different sign-ups.
- **Happened:** four on, fifth and sixth **429** — "That is a lot of sign-ups
  from one phone", when it was their first ever attempt.
- **Where:** `src/index.js:110-111`, 4 per 120s keyed on the client IP.
- **On the night:** venue guest wifi NATs the whole room to one address, and
  Australian mobile carriers CGNAT heavily within a small geography. The intended
  usage pattern is *put the QR poster on the bar and let the room scan it*, which
  is exactly the pattern that trips this. The message also blames the punter for
  something the venue's router did. Partly mitigated: the copy does say "ask the
  host to add you", and the host's walk-in path is not throttled — but the host
  has to know that in advance.

## D7 — The poster's "Print this" button does nothing

- **Did:** clicked it in a real browser.
- **Expected:** print dialog.
- **Happened:** nothing. Console: *"Executing inline event handler violates the
  following Content Security Policy directive 'default-src 'none''… The action
  has been blocked."* The CSP set in `src/lib.js:68` has no `script-src`, and the
  poster uses an inline `onclick`.
- **Where:** `src/views.js:632`.
- **On the night:** low — this happens once, before the night, and Ctrl+P still
  works. But it is a visible dead button on the one page the venue is asked to use.

## D8 — The 16KB guard is bypassable with chunked transfer encoding

- **Did:** POSTed a 20KB body with `Transfer-Encoding: chunked` and no
  `content-length`.
- **Expected:** 413.
- **Happened:** **200, row created.** `src/index.js:519` reads `content-length`
  and defaults a missing header to `0`.
- **Impact:** low. `clean()` hard-caps every field so nothing bloats the row and
  nothing crashed. But "rejected before parsing" only holds for clients that
  choose to announce their size.

## D9 — The migration runner hides its own failures

- **Did:** ran `npm run db:local` twice.
- **Happened:** three `SQLITE_ERROR` lines scrolled past and the script reported
  success, because `db:migrate:local` ends each file with `|| true`. On a
  re-run those particular errors are benign, but a genuinely broken migration
  would deploy just as silently — including via `db:migrate:remote`.
- Related: `schema.sql` DROPs `performers` and `venues` but not `nights`, `crew`
  or `signup_hits`, so a re-run leaves orphan rows pointing at venues that no
  longer exist.

## D10 — The 14-day sweep silently deletes the label opt-in emails

The sign-up form asks people to tick a box to be "put forward to labels, bookers
and promoters". `scheduled()` scrubs `contact_email` for every night older than
14 days. After a fortnight there is no way to contact anyone who ticked it. Not a
crash — a product decision that quietly cancels one of the stated purposes of the
data. Worth confirming it is deliberate.

## Minor

- `rotate_link` redirects to `…?rotated=1` but nothing reads that parameter, so
  the host gets no confirmation and no prompt to re-bookmark. The page looks
  identical, and the bar tablet's old bookmark is now silently dead.
- Moving a performer from first to last needs N-1 separate button presses, each a
  full page reload. Fine at five acts, tedious at twenty on a bar tablet.
- `noshow` is a supported action with no button on the dashboard.

---

# What is solid

Every item below was tested and behaved correctly.

1. **Capacity in the INSERT.** Venue with capacity 3, six sign-ups: exactly three
   on, numbers 4-6 got "Tonight's list is full." Under 40 genuinely concurrent
   requests into a capacity-5 venue the table held at exactly 5. No crash, no
   blank page, no over-admission.
2. **Case-insensitive duplicate guard.** "Sam" on, then "sam", "SAM" and
   `"  Sam  "` all got the friendly *"…is already on the list. Talk to the host
   if that's not you."* at HTTP 200. Under 30 concurrent identical names: **one
   row, 29 friendly messages, zero 500s** — so the `UNIQUE` catch path is
   correctly matching real D1 error text, not just the application pre-check.
3. **Throttle mechanics.** Exactly 4 sign-ups allowed, the 5th returns HTTP 429.
   The message is plain English, tells the person to wait a couple of minutes and
   offers the host as an alternative. A normal single sign-up is completely
   unaffected.
4. **413.** A 20KB body with `content-length` is rejected with 413 and a readable
   page before any parsing. Just under 16KB still works normally.
5. **`rotate_link`.** Issues a fresh token and 303s to the new URL. The old URL
   returns 403 "Bad host link" for both viewing *and* acting; the new URL loads
   the full dashboard.
6. **`purge_contacts`.** Phone numbers blanked across the night, running order
   still renders all six acts in order, `needs` correctly preserved (the host
   still has to act on it tonight).
7. **`needs` visibility.** Signed someone up with distinctive needs text: 5
   occurrences on the host dashboard, **0** on the public sign-up page, **0** on
   the stage display, **0** on the poster. Phone numbers likewise host-only.
8. **`scheduled()` retention logic — correct, including the date arithmetic.**
   `cutoff = melbourneNight(now - 14 days)` and the sweep is
   `WHERE night < cutoff`, so it retains 14 full nights plus today; strictly-less
   is the conservative direction. I replayed the cron-time computation
   (15:30 UTC) across 400 consecutive days spanning both Melbourne DST
   transitions: the cutoff was exactly run-night-minus-14 on **every** one,
   0 discrepancies. The 5-hour night rollover lands the intermediate timestamp at
   ~20:30 local, nowhere near a date boundary, so the fixed-86400000ms arithmetic
   cannot slip. Both statements' columns validated against the live schema. (The
   cron was not triggered, per instruction.) The only problem with retention is
   D3, which is in `purge_contacts`, not in this handler.
9. **The ordinary night, end to end.** Five performers signed up; moved the
   first act to last (4 x "down", positions came out correct); marked an act on
   stage and the previously-on act auto-flipped to done; added a walk-in;
   recorded a jar of `$84.50`; closed sign-ups and the public page said so
   properly; stage display showed "On stage now / The Wombats / Next up: Kira";
   poster rendered a 280x280 SVG QR pointing at the right URL with the URL also
   printed in text. Drink token showed the correct 4-character code, "Mark as
   poured" worked and flipped to "Drink claimed. Hope it was cold." Jar split was
   $84.50 across 2 who played = **$42.25 each**, arithmetic correct, remainder
   left in the jar as designed.
10. **Phone viewport, 390x844.** Sign-up page: no horizontal overflow
    (scrollWidth == clientWidth), all inputs 16px so iOS will not zoom on focus,
    touch targets 48-52px. The 429 page: no horizontal overflow, the message sits
    122px from the top so it is the first thing seen, and the sign-up form is
    still present below it so the person can retry. Both read well.
11. Admin key rejection (403), unknown venue (404), and reserved slugs all behave.
    No unhandled exceptions in the whole session.

## Bottom line

The three hardening mechanisms themselves — capacity in the INSERT, the
case-insensitive unique index, the per-IP throttle — are correct, race-proof and
produce readable messages. The retention handler's logic and date arithmetic are
correct. The product still works end to end.

What is broken is the *edges around* the hardening: the error pages it produces
decay into a 404 (D1) and lose the form (D4), the throttle punishes people for
failing rather than for succeeding (D5) and cannot tell a pub's wifi from one
abusive phone (D6), and the two host controls that were supposed to make the
lifecycle manageable were never wired to a button (D2). Fix D1 and D2 before any
venue uses this in front of a room.
