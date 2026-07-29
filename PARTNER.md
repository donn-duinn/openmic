# Partner brief — openmic

**For: Ashlar. From: donn. 2026-07-29.**

Short version: I built a free open mic sign-up system for Melbourne venues.
It's live. I want you on it as the second pair of hands.

---

## What it is

A bar running an open mic puts a QR code on the counter. Performers scan it,
put their name in, and watch the running order on their own phone. The host
gets one private link to reorder the list and mark who's on stage.

Live: https://openmic.techduinn.dpdns.org
Demo venue: https://openmic.techduinn.dpdns.org/demo
Source: https://github.com/donn-duinn/openmic

## Why it exists

I was at Shotkickers on 28 July. 50+ performers signing up through an emailed
link. Not a form, not a spreadsheet — an email link. Hard Knock Knocks, the
main Melbourne comedy listing site, tells comedians in writing to "reach out
(probably via Facebook)" to get on a list. Roughly 28 comedy rooms and 15
music nights, all running on clipboards and DMs.

## The business model

The software is free to the venue. Permanently. What I'm asking for in return
is that they think of me when they're booking. I play these rooms; that's the
trade.

This is not a SaaS. Don't let me turn it into one.

## Where it fits in Tech Duinn

Same wedge as the audit line: do real work for a Melbourne small business
first, ask for the relationship second. Venues are a warmer audience than cold
audit prospects because I'm already in the room.

## What I need from you

Your formal engineering is better than mine and you're stronger on network and
infrastructure than I am. The milestone **v1 — First Venue Live** has the work
split. Roughly:

- **Infrastructure** (yours if you want it): the custom domain and DNS are
  done, so what I hand a publican is `openmic.techduinn.dpdns.org`. What's
  left is rate limiting, so a bored punter can't fill a list with fake names.
- **Field** (either of us): verify the venue list. `TARGETS.md` has ~45 rooms
  from public listings, but no contact details and no confirmation of how each
  one currently handles sign-ups. That research is the actual moat.
- **Product** (mine): SMS "you're up in 10 minutes". It's the feature that
  makes a host love this instead of tolerate it. It also costs money per
  message, which breaks "free forever", so it needs thinking about.

## Constraints I'm holding myself to

- **No accounts, for anyone.** A performer at a bar at 8pm will not sign up for
  a login. A publican will not remember a password.
- **No framework, no build step.** Server-rendered HTML. It has to load on bad
  pub wifi and still be readable in a year.
- **Free means free.** The moment a venue gets an invoice, the trade is dead.

## Stack

Cloudflare Workers + D1 (APAC region). Free tier covers this many times over.
Everything is in `src/` — three files, no magic. `README.md` has setup.

## Not decided yet

- Whether this stays private or goes public on GitHub. `TARGETS.md` is a
  prospect list, so it's private for now.
- Whether the Melbourne open mic Facebook directory (8k followers, run by
  operator name unverified) is a competitor, a partner, or a distribution
  channel.
- Whether comedy or music is the better beachhead. Comedy rooms have more
  acute pain; music rooms are where my bookings are.
