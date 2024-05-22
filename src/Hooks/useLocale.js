// Dependencias
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLangFromUrl, useTranslations } from '../i18n/utils';

// useLocale
export const useLocale = (Astro) => {
	const Lang = getLangFromUrl(Astro.url);
	const t = useTranslations(Lang);
	const { currentLocale } = Astro;

	return { Lang, t, currentLocale, getRelativeLocaleUrl };
};
