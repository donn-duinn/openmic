-- Crew are named publicly. They never signed up and never consented, which is
-- the sharpest privacy exposure in the design: the Schedule 2 statutory tort
-- for serious invasions of privacy (Privacy Act 1988, inserted 2024) has NO
-- small business exemption.
--
-- So: no public credit without the person's own say-so, and pay status is
-- never published against a named individual. The host records it privately;
-- any published version must be aggregated to the venue.

ALTER TABLE crew ADD COLUMN credit_optin INTEGER NOT NULL DEFAULT 0;
