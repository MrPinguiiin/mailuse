import { PUBLIC_API_BASE, PUBLIC_API_URL } from "$env/static/public";
import type {
  Inbox,
  EmailSummary,
  EmailDetail,
  Domain,
  PaginatedResponse,
} from "@mailuse/shared/types";

const BASE = PUBLIC_API_URL || PUBLIC_API_BASE || "http://localhost:3000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Inboxes
  async createInbox(opts?: { localPart?: string; domain?: string; ttlMinutes?: number }) {
    return fetchJson<Inbox>("/inboxes", {
      method: "POST",
      body: JSON.stringify(opts || {}),
    });
  },

  async getInbox(address: string) {
    return fetchJson<Inbox>(`/inboxes/${encodeURIComponent(address)}`);
  },

  async deleteInbox(address: string) {
    return fetchJson<{ success: boolean }>(`/inboxes/${encodeURIComponent(address)}`, {
      method: "DELETE",
    });
  },

  // Emails
  async listEmails(address: string, page = 1, limit = 50) {
    return fetchJson<PaginatedResponse<EmailSummary>>(
      `/inboxes/${encodeURIComponent(address)}/emails?page=${page}&limit=${limit}`
    );
  },

  async getEmail(address: string, emailId: string) {
    return fetchJson<EmailDetail>(
      `/inboxes/${encodeURIComponent(address)}/emails/${emailId}`
    );
  },

  async deleteEmail(address: string, emailId: string) {
    return fetchJson<{ success: boolean }>(
      `/inboxes/${encodeURIComponent(address)}/emails/${emailId}`,
      { method: "DELETE" }
    );
  },

  // Domains
  async listDomains() {
    return fetchJson<{ domains: Domain[] }>("/domains");
  },

  // Attachments
  getAttachmentUrl(address: string, emailId: string, attachmentId: string) {
    return `${BASE}/api/v1/inboxes/${encodeURIComponent(address)}/emails/${emailId}/attachments/${attachmentId}`;
  },
};
