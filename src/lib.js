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
  const shifted = new Date(now.getTime() - NIGHT_ROLLOVER_HOURS * 3600 * 1000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(shifted);
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
