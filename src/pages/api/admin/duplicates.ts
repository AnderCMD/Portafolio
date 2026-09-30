export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { findCodesByTarget } from '@lib/shortener/db';
import { requireSession } from '@lib/shortener/guard';

const MAX_URL_LENGTH = 2048;
const NO_STORE = { 'Cache-Control': 'no-store' };

export const GET: APIRoute = async (context: APIContext) => {
	const unauthorized = requireSession(context);
	if (unauthorized) {
		return unauthorized;
	}

	const url = (context.url.searchParams.get('url') ?? '').trim();
	if (!url || url.length > MAX_URL_LENGTH) {
		return Response.json({ codes: [] }, { headers: NO_STORE });
	}

	try {
		return Response.json({ codes: await findCodesByTarget(url) }, { headers: NO_STORE });
	} catch (error) {
		console.error('[admin] duplicates lookup failed', error);
		return Response.json({ error: 'Error interno' }, { status: 500, headers: NO_STORE });
	}
};
