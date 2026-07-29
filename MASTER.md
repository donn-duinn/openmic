# MASTER — the whole idea in one place

Everything from the night of 2026-07-28/29, in donn's words and intent, plus
what was actually built. This is the source doc. `FAIR-PAY.md` is the
standards research and `PRIOR-ART.md` is what already exists.

---

## The origin

Went to an open mic. 50-plus performers, signing up through an emailed link.
Not a form, not even a Google Doc. A mass gap in the industry, seen in person.

## The core idea, unedited

> Make it simple, give it to all bars in exchange for me putting a night on
> there at some stage. Then I have multiple venues where I have a night. Find
> musicians. Host, and get paid off beer sales. Then merch, with the pipeline I
> created. Then I've done work for most bars with a culture in Melbourne, so I
> can do their websites next. And because it's my data, I have lists of all
> upcoming Melbourne artists and can work with magazines like Beat. People use
> Facebook to look for events in Melbourne, so we can reach them cheap. I did
> the crowd research. Then I build culture. Then I build my brand.
>
> The website and free labour is the trojan horse. Simple as fuck.

**Note added after review, and it matters.** That last line is donn's private
framing at 1am and it is kept here for an honest record. It must never be the
public framing, and not for PR reasons: because the two are only compatible if
the trade is stated out loud. The tool genuinely is free forever. He genuinely
does want bookings. Both can be true and honourable, but only if venues and
performers are told the second part plainly. A "trojan horse" that is announced
is just an honest offer. One that is discovered later is the thing that ends
the artist-side position permanently.

**Action:** the sign-up page and the venue email must both carry one line, in
donn's own voice: *"I'm a musician, I want to run nights, and I may book people
from this scene."* Disclosed self-interest survives. Discovered self-interest
does not.

## The corrections donn made as the night went on

These matter more than the original dump. In order:

1. **Not fake reviews.** Expose venues that genuinely don't work well with new
   artists. Honest, evidence-based, not fabricated.
2. **Venues that support local artists over profit rank on top.** A stated
   editorial position, published openly, not a hidden thumb on the scale.
3. **Fair pay.** If a performer has to pre-sign for a slot, that's a
   commitment, and they deserve something when the night makes money. A tip jar
   split evenly across everyone who played. At minimum, everyone gets a beer or
   what a beer is worth.
4. **Not for profit.** *"I don't want this to earn profit, only make me inside
   the culture and pay it forward."* This is the line that reorganises
   everything else.
5. **Opt-in, always.** Performers choose whether they're put forward to labels.
   Never automatic.
6. **Carry the information.** The sign-up flow itself should teach performers
   their rights and the union's existence.
7. **The charitable read on venues.** *"I think it is why they don't have the
   right system set, and also keep records digital."* Most venues aren't
   hostile, they're disorganised. No records means nothing can be checked, so
   bad practice survives by default. The system makes fair treatment the easy
   path.

## What "not for profit" changes

The original plan had seven revenue lines including selling scene data to
labels. Point 4 kills most of that, and it makes the whole thing stronger:

| Original | After the reframe |
|---|---|
| Sell artist data to labels | Gone. Opt-in introductions only, no sale |
| Paid placement in the directory | Gone. It was always the weakest line |
| Control culture / control the narrative | Reframed: earn standing, don't buy it |
| Venue websites | Kept, but firewalled from the rankings |
| Design and merch for artists | Kept. This is honest paid work |
| Nights donn wants to run, bar share | Kept. Honest paid work, and new |

**The honest tension:** a plan that earns nothing isn't noble, it's
unsustainable, and burning out helps no one in the scene.

**The resolution:** the open mic layer is a gift, permanently and genuinely
free. Income comes from adjacent work that the standing makes possible: his own
bookings, artwork and merch for artists who want it, and Tech Duinn's existing
audit and website business. Being trusted is what generates the work. The
trust is not the thing being sold.

---

## What was actually built on night one

Live at `openmic.daniel-j-hogben.workers.dev`. Cloudflare Workers plus D1 in
APAC. Free tier. Source in this repo.

- **Sign-up page.** QR on the bar, performer signs up on their phone, sees the
  running order. No app, no account.
- **Host dashboard.** One private link. Reorder, mark who's on stage, add
  walk-ins, close sign-ups.
