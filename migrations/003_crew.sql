-- The sound engineer is part of the night, not furniture.
-- Credited by name everywhere, and we record whether they were actually paid.
-- Exposure is not payment and does not tick the box.

ALTER TABLE nights ADD COLUMN sound_engineer TEXT;
ALTER TABLE nights ADD COLUMN sound_paid TEXT NOT NULL DEFAULT 'unknown';
-- unknown | cash | drinks | both | unpaid
