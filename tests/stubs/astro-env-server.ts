import { scryptSync } from 'node:crypto';

export const DB_HOST = 'localhost';
export const DB_PORT = 3306;
export const DB_USER = 'test';
export const DB_PASSWORD = 'test';
export const DB_NAME = 'test';
export const ADMIN_USERNAME = 'admin';
export const SESSION_SECRET = 'test-secret-test-secret-test-secret';
export const ADMIN_PASSWORD_HASH = `scrypt:pepper:${scryptSync('correct-horse', 'pepper', 64).toString('hex')}`;
