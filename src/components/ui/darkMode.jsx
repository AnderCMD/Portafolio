import { useEffect } from 'react';
import { ThemeProvider, ThemeSwitch, useTheme } from 'theme-switcher-ts/react';
import 'theme-switcher-ts/styles/base.css';
import 'theme-switcher-ts/styles/variants/glassmorphism.css';

// Importar logos desde Astro Assets
import LogoBlanco from '@/assets/images/logos/Logo-Blanco.webp';
import LogoNegro from '@/assets/images/logos/Logo-Negro.webp';
import IconoBlanco from '@/assets/images/logos/Icono-Blanco.webp';
import IconoNegro from '@/assets/images/logos/Icono-Negro.webp';

// Sincroniza los logos del sitio (data-logo-theme) con el tema resuelto por theme-switcher-ts.
function LogoSync() {
	const { theme } = useTheme();

	useEffect(() => {
		const isDark = theme === 'dark';

		requestAnimationFrame(() => {
			const logos = document.querySelectorAll('[data-logo-theme]');
			logos.forEach((logo) => {
				const type = logo.getAttribute('data-logo-theme');
				const path =
					type === 'logo'
						? isDark
							? LogoBlanco.src
							: LogoNegro.src
						: isDark
							? IconoBlanco.src
							: IconoNegro.src;

				if (logo.getAttribute('src') !== path) {
					logo.setAttribute('src', path);
				}
			});
		});
	}, [theme]);

	return null;
}

export default function DarkMode() {
	return (
		<ThemeProvider storageKey="Theme" defaultPreference="dark">
			<LogoSync />
			<div className="flex items-center gap-2 lg:flex-col">
				<ThemeSwitch variant="glassmorphism" ariaLabel="Cambiar entre modo claro y oscuro" />
			</div>
		</ThemeProvider>
	);
}
