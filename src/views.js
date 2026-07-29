import { esc, melbourneTime } from './lib.js';

const CSS = `
:root{--bg:#0e0e11;--card:#17171c;--line:#2a2a33;--fg:#f2f2f5;--dim:#9b9baa;
--accent:#ff6b35;--ok:#3ddc84;--warn:#ffd166}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
-webkit-text-size-adjust:100%}
.wrap{max-width:640px;margin:0 auto;padding:20px 16px 64px}
header{padding:24px 0 12px}
h1{font-size:1.6rem;margin:0 0 4px;letter-spacing:-.02em}
h2{font-size:1.05rem;margin:28px 0 10px;color:var(--dim);
text-transform:uppercase;letter-spacing:.08em}
.sub{color:var(--dim);margin:0}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;
padding:16px;margin-bottom:12px}
label{display:block;font-size:.85rem;color:var(--dim);margin:14px 0 6px;
text-transform:uppercase;letter-spacing:.06em}
input,select,textarea{width:100%;padding:14px;font-size:16px;border-radius:10px;
border:1px solid var(--line);background:#101014;color:var(--fg)}
input:focus,select:focus,textarea:focus{outline:2px solid var(--accent);border-color:transparent}
button,.btn{display:inline-block;width:100%;padding:16px;font-size:1.05rem;font-weight:600;
border:0;border-radius:10px;background:var(--accent);color:#fff;cursor:pointer;
margin-top:18px;text-align:center;text-decoration:none}
button:active{transform:translateY(1px)}
.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--fg)}
.row{display:flex;gap:8px;align-items:center}
.row>*{margin-top:0}
ol.list{list-style:none;padding:0;margin:0;counter-reset:slot}
ol.list li{background:var(--card);border:1px solid var(--line);border-radius:12px;
padding:12px 14px;margin-bottom:8px;display:flex;gap:12px;align-items:center}
ol.list li .num{counter-increment:slot;font-weight:700;color:var(--dim);
min-width:26px;font-variant-numeric:tabular-nums}
ol.list li .num::before{content:counter(slot)}
.who{flex:1;min-width:0}
.who b{display:block;font-size:1.05rem}
.who small{color:var(--dim);display:block;white-space:nowrap;overflow:hidden;
text-overflow:ellipsis}
li.onstage{border-color:var(--ok);background:#12241a}
li.done,li.noshow{opacity:.42}
.badge{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;
padding:3px 8px;border-radius:99px;background:var(--ok);color:#04240f;font-weight:700}
.badge.grey{background:var(--line);color:var(--dim)}
.notice{padding:14px;border-radius:10px;margin-bottom:14px;font-weight:500}
.notice.ok{background:#12241a;border:1px solid var(--ok);color:var(--ok)}
.notice.bad{background:#2a1416;border:1px solid #ff6b6b;color:#ff9a9a}
.notice.warn{background:#2a2413;border:1px solid var(--warn);color:var(--warn)}
.muted{color:var(--dim);font-size:.9rem}
.foot{margin-top:40px;padding-top:16px;border-top:1px solid var(--line);
color:var(--dim);font-size:.82rem;text-align:center}
.foot a{color:var(--dim)}
.optin{margin-top:20px;padding:14px;border:1px dashed var(--line);border-radius:10px}
.check{display:flex;gap:12px;align-items:flex-start;text-transform:none;
letter-spacing:0;font-size:.95rem;color:var(--fg);margin:0}
.check input{width:22px;height:22px;flex:0 0 22px;margin-top:2px}
label.tight{margin-top:12px}
.notice-small{color:var(--dim);font-size:.8rem;margin:14px 0 0;line-height:1.45}
.ack{margin-top:28px;padding:14px 16px;border-left:3px solid var(--accent);
background:#141317;border-radius:0 10px 10px 0;color:var(--dim);
font-size:.86rem;line-height:1.55}
.rights{background:#171410;border:1px solid #4a3a1f}
.rights h3{margin:0 0 6px;font-size:1rem;color:var(--warn)}
.rights p{margin:0 0 10px;font-size:.92rem}
.token{background:linear-gradient(160deg,#2a1a08,#3d2a10);border:1px solid var(--warn);
text-align:center;padding:22px}
.token .big{font-size:2rem;font-weight:800;color:var(--warn);letter-spacing:-.02em}
.token .code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
font-size:2.6rem;letter-spacing:.22em;margin:10px 0;font-weight:700}
.split{font-size:2.2rem;font-weight:800;color:var(--ok)}
a.inline{color:var(--accent)}
.mini{display:flex;gap:6px}
.mini button{width:auto;min-width:44px;min-height:44px;padding:10px 13px;font-size:.95rem;margin:0;
background:var(--line);color:var(--fg)}
.mini button.go{background:var(--ok);color:#04240f}
.mini form{margin:0}
ol.list li{flex-wrap:wrap}
details.edit{width:100%;order:9}
details.edit summary{list-style:none;cursor:pointer;display:inline-block;
min-width:44px;min-height:44px;padding:10px 13px;border-radius:10px;
background:var(--line);color:var(--fg);font-size:.95rem;text-align:center}
details.edit summary::-webkit-details-marker{display:none}
details.edit[open] summary{background:var(--accent);color:#fff}
.editform{margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:10px}
.editform label{margin:8px 0 4px}
.editform input{padding:10px}
.editform button{margin-top:12px;padding:12px}
.stage{text-align:center;padding:6vh 4vw}
.stage .now{font-size:clamp(2.4rem,11vw,6rem);font-weight:800;line-height:1.05;
margin:.2em 0;letter-spacing:-.03em}
.stage .lbl{color:var(--accent);text-transform:uppercase;letter-spacing:.22em;
font-size:clamp(.8rem,2.4vw,1.1rem);font-weight:700}
.stage .next{font-size:clamp(1.2rem,5vw,2.4rem);color:var(--dim);margin-top:1.4em}
.qr{background:#fff;padding:16px;border-radius:12px;display:block;margin:0 auto}
@media print{body{background:#fff;color:#000}.noprint{display:none}
.card{border:1px solid #ccc}}
`;

