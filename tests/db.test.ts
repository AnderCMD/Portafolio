import { beforeEach, describe, expect, it, vi } from 'vitest';

const query = vi.fn();
const createPool = vi.fn(() => ({ query }));
vi.mock('mysql2/promise', () => ({ default: { createPool } }));

type Db = typeof import('@lib/shortener/db');

const ALL_COLUMNS = [
	'id',
	'code',
	'target_url',
	'clicks',
	'is_active',
	'created_at',
	'expires_at',
	'auto_delete',
	'is_favorite',
	'target_key',
].map((COLUMN_NAME) => ({ COLUMN_NAME }));
const ALL_INDEXES = ['idx_links_created', 'idx_links_favorite', 'idx_links_expiry', 'idx_links_target_key'].map(
	(INDEX_NAME) => ({ INDEX_NAME })
);

function row(overrides: Record<string, unknown> = {}) {
	return {
		id: 1,
		code: 'abc',
		target_url: 'https://example.com',
		clicks: 3,
		is_active: 1,
		created_at: '2026-01-01',
		expires_at: null,
		auto_delete: 0,
		is_favorite: 0,
		...overrides,
	};
}

function mockSchema(columns = ALL_COLUMNS, indexes = ALL_INDEXES) {
	query.mockImplementation(async (sql: string) => {
		if (sql.includes('information_schema.COLUMNS')) return [columns];
		if (sql.includes('information_schema.STATISTICS')) return [indexes];
		return [[]];
	});
}

async function load(): Promise<Db> {
	vi.resetModules();
	return import('@lib/shortener/db');
}

const sqlCalls = () => query.mock.calls.map(([sql]) => String(sql));

beforeEach(() => {
	query.mockReset();
	createPool.mockClear();
});

describe('targetKey', () => {
	it('es estable ante mayúsculas, espacios y barra final', async () => {
		const { targetKey } = await load();
		expect(targetKey(' HTTPS://Example.com/A/ ')).toBe(targetKey('https://example.com/a'));
		expect(targetKey('https://example.com/a')).toMatch(/^[0-9a-f]{64}$/);
		expect(targetKey('https://example.com/a')).not.toBe(targetKey('https://example.com/b'));
	});
});

describe('ensureSchema (vía listLinks)', () => {
	it('no altera nada si el esquema está completo', async () => {
		mockSchema();
		const db = await load();
		await db.countLinks();
		const sql = sqlCalls();
		expect(sql.some((s) => s.startsWith('ALTER TABLE'))).toBe(false);
		expect(sql.some((s) => s.startsWith('CREATE INDEX'))).toBe(false);
	});

	it('agrega columnas e índices faltantes y rellena target_key', async () => {
		mockSchema(
			ALL_COLUMNS.filter((c) => !['is_favorite', 'target_key'].includes(c.COLUMN_NAME)),
			[]
		);
		const db = await load();
		await db.countLinks();
		const sql = sqlCalls();
		const alter = sql.find((s) => s.startsWith('ALTER TABLE'));
		expect(alter).toContain('is_favorite');
		expect(alter).toContain('target_key');
		expect(alter).not.toContain('expires_at');
		expect(sql.some((s) => s.includes('SET target_key = SHA2'))).toBe(true);
		expect(sql.filter((s) => s.startsWith('CREATE INDEX'))).toHaveLength(4);
	});

	it('ejecuta la migración una sola vez por proceso', async () => {
		mockSchema();
		const db = await load();
		await db.countLinks();
		await db.countLinks();
		expect(sqlCalls().filter((s) => s.includes('information_schema.COLUMNS'))).toHaveLength(1);
	});

	it('reintenta si la migración falla', async () => {
		query.mockRejectedValueOnce(new Error('boom'));
		const db = await load();
		await expect(db.countLinks()).rejects.toThrow('boom');
		mockSchema();
		query.mockClear();
		await expect(db.countLinks()).resolves.toBeDefined();
	});
});

