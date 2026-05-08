export interface Inbox {
  id: string;
  address: string;
  localPart: string;
  domain: string;
  expiresAt: string | null;
  createdAt: string;
  lastEmailAt: string | null;
}

export interface EmailSummary {
  id: string;
  messageId: string;
  fromAddress: string;
  subject: string;
  receivedAt: string;
  rawSize: number;
  hasAttachments: boolean;
}

export interface EmailDetail {
  id: string;
  messageId: string;
  fromAddress: string;
  toAddress: string;
  subject: string;
  textBody: string | null;
  htmlBody: string | null;
  rawSize: number;
  receivedAt: string;
  hasAttachments: boolean;
  attachments: AttachmentMeta[];
}

export interface AttachmentMeta {
  id: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface Domain {
  id: string;
  domain: string;
  providerType: "cloudflare" | "smtp";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  emails: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  error: string;
}
