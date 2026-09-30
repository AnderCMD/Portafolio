import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			'astro:env/server': fileURLToPath(new URL('./tests/stubs/astro-env-server.ts', import.meta.url)),
			'@lib': src('lib'),
			'@': src(''),
		},
	},
	test: {
		environment: 'node',
		include: ['tests/**/*.test.ts'],
		clearMocks: true,
		restoreMocks: true,
		coverage: { include: ['src/lib/shortener/**', 'src/pages/api/admin/**'] },
	},
});
