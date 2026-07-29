-- Supersedes the per-role columns in 003 and 004. Anyone who makes the night
-- happen gets their name up: sound, photography, door, setup, the host, the
-- person who lugged the PA in.
--
-- `paid` records what they actually got. Exposure is not an option in this
-- list on purpose, because exposure is not payment. Credit is recorded
-- separately and is always given.
--
-- `share_optin` applies mainly to photographers: an opt-in licence to pass
-- their work to press WITH credit. Copyright never transfers and it can be
-- withdrawn.

CREATE TABLE IF NOT EXISTS crew (
  id          TEXT PRIMARY KEY,
  venue_slug  TEXT NOT NULL,
  night       TEXT NOT NULL,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  paid        TEXT NOT NULL DEFAULT 'unknown',  -- unknown|cash|drinks|both|unpaid
  contact     TEXT,
  share_optin INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crew_night ON crew (venue_slug, night);
