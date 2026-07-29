import QRCode from 'qrcode-svg';
import {
  clampInt,
  centsFromInput,
  clean,
  cookieHeader,
  esc,
  html,
  instagramHandle,
  json,
  melbourneNight,
  moneyAU,
  newId,
  newToken,
  readCookie,
  redirect,
  slugify,
} from './lib.js';
import {
  errorPage,
  hostPage,
  landingPage,
  posterPage,
  rightsPage,
  signupPage,
  stagePage,
} from './views.js';

// The screen behind the bar is unattended for four hours. A meta refresh turns
// one failed request into a browser error page that never retries, so a
// two-second wifi blip used to kill the display for the rest of the night.
//
// This polls instead, keeps the last good list on screen when the network is
// away, and says so quietly rather than going blank. Nobody has to notice.
const STAGE_JS = `(function () {
  var el = document.getElementById('stage');
  var stale = document.getElementById('stale');
  if (!el) return;
  var slug = location.pathname.split('/').filter(Boolean)[0];
  var lastGood = Date.now();
  var fails = 0;

  function two(n) { return n < 10 ? '0' + n : '' + n; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(d) {
    var who = d.onstage || d.next;
    var html = '<div class="lbl">' + (d.onstage ? 'On stage now' : 'Up next') + '</div>';
    html += '<div class="now">' + esc(who ? who.name : 'Open mic') + '</div>';
    if (who && who.instagram) {
      html += '<div class="lbl" style="margin-top:.4em;opacity:.85">@' + esc(who.instagram) + '</div>';
    }
    if (d.onstage && d.next) {
      html += '<div class="next">Next up: <b>' + esc(d.next.name) + '</b></div>';
    } else if (!d.onstage && d.then) {
      html += '<div class="next">Then: <b>' + esc(d.then.name) + '</b></div>';
    } else if (!d.waiting && !d.onstage) {
      html += '<div class="next">Sign up at <b>' + esc(d.slug) + '</b> \u2014 scan the QR on the bar</div>';
    }
    html += '<div class="next" style="font-size:1rem;margin-top:2.5em;opacity:.5">'
         + esc(d.venue) + ' \u00b7 ' + d.waiting + ' still to play</div>';
    el.innerHTML = html;
  }

  function tick() {
    fetch('/' + slug + '/stage.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        render(d);
        lastGood = Date.now();
        fails = 0;
        if (stale) stale.style.display = 'none';
      })
      .catch(function () {
        // Keep whatever is on screen. Only admit it once it is genuinely old.
        fails++;
        if (stale && Date.now() - lastGood > 60000) {
          var t = new Date(lastGood);
          stale.textContent = 'Reconnecting \u2014 list as at ' + two(t.getHours()) + ':' + two(t.getMinutes());
          stale.style.display = 'block';
        }
      });
  }

  setInterval(tick, 10000);
  tick();
  // A phone or tablet that slept comes back straight away rather than waiting.
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) tick();
  });
  window.addEventListener('online', tick);
})();`;

// Two behaviours the pages need and CSP will not allow inline: a confirmation
// before anything destructive, and the print button on the poster. An inline
// onsubmit is blocked silently, which means a "there is no undo" guard that
// never fires. Served from /static so script-src can stay 'self'.
const UI_JS = `(function () {
  document.addEventListener('submit', function (e) {
    var msg = e.target.getAttribute && e.target.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) e.preventDefault();
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute('data-print')) window.print();
  });
})();`;

