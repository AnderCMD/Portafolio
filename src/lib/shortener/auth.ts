import { ADMIN_PASSWORD_HASH, ADMIN_USERNAME, SESSION_SECRET } from 'astro:env/server';
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 horas

function sign(payload: string): string {
	return createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
	const bufferA = Buffer.from(a);
	const bufferB = Buffer.from(b);
	if (bufferA.length !== bufferB.length) {
		return false;
	}
	return timingSafeEqual(bufferA, bufferB);
}

export function createSessionToken(): string {
	const expiresAt = String(Date.now() + SESSION_TTL_MS);
	return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
	if (!token) {
		return false;
	}

	const [payload, signature] = token.split('.');
	if (!payload || !signature || !safeEqual(signature, sign(payload))) {
		return false;
	}

	const expiresAt = Number(payload);
	return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export function verifyUsername(candidate: string): boolean {
	return safeEqual(candidate, ADMIN_USERNAME);
}

export function verifyPassword(candidate: string): boolean {
	const [algorithm, salt, hashHex] = ADMIN_PASSWORD_HASH.split(':');
	if (algorithm !== 'scrypt' || !salt || !hashHex) {
		throw new Error('ADMIN_PASSWORD_HASH tiene un formato inválido.');
	}

	const candidateHash = scryptSync(candidate, salt, 64);
	const storedHash = Buffer.from(hashHex, 'hex');
	return candidateHash.length === storedHash.length && timingSafeEqual(candidateHash, storedHash);
}
