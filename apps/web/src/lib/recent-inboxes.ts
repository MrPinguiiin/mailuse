import type { Inbox } from "@mailuse/shared/types";

export type RecentInbox = {
	address: string;
	expiresAt: string | null;
	lastOpenedAt: string;
};

const STORAGE_KEY = "mailuse:recent-inboxes";
const MAX_RECENT_INBOXES = 12;

function isActive(inbox: RecentInbox) {
	return !inbox.expiresAt || new Date(inbox.expiresAt).getTime() > Date.now();
}

export function getRecentInboxes() {
	if (typeof localStorage === "undefined") return [];

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const inboxes = raw ? (JSON.parse(raw) as RecentInbox[]) : [];
		const active = inboxes.filter((inbox) => inbox.address && isActive(inbox));
		localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
		return active;
	} catch {
		localStorage.removeItem(STORAGE_KEY);
		return [];
	}
}

export function rememberInbox(inbox: Pick<Inbox, "address" | "expiresAt">) {
	if (typeof localStorage === "undefined") return [];

	const current = getRecentInboxes().filter((item) => item.address !== inbox.address);
	const next = [
		{
			address: inbox.address,
			expiresAt: inbox.expiresAt,
			lastOpenedAt: new Date().toISOString(),
		},
		...current,
	].slice(0, MAX_RECENT_INBOXES);

	localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	return next;
}