// Site-wide. An Acknowledgement, not a Welcome — a Welcome to Country can only
// be given by a Traditional Owner or Elder of that Country.
export const ACKNOWLEDGEMENT = `<div class="ack">
We acknowledge the Wurundjeri Woi Wurrung and Bunurong peoples of the Kulin
Nation, the Traditional Owners of the land these rooms are built on. Songs have
been performed on this Country for tens of thousands of years, far longer than
any of our venues have stood. Sovereignty was never ceded.
</div>`;

export function layout(title, body, opts = {}) {
  return `<!doctype html><html lang="en-AU"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0e0e11">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>${CSS}</style>
${opts.refresh ? `<meta http-equiv="refresh" content="${opts.refresh}">` : ''}
</head><body>${body}${opts.ui ? '<script src="/static/ui.js" defer></script>' : ''}${
    opts.orderLive ? '<script src="/static/order.js" defer></script>' : ''
  }${opts.apra ? '<script src="/static/apra.js" defer></script>' : ''}${
    opts.stageLive
      ? '<div id="stale" class="lbl" style="display:none;position:fixed;bottom:2vh;left:0;right:0;text-align:center;opacity:.55;font-size:1rem"></div>'
        + '<script src="/static/stage.js" defer></script>'
      : ''
  }</body></html>`;
}

// `needs` is a free-text access field. People write real things in it: a
// wheelchair, a bad ear, a panic thing. It goes to the host, who has to act on
// it, and to nobody else. Publishing it on the open running order would be
// broadcasting someone's medical information to a pub.
function actLine(p, { forHost = false } = {}) {
  const bits = [];
  if (p.act) bits.push(p.act);
  bits.push(`${p.songs} song${p.songs === 1 ? '' : 's'}`);
  if (forHost && p.needs) bits.push(p.needs);
  return bits.join(' · ');
}

// The handle is the one field a performer enters in order to be found. It is
// public on purpose, on the running order and on the screen behind the bar.
function igLink(p) {
  if (!p.instagram) return '';
  const h = esc(p.instagram);
  return ` · <a class="inline" href="https://instagram.com/${h}" target="_blank" rel="noopener nofollow">@${h}</a>`;
}

// ---------- performer-facing sign-up page ----------

export function signupPage(venue, performers, opts = {}) {
  const full = performers.length >= venue.capacity;
  const closed = !venue.signups_open;
  const listed = performers
    .map(
      (p) => `<li class="${esc(p.status)}"><span class="num"></span>
<span class="who"><b>${esc(p.name)}</b><small>${esc(actLine(p))}${igLink(p)}</small></span>
${
  p.status === 'onstage'
    ? '<span class="badge">On now</span>'
    : p.status === 'done'
      ? '<span class="badge grey">Done</span>'
      : p.status === 'noshow'
        ? '<span class="badge grey">No show</span>'
        : ''
}</li>`,
    )
    .join('');

  let form;
  if (closed) {
    form = `<div class="notice warn">Sign-ups are closed for tonight. Have a chat to
${esc(venue.host_name || 'the host')} if you still want a spot.</div>`;
  } else if (full) {
    form = `<div class="notice warn">Tonight's list is full (${venue.capacity} acts).
Worth turning up anyway — spots open up when people drop off.</div>`;
  } else {
    form = `<form method="post" action="/${esc(venue.slug)}/join" class="card">
<label for="name">Your name / act name</label>
<input id="name" name="name" required maxlength="60" autocomplete="name"
placeholder="e.g. Danny H">
<label for="act">What are you doing?</label>
<select id="act" name="act">
<option value="Solo">Solo</option>
<option value="Duo">Duo</option>
<option value="Band">Band</option>
<option value="Comedy">Comedy</option>
<option value="Poetry / spoken word">Poetry / spoken word</option>
<option value="Other">Other</option>
</select>
<label for="songs">How many songs? (max ${venue.max_songs})</label>
<input id="songs" name="songs" type="number" inputmode="numeric" min="1"
max="${venue.max_songs}" value="${Math.min(2, venue.max_songs)}">
<label for="phone">Mobile <span class="muted">— so the host can text you when you're up</span></label>
<input id="phone" name="phone" type="tel" maxlength="20" autocomplete="tel"
placeholder="04...">
<label for="instagram">Instagram <span class="muted">— optional, shown on the
running order so people who liked your set can find you</span></label>
<input id="instagram" name="instagram" maxlength="60" autocapitalize="none"
autocorrect="off" spellcheck="false" placeholder="@yourhandle">
<label for="needs">Anything you need? <span class="muted">— goes to the host
only, not shown publicly</span></label>
<input id="needs" name="needs" maxlength="80"
placeholder="e.g. DI for acoustic, borrowing a guitar, need a stool">

<div class="optin">
<label class="check" for="label_optin">
<input type="checkbox" id="label_optin" name="label_optin" value="1">
<span>Happy to be put forward to labels, bookers and promoters for gigs and
support slots. Optional, and you can say no and still play.</span>
</label>
<label for="contact_email" class="tight">Email <span class="muted">(only if you
ticked the box above)</span></label>
<input id="contact_email" name="contact_email" type="email" maxlength="90"
autocomplete="email" placeholder="you@example.com">
</div>

<p class="notice-small">We keep your name and number for tonight's running
order only, so the host knows who is up. Nothing is passed to anyone else
unless you tick the box. You can ask us to delete it any time.</p>

<button type="submit">Put me on the list</button>
</form>`;
  }

  const msg = opts.error
    ? `<div class="notice bad">${esc(opts.error)}</div>`
    : opts.joined
      ? `<div class="notice ok">You're on the list — position ${opts.joined}.
Keep an eye on the running order below.</div>`
      : '';

  return layout(
    `Open mic sign-up — ${venue.name}`,
    `<div class="wrap">
<header>
<h1>${esc(venue.name)}</h1>
<p class="sub">${esc(venue.night_label || 'Open mic')}${
      venue.suburb ? ' · ' + esc(venue.suburb) : ''
    }</p>
</header>
${msg}
${venue.blurb ? `<div class="card muted">${esc(venue.blurb)}</div>` : ''}
${opts.me ? myStatusCard(venue, opts.me, opts.split) : ''}
${form}

<div class="card rights">
<h3>Know what you're worth</h3>
<p>Musicians Australia sets a floor of <b>$250 per musician</b> for a booked gig
up to 3 hours. Open mic slots aren't booked gigs, but if anyone ever offers you
a paid one, that's the number to start from.</p>
<p>If you played <b>your own songs</b> tonight, there is probably money sitting
with APRA AMCOS that nobody has claimed. The pub pays a licence fee either way.
It only reaches you if you file a performance report.</p>
<p><a class="inline" href="/rights">Your rights, the union, and how to claim
your royalties &rarr;</a></p>
</div>

<h2>Tonight's running order (${performers.length})</h2>
${
  performers.length
    ? `<ol class="list" id="order">${listed}</ol>`
    : '<p class="muted">Nobody yet. Be the first up.</p>'
}
<p class="muted" style="margin-top:14px">Updated ${esc(melbourneTime())} · refresh for the latest</p>
${creditsBlock(opts.crew)}
${ACKNOWLEDGEMENT}
<div class="card rights"><h3>Owed money you have never claimed?</h3>
<p>Every venue that hosts live music is required by law to hold a music licence,
and APRA pays that money out to
whoever files a performance report. Most people at this level never do.</p>
<p><a class="inline" href="/apra">Sort your performance reports out</a> — free,
nothing leaves your phone.</p></div>

<div class="foot">Free sign-up sheet for ${esc(venue.name)}<br>built by
<a href="/">Tech&nbsp;Duinn</a> &middot; <a href="/rights">your rights</a></div>
</div>`,
    // No meta refresh. A full-page reload every 45 seconds wiped whatever the
    // person was typing, shipped 13KB each time, and was 80% of all requests.
    // /static/order.js updates just the list instead.
    { orderLive: true },
  );
}