// The sign-up page used to reload itself every 45 seconds. That wiped whatever
// someone was typing, shipped the whole page each time, and accounted for four
// out of every five requests the app served. This updates only the list.
const ORDER_JS = `(function () {
  var ol = document.getElementById('order');
  if (!ol) return;
  var slug = location.pathname.split('/').filter(Boolean)[0];
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function badge(st) {
    if (st === 'onstage') return '<span class="badge">On now</span>';
    if (st === 'done') return '<span class="badge grey">Done</span>';
    if (st === 'noshow') return '<span class="badge grey">No show</span>';
    return '';
  }
  function tick() {
    // Never interrupt someone mid-typing.
    var a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'SELECT' || a.tagName === 'TEXTAREA')) return;
    fetch('/' + slug + '/list.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        ol.innerHTML = d.performers.map(function (p) {
          var line = [];
          if (p.act) line.push(p.act);
          line.push(p.songs + (p.songs === 1 ? ' song' : ' songs'));
          var ig = p.instagram
            ? ' \u00b7 <a class="inline" href="https://instagram.com/' + esc(p.instagram) +
              '" target="_blank" rel="noopener nofollow">@' + esc(p.instagram) + '</a>'
            : '';
          return '<li class="' + esc(p.status) + '"><span class="num"></span>' +
            '<span class="who"><b>' + esc(p.name) + '</b><small>' +
            esc(line.join(' \u00b7 ')) + ig + '</small></span>' + badge(p.status) + '</li>';
        }).join('');
      })
      .catch(function () { /* keep what is on screen */ });
  }
  setInterval(tick, 20000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  window.addEventListener('online', tick);
})();`;

// Which performer is this phone? Set on sign-up, scoped to the venue path.
function meCookieName(slug) {
  return `om_${slug.replace(/[^a-z0-9]/g, '')}`;
}

async function getMe(request, env, venue, night) {
  const id = readCookie(request, meCookieName(venue.slug));
  if (!id) return null;
  return env.DB.prepare(
    'SELECT * FROM performers WHERE id = ? AND venue_slug = ? AND night = ?',
  )
    .bind(id, venue.slug, night)
    .first();
}

const RESERVED = new Set([
  'admin',
  'api',
  'favicon.ico',
  'robots.txt',
  'rights',
  'static',
]);

async function getVenue(env, slug) {
  return env.DB.prepare('SELECT * FROM venues WHERE slug = ?').bind(slug).first();
}

async function getVenueByToken(env, slug, token) {
  return env.DB.prepare('SELECT * FROM venues WHERE slug = ? AND host_token = ?')
    .bind(slug, token)
    .first();
}

async function getNight(env, slug, night) {
  return env.DB.prepare(
    'SELECT * FROM nights WHERE venue_slug = ? AND night = ?',
  )
    .bind(slug, night)
    .first();
}

async function getCrew(env, slug, night) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM crew WHERE venue_slug = ? AND night = ? ORDER BY created_at ASC',
  )
    .bind(slug, night)
    .all();
  return results || [];
}

// Even split of the jar across everyone who actually played. Remainder stays
// in the jar rather than quietly rounding someone short.
function computeSplit(nightRow, performers) {
  const total = nightRow ? nightRow.tip_total_cents : 0;
  const played = performers.filter(
    (p) => p.status === 'done' || p.status === 'onstage',
  ).length;
  if (!total || !played) return { each: 0, count: played, total: moneyAU(total) };
  const each = Math.floor(total / played);
  return {
    each,
    eachLabel: moneyAU(each),
    count: played,
    total: moneyAU(total),
  };
}

async function getPerformers(env, slug, night) {
  const { results } = await env.DB.prepare(
    `SELECT * FROM performers WHERE venue_slug = ? AND night = ?
     ORDER BY position ASC, created_at ASC`,
  )
    .bind(slug, night)
    .all();
  return results || [];
}

// Per-IP sign-up throttle. The screen behind the bar shows performer names at
// 6rem and refreshes every 15 seconds, so filling a list with junk is the worst
// thing that can be done to a room without any vulnerability at all.
// The threshold has to survive the thing that actually happens in a pub: fifty
// people on the venue's wifi all sign up in the first ten minutes, sharing one
// NAT address. To this code that is one visitor. A tight limit would lock the
// room out of its own night, which is far worse than the abuse it prevents.
//
// So: loose enough that a real rush never trips it, tight enough that a script
// cannot fill the screen behind the bar. The proven attack was 200 sign-ups in
// 1.26 seconds. This caps that at 40 and stops the rest.
const SIGNUP_WINDOW_SECONDS = 120;
const SIGNUP_MAX_PER_WINDOW = 40;

