-- Dynamic QR codes.
--
-- The thing being replaced: companies charge a monthly subscription for a QR
-- code that points at a URL you can change later. It is a row in a table and a
-- redirect. The reason people pay is that when the subscription lapses, every
-- printed poster stops working, which makes the product hostage-taking rather
-- than hosting.
--
-- No accounts here either. The edit token in the URL is the password, same as
-- the host link. Nothing about the person scanning is recorded: no IP, no user
-- agent, no timestamp per scan, no cookie. Just a counter, so whoever printed
-- the poster knows whether anyone is looking at it.

CREATE TABLE IF NOT EXISTS qr_codes (
  code        TEXT PRIMARY KEY,
  target      TEXT NOT NULL,
  label       TEXT DEFAULT '',
  edit_token  TEXT NOT NULL,
  scans       INTEGER NOT NULL DEFAULT 0,
  disabled    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

-- Creation is rate limited per IP, hashed the same way sign-ups are, because an
-- open redirector is attractive to phishing and this one is free.
CREATE TABLE IF NOT EXISTS qr_hits (
  ip_hash     TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_qr_hits_lookup ON qr_hits (ip_hash, created_at);