describe('listLinks', () => {
	function mockList(total: number, rows: unknown[]) {
		query.mockImplementation(async (sql: string) => {
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			if (sql.includes('COUNT(*) AS total')) return [[{ total }]];
			if (sql.startsWith('SELECT * FROM links')) return [rows];
			return [[]];
		});
	}
	const select = () => query.mock.calls.find(([sql]) => String(sql).startsWith('SELECT * FROM links'))!;

	it('consulta solo una página con LIMIT/OFFSET', async () => {
		mockList(24, [row()]);
		const db = await load();
		const page = await db.listLinks({ page: 2, pageSize: 10 });
		const [sql, params] = select();
		expect(sql).toContain('LIMIT ? OFFSET ?');
		expect(params).toEqual([10, 10]);
		expect(page).toMatchObject({ total: 24, page: 2, totalPages: 3 });
		expect(page.items[0]).toMatchObject({
			code: 'abc',
			isActive: true,
			isFavorite: false,
			expiresAt: null,
			autoDelete: false,
		});
	});

	it('ajusta páginas fuera de rango a la última', async () => {
		mockList(24, []);
		const db = await load();
		const page = await db.listLinks({ page: 99, pageSize: 10 });
		expect(page.page).toBe(3);
		expect(select()[1]).toEqual([10, 20]);
	});

	it('con cero resultados devuelve una página', async () => {
		mockList(0, []);
		const db = await load();
		expect(await db.listLinks({ page: 5, pageSize: 10 })).toMatchObject({ total: 0, page: 1, totalPages: 1 });
	});

	it('busca con LIKE escapado y parametrizado', async () => {
		mockList(1, [row()]);
		const db = await load();
		await db.listLinks({ page: 1, pageSize: 10, search: ' 50%_x ' });
		const [sql, params] = select();
		expect(sql).toContain('(code LIKE ? OR target_url LIKE ?)');
		expect(sql).not.toContain('50');
		expect(params).toEqual(['%50\\%\\_x%', '%50\\%\\_x%', 10, 0]);
	});

	it('filtra favoritos y combina con búsqueda', async () => {
		mockList(1, [row({ is_favorite: 1 })]);
		const db = await load();
		const page = await db.listLinks({ page: 1, pageSize: 10, favoritesOnly: true, search: 'a' });
		expect(select()[0]).toContain('WHERE is_favorite = 1 AND (code LIKE ?');
		expect(page.items[0]?.isFavorite).toBe(true);
	});

	it('elimina vencidos con auto-borrado antes de listar', async () => {
		mockList(0, []);
		const db = await load();
		await db.listLinks({ page: 1, pageSize: 10 });
		expect(sqlCalls().some((s) => s.startsWith('DELETE FROM links WHERE auto_delete = 1'))).toBe(true);
	});

	it('convierte expires_at a ISO', async () => {
		mockList(1, [row({ expires_at: new Date('2026-10-01T05:55:00Z'), auto_delete: 1 })]);
		const db = await load();
		const { items } = await db.listLinks({ page: 1, pageSize: 10 });
		expect(items[0]).toMatchObject({ expiresAt: '2026-10-01T05:55:00.000Z', autoDelete: true });
	});
});

describe('countLinks', () => {
	it('devuelve totales numéricos', async () => {
		query.mockImplementation(async (sql: string) => {
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[{ total: '5', favorites: '2' }]];
		});
		const db = await load();
		expect(await db.countLinks()).toEqual({ all: 5, favorites: 2 });
	});
});

describe('findCodesByTarget', () => {
	it('busca por hash normalizado con límite', async () => {
		query.mockImplementation(async (sql: string) => {
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[{ code: 'a' }, { code: 'b' }]];
		});
		const db = await load();
		expect(await db.findCodesByTarget('HTTPS://Example.com/')).toEqual(['a', 'b']);
		const call = query.mock.calls.find(([sql]) => String(sql).includes('WHERE target_key = ?'))!;
		expect(call[1]).toEqual([db.targetKey('https://example.com'), 20]);
	});
});

describe('resolveLink', () => {
	function mockResolve(rows: unknown[]) {
		query.mockImplementation(async (sql: string) => {
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			if (sql.startsWith('SELECT * FROM links')) return [rows];
			return [[]];
		});
	}

	it('filtra por activo y no vencido', async () => {
		mockResolve([row()]);
		const db = await load();
		expect((await db.resolveLink('abc'))?.code).toBe('abc');
		const [sql, params] = query.mock.calls.find(([s]) => String(s).startsWith('SELECT * FROM links'))!;
		expect(sql).toContain('is_active = 1');
		expect(sql).toContain('expires_at > UTC_TIMESTAMP()');
		expect(params).toEqual(['abc']);
	});

	it('devuelve null si no existe', async () => {
		mockResolve([]);
		const db = await load();
		expect(await db.resolveLink('nope')).toBeNull();
	});

	it('limita la purga a una vez cada 30 segundos', async () => {
		vi.useFakeTimers();
		try {
			mockResolve([]);
			const db = await load();
			await db.resolveLink('a');
			await db.resolveLink('b');
			const deletes = () => sqlCalls().filter((s) => s.startsWith('DELETE FROM links WHERE auto_delete')).length;
			expect(deletes()).toBe(1);
			vi.advanceTimersByTime(31_000);
			await db.resolveLink('c');
			expect(deletes()).toBe(2);
		} finally {
			vi.useRealTimers();
		}
	});
});

