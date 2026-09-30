import { describe, expect, it } from 'vitest';
import {
	computePageRange,
	escapeLike,
	normalizeTarget,
	parseFutureDate,
	parsePage,
	parseRenewDays,
	parseSearch,
	safeReturnPath,
	withError,
} from '@lib/shortener/utils';

describe('safeReturnPath', () => {
	it.each(['/Admin', '/Admin/', '/Admin?page=2', '/Admin?tab=favorites&q=x', '/Admin#top'])('acepta %s', (path) => {
		expect(safeReturnPath(path)).toBe(path);
	});

	it.each([
		'//evil.com',
		'https://evil.com',
		'/Administrator',
		'/Admin\\evil',
		'/Admin?x=1\r\nSet-Cookie: a=b',
		'/api/admin/links',
		'',
	])('rechaza %j', (path) => {
		expect(safeReturnPath(path)).toBe('/Admin');
	});

	it('rechaza valores que no son texto', () => {
		expect(safeReturnPath(null)).toBe('/Admin');
		expect(safeReturnPath(undefined)).toBe('/Admin');
		expect(safeReturnPath(new File([''], 'a.txt'))).toBe('/Admin');
	});
});

describe('withError', () => {
	it('agrega el error conservando la consulta', () => {
		expect(withError('/Admin?tab=favorites&page=2', 'url')).toBe('/Admin?tab=favorites&page=2&error=url');
	});

	it('reemplaza un error previo', () => {
		expect(withError('/Admin?error=code', 'url')).toBe('/Admin?error=url');
	});
});

describe('escapeLike', () => {
	it('escapa comodines de LIKE', () => {
		expect(escapeLike('50%_off\\x')).toBe('50\\%\\_off\\\\x');
	});

	it('no modifica texto normal', () => {
		expect(escapeLike('hola')).toBe('hola');
	});
});

describe('normalizeTarget', () => {
	it('ignora mayúsculas, espacios y barras finales', () => {
		expect(normalizeTarget('  HTTPS://Example.com/Path//  ')).toBe('https://example.com/path');
	});
});

describe('parsePage', () => {
	it.each([
		['3', 3],
		['1', 1],
		['0', 1],
		['-4', 1],
		['abc', 1],
		['', 1],
		[null, 1],
		[undefined, 1],
		['99999999999999999999', 1],
	])('parsePage(%j) = %i', (input, expected) => {
		expect(parsePage(input as string | null | undefined)).toBe(expected);
	});
});

describe('parseSearch', () => {
	it('recorta espacios y limita a 100 caracteres', () => {
		expect(parseSearch('  hola  ')).toBe('hola');
		expect(parseSearch('a'.repeat(300))).toHaveLength(100);
		expect(parseSearch(null)).toBe('');
	});
});

describe('parseRenewDays', () => {
	it.each([
		['1', 1],
		['365', 365],
		['3650', 3650],
	])('acepta %s', (input, expected) => {
		expect(parseRenewDays(input)).toBe(expected);
	});

	it.each(['0', '-1', '3651', '1.5', 'abc', '', '1e3', '10000', ' 7'])('rechaza %j', (input) => {
		expect(parseRenewDays(input)).toBeNull();
	});

	it('rechaza null', () => {
		expect(parseRenewDays(null)).toBeNull();
	});
});

describe('parseFutureDate', () => {
	const now = Date.parse('2026-01-01T00:00:00Z');

	it('acepta fechas futuras', () => {
		expect(parseFutureDate('2026-01-02T00:00:00.000Z', now)?.toISOString()).toBe('2026-01-02T00:00:00.000Z');
	});

	it('rechaza fechas pasadas, iguales a ahora, inválidas o vacías', () => {
		expect(parseFutureDate('2025-12-31T00:00:00Z', now)).toBeNull();
		expect(parseFutureDate('2026-01-01T00:00:00Z', now)).toBeNull();
		expect(parseFutureDate('no-es-fecha', now)).toBeNull();
		expect(parseFutureDate('', now)).toBeNull();
	});
});

describe('computePageRange', () => {
	it('devuelve 0-0 sin resultados', () => {
		expect(computePageRange(0, 1, 10, 0)).toEqual({ start: 0, end: 0 });
	});

	it('calcula páginas completas y parciales', () => {
		expect(computePageRange(24, 1, 10, 10)).toEqual({ start: 1, end: 10 });
		expect(computePageRange(24, 3, 10, 4)).toEqual({ start: 21, end: 24 });
	});
});
