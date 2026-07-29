# Stress test — what happens on a bad night

Tested against a **local** dev server (`wrangler dev`, port 8850) with a local D1.
Nothing here touched production.

- Commit under test: `d9ed9bd` — *"fix: the failures a stressed room actually hits"*
- `src/index.js` `eac88c32…`, `src/lib.js` `55e5cbc9…`, `src/views.js` `0e2c13b6…`
- Test venue: `duck` ("The Stressed Duck"), capacity 60, max 3 songs
- Method: `curl` + Python (threads, raw sockets, a 2s-latency TCP proxy).
  Playwright used only for the two things HTTP cannot answer — whether the stage
  screen goes blank, and whether the sign-up form loses typed input.

> **Note on a moving target.** A commit landed *during* this run (16:09). Early
> results were against the previous commit and have been discarded. Everything
> below is re-run against `d9ed9bd` and the tree was verified clean and unchanged
> at the end of the run.

---

## Ranked by what it does to a room of fifty people at 9pm

### 1. After a real rush, the host cannot reorder the list at all — the arrows are dead

**Severity: critical. This is the one that ruins the night.**

**What I did.** 50 concurrent sign-ups from one NAT address (the pub wifi), then
tapped the "↑" button on the 6th person ten times.

**What happened.** All 50 landed — but into **3 distinct positions**. 43 people
share `position = 3`, 6 share `position = 2`.

```
total=50  distinct_position=3  min=1  max=3
position 3 -> 43 people
position 2 -> 6 people
```

Then, ten taps of "↑":

```
before: Performer 03, Performer 06, Performer 07, Performer 02, Performer 08, Performer 04
after : Performer 03, Performer 06, Performer 07, Performer 02, Performer 08, Performer 04
target moved from index 5 to index 5
```

**Nothing moved. Ten taps, zero effect.**

**Why.** `src/index.js:276-278` computes the new position from a read that is not
in the same transaction as the write:

```js
const position = existing.length
  ? Math.max(...existing.map((p) => p.position)) + 1
  : 1;
```

The `INSERT` at `:289-313` guards *capacity* atomically and the unique index guards
*duplicate names* — both were clearly hardened already — but `position` is still
carried in from the racy read. Fifty concurrent requests all read a near-empty
list and all compute the same number.

Reorder then breaks as a direct consequence, at `src/index.js:489-506`: up/down
works by **swapping two rows' `position` values**. When both rows hold the same
value, both `UPDATE`s write that same value. It is a guaranteed no-op. The visible
order is being held up entirely by the `created_at` tiebreak in
`getPerformers` (`src/index.js:180-183`), which the arrows cannot influence.

**What this does to the room.** The host has 50 people in front of them, someone
has to go on early because they're on the door at ten, and the up arrow does
nothing. It doesn't error. It doesn't flash. The page just reloads unchanged. The
host taps it four more times, decides the app is broken, and runs the night off a
beer coaster. Every promise the poster made is now false.

**Also.** 43 of those 50 were redirected to `/duck?joined=3` and told
*"You're on the list — position 3."* Forty-three people were told they are third.

---

### 2. Every POST route has its error handling silently disabled

**Severity: critical, and invisible until it isn't.**

**What I did.** Sent a sign-up POST with a `content-length` header for the full
body but only half the bytes, then dropped the socket — a phone losing signal
mid-submit, which is the single most ordinary failure in a pub.

**What happened.** The client got **no reply at all** (timed out). The worker threw:

```
Error: Network connection lost.
    at async handleJoin (src/index.js:258:16)
```

The app's own handler — the friendly *"Something broke. Try again."* 500 page at
`src/index.js:756` — **never fired**. In dev this killed the wrangler process
outright, reproducibly, three times.

**Why.** `fetch()` wraps everything in `try { … } catch (err)`, but three routes
`return` a promise instead of awaiting it:

| line | route |
|---|---|
| `src/index.js:644` | `return handleAdminCreate(request, env, origin);` |
| `src/index.js:693` | `return handleJoin(request, env, venue);` |
| `src/index.js:739` | `return handleHostAction(request, env, authed);` |

In an async function, `return somePromise` inside `try` does **not** route the
rejection to that `catch` — the try block has already exited by the time the
promise settles. The fix is `return await` on all three.

