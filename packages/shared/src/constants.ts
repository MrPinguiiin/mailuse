/** Default inbox TTL in minutes (1 hour) */
export const DEFAULT_TTL_MINUTES = 60;

/** Maximum inbox TTL in minutes (7 days) */
export const MAX_TTL_MINUTES = 10080;

/** Minimum inbox TTL in minutes (5 minutes) */
export const MIN_TTL_MINUTES = 5;

/** Maximum email body size in bytes (10MB) */
export const MAX_EMAIL_SIZE = 10 * 1024 * 1024;

/** Maximum attachment size in bytes (25MB) */
export const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024;

/** Maximum number of attachments per email */
export const MAX_ATTACHMENTS_PER_EMAIL = 20;

/** Email polling interval in milliseconds (5 seconds) */
export const POLLING_INTERVAL_MS = 5000;

/** Cleanup job interval in milliseconds (1 minute) */
export const CLEANUP_INTERVAL_MS = 60 * 1000;

/** Reserved local parts that cannot be used */
export const RESERVED_LOCAL_PARTS = [
  "admin",
  "administrator",
  "postmaster",
  "hostmaster",
  "webmaster",
  "abuse",
  "noreply",
  "no-reply",
  "mailer-daemon",
  "root",
  "support",
  "info",
  "contact",
  "security",
  "ssl",
  "ftp",
  "mail",
  "www",
];
