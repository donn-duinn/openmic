# Prior art — what already exists

Researched 2026-07-29. This changes the strategy and should be read before any
more is built.

## The one-line verdict

**The sign-up sheet is a commodity. Two free, credible, operator-built products
already do it.** The product is the royalty claim, the crew ledger and the
venue reputation graph that the sign-up sheet generates as a by-product.

---

## Dead ground — do not lead with this

| Product | What it does | Price |
|---|---|---|
| **The List** (list.posterposter.app) | QR sign-up replacing the clipboard. Live running order, drag reorder, fairness randomiser, auto-recalculating slot times, countdown and "YOU'RE UP", 48h auto-delete, no account | **Free** |
| **Stagetime** (stageti.me) | Digital signups, drag lineup, bucket draw / points / signup-order lineup building, alternates, a points system that bumps skipped regulars, run-of-show clock | **Free forever** for hosts |

Stagetime is built by Bob Edwards, who owns Comedy Corner Underground in
Minneapolis and has run digital signups for twelve years. The List is by the
Poster Poster maker.

> **Correction, checked directly on 29 July 2026.** "Free forever for hosts" is
> now out of date. Stagetime's published pricing is: **open mics free,
> performers always free**, $0.35 flat per ticket on ticketed shows, plus à la
> carte items (marketing emails $2 + provider cost, box office books and custom
> email $5/mo). They also sell **"Set-Clip tapes"**, recordings of a performer's
> set, with **80% to the performer** minus card fees.
>
> Two consequences for this plan. First, they solved the sustainability question
> without charging the room for the free night, which is the same problem we
> have and is worth studying. Second, **sending performers a recording of their
> own set is already built and shipping over there**, so it can no longer be
> described as an unfilled gap. The site was showing 2 rooms live in Minneapolis
> at the time of checking, so the footprint is still small.

**We cannot out-feature or out-price either on sign-up alone, and should stop
trying.** Also saturated: open mic discovery and listings apps (several
launched and abandoned), venue-side booking marketplaces (Muzeek, GigPig), and
standalone tip jars (PickleJar, five years' head start).

What we still have that they don't: we are *in Melbourne*, in the rooms, and
neither of them is.

---

## The actual gap, confirmed

### 1. Sign-up → setlist → royalty report as one pipeline

**This is the idea. Nobody has built it.**

APRA AMCOS explicitly states you earn royalties for original songs played live
"at a pub, club, café **or open mic night**". That is their wording, not ours,
and it settles the question of whether open mics count.

Their own app has listed setlist creation and venue-database search as "coming
soon" since 2020. Six years.

The entire third-party competitive field is one GitHub repo with 2 commits and
1 star, which states outright that it organises reporting but does not file it.

**Correction, 2026-07-29, from APRA's own page.** An earlier draft said that a
promoter files for everyone at their event, and treated that as the best version
of the feature. It applies far more narrowly than that: APRA's *Promoted Events*
are major festivals, international tours and special events, which are licensed
differently from ordinary venues. A pub open mic is a standard live performance,
so each performer files their own report. Their advice where it is unclear is
that if nobody has asked you for a setlist, submit one yourself.

The feature is still worth building. It is just a tool for the performer, not a
lever for the promoter.

**On the "it's all covers" objection.** An adversarial review argued the feature
was near-worthless because open mic sets are mostly covers. Partly right: you
are only paid for your own songs. But APRA ask for covers on the report anyway,
so the writer gets paid, and they name open mic nights as eligible in their own
words. The feature serves originals players directly and every other songwriter
in the room indirectly.

### 2. Crew credits with pay tracking at pub-gig scale

Sound Credit does studio recording credits. Muzeek and GigPig do artist fees.
**The sound engineer and the door person are invisible in every product
surveyed.** We already built this last night.

### 3. Tip pool splitting across a running order

Tipping apps exist. Splitting a pool across a multi-performer night does not
exist anywhere. We built this last night too.

### 4. Artist-side venue reviews for Australia

**Indie on the Move** covers 11,124 venues with artist ratings in the US and
Canada, and is mature and alive. The model is proven.

**Nothing equivalent exists in Australia or the UK.** UK and AU searches return
only corporate event-space finders. Demand is documented and unmet on
r/WeAreTheMusicMakers, where "is there any interest in a site that shows you
info about venues" drew 142 upvotes.

---

## What this means for the plan

1. **Stop treating the sign-up tool as the thing.** It is the loss-leader and
   the data-capture mechanism. Say so internally. It also means the "give it
   away free" strategy is not generous, it is correct, because the market price
   is already zero.
2. **Reorder the roadmap.** The APRA pipeline moves from "nice later feature"
   to the primary product. Capture song titles at sign-up, not after the set.
3. **Build the performer's path, not the promoter's.** The promoter-files rule
   turned out to cover festivals and tours, not pub nights, so there is no
   shortcut through running the room. Corrected above.
4. **The venue reputation graph has a proven overseas model.** Indie on the Move
   validates it commercially. It also sharpens the conflict problem the
   teardown raised, and is the strongest argument for the not-for-profit
   holding it rather than donn personally.
5. **Look hard at The List and Stagetime before building another sign-up
   feature.** They have solved problems we have not thought of yet: fairness
   randomisers, points systems that bump regulars who got skipped,
   auto-recalculating slot times. Learn from them. AGPL means we could even
   contribute.

## Sources

- [The List](https://list.posterposter.app/open-mic)
- [Stagetime](https://stageti.me/open-mic-demo)
- [APRA AMCOS Performance Reports](https://www.apraamcos.com.au/resources/get-paid/performance-reports)
- [APRA AMCOS for Music Creators app](https://apps.apple.com/au/app/apra-amcos-for-music-creators/id1525159118)
- [Indie on the Move](https://www.indieonthemove.com/venues)
- [Sound Credit](https://soundcredit.com/) · [Muzeek](http://muzeek.com/) · [GigPig](https://www.gigpig.uk/)
- [Live-Performance-Royalty-Autopilot-n8n](https://github.com/karpit0499/Live-Performance-Royalty-Autopilot-n8n)
