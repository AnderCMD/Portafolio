import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	site: 'https://andercmd.github.io/Portafolio', // URL de tu página en GitHub Pages
	base: '/Portafolio/', // Nombre del repositorio como base
	integrations: [tailwind(), react()],
	i18n: {
		locales: ['es', 'en'],
		defaultLocale: 'es',
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: true,
		},
	},
});
