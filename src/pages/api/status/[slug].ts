export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { checkProject } from '@lib/projects/db';
import { isValidSlug, normalizeSlug } from '@lib/projects/validate';

// Endpoint público: lo consultan los proyectos externos (servidor o navegador).
// Solo expone un booleano, nunca datos del proyecto.
const HEADERS = {
	'Content-Type': 'application/json',
	'Cache-Control': 'no-store',
	'Access-Control-Allow-Origin': '*',
	'X-Content-Type-Options': 'nosniff',
};

const json = (body: unknown, status: number, extra: Record<string, string> = {}) =>
	new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...extra } });

export const GET: APIRoute = async (context: APIContext) => {
	const slug = normalizeSlug(context.params.slug ?? '');
	if (!isValidSlug(slug)) {
		return json({ active: false }, 404);
	}

	try {
		const active = await checkProject(slug);
		return active === null ? json({ active: false }, 404) : json({ active }, 200);
	} catch (error) {
		console.error('[projects] checkProject failed', error);
		return json({ error: 'unavailable' }, 503, { 'Retry-After': '30' });
	}
};

export const OPTIONS: APIRoute = () =>
	new Response(null, {
		status: 204,
		headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
	});
