# Ethical AI in the public interest — the case, and the letter

A national argument, using this project as the worked example.

---

## 1. The argument

Australia's AI debate is almost entirely about harm: job displacement, deepfakes,
scraped training data, automated decisions nobody can appeal. Those are real and
the concern is warranted. But the debate has almost no worked examples of the
other thing — AI used by an ordinary person to build something that transfers
value *to* the people with the least of it.

This project is one.

**What happened.** A working Melbourne musician went to an open mic where fifty
performers were signing up through an emailed link. In a single night, with AI
assistance, he built and deployed a free system that replaces the clipboard —
and then kept adding things that give value away rather than extract it.

**What it does for performers:**
- Tells them the union minimum fee exists ($250 per musician, up to 3 hours,
  set by Musicians Australia, endorsed by the Victorian Government for
  grant-funded gigs). Most have never heard of it.
- Tells them APRA AMCOS may already owe them money. APRA collects licence fees
  from every pub hosting live music and distributes to whoever files a
  performance report. Artists who never file are funding a pool they never claim
  from. APRA's own guidance names open mic nights as eligible.
- Splits the tip jar evenly and shows every performer their share, so nobody has
  to take anyone's word for it.
- Puts the Support Act wellbeing helpline and Rainbow Door in front of every
  person who signs up.

**What it does for crew.** Sound engineers and photographers, the people most
routinely paid in "exposure", are credited by name with their own consent, and
whether they were actually paid is recorded.

**What it costs.** Nothing to venues, permanently. Nothing to performers. It runs
on a free tier.

**Who profits.** Nobody. That is deliberate and it is not decoration — it is what
makes the artist-side position credible.

---

## 2. What actually made it ethical

Not the technology. The constraints, each chosen deliberately and each
verifiable in the public source code:

1. **Consent is opt-in and defaults to off.** Nothing about a performer leaves
   the system unless they ticked a box themselves. No pre-ticked boxes, no
   bundling.
2. **Data is never sold.** Not to labels, not to anyone. Introductions happen
   only where a person asked for them.
3. **Nobody is named without their say-so.** Crew are credited only if they
   agreed. Whether an individual was paid is never published against their name.
4. **Open source under AGPL**, so it cannot be enclosed. Anyone running a
   modified version as a service must publish their source. It cannot be taken,
   closed, and sold back to the venues it was given to.
5. **Collect the minimum, delete on schedule.** Names and numbers exist for one
   night's running order and no longer.
6. **The human made every judgement call.** The AI wrote code and did research.
   It did not decide who gets credited, what gets published, or what the thing is
   for.

**That list is the policy proposal.** Those constraints cost nothing and would
improve most publicly funded software regardless of whether AI touched it.

**Four gaps, added after review, because the original six were not enough.**
All six above are *data* constraints. A civic tool can honour every one of them
and still fail the people using it. Missing:

7. **A redress route.** If the system gets something wrong about a person, there
   must be a stated way to have it corrected, and a name to write to. A
   reputational record with no appeals process is not made acceptable by being
   consent-gated.
8. **A succession duty.** Abandonment, not enclosure, is how civic software
   usually dies. Whoever runs it should say in advance what happens to the data
   and the service if they stop.
9. **Breach disclosure.** Stated up front, not decided during.
10. **Data export.** A person can take their own records out in a usable format
    at any time, without asking.

**And one honest problem with the original list.** Constraint six, that a human
made every judgement call, is the only one that cannot be checked in the source.
It is an assertion, which fails this document's own test. The precise version is
narrower: the human made every judgement he *noticed*. The model chose schema
shapes, defaults and wording, and defaults are ethics. Five checkable
constraints and one claim is a weaker proposal than six checkable ones, and it
should be presented that way.

---

## 3. The honest disclosure

This project was built with substantial AI assistance, in one night, by one
person with no formal training in software or AI. That is the point, and it
should be stated plainly in any submission.

**Self-taught is the argument, not a caveat.** The policy question is who gets
to hold this technology.

**Stated precisely, because the loose version overclaims.** What collapsed is
the barrier to a *first deployment*. Maintenance, liability, support and
institutional cost are entirely untouched, and those are what actually kill
civic software. The genuinely novel finding here is smaller and better than
"anyone can build anything now": proximity to the problem produced the
constraint list. Standing in the room is what generated the six rules. The code
was the cheap part.

It is also worth stating what AI did *not* do. It did not have the idea. It did
not know that fifty performers on an email link was a problem worth solving,
because it has never stood in that room. Every decision that made this ethical
rather than merely functional came from a person who knew what it is like to be
on the wrong end of the arrangement.