// ---------- credits: everyone who made the night happen ----------

function creditsBlock(crew) {
  // Only people who said yes get named in public. Pay status is NEVER shown
  // against a named individual here — the host records it privately and any
  // published version must be aggregated to the venue.
  const shown = (crew || []).filter((c) => c.credit_optin);
  if (!shown.length) return '';
  return `<h2>Tonight's crew</h2>
<div class="card"><p style="margin:0">${shown
    .map((c) => `<b>${esc(c.name)}</b> <span class="muted">${esc(c.role)}</span>`)
    .join(' &middot; ')}</p>
<p class="muted" style="margin:10px 0 0">These are the people who make an open
mic actually work. Buy them a drink.</p></div>`;
}

// ---------- what the performer sees about their own slot ----------

function myStatusCard(venue, me, split) {
  if (me.status === 'waiting') {
    return `<div class="card"><b>You're on the list.</b>
<p class="muted" style="margin:6px 0 0">We'll show your drink and your share of
the jar here once you've played.</p></div>`;
  }
  if (me.status !== 'done' && me.status !== 'onstage') return '';

  const bits = [];

  if (venue.perk_enabled && !me.perk_claimed) {
    bits.push(`<div class="card token">
<div class="big">${esc(venue.perk_label || 'A drink on the house')}</div>
<div class="code">${esc(me.id.slice(0, 4).toUpperCase())}</div>
<p class="muted" style="margin:0">Show this at the bar. Thanks for playing.</p>
<form method="post" action="/${esc(venue.slug)}/claim">
<button type="submit">Mark as poured</button></form>
</div>`);
  } else if (venue.perk_enabled && me.perk_claimed) {
    bits.push(`<div class="card muted">Drink claimed. Hope it was cold.</div>`);
  }

  if (split && split.each > 0) {
    bits.push(`<div class="card" style="text-align:center">
<p class="muted" style="margin:0">Your share of tonight's jar</p>
<div class="split">${esc(split.eachLabel)}</div>
<p class="muted" style="margin:0">${split.total} split evenly between
${split.count} performers. See the host to collect.</p></div>`);
  }

  bits.push(`<div class="card rights">
<h3>You played originals?</h3>
<p>Then APRA AMCOS probably owes you money for tonight. It is paid out to
whoever files a performance report, and most people at open mics never file
one.</p>
<p><a class="inline" href="/rights#apra">How to claim it &rarr;</a></p></div>`);

  return bits.join('');
}

// ---------- rights page ----------

