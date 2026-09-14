import { unlinkSync } from 'node:fs';
import http from 'node:http';
import { handler } from './entry.mjs';

const socketPath = process.env.LSNODE_SOCKET;

// El proxy de Hostinger (LiteSpeed) termina TLS y nos reenvía por un socket
// Unix en texto plano, sin exponer eso a través de X-Forwarded-Proto. Astro
// decide http/https mirando request.socket.encrypted, así que sin esto cree
// que el sitio es http:// y rechaza los POST de /Admin como cross-origin
// (Origin: https://... no coincide con su propio origin http://...).
function markSocketAsEncrypted(req, res) {
	req.socket.encrypted = true;
	return handler(req, res);
}

if (socketPath) {
	try {
		unlinkSync(socketPath);
	} catch {
		// El socket aún no existe en el primer arranque; no hay nada que limpiar.
	}

	http.createServer(markSocketAsEncrypted).listen(socketPath, () => {
		console.log(`[hostinger-entry] Listening on unix socket ${socketPath}`);
	});
} else {
	const port = process.env.PORT ? Number(process.env.PORT) : 8080;
	http.createServer(handler).listen(port, () => {
		console.log(`[hostinger-entry] Listening on port ${port}`);
	});
}