**The policy conclusion follows from that.** The question is not whether to fund
AI. It is who gets to hold it. Funding a large vendor to build a platform for
musicians produces a different object than funding a musician to build one.

---

## 4. The asks

For MPs and public servants at any level.

1. **Fund the pattern, not the platform.** Small, open-source, consent-first
   civic tools built by people who have the problem. Modest grants, tens of
   thousands rather than millions, judged on whether the thing exists and works.
2. **Make these six constraints a condition of public funding for any AI-assisted
   civic software.** Opt-in consent, no data sale, no naming without consent, open
   licence, data minimisation, human decision-making. They are cheap and they are
   checkable.
3. **Require disclosure of AI assistance in publicly funded software**, in the
   same way research funding requires disclosure of methods. Not as a penalty —
   as a norm, so the honest path is the default one.
4. **Recognise grassroots cultural infrastructure as infrastructure.** The open
   mic is where every funded artist started, and it receives close to nothing.
5. **Ask the sector what it needs before procuring a solution for it.** This
   project exists because someone noticed a problem while standing in it.

---

## 5. Letter template — federal and interstate

For MPs outside Melbourne, where the local relationship argument does not apply.
Keep it to one page.

> Dear [NAME],
>
> **Re: a worked example of AI used in the public interest, and what I think it
> means for policy**
>
> I'm a working musician in Melbourne and a sole trader (ABN 69 173 867 628).
> I'm self-taught in AI and software — no degree, no formal training, no
> industry background. I mention that because it is the point of this letter.
>
> Last month I watched fifty performers sign up for one open mic night through
> an emailed link. In a single night, using AI assistance, I built a free system
> that replaces that. It's live, it's open source, and it will always be free to
> venues and performers. I don't take a cent from it and I'm not going to.
>
> It does more than run a list. It tells performers the union minimum fee
> exists, which most have never heard of. It tells them APRA AMCOS may already
> owe them royalties for original songs they've played — money collected from
> venues that goes unclaimed because nobody told them to file. It splits the tip
> jar evenly and shows each person their share. It credits sound engineers and
> photographers by name, with their consent, and records whether they were
> actually paid.
>
> I'm writing because I think it's a useful worked example at a moment when the
> national conversation about AI is almost entirely about harm.
>
> **What made it ethical wasn't the technology.** It was six constraints, all
> verifiable in the public source: consent is opt-in and off by default; data is
> never sold; nobody is named without agreeing; the licence prevents anyone
> enclosing it; only the minimum data is kept; and a human made every judgement
> about what the thing is for.
>
> **What AI did not do** was have the idea. It has never stood in that room. The
> decisions that made this worth building came from knowing what it's like to be
> on the wrong end of the arrangement.
>
> That is the policy point I'd like to put to you: the question isn't whether to
> fund AI, it's who gets to hold it. Funding a large vendor to build a platform
> for musicians produces a different object than funding a musician to build one.
> The second is far cheaper and, I'd argue, far more likely to be used.
>
> I'd welcome the chance to show you how it works, or to make a submission to
> any inquiry or consultation where this is relevant. I'm not seeking funding in
> this letter. I've built the thing and given it away. I'm asking whether the
> approach is of interest.
>
> Yours sincerely,
>
> **Daniel Hogben**
> Musician · self-taught AI and software practitioner
> Tech Duinn (sole trader) · ABN 69 173 867 628
> [ADDRESS] · [PHONE] · daniel.j.hogben@gmail.com
> https://openmic.techduinn.dpdns.org · source: https://github.com/donn-duinn/openmic

---

## 6. Before this goes anywhere

- **The repo is public.** Every claim above rests on the source being
  inspectable, and it is, at https://github.com/donn-duinn/openmic. Keep
  checking what goes into it: `TARGETS.md` is a prospect list, and the strategy
  documents should probably move to a separate private repo.
- **Custom domain. Done.** Letters link to https://openmic.techduinn.dpdns.org.
- **One venue running first.** "I built this and it works" is a far weaker claim
  than "three Melbourne venues use it every week". Wait for the second version if
  you can bear to.
- **Find the current consultations.** Federal AI policy, state creative industry
  strategies, and any live parliamentary inquiry into AI or the music industry.
  A submission to an open inquiry is public, permanent, and reaches more people
  than forty letters.
- **Don't send to every MP in Australia.** Two hundred identical letters get two
  hundred form responses and mark you as a mail-merge. Pick: your own federal MP,
  the federal Arts Minister, the federal AI/Industry Minister, the Victorian
  Creative Industries Minister, and any committee currently running a relevant
  inquiry. Five real letters beat two hundred ignored ones.