That is: **sign-up, every single host action, and venue creation** — every
state-changing path in the app — currently have no error handling. The careful
`catch` block, the structured `console.error`, the friendly error page: all
unreachable for the routes that matter most. They work only for the GET routes,
which are the ones least likely to fail.

**What this does to the room.** On Cloudflare this surfaces as a raw platform
error page instead of "try again", so a performer on bad wifi gets a wall of
Cloudflare boilerplate and concludes the venue's sign-up is broken. Worse, it
means the observability the app thinks it has is not there: a host action failing
mid-gig logs nothing useful.

---

### 3. The sign-up form wipes itself every 45 seconds while people are typing

**Severity: high. Costs you sign-ups directly, and nobody will ever report it.**

**What I did.** Loaded `/duck` in a real browser, filled in name, phone, Instagram,
"needs", and ticked the opt-in — then waited.

**What happened.** At 45 seconds the page hard-navigated. Every field was empty
and focus was gone:

```
pageWasReloaded: true
nameNow:      ""      (was "Jordan McAllister-Whitfield")
phoneNow:     ""      (was "0412 345 678")
instagramNow: ""      (was "jordanmusicmelb")
needsNow:     ""      (was "borrowing a guitar, need a DI box")
optinNow:     false   (was ticked)
focusedElement: BODY
```

**Why.** `src/views.js:256` passes `{ refresh: 45 }` to `layout()`, which emits
`<meta http-equiv="refresh" content="45">` at `src/views.js:105`. That meta tag is
on the **same page as the sign-up form**. It is a full navigation, not a soft
update, so nothing is preserved.

**What this does to the room.** A pub is dark, it is loud, the person is nervous
and typing a long name one thumb at a time. Forty-five seconds is nothing. They
look up and the form is blank and the keyboard has closed. They do not think
"auto-refresh"; they think they did something wrong, or that it rejected them.
Some of them retype it. Some of them put the phone away and don't play. The people
most likely to be caught are the slowest typists — which skews against exactly
the people the project's own `/rights` page says it wants to bring in.

It also fires while the on-screen keyboard is open, which on iOS scrolls the page
out from under the thumb.

---

### 4. Fixing one letter in a name costs 15 taps and destroys the performer's details

**Severity: high. This is the most common request a host gets all night.**

**What I did.** Put 20 acts on a list. Act #7 signed up as "Siobhan Kavanaugh"
with act type, songs, phone, Instagram and stage needs. Corrected it to
"Siobhan Cavanagh".

**What happened.** **There is no edit function anywhere in the app.** No rename
action in `handleHostAction`, no edit button in `hostPage`. The only path is
delete-and-re-add:

```
before: {name: 'Siobhan Kavanaugh', act: 'duo', songs: 3, phone: '0400000007',
         instagram: 'act07', needs: 'need a DI', position: 7}

after : {name: 'Siobhan Cavanagh',  act: 'Walk-in', songs: 3, phone: '',
         instagram: '', needs: '', position: 21}

she is now at slot 20 of 20 (was 7)
taps: 2 + 13 up-taps = 15
```

Correcting a typo silently threw away her act type, her phone number, her
Instagram handle and her stage requirements, moved her from slot 7 to last, and
relabelled her a walk-in. Getting her back to slot 7 is another 13 taps.

Her sign-up cookie also now points at a deleted row, so her phone permanently
loses the "your drink / your share of the jar" panel — the fair-pay feature the
whole project is built around.

**What this does to the room.** A host correcting a spelling — a kind, thirty-second
courtesy — instead loses the performer's Instagram (the thing they signed up
*for*, per `migrations/008_instagram.sql`), their DI box request, and their slot.
The sound engineer doesn't get told about the DI. The performer sees themselves
demoted to last and assumes they were punished.

---

### 5. A walk-in going on next costs 20 taps; a non-adjacent swap costs 11

**Severity: high. This is the five-second test, and it fails.**

Measured on a 20-act list:

| Task | Taps | On 2s pub wifi |
|---|---|---|
| Someone did not show | 1 (but destructive — see below) | ~4s |
| Swap two **adjacent** slots | 1 | ~4s |
| Swap slots #3 and #9 | **11** | ~44s |
| Fix a misspelled name | **15** | ~60s |
| Walk-in needs to go on next | **20** | **~80s** |

