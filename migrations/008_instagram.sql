-- Instagram handle, optional, and public by design.
--
-- Unlike phone and needs, this one exists precisely so other people can find
-- the artist. A performer types it in order to be discovered, so it belongs on
-- the running order and the stage screen. It is stored as a bare handle with no
-- leading @, so the display and the link can be built consistently.
--
-- It is deliberately NOT covered by the retention purge. A phone number is
-- operational data for one night; a handle is the artist's own shopfront and
-- deleting it would break the record of who played.

ALTER TABLE performers ADD COLUMN instagram TEXT DEFAULT '';
