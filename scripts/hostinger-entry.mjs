import { unlinkSync } from 'node:fs';
import http from 'node:http';
import { handler } from './entry.mjs';

const socketPath = process.env.LSNODE_SOCKET;

if (socketPath) {
	try {
		unlinkSync(socketPath);
	} catch {
		// El socket aún no existe en el primer arranque; no hay nada que limpiar.
	}

	http.createServer(handler).listen(socketPath, () => {
		console.log(`[hostinger-entry] Listening on unix socket ${socketPath}`);
	});
} else {
	const port = process.env.PORT ? Number(process.env.PORT) : 8080;
	http.createServer(handler).listen(port, () => {
		console.log(`[hostinger-entry] Listening on port ${port}`);
	});
}
