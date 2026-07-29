-- Fair pay for performers: a venue-funded drink, and an even split of the jar.
-- Money is never held by us. The jar is physical; we only do the arithmetic.

ALTER TABLE venues ADD COLUMN perk_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE venues ADD COLUMN perk_label TEXT NOT NULL DEFAULT 'A drink on the house';
ALTER TABLE venues ADD COLUMN tips_enabled INTEGER NOT NULL DEFAULT 1;

ALTER TABLE performers ADD COLUMN perk_claimed INTEGER NOT NULL DEFAULT 0;

-- Explicit, unticked opt-in. Nothing about a performer leaves this system
-- unless they ticked this box themselves. Default is always 0.
ALTER TABLE performers ADD COLUMN label_optin INTEGER NOT NULL DEFAULT 0;
ALTER TABLE performers ADD COLUMN contact_email TEXT;

-- One row per venue per night. Holds the jar total the host counts up.
CREATE TABLE IF NOT EXISTS nights (
  venue_slug     TEXT NOT NULL,
  night          TEXT NOT NULL,
  tip_total_cents INTEGER NOT NULL DEFAULT 0,
  updated_at     TEXT,
  PRIMARY KEY (venue_slug, night)
);
