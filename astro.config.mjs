import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://andercmd.dev',
	vite: {
		plugins: [tailwindcss()],
		build: {
			// Optimizaciones de build
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					manualChunks: {
						// Separar React en su propio chunk
						'react-vendor': ['react', 'react-dom'],
					},
				},
			},
		},
		optimizeDeps: {
			include: ['react', 'react-dom'],
		},
	},
	integrations: [
		react({
			// Optimizar React para producción
			experimentalReactChildren: true,
		}),
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
		assets: '_astro',
	},
	// Prefetch para mejorar navegación
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	experimental: {
		clientPrerender: true,
	},
	// Optimización de imágenes
	image: {
		domains: ['raw.githubusercontent.com', 'cdn.worldvectorlogo.com'],
		remotePatterns: [
			{
				protocol: 'https',
			},
		],
	},
});