- **Stage display.** Big screen behind the bar, now playing and next up.
- **Printable QR poster.**
- **Label opt-in.** Unticked by default, with a plain-English collection notice.
  Email only stored if they tick it.
- **`/rights` page.** The $250 union floor, the APRA money most performers never
  claim, what pay-to-play is and that you can refuse it.
- **Drink token.** Performer who played gets the venue's perk on their phone.

Half-built, needs finishing:

- **Tip jar split.** Schema and performer view are in. The host needs a field to
  enter the jar total so the split can be calculated and shown.
- **APRA report generator.** The system already knows who played, where and
  when. Add song titles and hand the performer a filled-in performance report.

---

## The APRA insight, which may be the best thing here

Every pub hosting live music pays a licence fee. APRA distributes that pool
**by direct allocation to performance reports members file**. If you don't file,
you don't get paid, and the money goes to whoever did. Grassroots artists
playing originals are funding a pool they never claim from.

We already hold most of a performance report. Handing it to them costs nothing,
takes money from nobody who earned it, and routes existing industry money back
down. No venue-side product will ever build this, because no venue wants to be
the one telling artists to claim.

Caveats that must stay on the screen: originals only, covers earn the writer
not the performer; APRA writer membership required; we generate, they submit,
we never touch the money.

---

## Targeting

Left-leaning and union-adjacent venues are the right first segment, because the
product's actual argument is one those rooms already hold. The values match is
real, so the pitch doesn't have to work hard.

**Evidence bar for the list:** a venue only goes on it with a public,
verifiable statement or action, with a link. We do not infer a venue's politics
from vibe or suburb. Attributing a political position to a business that hasn't
taken one publicly is both inaccurate and capable of doing them real harm.

**Strategic note on the pitch:** lead with artist pay and the union floor, not
with politics. With this audience especially, a cause used as a sales hook is
read instantly and resented. Let the alignment be obvious from what the product
does.

---

## Why pay actually matters (donn's framing, and the best argument to venues)

Fair pay is not only fairness. It is what lets an artist keep developing. An
unpaid performer works a second job, practises less, and either plateaus or
quits. Most quit. The scene then complains there is no talent coming through.

This is the argument that moves a publican, because it is about their own
supply. Pay the people playing your Tuesday and in two years some of them are
worth putting on a Friday. Do not, and you are recruiting from a shrinking pool
forever.

Musicians also rarely know any of this, because they are busy being musicians.
In donn's words: too invested in the music to know their rights. That is exactly
why the information sits inside the sign-up flow and not on a page people have
to go looking for. Fifty performers a night, caught at the one moment they are
already paying attention.

**Product line that follows from this:** things that help a performer actually
improve, not just get paid.

- Their own set recorded and sent to them. Most have never heard themselves
  play live.
- A record of where and when they have played, building over time. Useful for
  grant applications, bios, and APRA reports.
- Aggregate, consented crowd response so they can see which songs held a room.
  Non-identifying only, disclosed at the door, and see the Surveillance Devices
  Act note in `BUSINESS-PLAN.md`.

## Open questions for donn

1. Comedy or music as the second market. Comedy has sharper pain and 28 rooms
   on Facebook DMs. Music is where the bookings are.
2. Open Mic Melbourne, the 8k-follower Facebook directory (operator name
   NOT verified — do not use a name in outreach until confirmed).
   Competitor, partner, or the person to hand this to.
3. Sole trader or a company, given the directory publishes opinions about
   businesses and the system holds personal data.
4. Ashlar's stake. Easy to settle now, ugly later.
5. Whether the drink token should be venue-funded or come out of donn's cut.

---

## Correction: where donn actually stands (added 2026-07-29)

Worth stating plainly, because several documents above drifted into implying
otherwise.

**donn plays these rooms. He does not currently run them.** He is not an
established promoter and has not run an open mic night. He saw a gap and
wants to start running events.

That is the honest position and it is a stronger one for funding, not a weaker
one. Grant programs fund new activity and sector development. Nobody funds
someone to continue doing what they already do.

It also means the plan's Stage 2 is a genuine unknown rather than an extension
of existing practice. The bar-share figure has never been tested, running a
room is a skill he has watched but not practised, and the first night will
teach more than any of this research.

Nothing in this repo should claim or imply an existing promoting career.