describe('escrituras', () => {
	beforeEach(() => mockSchema());

	it('createLink con código personalizado guarda clave de destino', async () => {
		const db = await load();
		query.mockImplementation(async (sql: string) => {
			if (sql.startsWith('INSERT')) return [{ insertId: 7 }];
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[]];
		});
		const link = await db.createLink({
			code: 'mio',
			targetUrl: 'https://Example.com/',
			autoDelete: true,
			expiresAt: new Date('2030-01-01Z'),
		});
		expect(link).toMatchObject({
			id: 7,
			code: 'mio',
			autoDelete: true,
			isFavorite: false,
			expiresAt: '2030-01-01T00:00:00.000Z',
		});
		const insert = query.mock.calls.find(([sql]) => String(sql).startsWith('INSERT'))!;
		expect(insert[1]).toEqual([
			'mio',
			'https://Example.com/',
			db.targetKey('https://example.com'),
			new Date('2030-01-01Z'),
			1,
		]);
	});

	it('createLink lanza DUPLICATE_CODE con código repetido', async () => {
		const db = await load();
		query.mockImplementation(async (sql: string) => {
			if (sql.startsWith('INSERT')) throw Object.assign(new Error('dup'), { code: 'ER_DUP_ENTRY' });
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[]];
		});
		await expect(db.createLink({ code: 'mio', targetUrl: 'https://a.com' })).rejects.toThrow('DUPLICATE_CODE');
	});

	it('createLink reintenta códigos generados y falla tras 5 colisiones', async () => {
		const db = await load();
		query.mockImplementation(async (sql: string) => {
			if (sql.startsWith('INSERT')) throw Object.assign(new Error('dup'), { code: 'ER_DUP_ENTRY' });
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[]];
		});
		await expect(db.createLink({ targetUrl: 'https://a.com' })).rejects.toThrow('CODE_GENERATION_FAILED');
		expect(sqlCalls().filter((s) => s.startsWith('INSERT'))).toHaveLength(5);
	});

	it('createLink propaga errores que no son duplicados', async () => {
		const db = await load();
		query.mockImplementation(async (sql: string) => {
			if (sql.startsWith('INSERT')) throw new Error('conexión perdida');
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[]];
		});
		await expect(db.createLink({ targetUrl: 'https://a.com' })).rejects.toThrow('conexión perdida');
	});

	it('createLink genera códigos de 7 caracteres válidos', async () => {
		const db = await load();
		query.mockImplementation(async (sql: string) => {
			if (sql.startsWith('INSERT')) return [{ insertId: 1 }];
			if (sql.includes('information_schema.COLUMNS')) return [ALL_COLUMNS];
			if (sql.includes('information_schema.STATISTICS')) return [ALL_INDEXES];
			return [[]];
		});
		const link = await db.createLink({ targetUrl: 'https://a.com' });
		expect(link.code).toMatch(/^[A-HJ-NP-Za-km-z2-9]{7}$/);
	});

	it.each([
		['setLinkActive', ['abc', false], 'UPDATE links SET is_active = ?', [0, 'abc']],
		['setLinkFavorite', ['abc', true], 'UPDATE links SET is_favorite = ?', [1, 'abc']],
		['deleteLinkByCode', ['abc'], 'DELETE FROM links WHERE code = ?', ['abc']],
		['renewLink', ['abc', null], 'UPDATE links SET expires_at = ?', [null, 'abc']],
	] as const)('%s usa SQL parametrizado', async (fn, args, sqlStart, params) => {
		const db = await load();
		await (db[fn] as (...a: unknown[]) => Promise<void>)(...args);
		const call = query.mock.calls.find(([sql]) => String(sql).startsWith(sqlStart))!;
		expect(call[1]).toEqual(params);
	});

	it('updateLinkTargetUrl actualiza también la clave de destino', async () => {
		const db = await load();
		await db.updateLinkTargetUrl('abc', 'https://nuevo.com/');
		const call = query.mock.calls.find(([sql]) => String(sql).startsWith('UPDATE links SET target_url'))!;
		expect(call[1]).toEqual(['https://nuevo.com/', db.targetKey('https://nuevo.com'), 'abc']);
	});
});
