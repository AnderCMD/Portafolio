export const ADMIN_PATH = '/Admin';
export const MAX_SEARCH_LENGTH = 100;
export const MAX_RENEW_DAYS = 3650;

export function safeReturnPath(value: FormDataEntryValue | string | null | undefined): string {
	const path = typeof value === 'string' ? value : '';
	if (path.includes('\\') || [...path].some((char) => char.charCodeAt(0) < 0x20)) return ADMIN_PATH;
	return /^\/Admin\/?(?:[?#]|$)/.test(path) ? path : ADMIN_PATH;
}

export function withError(path: string, error: string): string {
	const url = new URL(path, 'http://local');
	url.searchParams.set('error', error);
	return `${url.pathname}${url.search}`;
}

export function escapeLike(value: string): string {
	return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export function normalizeTarget(value: string): string {
	return value.trim().toLowerCase().replace(/\/+$/, '');
}

export function parsePage(value: string | null | undefined): number {
	const page = Number.parseInt(value ?? '', 10);
	return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

export function parseSearch(value: string | null | undefined): string {
	return (value ?? '').trim().slice(0, MAX_SEARCH_LENGTH);
}

export function parseRenewDays(value: FormDataEntryValue | null): number | null {
	if (typeof value !== 'string' || !/^\d{1,4}$/.test(value)) return null;
	const days = Number(value);
	return days >= 1 && days <= MAX_RENEW_DAYS ? days : null;
}

export function parseFutureDate(value: string, now = Date.now()): Date | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) || date.getTime() <= now ? null : date;
}

export function computePageRange(total: number, page: number, pageSize: number, itemCount: number) {
	if (total === 0) return { start: 0, end: 0 };
	const start = (page - 1) * pageSize + 1;
	return { start, end: start + itemCount - 1 };
}
