import { describe, expect, it } from 'vitest';
import type { APIContext } from 'astro';
import { createSessionToken, SESSION_COOKIE } from '@lib/shortener/auth';
import { getClientKey, requireSession } from '@lib/shortener/guard';

const contextWith = (value?: string) =>
	({
		cookies: { get: (name: string) => (name === SESSION_COOKIE && value ? { value } : undefined) },
	}) as unknown as APIContext;

describe('requireSession', () => {
	it('deja pasar con sesión válida', () => {
		expect(requireSession(contextWith(createSessionToken()))).toBeNull();
	});

	it('responde 401 JSON sin sesión o con token inválido', async () => {
		for (const ctx of [contextWith(), contextWith('basura.firma')]) {
			const response = requireSession(ctx);
			expect(response?.status).toBe(401);
			expect(await response?.json()).toEqual({ error: 'No autorizado' });
		}
	});
});

describe('getClientKey', () => {
	const req = (headers: Record<string, string> = {}) => new Request('http://x', { headers });

	it('usa el primer valor de x-forwarded-for', () => {
		expect(getClientKey(req({ 'x-forwarded-for': ' 1.1.1.1 , 2.2.2.2' }), '9.9.9.9')).toBe('1.1.1.1');
	});

	it('cae a la dirección del cliente y luego a unknown', () => {
		expect(getClientKey(req(), '9.9.9.9')).toBe('9.9.9.9');
		expect(getClientKey(req(), undefined)).toBe('unknown');
	});
});
