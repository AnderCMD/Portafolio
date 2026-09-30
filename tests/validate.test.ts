import { describe, expect, it } from 'vitest';
import { isValidCode, isValidTargetUrl } from '@lib/shortener/validate';

describe('isValidCode', () => {
	it.each(['abc', 'Mi-Link_1', 'a'.repeat(32), '2026'])('acepta %s', (code) => {
		expect(isValidCode(code)).toBe(true);
	});

	it.each(['ab', 'a'.repeat(33), 'con espacio', 'ñandú', 'a/b', 'a.b', '', '<script>'])('rechaza %j', (code) => {
		expect(isValidCode(code)).toBe(false);
	});

	it.each(['admin', 'ADMIN', 'Api', 'proyectos', '_astro', 'en'])('rechaza reservado %s', (code) => {
		expect(isValidCode(code)).toBe(false);
	});
});

describe('isValidTargetUrl', () => {
	it.each([
		'https://example.com',
		'http://example.com/path?q=1#x',
		'https://sub.example.com:8443/a',
		'https://user@example.com',
	])('acepta %s', (url) => {
		expect(isValidTargetUrl(url)).toBe(true);
	});

	it.each([
		'',
		'example.com',
		'ftp://example.com',
		'javascript:alert(1)',
		'data:text/html,<h1>x</h1>',
		'file:///etc/passwd',
		'https://',
	])('rechaza esquema/forma inválida %j', (url) => {
		expect(isValidTargetUrl(url)).toBe(false);
	});

	it.each([
		'http://localhost:3000',
		'http://LOCALHOST',
		'http://127.0.0.1',
		'http://[::1]/',
		'http://0.0.0.0',
		'https://andercmd.link/abc',
		'https://www.andercmd.link',
		'https://andercmd.link./abc',
	])('rechaza host bloqueado %s', (url) => {
		expect(isValidTargetUrl(url)).toBe(false);
	});

	it('rechaza URLs de más de 2048 caracteres', () => {
		expect(isValidTargetUrl(`https://example.com/${'a'.repeat(2048)}`)).toBe(false);
		expect(isValidTargetUrl(`https://example.com/${'a'.repeat(2000)}`)).toBe(true);
	});
});
