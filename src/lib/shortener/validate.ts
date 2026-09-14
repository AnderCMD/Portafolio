const CODE_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;
// Incluye las rutas estáticas del portafolio: como el mismo despliegue Node.js sirve
// ambos dominios, un código igual a una ruta o asset existente sería interceptado por
// el servidor de archivos estáticos antes de llegar al middleware del acortador.
const RESERVED_CODES = new Set([
	'admin',
	'api',
	'login',
	'logout',
	'index',
	'en',
	'400',
	'401',
	'403',
	'404',
	'500',
	'502',
	'503',
	'proyectos',
	'projects',
	'contacto',
	'contact',
	'experiencia',
	'experience',
	'certificados',
	'certificates',
	'favicon.ico',
	'robots.txt',
	'manifest.json',
	'og-image.webp',
	'sitemap-index.xml',
	'download',
	'fontawesome',
	'fonts',
	'icons',
	'_astro',
]);
const BLOCKED_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);

export function isValidCode(code: string): boolean {
	return CODE_PATTERN.test(code) && !RESERVED_CODES.has(code.toLowerCase());
}

export function isValidTargetUrl(value: string): boolean {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return false;
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		return false;
	}

	return !BLOCKED_HOSTNAMES.has(url.hostname.toLowerCase());
}