export function rightsPage() {
  return layout(
    'Your rights as a performer',
    `<div class="wrap">
<header><h1>Know what you're worth</h1>
<p class="sub">Plain English. No one is selling you anything on this page.</p>
</header>

<div class="card">
<h2 style="margin-top:0">The number</h2>
<p><b>$250 per musician, per gig, up to 3 hours.</b> That is the minimum fee set
by Musicians Australia, the musicians' section of the MEAA union. It was voted
in by members in 2021 and the Victorian government endorses it for grant-funded
gigs.</p>
<p>It comes from the Live Performance Award's 3 hour call: roughly $150 to $200
base, plus $50 to $100 for setup, meals, instruments and travel.</p>
<p class="muted">An open mic slot is not a booked gig and nobody expects $250
for two songs. But the moment someone offers you a <em>paid</em> gig, that is
where the conversation starts, not where it ends.</p>
<p><a class="inline" href="https://musiciansaustralia.org/the-musicians-australia-minimum-fee/"
target="_blank" rel="noopener">Musicians Australia minimum fee &rarr;</a></p>
</div>

<div class="card" id="apra">
<h2 style="margin-top:0">Money you may already be owed</h2>
<p>Every venue that hosts live music is required by law to hold a music licence.
That money goes into a
pool that APRA AMCOS pays out <b>to the people who file a performance report</b>
saying what they played, where and when.</p>
<p>If you do not file, you do not get paid. The money still goes out. It just
goes to whoever did the paperwork.</p>
<p><b>To claim it you need:</b></p>
<ul>
<li>To have played <b>your own songs</b>. You are not paid for covers, but APRA
still want them listed so the writer gets paid.</li>
<li>To be an APRA writer member. It is free to join, with no fee, and you
qualify if you write your own songs and they get performed live.</li>
<li>To submit a performance report listing your songs, the venue and the
date.</li>
</ul>
<p class="muted">We record who played, where and when. Ask us and we will hand
you that part filled in. You submit it yourself and the money goes straight to
you, we never touch it.</p>
<p><a class="inline" href="https://www.apraamcos.com.au/about/governance-policy/distribution-rules-practices/distribution-information-guides/live-music"
target="_blank" rel="noopener">APRA AMCOS live music royalties &rarr;</a></p>
</div>

<div class="card">
<h2 style="margin-top:0">There is a union</h2>
<p>Musicians Australia is part of the MEAA. Their public position is that a
$9 billion industry should stop exploiting professional musicians. They set the
minimum fee, they campaign on pay, and they will talk to you about a gig that
went wrong.</p>
<p><a class="inline" href="https://musiciansaustralia.org/" target="_blank"
rel="noopener">Musicians Australia &rarr;</a></p>
</div>

<div class="card">
<h2 style="margin-top:0">Things you are allowed to say no to</h2>
<ul>
<li><b>Pay to play.</b> Being made to sell or buy a quota of tickets to keep
your slot. It moves the venue's risk onto you, and you can lose money by
performing.</li>
<li><b>A door split you cannot see.</b> You are entitled to know the door
count.</li>
<li><b>Costs deducted after the fact.</b> Anything coming off the top should be
agreed in writing before the night.</li>
<li><b>A cut of your merch.</b> The venue did not make it.</li>
</ul>
<p class="muted">None of this is legal advice. It is what the industry's own
bodies say good practice looks like.</p>
</div>

<div class="card">
<h2 style="margin-top:0">Everyone gets a slot</h2>
<p>Open mics only work when the room is safe to walk into. Nobody gets pushed
down the list or off it for who they are. That means First Nations performers,
women, trans and gender diverse performers, queer performers, disabled
performers, and anyone new and terrified.</p>
<p class="muted">This is not us being worthy about it. Music Victoria's own
Best Practice Guidelines for venues carry a gender diversity chapter written
with Transgender Victoria and Queerspace. It is the sector's standard, not our
opinion.</p>
<p><b>Rainbow Door</b> is a free LGBTIQA+ helpline run by Switchboard Victoria.
Call <b>1800 729 367</b> or text <b>0480 017 246</b>, 10am to 5pm, seven days.
For you, or for someone you care about.</p>
<p><a class="inline" href="https://www.switchboard.org.au/" target="_blank"
rel="noopener">Switchboard Victoria &rarr;</a></p>
</div>

<div class="card" style="border-color:var(--ok)">
<h2 style="margin-top:0;color:var(--ok)">If things are rough</h2>
<p><b>Support Act</b> is a charity for people who work in Australian music.
Musicians, crew, managers, any genre, signed or not.</p>
<p>Their Wellbeing Helpline is <b>1800 959 500</b>. Free, and answered 24 hours
a day.</p>
<p>They also do crisis relief grants for people who can't work through illness,
injury or a bad stretch, plus funeral and tax help. They paid out over $585,000
in short-term support last financial year, so it is not a token service.</p>
<p><a class="inline" href="https://supportact.org.au/" target="_blank"
rel="noopener">Support Act &rarr;</a></p>
</div>

${ACKNOWLEDGEMENT}
<div class="foot"><a href="/">Tech Duinn</a> &middot; we make the sign-up sheet.
We do not take a cut of anything.</div>
</div>`,
  );
}

// ---------- big screen for behind the bar ----------

export function stagePage(venue, performers) {
  const onstage = performers.find((p) => p.status === 'onstage');
  const queue = performers.filter((p) => p.status === 'waiting');
  const next = queue[0];
  return layout(
    `Now playing — ${venue.name}`,
    `<div class="stage" id="stage">
<div class="lbl">${onstage ? 'On stage now' : 'Up next'}</div>
<div class="now">${esc(onstage ? onstage.name : next ? next.name : 'Open mic')}</div>
${(() => {
  const who = onstage || next;
  return who && who.instagram
    ? `<div class="lbl" style="margin-top:.4em;opacity:.85">@${esc(who.instagram)}</div>`
    : '';
})()}
${
  onstage && next
    ? `<div class="next">Next up: <b>${esc(next.name)}</b></div>`
    : !onstage && queue[1]
      ? `<div class="next">Then: <b>${esc(queue[1].name)}</b></div>`
      : !queue.length && !onstage
        ? `<div class="next">Sign up at <b>${esc(venue.slug)}</b> — scan the QR on the bar</div>`
        : ''
}
<div class="next" style="font-size:1rem;margin-top:2.5em;opacity:.5">
${esc(venue.name)} · ${queue.length} still to play</div>
</div>`,
    { stageLive: true },
  );
}

// ---------- host dashboard ----------

export const PAID_LABEL = {
  cash: 'paid cash',
  both: 'paid, cash and drinks',
  drinks: 'drinks only',
  unpaid: 'not paid',
  unknown: '',
};

