import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'astro:env/server';
import { createHash } from 'node:crypto';
import mysql from 'mysql2/promise';
import { escapeLike, normalizeTarget } from './utils';

export interface LinkRecord {
	id: number;
	code: string;
	targetUrl: string;
	clicks: number;
	isActive: boolean;
	createdAt: string;
	expiresAt: string | null;
	autoDelete: boolean;
	isFavorite: boolean;
}

interface LinkRow extends mysql.RowDataPacket {
	id: number;
	code: string;
	target_url: string;
	clicks: number;
	is_active: number;
	created_at: string;
	expires_at: Date | null;
	auto_delete: number;
	is_favorite: number;
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const AUTO_CODE_LENGTH = 7;
const MAX_GENERATION_ATTEMPTS = 5;
const PURGE_INTERVAL_MS = 30_000;
const MAX_DUPLICATE_RESULTS = 20;

let pool: mysql.Pool | undefined;
let schemaReady: Promise<void> | undefined;
let lastPurgeAt = 0;

export function targetKey(targetUrl: string): string {
	return createHash('sha256').update(normalizeTarget(targetUrl)).digest('hex');
}

function getPool(): mysql.Pool {
	if (!pool) {
		pool = mysql.createPool({
			host: DB_HOST,
			port: DB_PORT,
			user: DB_USER,
			password: DB_PASSWORD,
			database: DB_NAME,
			waitForConnections: true,
			connectionLimit: 5,
			connectTimeout: 10_000,
			enableKeepAlive: true,
			charset: 'utf8mb4',
			timezone: 'Z',
			idleTimeout: 60_000,
		});
	}
	return pool;
}

async function ensureSchema(): Promise<void> {
	if (!schemaReady) {
		schemaReady = getPool()
			.query(
				`CREATE TABLE IF NOT EXISTS links (
					id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
					code VARCHAR(64) NOT NULL UNIQUE,
					target_url TEXT NOT NULL,
					clicks INT UNSIGNED NOT NULL DEFAULT 0,
					is_active TINYINT(1) NOT NULL DEFAULT 1,
					created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
					updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
			)
			.then(async () => {
				const db = getPool();
				const [columnRows] = await db.query<mysql.RowDataPacket[]>(
					`SELECT COLUMN_NAME FROM information_schema.COLUMNS
		 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'links'`
				);
				const columns = new Set(columnRows.map((row) => String(row.COLUMN_NAME).toLowerCase()));
				const additions: string[] = [];
				if (!columns.has('expires_at')) additions.push('ADD COLUMN expires_at DATETIME NULL');
				if (!columns.has('auto_delete')) additions.push('ADD COLUMN auto_delete TINYINT(1) NOT NULL DEFAULT 0');
				if (!columns.has('is_favorite')) additions.push('ADD COLUMN is_favorite TINYINT(1) NOT NULL DEFAULT 0');
				if (!columns.has('target_key')) additions.push('ADD COLUMN target_key CHAR(64) NULL');
				if (additions.length) {
					await db.query(`ALTER TABLE links ${additions.join(', ')}`);
				}
				await db.query(
					`UPDATE links SET target_key = SHA2(TRIM(TRAILING '/' FROM LOWER(TRIM(target_url))), 256) WHERE target_key IS NULL`
				);

				const [indexRows] = await db.query<mysql.RowDataPacket[]>(
					`SELECT DISTINCT INDEX_NAME FROM information_schema.STATISTICS
		 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'links'`
				);
				const indexes = new Set(indexRows.map((row) => String(row.INDEX_NAME).toLowerCase()));
				const wanted: Record<string, string> = {
					idx_links_created: '(created_at, id)',
					idx_links_favorite: '(is_favorite, created_at, id)',
					idx_links_expiry: '(auto_delete, expires_at)',
					idx_links_target_key: '(target_key)',
				};
				for (const [name, definition] of Object.entries(wanted)) {
					if (!indexes.has(name)) {
						await db.query(`CREATE INDEX ${name} ON links ${definition}`);
					}
				}
			})
			.catch((error: unknown) => {
				schemaReady = undefined;
				throw error;
			});
	}
	return schemaReady;
}

function mapRow(row: LinkRow): LinkRecord {
	return {
		id: row.id,
		code: row.code,
		targetUrl: row.target_url,
		clicks: row.clicks,
		isActive: row.is_active === 1,
		createdAt: row.created_at,
		expiresAt: row.expires_at ? row.expires_at.toISOString() : null,
		autoDelete: row.auto_delete === 1,
		isFavorite: row.is_favorite === 1,
	};
}

function generateCode(): string {
	let code = '';
	for (let i = 0; i < AUTO_CODE_LENGTH; i += 1) {
		code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
	}
	return code;
}

function isDuplicateEntryError(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';
}

export async function resolveLink(code: string): Promise<LinkRecord | null> {
	await ensureSchema();
	await purgeExpiredLinks();
	const [rows] = await getPool().query<LinkRow[]>(
		'SELECT * FROM links WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > UTC_TIMESTAMP()) LIMIT 1',
		[code]
	);
	return rows[0] ? mapRow(rows[0]) : null;
}

export async function registerClick(id: number): Promise<void> {
	await getPool().query('UPDATE links SET clicks = clicks + 1 WHERE id = ?', [id]);
}

async function purgeExpiredLinks(force = false): Promise<void> {
	const now = Date.now();
	if (!force && now - lastPurgeAt < PURGE_INTERVAL_MS) return;
	lastPurgeAt = now;
	await getPool().query(
		'DELETE FROM links WHERE auto_delete = 1 AND expires_at IS NOT NULL AND expires_at <= UTC_TIMESTAMP()'
	);
}

export interface LinkPage {
	items: LinkRecord[];
	total: number;
	page: number;
	totalPages: number;
}

export interface LinkCounts {
	all: number;
	favorites: number;
}

export async function listLinks(options: {
	page: number;
	pageSize: number;
	search?: string;
	favoritesOnly?: boolean;
}): Promise<LinkPage> {
	await ensureSchema();
	await purgeExpiredLinks(true);

	const conditions: string[] = [];
	const params: (string | number)[] = [];
	if (options.favoritesOnly) {
		conditions.push('is_favorite = 1');
	}
	const search = options.search?.trim();
	if (search) {
		const like = `%${escapeLike(search)}%`;
		conditions.push('(code LIKE ? OR target_url LIKE ?)');
		params.push(like, like);
	}
	const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

	const [countRows] = await getPool().query<mysql.RowDataPacket[]>(
		`SELECT COUNT(*) AS total FROM links ${where}`,
		params
	);
	const total = Number(countRows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / options.pageSize));
	const page = Math.min(Math.max(1, options.page), totalPages);

	const [rows] = await getPool().query<LinkRow[]>(
		`SELECT * FROM links ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
		[...params, options.pageSize, (page - 1) * options.pageSize]
	);
	return { items: rows.map(mapRow), total, page, totalPages };
}

export async function countLinks(): Promise<LinkCounts> {
	await ensureSchema();
	const [rows] = await getPool().query<mysql.RowDataPacket[]>(
		'SELECT COUNT(*) AS total, COALESCE(SUM(is_favorite), 0) AS favorites FROM links'
	);
	return { all: Number(rows[0]?.total ?? 0), favorites: Number(rows[0]?.favorites ?? 0) };
}

export async function findCodesByTarget(targetUrl: string): Promise<string[]> {
	await ensureSchema();
	const [rows] = await getPool().query<mysql.RowDataPacket[]>(
		'SELECT code FROM links WHERE target_key = ? ORDER BY created_at DESC, id DESC LIMIT ?',
		[targetKey(targetUrl), MAX_DUPLICATE_RESULTS]
	);
	return rows.map((row) => String(row.code));
}

export async function setLinkFavorite(code: string, isFavorite: boolean): Promise<void> {
	await getPool().query('UPDATE links SET is_favorite = ? WHERE code = ?', [isFavorite ? 1 : 0, code]);
}

export async function createLink(input: {
	code?: string;
	targetUrl: string;
	expiresAt?: Date;
	autoDelete?: boolean;
}): Promise<LinkRecord> {
	await ensureSchema();

	if (input.code) {
		try {
			const [result] = await getPool().query<mysql.ResultSetHeader>(
				'INSERT INTO links (code, target_url, target_key, expires_at, auto_delete) VALUES (?, ?, ?, ?, ?)',
				[
					input.code,
					input.targetUrl,
					targetKey(input.targetUrl),
					input.expiresAt ?? null,
					input.autoDelete ? 1 : 0,
				]
			);
			return {
				id: result.insertId,
				code: input.code,
				targetUrl: input.targetUrl,
				clicks: 0,
				isActive: true,
				createdAt: new Date().toISOString(),
				expiresAt: input.expiresAt?.toISOString() ?? null,
				autoDelete: Boolean(input.autoDelete),
				isFavorite: false,
			};
		} catch (error) {
			if (isDuplicateEntryError(error)) {
				throw new Error('DUPLICATE_CODE', { cause: error });
			}
			throw error;
		}
	}

	for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
		const code = generateCode();
		try {
			const [result] = await getPool().query<mysql.ResultSetHeader>(
				'INSERT INTO links (code, target_url, target_key, expires_at, auto_delete) VALUES (?, ?, ?, ?, ?)',
				[code, input.targetUrl, targetKey(input.targetUrl), input.expiresAt ?? null, input.autoDelete ? 1 : 0]
			);
			return {
				id: result.insertId,
				code,
				targetUrl: input.targetUrl,
				clicks: 0,
				isActive: true,
				createdAt: new Date().toISOString(),
				expiresAt: input.expiresAt?.toISOString() ?? null,
				autoDelete: Boolean(input.autoDelete),
				isFavorite: false,
			};
		} catch (error) {
			if (!isDuplicateEntryError(error)) {
				throw error;
			}
		}
	}

	throw new Error('CODE_GENERATION_FAILED');
}

export async function setLinkActive(code: string, isActive: boolean): Promise<void> {
	await getPool().query('UPDATE links SET is_active = ? WHERE code = ?', [isActive ? 1 : 0, code]);
}

export async function updateLinkTargetUrl(code: string, targetUrl: string): Promise<void> {
	await getPool().query('UPDATE links SET target_url = ?, target_key = ? WHERE code = ?', [
		targetUrl,
		targetKey(targetUrl),
		code,
	]);
}

export async function deleteLinkByCode(code: string): Promise<void> {
	await getPool().query('DELETE FROM links WHERE code = ?', [code]);
}

export async function renewLink(code: string, expiresAt: Date | null): Promise<void> {
	await getPool().query('UPDATE links SET expires_at = ? WHERE code = ?', [expiresAt, code]);
}
