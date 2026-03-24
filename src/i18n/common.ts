export function getYearsOfExperience(lang: 'es' | 'en' = 'es'): string {
	const startMonth = 5;
	const startYear = 2023;

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;

	const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	if (lang === 'es') {
		const yearStr = years === 1 ? 'año' : 'años';
		const monthStr = months === 1 ? 'mes' : 'meses';
		if (months === 0) return `${years} ${yearStr}`;
		if (years === 0) return `${months} ${monthStr}`;
		return `${years} ${yearStr} y ${months} ${monthStr}`;
	} else {
		const yearStr = years === 1 ? 'year' : 'years';
		const monthStr = months === 1 ? 'month' : 'months';
		if (months === 0) return `${years} ${yearStr}`;
		if (years === 0) return `${months} ${monthStr}`;
		return `${years} ${yearStr} and ${months} ${monthStr}`;
	}
}