`add` only ever appends (`src/index.js:436-438`, `position = max + 1`) and the only
movement primitive is a single-step swap. So the walk-in lands at slot 21 and has
to be walked up one slot at a time.

Every one of those taps is a separate `<form>` doing POST → 303 → full page
reload (`src/views.js:477-481`). The list re-renders from the top each time, so
**scroll position is lost on every single tap** — on a 20-act list the host has to
scroll back down to find the person again between each of the 20 presses.

**What this does to the room.** The band's mate has turned up with a guitar and
the host wants them on next. Eighty seconds of thumbing an up-arrow, re-scrolling
between each press, while a room waits and the act on stage finishes. Nobody does
this. The host puts them on verbally, the stage screen now disagrees with reality,
and the screen is what the room is looking at.

There is no "move to top", no "put on next", no drag, no "insert after".

---

### 6. Delete is one tap, unconfirmed, permanent — and the no-show button was never wired up

**Severity: high.**

The host's per-performer controls are `▶ ✓ ↑ ↓ ✕`. Confirmations on the page:

```
data-confirm="Clear tonight's entire list? This cannot be undone."   <- reset
data-confirm="Issue a new host link? …"                              <- rotate_link
(nothing on remove — 6 instances, one per performer)
(nothing on purge_contacts)
```

**The "did not show" button does not exist.** The backend supports it
(`src/index.js:480-487` handles `noshow`) and the stylesheet styles it
(`src/views.js:41`, `li.done,li.noshow{opacity:.42}`) — but `hostPage` never
renders a button for it. The feature was built and never connected.

So the host's only tool for "they're not here" is `✕`, which is
`DELETE FROM performers` (`src/index.js:459-464`) — one tap, no confirmation, no
undo, no soft delete. The person loses their slot, their jar share, their drink
claim, and the record that they were ever there. If they were just in the loo,
they have to sign up again from the bottom.

`✕` sits 6px from `↓` and is roughly 32px tall (`padding:9px 12px; font-size:.85rem`
at `src/views.js:73`), against the 44px minimum tap target both Apple and Google
publish. A destructive, unconfirmed, unrecoverable action is the smallest, most
crowded control on the page — pressed by a stressed person in the dark.

`purge_contacts` is the same shape and worse: unconfirmed, wipes every phone
number for the night, and sets `contact_purged_at` so the retention cron skips
those rows **forever**.

---

### 7. A mid-night "clear the list" locks the whole room out for two minutes

**Severity: medium-high — it turns one mistake into a much bigger one.**

**What I did.** 42 sequential sign-ups from one NAT address, then `reset`, then
tried to sign up again.

```
#40: /duck?joined=40
#41: /duck?e=rate
#42: /duck?e=rate

host taps "clear tonight's list", room re-signs:
  first person to re-sign:  /duck?e=rate
  a brand new name too:     /duck?e=rate
```

**Why.** `reset` deletes from `performers` (`src/index.js:399-404`) but leaves
`signup_hits` intact. The throttle counter does not know the list was cleared.

**What this does to the room.** The host clears the list — by accident, or
deliberately to start again — and now nobody in the building can sign up for two
minutes, while the screen behind the bar shows an empty list. The confirm dialog
added for `reset` helps with the accident; it does nothing about the recovery,
which is the part that's on fire.

---

### 8. Performer 41: it depends entirely on how they arrive, which is not a good property

**Severity: medium. Acceptable at the default capacity, a trap above it.**

The question was: 40 per 2 minutes per IP, everyone shares one NAT — what happens
at performer 41?

Measured, two different answers:

- **Tight burst (50 at once):** *all 50 get through.* `signupThrottled`
  (`src/index.js:214-224`) reads the count, and `recordSignup` (`:229-236`) writes
  the hit afterwards as a separate statement. Fifty concurrent requests all read a
  stale count, so the limit is never observed. The throttle does not hold under
  the exact condition it was written for.
- **Steady stream:** #41 is blocked, cleanly, and told
  *"That is a lot of sign-ups from this connection in a short time. Wait a couple
  of minutes, or ask the host to add you."*

