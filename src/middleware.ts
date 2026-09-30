import { defineMiddleware } from 'astro:middleware';
import { isValidCode } from '@lib/shortener/validate';

const SHORTENER_HOSTS = new Set(['andercmd.link', 'www.andercmd.link']);

export const onRequest = defineMiddleware(async (context, next) => {
	if (!SHORTENER_HOSTS.has(context.url.hostname)) {
		return next();
	}

	const path = context.url.pathname;

	// El panel de administración solo se expone en el dominio principal del portafolio.
	if (path.startsWith('/Admin') || path.startsWith('/api/admin')) {
		return new Response('Not found', { status: 404 });
	}

	const code = path.replace(/^\/+|\/+$/g, '');

	if (!code) {
		return Response.redirect('https://andercmd.dev', 302);
	}

	if (!isValidCode(code)) {
		return new Response('Enlace no encontrado', { status: 404 });
	}

	// Import diferido: evita que este módulo (y las variables de entorno de la
	// base de datos que exige) se cargue durante el prerenderizado estático del
	// portafolio, que nunca pasa por esta rama.
	const { registerClick, resolveLink } = await import('@lib/shortener/db');

	let link;
	try {
		link = await resolveLink(code);
	} catch (error) {
		console.error('[shortener] resolveLink failed', error);
		return new Response('Servicio no disponible', { status: 503, headers: { 'Retry-After': '30' } });
	}

	if (!link) {
		return new Response('Enlace no encontrado', { status: 404 });
	}

	registerClick(link.id).catch((error: unknown) => console.error('[shortener] registerClick failed', error));

	return new Response(null, {
		status: 302,
		headers: { Location: link.targetUrl, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
	});
});
