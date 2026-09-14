import type { APIContext } from 'astro';
import { SESSION_COOKIE, verifySessionToken } from '@lib/shortener/auth';

export function requireSession(context: APIContext): Response | null {
	const token = context.cookies.get(SESSION_COOKIE)?.value;
	if (verifySessionToken(token)) {
		return null;
	}

	return new Response(JSON.stringify({ error: 'No autorizado' }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' },
	});
}

export function getClientKey(request: Request, clientAddress: string | undefined): string {
	const forwarded = request.headers.get('x-forwarded-for');
	const first = forwarded?.split(',')[0]?.trim();
	return first || clientAddress || 'unknown';
}
