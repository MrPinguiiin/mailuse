-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  provider_type TEXT NOT NULL DEFAULT 'cloudflare',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Inboxes
CREATE TABLE IF NOT EXISTS inboxes (
  id TEXT PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  local_part TEXT NOT NULL,
  domain TEXT NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_email_at TEXT,
  is_deleted INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inboxes_domain ON inboxes(domain);
CREATE INDEX IF NOT EXISTS idx_inboxes_expires_at ON inboxes(expires_at);
CREATE INDEX IF NOT EXISTS idx_inboxes_is_deleted ON inboxes(is_deleted);

-- Emails
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  inbox_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  text_body TEXT,
  html_body TEXT,
  headers TEXT,
  raw_size INTEGER NOT NULL DEFAULT 0,
  received_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT,
  has_attachments INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (inbox_id) REFERENCES inboxes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_emails_inbox_received ON emails(inbox_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_message_id ON emails(message_id);

-- Attachments
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  email_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  storage_key TEXT NOT NULL,
  FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attachments_email_id ON attachments(email_id);

-- Blocked local parts
CREATE TABLE IF NOT EXISTS blocked_localparts (
  id TEXT PRIMARY KEY,
  pattern TEXT UNIQUE NOT NULL,
  reason TEXT
);
