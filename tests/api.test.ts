import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { APIContext } from 'astro';
import { createSessionToken, SESSION_COOKIE } from '@lib/shortener/auth';

const db = vi.hoisted(() => ({
	createLink: vi.fn(),
	deleteLinkByCode: vi.fn(),
	renewLink: vi.fn(),
	setLinkActive: vi.fn(),
	setLinkFavorite: vi.fn(),
	updateLinkTargetUrl: vi.fn(),
	findCodesByTarget: vi.fn(),
}));
vi.mock('@lib/shortener/db', () => db);

import { POST as createPost } from '../src/pages/api/admin/links';
import { POST as actionPost } from '../src/pages/api/admin/links/[code]';
import { GET as duplicatesGet } from '../src/pages/api/admin/duplicates';

function ctx(
	options: { body?: Record<string, string>; code?: string; auth?: boolean; url?: string; rawBody?: string } = {}
) {
	const { body = {}, code, auth = true, url = 'http://localhost/x' } = options;
	const token = auth ? createSessionToken() : undefined;
	const request = new Request(url, { method: 'POST', body: new URLSearchParams(body) });
	return {
		request,
		url: new URL(url),
		params: { code },
		cookies: { get: (name: string) => (name === SESSION_COOKIE && token ? { value: token } : undefined) },
		redirect: (location: string, status = 302) => new Response(null, { status, headers: { Location: location } }),
	} as unknown as APIContext;
}

const location = (response: Response | void) => (response as Response).headers.get('Location');
const future = () => new Date(Date.now() + 86_400_000).toISOString();

beforeEach(() => {
	for (const fn of Object.values(db)) fn.mockReset().mockResolvedValue(undefined);
	db.findCodesByTarget.mockResolvedValue([]);
});

describe('POST /api/admin/links', () => {
	it('exige sesión', async () => {
		const response = (await createPost(ctx({ auth: false, body: { targetUrl: 'https://a.com' } }))) as Response;
		expect(response.status).toBe(401);
		expect(db.createLink).not.toHaveBeenCalled();
	});

	it('crea un enlace y redirige a /Admin', async () => {
		const response = await createPost(ctx({ body: { targetUrl: ' https://a.com ' } }));
		expect(location(response)).toBe('/Admin');
		expect(db.createLink).toHaveBeenCalledWith({
			code: undefined,
			targetUrl: 'https://a.com',
			expiresAt: undefined,
			autoDelete: false,
		});
	});

	it('valida la URL, el código y la caducidad', async () => {
		expect(location(await createPost(ctx({ body: { targetUrl: 'javascript:alert(1)' } })))).toBe(
			'/Admin?error=url'
		);
		expect(location(await createPost(ctx({ body: { targetUrl: 'https://a.com', code: 'admin' } })))).toBe(
			'/Admin?error=code'
		);
		expect(
			location(await createPost(ctx({ body: { targetUrl: 'https://a.com', expiresAt: '2000-01-01T00:00:00Z' } })))
		).toBe('/Admin?error=expires');
		expect(location(await createPost(ctx({ body: { targetUrl: 'https://a.com', expiresAt: 'basura' } })))).toBe(
			'/Admin?error=expires'
		);
		expect(db.createLink).not.toHaveBeenCalled();
	});

	it('autoDelete solo aplica si hay caducidad', async () => {
		await createPost(ctx({ body: { targetUrl: 'https://a.com', autoDelete: '1' } }));
		expect(db.createLink.mock.calls[0]![0].autoDelete).toBe(false);
		const expiresAt = future();
		await createPost(ctx({ body: { targetUrl: 'https://a.com', expiresAt, autoDelete: '1', code: 'mio' } }));
		expect(db.createLink.mock.calls[1]![0]).toMatchObject({
			code: 'mio',
			autoDelete: true,
			expiresAt: new Date(expiresAt),
		});
	});

	it('distingue código duplicado de error desconocido', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		db.createLink.mockRejectedValueOnce(new Error('DUPLICATE_CODE'));
		expect(location(await createPost(ctx({ body: { targetUrl: 'https://a.com', code: 'mio' } })))).toBe(
			'/Admin?error=duplicate'
		);
		db.createLink.mockRejectedValueOnce(new Error('db caída'));
		expect(location(await createPost(ctx({ body: { targetUrl: 'https://a.com' } })))).toBe('/Admin?error=unknown');
	});
});

