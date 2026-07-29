-- Photographers, same standard as sound crew: credited by name, and we record
-- whether they were actually paid. Exposure is not payment.
--
-- Copyright stays with the photographer, always. The share_pool flag is an
-- opt-in to let us pass shots to press WITH credit. It is a licence to share,
-- never a transfer of rights, and it can be withdrawn.

ALTER TABLE nights ADD COLUMN photographer TEXT;
ALTER TABLE nights ADD COLUMN photo_paid TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE nights ADD COLUMN photo_share_optin INTEGER NOT NULL DEFAULT 0;
ALTER TABLE nights ADD COLUMN photo_contact TEXT;
