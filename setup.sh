#!/usr/bin/env bash
# Stand up your own copy of openmic, from nothing, in one command.
#
#   ./setup.sh
#
# Creates the D1 database, wires it into wrangler.jsonc, applies the schema and
# every migration, sets your admin key, and deploys. Safe to re-run: every step
# checks whether it has already been done.
#
# You need: Node 18+, and a free Cloudflare account.
# You do not need: a paid plan, a domain, or any prior Cloudflare knowledge.
#
# AGPL-3.0. If you run a modified version as a service, publish your source.

set -euo pipefail

DB_NAME="${OPENMIC_DB_NAME:-openmic}"
WRANGLER="npx --yes wrangler@4"

say()  { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[33m    %s\033[0m\n' "$*"; }
die()  { printf '\033[31m    %s\033[0m\n' "$*" >&2; exit 1; }

cd "$(dirname "$0")"

# ---------------------------------------------------------------- prerequisites
command -v node >/dev/null || die "Node.js is not installed. Get it from nodejs.org, then re-run."
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 18 ] || die "Node 18+ required, found $(node -v)."

say "Installing dependencies"
npm install --silent

# ------------------------------------------------------------------------ login
say "Checking your Cloudflare login"
if $WRANGLER whoami 2>&1 | grep -q "not authenticated"; then
  warn "Opening a browser so you can log in to Cloudflare."
  $WRANGLER login
else
  warn "Already logged in."
fi

# --------------------------------------------------------------------- database
say "Setting up the database"
# The committed wrangler.jsonc carries the original author's database_id. That
# database is not in YOUR account, so we check whether the configured id is one
# you can actually reach. If it is not, you get your own.
CONFIGURED_ID=$(grep -oE '"database_id": *"[0-9a-f-]{36}"' wrangler.jsonc 2>/dev/null \
  | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1 || true)
YOURS=""
if [ -n "$CONFIGURED_ID" ]; then
  if $WRANGLER d1 info "$CONFIGURED_ID" >/dev/null 2>&1; then
    YOURS="yes"
  else
    warn "The database_id in wrangler.jsonc belongs to someone else's account."
    warn "Creating your own instead. This is expected on a fresh clone."
  fi
fi

if [ -n "$YOURS" ]; then
  warn "Using the D1 database already configured in wrangler.jsonc."
else
  warn "Creating D1 database '$DB_NAME' (in APAC, so queries stay near your venues)."
  CREATE_OUT=$($WRANGLER d1 create "$DB_NAME" --location apac 2>&1 || true)
  DB_ID=$(printf '%s' "$CREATE_OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)

  if [ -z "$DB_ID" ]; then
    # Already existed, or the output format changed. Look it up instead.
    DB_ID=$($WRANGLER d1 info "$DB_NAME" --json 2>/dev/null \
      | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1 || true)
  fi
  [ -n "$DB_ID" ] || die "Could not create or find the database. Output was:\n$CREATE_OUT"

  cp wrangler.jsonc wrangler.jsonc.bak
  # Replace the placeholder or existing id with this one.
  node -e '
    const fs = require("fs");
    const [file, name, id] = process.argv.slice(1);
    let s = fs.readFileSync(file, "utf8");
    s = s.replace(/"database_name":\s*"[^"]*"/, `"database_name": "${name}"`);
    s = s.replace(/"database_id":\s*"[^"]*"/, `"database_id": "${id}"`);
    fs.writeFileSync(file, s);
  ' wrangler.jsonc "$DB_NAME" "$DB_ID"
  warn "Database created and wired in. (Backup of your old config: wrangler.jsonc.bak)"
fi

say "Applying schema and migrations"
$WRANGLER d1 execute "$DB_NAME" --remote --yes --file=./schema.sql >/dev/null 2>&1 \
  || warn "Schema already applied, or partially. Continuing."
for m in $(ls migrations/*.sql 2>/dev/null | sort); do
  $WRANGLER d1 execute "$DB_NAME" --remote --yes --file="$m" >/dev/null 2>&1 \
    && warn "applied $m" \
    || warn "skipped $m (already applied)"
done

# ------------------------------------------------------------------ admin key
say "Setting your admin key"
if $WRANGLER secret list 2>/dev/null | grep -q ADMIN_KEY; then
  warn "ADMIN_KEY already set. Leaving it alone."
else
  if [ -n "${OPENMIC_ADMIN_KEY:-}" ]; then
    KEY="$OPENMIC_ADMIN_KEY"
    warn "Using OPENMIC_ADMIN_KEY from your environment."
  else
    KEY=$(node -e 'console.log(require("crypto").randomBytes(24).toString("base64url"))')
    warn "Generated a random admin key. It is printed once, at the end. Save it."
  fi
  printf '%s' "$KEY" | $WRANGLER secret put ADMIN_KEY >/dev/null
  GENERATED_KEY="$KEY"
fi

# ----------------------------------------------------------------------- deploy
say "Deploying"
DEPLOY_OUT=$($WRANGLER deploy 2>&1) || { printf '%s\n' "$DEPLOY_OUT"; die "Deploy failed."; }
URL=$(printf '%s' "$DEPLOY_OUT" | grep -oE 'https://[a-z0-9.-]+\.workers\.dev' | head -1)

# ------------------------------------------------------------------------ done
say "Done"
cat <<EOF

  Your copy is live${URL:+ at $URL}.

  Next:
    1. Go to ${URL:-<your url>}/admin/new and create your first venue.
    2. You get back three links: the public sign-up page, a printable QR
       poster for the bar, and the private host link. Send the host link to
       whoever runs the night. That link is the password, so treat it like one.
    3. Print the poster. Put it on the bar. That is the whole install.

EOF

if [ -n "${GENERATED_KEY:-}" ]; then
  cat <<EOF
  Your admin key (needed for /admin/new). This is shown once:

      $GENERATED_KEY

EOF
fi

cat <<'EOF'
  It is free to run. Cloudflare's free tier covers a normal night many times
  over, and there is no paid tier in this project to upgrade to.

  If you change anything and run it for other people, the licence (AGPL-3.0)
  asks you to publish your source. That is the only string attached.

  Something broken or confusing? That is worth telling me about: see HELP.md.

EOF
