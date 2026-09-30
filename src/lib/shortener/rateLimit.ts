interface AttemptEntry {
	count: number;
	resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const MAX_TRACKED_KEYS = 5000;

const attempts = new Map<string, AttemptEntry>();

function pruneExpired(now: number): void {
	for (const [key, entry] of attempts) {
		if (entry.resetAt < now) attempts.delete(key);
	}
}

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
		if (attempts.size >= MAX_TRACKED_KEYS) pruneExpired(now);
		if (attempts.size >= MAX_TRACKED_KEYS) attempts.delete(attempts.keys().next().value as string);
		attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
		return;
	}
	entry.count += 1;
}

export function clearAttempts(key: string): void {
	attempts.delete(key);
}
