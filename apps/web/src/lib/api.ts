import { env } from "$env/dynamic/public";
import type {
  Inbox,
  EmailSummary,
  EmailDetail,
  Domain,
  PaginatedResponse,
} from "@mailuse/shared/types";

const BASE = env.PUBLIC_API_URL || env.PUBLIC_API_BASE || "http://localhost:3000";

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

async function fetchOwnerJson<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  async ownerLogin(password: string) {
    return fetchJson<{ token: string }>("/owner/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  async ownerStats(token: string) {
    return fetchOwnerJson<{
      totalInboxes: number;
      activeInboxes: number;
      deletedInboxes: number;
      totalEmails: number;
      emailsToday: number;
    }>("/owner/stats", token);
  },

  async ownerInboxes(token: string) {
    return fetchOwnerJson<{ inboxes: Array<{ address: string; expiresAt: string | null; createdAt: string; lastEmailAt: string | null; emailCount: number }> }>("/owner/inboxes", token);
  },

  async ownerDomains(token: string) {
    return fetchOwnerJson<{ domains: Array<{ id: string; domain: string; providerType: string; isActive: boolean; createdAt: string; inboxCount: number }> }>("/owner/domains", token);
  },

  async ownerApi(token: string) {
    return fetchOwnerJson<{ token: string; endpoints: Array<{ method: string; path: string; description: string }> }>("/owner/api", token);
  },

  async ownerLatestUpdate(token: string) {
    return fetchOwnerJson<{ currentVersion: string; latestVersion: string; name: string; url: string; publishedAt: string; body: string; updateAvailable: boolean }>("/owner/update/latest", token);
  },

  async ownerTriggerUpdate(token: string) {
    return fetchOwnerJson<{ jobId: string; releaseTag: string }>("/owner/update/trigger", token, { method: "POST" });
  },

  async ownerUpdateStatus(token: string, jobId: string) {
    return fetchOwnerJson<any>(`/owner/update/status/${jobId}`, token);
  },

  async ownerActiveUpdate(token: string) {
    return fetchOwnerJson<{ job: any | null }>("/owner/update/active", token);
  },

  async ownerUpdateHistory(token: string) {
    return fetchOwnerJson<{ jobs: any[] }>("/owner/update/history", token);
  },

  async ownerRollback(token: string, jobId: string) {
    return fetchOwnerJson<{ jobId: string }>(`/owner/update/rollback/${jobId}`, token, { method: "POST" });
  },
};