async function hashIp(request, night) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const data = new TextEncoder().encode(`${night}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signupThrottled(env, request, venue, night) {
  const ipHash = await hashIp(request, night);
  const since = new Date(Date.now() - SIGNUP_WINDOW_SECONDS * 1000).toISOString();
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM signup_hits
      WHERE ip_hash = ? AND venue_slug = ? AND created_at > ?`,
  )
    .bind(ipHash, venue.slug, since)
    .first();
  // Never below the room's own capacity, or a big night blocks itself.
  const ceiling = Math.max(SIGNUP_MAX_PER_WINDOW, (venue.capacity || 0) + 10);
  return (row?.n || 0) >= ceiling;
}

// Recorded only when someone actually gets on the list. Counting every POST
// meant a person who mistyped their name four times was locked out before they
// had succeeded once.
async function recordSignup(env, request, venue, night) {
  const ipHash = await hashIp(request, night);
  await env.DB.prepare(
    'INSERT INTO signup_hits (ip_hash, venue_slug, night, created_at) VALUES (?, ?, ?, ?)',
  )
    .bind(ipHash, venue.slug, night, new Date().toISOString())
    .run();
}

// Sign-up outcomes are redirected, not rendered in the POST response. A page
// rendered at /:slug/join carries the sign-up page's own auto-refresh, and that
// refresh re-requests a POST-only path, so the browser lands on "Not found."
// Someone is told the list is full, pockets their phone, looks again and the
// app appears broken. Redirect to the venue page and say it there.
const JOIN_MESSAGES = {
  closed: 'Sign-ups are closed for tonight.',
  noname: 'Put a name in so the host knows who to call up.',
  full: "Tonight's list is full.",
  filled: "Tonight's list filled up while you were typing. Ask the host.",
  dupe: 'That name is already on the list. Talk to the host if that is not you.',
  rate: 'That is a lot of sign-ups from this connection in a short time. Wait a couple of minutes, or ask the host to add you.',
};

function joinOutcome(venue, code) {
  return redirect(`/${venue.slug}?e=${code}`);
}

async function handleJoin(request, env, venue) {
  const night = melbourneNight();
  const form = await request.formData();
  const name = clean(form.get('name'), 60);

  if (await signupThrottled(env, request, venue, night)) {
    return joinOutcome(venue, 'rate');
  }

  if (!venue.signups_open) return joinOutcome(venue, 'closed');
  if (!name) return joinOutcome(venue, 'noname');

  const existing = await getPerformers(env, venue.slug, night);
  if (existing.length >= venue.capacity) return joinOutcome(venue, 'full');
  // Cheap duplicate guard — same name, same night. The unique index is the
  // real one; this just gives a friendlier answer before the write.
  if (existing.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    return joinOutcome(venue, 'dupe');
  }


  // Opt-in is explicit and defaults off. An email is only stored when they
  // actually ticked the box — otherwise we have no business keeping it.
  const optedIn = form.get('label_optin') === '1' ? 1 : 0;
  const id = newId();

  // Capacity is enforced in the INSERT itself, not by the read above, so
  // concurrent sign-ups cannot race past the limit. The unique index on
  // (venue_slug, night, lower(name)) does the same job for duplicates.
  try {
    const res = await env.DB.prepare(
      `INSERT INTO performers (id, venue_slug, night, name, act, songs, phone, needs,
        instagram, position, status, created_at, label_optin, contact_email)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?,
              (SELECT COALESCE(MAX(position), 0) + 1 FROM performers
                WHERE venue_slug = ? AND night = ?),
              'waiting', ?, ?, ?
        WHERE (SELECT COUNT(*) FROM performers WHERE venue_slug = ? AND night = ?) < ?`,
    )
      .bind(
        id,
        venue.slug,
        night,
        name,
        clean(form.get('act'), 30),
        clampInt(form.get('songs'), 1, venue.max_songs, 2),
        clean(form.get('phone'), 20),
        clean(form.get('needs'), 80),
        instagramHandle(form.get('instagram')),
        venue.slug,
        night,
        new Date().toISOString(),
        optedIn,
        optedIn ? clean(form.get('contact_email'), 90) : '',
        venue.slug,
        night,
        venue.capacity,
      )
      .run();

    if (!res.meta || res.meta.changes === 0) return joinOutcome(venue, 'filled');
  } catch (err) {
    // The unique index fired: someone with this name is already on tonight.
    if (String(err).includes('UNIQUE')) return joinOutcome(venue, 'dupe');
    throw err;
  }

  await recordSignup(env, request, venue, night);

  // Redirect on success too, so a refresh or a back button cannot resubmit the
  // form. A nervous person taps that button twice; they should not end up on
  // the list twice or see a browser resend warning.
  const placed = await env.DB.prepare(
    'SELECT position FROM performers WHERE id = ?',
  )
    .bind(id)
    .first();
  const res = redirect(`/${venue.slug}?joined=${placed ? placed.position : 1}`);
  res.headers.append(
    'set-cookie',
    cookieHeader(meCookieName(venue.slug), id, `/${venue.slug}`),
  );
  return res;
}

