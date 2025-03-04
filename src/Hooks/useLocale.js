// Dependencias
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLangFromUrl, useTranslations } from '@/i18n/utils';

// useLocale
export const useLocale = (Astro) => {
	const Lang = getLangFromUrl(Astro.url);
	const t = useTranslations(Lang);
	const { currentLocale } = Astro;

	// Asegúrate de que Astro.locales está definido y contiene los locales esperados
	const supportedLocales = Astro.locales || ['es', 'en'];

	// Valida que el idioma actual sea uno de los idiomas soportados
	if (!supportedLocales.includes(Lang)) {
		throw new Error(`Invalid locale: ${Lang}`);
	}

	return { Lang, t, currentLocale, getRelativeLocaleUrl };
};
