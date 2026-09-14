interface AttemptEntry {
	count: number;
	resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, AttemptEntry>();

export function isRateLimited(key: string): boolean {
	const entry = attempts.get(key);
	if (!entry || entry.resetAt < Date.now()) {
		return false;
	}
	return entry.count >= MAX_ATTEMPTS;
}

export function registerFailedAttempt(key: string): void {
	const now = Date.now();
	const entry = attempts.get(key);
	if (!entry || entry.resetAt < now) {
		attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
		return;
	}
	entry.count += 1;
}

export function clearAttempts(key: string): void {
	attempts.delete(key);
}
