# openmic, business plan

**A free sign-up and running-order system for open mic nights, built by a
Melbourne musician, given permanently free to venues.**

Live: <https://openmic.techduinn.dpdns.org>
Source: <https://github.com/donn-duinn/openmic>. AGPL-3.0. Documents: CC BY-SA 4.0.
Version 1.0, 29 July 2026. Author: Daniel Hogben (donn), Tech Duinn.

This document is public on purpose. Anyone may read it, quote it, or copy the
model for their own city. If you are assessing a grant, representing a venue,
sitting in a council or a parliament, or thinking about building something
similar, this is everything, including the parts that are unresolved.

---

## Contents

1. [Summary](#1-summary)
2. [Disclosure](#2-disclosure)
3. [The problem, with evidence](#3-the-problem-with-evidence)
4. [What is already built and live](#4-what-is-already-built-and-live)
5. [The economic argument](#5-the-economic-argument)
6. [Prior art, and what is genuinely unbuilt](#6-prior-art-and-what-is-genuinely-unbuilt)
7. [The standards this holds venues to](#7-the-standards-this-holds-venues-to)
8. [Roadmap, in stages](#8-roadmap-in-stages)
9. [How it sustains itself](#9-how-it-sustains-itself)
10. [Structure, licensing and governance](#10-structure-licensing-and-governance)
11. [Risks, and how each is handled](#11-risks-and-how-each-is-handled)
12. [Funding position](#12-funding-position)
13. [The first 90 days](#13-the-first-90-days)
14. [Open questions](#14-open-questions)
15. [How to help, or take this and run it yourself](#15-how-to-help-or-take-this-and-run-it-yourself)
16. [Putting this on the record: letters to every Australian government](#16-putting-this-on-the-record-letters-to-every-australian-government)
17. [AI cannot do live music, and what follows from that](#17-ai-cannot-do-live-music-and-what-follows-from-that)
18. [Who to get this in front of](#18-who-to-get-this-in-front-of)
19. [Gonzo engineering, and hiring the pattern](#19-gonzo-engineering-and-hiring-the-pattern)
20. [How this becomes normal, and why it cannot be one person](#20-how-this-becomes-normal-and-why-it-cannot-be-one-person)
21. [Sources](#21-sources)

---

## 1. Summary

**What it is.** A venue running an open mic puts a QR code on the bar.
Performers scan it, enter their name, and watch the running order update on
their own phone. The host gets one private link to reorder the list, add
walk-ins and mark who is on stage. A big-screen page shows the room who is
playing and who is next. No accounts, no app, no login for anyone.

**Who it is for.** The roughly 45 Melbourne rooms running open mics and
new-artist nights, and the several thousand performers who play them each year.

**What it costs a venue.** Nothing, permanently. There is no paid tier and no
plan to add one. The cost of running it is close to zero, and the market price
for sign-up software is already zero (see [section 6](#6-prior-art-and-what-is-genuinely-unbuilt)).

**Why it exists.** On 28 July 2026 more than fifty performers signed up for a
single night through an emailed link, with one person trying to keep order in
their inbox while running a room. That is not unusual, it is the norm. The
sign-up layer between a venue and a grassroots artist is a clipboard, a Facebook
comment thread, or a direct message.

**Why it is not just a sign-up sheet.** The running order is a by-product
machine. Once a system knows who played, where and when, it can do three things
nobody has built:

- Generate the APRA AMCOS performance report that routes unclaimed live
  royalties back to the performer.
- Credit and track pay for the sound engineer and the door person, who are
  invisible in every comparable product.
- Split a tip jar evenly across everyone who played, openly, so the split is
  visible to each performer.

**The position.** This is a not-for-profit-in-intent project, run by someone
inside the scene rather than selling into it. It does not seek to earn from the
tool. It seeks to make the fair path the easy path, and to be trusted enough
that the standing generates ordinary paid work elsewhere.

**Status.** Live, deployed, tested and in use for demonstration. Not yet
running a real night at a real venue. That is the next step, not a completed
one.

---

## 2. Disclosure

Stated plainly, at the top, because it should not be discovered later.

**I am a working Melbourne musician. I play these rooms. I want to run nights.
I may book people I meet through this system.**

That is the trade being offered to venues: the software is free forever, and
what I am asking in return is that they consider me when they are booking. It
is the way the scene already works, and it is only honourable if it is said out
loud. A venue or a performer who finds that out later would be right to feel
misled. So it is on the sign-up page, in the venue email, in the grant
applications, and here.

Two further disclosures:

- **I have not run an open mic night.** I have played a lot of them and watched
  them closely. Running a room is a skill I have observed, not practised. The
  first night I run will teach me more than any of this research.
- **Where this project does paid work for a venue** (a website, an audit), that
  is disclosed on that venue's entry in any published list, and it never affects
  how the venue is described. See [11.3](#113-conflict-selling-services-to-venues-this-project-also-describes).

---

## 3. The problem, with evidence

### 3.1 The sign-up layer is broken and nobody owns it

Compiled from Beat Magazine, Hard Knock Knocks, Melbourne10 and Yelp listings,
then corrected against primary sources (venue socials, liquor licence register,
direct pages) on 29 July 2026:

| Finding | Detail |
|---|---|
| Rooms confirmed running in 2026 | Six music open mics, thirteen comedy rooms, from an initial list of roughly 45 |
| Rooms found to be closed or moved | Five, struck from the list before any contact was made |
| Comedy rooms publishing a usable room email | **Three of roughly 26** |
| Every other way in | Facebook message, Instagram DM, Google Form, or a clipboard on the night |
| One room's method | A lottery on a Google Form that closes at 8pm the day before |

Hard Knock Knocks, the main Melbourne comedy listing site, tells comedians in
writing to *"reach out (probably via Facebook) before popping down."* That is
the gap, published by the sector itself.

### 3.2 It is a disorganisation problem, not a hostility problem

Most venues are not hostile to artists. They are small, busy and running on
paper. No records means nothing can be checked, so poor practice survives by
default and good practice goes unrecognised. A system that keeps a record makes
fair treatment the easy path rather than the effortful one.

This is supported by who actually owns these rooms. Cross-checking every target
address against the Victorian liquor licence register found that **effectively
none of the target venues are owned by a large pub group.** Each licensee holds
one or two licences. Not one is licensed to Australian Venue Co, ALH/Endeavour,
Open Door Pub Co or any other multi-venue operator. The entire target list is
owner-operator rooms, where the decision-maker is the publican or the promoter
and there is no head office to route through.

### 3.3 Performers do not know what they are owed

Musicians are, reasonably, busy being musicians. Very few grassroots performers
know:

- that Musicians Australia (MEAA) sets a **$250 per musician minimum fee** for a
  gig of three hours or less, endorsed for grant-funded gigs by the Victorian
  government among others;
- that APRA AMCOS distributes live performance royalties **by direct allocation
  to performance reports members file**, and that not filing means the money is
  shared among those who did;
- that pay-to-play, being required to pre-sell a ticket quota to keep a slot, is
  a practice they can refuse;
- that Support Act runs a free 24/7 wellbeing helpline for people in music, or
  that Rainbow Door exists.

All of that now sits inside the sign-up flow and on a `/rights` page, because
sign-up is the one moment fifty performers a night are already looking at their
phone and waiting.

---

## 4. What is already built and live

Cloudflare Workers and D1, APAC region, on the free tier. Server-rendered HTML,
no framework, no build step, so it loads on poor pub wifi and stays maintainable.
Three source files. Nights roll over at 5am Melbourne time so a gig running past
midnight keeps one running order.

| Page | Who it is for | What it does |
|---|---|---|
| `/:venue` | Performers | Sign up, see the live running order |
| `/:venue/stage` | The room | Big screen, now playing and next up, auto-refreshing |
| `/:venue/poster` | The host | Printable QR poster for the bar |
| `/:venue/host/:token` | The host | Private dashboard: reorder, walk-ins, on-stage, close sign-ups |
| `/rights` | Performers | Union floor, APRA, pay-to-play, Support Act, Rainbow Door |

Working today: sign-up with QR, host dashboard with drag reorder and on-stage
marking, stage display, printable poster, drink token for performers who played,
crew credits with pay tracking, tip jar split, label introduction opt-in
(unticked by default, with a plain-English collection notice), the rights page,
an Acknowledgement of Country and an inclusion statement.

Not finished: the APRA performance report generator (schema in place, generation
not built), a host-entered tip jar total, SMS "you are up in ten minutes",
host-editable venue settings, and an export of who played.

**Design constraints held deliberately:**

- **No accounts, for anyone.** A performer in a pub at 8pm will not create a
  login. A publican will not remember a password. Host authentication is a
  secret URL they bookmark.
- **Free means free.** The moment a venue receives an invoice, the trade is
  dead.
- **No framework.** It has to still work, and still be readable, in a year.

---

## 5. The economic argument

This section is the case to a councillor, an MP or a funding body. Every figure
is from a published source, listed in [section 16](#16-sources). It makes no
claim about any individual venue's tax affairs.

### 5.1 The money at a grassroots gig is at the bar, not the door

From the Victorian Live Music Census 2021-22 (Music Victoria), reporting 2019 as
the last normal year, for **small venues specifically**, the pubs and back rooms:

| Metric | 2019 |
|---|---|
| Shows | 48,120 |
| Patrons | 15.1 million |
| Total revenue | $1,189 million |
| Box office / entry | $141.2m (11.9%) |
| On-site spend (the bar) | $984.0m (82.7%) |
| Off-site spend | $64.5m (5.4%) |
| Shows with free entry | approximately 60% |

**For every dollar generated by a gig in a small Victorian venue, roughly 83
cents is spent at the bar and 12 cents at the door.** The venue captures the 83
cents. Where there is a door at all, the performers split the 12 cents, and in
about 60 per cent of shows there is no door.

The room is not doing the artist a favour by hosting a free gig. The free gig is
what fills the room.

Statewide, the same census put live music in Victoria at **$2.54 billion across
184,043 gigs in 1,076 venues**, supporting 9,165 full-time-equivalent jobs, with
32,048 Victorian songwriters.

### 5.2 The public revenue around those rooms, against what returns to music

Victorian Budget 2026-27:

| Stream | 2026-27 |
|---|---|
| Electronic gaming machine tax | **$1,567m** |
| All gambling taxes | approximately $2,900m |
| Liquor licence fees | $37m |
| Community Support Fund appropriation | $161.2m |
| **Contemporary music initiatives** | **$4.5m** |

Contemporary music receives **0.29 per cent** of the electronic gaming machine
take. The Community Support Fund alone is 36 times the contemporary music
allocation, and its own statutory purposes expressly include *"programs for the
promotion or benefit of the arts"*. The $4.5m is a single-year allocation with
nothing in the forward estimates.

This is not an argument that any other art form is overfunded. It is an argument
that grassroots contemporary music is funded as a rounding error inside a
portfolio dwarfed by the gambling revenue extracted from the same rooms where
the music is played.

### 5.3 Councils are doing more per dollar than the state

Local government has a rate cap of 2.75 per cent and is nonetheless the only
level of government running programs a grassroots music night can actually apply
for and win. Yarra puts $1.54m on the table across its community grants. Merri-bek
will fund an individual artist up to $6,000 with no auspicing required.

**The ask that follows, and it is not new money:** a line in council grant
guidelines confirming that *a recurring series of gigs that pays local artists*
is an eligible project, and that artist fees are an eligible cost. The existing
small and quick-response streams are almost the right shape already. They are
just not designed around a recurring night that pays other people.

### 5.4 Why fair pay is a supply argument, not only a fairness argument

This is the argument that moves a publican, because it is about their own
supply. An unpaid performer works a second job, practises less, and either
plateaus or quits. Most quit. The scene then complains there is no talent coming
through.

Pay the people playing your Tuesday, and in two years some of them are worth
putting on a Friday. Do not, and you are recruiting from a shrinking pool
forever.

---

## 6. Prior art, and what is genuinely unbuilt

Researched 29 July 2026. This section exists because a plan that ignores what
already works is not a plan.

### 6.1 The sign-up sheet is a commodity. Do not lead with it

| Product | What it does | Price |
|---|---|---|
| **The List** (list.posterposter.app) | QR sign-up, live running order, drag reorder, fairness randomiser, auto-recalculating slot times, countdown, 48h auto-delete, no account | Free |
| **Stagetime** (stageti.me) | Digital signups, drag lineup, bucket draw / points / signup-order lineup building, alternates, a points system that bumps skipped regulars, run-of-show clock. Now also ticketing, door, and recorded "set tapes" performers can sell | **Open mics free, performers always free.** $0.35 per ticket on ticketed shows, set-tape sales at 80% to the performer |

Stagetime is built by an operator who owns a comedy venue in Minneapolis and has
run digital signups for twelve years.

**Correction, verified 29 July 2026.** An earlier draft described Stagetime as
simply "free forever". It is more interesting than that: open mics and
performers are free, and the business is a flat $0.35 per ticket on ticketed
shows plus a cut of recorded set sales. Two things follow. First, they have
found a revenue model that does not charge the room for the free night, which is
worth studying rather than dismissing. Second, **they already sell performers
recordings of their own sets**, which is Stage 5 of this roadmap, built and
shipping. That is not a reason to abandon it, but any claim that it is novel here
is now wrong.

**This project cannot out-feature or out-price either on sign-up alone, and
should stop trying.** Also saturated: open mic discovery and listings apps,
venue-side booking marketplaces (Muzeek, GigPig), and standalone tip jars
(PickleJar).

What remains genuinely ours: being *in Melbourne, in the rooms*. Neither of the
two is here.

### 6.2 Sign-up to setlist to royalty report, as one pipeline

**Nobody has built this.**

APRA AMCOS states explicitly that royalties are earned for original songs played
live *"at a pub, club, café or open mic night"*. That is their wording, and it
settles whether open mics count. Their own app has listed setlist creation and
venue-database search as "coming soon" since 2020. The entire third-party
competitive field is a single GitHub repository with two commits.

The system already holds who performed, at which venue, on which date. The only
missing field is the song titles, and the fix is to ask for them at sign-up
while the performer is sitting there waiting, not after their set when they have
gone back to the bar.

**A material detail:** where a promoter organised the event, the promoter files
the report, not the performer. For nights this project runs, that means filing on
behalf of everyone who played, which is a far better version of the feature than
asking individuals to file.

**Corrected 2026-07-29, from APRA's own guidance.** Covers belong on the report
as well: the performer is not paid for them, the writer is, and omitting them
denies another songwriter the same money this project argues for. And the
promoter-files rule is narrow, covering *Promoted Events* such as major
festivals and international tours, not a pub open mic, so each performer files
their own. APRA writer membership is required to submit and be paid. Claims run
one year back as standard, three with evidence. Busking is excluded from 1 July
2026. We generate the report, the artist submits it, we never touch the money.

**Built and live at [`/apra`](https://openmic.techduinn.dpdns.org/apra)**, as a
standalone tool that needs no venue and no sign-up sheet. It runs entirely in
the browser, so no setlist ever reaches this server.

### 6.3 Crew credits with pay tracking

Sound Credit does studio recording credits. Muzeek and GigPig handle artist
fees. **The sound engineer and the door person are invisible in every product
surveyed.** Built here, with consent required before any credit is public and
pay status never published.

### 6.4 Tip pool splitting across a running order

Tipping apps exist. Splitting one jar evenly across a multi-performer night,
visibly, does not exist anywhere found. Built here.

### 6.5 Artist-side venue information for Australia

Indie on the Move covers 11,124 venues with artist ratings across the US and
Canada. The model is proven and mature. **Nothing equivalent exists in Australia
or the UK.** Australian searches return only corporate event-space finders.

This is the largest opportunity in the plan and also the most dangerous one. See
[11.2](#112-the-conflict-that-cannot-be-designed-away).

---

## 7. The standards this holds venues to

These are published industry standards, not this project's opinions. That
matters twice: it is more persuasive to a venue, and it is a far stronger
position if anyone ever objects to how they are described.

### 7.1 The benchmark for booked work

**$250 per musician, per performance, for a gig of three hours or less.** The
Musicians Australia (MEAA) minimum fee, set by member vote in 2021, derived from
the Live Performance Award's three-hour call provision (roughly $150 to $200
base plus $50 to $100 in allowances). Endorsed for grant-funded gigs by the
South Australian, Queensland, Western Australian, **Victorian** and ACT
governments.

**Honest caveat:** a fifteen-minute open mic slot is not a three-hour
engagement, and nobody sensibly claims $250 for two songs. The $250 floor
governs booked gigs. For open mics, the standards below apply instead.

### 7.2 What fair means at an open mic

| Standard | Why it is fair | How it is recorded |
|---|---|---|
| Performers who play get a drink, or its value | They brought an audience and filled the room for free | Yes / No, venue-set |
| The jar is split evenly and openly | Tips are for performers, not the house | Split shown to every performer |
| Slot times honoured within 30 minutes | People rearrange their night around it | Captured automatically by the system |
| No pay-to-play, ever | See 7.3 | Reported by performers |
| No cut of artist merch | The venue did not make the merch | Yes / No |
| A working PA and someone who can run it | It is a performance, not a karaoke machine | Yes / No |
| Written terms before the night | Verbal deals get forgotten in the venue's favour | Yes / No |

### 7.3 Pay-to-play, the practice worth naming

An artist is given tickets to sell, or required to pre-sell a quota, and only
gets paid, or only keeps their slot, if they shift enough. The financial risk of
promoting the night is shifted onto the least resourced party in the room. Where
they must buy the tickets up front, they can lose money by performing.

Fair alternatives, for contrast: a guarantee or a door split, whichever is
greater; a transparent door count the artist can see; door takings minus agreed,
itemised costs at a stated percentage; and costs disclosed in writing before the
night rather than deducted after.

### 7.4 The legal frame, briefly

- **Live Performance Award 2020 (MA000081)** covers live performance work where
  the musician is an employee. Most pub gigs are structured as independent
  contracting and therefore fall outside it, which is precisely why the union set
  a voluntary floor instead.
- **ABN withholding.** A business paying a contractor who does not quote an ABN
  must generally withhold 47 per cent. Relevant the moment this project pays acts
  for its own nights. That needs an accountant before the first payment, not
  after.
- **OneMusic Australia** handles venue music licensing, the joint APRA AMCOS and
  PPCA scheme. A venue hosting live music needs a licence.
- **Music Victoria's Best Practice Guidelines for Live Music Venues** is the
  sector's own standard. It is members-only, so it is not quoted here, but its
  existence matters: venues are being asked to meet a standard their own peak
  body already publishes.

---

## 8. Roadmap, in stages

Sequenced deliberately. Doing all of this at once is how it fails.

### Stage 1, built and live: the sign-up tool

Free to venues, permanently. Cost to run is effectively zero. What it buys is a
reason to walk in and a relationship with every host in town.

**Cap: five venues** until one of them has produced something real. Every venue
onboarded is a support queue owned personally and for free, competing directly
with the hours available to actually play and to build the rest.

### Stage 2: nights, run properly

Each venue taking the tool is asked for one thing, at some point: a night. Run
the night, book the acts, pay them, take a share of the bar.

This is the first income and it is also the proof. It is genuinely untested. The
bar-share figure has never been tested by me, and one real night will produce a
better number than any amount of modelling.

### Stage 3: the APRA pipeline

Ask for song titles at sign-up. Generate a ready-to-submit performance report.
For nights this project runs, file on behalf of everyone who played, using the
promoter-reports rule. This is the primary product, not a later feature.

### Stage 4: a public record of venues

The part that needs the most care, and see
[11.2](#112-the-conflict-that-cannot-be-designed-away) before reading it as
settled. Only two versions survive contact with reality:

- **A directory of automated, non-characterising facts with no league table.**
  What night, what time, is there a PA, was the advertised slot time met, is
  there a drink for performers. Facts the system captures passively, published
  without a verdict attached.
- **A ranked, opinionated directory published by someone who does not need
  bookings**, meaning a not-for-profit entity or a person who is not an active
  performer, not by me personally.

Whichever version, the method is published, every venue has a right of reply
published alongside, nothing rests on one person's word, and no venue can ever
pay to move.

### Stage 5: things that help performers improve

- Their own set recorded and sent to them. Most have never heard themselves play
  live.
- A running record of where and when they have played, useful for grant
  applications, bios and APRA reports.
- Aggregate, consented crowd response so an artist can see which songs held a
  room, non-identifying only, disclosed on a sign at the door. Note that
  recording conversation in a Victorian venue engages the **Surveillance Devices
  Act 1999**, so this stays to non-identifying aggregate signals (room volume,
  how many people stayed through a set, bar takings by half-hour from the venue's
  own point-of-sale) with the venue's written agreement before anything is
  installed.

**Explicitly not on the roadmap:** selling artist data to labels, paid placement
in any list, and a paid tier for venues.

---

## 9. How it sustains itself

### 9.1 The reframe that reorganises everything

> I don't want this to earn profit, only make me inside the culture and pay it
> forward.

That decision removes most of the original revenue model, and makes the rest
stronger:

| Originally considered | After the reframe |
|---|---|
| Selling artist data to labels | Gone. Opt-in introductions only, never a sale |
| Paid placement in a directory | Gone. It was always the weakest line |
| Controlling the narrative | Reframed: earn standing, do not buy it |
| Venue websites and audits | Kept, and firewalled from any published venue information |
| Artwork and merch for artists | Kept. Honest paid work |
| Running nights, share of the bar | Kept. Honest paid work, and new |

### 9.2 The honest tension

A plan that earns nothing is not noble, it is unsustainable, and burning out
helps nobody in the scene. Aether's read on this was blunt and correct: the real
cost here is hours, not money.

**The resolution:** the open mic layer is a gift, permanently and genuinely
free. Income comes from adjacent work that standing makes possible, and from
grants that pay for work that would otherwise be done free forever.

### 9.3 Income lines, honestly rated

| Line | Who pays | Timing | Confidence |
|---|---|---|---|
| Running nights, share of the bar | Venue | Now | Medium. Standard promoter deal, but untested by me |
| Band artwork and logos | Artists who want it | Now | High. Existing capability |
| Grant funding for the build and the nights | Public funders | This year | Medium. See section 12 |
| Merch design plus production margin | Artists | 3 months | Medium |
| Venue websites and audits (Tech Duinn's existing line) | Venues | 3 months | Medium, with the firewall at 11.3 |

`[ASSUMPTION]` Bar share on a promoted Melbourne night: needs a real figure from
one actual night before anything is modelled on it.
`[ASSUMPTION]` Band artwork price point: likely $150 to $400, untested.

### 9.4 Cost base

Hosting is effectively zero on Cloudflare's free tier and would remain trivial at
ten times the scale. The real costs, in order of size, are: hours, a custom
domain, trademark registration (a few hundred dollars per class), any SMS
functionality (per-message cost, which is why it is not built yet), and legal
advice before a public directory.

---

## 10. Structure, licensing and governance

### 10.1 Current structure, and the steps from here

Sole trader, Melbourne. **ABN 69 173 867 628.** Not a company, not incorporated,
not venture funded, not seeking to be.

That is a position, not a gap. The argument this project makes is that the
barrier to useful public-interest software has collapsed, and that the people
best placed to build it are the ones standing in the problem rather than the
ones who win the tender. A sole trader making that argument is the evidence for
it. A Pty Ltd making it is a pitch.

| Step | Status | Why |
|---|---|---|
| 1. ABN as sole trader | **Done.** ABN 69 173 867 628 | Enough to build, publish, and hold most creative grants |
| 2. Open licence before scale | **Done.** AGPL-3.0 code, CC BY-SA 4.0 documents | Prevents enclosure. Anyone running a modified service must publish source |
| 3. Public source and public plan | **Done.** This repository | Every ethical claim is checkable, not asserted |
| 4. Trademark the name with IP Australia | Not yet | Code is copyable by licence and by design. A name is not |
| 5. Legal advice on structure | Not yet | Publishing information about businesses, and holding personal data, is a liability question |
| 6. Not-for-profit incorporated association, if and when | Decision pending | The destination if one is needed. **Not** a Pty Ltd, which unlocks almost nothing here and closes some doors |

### 10.2 The incorporation question, answered honestly

The two largest and best-fitting funding opportunities are both open to a sole
trader exactly as things stand. **There is no funding case for incorporating in
the next six months.**

If a structure is eventually needed, the one that unlocks the most doors is a
**not-for-profit incorporated association** (Consumer Affairs Victoria), not a
Pty Ltd. A Pty Ltd unlocks almost nothing on the relevant funding list and
actively closes at least one council category, where for-profit arts
organisations are ineligible.

Incorporation is also a governance and liability question, not only a funding
one, and it is the cleanest answer to the conflict at
[11.2](#112-the-conflict-that-cannot-be-designed-away). It should be decided on
legal advice.

**A middle path** if a large council grant looks winnable: an auspice. A local
incorporated arts organisation or neighbourhood house holds the funds and takes
the reporting burden, typically for a 5 to 10 per cent administration fee.
Faster, cheaper and reversible.

### 10.3 Licensing, and why each choice was made

- **Code: AGPL-3.0.** Anyone may use, modify and run it. But anyone running a
  modified version as a network service must publish their source. That is the
  clause that matters. It stops a hospitality software company taking this,
  closing it, adding a subscription and selling it back to the venues it was
  given to. It does not stop a musician in Brisbane running their own copy for
  their own scene, which is the point. Changed from MIT on 29 July 2026, because
  MIT permitted exactly the capture this is designed to prevent.
- **Documents: CC BY-SA 4.0.** Reuse them, translate them, adapt them for Sydney
  or Perth. A fair pay standard that only one city uses is not a standard.
- **The name: trademark.** Code is copyable by design and by licence. A name is
  not. Registration with IP Australia is what actually prevents someone running a
  competing thing under this name and inheriting trust they did not build. **Not
  yet done**, and worth doing before any wider launch.
- **Deliberately not used: ethical source licences.** Hippocratic, Anti-Capitalist
  Software Licence and similar are appealing and a poor fit here. They are not
  OSI-approved, which makes the project ineligible for some grants and awkward for
  councils to adopt; they are largely untested in court; and they create legal
  uncertainty for exactly the small, well-meaning operators this wants reusing it.
  Values belong in the governance and the documents, not in an unenforceable
  clause.

### 10.4 Data and privacy

Performers hand over a name and a mobile number to get on a list at 8pm in a
pub. Under the Privacy Act, that is personal information collected for a stated
purpose. Using it for a different purpose without consent is both a breach and
the exact story that would end the artist-side position permanently.

The design:

1. A plain-English collection notice on the sign-up form.
2. A separate, unticked opt-in for industry introductions.
3. Anything published or shared externally is aggregate and de-identified by
   default. Individuals surface only if they opted in.
4. Artists can see and delete their own data.
5. Crew credits require consent, and pay status is never made public.

Consent-gated data is a stronger asset, not a weaker one. Three hundred artists
who actively want introductions is worth more than three thousand who never
agreed.

---

## 11. Risks, and how each is handled

### 11.1 The engagement risk, which is the most likely failure

The directory, the royalty feature and any scene dataset all depend on
performers reopening the app after their set to enter data. **They will not.**
They came to play two songs and have a drink.

**Handled by:** building only from what the system captures passively, and
asking for anything else (song titles above all) at sign-up, while they are
already sitting there waiting.

### 11.2 The conflict that cannot be designed away

**Rating venues while needing venues to book you cannot coexist.** This is not a
disclosure problem, it is arithmetic in a village where the bookers drink
together. Publish one honest negative rating and you become a person who might
publish about you.

**Handled by:** only the two survivable versions in
[Stage 4](#stage-4-a-public-record-of-venues), a directory of automated
non-characterising facts with no league table, or a ranked directory published
by an entity rather than by an active performer. This is the strongest argument
for the not-for-profit structure, and it was the founder's own instinct before
either external critique came back.

### 11.3 Conflict: selling services to venues this project also describes

Real, and it needs a firewall rather than a hand-wave.

**Rule: how a venue is described is never influenced by a commercial
relationship, and any venue this project does paid work for is disclosed on
their entry.** If that costs a website sale, it costs a website sale.

### 11.4 Defamation exposure

Australian defamation law favours plaintiffs, and a venue with money can sue
even where it would lose. The 2021 serious-harm threshold helps but does not
remove the risk.

**Handled by:** structured factual criteria rather than characterisation,
aggregation across multiple reporters, a published method, a right of reply,
prompt correction, retained records of every report, and a legal read before any
public directory. Also by the entity, rather than a person, holding it.

### 11.5 Being seen as venue-side

The moment artists believe this works for venues, the position is gone.

**Handled by:** published criteria, no paid placement ever, and the disclosure
at [section 2](#2-disclosure) stated up front rather than discovered.

### 11.6 Key person risk

This runs on one person being in the rooms. Illness, personal circumstances or
burnout stops it.

**Handled by:** a technical partner on infrastructure, documenting venue
relationships as they form rather than later, the five-venue cap, and the fact
that the whole thing is open source and documented well enough for someone else
to pick up (which is part of why this document exists).

### 11.7 Doing too much at once

A directory, a merch operation, a data product and five revenue lines is more
than one or two people can start. **Handled by:** the staging in section 8, and
by the explicit exclusions in the first 90 days.

### 11.8 Personal circumstances

Taking payment for running nights can interact with a person's own financial,
health or legal circumstances in ways that are specific to them. Anyone in that
position should get advice before the first paid night rather than after. The
specifics of the founder's situation are handled privately and are not this
document's business.

---

## 12. Funding position

Researched 29 July 2026, each entry read from the funder's own live page on that
date.

| Program | Amount | Closes | Sole trader eligible |
|---|---|---|---|
| **Music Works, Project Grants** (Creative Victoria via Music Victoria) | $10,000 to $40,000 | 2pm Wed 5 Aug 2026 | Yes |
| Music Works, Activation Grants | $5,000 | 2pm Wed 5 Aug 2026 | Yes |
| Creative Australia, Arts Projects for Individuals and Groups | $10,000 to $50,000 | 3pm Tue 1 Sep 2026 (register by 31 Aug) | Yes |
| Merri-bek Arts Projects Grant 2027, Individual Artists | up to $6,000 | 2 Sep 2026 | Yes, no auspice, must reside in Merri-bek |
| Yarra Community Grants 2027, Creative City | $4,001 to $40,000 | 28 Aug 2026 | Unverified, confirm with council |
| Darebin Community Grants 2026-27 Round 1 | not stated | 16 Aug 2026 | Unverified, confirm with council |
| 10,000 Gigs: The Victorian Gig Fund | TBA | "opening soon" | Venue-facing, a partnership play |
| Australian Cultural Fund | uncapped | always open | Yes. A DGR donation platform, not a grant |

**Best fit: Music Works Project Grants.** The stream funds *"strategic projects
which deliver broader artistic, business and sector outcomes such as industry
development, cross-industry collaboration, and innovative products, services and
technologies."* That last clause describes this project almost word for word.

**Realistic odds.** Council grants are oversubscribed by roughly two to one on
Darebin's own published figures. Councils also strongly prefer projects delivered
inside their own boundaries for their own residents, so a Melbourne-wide software
tool reads as out of scope. The reframe that fixes it: apply for **a specific
series of nights at named venues in that municipality**, with the platform as the
method rather than the deliverable. Creative Australia is national and across all
art forms, so expect low odds, and apply anyway because registration costs
nothing and peer feedback from a failed round is genuinely useful.

**The strongest long-term position is not a grant at all.** It is being the
system venues use to win and acquit gig-fund money. That builds the track record,
the venue relationships and the sector standing that make every later application
easier.

**One advantage worth stating:** this is already live and demonstrable, which
distinguishes it from applicants pitching an idea.

---

## 13. The first 90 days

**Days 1 to 14, prove it in one room**

- One venue live on the system, handed over in person rather than by email. That
  requires their suburb, night, host name and maximum songs per performer.
- Rate limiting, so a bored punter cannot fill a list with fake names.
- Submit or consciously skip Music Works, before 2pm on 5 August.

**Days 15 to 45, five venues and one night**

- Up to five venues running the tool. Not more, see the cap in Stage 1.
- One night booked and run. Record the actual bar-share figure.
- Song titles captured at sign-up, so the royalty pipeline has its input.

**Days 46 to 90, the artist side**

- Confirm with the VGCCC that paying local artists counts as a claimable
  community purpose, before approaching any club that funds through one.
- Two letters, not forty: one state MP and one ward councillor. Forty identical
  letters produce forty form responses.
- First APRA reports generated for a night actually run.
- First paid artwork jobs off relationships formed.
- Decide whether comedy or music is the better second market.

**Explicitly not in the first 90 days:** merch production, any data sale,
in-venue measurement, paid placement, and a public ranked directory.

---

## 14. Open questions

Listed because a plan that pretends to have no open questions is not honest.

1. **Comedy or music as the second market.** Comedy has sharper pain and around
   26 rooms running on direct messages. Music is where the bookings are.
2. **The existing Melbourne open mic Facebook directory** (roughly 8,000
   followers). Competitor, partner, distribution channel, or the person this
   should eventually be handed to. Worth a conversation before it becomes a
   competitor. Their operator has deliberately not been named anywhere in this
   repository, because the name could not be verified from a primary source.
3. **Structure.** Sole trader now. Not-for-profit incorporated association is the
   likely destination. Needs legal advice, not a guess.
4. **Whether the performer drink token is venue-funded or comes out of the
   promoter's share.**
5. **Contributor and partner stakes**, settled early and in writing, while it is
   still easy.

---

## 15. How to help, or take this and run it yourself

**If you run a venue.** It is free, permanently, and it takes about five minutes
to set up. You get a printable QR poster, a private host link, and a big-screen
page for behind the bar. In return I would like you to consider me when you are
booking, and that is the whole trade.

**If you perform.** Read `/rights`. If nothing else on this page ever matters to
you, the APRA point might be worth real money, and the Support Act helpline is
free and 24/7.

**If you are in another city.** Take it. The code is AGPL-3.0 and the standards
documents are CC BY-SA 4.0. Run your own copy for your own scene. That is not a
threat to this, it is the point of it. The only thing asked is that a modified
version running as a service publishes its source, per the licence.

**If you are a funder or a public representative.** The specific asks are at
[5.3](#53-councils-are-doing-more-per-dollar-than-the-state): make a recurring
series of gigs that pays local artists explicitly eligible in small grant
streams, and make artist fees an eligible cost.

**If you build software.** The two existing free products in this space, The
List and Stagetime, have solved problems this has not thought about yet:
fairness randomisers, points systems that bump regulars who were skipped,
auto-recalculating slot times. Learn from them. Under AGPL there is nothing
stopping contribution in either direction.

---

## 16. Putting this on the record: letters to every Australian government

The argument in [section 5](#5-the-economic-argument) and the ethics position in
[section 10](#10-structure-licensing-and-governance) are worth putting in front
of the people who write the rules. This section is the letter pack: a master
letter, and what changes for each of the nine Australian jurisdictions.

It is published here rather than kept private for the same reason as everything
else in this document. If the argument only works when nobody can check it, it
is not an argument.

### 16.1 The honest caution, first

Five real letters beat two hundred ignored ones. A mail-merge marks the sender,
and it marks them in a sector where the assessors and the advisers all know each
other. What follows is built to survive that objection: every letter carries a
paragraph that applies to that jurisdiction and nowhere else, and the ask
changes with it. **If any letter goes out with the LOCAL paragraph still
generic, it becomes exactly the thing this caution warns about.**

Three things must be true before the first envelope:

1. **The repository is public.** Done. It is at
   https://github.com/donn-duinn/openmic. Every claim rests on the source being
   inspectable, and it now is.
2. **The custom domain is live.** Done. Letters link to
   https://openmic.techduinn.dpdns.org, not a `workers.dev` address.
3. **Names are confirmed on the day**, from the jurisdiction's own current
   ministry list. Ministries change, and the Victorian creative industries
   portfolio in particular has been volatile. Addressing by portfolio title is
   always correct and never goes stale, so that is what these templates do.

### 16.2 The sole trader position, stated once

This paragraph appears in every letter and it is the spine of the approach. Do
not soften it. The steps behind it are in [section 10.1](#101-current-structure-and-the-steps-from-here).

> I am a sole trader. ABN 69 173 867 628. Not a company, not incorporated, not
> venture funded, not seeking to be. One musician with an ABN and a laptop.

Where a reader might reasonably ask what happens when this grows, include the
six-step table from 10.1. It shows a considered structure rather than an absence
of one, and it makes the point that there is no funding case for incorporating
in the next six months.

### 16.3 The master letter

One page. Everything in square brackets is filled in before sending. The
paragraph marked **LOCAL** is replaced from 16.4 below, and it is the only thing
standing between this and a mail-merge.

> [DATE]
>
> [ADDRESSEE]
> [ADDRESS]
>
> Dear [Minister],
>
> **Re: a worked example of AI used in the public interest, from a sole trader,
> and what I think it means for policy**
>
> I am a working musician in Melbourne and a sole trader. ABN 69 173 867 628.
> Not a company, not incorporated, not venture funded, not seeking to be. I am
> self-taught in AI and software: no degree, no formal training, no industry
> background. I mention all of that first because it is the point of this
> letter.
>
> Last month I watched more than fifty performers sign up for a single open mic
> night through an emailed link, with one person trying to keep order in their
> inbox while running a room. Using AI assistance, I built a free system that
> replaces it. It is live, it is open source, and it will always be free to
> venues and performers. I take nothing from it and I am not going to.
>
> It does more than run a list. It tells performers that the union minimum fee
> exists, which most have never heard of. It tells them APRA AMCOS may already
> owe them royalties for original songs they have played, money collected from
> venues that goes unclaimed because nobody told them to file. It splits the tip
> jar evenly and shows each person their share. It credits sound engineers and
> photographers by name, with their consent, and records whether they were
> actually paid.
>
> **LOCAL: [one paragraph, from 16.4]**
>
> I am writing because I think it is a useful worked example at a moment when
> the national conversation about AI is almost entirely about harm. Those harms
> are real. But the debate has very few worked examples of the other thing: AI
> used by an ordinary person to move value toward the people who have least of
> it.
>
> **What made it ethical was not the technology.** It was six constraints, every
> one verifiable in the public source rather than asserted in a policy document:
>
> 1. Consent is opt-in and off by default. No pre-ticked boxes, no bundling.
> 2. Data is never sold. Introductions happen only where a person asked for one.
> 3. Nobody is named without agreeing. Whether an individual was paid is never
>    published against their name.
> 4. The licence prevents enclosure. Anyone running a modified version as a
>    service must publish their source.
> 5. Only the minimum data is collected, and it is deleted on schedule.
> 6. A human made every judgement about what the thing is for.
>
> Those six cost nothing, are checkable by anyone, and would improve most
> publicly funded software regardless of whether AI touched it. I would put them
> forward as a condition of public funding for any AI-assisted civic software.
>
> **What AI did not do was have the idea.** It has never stood in that room. It
> did not know that fifty performers on an email link was a problem worth
> solving. Every decision that made this ethical rather than merely functional
> came from knowing what it is like to be on the wrong end of the arrangement.
>
> That is the policy point I would like to put to you: the question is not
> whether to fund AI, it is who gets to hold it. Funding a large vendor to build
> a platform for musicians produces a different object than funding a musician to
> build one. The second is far cheaper and, I would argue, far more likely to be
> used.
>
> [ASK: from 16.4]
>
> I am not asking for money in this letter. The thing is built and given away. I
> am asking whether the approach is of interest, and I would welcome the chance
> to show you how it works or to make a submission to any inquiry or
> consultation where it is relevant.
>
> Yours sincerely,
>
> **Daniel Hogben**
> Musician · self-taught AI and software practitioner
> Tech Duinn, sole trader · **ABN 69 173 867 628**
> [POSTAL ADDRESS] · [PHONE] · daniel.j.hogben@gmail.com
> https://openmic.techduinn.dpdns.org · source and full business plan:
> https://github.com/donn-duinn/openmic

### 16.4 What changes, jurisdiction by jurisdiction

For each: who to address, the LOCAL paragraph, and the ASK. **Confirm the
current officeholder from the linked list on the day of sending.** Address by
portfolio title if there is any doubt.

#### Commonwealth

**Address to, as two letters:** the Minister for Industry and Science (the AI
and technology portfolio), and the Minister for the Arts. Parliament House,
Canberra ACT 2600, or via the department's correspondence channel. Confirm names
at <https://www.pm.gov.au/> and <https://www.aph.gov.au/Senators_and_Members>.

**Also send to your own federal member.** A letter from a constituent is
processed differently from one from a stranger, and it is the only one with a
built-in reason to reply.

> **LOCAL.** The national AI conversation is being set right now, and it is
> being set mostly by organisations large enough to make submissions. I am one
> person with an ABN who used these tools to build something that gives money
> and information to musicians rather than taking it from them. If Australian AI
> policy is going to have examples of the public-interest case, they will have to
> come from somewhere, and I would rather they came from people who have built
> something than from people who have proposed one.

> **ASK.** Three things, in ascending order of difficulty. First, that the six
> constraints above be considered as a condition of public funding for
> AI-assisted civic software; they are cheap and checkable. Second, that
> disclosure of AI assistance in publicly funded software become a norm rather
> than a penalty, in the way research funding requires disclosure of method.
> Third, that grassroots cultural infrastructure be recognised as
> infrastructure: the open mic is where every funded artist in this country
> started, and it receives close to nothing.

#### Victoria

The home jurisdiction, and the only one where the local-relationship argument is
fully available. This should be the strongest letter of the nine.

**Address to:** the Minister for Creative Industries, and separately the
minister holding technology or the digital economy. Confirm at
<https://www.vic.gov.au/ministers>. **Also send to** your own Legislative
Assembly member and your ward councillor; verified electorate contacts are in
`ADVOCACY.md`.

> **LOCAL.** This is a Victorian project, built in Victoria, for Victorian
> venues and Victorian artists. The numbers make the case better than I can.
> Victoria will collect roughly $1.567 billion in electronic gaming machine tax
> in 2026-27, and all contemporary music in this state receives $4.5 million, a
> single-year allocation with nothing in the forward estimates. That is 0.29 per
> cent. In the same rooms where the gaming revenue is generated, Music
> Victoria's own census found that for every dollar a small-venue gig produces,
> roughly 83 cents is spent at the bar and 12 cents at the door, and about 60 per
> cent of those shows have no door at all. The musicians are the unpaid input to
> a taxed output. The Community Support Fund, at $161.2 million, already lists
> programs for the promotion or benefit of the arts among its statutory
> purposes.

> **ASK.** That the Community Support Fund's existing arts purpose be used for
> grassroots contemporary music, and that small and quick-response grant streams
> state explicitly that a recurring series of gigs paying local artists is an
> eligible project, with artist fees an eligible cost. That is a line in the
> guidelines, not new money, and it is the single change that would make the
> existing streams usable by the people they were written for.

#### New South Wales

**Address to:** the Minister for the Arts, and the minister holding customer
service and digital government, where NSW's AI assurance work has historically
sat. Confirm at <https://www.nsw.gov.au/nsw-government/ministers>.

> **LOCAL.** New South Wales has done more formal work than most jurisdictions
> on assuring government use of AI. My interest is the adjacent question that
> assurance frameworks do not reach: not how government uses AI itself, but what
> it funds other people to build with it. A framework tells a department how to
> procure safely. It does not tell a musician, a nurse or a community worker that
> they are now capable of building the tool their own sector needs. I am one
> worked example that they are.

> **ASK.** That whatever assurance or procurement framework currently applies to
> government AI be extended, in a lightweight form, to AI-assisted software that
> government *funds*, using the six constraints above as the checklist. And that
> a small grant stream exist for open-source civic tools built by people inside
> the sector they serve, judged on whether the thing works rather than on the
> capability of the applicant.

#### Queensland

**Address to:** the Minister for the Arts, and the minister for innovation or
the digital economy. Confirm at
<https://www.qld.gov.au/about/how-government-works/government-structure>.

> **LOCAL.** Queensland's live music sector is geographically spread in a way
> Melbourne's is not, and that is exactly the case for tools like this one. A
> system that costs nothing to run and nothing to adopt works the same in Cairns
> as it does in Fortitude Valley, because there is no sales process, no licence
> and no account to create. The licence is deliberately chosen so that a
> Queensland musician can take this today, run their own copy for their own
> scene, and owe me nothing. I would rather that happened than that I ran it for
> them.

> **ASK.** That regional and outer-metropolitan live music programs consider
> free, open-licensed tooling as eligible project infrastructure, and that any
> Queensland musician or organisation wanting to run their own copy of this be
> pointed at it. It is licensed so that they can, at no cost and without asking
> me.

#### Western Australia

**Address to:** the Minister for Culture and the Arts, and the minister for
innovation and the digital economy. Confirm at
<https://www.wa.gov.au/organisation/government-of-western-australia/ministers>.

> **LOCAL.** Western Australia endorsed the Musicians Australia minimum fee for
> grant-funded gigs, alongside Victoria, South Australia, Queensland and the
> ACT. That endorsement is one of the two facts this project stands on, because
> it means the standard I am putting in front of performers is not my opinion. It
> is the union's floor, endorsed by their own government. The gap I found is that
> almost nobody at the grassroots knows it exists, and there is no moment in the
> ordinary course of a night when anyone tells them.

> **ASK.** That the state's endorsement of the minimum fee be made visible at
> the point where artists actually encounter it: in grant guidelines, in
> venue-facing programs, and in any funded live music initiative. An endorsement
> nobody at the bottom of the sector has heard of is doing less work than it
> could.

#### South Australia

**Address to:** the Minister for Arts, and the minister for innovation or
industry. Confirm at <https://www.premier.sa.gov.au/> and <https://www.sa.gov.au/>.

> **LOCAL.** South Australia was among the first states to endorse the Musicians
> Australia minimum fee for grant-funded gigs, and has an unusually strong track
> record of treating live music as a policy area rather than an afterthought. The
> problem I am describing sits below the level most of that policy reaches: not
> the ticketed room or the festival, but the Tuesday night open mic where the
> next decade's artists are currently playing for nothing and being told nothing.

> **ASK.** That grassroots and unticketed live music be treated as a distinct
> policy object rather than the bottom of the festival pipeline, and that any
> state live music program require, as a condition, that participating venues
> meet a published minimum standard for how performers are treated. The standards
> this project uses are published, sourced entirely to the union and the award,
> and free for any government to reuse under CC BY-SA 4.0.

#### Tasmania

**Address to:** the Minister for the Arts, and the minister for science and
technology or the digital economy. Confirm at <https://www.dpac.tas.gov.au/>.

> **LOCAL.** Tasmania's scene is small enough that a tool like this could cover
> most of it within a year, and small enough that the cost of the alternative, a
> procured platform, could never be justified. That is the argument in miniature.
> A free, open-licensed system built by someone in the sector is not a
> second-best version of a proper platform. For a jurisdiction this size it is
> the only version that will ever exist, and it already does.

> **ASK.** That Tasmania consider a very small grant stream, in the order of a
> few thousand dollars, for open-licensed civic and cultural tools built by
> people inside the sector. At that scale the assessment question is simply
> whether the thing exists and works, which is cheap to answer and produces
> public assets that cannot be enclosed later.

#### Australian Capital Territory

**Address to:** the Minister for the Arts, and the minister holding digital or
economic development. Confirm at <https://www.cmtedd.act.gov.au/>.

> **LOCAL.** The ACT endorsed the Musicians Australia minimum fee for
> grant-funded gigs, and is also the jurisdiction where national policy is
> written. That combination is why I am writing to the Territory separately
> rather than folding it into a federal letter. The people who set the national
> conversation about AI live in a city with its own grassroots music scene,
> running on the same clipboards as everywhere else. It is a short walk to a
> worked example.

> **ASK.** An invitation more than an ask: if there is a Territory or federal
> consultation, inquiry or roundtable on AI in the public interest, on creative
> industries, or on artist pay, I would like to make a submission or appear. I
> have built the thing, given it away, and published the plan and the source. I
> can speak to what it actually took rather than to what it might take.

#### Northern Territory

**Address to:** the Minister for the Arts, and the minister for business or the
digital economy. Confirm at <https://nt.gov.au/>.

> **LOCAL.** I want to be careful here, because the Territory's music sector is
> substantially a First Nations sector, and I am not going to pretend a tool
> built for a Melbourne pub transfers unchanged to communities I do not know. It
> may not transfer at all. What I can offer is the code, under a licence that
> lets anyone take it and change it without asking me, and the standards
> documents under a licence that lets them be rewritten for a context I am not
> qualified to write for. If that is useful to an organisation up there, it is
> theirs. If it is not, I would rather be told than assume.

> **ASK.** That this be passed to any Territory music or arts organisation for
> whom it might be useful, on the understanding that they own whatever they make
> of it. I am not seeking to operate in the Territory. I am offering the parts.

### 16.5 Sending, in order

Do not post nine letters in one day. The sequence matters more than the volume.

1. **Victoria first, and your own federal member.** The two with a genuine local
   claim, and the two most likely to produce a real reply rather than an
   acknowledgement. Wait for what comes back.
2. **Adjust from the first replies.** A real response tells you which paragraph
   landed and which did not, which is worth more than the other seven letters
   combined.
3. **Then the Commonwealth arts and industry ministers.**
4. **Then the remaining states and territories**, one a week, not all at once.
5. **Look for open consultations and inquiries throughout.** A submission to a
   live inquiry is public, permanent, and reaches more people than any letter.
   That is where this argument does the most work.

Log every send: date, jurisdiction, addressee title, name used, channel, and any
reply. Keep that log private, not in this repository.

### 16.6 Checklist before the first envelope

- [x] Repository public at https://github.com/donn-duinn/openmic. Keep checking
      for anything that should not be in it
- [x] Custom domain live at https://openmic.techduinn.dpdns.org. Check every URL
      in the letter points at it
- [ ] Postal address and phone filled in
- [ ] ABN correct in both the opening paragraph and the signature block
- [ ] Current officeholder confirmed on the day, from the jurisdiction's own list
- [ ] The LOCAL paragraph actually replaced, in every single letter
- [ ] At least one venue running a real night, if you can bear to wait for it.
      "Three Melbourne venues use this every week" is a far stronger sentence
      than "I built this and it works"

---

## 17. AI cannot do live music, and what follows from that

This is the strategic argument underneath the whole project, and it is the one
worth putting to a funder, a minister or a room full of musicians who are
reasonably suspicious of anything with AI in the sentence.

### 17.1 The one thing the models cannot supply

A generative model can produce a song. It cannot stand in a room on a Tuesday
and be the person who might fall over. Live performance is presence, risk, a
specific night, and the fact that the people watching know a human is doing it
in front of them. That is not a feature gap that closes with a bigger model. It
is what the thing is.

**Corrected after review, and the correction matters.** That claim is true
ontologically and load-bearing for nothing economically. Nothing obliges an
audience to want presence. Pubs already substitute recorded music, DJs and
poker machines for live bands, and synthetic performers sell out rooms
elsewhere. Presence is a preference, not a moat, and a flood of cheap content
is precisely the thing that moves preferences. The 83-cents-at-the-bar figure
in section 5.1 proves it from the other side: the venue is buying atmosphere,
not presence, and atmosphere has substitutes.

**The defensible version, which is what this project actually built:** AI
cannot supply the thing, the thing is already underpriced, so the useful
intervention is at the payments layer rather than the production layer.

Everything else in music is now reproducible at close to zero marginal cost.
Live is the one part that is not.

### 17.2 What follows, and why it is not automatically good news

As recorded music floods, the scarce thing becomes the room. On paper that
should push value toward performers. In practice it does not, because the
economics of the room have not changed: roughly 83 cents in every dollar a small
Victorian gig generates is spent at the bar, about 12 cents at the door, and
around 60 per cent of small-venue shows have no door at all (see
[section 5.1](#51-the-money-at-a-grassroots-gig-is-at-the-bar-not-the-door)).

So the artist absorbs the loss on the recorded side and captures little of the
gain on the live side. The flood devalues the thing they used to sell while the
thing they cannot be replaced at still pays them in drink tokens.

**The conclusion:** the useful application of AI here is not making music. It is
removing every hour of unpaid administration that stands between a musician and
the room, and moving money that already exists back toward them.

### 17.3 What AI should actually do for a working artist

Every item below is either built, half-built, or a direct extension of data the
system already holds. None of it involves generating music.

| Use | What it replaces | Status |
|---|---|---|
| **Generate the APRA performance report** from who played, where, when and what | An artist never claiming royalties the venue's licence fee already paid for | Half-built. The flagship |
| **Turn a recording of a set into a song list** so the setlist is captured without anyone typing it after the gig | The reason nobody files: admin at 11pm | Extension. Consent required, see 17.5 |
| **Send performers their own set recording** | Most have never heard themselves play live | Roadmap, Stage 5 |
| **Draft a bio, a gig history and grant-application answers** from a real record of where they have played | The single biggest barrier to grassroots artists getting funded is writing, not merit | Extension, and probably the highest-value item after APRA |
| **Explain a venue's offer in plain English**: what is missing, whether it is pay-to-play, whether the merch cut is normal | Rights literacy at the exact moment of the decision, instead of a page nobody visits | Extension of `/rights` and `CONTRACTS.md` |
| **Run the room's admin**: reminders, no-shows, running-order changes, who is up next | The host's unpaid hours, which is why hosts burn out | Partly built |
| **Aggregate which songs held a room**, non-identifying and consented | An artist guessing at what works | Roadmap, Stage 5, with the Surveillance Devices Act caveat |
| **Accessibility**: captions on the stage screen, the running order readable by screen reader, translation | Nothing. This is currently just absent | Not built |

The pattern is consistent: **the machine does the paperwork, the memory and the
matching. The human does the performance.** Every one of these takes hours back
from an artist or a host, or moves money that already exists in the system
toward the person who earned it.

### 17.4 The gaps big tech will not fill, and why

This matters because the obvious objection to a sole trader building anything is
"why hasn't a real company done this". The answer is not that nobody thought of
it. It is that each gap is structurally unattractive to a large company, and
each reason is durable rather than a temporary oversight.

| The gap | Why a large company will not take it |
|---|---|
| Filing royalty claims for grassroots performers | The addressable revenue is a few hundred dollars a year per artist, and the platform can never take a cut without becoming the thing it is fixing |
| Naming venues that treat artists badly | It requires taking the artist's side against a paying customer. Any company selling to venues cannot do it, and every company in this space sells to venues |
| Anything requiring someone to be in the room | The knowledge is hyper-local, unglamorous and does not scale. You cannot buy it, you have to be at the Tuesday night |
| Crediting the sound engineer and the door person | No revenue attached at all. They are the least monetisable people in the building |
| Free forever with no upsell | It is not a business model. It is only sustainable if nobody is trying to make it one |
| Consent-first, no data sale | The value of a scene dataset to an acquirer is precisely the part we have permanently given away |
| A market of roughly 45 rooms in one city | Below the floor where a funded team's time is worth spending |

**What a one-person operation has instead:** no revenue target, no acquirer to
please, no sales team whose commission depends on the venue being happy, and a
cost base low enough that 45 rooms is a viable size rather than a rounding
error. Running costs are effectively zero on a free tier. The constraint is
hours, not capital, which inverts the usual advantage.

That is the honest competitive position. Not "we can outbuild them", but "the
things worth building here are the things they are structurally unable to
touch".

### 17.5 Red lines

Published, so they can be held against this project later:

1. **No AI-generated music, ever, on or through this platform.**
2. **No synthetic performer** appears in any running order, listing or record.
3. **No AI judgement of artistic quality.** The system records facts about how
   artists are treated. It does not rate performances.
4. **No performance recording is used as training data**, by anyone, without the
   performer's explicit, separate, opt-in consent. Silence is not consent, and a
   bundled tick box is not consent.
5. **Recordings belong to the performer.** They are made for that person, sent
   to that person, and deleted on schedule.
6. **AI never makes a decision about a person.** Not who gets a slot, not who
   gets credited, not who is put forward for anything.

These sit alongside the six constraints in
[section 16.3](#163-the-master-letter) and are checkable in the source, which is
the only reason to state them.

### 17.6 The line for a minister

> AI cannot do live music. So fund the AI that does the paperwork around live
> music, not the AI that makes music.

---

## 18. Who to get this in front of

Verified 29 July 2026, in the order they should be approached. Anything not
confirmed from a primary source on that date is marked **UNVERIFIED** and must
be checked before it is used.

### 18.1 Sector bodies, first and highest value

| Who | Why them | Contact (verified 29 Jul 2026) |
|---|---|---|
| **Music Victoria** | Delivers Music Works, publishes the Best Practice Guidelines this project asks venues to meet, and is the peak body for exactly this sector. Time-critical: the Music Works enquiry and the 5 August deadline | `info@musicvictoria.com.au` · (03) 9686 3411 · membership at musicvictoriamembers.com.au |
| **APRA AMCOS** | The partnership that makes the flagship feature real. They have listed setlist tools as "coming soon" since 2020. This is not competing with them, it is feeding them correctly formatted reports from artists who currently file nothing | `writer@apra.com.au` (writer membership and services) · `worksreg@apra.com.au` (works registration) |
| **Victorian Music Development Office (VMDO)** | Sector development arm, the natural home for a free tool being offered to Victorian venues | `info@vmdo.com.au` |
| **Music Australia** (within Creative Australia) | The national body for contemporary music, and the route to national rather than Victorian standing | (02) 9215 9000 · Level 5, 60 Union St, Pyrmont NSW |
| **Musicians Australia / MEAA** | The $250 floor is their number. This project puts it in front of performers who have never heard of it. Worth telling them that, and worth asking whether they want to be cited more prominently | `members@meaa.org` · 1300 656 513 |
| **Support Act** | Their helpline is already surfaced on `/rights`. Tell them, so they know where their number is appearing and can correct anything | `admin@supportact.org.au` · Wellbeing Helpline 1800 959 500 |
| **Rainbow Door** | Also surfaced on `/rights`, same reason | **UNVERIFIED** this session. Confirm from their own site before contact |

**Approach order:** Music Victoria first, because of the deadline. APRA second,
because it is the only conversation that could change what gets built. The rest
are cheap goodwill and take ten minutes each.

**What to send them:** not the letter from section 16. Send a short note, a link
to the live site, and a link to this plan. These are people who will read the
plan.

### 18.2 The other states' music peak bodies

Every state and territory has a Music Victoria equivalent. They are the sector
counterpart to the letters in [section 16](#16-putting-this-on-the-record-letters-to-every-australian-government),
and they are a far warmer audience than a minister's office: they exist to do
precisely what this project does, and none of them has a tool like it.

Send these the plan and the link, not the ministerial letter.

| Body | Contact (verified 29 Jul 2026) |
|---|---|
| **QMusic** (Qld) | `info@qmusic.com.au` · also `partnerships@qmusic.com.au` and `programming@qmusic.com.au` |
| **MusicNSW** | `adele@musicnsw.com` (published on their contact page; a named staffer, so check it is still current) |
| **Music SA** | `info@musicsa.com.au` |
| **WAM, West Australian Music** | `hello@wam.org.au` |
| **MusicNT** | `info@musicnt.com.au` · `liz@musicnt.com.au` |
| **MusicACT** | `info@musicact.com.au` |
| **Music Tasmania** | **UNVERIFIED.** Their contact page did not yield an address by automated retrieval. Check by hand |

**Why these matter more than they look.** A free, open-licensed tool that any of
them can hand to their own venues, at no cost and without asking permission, is
the easiest yes in this document. It costs them nothing, it makes them useful to
their members, and the AGPL means they can run their own copy if they would
rather not depend on a bloke in Melbourne. Say that explicitly when you write.

### 18.3 Unions and worker organisations

The user-facing argument of this project, that the people doing the work are the
ones not being paid, is an argument these organisations already hold. This is the
warmest room in the whole document.

| Who | Why them | Contact (verified 29 Jul 2026) |
|---|---|---|
| **Musicians Australia / MEAA** | The $250 floor is their number and this puts it in front of performers who have never heard of it. They are the single most aligned organisation in Australia | `members@meaa.org` · 1300 656 513 |
| **Victorian Trades Hall Council** | The peak body for Victorian unions, and, usefully, a live venue in its own right that hosts comedy and music. Both a values ally and a potential room | `info@vthc.org.au` · (03) 9659 3511 |
| **United Workers Union** | Covers hospitality. The bar staff at every one of these venues are their members, and a night that runs properly is better for them too | State inboxes confirmed on the pattern `nsw@`, `qld@`, `sa@`, `tas@`, `nt@`, `act@unitedworkers.org.au`. **Victoria inferred as `vic@unitedworkers.org.au`, not confirmed** · Melbourne office (03) 8677 9876 |
| **ACTU** | Only if the argument goes national and needs a peak-of-peaks endorsement. Low priority, high effort | **UNVERIFIED** |

**What to say to a union.** Not "please promote my app". The pitch is: here is a
piece of free infrastructure that carries your minimum fee, your campaign against
pay-to-play, and your existence, to a population of workers who are not in your
union and have mostly never heard of it. Ask whether they want to be cited more
prominently, and whether anything on `/rights` misstates their position. That is
a question they can only answer by looking, which is the point.

### 18.4 Civic tech, digital rights and equity organisations

This is where [section 17](#17-ai-cannot-do-live-music-and-what-follows-from-that)
and [section 19](#19-gonzo-engineering-and-hiring-the-pattern) land, and where
"put us on the map" is most achievable, because these organisations actively
look for worked examples and have almost none involving a sole trader.

| Who | Why them | Contact (verified 29 Jul 2026) |
|---|---|---|
| **Code for Australia** | Melbourne-based civic tech. This is their entire thesis, built without them, which is either flattering or annoying and is worth finding out | `info@codeforaustralia.org` |
| **Digital Rights Watch** | Consent-first design and a refusal to sell data, demonstrated in source rather than asserted in a policy | `info@digitalrightswatch.org.au` · `media@digitalrightswatch.org.au` |
| **Diversity Arts Australia** | The inclusion statement, Rainbow Door and the access items in 17.3 are their subject matter | `info@diversityarts.org.au` |
| **The Push** (Victorian youth music organisation) | Government-funded, youth-focused, and closest of anyone to the performers who use this | `hello@thepush.com.au` |
| Human Technology Institute (UTS) · Tech Policy Design Centre (ANU) · Gradient Institute · National AI Centre (CSIRO) | The policy audience for the ethical AI argument | **All UNVERIFIED**, named from general knowledge. Confirm each exists in current form and find the right person before contacting |

### 18.5 The companies already doing pieces of this

Approach these as peers, not as competitors to beat. Two of them are further
along than this project on specific features, and under AGPL there is nothing
preventing collaboration in either direction.

| Company | What they have that we do not | Note |
|---|---|---|
| **Stagetime** (US) | Ticketing at $0.35 flat, fairness randomisers, a points system that bumps skipped regulars, and set recordings sold with 80% to the performer | The most relevant operator in the world to talk to. Twelve years of running digital signups. Contact route is via their own site; no public address found |
| **The List** (Poster Poster) | Auto-recalculating slot times, countdown and "you're up", 48-hour auto-delete | Same category, same philosophy |
| **Indie on the Move** (US/Canada) | 11,124 venues with artist ratings, mature and alive. The proven version of Stage 4 | Worth asking what they learned about the conflict at [11.2](#112-the-conflict-that-cannot-be-designed-away) before building the Australian version |
| **Sound Credit** | Credits infrastructure, though for studio rather than stage | Adjacent, possibly complementary |
| **Muzeek**, **GigPig** | Venue-side booking and artist fees | The venue-side model, which is the position this project deliberately does not take |
| **PickleJar** | Tipping, five years' head start | Does not split a pool across a running order |

None of these published a contact address that automated retrieval could
confirm. Reaching them means their own contact forms or a direct approach on the
platform where their operators are already visible.

### 18.6 Distribution partners, not customers

These reach more performers in a week than a venue-by-venue rollout reaches in a
year.

| Who | Why | Status |
|---|---|---|
| **Open Mic Melbourne** (Facebook, roughly 8,000 followers) | A directory with the audience this needs. Competitor, partner, or the person this should eventually be handed to | Operator name **UNVERIFIED**. Do not use a name in outreach until confirmed from their own page |
| **deadfunny.club** | A live directory of Melbourne comedy rooms that names who runs each one. Its operator also runs a room, so they are both a partner and a customer | `admin@deadfunny.club` (from earlier research, confirm before sending) |
| **From Open Mic to Gig Melbourne** (Facebook group) | Direct line to performers rather than venues | **UNVERIFIED** |
| **The List** and **Stagetime** | The two free incumbents. Not enemies. Under AGPL there is nothing stopping contribution in either direction, and they have solved problems this has not (fairness randomisers, points systems that bump skipped regulars) | Public contact via their own sites |
| **Indie on the Move** | The proven overseas model for artist-side venue information. Worth asking what they learned before building the Australian version | Public contact via their site |

### 18.7 Political and public

Fully researched already. Verified electorate-level contacts are in
`ADVOCACY.md`, and the letters are in [section 16](#16-putting-this-on-the-record-letters-to-every-australian-government).
Sequence: Victoria and your own federal member first, everything else after a
real reply.

**The highest-value channel in this whole document is a submission to an open
inquiry or consultation.** It is public, permanent, and read by more people than
any letter. Two hubs to check, and both need a browser because neither rendered
for automated retrieval:

- `consult.industry.gov.au` — federal industry, science and technology
  consultations, which is where AI policy consultation sits
- `engage.vic.gov.au` — Victorian government consultations

**Gap, stated honestly:** the federal parliamentary committee listing at
`aph.gov.au` blocked automated access on 29 July 2026, so **open inquiries could
not be verified this session.** That check has to be done by hand, and it should
be done before any letter goes out, because a live inquiry beats a cold letter
every time.

**The pitch to the policy audience in [18.4](#184-civic-tech-digital-rights-and-equity-organisations)
is not the product.** It is the worked example: a sole trader used these tools to
build civic software with six constraints that are verifiable in source, and the
gaps in [17.4](#174-the-gaps-big-tech-will-not-fill-and-why) that explain why
nobody larger did it. That is a case study they need and do not have.

### 18.8 Media

Full list, angles and pitch templates are in `MEDIA.md`. Verified contacts as at
29 July 2026:

| Outlet | Contact | Angle |
|---|---|---|
| **Beat Magazine** | `editorial@beat.com.au` (coverage) · `submissions@beat.com.au` (a piece you write) · `gigguide@beat.com.au` | The royalty gap, local. They have already run a piece on musicians missing APRA income |
| **Music Feeds** | `contact@musicfeeds.com.au` | National, artist pay |
| **Tone Deaf** | `contact@vinyl.media` | Industry readership |
| **The Mandarin** | `media@themandarin.com.au` | Public sector. The people who write grant guidelines read this |
| **The Age** | `firstname.lastname@theage.com.au` pattern · `letters@` · `investigations@` | Gaming revenue against arts funding, if sourced |
| The Music, InnovationAus, Crikey, Rolling Stone AU, ABC | **UNVERIFIED** | See `MEDIA.md` |

**Do not pitch a journalist yet.** They will ask which venues and how many
artists have claimed. If the answer is none, there is no story and the contact is
burnt. Australian music media is a small pool with one first approach per person.
Wait for three venues running weekly, and ideally one artist who has filed a
report and been paid, which is the whole story in one person.

**The exception, and it is available today:** Beat's `submissions@` is for
pieces written by people in the scene. An argument you write yourself needs to be
right rather than traction-backed, and it already is. See "Write it yourself" in
`MEDIA.md`.

**Do not pitch yet.** A journalist will ask which venues and how many artists
have claimed. If the answer is none, there is no story and the contact is burnt.
Australian music media is a small pool and there is one first approach per
person. Wait for three venues running weekly, and ideally one artist who has
filed an APRA report and been paid. That second one is the entire story in one
person.

### 18.9 What was not verified

Everything in 18.1 to 18.5 marked as verified was read off the organisation's own
contact page on 29 July 2026. These were not:

- **Open federal parliamentary inquiries.** `aph.gov.au` blocked automated
  access. This is the highest-value channel in the document and the check has to
  be done by hand
- **Current listings on either consultation hub**, for the same reason
- **Music Tasmania's contact address**
- **United Workers Union's Victorian inbox.** The state pattern is confirmed for
  six other states, so `vic@unitedworkers.org.au` is an inference, not a fact
- **The ACTU**, and the four AI policy organisations at the bottom of
  [18.4](#184-civic-tech-digital-rights-and-equity-organisations)
- **Rainbow Door's contact details**
- **Contact routes for every company in [18.5](#185-the-companies-already-doing-pieces-of-this).**
  None published an address that automated retrieval could confirm
- **Open Mic Melbourne's operator**, deliberately, until confirmed from a primary
  source
- **Whether any of these organisations want to be approached this way**, which is
  worth asking rather than assuming

Two named-individual addresses appear above (`adele@musicnsw.com`,
`liz@musicnt.com.au`). Both were published by the organisation on its own contact
page, but people move on. Check before sending, and prefer the general inbox if
there is any doubt.

---

## 19. Gonzo engineering, and hiring the pattern

Everything above is a business plan for one project. This section is the other
thing it is: a proof of concept for a way of working, and an argument for
putting that to work in other communities.

### 19.1 What actually happened, with timestamps

| When | What |
|---|---|
| Evening, 28 July 2026 | Stood in a room while fifty-plus performers signed up for one night through an emailed link |
| That night | Built and deployed a working sign-up, running-order, stage-display and poster system. Live on a real URL |
| Same night | Added the parts that give value away: rights page, tip split, drink token, crew credits with pay tracking, consent-gated label opt-in |
| By 3:37am, 29 July | Fair pay standards researched to primary sources, prior art surveyed, venue list corrected against the liquor licence register, funding shortlist verified against funders' own live pages, political contacts verified electorate by electorate, licence changed from MIT to AGPL for a stated reason |
| 29 July | This plan, the letters to nine jurisdictions, and the outreach list |

**One day.** Not a prototype in a notebook: a deployed system on infrastructure
that costs nothing to run, with the plan, the sources and the source code all
public.

### 19.2 What gonzo engineering means here

The reporter is in the story. The builder is in the room.

There was no discovery phase, because the discovery was being at the gig. No
requirements document, because the requirement was watching one person try to
run a room from their inbox. No user research, because the user was standing at
the bar with a guitar.

That is the whole method, and it has three parts:

1. **Be in the problem.** Not adjacent to it, not briefed on it. In it, with
   something at stake.
2. **Ship the same day.** A working thing that a real person can use beats a
   proposal about a working thing, and it changes every conversation that
   follows. "I built this" is a different sentence from "I could build this".
3. **Publish everything, including what is wrong with it.** The plan, the
   sources, the licence, the unverified items, the risks that have no answer
   yet. Anyone can check the whole thing. That is the only reason to believe any
   of it.

The rest of this document is what that produces: not just software, but the
economics, the standards, the funding path and the policy argument, because
being in the room is what tells you which of those matter.

### 19.3 Why this transfers

The gap this project found is not a music gap. It is the shape of gap that
appears wherever a community runs on unpaid coordination:

- Somebody is keeping a list by hand, in a medium that was never meant for it.
- Everyone involved knows it is broken, and nobody has the hours to fix it.
- The people who could build the fix do not stand in that room.
- The market is too small, too poor or too awkward for anyone funded to bother
  (see [17.4](#174-the-gaps-big-tech-will-not-fill-and-why)).

Community sport rosters, volunteer rotas, food relief runs, tenant groups,
neighbourhood houses, disability advocacy, mutual aid, men's sheds, community
radio: same shape, different room. A tool that costs nothing to run, needs no
accounts and works on a bad connection is the right answer in every one of them.

**The honest limit on "fits in anywhere".** The method only works where somebody
inside the community holds it. This project works because its builder plays
these rooms. Dropped into a community he does not belong to, the right role is
building alongside someone who does, on their terms, and handing it over under a
licence that means they own it. That is stated plainly in the Northern Territory
letter in [16.4](#164-what-changes-jurisdiction-by-jurisdiction) and it is not a
disclaimer, it is the operating condition.

### 19.4 What is on offer

**For a community organisation, council, union, arts body or public agency:**

- Find the coordination gap in your sector by standing in it, not by
  interviewing about it.
- Working software in days, not a discovery phase in months.
- Open licence by default, so you own it and cannot be locked in. AGPL-3.0
  means even a future maintainer cannot close it against you.
- Consent-first data handling, with the six constraints in
  [16.3](#163-the-master-letter) and the red lines in
  [17.5](#175-red-lines) applying to your project too.
- Everything documented publicly, so the work survives the person who did it.

**Engagement shapes:** a fixed-scope build; a short embedded stint inside a
program or an organisation; a second opinion on a procurement before it is
signed; or a paid case study for a policy or research body on what this method
actually took.

`[RATE]` Day rate not set here on purpose. It should be set against real
comparable work, not invented in a document.

**Contact:** Daniel Hogben, Tech Duinn, sole trader, ABN 69 173 867 628 ·
daniel.j.hogben@gmail.com

### 19.5 The caveats, because they belong in the same section as the claim

- **One day of building is not one year of maintenance.** Shipping fast is
  demonstrated. Long-run operation of this system is not, and this document caps
  the project at five venues for exactly that reason
  ([section 8](#stage-1-built-and-live-the-sign-up-tool)).
- **No venue is running a real night on it yet.** Live and tested is not the
  same as in production with fifty people in a pub.
- **This was built with substantial AI assistance**, by someone self-taught, and
  that is disclosed everywhere it is relevant, including here. What AI did not do
  was know the problem was worth solving
  ([section 17](#17-ai-cannot-do-live-music-and-what-follows-from-that)).
- **Speed is not the product.** It is evidence of a method. Anyone hiring the
  speed and not the method will get something that works on day one and rots by
  month six, and that is worth saying out loud before the invoice.

---

## 20. How this becomes normal, and why it cannot be one person

The goal is not a successful project. It is that this way of running a night
becomes the ordinary way, whoever builds it and whoever gets the credit.

### 20.1 The definition of success

**A performer signs up for a night, in a room the founder has never been to, on a
system he did not install, and gets paid something for playing.**

Every decision below is judged against one question: *does this reduce the
project's dependence on one person?* If it does not, it is not progress, however
good it looks.

### 20.2 Three routes, in order of speed

| Route | How fast | What it needs |
|---|---|---|
| **An institution adopts it** | Fastest by far | A peak body, union, council or existing directory hands it to their own venues. One conversation reaches more rooms than a year of walking in |
| **Other people run their own copies** | Fast, and permanent | Setup has to be trivial. Right now it is not, and that is the single biggest blocker in this document |
| **Venue by venue, in person** | Slowest | One person's hours, capped at five venues for good reasons ([section 8](#stage-1-built-and-live-the-sign-up-tool)) |

The third route is the one currently being pursued, and it is the one that
cannot scale. It is still necessary, because the first venue proves the thing
works and nothing substitutes for that. But it is a proof step, not a growth
strategy, and confusing the two is how this ends as one person doing free
support for forty venues.

### 20.3 The blocker nobody would guess

**Standing up an independent copy currently requires wrangler, a D1 database and
a secret.** That is too hard, so nobody else runs it, so everything depends on
one person.

A one-command deploy is therefore not a developer convenience. It is the
difference between a project and a standard. It ranks above every feature on the
roadmap, including the APRA generator, because the APRA generator built by one
person serves one city, and built into something twenty people run serves twenty.

### 20.4 Giving up control, deliberately

Becoming the default requires being safe to adopt, and safe to adopt means the
adopter cannot be held hostage later. Concretely:

- **AGPL-3.0 already binds the founder too.** Any future maintainer, including
  any entity this becomes, must publish source. That is the guarantee.
- **No paid tier, ever.** Stated in the plan, stated on the sign-up page, stated
  in [`HELP.md`](HELP.md). The moment a venue receives an invoice, the trade is
  dead and the standard is dead with it.
- **The trademark should sit with an entity, not a person**, once one exists.
  The name is the only thing the licence does not give away, and it should be
  held by something that outlives an individual.
- **Co-maintainers with real commit rights**, not contributors waiting on one
  person's review. A project with one committer is a project with one point of
  failure.
- **Documented handover.** What happens if the founder stops: the deployment,
  the domain, the admin key, the venue relationships. Written down while things
  are calm.
- **The venue-information layer probably belongs to someone else entirely.** The
  conflict at [11.2](#112-the-conflict-that-cannot-be-designed-away) does not
  resolve any other way.

### 20.5 What to ask for, from whom

The recruitment ask is public and specific, in [`HELP.md`](HELP.md), because
"help wanted" gets nothing and "verify whether this Tuesday night still runs"
gets an answer. Roles currently open:

- A co-maintainer who cares about the boring stack
- Someone in another city willing to run their own copy
- A host willing to be the first real night
- A legal read before any venue information is published
- Verification legwork on venues, which is slow and is the actual moat
- Design for the stage display, which is behind a bar in a dark room

### 20.6 How to tell whether it is working

Not downloads, not stars, not press. These:

1. Venues running it in a week where the founder did nothing.
2. Independent copies deployed by people he has not met.
3. An organisation linking it as the recommended tool.
4. One artist paid from a report this system generated.
5. A pull request from a stranger that improves something he would not have
   thought of.

Number four is the one that matters most, and number two is the one that means
it survives him.

---

## 21. Sources

**Industry standards and rights**

- [Musicians Australia (MEAA), the $250 minimum fee](https://musiciansaustralia.org/the-musicians-australia-minimum-fee/)
- [MEAA, "Time for $9 billion industry to pay up and stop exploiting professional musicians"](https://www.meaa.org/mediaroom/time-for-9-billion-industry-to-pay-up-and-stop-exploiting-professional-musicians/)
- [APRA AMCOS, Distribution Information Guide: Live Music](https://www.apraamcos.com.au/about/governance-policy/distribution-rules-practices/distribution-information-guides/live-music)
- [APRA AMCOS, Performance Reports](https://www.apraamcos.com.au/resources/get-paid/performance-reports)
- [Fair Work, Live Performance Award MA000081 pay guide](https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000081&fileType=pdf)
- [Music Victoria, Best Practice Guidelines for Live Music Venues](https://www.musicvictoria.com.au/resource/best-practice-guidelines-for-live-music-venues-summary/) (members only)
- [Beat, on musicians missing APRA live performance income](https://beat.com.au/we-had-no-idea-there-was-this-incredible-system-why-musicians-are-needlessly-missing-this-vital-source-of-income/)

**Sector and public finance**

- Victorian Live Music Census 2021-22, Music Victoria
- Victorian Budget 2026-27, Budget Paper 3 Table 1.17, Budget Paper 5 Table 4.2 and Appendix A.4
- Community Support Fund, statutory purposes
- Council grant program pages: Yarra, Merri-bek, Darebin, City of Melbourne
- [Creative Victoria, Music Works](https://creative.vic.gov.au/funding-opportunities/find-a-funding-opportunity/music-works) and [Music Victoria, Music Works](https://www.musicvictoria.com.au/initiatives/music-works/)

**Prior art**

- [The List](https://list.posterposter.app/open-mic) · [Stagetime](https://stageti.me/open-mic-demo)
- [Indie on the Move](https://www.indieonthemove.com/venues)
- [Sound Credit](https://soundcredit.com/) · [Muzeek](http://muzeek.com/) · [GigPig](https://www.gigpig.uk/)

**Companion documents in this repository**

`MASTER.md` (the origin and every decision), `FAIR-PAY.md` (standards research),
`PRIOR-ART.md` (competitive landscape), `FUNDING.md` (grant detail),
`MONEY-FLOW.md` (the public finance research in full), `OWNERSHIP.md` (who owns
the venues), `ADVOCACY.md` (verified political contacts), `LETTERS.md`
(templates), `CONTRACTS.md` (plain-English agreements for musicians),
`LICENSING.md`, `ETHICAL-AI.md`, `MEDIA.md`, `TARGETS.md`.

---

## Verification notes

Everything above was checked against a primary source on 29 July 2026. These
specific items were **not** verified and must be confirmed before anyone relies
on them:

- Current APRA writer membership cost and eligibility requirements.
- Whether the Live Performance Award has been varied since the 2021 fee was set.
- The exact contents of Music Victoria's Best Practice Guidelines (members only).
- Sole trader eligibility for the Yarra and Darebin council grant streams.
- Whether paying local artists is a claimable community purpose for clubs that
  fund through gaming revenue (a question for the VGCCC).
- Bar-share percentages on a promoted Melbourne night. No figure in this document
  rests on an assumed number, and none should until one real night has been run.

*This document is CC BY-SA 4.0. Corrections are welcome and will be made
promptly.*