async function handleHostAction(request, env, venue) {
  const night = melbourneNight();
  const form = await request.formData();
  const action = clean(form.get('action'), 20);
  const id = clean(form.get('id'), 40);
  const base = `/${venue.slug}/host/${venue.host_token}`;

  if (action === 'open' || action === 'close') {
    await env.DB.prepare('UPDATE venues SET signups_open = ? WHERE slug = ?')
      .bind(action === 'open' ? 1 : 0, venue.slug)
      .run();
    return redirect(base);
  }

  if (action === 'jar') {
    await env.DB.prepare(
      `INSERT INTO nights (venue_slug, night, tip_total_cents, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(venue_slug, night)
       DO UPDATE SET tip_total_cents = excluded.tip_total_cents,
                     updated_at = excluded.updated_at`,
    )
      .bind(
        venue.slug,
        night,
        centsFromInput(form.get('total')),
        new Date().toISOString(),
      )
      .run();
    return redirect(base);
  }

  if (action === 'crew_add') {
    const cname = clean(form.get('name'), 60);
    const role = clean(form.get('role'), 40);
    if (cname && role) {
      await env.DB.prepare(
        `INSERT INTO crew (id, venue_slug, night, name, role, paid, contact,
          share_optin, created_at, credit_optin)
         VALUES (?, ?, ?, ?, ?, ?, '', ?, ?, ?)`,
      )
        .bind(
          newId(),
          venue.slug,
          night,
          cname,
          role,
          clean(form.get('paid'), 10) || 'unknown',
          form.get('share_optin') === '1' ? 1 : 0,
          new Date().toISOString(),
          form.get('credit_optin') === '1' ? 1 : 0,
        )
        .run();
    }
    return redirect(base);
  }

  if (action === 'crew_rm') {
    await env.DB.prepare('DELETE FROM crew WHERE id = ? AND venue_slug = ?')
      .bind(id, venue.slug)
      .run();
    return redirect(base);
  }

  if (action === 'reset') {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM performers WHERE venue_slug = ? AND night = ?')
        .bind(venue.slug, night),
      // Clear the throttle too. Otherwise clearing the list locks everyone who
      // just signed up out of signing up again.
      env.DB.prepare('DELETE FROM signup_hits WHERE venue_slug = ? AND night = ?')
        .bind(venue.slug, night),
    ]);
    return redirect(base);
  }

  // The host link is a bearer credential that lives in an address bar, gets
  // bookmarked on a bar tablet and screenshotted into group chats. There has to
  // be a way to kill it. This issues a new one and breaks every old copy.
  if (action === 'rotate_link') {
    const fresh = newToken();
    await env.DB.prepare('UPDATE venues SET host_token = ? WHERE slug = ?')
      .bind(fresh, venue.slug)
      .run();
    return redirect(`/${venue.slug}/host/${fresh}?rotated=1`);
  }

  // Scrub tonight's contact details on demand. The sign-up form promises the
  // phone number is for tonight's running order, so the host can honour that
  // without waiting for the scheduled purge.
  if (action === 'purge_contacts') {
    // Clear the email too. Setting contact_purged_at makes the retention cron
    // skip this row forever, so anything left behind here is kept for good.
    await env.DB.prepare(
      `UPDATE performers SET phone = '', contact_email = '', contact_purged_at = ?
        WHERE venue_slug = ? AND night = ?`,
    )
      .bind(new Date().toISOString(), venue.slug, night)
      .run();
    return redirect(base);
  }

  if (action === 'add') {
    const name = clean(form.get('name'), 60);
    if (!name) return redirect(base);
    await env.DB.prepare(
      `INSERT INTO performers (id, venue_slug, night, name, act, songs, phone, needs,
        position, status, created_at)
       SELECT ?, ?, ?, ?, 'Walk-in', ?, '', '',
              (SELECT COALESCE(MAX(position), 0) + 1 FROM performers
                WHERE venue_slug = ? AND night = ?),
              'waiting', ?`,
    )
      .bind(
        newId(),
        venue.slug,
        night,
        name,
        clampInt(form.get('songs'), 1, venue.max_songs, 2),
        venue.slug,
        night,
        new Date().toISOString(),
      )
      .run();
    return redirect(base);
  }

  if (!id) return redirect(base);

  if (action === 'remove') {
    await env.DB.prepare('DELETE FROM performers WHERE id = ? AND venue_slug = ?')
      .bind(id, venue.slug)
      .run();
    return redirect(base);
  }

  if (action === 'onstage') {
    // Only one act on stage at a time; whoever was on is marked done.
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE performers SET status = 'done'
         WHERE venue_slug = ? AND night = ? AND status = 'onstage'`,
      ).bind(venue.slug, night),
      env.DB.prepare(
        `UPDATE performers SET status = 'onstage' WHERE id = ? AND venue_slug = ?`,
      ).bind(id, venue.slug),
    ]);
    return redirect(base);
  }

  if (action === 'done' || action === 'noshow') {
    await env.DB.prepare(
      'UPDATE performers SET status = ? WHERE id = ? AND venue_slug = ?',
    )
      .bind(action, id, venue.slug)
      .run();
    return redirect(base);
  }

  // Fixing a typo used to mean remove and re-add, which silently destroyed that
  // person's phone number, Instagram, act type and their place in the order.
  // Someone spells their own name wrong at 8pm and pays for it all night.
  if (action === 'edit') {
    const newName = clean(form.get('name'), 60);
    if (!newName) return redirect(base);
    try {
      await env.DB.prepare(
        `UPDATE performers
            SET name = ?, act = ?, songs = ?, instagram = ?, needs = ?
          WHERE id = ? AND venue_slug = ? AND night = ?`,
      )
        .bind(
          newName,
          clean(form.get('act'), 30),
          clampInt(form.get('songs'), 1, venue.max_songs, 2),
          instagramHandle(form.get('instagram')),
          clean(form.get('needs'), 80),
          id,
          venue.slug,
          night,
        )
        .run();
    } catch (err) {
      // Renaming onto someone already on the list hits the unique index.
      if (!String(err).includes('UNIQUE')) throw err;
      return redirect(`${base}?e=dupe`);
    }
    return redirect(base);
  }

  if (action === 'up' || action === 'down') {
    // Swapping two rows' position values assumes those values are distinct.
    // Under a rush they are not: concurrent inserts can land on the same
    // number, and a swap between two equal values is a silent no-op. The host
    // taps the arrow, nothing moves, and there is nothing to see.
    //
    // So don't swap. Reorder the list in memory and renumber every row from 1.
    // That is correct whatever state the positions were in, and it repairs any
    // collisions already in the database on the first tap.
    const list = await getPerformers(env, venue.slug, night);
    const i = list.findIndex((p) => p.id === id);
    const j = action === 'up' ? i - 1 : i + 1;
    if (i !== -1 && j >= 0 && j < list.length) {
      const reordered = list.slice();
      [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
      await env.DB.batch(
        reordered.map((p, idx) =>
          env.DB.prepare('UPDATE performers SET position = ? WHERE id = ?').bind(
            idx + 1,
            p.id,
          ),
        ),
      );
    }
    return redirect(base);
  }

  return redirect(base);
}

// Compare in time that does not depend on how many characters matched. The
// timing channel here is nanoseconds against network jitter, so nobody was ever
// going to use it, but it costs four lines to remove the question entirely.
function timingSafeEqual(a, b) {
  const x = new TextEncoder().encode(String(a));
  const y = new TextEncoder().encode(String(b));
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

async function handleAdminCreate(request, env, origin) {
  const form = await request.formData();
  const key = clean(form.get('key'), 100);
  if (!env.ADMIN_KEY || !timingSafeEqual(key, env.ADMIN_KEY)) {
    return html(errorPage('Nope.', 403), 403);
  }
  const name = clean(form.get('name'), 80);
  if (!name) return html(errorPage('Venue needs a name.', 400), 400);

  const slug = slugify(form.get('slug') || name);
  if (!slug || RESERVED.has(slug)) {
    return html(errorPage('Pick a different slug.', 400), 400);
  }
  if (await getVenue(env, slug)) {
    return html(errorPage(`"${slug}" is already taken.`, 409), 409);
  }

  const token = newToken();
  await env.DB.prepare(
    `INSERT INTO venues (slug, name, suburb, host_token, host_name, night_label,
      max_songs, slot_minutes, capacity, signups_open, blurb, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
  )
    .bind(
      slug,
      name,
      clean(form.get('suburb'), 60),
      token,
      clean(form.get('host_name'), 60),
      clean(form.get('night_label'), 80),
      clampInt(form.get('max_songs'), 1, 10, 2),
      clampInt(form.get('slot_minutes'), 3, 60, 10),
      clampInt(form.get('capacity'), 1, 200, 40),
      clean(form.get('blurb'), 300),
      new Date().toISOString(),
    )
    .run();

  return html(
    `<!doctype html><meta charset="utf-8"><title>Created</title>
<body style="font:16px system-ui;max-width:640px;margin:40px auto;padding:0 16px">
<h1>${esc(name)} is live</h1>
<p><b>Send the venue:</b><br>
Sign-up page: <a href="${origin}/${slug}">${origin}/${slug}</a><br>
Poster to print: <a href="${origin}/${slug}/poster">${origin}/${slug}/poster</a><br>
Big screen: <a href="${origin}/${slug}/stage">${origin}/${slug}/stage</a></p>
<p><b>Host link (private — this is the password):</b><br>
<a href="${origin}/${slug}/host/${token}">${origin}/${slug}/host/${token}</a></p>
<p><a href="/admin/new">Add another</a></p></body>`,
  );
}

