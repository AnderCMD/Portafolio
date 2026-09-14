import { defineMiddleware } from 'astro:middleware';

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

	// Import diferido: evita que este módulo (y las variables de entorno de la
	// base de datos que exige) se cargue durante el prerenderizado estático del
	// portafolio, que nunca pasa por esta rama.
	const { registerClick, resolveLink } = await import('@lib/shortener/db');

	const link = await resolveLink(code);

	if (!link) {
		return new Response('Enlace no encontrado', { status: 404 });
	}

	await registerClick(link.id);

	return Response.redirect(link.targetUrl, 302);
});