**Is that acceptable?** For the default venue, yes. Default capacity is 40
(`schema.sql`), so a legitimate full house can never reach a 41st *successful*
sign-up — the throttle and the capacity limit bite at the same moment, and the
message points at the host, who can add people manually. That is a sound design.

Two caveats worth knowing:

1. **Any venue configured above capacity 40 has a live trap.** My test venue was
   capacity 60. Sign-ups 41-60 are legitimate and wanted, and a steady stream of
   them gets refused. Nothing at `/admin/new` warns the operator that setting
   capacity above 40 puts it in conflict with the throttle.
2. The race in (1) means the protection is softest exactly when load is highest.
   The abuse case this was written to stop — "200 sign-ups in 1.26 seconds", per
   the comment at `src/index.js:200` — is a *burst*, and a burst is precisely what
   slips through. I got 50/50 through in 0.33s.

The user-facing behaviour is good. The mechanism does not do what its comment says.

---

### 9. Two hosts, both tapping: the loser's act gets marked as already played

**Severity: medium — narrow window, but the failure is silent and skips someone.**

Different actions do not clobber each other. Device A marks someone on stage while
device B reorders: **both changes survived.** Good.

But when both hosts mark *different* people on stage at the same instant:

```
statuses: ['onstage', 'waiting', 'waiting', 'done', 'waiting', 'done']
simultaneously onstage: 1   (correct)
```

Exactly one person is on stage — the batch at `src/index.js:466-478` does that part
right. But the *losing* act was set to `onstage` and then immediately swept to
`done` by the other request's "clear the current onstage" statement. Band 6 is now
marked as having played, without playing.

**What this does to the room.** The co-host's tap doesn't just fail — it marks
someone as done. They drop out of the "still to play" count on the stage screen,
and they are excluded from nothing but included in the jar split
(`computeSplit` counts `done` as played, `src/index.js:151-164`), so the money is
split with someone who never went on. Requires two devices tapping within
milliseconds, so it is rare — but it fails toward "a performer is silently skipped",
which is the worst direction for this app.

---

### 10. Double-tapping "Put me on the list" works, but tells you it didn't

**Severity: medium — the data is right, the human is misinformed.**

Double submit is handled correctly at the data layer. Three variants, all clean:

```
simultaneous:  303 /duck?e=dupe  +  303 /duck?joined=1   -> 1 row
200ms apart:   303 /duck?joined=2 +  303 /duck?e=dupe    -> 1 row
back + resubmit: 303 /duck?e=dupe                        -> 1 row
```

The unique index from `migrations/007_abuse_guards.sql` holds. Never two rows.

But the *second* tap is the one the browser follows, and it produces:

- the message **"That name is already on the list. Talk to the host if that is not you."**
- and **no `set-cookie`** — `joinOutcome` (`src/index.js:252-254`) redirects without one.

```
tap1: /duck?joined=4   set-cookie=YES
tap2: /duck?e=dupe     set-cookie=NO
```

So the nervous double-tapper is on the list, but their phone doesn't know it. They
never see the "your drink / your share of the jar" panel for the rest of the night,
and they have been told, in effect, that someone else has their name and to go
argue with the host about it. On a busy night that is a queue at the host's elbow
made entirely of people who are already fine.

The fix is small: if the cookie's performer id already matches a row with that
name, treat it as success and re-issue the cookie.

---

## What held up well

These were genuinely tested and genuinely passed.

**The stage screen is excellent. It is the best thing in the codebase.**
Verified in a real browser: killed `fetch` for 30 seconds, then for 70 seconds,
then restored it and did not touch the screen.

```
t=0s   network dies   -> "ON STAGE NOW Stage Act 1 / Next up: Stage Act 2"   blank: false
t=15s  offline        -> unchanged                                            blank: false
t=30s  offline        -> unchanged                                            blank: false
t=42s  restored       -> unchanged                                            blank: false
        poll attempts during outage: 5   (it never stopped trying)

t=70s  offline        -> list still on screen, and honestly labelled:
                         "Reconnecting — list as at 16:21"

restored, screen untouched by any human, running order changed server-side:
  before: ON STAGE NOW Stage Act 1
  after : ON STAGE NOW Stage Act 3      <- recovered by itself in <13s
  "Reconnecting" banner cleared automatically
```

