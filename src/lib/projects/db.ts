import { getPool } from '@lib/shortener/db';
import type mysql from 'mysql2/promise';

export interface ProjectRecord {
	id: number;
	slug: string;
	name: string;
	isActive: boolean;
	createdAt: string;
	lastCheckedAt: string | null;
	checkCount: number;
}

interface ProjectRow extends mysql.RowDataPacket {
	id: number;
	slug: string;
	name: string;
	is_active: number;
	created_at: Date | string;
	last_checked_at: Date | null;
	check_count: number;
}

let schemaReady: Promise<void> | undefined;

async function ensureSchema(): Promise<void> {
	if (!schemaReady) {
		schemaReady = getPool()
			.query(
				`CREATE TABLE IF NOT EXISTS projects (
					id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
					slug VARCHAR(64) NOT NULL UNIQUE,
					name VARCHAR(100) NOT NULL,
					is_active TINYINT(1) NOT NULL DEFAULT 1,
					check_count INT UNSIGNED NOT NULL DEFAULT 0,
					last_checked_at DATETIME NULL,
					created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
					updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
			)
			.then(() => undefined)
			.catch((error: unknown) => {
				schemaReady = undefined;
				throw error;
			});
	}
	return schemaReady;
}

function toIso(value: Date | string): string {
	return value instanceof Date ? value.toISOString() : new Date(`${value}Z`).toISOString();
}

function mapRow(row: ProjectRow): ProjectRecord {
	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		isActive: row.is_active === 1,
		createdAt: toIso(row.created_at),
		lastCheckedAt: row.last_checked_at ? row.last_checked_at.toISOString() : null,
		checkCount: row.check_count,
	};
}

function isDuplicateEntryError(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';
}

export async function listProjects(): Promise<ProjectRecord[]> {
	await ensureSchema();
	const [rows] = await getPool().query<ProjectRow[]>('SELECT * FROM projects ORDER BY created_at DESC, id DESC');
	return rows.map(mapRow);
}

export async function createProject(input: { slug: string; name: string }): Promise<void> {
	await ensureSchema();
	try {
		await getPool().query('INSERT INTO projects (slug, name) VALUES (?, ?)', [input.slug, input.name]);
	} catch (error) {
		if (isDuplicateEntryError(error)) throw new Error('DUPLICATE_SLUG', { cause: error });
		throw error;
	}
}

export async function setProjectActive(slug: string, isActive: boolean): Promise<void> {
	await ensureSchema();
	await getPool().query('UPDATE projects SET is_active = ? WHERE slug = ?', [isActive ? 1 : 0, slug]);
}

export async function deleteProject(slug: string): Promise<void> {
	await ensureSchema();
	await getPool().query('DELETE FROM projects WHERE slug = ?', [slug]);
}

/** Devuelve `null` si el proyecto no existe. Registra la consulta sin bloquear la respuesta. */
export async function checkProject(slug: string): Promise<boolean | null> {
	await ensureSchema();
	const [rows] = await getPool().query<ProjectRow[]>('SELECT id, is_active FROM projects WHERE slug = ? LIMIT 1', [
		slug,
	]);
	const row = rows[0];
	if (!row) return null;
	getPool()
		.query('UPDATE projects SET check_count = check_count + 1, last_checked_at = UTC_TIMESTAMP() WHERE id = ?', [
			row.id,
		])
		.catch((error: unknown) => console.error('[projects] could not register check', error));
	return row.is_active === 1;
}
