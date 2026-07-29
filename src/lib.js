// Shared helpers: escaping, time, ids, responses.

export function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// A "night" is a local Melbourne date that rolls over at 5am, so a gig running
// past midnight stays on the same running order.
const NIGHT_ROLLOVER_HOURS = 5;

export function melbourneNight(now = new Date()) {
  // Subtracting five hours from the absolute instant looks equivalent and is
  // not. On the first Sunday in April an hour repeats, so absolute arithmetic
  // rolls the night over at 4am instead of 5am, and a gig still running would
  // silently split into two running orders. Do the subtraction on the local
  // calendar instead, where 5am means 5am whatever the clocks did.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  const [y, m, d] = [Number(get('year')), Number(get('month')), Number(get('day'))];
  if (Number(get('hour')) >= NIGHT_ROLLOVER_HOURS) {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  // Before 5am, the night belongs to the previous calendar day. UTC maths is
  // safe here because it is pure date arithmetic, with no timezone left in it.
  const prev = new Date(Date.UTC(y, m - 1, d) - 86400000);
  return prev.toISOString().slice(0, 10);
}

export function melbourneTime(now = new Date()) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now);
}

export function newId() {
  return crypto.randomUUID();
}

// URL-safe token used as the host's secret dashboard link.
export function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Accepts anything a person might type in a pub: "@name", "name",
// "instagram.com/name", "https://www.instagram.com/name/?hl=en". Returns a bare
// handle, or '' if there is nothing usable. Instagram handles are letters,
// numbers, full stops and underscores, up to 30 characters.
export function instagramHandle(v) {
  let s = String(v ?? '').trim();
  if (!s) return '';
  s = s.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  s = s.replace(/^instagram\.com\//i, '');
  s = s.split(/[/?#]/)[0];
  s = s.replace(/^@+/, '');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(s)) return '';
  return s;
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin',
      // Styles are inline in layout(); there is no JavaScript anywhere in this
      // app and no external asset of any kind, so the policy can be this tight.
      // script-src 'self' covers /static/stage.js, which keeps the screen behind
      // the bar alive through a wifi drop. connect-src 'self' lets it poll.
      'content-security-policy':
        "default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; img-src data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      'x-frame-options': 'DENY',
      'strict-transport-security': 'max-age=15552000',
    },
  });
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function redirect(location) {
  return new Response(null, { status: 303, headers: { location } });
}

// Trim and hard-cap free text so a bad actor cannot bloat the row.
export function clean(v, max) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/\s+/g, ' ').trim().slice(0, max);
}

// Performers have no account. After signing up we drop a cookie so their own
// phone can show them their drink token and their share of the jar.
export function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function cookieHeader(name, value, path) {
  // 14 hours covers the longest night and expires well before the next one.
  return `${name}=${encodeURIComponent(value)}; Path=${path}; Max-Age=50400; HttpOnly; Secure; SameSite=Lax`;
}

export function moneyAU(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Accepts "84", "84.50", "$84.50" and returns whole cents.
export function centsFromInput(v) {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''));
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(Math.round(n * 100), 10_000_00);
}

export function clampInt(v, min, max, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
