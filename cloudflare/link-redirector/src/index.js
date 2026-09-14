import { createConnection } from 'mysql2/promise';

const RESERVED_CODES = new Set(['admin', 'api', 'login', 'logout', 'favicon.ico', 'robots.txt']);

async function resolveTarget(env, code) {
	const connection = await createConnection({
		host: env.HYPERDRIVE.host,
		user: env.HYPERDRIVE.user,
		password: env.HYPERDRIVE.password,
		database: env.HYPERDRIVE.database,
		port: env.HYPERDRIVE.port,
		disableEval: true,
	});

	try {
		const [rows] = await connection.query(
			'SELECT id, target_url FROM links WHERE code = ? AND is_active = 1 LIMIT 1',
			[code]
		);
		const link = rows[0];
		if (!link) {
			return null;
		}

		await connection.query('UPDATE links SET clicks = clicks + 1 WHERE id = ?', [link.id]);
		return link.target_url;
	} finally {
		await connection.end();
	}
}

export default {
	async fetch(request, env) {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			return new Response('Method not allowed', { status: 405 });
		}

		const url = new URL(request.url);
		const code = url.pathname.replace(/^\/+|\/+$/g, '');

		if (!code || RESERVED_CODES.has(code.toLowerCase())) {
			return Response.redirect('https://andercmd.dev', 302);
		}

		try {
			const target = await resolveTarget(env, code);
			if (!target) {
				return new Response('Enlace no encontrado', { status: 404 });
			}
			return Response.redirect(target, 302);
		} catch (error) {
			console.error('link-redirector error', error);
			return new Response('Error interno', { status: 500 });
		}
	},
};
