import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://andercmd.com',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		react(),
		sitemap({
			i18n: {
				defaultLocale: 'es',
				locales: {
					es: 'es-MX',
					en: 'en-US',
				},
			},
			filter: (page) => !page.includes('/404'),
		}),
	],
	i18n: {
		defaultLocale: 'es',
		locales: ['es', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	compressHTML: true,
	build: {
		inlineStylesheets: 'auto',
	},
});
