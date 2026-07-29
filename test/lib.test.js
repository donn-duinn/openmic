// The first tests in this repo. Two pure functions, chosen because getting
// either wrong costs someone money or splits a running order in half at 4am.
//
//   npm test
//
// No framework, no dependencies, same as the rest of the project.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { melbourneNight, instagramHandle, centsFromInput, clean } from '../src/lib.js';

// ---------------------------------------------------------------- the night

// A night rolls over at 5am Melbourne time so a gig running past midnight keeps
// one running order. These are absolute instants, written as UTC, with the
// Melbourne local time noted. Melbourne is UTC+11 in daylight saving, UTC+10
// otherwise.
test('night rolls over at 5am, not midnight', () => {
  // 2026-07-15 23:30 Melbourne (UTC+10) is still the 15th's night.
  assert.equal(melbourneNight(new Date('2026-07-15T13:30:00Z')), '2026-07-15');
  // 2026-07-16 01:30 Melbourne, past midnight, same night.
  assert.equal(melbourneNight(new Date('2026-07-15T15:30:00Z')), '2026-07-15');
  // 2026-07-16 04:59 Melbourne, one minute before rollover, still the 15th.
  assert.equal(melbourneNight(new Date('2026-07-15T18:59:00Z')), '2026-07-15');
  // 2026-07-16 05:01 Melbourne, past rollover, now the 16th.
  assert.equal(melbourneNight(new Date('2026-07-15T19:01:00Z')), '2026-07-16');
});

test('night survives the end of daylight saving', () => {
  // Daylight saving ends 5 April 2026: at 3am local, clocks go back to 2am, so
  // the hour from 2am to 3am happens twice. Absolute arithmetic rolls the night
  // over an hour early here. Local arithmetic does not.
  //
  // 2026-04-05 02:30 Melbourne, FIRST pass (still UTC+11) = 15:30Z on the 4th.
  assert.equal(melbourneNight(new Date('2026-04-04T15:30:00Z')), '2026-04-04');
  // 2026-04-05 02:30 Melbourne, SECOND pass (now UTC+10) = 16:30Z on the 4th.
  assert.equal(melbourneNight(new Date('2026-04-04T16:30:00Z')), '2026-04-04');
  // 2026-04-05 04:30 Melbourne, still before 5am, still the 4th's night.
  // This is the case the old absolute-subtraction version got wrong.
  assert.equal(melbourneNight(new Date('2026-04-04T18:30:00Z')), '2026-04-04');
  // 2026-04-05 05:30 Melbourne, past rollover.
  assert.equal(melbourneNight(new Date('2026-04-04T19:30:00Z')), '2026-04-05');
});

test('night survives the start of daylight saving', () => {
  // Daylight saving starts 4 October 2026: at 2am local, clocks jump to 3am.
  // 2026-10-04 01:30 Melbourne (UTC+10) = 15:30Z on the 3rd. Before 5am.
  assert.equal(melbourneNight(new Date('2026-10-03T15:30:00Z')), '2026-10-03');
  // 2026-10-04 03:30 Melbourne (now UTC+11) = 16:30Z on the 3rd. Before 5am.
  assert.equal(melbourneNight(new Date('2026-10-03T16:30:00Z')), '2026-10-03');
  // 2026-10-04 05:30 Melbourne = 18:30Z on the 3rd. Past rollover.
  assert.equal(melbourneNight(new Date('2026-10-03T18:30:00Z')), '2026-10-04');
});

test('night rolls across a month and a year boundary', () => {
  // 2026-09-01 02:00 Melbourne belongs to the night of 31 August.
  assert.equal(melbourneNight(new Date('2026-08-31T16:00:00Z')), '2026-08-31');
  // 2027-01-01 03:00 Melbourne belongs to New Year's Eve.
  assert.equal(melbourneNight(new Date('2026-12-31T16:00:00Z')), '2026-12-31');
});

// ------------------------------------------------------------- the handle

test('instagram handle survives whatever someone types in a pub', () => {
  assert.equal(instagramHandle('@misterdonn'), 'misterdonn');
  assert.equal(instagramHandle('misterdonn'), 'misterdonn');
  assert.equal(instagramHandle('  @misterdonn  '), 'misterdonn');
  assert.equal(instagramHandle('instagram.com/misterdonn'), 'misterdonn');
  assert.equal(instagramHandle('https://www.instagram.com/misterdonn/?hl=en'), 'misterdonn');
  assert.equal(instagramHandle('with.dots_and_underscores'), 'with.dots_and_underscores');
});

test('instagram handle rejects rubbish rather than storing it', () => {
  assert.equal(instagramHandle(''), '');
  assert.equal(instagramHandle(null), '');
  assert.equal(instagramHandle('has spaces'), '');
  assert.equal(instagramHandle('<script>alert(1)</script>'), '');
  assert.equal(instagramHandle('a'.repeat(31)), '');
});

// ------------------------------------------------------------ the money

test('jar input accepts what a host actually types', () => {
  assert.equal(centsFromInput('84'), 8400);
  assert.equal(centsFromInput('84.50'), 8450);
  assert.equal(centsFromInput('$84.50'), 8450);
  assert.equal(centsFromInput(''), 0);
  assert.equal(centsFromInput('rubbish'), 0);
  assert.equal(centsFromInput('-20'), 2000); // sign is stripped, not negated
});

test('free text is trimmed and capped so a row cannot be bloated', () => {
  assert.equal(clean('  spaced   out  ', 60), 'spaced out');
  assert.equal(clean('x'.repeat(200), 60).length, 60);
  assert.equal(clean(null, 60), '');
});
