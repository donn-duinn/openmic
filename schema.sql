-- Open mic sign-up system. One deploy, many venues.

DROP TABLE IF EXISTS performers;
DROP TABLE IF EXISTS venues;

CREATE TABLE venues (
  slug          TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  suburb        TEXT,
  host_token    TEXT NOT NULL UNIQUE,
  host_name     TEXT,
  night_label   TEXT,                                  -- e.g. "Every Tuesday, 7pm"
  max_songs     INTEGER NOT NULL DEFAULT 2,
  slot_minutes  INTEGER NOT NULL DEFAULT 10,
  capacity      INTEGER NOT NULL DEFAULT 40,
  signups_open  INTEGER NOT NULL DEFAULT 1,
  blurb         TEXT,
  created_at    TEXT NOT NULL
);

CREATE TABLE performers (
  id          TEXT PRIMARY KEY,
  venue_slug  TEXT NOT NULL REFERENCES venues(slug) ON DELETE CASCADE,
  night       TEXT NOT NULL,                           -- YYYY-MM-DD, Melbourne, rolls over 5am
  name        TEXT NOT NULL,
  act         TEXT,                                    -- solo / duo / band / comedy / poetry
  songs       INTEGER NOT NULL DEFAULT 2,
  phone       TEXT,
  needs       TEXT,                                    -- "need a DI", "borrowing a guitar"
  position    INTEGER NOT NULL,
  status      TEXT NOT NULL DEFAULT 'waiting',         -- waiting | onstage | done | noshow
  created_at  TEXT NOT NULL
);

CREATE INDEX idx_performers_night ON performers (venue_slug, night, position);