It never went blank, never showed a browser error, kept polling throughout, told
the truth about staleness only once the data was genuinely old, and healed itself
with nobody touching it. This is exactly what the comment at `src/index.js:29-34`
promises, and it delivers. The `visibilitychange` and `online` listeners mean a
slept bar tablet catches up instantly.

**POST-redirect-GET.** Every sign-up outcome is a 303. No "confirm form
resubmission" dialog, back button is safe, refresh is safe. All three double-submit
variants produced exactly one row. This was clearly a deliberate fix and it works.

**Capacity and duplicate-name guards are genuinely race-proof.** The capacity
check inside the `INSERT … WHERE (SELECT COUNT(*) …) < ?` and the unique index on
`(venue_slug, night, lower(name))` both held under 50-way concurrency. The comment
in `migrations/007_abuse_guards.sql` says guards belong in the schema where they
cannot be raced — that lesson was applied correctly here. It just wasn't applied
to `position`.

**Rotating the host link mid-night breaks nothing for performers.** Tested with a
signed-up performer holding a live cookie:

```
old host link -> 403     new host link -> 200
performer's sign-up page   -> 200, still sees her own panel
stage screen / stage.json  -> 200
a brand new performer      -> 303 /duck?joined=8
she can still claim her drink -> 303
```

Clean separation between the host credential and everything performers touch.

**Sequential reordering is correct.** 30 sequential up/down actions on a clean
12-act list: all 12 present, positions stayed distinct, order coherent. The logic
is right; it is only concurrency and pre-collided positions that break it.

**Two hosts on different fields don't clobber each other.** One marking onstage
while the other reorders — both changes survived.

**Truncated request bodies never produce a partial row.** The half-body POST wrote
nothing. Whatever else that path does wrong, it does not corrupt the list.

**Every hot query is index-backed. No table scans anywhere.**

```
venues     -> SEARCH USING INDEX sqlite_autoindex_venues_1 (slug=?)
performers -> SEARCH USING INDEX idx_performers_night (venue_slug=? AND night=?)
performers -> SEARCH USING INDEX sqlite_autoindex_performers_1 (id=?)
crew       -> SEARCH USING INDEX idx_crew_night (venue_slug=? AND night=?)
nights     -> SEARCH USING INDEX sqlite_autoindex_nights_1 (venue_slug=? AND night=?)
```

**The form is usable on a slow connection.** Measured through a real 2s-RTT proxy:

```
load sign-up page              2.03s   (13.2 KB)
submit the form (POST)         2.02s
follow redirect to confirmation 2.01s
total, open to "you're on":    8.07s
```

Eight seconds end to end, no blocking JavaScript, no external assets, no fonts, no
CDN. `ui.js` is 371 bytes and deferred. The page works with JS entirely off (only
the confirm dialogs are lost). For a pub with bad wifi this is the right
architecture. **The only thing that makes the form unusable on a slow connection is
the 45s refresh in finding 3, not the connection.**

**Oversized bodies are rejected before parsing** (`src/index.js:597-602`, 16KB cap).
**Reset now has a confirmation** — this was added in the commit that landed
mid-test, and `/static/ui.js` is served and loaded correctly on the host page.

---

## Load and cost: does the Cloudflare free tier hold?

**Measured inputs.** Stage screen polls every 10s (`setInterval(tick, 10000)`).
Sign-up page hard-refreshes every 45s (`content="45"`). Payloads:

| Path | Size |
|---|---|
| `/duck/stage.json` | 147 B |
| `/duck/stage` | 5,595 B |
| `/duck` (sign-up page) | **13,218 B** |
| `/static/stage.js` | 2,406 B |
| `/static/ui.js` | 371 B |

**Requests, 4-hour night, one venue.**

| Source | Calculation | Requests |
|---|---|---|
| Stage screen polling | 14,400s ÷ 10s | 1,440 |
| Stage page + assets | | 2 |
| 20 phones, page left open all night | 20 × (14,400 ÷ 45) | **6,400** |
| 20 phones, realistic ~30 min each | 20 × (1,800 ÷ 45) | 800 |
| Host page loads + actions | | ~150 |
| **Total, worst case** | | **~7,992** |
| **Total, realistic** | | **~2,392** |

