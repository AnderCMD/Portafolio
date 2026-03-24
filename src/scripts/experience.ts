export function getYearsOfExperienceFormatted(): string {
	const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
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

export function updateExperienceUI() {
	const formattedExperience = getYearsOfExperienceFormatted();
	const elements = document.querySelectorAll('.experience-years-count');
	elements.forEach((el) => {
		el.textContent = formattedExperience;
	});

	// Also update active job durations if present (Calculated in months as requested previously)
	const activeDurations = document.querySelectorAll('.active-duration');
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;

	activeDurations.forEach((el) => {
		const startDateAttr = el.getAttribute('data-start-date');
		if (!startDateAttr) return;

		// startDate format: "MM/YYYY" from experience.ts
		const parts = startDateAttr.split('•')[0].trim().split('/');
		if (parts.length < 2) return;
		
		const startMonth = parseInt(parts[0]);
		const startYear = parseInt(parts[1]);

		if (isNaN(startMonth) || isNaN(startYear)) return;

		const monthsTotal = (currentYear - startYear) * 12 + (currentMonth - startMonth);
		
		const labelMonth = el.getAttribute('data-label-month') || (document.documentElement.lang === 'en' ? 'Month' : 'Mes');
		const labelMonths = el.getAttribute('data-label-months') || (document.documentElement.lang === 'en' ? 'Months' : 'Meses');
		const label = monthsTotal === 1 ? labelMonth : labelMonths;

		el.textContent = `${monthsTotal} ${label}`;
	});
}