describe('POST /api/admin/links/[code]', () => {
	const act = (body: Record<string, string>, code = 'abc', auth = true) => actionPost(ctx({ body, code, auth }));

	it('exige sesión y código válido', async () => {
		expect(((await act({ action: 'delete' }, 'abc', false)) as Response).status).toBe(401);
		expect(((await act({ action: 'delete' }, 'a b')) as Response).status).toBe(400);
		expect(((await actionPost(ctx({ body: { action: 'delete' } }))) as Response).status).toBe(400);
		expect(db.deleteLinkByCode).not.toHaveBeenCalled();
	});

	it('rechaza acciones desconocidas con 400', async () => {
		expect(((await act({ action: 'hack' })) as Response).status).toBe(400);
		expect(((await act({})) as Response).status).toBe(400);
	});

	it('elimina, pausa/activa y marca favorito', async () => {
		await act({ action: 'delete' });
		expect(db.deleteLinkByCode).toHaveBeenCalledWith('abc');
		await act({ action: 'toggle', active: '0' });
		expect(db.setLinkActive).toHaveBeenLastCalledWith('abc', false);
		await act({ action: 'toggle', active: '1' });
		expect(db.setLinkActive).toHaveBeenLastCalledWith('abc', true);
		await act({ action: 'favorite', favorite: '1' });
		expect(db.setLinkFavorite).toHaveBeenLastCalledWith('abc', true);
		await act({ action: 'favorite', favorite: '0' });
		expect(db.setLinkFavorite).toHaveBeenLastCalledWith('abc', false);
	});

	it('vuelve a la página de origen, ignorando destinos externos', async () => {
		expect(
			location(await act({ action: 'favorite', favorite: '1', returnTo: '/Admin?tab=favorites&page=2' }))
		).toBe('/Admin?tab=favorites&page=2');
		expect(location(await act({ action: 'favorite', favorite: '1', returnTo: 'https://evil.com' }))).toBe('/Admin');
		expect(location(await act({ action: 'favorite', favorite: '1', returnTo: '//evil.com' }))).toBe('/Admin');
	});

	it('edita validando la URL y conservando returnTo en el error', async () => {
		expect(location(await act({ action: 'edit', targetUrl: 'ftp://x', returnTo: '/Admin?page=3' }))).toBe(
			'/Admin?page=3&error=url'
		);
		expect(db.updateLinkTargetUrl).not.toHaveBeenCalled();
		await act({ action: 'edit', targetUrl: ' https://nuevo.com ' });
		expect(db.updateLinkTargetUrl).toHaveBeenCalledWith('abc', 'https://nuevo.com');
	});

	it('renueva por días válidos y rechaza el resto', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
		try {
			await act({ action: 'renew', days: '7' });
			expect(db.renewLink).toHaveBeenCalledWith('abc', new Date('2026-01-08T00:00:00Z'));
			for (const days of ['0', '3651', 'x', '1.5', '']) {
				expect(location(await act({ action: 'renew', days }))).toBe('/Admin?error=expires');
			}
			expect(db.renewLink).toHaveBeenCalledTimes(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it('quita la caducidad', async () => {
		await act({ action: 'clear-expiry' });
		expect(db.renewLink).toHaveBeenCalledWith('abc', null);
	});

	it('muestra error y no revienta si la base de datos falla', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		db.deleteLinkByCode.mockRejectedValueOnce(new Error('caída'));
		expect(location(await act({ action: 'delete', returnTo: '/Admin?page=2' }))).toBe(
			'/Admin?page=2&error=unknown'
		);
	});
});

describe('GET /api/admin/duplicates', () => {
	const get = (query: string, auth = true) =>
		duplicatesGet(ctx({ auth, url: `http://localhost/api/admin/duplicates${query}` })) as Promise<Response>;

	it('exige sesión', async () => {
		expect((await get('?url=https://a.com', false)).status).toBe(401);
	});

	it('devuelve los códigos coincidentes sin caché', async () => {
		db.findCodesByTarget.mockResolvedValue(['a', 'b']);
		const response = await get(`?url=${encodeURIComponent('https://a.com/')}`);
		expect(await response.json()).toEqual({ codes: ['a', 'b'] });
		expect(response.headers.get('Cache-Control')).toBe('no-store');
		expect(db.findCodesByTarget).toHaveBeenCalledWith('https://a.com/');
	});

	it('no consulta con URL vacía o demasiado larga', async () => {
		expect(await (await get('')).json()).toEqual({ codes: [] });
		expect(await (await get(`?url=${'a'.repeat(3000)}`)).json()).toEqual({ codes: [] });
		expect(db.findCodesByTarget).not.toHaveBeenCalled();
	});

	it('responde 500 si falla la base de datos', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		db.findCodesByTarget.mockRejectedValueOnce(new Error('caída'));
		expect((await get('?url=https://a.com')).status).toBe(500);
	});
});
