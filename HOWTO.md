# HOWTO: from nothing to a working open mic sign-up system

This is the step-by-step version. It assumes you can follow instructions and
use a terminal. It does not assume you know anything about Cloudflare.

By the end you will have your own copy running on the internet, with a venue
created, a QR poster you can print, and a private host link.

Everything here was checked against the files in this repository. Where
something could not be verified from those files, it says so.

---

## 1. Before you start

**What you need:**

- **Node.js 18 or newer.** Get it from [nodejs.org](https://nodejs.org). Check
  what you have:

  ```bash
  node -v
  ```

  `setup.sh` refuses to run below 18. The repo pins `wrangler` 4.114.0 as a dev
  dependency, and `setup.sh` uses `npx --yes wrangler@4`.

- **A free Cloudflare account.** Sign up at
  [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up). No credit
  card is needed for the free tier. You do not need a domain.

- **A terminal**, and `git` to clone the repo.

**How long:** about 15 minutes the first time, including creating the
Cloudflare account. The scripted path itself takes a few minutes, most of which
is `npm install` and the deploy.

**What it costs:** nothing. Cloudflare Workers and D1 both have free tiers, and
a single open mic night is a tiny amount of traffic. There is no paid tier in
this project to upgrade to. The exact free tier limits change over time, so
check Cloudflare's current Workers and D1 pricing pages rather than trusting a
number written here.

**Get the code:**

```bash
git clone https://github.com/donn-duinn/openmic.git
cd openmic
```

---

## 2. The fast path: `./setup.sh`

```bash
./setup.sh
```

### Read this first, it matters

The `wrangler.jsonc` committed to this repo already contains a real
`database_id`, belonging to the original deployment. `setup.sh` checks whether
`wrangler.jsonc` already has a `database_id` and, if it does, **skips creating
your database**. On a fresh clone that means it will try to deploy against a
database ID your Cloudflare account cannot access.

Before running `setup.sh` on a fresh clone, blank that ID out:

```bash
node -e 'const fs=require("fs");let s=fs.readFileSync("wrangler.jsonc","utf8");s=s.replace(/"database_id":\s*"[^"]*"/,`"database_id": ""`);fs.writeFileSync("wrangler.jsonc",s)'
```

Then run the script.

### What each step does

1. **Checks prerequisites.** Confirms `node` exists and is version 18 or above.
   Stops with a clear message if not.
2. **`npm install`.** Installs `qrcode-svg` and `wrangler`.
3. **Checks your Cloudflare login.** Runs `wrangler whoami`. If you are not
   logged in it runs `wrangler login`, which opens a browser. **You will be
   asked to sign in to Cloudflare and approve access.** That is the only
   interactive prompt in the normal case.
4. **Creates the D1 database.** Runs
   `wrangler d1 create openmic --location apac`, pulls the new database ID out
   of the output, and writes it into `wrangler.jsonc`. It keeps a backup at
   `wrangler.jsonc.bak`. If creation fails because the database already exists,
   it falls back to `wrangler d1 info openmic --json` to find the ID.
   Set `OPENMIC_DB_NAME` first if you want a different database name.
5. **Applies the schema and every migration.** Runs `schema.sql`, then each
   file in `migrations/` in sorted order, against the remote database. Failures
   here are treated as "already applied" and printed as `skipped`, so read the
   output rather than assuming silence means success.
6. **Sets your admin key.** If an `ADMIN_KEY` secret already exists, it is left
   alone. Otherwise it uses `OPENMIC_ADMIN_KEY` from your environment, or
   generates a random one. A generated key is **printed once, at the end**.
   Copy it somewhere safe. There is no way to read a Cloudflare secret back.
7. **Deploys.** Runs `wrangler deploy` and extracts your `*.workers.dev` URL
   from the output.

### What you get at the end

The script prints your live URL and, if it generated one, your admin key. From
there:

- `https://<your-worker>.workers.dev/` is the landing page.
- `https://<your-worker>.workers.dev/admin/new` is where you create a venue.

The script is written to be safe to re-run. Every step checks whether it has
already been done.

---

## 3. The manual path

Do this if you want to understand what is happening, or if `setup.sh` failed
part way through. These are the same commands, run by hand. They come from
`package.json` and the setup section of `README.md`.

```bash
npm install
```

Log in to Cloudflare. This opens a browser.

```bash
npx wrangler login
npx wrangler whoami
```

Create the database. `--location apac` is a hint that keeps the data near
Australian venues.

```bash
npx wrangler d1 create openmic --location apac
```

That prints a `database_id`. Open `wrangler.jsonc` and paste it into the
`database_id` field under `d1_databases`. The `binding` must stay `DB`, because
`src/index.js` uses `env.DB`.

Apply the schema, then every migration, to the remote database:

```bash
npx wrangler d1 execute openmic --remote --yes --file=./schema.sql
npx wrangler d1 execute openmic --remote --yes --file=./migrations/002_fair_pay.sql
npx wrangler d1 execute openmic --remote --yes --file=./migrations/003_crew.sql
npx wrangler d1 execute openmic --remote --yes --file=./migrations/004_photographers.sql
npx wrangler d1 execute openmic --remote --yes --file=./migrations/005_crew_table.sql
npx wrangler d1 execute openmic --remote --yes --file=./migrations/006_crew_consent.sql
```

**The migrations are not optional.** `README.md` only mentions `schema.sql`,
and `npm run db:remote` only runs `schema.sql`. That is not enough. The code in
`src/index.js` and `src/views.js` reads the `nights` table, the `crew` table
and the `perk_enabled` column, none of which exist in `schema.sql`. Skip the
migrations and venue pages will throw errors.

**Warning about `schema.sql`.** It begins with `DROP TABLE IF EXISTS
performers;` and `DROP TABLE IF EXISTS venues;`. Running it against a database
that already has venues in it will delete them. Only run it on a new database.
That also means `npm run db:remote` is destructive. Treat it as a reset, not an
update.

Set the admin key. This prompts you to type or paste a value:

```bash
npx wrangler secret put ADMIN_KEY
```

Pick something long and random. If you want one generated:

```bash
node -e 'console.log(require("crypto").randomBytes(24).toString("base64url"))'
```

Deploy:

```bash
npx wrangler deploy
```

The output includes your `*.workers.dev` URL.

---

## 4. Running it locally

Local development uses a local SQLite database under `.wrangler/`, separate
from the deployed one. Nothing you do locally touches the live site.

Apply the schema locally:

```bash
npm run db:local
```

That runs `wrangler d1 execute openmic --local --file=./schema.sql`.

**It does not apply the migrations.** You have to do that yourself, or the
local site will error on any venue page:

```bash
for f in migrations/*.sql; do npx wrangler d1 execute openmic --local --yes --file="$f"; done
```

Set a local admin key. `wrangler dev` reads `.dev.vars` for secrets, and
`.dev.vars` is already in `.gitignore`:

```bash
printf 'ADMIN_KEY=localdevkey\n' > .dev.vars
```

Start the dev server:

```bash
npm run dev
```

Wrangler's default port is 8787, and it prints the actual URL when it starts.
Use the printed one if it differs.

**URLs to hit locally:**

| URL | What it is |
|---|---|
| `http://localhost:8787/` | Landing page, the pitch |
| `http://localhost:8787/rights` | Performer rights page |
| `http://localhost:8787/admin/new` | Create a venue |
| `http://localhost:8787/<slug>` | Performer sign-up and running order |
| `http://localhost:8787/<slug>/stage` | Big screen display |
| `http://localhost:8787/<slug>/poster` | Printable QR poster |
| `http://localhost:8787/<slug>/host/<token>` | Private host dashboard |

Two things to know about local mode:

- The QR code on the poster encodes whatever origin you loaded the page from.
  Locally that is `http://localhost:8787/<slug>`, which will not work when
  scanned from a phone. Test the QR against your deployed URL, not locally.
- The performer cookie is set with `Secure`. Browsers generally treat
  `localhost` as a secure origin so this normally works, but this was not
  tested as part of writing this guide. If your own status card never appears
  locally, that is the first thing to suspect.

---

## 5. Creating your first venue

Go to `/admin/new` on your deployed site. There is no link to it from anywhere,
which is deliberate.

The form fields, and what each one does, read off `src/index.js`:

| Field | Meaning |
|---|---|
| **Admin key** | Your `ADMIN_KEY` secret. Wrong key returns a bare 403. |
| **Venue name** | Required. Shown as the heading on every page. |
| **URL slug** | The bit after the domain. Leave blank to generate it from the name. Lowercased, non-alphanumerics become hyphens, trimmed to 40 characters. `admin`, `api`, `rights`, `static`, `robots.txt` and `favicon.ico` are reserved. |
| **Suburb** | Optional. Shown next to the night label. |
| **Host name** | Optional. Used in the "sign-ups are closed, have a chat to ..." message. |
| **When it runs** | Free text, for example "Every Tuesday, 7pm". Shown under the venue name and on the poster. |
| **Max songs per act** | Caps the songs field on the sign-up form. Clamped to 1 to 10, defaults to 2. |
| **Capacity** | How many acts before the list is declared full. Clamped to 1 to 200, defaults to 40. |
| **Blurb** | Up to 300 characters, shown to performers above the form. House rules, load-in time, whatever. |

Two settings exist in the database but are **not** on this form: `slot_minutes`
(defaults to 10) and `signups_open` (starts open). `slot_minutes` is not
currently displayed anywhere in `src/views.js`, so it has no visible effect.

Submit, and you get a page of links. It gives you four URLs, not three, despite
what `README.md` says:

1. **Sign-up page**, `/<slug>`. This is what the QR points at. Performers put
   their name in here and watch the running order.
2. **Poster**, `/<slug>/poster`. Printable page with the QR code on it.
3. **Big screen**, `/<slug>/stage`. Who is on now, who is next. Auto-refreshes
   every 15 seconds.
4. **Host link**, `/<slug>/host/<token>`. Private. The token is the password.
   Anyone with the URL can reorder the list and see performers' phone numbers.

**Save that host link now.** It is shown once on this page. There is no
"forgot my link" flow. If it is lost, you have to read it out of the database:

```bash
npx wrangler d1 execute openmic --remote --command "SELECT slug, host_token FROM venues"
```

---

## 6. A dry run, before you go near a venue

Do this on your deployed site, not locally, because you want the phones to be
real phones. Give yourself twenty minutes.

Create a throwaway venue at `/admin/new`, called something like "Test Night",
slug `test`. Set capacity to something small, say 5, so you can test the full
list message.

**On your laptop**, open two tabs:

- the host link, `/test/host/<token>`
- the stage display, `/test/stage`

**On your phone**, open `/test`.

Then work through this:

1. **Sign up as a performer.** On the phone, fill in a name, pick an act type,
   set songs, put a mobile number in. Submit. You should see a green "You're on
   the list, position 1" notice, and your name in the running order.
2. **Sign up two or three more.** Use a second phone, or a private or incognito
   window, because the cookie is per browser and per venue. Different names each
   time, since the same name twice on the same night is rejected on purpose.
3. **Check the host list.** Refresh the host tab. All performers should be
   there, with their phone numbers next to their names.
4. **Reorder.** Use the up and down arrows on the host page. Confirm the order
   changes on the performer's phone after a refresh. The sign-up page
   auto-refreshes every 45 seconds, so it will catch up on its own.
5. **Mark someone on stage.** Press the play button next to a performer. Watch
   the stage tab. Within 15 seconds it should show that name in large type,
   with "Next up" underneath. On the performer's own phone, their card changes:
   they get a drink token with a four-character code, and a link to the rights
   page.
6. **Mark them done.** Press the tick. Confirm the next act is now shown as
   up next. Note that marking a second person on stage automatically marks the
   first as done, so you cannot end up with two acts on stage at once.
7. **Test the jar.** On the host page, put a number in the jar field, say
   84.50, and save. Each performer who has played sees their own even share on
   their own phone. The remainder stays in the jar rather than rounding anybody
   short.
8. **Add crew.** Add a sound engineer by name. Leave the credit tick box off
   and confirm they do **not** appear publicly on the sign-up page. Tick it and
   confirm they do. Pay status is never shown publicly against a name, by
   design.
9. **Add a walk-in.** Use the walk-in form on the host page to add someone who
   did not scan the code. They land at the bottom of the list.
10. **Close and re-open sign-ups.** Confirm the performer page shows the closed
    message with the host's name in it.
11. **Fill the list.** Sign up until you hit capacity and confirm the "tonight's
    list is full" message appears.
12. **Print the poster.** Open `/test/poster` and use the Print button. Print it
    on actual paper. Scan the QR with a phone that has never seen the site and
    confirm it lands on the sign-up page.
13. **Clear the list.** Use "Clear tonight's list" at the bottom of the host
    page. Confirm everything is gone and the stage screen falls back to the
    default.

Worth knowing while testing: a night rolls over at 5am Melbourne time, not
midnight, so a gig running late keeps one running order. If you test after 5am
the next morning, the list will look empty because it is a new night, not
because something broke.

---

## 7. Taking it to a real room

**What to print:**

- The poster, `/<slug>/poster`, at least twice. One for the bar, one by the
  stage or the sound desk. A third by the door does not hurt.
- Optionally, a plain sheet of paper with the sign-up URL written large, as a
  backup for anyone whose camera will not scan.

**What to tell the host:**

- Their host link is the password. Bookmark it, do not put it in a group chat,
  do not put it on a screen anyone can photograph. Anyone with it can reorder
  the list and read performers' phone numbers.
- The three buttons they will actually use: play to put someone on stage, tick
  to mark them done, arrows to reorder.
- Sign-ups can be closed with one button when the list is full enough.
- The list clears itself each night at 5am. There is a manual clear button too.
- If they enter a jar total, every performer sees their own share on their own
  phone. That is the point. It is arithmetic in public, so nobody has to take
  anyone's word for it.
- Crew get named publicly only if the tick box is ticked, and they should be
  asked first.

**What to tell performers:**

- Scan the code on the bar, put your name in, watch the running order on your
  phone.
- No app and no account.
- Put a mobile number in if you want the host to be able to text you.
- The email box is only for people who ticked the box above it. If you do not
  tick it, nothing is stored and nothing is passed on.

**Check before doors:**

- **Wifi or mobile signal.** This system is entirely server-rendered on
  Cloudflare. There is no offline mode. If the room has no internet, it does
  not work. Test on your own phone standing where the bar is, not at the door.
- **The screen.** If you are using the stage display, get the laptop or tablet
  onto `/<slug>/stage` and leave it there. It refreshes itself. Turn off screen
  sleep and screensaver first.
- **A charged phone for the host**, plus a charger or a power bank. The host
  page is used all night.
- **The host link is actually bookmarked** on the device the host will be
  holding, not just emailed to them.
- **Scan your own poster** once you are in the room, on the venue's wifi.

**If the internet drops mid-night:**

Be honest with yourself about this: there is no fallback built in. Every page
is rendered by the server on each request, so with no connection nobody can
sign up and the host cannot reorder anything.

What to actually do:

1. The page already loaded on the host's phone stays on screen. It will not
   update, but the running order on it is still correct as of the last refresh.
   Do not close that tab.
2. Take a screenshot of the host list. Do this early in the night as a habit,
   not once things break.
3. Fall back to pen and paper. Keep a pen and a sheet behind the bar for this
   reason. Carry on running the night off the paper.
4. When the connection comes back, use the walk-in form on the host page to add
   anyone who signed up on paper, and reorder to match.
5. If the venue's wifi is unreliable, hotspot the host's phone off mobile data
   for the host page. Performers signing up will still need their own signal,
   which most will have.

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `You are not authenticated. Please run 'wrangler login'` | Not logged in to Cloudflare | `npx wrangler login`, then `npx wrangler whoami` to confirm |
| Deploy succeeds but every page 500s | Database not created, or wrong `database_id` in `wrangler.jsonc` | `npx wrangler d1 list` to see your databases. Create one with `npx wrangler d1 create openmic --location apac` and paste the ID into `wrangler.jsonc` |
| `setup.sh` skipped database creation on a fresh clone | The committed `wrangler.jsonc` already has someone else's `database_id`, and the script leaves an existing ID alone | Blank the `database_id` out, as shown in section 2, then re-run |
| Landing page works, `/<slug>` 500s | Migrations not applied. `schema.sql` alone has no `nights` table, no `crew` table and no `perk_enabled` column | Apply every file in `migrations/`, as in section 3 |
| Local site errors but the deployed one is fine | `npm run db:local` only applies `schema.sql` | Run the migrations against `--local` too, as in section 4 |
| `/admin/new` returns "Nope." with a 403 | Wrong admin key, or `ADMIN_KEY` never set | `npx wrangler secret list` to check it exists. `npx wrangler secret put ADMIN_KEY` to set it. Secrets cannot be read back, so if you lost it, set a new one |
| `/admin/new` 403s locally no matter what you type | No `.dev.vars` file, so `env.ADMIN_KEY` is undefined | `printf 'ADMIN_KEY=localdevkey\n' > .dev.vars` and restart `npm run dev` |
| "Pick a different slug." | The slug is empty after cleaning, or is one of the reserved words | Choose a different slug. Reserved: `admin`, `api`, `rights`, `static`, `robots.txt`, `favicon.ico` |
| Venue was there, now everything is gone | `schema.sql` was re-run. It starts with `DROP TABLE` | There is no undo. Only run `schema.sql` on a fresh database. Never run `npm run db:remote` on a live one |
| "Bad host link." | Wrong or mistyped token | Read it back: `npx wrangler d1 execute openmic --remote --command "SELECT slug, host_token FROM venues"` |
| List looks empty next morning | The night rolled over at 5am Melbourne time | Working as designed. Last night's rows are still in the database under the previous date |
| Sign-up rejected as already on the list | Same name, same venue, same night | Add a surname or an initial. The host can also add them as a walk-in |
| Custom domain shows an error or the wrong site | DNS has not propagated, or the route is not attached | This project ships no custom domain configuration, and `README.md` lists custom domain as not done. Set it up in the Cloudflare dashboard under your Worker's settings, then wait. DNS changes commonly take minutes to hours. This path was not tested while writing this guide |

If something is broken and it is not in this table, the Worker's logs are the
next place to look:

```bash
npx wrangler tail
```

Unhandled errors are logged as JSON with the path and method on them.

---

## 9. How to change things

**Where things live.** Four files matter:

| File | What it holds |
|---|---|
| `src/index.js` | Routing, database queries, form handling. The whole request path, starting at `export default { async fetch(...) }` near the bottom |
| `src/views.js` | Every page. All the HTML, plus the site-wide `CSS` constant at the top |
| `src/lib.js` | Helpers: escaping, the 5am night rollover, IDs and host tokens, cookies, money parsing |
| `schema.sql` and `migrations/*.sql` | The database shape |

**To change how a page looks**, edit `src/views.js`. The exported page
functions are `signupPage`, `stagePage`, `hostPage`, `posterPage`,
`landingPage`, `rightsPage` and `errorPage`. Colours and typography are in the
`CSS` template literal at the top of the file. Everything user-supplied goes
through `esc()` before it is put in the HTML. Keep it that way.

**To add or change a route**, edit the `fetch` handler at the bottom of
`src/index.js`. It splits the path into `parts` and matches on them. If you add
a new top-level path, add it to the `RESERVED` set as well, otherwise it will
collide with a venue slug.

**To add a database column or table**, add a new migration. Do not edit
`schema.sql` for changes to an existing deployment, because it drops tables.
Number the file after the highest existing one:

```bash
printf -- '-- what this does and why\nALTER TABLE venues ADD COLUMN example TEXT;\n' > migrations/007_example.sql
```

Apply it locally, test, then apply it remotely:

```bash
npx wrangler d1 execute openmic --local  --yes --file=./migrations/007_example.sql
npx wrangler d1 execute openmic --remote --yes --file=./migrations/007_example.sql
```

Note that these migrations are not tracked in a migration table and are not
idempotent. `ALTER TABLE ... ADD COLUMN` fails if the column already exists.
`setup.sh` deliberately ignores those failures and prints `skipped`. Use
`CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` where you can, as
migrations 002 and 005 do.

**To redeploy** after any code change:

```bash
npm run deploy
```

That is `wrangler deploy`. There is no build step. Deploys take seconds.

**Before you deploy**, run it locally and click through it:

```bash
npm run dev
```

There is no test suite in this repository. Clicking through is the test suite.

---

## 10. Running your own copy, for your own city

This is the intended outcome, not a grudging concession. `HELP.md` says it
plainly: ten people running their own copy badly beats one person running all
of them, because the second version dies when that person gets sick.

**What to change** for a different city:

- **The acknowledgement of Country.** `ACKNOWLEDGEMENT` in `src/views.js` names
  the Wurundjeri Woi Wurrung and Bunurong peoples, because that is Melbourne.
  If you are somewhere else, this is wrong and you must change it. Find out
  whose Country your venues are on. If you are outside Australia, replace or
  remove it as appropriate.
- **The rights page**, `rightsPage()` in `src/views.js`. It is specific to
  Australia: Musicians Australia's minimum fee, APRA AMCOS, the Live
  Performance Award, Support Act, Rainbow Door and Switchboard Victoria. All of
  those numbers and organisations are local. Wrong information here is worse
  than none, so either research the equivalents for your place or cut the page.
- **The landing page**, `landingPage()`, which says Melbourne and describes the
  original author's deal with venues. That deal is his, not yours. Say what
  your own arrangement is.
- **The database location.** `--location apac` is a hint for Asia Pacific. The
  other choices `wrangler d1 create` accepts are `weur`, `eeur`, `oc`, `wnam`
  and `enam`. Pick the one nearest your venues.
- **The 5am rollover**, `NIGHT_ROLLOVER_HOURS` in `src/lib.js`, and the
  `Australia/Melbourne` timezone in `melbourneNight()` and `melbourneTime()`.
  Change both if your nights run to different hours or you are in a different
  timezone.
- **The Worker name**, `name` in `wrangler.jsonc`, which decides your
  `*.workers.dev` subdomain.

You do not need to ask anyone's permission to do this, and you do not need to
tell anyone. The licence exists so that you do not have to.

**What the AGPL asks of you.** The code is AGPL-3.0. The full text is in
`LICENSE`, and `LICENSING.md` explains the reasoning. In short:

- You may use it, modify it, and run it, for anything, including commercially.
- If you run a **modified** version as a network service, meaning other people
  use it over the internet, you must make your modified source available to
  those users. That is the clause that separates AGPL from GPL, and it is the
  entire point of choosing it.
- You must keep the licence and the copyright notices intact, and your
  modifications must be released under AGPL-3.0 as well.
- There is no warranty.

The practical version: publish your fork on a public repository, and link to it
from your site. That satisfies it, and it takes about five minutes.

The documentation in this repository, including this file, is CC BY-SA 4.0. The
name and any branding are handled separately, in `LICENSING.md`.

This is not legal advice. If the licence terms matter to your situation, read
`LICENSE` yourself.

---

## Known rough edges

Honest list, from reading the code:

- `README.md`'s setup instructions omit the migrations, so following them alone
  produces a site where venue pages fail.
- `npm run db:local` and `npm run db:remote` only apply `schema.sql`, never the
  migrations.
- `schema.sql` drops tables, which makes `npm run db:remote` destructive.
- The committed `wrangler.jsonc` contains a real `database_id`, which causes
  `setup.sh` to skip creating a database on a fresh clone.
- `README.md`'s page table does not list `/rights`, which exists and is linked
  from several pages.
- `README.md` says you get three links back from `/admin/new`. You get four.
- Migrations start at `002`. There is no `001`; `schema.sql` fills that role.
- Migrations 003 and 004 add columns to `nights` that migration 005 supersedes
  with the `crew` table. The old columns remain and are unused.
- `slot_minutes` is stored on every venue but is not on the admin form and is
  not displayed anywhere.
- There is no rate limiting. Anyone with the sign-up URL can add names. This is
  item 3 on the wanted list in `HELP.md`.
- There is no test suite.

These are not reasons to avoid it. They are the things to fix first if you want
to help. `HELP.md` has the author's own priority order.
