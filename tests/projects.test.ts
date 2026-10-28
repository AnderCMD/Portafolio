import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { APIContext } from 'astro';
import { createSessionToken, SESSION_COOKIE } from '@lib/shortener/auth';

const db = vi.hoisted(() => ({
	checkProject: vi.fn(),
	createProject: vi.fn(),
	deleteProject: vi.fn(),
	setProjectActive: vi.fn(),
}));
vi.mock('@lib/projects/db', () => db);

import { GET as statusGet } from '../src/pages/api/status/[slug]';
import { POST as createPost } from '../src/pages/api/admin/projects';
import { POST as actionPost } from '../src/pages/api/admin/projects/[slug]';

function ctx(options: { body?: Record<string, string>; slug?: string; auth?: boolean } = {}) {
	const { body = {}, slug, auth = true } = options;
	const token = auth ? createSessionToken() : undefined;
	return {
		request: new Request('http://localhost/x', { method: 'POST', body: new URLSearchParams(body) }),
		params: { slug },
		cookies: { get: (name: string) => (name === SESSION_COOKIE && token ? { value: token } : undefined) },
		redirect: (location: string, status = 302) => new Response(null, { status, headers: { Location: location } }),
	} as unknown as APIContext;
}

const location = (response: Response | void) => (response as Response).headers.get('Location');

beforeEach(() => {
	for (const fn of Object.values(db)) fn.mockReset().mockResolvedValue(undefined);
});

describe('GET /api/status/[slug]', () => {
	it('devuelve active true para un proyecto activo', async () => {
		db.checkProject.mockResolvedValue(true);
		const response = (await statusGet(ctx({ slug: 'acme-erp' }))) as Response;
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ active: true });
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('devuelve active false para un proyecto bloqueado', async () => {
		db.checkProject.mockResolvedValue(false);
		const response = (await statusGet(ctx({ slug: 'acme-erp' }))) as Response;
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ active: false });
	});

	it('normaliza mayúsculas del identificador', async () => {
		db.checkProject.mockResolvedValue(true);
		await statusGet(ctx({ slug: 'Acme-ERP' }));
		expect(db.checkProject).toHaveBeenCalledWith('acme-erp');
	});

	it('responde 404 con active false si el proyecto no existe', async () => {
		db.checkProject.mockResolvedValue(null);
		const response = (await statusGet(ctx({ slug: 'nope' }))) as Response;
		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ active: false });
	});

	it('responde 404 sin tocar la base de datos si el identificador es inválido', async () => {
		const response = (await statusGet(ctx({ slug: 'a b!' }))) as Response;
		expect(response.status).toBe(404);
		expect(db.checkProject).not.toHaveBeenCalled();
	});

	it('responde 503 si la base de datos falla', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		db.checkProject.mockRejectedValue(new Error('down'));
		const response = (await statusGet(ctx({ slug: 'acme-erp' }))) as Response;
		expect(response.status).toBe(503);
		expect((await response.json()) as object).not.toHaveProperty('active');
	});
});

describe('POST /api/admin/projects', () => {
	it('exige sesión', async () => {
		const response = (await createPost(ctx({ auth: false, body: { slug: 'acme', name: 'Acme' } }))) as Response;
		expect(response.status).toBe(401);
		expect(db.createProject).not.toHaveBeenCalled();
	});

	it('crea el proyecto', async () => {
		const response = await createPost(ctx({ body: { slug: ' Acme-ERP ', name: ' Acme ' } }));
		expect(location(response)).toBe('/Admin/Proyectos');
		expect(db.createProject).toHaveBeenCalledWith({ slug: 'acme-erp', name: 'Acme' });
	});

	it('rechaza identificador o nombre inválidos', async () => {
		expect(location(await createPost(ctx({ body: { slug: 'a', name: 'Acme' } })))).toBe(
			'/Admin/Proyectos?error=slug'
		);
		expect(location(await createPost(ctx({ body: { slug: 'acme', name: '  ' } })))).toBe(
			'/Admin/Proyectos?error=name'
		);
		expect(db.createProject).not.toHaveBeenCalled();
	});

	it('reporta identificadores duplicados', async () => {
		db.createProject.mockRejectedValue(new Error('DUPLICATE_SLUG'));
		expect(location(await createPost(ctx({ body: { slug: 'acme', name: 'Acme' } })))).toBe(
			'/Admin/Proyectos?error=duplicate'
		);
	});
});

describe('POST /api/admin/projects/[slug]', () => {
	it('exige sesión', async () => {
		const response = (await actionPost(ctx({ auth: false, slug: 'acme', body: { action: 'delete' } }))) as Response;
		expect(response.status).toBe(401);
		expect(db.deleteProject).not.toHaveBeenCalled();
	});

	it('bloquea y activa', async () => {
		await actionPost(ctx({ slug: 'acme', body: { action: 'toggle', active: '0' } }));
		expect(db.setProjectActive).toHaveBeenLastCalledWith('acme', false);
		await actionPost(ctx({ slug: 'acme', body: { action: 'toggle', active: '1' } }));
		expect(db.setProjectActive).toHaveBeenLastCalledWith('acme', true);
	});

	it('elimina', async () => {
		const response = await actionPost(ctx({ slug: 'acme', body: { action: 'delete' } }));
		expect(location(response)).toBe('/Admin/Proyectos');
		expect(db.deleteProject).toHaveBeenCalledWith('acme');
	});

	it('rechaza acciones y slugs inválidos', async () => {
		expect(((await actionPost(ctx({ slug: 'acme', body: { action: 'x' } }))) as Response).status).toBe(400);
		expect(((await actionPost(ctx({ slug: 'A B', body: { action: 'delete' } }))) as Response).status).toBe(400);
	});
});