**D1 rows read.** Every query is an index seek, so rows read ≈ rows returned.
With a 40-act list and ~4 crew:

- `stage.json` = venue (1) + performers (40) = **41 rows** → 1,440 × 41 = 59,040
- `/duck` = venue (1) + performers (40) + me (1) + crew (4) + night (1) = **47 rows**
  → worst case 6,400 × 47 = 300,800; realistic 800 × 47 = 37,600
- host page = 47 rows × 150 = 7,050

| | Rows read / night |
|---|---|
| Worst case | **~367,000** |
| Realistic | **~104,000** |

Rows written: ~50 sign-ups + ~50 throttle hits + ~200 host actions ≈ **300**.

**Verdict: yes, the free tier holds, with roughly 10x headroom.**

| Free tier limit | Worst-case usage, one venue-night | Headroom |
|---|---|---|
| Workers: 100,000 req/day | 7,992 | ~12 venues/night |
| D1: 5,000,000 rows read/day | 367,000 | ~13 venues/night |
| D1: 100,000 rows written/day | 300 | ~330 venues/night |
| D1: 5 GB storage | negligible | — |

Two things worth saying plainly:

**The stage screen is not the problem — it is 18% of requests and 16% of row
reads.** Four hours of 10-second polling is 1,440 requests, which is nothing.

**The sign-up page's 45-second meta refresh is 80% of requests and 82% of row
reads**, and it ships 13.2 KB each time (~84 MB per venue-night) to redraw a page
that mostly has not changed. It is the single largest cost in the system, and it
is the same mechanism that wipes people's typing in finding 3. Replacing it with
the pattern the stage screen already uses — poll a small JSON endpoint, patch the
list in place — would fix the form-wipe **and** cut total load by about 80%,
taking worst case to ~1,600 requests and ~70,000 rows read per night.

**Where it stops holding.** At the project's ~45-venue target, if a dozen venues
run on the same night (Tuesdays and Wednesdays are the standard open-mic nights,
so this is likely, not hypothetical), worst case lands at ~96,000 requests — right
on the Workers free limit — and ~4.4M rows read, right on the D1 limit. Fixing the
meta refresh moves that ceiling out by 5x and is the difference between the free
tier lasting and not.

---

## Summary

| # | Finding | Severity |
|---|---|---|
| 1 | Position collisions under concurrent sign-up; reorder arrows become a permanent no-op | **Critical** |
| 2 | Missing `await` on 3 POST routes disables all error handling for sign-up, host actions, admin | **Critical** |
| 3 | 45s meta refresh wipes the sign-up form mid-typing | High |
| 4 | No edit function; fixing a typo = 15 taps and destroys phone/Instagram/act/slot | High |
| 5 | Walk-in to next = 20 taps; non-adjacent swap = 11; scroll lost every tap | High |
| 6 | Delete is 1 unconfirmed permanent tap; the no-show button was built but never rendered | High |
| 7 | `reset` leaves throttle hits, locking the room out for 2 minutes | Medium-high |
| 8 | Throttle races under burst (50/50 through); traps any venue with capacity > 40 | Medium |
| 9 | Simultaneous onstage marks the losing act `done` — a performer is silently skipped and paid | Medium |
| 10 | Double-tap succeeds but shows "already on the list" and sets no cookie | Medium |

**The single highest-value fix is #1** — derive `position` in the `INSERT`
(`(SELECT COALESCE(MAX(position),0)+1 FROM performers WHERE …)`) exactly the way
capacity is already enforced two lines below, and make reorder assign a fresh
dense sequence rather than swapping two values. That one change is what stands
between a host and a running order they cannot control on the busiest night of
their week.

**The most alarming fix is #2**, because it is three keywords (`return await`) and
until it is done the app's error handling does not exist on any route that writes.

Everything about the stage screen, the redirect-after-post work, and the schema-level
race guards is genuinely well built and stood up to everything I threw at it. The
gaps are all in the *host's* hands at 9pm, and in one read-before-write that the
codebase had already learned to avoid everywhere else.
