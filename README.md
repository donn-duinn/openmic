# openmic

Free open mic sign-up system for Melbourne venues.

Live: https://openmic.techduinn.dpdns.org
Source: https://github.com/donn-duinn/openmic

**Run your own:** clone it and run [`./setup.sh`](setup.sh), which stands up a
copy in one command. What else is needed is in [`HELP.md`](HELP.md).

## What it is

A venue puts a QR code on the bar. Performers scan it, put their name in, and
watch the running order on their own phone. The host gets one private link to
reorder the list, mark who's on stage, and see everyone's phone number.

Replaces: a clipboard, a Facebook comment thread, or an email link.

The whole plan, including the parts that are unresolved, is in
[`BUSINESS-PLAN.md`](BUSINESS-PLAN.md). It is public on purpose: take it, quote
it, or copy the model for your own city.

**Want to help, or run your own?** [`HELP.md`](HELP.md). The goal is that this
way of running a night becomes normal, not that this copy of it wins.

## Two tools, one repo

**The sign-up system** for venues, below. And **[`/apra`](https://openmic.techduinn.dpdns.org/apra)**,
a standalone performance report helper any musician can use tonight with no
venue, no account and no sign-up sheet: enter the gigs you have already played,
get a setlist in a shape you can file, and find out what you cannot claim before
you waste a submission. It runs entirely in the browser. No setlist reaches the
server.

## Pages

| URL | Who | What |
|---|---|---|
| `/` | bars | The pitch |
| `/:slug` | performers | Sign-up form + live running order |
| `/:slug/stage` | the room | Big screen — who's on, who's next. Auto-refreshes |
| `/:slug/poster` | the host | Printable QR poster for the bar |
| `/:slug/host/:token` | the host | Private dashboard. The token IS the password |
| `/admin/new` | you | Create a venue. Gated by `ADMIN_KEY` secret |

## Design decisions

- **No accounts, for anyone.** A performer at a bar at 8pm will not create a
  login. The host will not remember a password. Host auth is a secret URL they
  bookmark.
- **Server-rendered HTML, no framework, no build step.** Loads instantly on bad
  pub wifi and stays maintainable.
- **Nights roll over at 5am Melbourne time**, so a gig running past midnight
  keeps one running order. Each night starts clean automatically.
- **D1 in APAC** so queries don't cross the planet.

## Licence

AGPL-3.0. Anyone can run it; anyone running a modified version as a service
must publish their source. See `LICENSING.md` for why, and for the docs licence
(CC BY-SA 4.0) and the trademark position.

## Stack

Cloudflare Workers + D1. Free tier covers this comfortably.

## Setup

Easiest: `./setup.sh`. It does everything below, including creating your own
database if the one in `wrangler.jsonc` is not in your account.

By hand:

```bash
npm install
npx wrangler d1 create openmic --location apac   # put the id in wrangler.jsonc
npx wrangler d1 execute openmic --remote --yes --file=./schema.sql
for f in migrations/*.sql; do                    # required, not optional
  npx wrangler d1 execute openmic --remote --yes --file="$f"
done
npx wrangler secret put ADMIN_KEY
npx wrangler deploy
```

**Two warnings.** `schema.sql` starts with `DROP TABLE IF EXISTS`, so running it
against a live database wipes it. And the migrations are not optional: skip them
and every venue page returns a 500, because the code reads tables and columns
that only the migrations create.

Step-by-step, including a dry run before you take it to a venue:
[`HOWTO.md`](HOWTO.md).

Local dev:

```bash
npm run db:local
npm run dev
```

## Adding a venue

Go to `/admin/new`, enter the admin key (stored at
`~/.nexus/secrets/openmic.env`), fill in the venue. You get back the public
sign-up link, the printable poster, and the private host link to send them.

## Not done yet

- SMS "you're up next" (needs a Twilio account and costs money per message)
- Host can't edit venue settings after creation — has to go through admin
- No export of who played, which venues would probably want eventually
