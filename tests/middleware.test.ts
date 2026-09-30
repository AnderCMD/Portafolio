import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('astro:middleware', () => ({ defineMiddleware: <T>(fn: T) => fn }));
const db = vi.hoisted(() => ({ resolveLink: vi.fn(), registerClick: vi.fn() }));
vi.mock('@lib/shortener/db', () => db);

import { onRequest } from '../src/middleware';

const run = (url: string) => {
	const next = vi.fn(async () => new Response('next'));
	const context = { url: new URL(url) };
	return { next, result: (onRequest as unknown as (c: unknown, n: unknown) => Promise<Response>)(context, next) };
};

beforeEach(() => {
	db.resolveLink.mockReset();
	db.registerClick.mockReset().mockResolvedValue(undefined);
});

describe('middleware del acortador', () => {
	it('no interfiere con el dominio del portafolio', async () => {
		const { next, result } = run('https://andercmd.dev/abc');
		expect(await (await result).text()).toBe('next');
		expect(next).toHaveBeenCalled();
		expect(db.resolveLink).not.toHaveBeenCalled();
	});

	it('oculta el panel en el dominio corto', async () => {
		for (const path of ['/Admin', '/Admin/Login', '/api/admin/links']) {
			expect((await run(`https://andercmd.link${path}`).result).status).toBe(404);
		}
	});

	it('redirige la raíz al portafolio', async () => {
		const response = await run('https://andercmd.link/').result;
		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('https://andercmd.dev/');
	});

	it('responde 404 sin consultar la base de datos si el código es inválido', async () => {
		for (const path of ['/a', '/robots.txt', '/wp-login.php', '/a/b', '/%20x']) {
			expect((await run(`https://andercmd.link${path}`).result).status).toBe(404);
		}
		expect(db.resolveLink).not.toHaveBeenCalled();
	});

	it('responde 404 si el enlace no existe, está pausado o vencido', async () => {
		db.resolveLink.mockResolvedValue(null);
		expect((await run('https://andercmd.link/nope').result).status).toBe(404);
	});

	it('redirige con 302, sin caché y cuenta el clic', async () => {
		db.resolveLink.mockResolvedValue({ id: 9, targetUrl: 'https://example.com/x' });
		const response = await run('https://andercmd.link/abc/').result;
		expect(db.resolveLink).toHaveBeenCalledWith('abc');
		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('https://example.com/x');
		expect(response.headers.get('Cache-Control')).toBe('no-store');
		expect(db.registerClick).toHaveBeenCalledWith(9);
	});

	it('redirige aunque falle el conteo de clics', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		db.resolveLink.mockResolvedValue({ id: 9, targetUrl: 'https://example.com/x' });
		db.registerClick.mockRejectedValue(new Error('caída'));
		expect((await run('https://andercmd.link/abc').result).status).toBe(302);
	});

	it('responde 503 si la base de datos no está disponible', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		db.resolveLink.mockRejectedValue(new Error('caída'));
		const response = await run('https://andercmd.link/abc').result;
		expect(response.status).toBe(503);
		expect(response.headers.get('Retry-After')).toBe('30');
	});
});
