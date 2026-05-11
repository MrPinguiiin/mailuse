import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatBytes(bytes: number) {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const index = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${Number.parseFloat((bytes / 1024 ** index).toFixed(1))} ${units[index]}`;
}

export function timeAgo(date: string | Date) {
	const timestamp = new Date(date).getTime();
	const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

export function timeRemaining(date: string | Date) {
	const timestamp = new Date(date).getTime();
	const seconds = Math.max(0, Math.floor((timestamp - Date.now()) / 1000));

	if (seconds === 0) return "expired";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m remaining`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h remaining`;
	const days = Math.floor(hours / 24);
	return `${days}d remaining`;
}
