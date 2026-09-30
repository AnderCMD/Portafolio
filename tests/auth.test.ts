import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSessionToken, verifyPassword, verifySessionToken, verifyUsername } from '@lib/shortener/auth';

describe('sesión', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('acepta un token recién creado', () => {
		expect(verifySessionToken(createSessionToken())).toBe(true);
	});

	it('rechaza tokens vacíos o mal formados', () => {
		expect(verifySessionToken(undefined)).toBe(false);
		expect(verifySessionToken('')).toBe(false);
		expect(verifySessionToken('abc')).toBe(false);
		expect(verifySessionToken('.')).toBe(false);
		expect(verifySessionToken('123.')).toBe(false);
	});

	it('rechaza firmas alteradas', () => {
		const [payload, signature] = createSessionToken().split('.');
		const tampered = `${payload}.${signature!.replace(/.$/, signature!.endsWith('0') ? '1' : '0')}`;
		expect(verifySessionToken(tampered)).toBe(false);
	});

	it('rechaza un payload modificado con la firma original', () => {
		const [payload, signature] = createSessionToken().split('.');
		expect(verifySessionToken(`${Number(payload) + 10_000_000}.${signature}`)).toBe(false);
	});

	it('expira a las 8 horas', () => {
		const token = createSessionToken();
		vi.advanceTimersByTime(8 * 3600 * 1000 - 1000);
		expect(verifySessionToken(token)).toBe(true);
		vi.advanceTimersByTime(2000);
		expect(verifySessionToken(token)).toBe(false);
	});
});

describe('credenciales', () => {
	it('verifica usuario', () => {
		expect(verifyUsername('admin')).toBe(true);
		expect(verifyUsername('Admin')).toBe(false);
		expect(verifyUsername('admin ')).toBe(false);
		expect(verifyUsername('')).toBe(false);
	});

	it('verifica contraseña', () => {
		expect(verifyPassword('correct-horse')).toBe(true);
		expect(verifyPassword('wrong')).toBe(false);
		expect(verifyPassword('')).toBe(false);
	});
});