function adminForm() {
  return html(`<!doctype html><meta charset="utf-8"><title>New venue</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<body style="font:16px system-ui;max-width:520px;margin:40px auto;padding:0 16px">
<h1>New venue</h1>
<form method="post">
<p><label>Admin key<br><input name="key" type="password" required style="width:100%;padding:8px"></label></p>
<p><label>Venue name<br><input name="name" required style="width:100%;padding:8px"></label></p>
<p><label>URL slug (blank = from name)<br><input name="slug" style="width:100%;padding:8px"></label></p>
<p><label>Suburb<br><input name="suburb" style="width:100%;padding:8px"></label></p>
<p><label>Host name<br><input name="host_name" style="width:100%;padding:8px"></label></p>
<p><label>When it runs<br><input name="night_label" placeholder="Every Tuesday, 7pm" style="width:100%;padding:8px"></label></p>
<p><label>Max songs per act<br><input name="max_songs" type="number" value="2" style="width:100%;padding:8px"></label></p>
<p><label>Capacity<br><input name="capacity" type="number" value="40" style="width:100%;padding:8px"></label></p>
<p><label>Blurb shown to performers<br><textarea name="blurb" rows="3" style="width:100%;padding:8px"></textarea></label></p>
<p><button type="submit" style="padding:12px 20px;font-size:16px">Create</button></p>
</form></body>`);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = url.origin;
    const parts = url.pathname.split('/').filter(Boolean);
    const method = request.method;

    // Reject oversized bodies before parsing. Every form on this site is a few
    // hundred bytes; 100MB was being accepted and parsed before truncation.
    if (method === 'POST') {
      const len = parseInt(request.headers.get('content-length') || '0', 10);
      if (len > 16 * 1024) {
        return html(errorPage('That request was too large.', 413), 413);
      }
    }

    try {
      if (parts.length === 0) return html(landingPage());

      if (parts[0] === 'static' && parts[1] === 'order.js') {
        return new Response(ORDER_JS, {
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        });
      }

      if (parts[0] === 'static' && parts[1] === 'ui.js') {
        return new Response(UI_JS, {
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        });
      }

      // /static/stage.js — keeps the screen behind the bar alive
      if (parts[0] === 'static' && parts[1] === 'stage.js') {
        return new Response(STAGE_JS, {
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        });
      }

      if (parts[0] === 'robots.txt') {
        return new Response('User-agent: *\nDisallow: /\n', {
          headers: { 'content-type': 'text/plain' },
        });
      }

      if (parts[0] === 'rights') return html(rightsPage());

      if (parts[0] === 'admin' && parts[1] === 'new') {
        if (method === 'POST') return await handleAdminCreate(request, env, origin);
        return adminForm();
      }

      const slug = parts[0];
      if (RESERVED.has(slug)) return html(errorPage('Not found.'), 404);

      const venue = await getVenue(env, slug);
      if (!venue) return html(errorPage('No open mic here yet.'), 404);

      const night = melbourneNight();

      // /:slug
      if (parts.length === 1) {
        if (method === 'POST') return html(errorPage('Not found.'), 404);
        const performers = await getPerformers(env, slug, night);
        const [me, crew, nightRow] = await Promise.all([
          getMe(request, env, venue, night),
          getCrew(env, slug, night),
          getNight(env, slug, night),
        ]);
        const outcome = JOIN_MESSAGES[url.searchParams.get('e') || ''];
        const joinedAt = clampInt(url.searchParams.get('joined'), 1, 999, 0);
        return html(
          signupPage(venue, performers, {
            error: outcome,
            joined: joinedAt || undefined,
            me,
            crew,
            split: computeSplit(nightRow, performers),
          }),
        );
      }

      // /:slug/claim — performer taps "mark as poured" on their own drink
      if (parts[1] === 'claim' && method === 'POST') {
        const me = await getMe(request, env, venue, night);
        if (me) {
          await env.DB.prepare(
            'UPDATE performers SET perk_claimed = 1 WHERE id = ? AND venue_slug = ?',
          )
            .bind(me.id, venue.slug)
            .run();
        }
        return redirect(`/${slug}`);
      }

      // /:slug/join
      if (parts[1] === 'join' && method === 'POST') {
        return await handleJoin(request, env, venue);
      }

      // /:slug/list.json — the running order, for the sign-up page
      if (parts[1] === 'list.json') {
        const list = await getPerformers(env, slug, night);
        return json({
          performers: list.map((p) => ({
            name: p.name,
            act: p.act || '',
            songs: p.songs,
            instagram: p.instagram || '',
            status: p.status,
          })),
        });
      }

      // /:slug/stage.json — state for the big screen, polled by stage.js
      if (parts[1] === 'stage.json') {
        const list = await getPerformers(env, slug, night);
        const onstage = list.find((p) => p.status === 'onstage') || null;
        const queue = list.filter((p) => p.status === 'waiting');
        return json({
          onstage: onstage ? { name: onstage.name, instagram: onstage.instagram || '' } : null,
          next: queue[0] ? { name: queue[0].name, instagram: queue[0].instagram || '' } : null,
          then: queue[1] ? { name: queue[1].name } : null,
          waiting: queue.length,
          venue: venue.name,
          slug: venue.slug,
        });
      }

      // /:slug/stage
      if (parts[1] === 'stage') {
        return html(stagePage(venue, await getPerformers(env, slug, night)));
      }

      // /:slug/poster
      if (parts[1] === 'poster') {
        const qr = new QRCode({
          content: `${origin}/${slug}`,
          padding: 1,
          width: 280,
          height: 280,
          color: '#000000',
          background: '#ffffff',
          ecl: 'M',
          container: 'svg-viewbox',
        }).svg();
        return html(
          posterPage(venue, `<div class="qr" style="max-width:300px">${qr}</div>`, origin),
        );
      }

      // /:slug/host/:token
      if (parts[1] === 'host' && parts[2]) {
        const authed = await getVenueByToken(env, slug, parts[2]);
        if (!authed) return html(errorPage('Bad host link.', 403), 403);

        if (parts[3] === 'act' && method === 'POST') {
          return await handleHostAction(request, env, authed);
        }
        const hostPerformers = await getPerformers(env, slug, night);
        const [hostNight, hostCrew] = await Promise.all([
          getNight(env, slug, night),
          getCrew(env, slug, night),
        ]);
        return html(
          hostPage(authed, hostPerformers, origin, {
            night: hostNight,
            crew: hostCrew,
            split: computeSplit(hostNight, hostPerformers),
          }),
        );
      }

      return html(errorPage('Not found.'), 404);
    } catch (err) {
      console.error(
        JSON.stringify({
          msg: 'unhandled',
          path: url.pathname,
          method,
          error: String(err && err.stack ? err.stack : err),
        }),
      );
      return html(errorPage('Something broke. Try again.', 500), 500);
    }
  },

  // Retention. The sign-up form tells people their phone number is for
  // tonight's running order and that they can have it deleted. Nothing was
  // enforcing either promise: numbers were kept indefinitely, so one leaked
  // host link exposed a venue's entire history rather than a single night.
  //
  // Runs daily. Scrubs phone numbers and any stored contact email from nights
  // older than the retention window, and clears the throttle table.
  async scheduled(event, env, ctx) {
    const RETAIN_NIGHTS = 14;
    const cutoff = melbourneNight(
      new Date(Date.now() - RETAIN_NIGHTS * 86400 * 1000),
    );
    const stamp = new Date().toISOString();
    try {
      const scrubbed = await env.DB.prepare(
        `UPDATE performers SET phone = '', contact_email = '', contact_purged_at = ?
          WHERE night < ? AND contact_purged_at IS NULL`,
      )
        .bind(stamp, cutoff)
        .run();
      const hits = await env.DB.prepare(
        'DELETE FROM signup_hits WHERE created_at < ?',
      )
        .bind(new Date(Date.now() - 86400 * 1000).toISOString())
        .run();
      console.log(
        JSON.stringify({
          msg: 'retention',
          cutoff,
          performers_scrubbed: scrubbed.meta ? scrubbed.meta.changes : null,
          throttle_rows_cleared: hits.meta ? hits.meta.changes : null,
        }),
      );
    } catch (err) {
      console.error(
        JSON.stringify({ msg: 'retention_failed', error: String(err) }),
      );
    }
  },
};
