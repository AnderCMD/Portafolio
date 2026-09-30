import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function load() {
	vi.resetModules();
	return import('@lib/shortener/rateLimit');
}

describe('rateLimit', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('bloquea al llegar a 8 intentos fallidos', async () => {
		const { isRateLimited, registerFailedAttempt } = await load();
		for (let i = 0; i < 7; i += 1) registerFailedAttempt('ip');
		expect(isRateLimited('ip')).toBe(false);
		registerFailedAttempt('ip');
		expect(isRateLimited('ip')).toBe(true);
	});

	it('aísla claves distintas', async () => {
		const { isRateLimited, registerFailedAttempt } = await load();
		for (let i = 0; i < 8; i += 1) registerFailedAttempt('a');
		expect(isRateLimited('a')).toBe(true);
		expect(isRateLimited('b')).toBe(false);
	});

	it('se libera tras la ventana de 15 minutos', async () => {
		const { isRateLimited, registerFailedAttempt } = await load();
		for (let i = 0; i < 8; i += 1) registerFailedAttempt('ip');
		vi.advanceTimersByTime(15 * 60 * 1000 + 1);
		expect(isRateLimited('ip')).toBe(false);
	});

	it('clearAttempts reinicia el contador', async () => {
		const { clearAttempts, isRateLimited, registerFailedAttempt } = await load();
		for (let i = 0; i < 8; i += 1) registerFailedAttempt('ip');
		clearAttempts('ip');
		expect(isRateLimited('ip')).toBe(false);
	});

	it('no crece sin límite', async () => {
		const { isRateLimited, registerFailedAttempt } = await load();
		for (let i = 0; i < 6000; i += 1) registerFailedAttempt(`ip-${i}`);
		for (let i = 0; i < 8; i += 1) registerFailedAttempt('reciente');
		expect(isRateLimited('reciente')).toBe(true);
		expect(isRateLimited('ip-0')).toBe(false);
	});
});
