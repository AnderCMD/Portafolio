import { ui, defaultLang } from '@/i18n/ui';

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key];
	};
}

// Función para calcular años de experiencia desde mayo 2023
export function calculateYearsOfExperience(): number {
	const startMonth = 5; // Mayo
	const startYear = 2023;

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;

	const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
	const years = Math.round((totalMonths / 12) * 10) / 10;

	return years;
}