export function hostPage(venue, performers, origin, extra = {}) {
  const { night, split, crew } = extra;
  const base = `/${esc(venue.slug)}/host/${esc(venue.host_token)}`;
  const rows = performers
    .map((p, i) => {
      const btn = (action, label, cls = '', confirm = '') =>
        `<form method="post" action="${base}/act"${
          confirm ? ` data-confirm="${esc(confirm)}"` : ''
        }><input type="hidden" name="id" value="${esc(
          p.id,
        )}"><input type="hidden" name="action" value="${action}">
<button class="${cls}" type="submit" title="${esc(label.title || '')}">${
          label.icon || label
        }</button></form>`;
      return `<li class="${esc(p.status)}"><span class="num"></span>
<span class="who"><b>${esc(p.name)}</b><small>${esc(actLine(p, { forHost: true }))}${igLink(p)}${
        p.phone ? ' · ' + esc(p.phone) : ''
      }</small></span>
<span class="mini">
${p.status === 'waiting' ? btn('onstage', { icon: '▶', title: 'On stage now' }, 'go') : ''}
${p.status === 'onstage' ? btn('done', { icon: '✓', title: 'Finished' }, 'go') : ''}
${p.status === 'waiting' ? btn('noshow', { icon: '?', title: 'Did not show' }) : ''}
${i > 0 ? btn('up', { icon: '↑', title: 'Move up' }) : ''}
${i < performers.length - 1 ? btn('down', { icon: '↓', title: 'Move down' }) : ''}
${btn('remove', { icon: '✕', title: 'Remove from the list' }, '', `Remove ${p.name} from tonight's list?`)}
</span>
<details class="edit"><summary title="Fix a mistake">✎</summary>
<form method="post" action="${base}/act" class="editform">
<input type="hidden" name="action" value="edit">
<input type="hidden" name="id" value="${esc(p.id)}">
<label>Name<input name="name" maxlength="60" value="${esc(p.name)}" required></label>
<label>Act<input name="act" maxlength="30" value="${esc(p.act || '')}"></label>
<label>Songs<input name="songs" type="number" min="1" max="${venue.max_songs}"
value="${esc(p.songs)}"></label>
<label>Instagram<input name="instagram" maxlength="60" autocapitalize="none"
value="${esc(p.instagram || '')}"></label>
<label>Needs<input name="needs" maxlength="80" value="${esc(p.needs || '')}"></label>
<button type="submit">Save</button>
</form></details></li>`;
    })
    .join('');

  return layout(
    `Host — ${venue.name}`,
    `<div class="wrap">
<header><h1>Tonight's list</h1>
<p class="sub">${esc(venue.name)} · ${performers.length} acts ·
${performers.filter((p) => p.status === 'waiting').length} still to play</p></header>

<div class="notice ${venue.signups_open ? 'ok' : 'warn'}">
Sign-ups are ${venue.signups_open ? 'OPEN' : 'CLOSED'}
<form method="post" action="${base}/act" style="margin-top:10px">
<input type="hidden" name="action" value="${venue.signups_open ? 'close' : 'open'}">
<button type="submit">${venue.signups_open ? 'Close sign-ups' : 'Re-open sign-ups'}</button>
</form></div>

${
  performers.length
    ? `<ol class="list">${rows}</ol>`
    : '<p class="muted">Nobody on the list yet.</p>'
}

<h2>Tonight's jar</h2>
<form method="post" action="${base}/act" class="card">
<input type="hidden" name="action" value="jar">
<label for="jar">Count the jar, put the total in</label>
<input id="jar" name="total" inputmode="decimal" placeholder="e.g. 84.50"
value="${night && night.tip_total_cents ? (night.tip_total_cents / 100).toFixed(2) : ''}">
<p class="muted" style="margin:10px 0 0">Splits evenly between everyone who
played. Each performer sees their own share on their phone, so nobody has to
take your word for it.${
      split && split.each > 0
        ? ` Right now that's <b>${esc(split.eachLabel)}</b> each across ${split.count}.`
        : ''
    }</p>
<button type="submit">Save the total</button>
</form>

<h2>Who made tonight happen</h2>
${
  crew && crew.length
    ? `<ol class="list" style="counter-reset:none">${crew
        .map(
          (c) => `<li><span class="who"><b>${esc(c.name)}</b>
<small>${esc(c.role)}${esc(PAID_LABEL[c.paid] ? ' · ' + PAID_LABEL[c.paid] : '')}</small></span>
<span class="mini"><form method="post" action="${base}/act">
<input type="hidden" name="action" value="crew_rm">
<input type="hidden" name="id" value="${esc(c.id)}">
<button type="submit">✕</button></form></span></li>`,
        )
        .join('')}</ol>`
    : '<p class="muted">Nobody added yet. Sound, photos, door, whoever hauled the PA in.</p>'
}
<form method="post" action="${base}/act" class="card">
<input type="hidden" name="action" value="crew_add">
<label for="cn">Name</label>
<input id="cn" name="name" maxlength="60" required placeholder="Their actual name">
<label for="cr">What they did</label>
<input id="cr" name="role" maxlength="40" required list="roles"
placeholder="Sound, photos, door...">
<datalist id="roles">
<option value="Sound"><option value="Photography"><option value="Door">
<option value="Host"><option value="Setup"><option value="Lighting">
</datalist>
<label for="cp">Were they paid?</label>
<select id="cp" name="paid">
<option value="unknown">Not saying</option>
<option value="cash">Cash</option>
<option value="both">Cash and drinks</option>
<option value="drinks">Drinks only</option>
<option value="unpaid">Not paid</option>
</select>
<div class="optin">
<label class="check" for="cc">
<input type="checkbox" id="cc" name="credit_optin" value="1">
<span><b>Ask them first.</b> Tick only if they've said they're happy to be
named publicly on the sign-up page and stage screen.</span>
</label>
<label class="check" for="cs" style="margin-top:12px">
<input type="checkbox" id="cs" name="share_optin" value="1">
<span>Photographers only: happy for us to pass their shots to press,
<b>with credit</b>. They keep copyright and can pull it any time.</span>
</label>
</div>
<p class="muted" style="margin:12px 0 0">Whether someone was paid is recorded
here for your records only. It is never published against a person's name.
Credit is on top of pay, never instead of it.</p>
<button type="submit">Add them</button>
</form>

<h2>Add a walk-in</h2>
<form method="post" action="${base}/act" class="card">
<input type="hidden" name="action" value="add">
<label for="hname">Name</label>
<input id="hname" name="name" required maxlength="60" placeholder="Someone at the bar">
<label for="hsongs">Songs</label>
<input id="hsongs" name="songs" type="number" min="1" max="${venue.max_songs}" value="2">
<button type="submit">Add to the bottom</button>
</form>

<h2>Share</h2>
<div class="card">
<p class="muted">Performers sign up here:</p>
<p><b>${esc(origin)}/${esc(venue.slug)}</b></p>
<a class="btn ghost" href="/${esc(venue.slug)}/poster">Printable QR poster for the bar</a>
<a class="btn ghost" href="/${esc(venue.slug)}/stage">Big screen display</a>
</div>

<h2>End of night</h2>
<div class="card">
<p class="muted">Everyone's phone number is deleted automatically after two
weeks. This clears tonight's straight away, and keeps the running order.</p>
<form method="post" action="${base}/act">
<input type="hidden" name="action" value="purge_contacts">
<button class="btn ghost" type="submit">Delete tonight's phone numbers</button>
</form>
</div>

<div class="card">
<p class="muted">Clears the list so next week starts fresh. The list also
resets automatically each night at 5am. There is no undo.</p>
<form method="post" action="${base}/act"
data-confirm="Clear tonight's entire list? This cannot be undone.">
<input type="hidden" name="action" value="reset">
<button class="btn ghost" type="submit">Clear tonight's list</button>
</form>
</div>

<h2>This link</h2>
<div class="card">
<p class="muted">Anyone with this link can run the night. If it has been
screenshotted, left on a bar tablet, or the host has changed, get a new one.
The old link stops working immediately and you will need to send the new one
to whoever runs the room.</p>
<form method="post" action="${base}/act"
data-confirm="Issue a new host link? Every copy of the current one stops working.">
<input type="hidden" name="action" value="rotate_link">
<button class="btn ghost" type="submit">Get a new host link</button>
</form>
</div>

<div class="foot">Bookmark this page — it's your private host link.<br>
Don't share it publicly or punters can reorder the list.</div>
</div>`,
    { ui: true },
  );
}

// ---------- printable poster with QR ----------

export function posterPage(venue, qrSvg, origin) {
  return layout(
    `Sign-up poster — ${venue.name}`,
    `<div class="wrap" style="text-align:center">
<header><h1>Open Mic</h1>
<p class="sub">${esc(venue.name)}${venue.night_label ? ' · ' + esc(venue.night_label) : ''}</p>
</header>
<div class="card">
<p style="font-size:1.3rem;font-weight:600;margin:.2em 0 1em">
Scan to get on the list</p>
${qrSvg}
<p style="margin-top:1em;font-size:1.1rem"><b>${esc(origin.replace(/^https?:\/\//, ''))}/${esc(
      venue.slug,
    )}</b></p>
<p class="muted">No app. No account. Put your name in, watch the running order
on your phone.</p>
</div>
<button class="noprint" data-print="1">Print this</button>
<div class="foot noprint">Stick it on the bar and next to the stage.</div>
</div>`,
    { ui: true },
  );
}

// ---------- APRA performance report helper ----------

// Standalone on purpose. It needs no venue, no account and no sign-up sheet:
// any musician can use it tonight for gigs they have already played. Everything
// stays in the browser's own storage. Nothing is sent to this server, because
// there is no reason for us to hold a person's setlist history.
export function apraPage() {
  return layout(
    'Get paid for the gigs you already played',
    `<div class="wrap">
<header>
<h1>Performance reports, without the paperwork dread</h1>
<p class="sub">Every venue that hosts live music is required by law to hold a music
licence. APRA AMCOS
pays that money out to whoever files a performance report. If you don't file,
it goes to the people who did.</p>
</header>

<div class="card rights">
<h3>Read this first, it is short</h3>
<p>You earn royalties when you play your <b>own songs</b> live at a pub, club,
café or open mic night. That is APRA's own example, near enough word for word.</p>
<p><b>Put your covers on the report too.</b> You don't get paid for them, but the
person who wrote the song does, and they are in the same position you are.</p>
<p>You need to be an APRA AMCOS <b>writer member</b> to file and be paid. You
submit it yourself, in their app or Writer Portal. This page just gets your
setlists into a shape you can type in without wanting to give up.</p>
<p class="muted">We never see any of this, we never submit on your behalf, and
we never touch the money.</p>
</div>

<div class="card">
<p><b>Two things to do before you file, or a correct report pays you nothing.</b></p>
<p><b>Register your songs</b> in the Writer Portal. Reports are matched against
APRA's registration database, so an unregistered original earns you nothing no
matter how well you filed it.</p>
<p><b>Put your bank details in.</b> APRA pay out from $1 once they have your EFT
details, and hold anything under $10 if they don't.</p>
<p class="muted">Room size does not change what you earn. In APRA's words, your
royalties "will be the same if you are playing at a corner pub or a
500-capacity room". Small rooms are worth filing.</p>
</div>

<h2>Add a gig</h2>
<div class="card">
<form id="gigform">
<label for="g_date">Date you played</label>
<input id="g_date" type="date" required>
<label for="g_venue">Venue</label>
<input id="g_venue" maxlength="80" required placeholder="e.g. The Old Bar">
<label for="g_suburb">Suburb or town</label>
<input id="g_suburb" maxlength="60" placeholder="e.g. Fitzroy">
<label for="g_time">Set start time <span class="muted">— APRA require it</span></label>
<input id="g_time" type="time">
<label for="g_songs">Songs you played, one per line</label>
<textarea id="g_songs" rows="6" placeholder="Put a * at the start of a line if it was a cover
My Song Title
*Somebody Else's Song"></textarea>
<datalist id="titles"></datalist>
<p class="notice-small">A line starting with <b>*</b> is treated as a cover:
still reported, credited to whoever wrote it, not paid to you.</p>
<button type="submit">Save this gig</button>
</form>
</div>

<div id="warnings"></div>

<h2>Your gigs</h2>
<div id="gigs"><p class="muted">Nothing saved yet. Add one above.</p></div>

<div class="card noprint">
<p class="muted">Everything here lives in this browser only. Clearing your
browser data clears it. Export a copy if it matters.</p>
<button class="btn ghost" id="export">Download as CSV</button>
<button class="btn ghost" id="copy">Copy as text</button>
<button class="btn ghost" id="print" data-print="1">Print</button>
<button class="btn ghost" id="backup">Back up (JSON)</button>
<label for="restore" class="btn ghost" style="cursor:pointer">Restore a backup</label>
<input id="restore" type="file" accept="application/json,.json" style="display:none">
<p class="notice-small">The CSV is for reading. The JSON backup is the one that
loads back in, on a new phone or after clearing your browser. Restoring adds
gigs, it never overwrites what is already here.</p>
</div>

<div class="card token noprint">
<div class="big">Did this get you paid?</div>
<p style="margin:12px 0 0">If a report you filed from here turns into actual
money, I want to know the amount. Not for a testimonial. Because right now
nobody in this country can tell a funder, a venue or a politician what an
average grassroots performer is owed, and one real figure is worth more than
every argument in the business plan.</p>
<p style="margin:12px 0 0"><a class="inline"
href="mailto:daniel.j.hogben@gmail.com?subject=A%20performance%20report%20got%20me%20paid&amp;body=Roughly%20how%20much%3A%20%0AHow%20many%20gigs%20were%20on%20it%3A%20%0AAnything%20that%20was%20confusing%3A%20">Tell
me what it paid</a> — or don't, and use it anyway. There is no tracking on this
page and there never will be, which is exactly why I have to ask.</p>
</div>

<h2>What you cannot claim</h2>
<div class="card">
<p class="muted">Straight from APRA, so you don't waste a submission:</p>
<ul class="muted">
<li>Private functions. Weddings, private parties, nursing homes, hospitals,
even when they are held in a public venue.</li>
<li>Religious worship services.</li>
<li>Performances broadcast on radio or television.</li>
<li>Musicals, operas, ballets and anything performed in a dramatic context.</li>
<li><b>Busking</b>, for performances on or after 1 July 2026.</li>
</ul>
<p class="muted">Festivals, international tours and other promoted events are
licensed differently: the promoter collects setlists and submits for you. A
normal pub or open mic night is not one of these, so file it yourself. APRA's
own advice is that if you are in doubt and nobody has asked you for a setlist,
submit the report.</p>
</div>

<div class="card">
<p><b>Time limit.</b> You can normally claim up to one year back from the date
you played. It can be extended to three years with evidence such as posters,
tickets or a letter from the venue, but new members can only claim the twelve
months before they joined.</p>
<p class="muted">Royalties are paid quarterly, in February, May, August and
November, and processing takes about six months from when you file.</p>
</div>

<div class="card">
<p>Ready to file: <a class="inline" href="https://portals.apraamcos.com.au/"
target="_blank" rel="noopener">APRA AMCOS Writer Portal</a> ·
<a class="inline" href="https://www.apraamcos.com.au/resources/get-paid/performance-reports"
target="_blank" rel="noopener">their guide</a> ·
not a member yet? <a class="inline"
href="https://www.apraamcos.com.au/music-creators/join-as-a-writer" target="_blank"
rel="noopener">joining is free</a></p>
</div>

${ACKNOWLEDGEMENT}

<p class="notice-small">Every rule on this page is taken from APRA AMCOS's own
Performance Reports guide, last checked 29 July 2026. If it has changed since,
their page wins, not this one.
<a class="inline" href="https://www.apraamcos.com.au/resources/get-paid/performance-reports"
target="_blank" rel="noopener">Check it</a>. This is a formatter and a summary,
not advice, and nobody here is your accountant.</p>

<div class="foot">Free, forever, from <a href="/">Tech&nbsp;Duinn</a> ·
<a href="/rights">know your rights</a> · built by a Melbourne musician who was
sick of watching people leave money on the table</div>
</div>`,
    { ui: true, apra: true },
  );
}

// ---------- dynamic QR codes ----------

export function qrLandingPage(opts = {}) {
  return layout(
    'A QR code you can point somewhere else later',
    `<div class="wrap">
<header>
<h1>QR codes that don't expire</h1>
<p class="sub">Print it once. Change where it goes whenever you like. Nobody
charges you a monthly fee to keep your own poster working.</p>
</header>

${opts.error ? `<div class="notice bad">${esc(opts.error)}</div>` : ''}

<div class="card">
<p>Most services will sell you this as a subscription. The whole product is one
row in a database and a redirect. The reason it costs money is that when you
stop paying, every poster you already printed stops working.</p>
<p class="muted">This one is free, has no account, and if it ever disappears the
code is open source and you can run your own.</p>
</div>

<h2>Make one</h2>
<div class="card">
<form method="post" action="/qr/new">
<label for="target">Where should it go?</label>
<input id="target" name="target" type="url" required placeholder="https://..."
autocapitalize="none" autocorrect="off">
<label for="label">What is it for? <span class="muted">— just so you recognise
it later</span></label>
<input id="label" name="label" maxlength="60" placeholder="e.g. Tuesday poster, back bar">
<button type="submit">Make my QR code</button>
</form>
<p class="notice-small">You will get the code, a printable poster, and one
private link for changing where it points. That link is the only way back in,
so keep it. There is no account to recover.</p>
</div>

<div class="card">
<p class="muted">What is recorded: how many times it has been scanned. What is
not: who scanned it, from where, on what, or when. No cookie, no IP, no log.</p>
</div>

${ACKNOWLEDGEMENT}
<div class="foot">Free, forever, from <a href="/">Tech&nbsp;Duinn</a></div>
</div>`,
  );
}

export function qrMadePage(origin, row, qrSvg) {
  const short = `${origin}/q/${row.code}`;
  const edit = `${origin}/qr/${row.code}/edit/${row.edit_token}`;
  return layout(
    'Your QR code',
    `<div class="wrap">
<header><h1>Done. Print it.</h1></header>

<div class="card" style="text-align:center">${qrSvg}
<p style="margin-top:12px"><b>${esc(short)}</b></p></div>

<div class="card rights">
<h3>Save this link now</h3>
<p>This is the only way to change where the code points, and there is no account
to recover it from:</p>
<p><a class="inline" href="${esc(edit)}">${esc(edit)}</a></p>
<p class="muted">Bookmark it, email it to yourself, whatever you will still have
in a year. Anyone with it can change where your poster sends people.</p>
</div>

<div class="card">
<a class="btn ghost" href="/qr/${esc(row.code)}/poster">Printable poster</a>
<a class="btn ghost" href="${esc(edit)}">Change where it goes</a>
</div>

<div class="foot"><a href="/qr">Make another</a> · <a href="/">Tech&nbsp;Duinn</a></div>
</div>`,
    { ui: true },
  );
}

export function qrEditPage(origin, row, qrSvg, opts = {}) {
  const short = `${origin}/q/${row.code}`;
  return layout(
    `Editing ${row.label || row.code}`,
    `<div class="wrap">
<header><h1>${esc(row.label || 'Your QR code')}</h1>
<p class="sub">${esc(short)} · scanned ${row.scans} time${row.scans === 1 ? '' : 's'}</p>
</header>

${opts.saved ? '<div class="notice ok">Changed. Every printed copy now points at the new address.</div>' : ''}

<div class="card" style="text-align:center">${qrSvg}</div>

<div class="card">
<form method="post">
<input type="hidden" name="action" value="retarget">
<label for="target">Send people to</label>
<input id="target" name="target" type="url" required value="${esc(row.target)}"
autocapitalize="none" autocorrect="off">
<label for="label">Label</label>
<input id="label" name="label" maxlength="60" value="${esc(row.label || '')}">
<button type="submit">Save</button>
</form>
</div>

<div class="card">
<a class="btn ghost" href="/qr/${esc(row.code)}/poster">Printable poster</a>
</div>

<div class="card">
<p class="muted">Scans are counted and nothing else. No IP address, no device,
no time of day, no cookie. The number above is the entire record.</p>
<form method="post" data-confirm="Turn this code off? Every printed copy stops working.">
<input type="hidden" name="action" value="disable">
<button class="btn ghost" type="submit">${
      row.disabled ? 'Turn it back on' : 'Turn this code off'
    }</button>
</form>
</div>

<div class="foot">Keep this link. It is the only way back in.</div>
</div>`,
    { ui: true },
  );
}

export function qrPosterPage(origin, row, qrSvg) {
  return layout(
    `Poster — ${row.label || row.code}`,
    `<div class="wrap">
<div class="card" style="text-align:center">
${qrSvg}
<h1 style="margin-top:16px">${esc(row.label || 'Scan me')}</h1>
<p class="muted">${esc(origin)}/q/${esc(row.code)}</p>
</div>
<button class="noprint" data-print="1">Print this</button>
<div class="foot noprint"><a href="/qr">Make another</a></div>
</div>`,
    { ui: true },
  );
}

export function qrInfoPage(origin, row) {
  return layout(
    'Where does this go?',
    `<div class="wrap">
<header><h1>Where this code points</h1></header>
<div class="card">
<p class="muted">Short link</p><p><b>${esc(origin)}/q/${esc(row.code)}</b></p>
<p class="muted" style="margin-top:16px">Sends you to</p>
<p style="word-break:break-all"><b>${esc(row.target)}</b></p>
</div>
<div class="card">
<p class="muted">Anyone can check where one of these codes goes before scanning
it, which is the point of this page. If a code here is being used to trick
people, tell me and I will switch it off:
<a class="inline" href="mailto:daniel.j.hogben@gmail.com?subject=QR%20abuse%20report%20${esc(row.code)}">report it</a>.</p>
</div>
<div class="foot"><a href="/">Tech&nbsp;Duinn</a></div>
</div>`,
  );
}

// ---------- landing page (the pitch) ----------

export function landingPage() {
  return layout(
    'Open mic sign-ups, sorted — Tech Duinn',
    `<div class="wrap">
<header><h1>Open mic sign-ups, sorted.</h1>
<p class="sub">A free sign-up sheet for Melbourne venues running an open mic.</p>
</header>

<div class="card">
<h2 style="margin-top:0">The problem</h2>
<p>A clipboard by the sound desk. Names you can't read. Someone signs up
twice. Three people ask "how long till I'm on?" while you're trying to run
the room. Somebody leaves before their spot.</p>
</div>

<div class="card">
<h2 style="margin-top:0">What this does</h2>
<p>You put a QR code on the bar. Performers scan it, put their name in, and
see the running order on their own phone. You get one private link that
lets you reorder, mark who's on, and text the next act.</p>
<ul>
<li>No app. No accounts. Nothing for punters to download.</li>
<li>Works on any phone.</li>
<li>Optional big-screen display for behind the bar.</li>
<li>Resets itself every night.</li>
</ul>
</div>

<div class="card">
<h2 style="margin-top:0">What it costs</h2>
<p><b>Nothing.</b> I'm a Melbourne musician who plays these rooms. I built
this because I kept watching good nights run rough.</p>
<p>If it makes your night easier and you'd think of me next time you're
booking someone, that's the whole deal.</p>
</div>

<div class="card">
<h2 style="margin-top:0">Want one for your room?</h2>
<p>Reply to the email I sent, or get in touch. Takes about a minute to set
up and I'll send you the QR poster ready to print.</p>
</div>

${ACKNOWLEDGEMENT}
<div class="foot">Built in Melbourne by Tech Duinn. &middot;
<a href="/rights">Performer rights</a></div>
</div>`,
  );
}

export function errorPage(msg, status = 404) {
  return layout(
    'Not found',
    `<div class="wrap"><header><h1>${esc(msg)}</h1></header>
<p class="muted"><a href="/" style="color:var(--accent)">Back to the start</a></p></div>`,
  );
}
