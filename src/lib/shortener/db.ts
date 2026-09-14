import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'astro:env/server';
import mysql from 'mysql2/promise';

export interface LinkRecord {
	id: number;
	code: string;
	targetUrl: string;
	clicks: number;
	isActive: boolean;
	createdAt: string;
}

interface LinkRow extends mysql.RowDataPacket {
	id: number;
	code: string;
	target_url: string;
	clicks: number;
	is_active: number;
	created_at: string;
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const AUTO_CODE_LENGTH = 7;
const MAX_GENERATION_ATTEMPTS = 5;

let pool: mysql.Pool | undefined;
let schemaReady: Promise<void> | undefined;

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
			.then(() => undefined);
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
	const [rows] = await getPool().query<LinkRow[]>('SELECT * FROM links WHERE code = ? AND is_active = 1 LIMIT 1', [
		code,
	]);
	return rows[0] ? mapRow(rows[0]) : null;
}

export async function registerClick(id: number): Promise<void> {
	await getPool().query('UPDATE links SET clicks = clicks + 1 WHERE id = ?', [id]);
}

export async function listLinks(): Promise<LinkRecord[]> {
	await ensureSchema();
	const [rows] = await getPool().query<LinkRow[]>('SELECT * FROM links ORDER BY created_at DESC');
	return rows.map(mapRow);
}

export async function createLink(input: { code?: string; targetUrl: string }): Promise<LinkRecord> {
	await ensureSchema();

	if (input.code) {
		try {
			const [result] = await getPool().query<mysql.ResultSetHeader>(
				'INSERT INTO links (code, target_url) VALUES (?, ?)',
				[input.code, input.targetUrl]
			);
			return {
				id: result.insertId,
				code: input.code,
				targetUrl: input.targetUrl,
				clicks: 0,
				isActive: true,
				createdAt: new Date().toISOString(),
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
				'INSERT INTO links (code, target_url) VALUES (?, ?)',
				[code, input.targetUrl]
			);
			return {
				id: result.insertId,
				code,
				targetUrl: input.targetUrl,
				clicks: 0,
				isActive: true,
				createdAt: new Date().toISOString(),
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

export async function deleteLinkByCode(code: string): Promise<void> {
	await getPool().query('DELETE FROM links WHERE code = ?', [code]);
}
