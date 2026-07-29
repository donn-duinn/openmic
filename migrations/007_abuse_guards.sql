-- Integrity and abuse guards.
--
-- The read-then-write checks in handleJoin were races: 60 concurrent sign-ups
-- into a venue with a capacity of 5 produced 16 rows, and 30 concurrent
-- identical names produced 5 duplicates. Guards belong in the schema, where
-- they cannot be raced, not only in application code.

-- One name per venue per night. Case-insensitive, so "Sam" and "sam" collide.
CREATE UNIQUE INDEX IF NOT EXISTS idx_performers_unique_name
  ON performers (venue_slug, night, lower(name));

-- Sign-up attempts, for per-IP throttling. The IP is stored as a SHA-256 hash
-- with a per-night salt, so this table cannot be used to work out who was in a
-- room on a given night. Rows are disposable and purged by the scheduled job.
CREATE TABLE IF NOT EXISTS signup_hits (
  ip_hash     TEXT NOT NULL,
  venue_slug  TEXT NOT NULL,
  night       TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_signup_hits_lookup
  ON signup_hits (ip_hash, venue_slug, created_at);

CREATE INDEX IF NOT EXISTS idx_signup_hits_night
  ON signup_hits (night);

-- Retention. The sign-up form promises a phone number is kept for tonight's
-- running order only. Nothing enforced that. This records when a night's
-- contact details were scrubbed so the promise is auditable.
ALTER TABLE performers ADD COLUMN contact_purged_at TEXT;
