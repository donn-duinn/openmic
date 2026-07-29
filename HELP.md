# Help build this

I want open mic nights to run properly everywhere, and for the artists playing
them to get told what they are owed. I do not care whose name is on it. I care
that it exists, that it stays free, and that it cannot be taken away from the
people using it.

I cannot do that alone. This is what I need, and what you get.

---

## What this is, in thirty seconds

A free sign-up and running-order system for open mic nights. QR code on the bar,
performers sign up on their phone and watch the running order, the host reorders
from one private link. No accounts, no app, no cost, ever.

It also tells performers the union minimum fee exists, that APRA AMCOS may
already owe them royalties, splits the tip jar evenly, and credits the sound
engineer. Live now. Source is open. The full plan, including everything unfinished
and everything that might not work, is in [`BUSINESS-PLAN.md`](BUSINESS-PLAN.md).

**Disclosure, up front:** I am a Melbourne musician, I want to run nights, and I
may book people I meet through this. That is the trade I am offering venues and
it is said out loud everywhere, not discovered later.

---

## What "done" looks like

Not a company. Not an exit. This:

**A performer signs up for a night, in a room I have never been to, on a system I
did not install, and gets paid something for playing.**

If that happens and I am not involved, it worked.

---

## What I actually need

Pick anything. Some of these take ten minutes.

### If you play

- **Use it and tell me what is broken.** Especially anything confusing at 8pm in
  a loud room with one bar of signal.
- **Tell me if `/rights` is wrong.** If you know more than me about APRA, the
  award, or what a venue actually owes you, I want the correction more than I
  want to be right.
- **Tell your host about it.** One sentence from a performer they know beats any
  email I send.

### If you run a room

- **Try it for one night.** It is free permanently, it takes about five minutes
  to set up, and if it makes your night worse you can go back to the clipboard
  and I will have learned something.
- **Tell me what a host actually needs** that is not there. I have watched a lot
  of nights and run none, and that gap shows.

### If you write code

The stack is deliberately boring: Cloudflare Workers and D1, server-rendered
HTML, no framework, no build step, three files. AGPL-3.0.

Highest value first:

1. **One-command deploy.** Right now standing up your own copy needs wrangler,
   a D1 database and a secret. Too hard. Until this is trivial, nobody else runs
   it, and if nobody else runs it, this whole thing depends on me. **This is the
   most important item on the list.**
2. **The APRA performance report generator.** The system already knows who
   played, where and when. It needs song titles, captured at sign-up rather than
   after the set, and a report the performer can submit. This is the feature
   that moves real money to real people.
3. **Rate limiting**, so a bored punter cannot fill a list with fake names.
4. **Host settings after creation**, so a venue is not stuck with what I typed.
5. **Export of who played**, which venues will want and artists can use for
   grant applications and bios.
6. **Accessibility.** Captions on the stage screen, a running order that works
   with a screen reader, larger type options. This is currently just absent.

### If you are somewhere else

**Take it and run your own.** Brisbane, Perth, Hobart, Dublin, wherever. The
licence exists so you can, without asking me, and so that nobody can close it
later. I would rather ten people run their own copy badly than one person run all
of them well, because the second version dies when that person gets sick.

If you want help getting started, ask. If you want to change it beyond
recognition, do that instead.

### If you are an organisation

A music peak body, a union, a council, a neighbourhood house, a student union:
you can hand this to your own venues at no cost and with no dependency on me. If
you would rather host it yourself so you are not relying on a bloke in Melbourne,
the licence is written for exactly that.

What I would ask in return is that you tell me what your members need that this
does not do.

### Things that are not code

- **Verify a venue.** Does that night still run, who hosts it, how do people
  currently sign up. That research is slow and it is the actual moat.
- **Run a night.** With me or without me.
- **Legal read** on publishing factual information about how venues treat
  artists, before any of that goes public. Australian defamation law is not
  friendly and I would rather be told no early.
- **Not-for-profit paperwork**, if and when that structure happens.
- **Design.** The stage display is behind a bar in a dark room and it should be
  beautiful.

---

## What I promise in return

1. **It stays free.** No paid tier for venues, no paid tier for performers, no
   upsell, ever. If a venue receives an invoice, the trade is dead.
2. **Your data is not the business model.** Nothing is sold. Introductions happen
   only if a person ticked a box themselves.
3. **Nobody is named without agreeing**, and whether an individual was paid is
   never published against their name.
4. **It cannot be enclosed.** AGPL-3.0 means anyone running a modified version as
   a service has to publish their source. Including me. Including whoever comes
   after me.
5. **Credit where it is due**, and only where it is wanted. Tell me if you would
   rather not be named.
6. **I will publish the bad news too.** The plan already contains the risks with
   no answer, the conflict I cannot design away, and the parts that might not
   work. That does not change if this grows.

---

## The honest state of it

- Live and tested, but **not yet running a real night at a real venue.**
- Built fast, by one self-taught person, with substantial AI assistance, all of
  which is disclosed in the plan.
- The APRA feature, which is the best thing here, is **half-built**.
- The hardest unsolved problem is not technical. It is that rating venues while
  needing venues to book you cannot coexist, and the answer is probably that
  someone other than me holds that part. See section 11.2 of the plan.
- One person's spare hours is the binding constraint on all of it. That is why
  this page exists.

---

## Get in touch

**Daniel Hogben (donn)** · Melbourne
daniel.j.hogben@gmail.com
Tech Duinn, sole trader, ABN 69 173 867 628

Issues and pull requests welcome. So is an email that just says the idea is
wrong and here is why.

*This page is CC BY-SA 4.0. The code is AGPL-3.0. Take both.*
