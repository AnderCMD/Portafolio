import type { AstroGlobal } from 'astro';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLangFromUrl, useTranslations } from '@/i18n/utils';

export const useLocale = (Astro: AstroGlobal) => {
	const Lang = getLangFromUrl(Astro.url) as 'es' | 'en';
	const t = useTranslations(Lang);
	const currentLocale: string = Astro.currentLocale;

	const supportedLocales: string[] = ['es', 'en'];

	if (!supportedLocales.includes(Lang)) {
		throw new Error(`Invalid locale: ${Lang}`);
	}

	return { Lang, t, currentLocale, getRelativeLocaleUrl };
};
