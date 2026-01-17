export function getYearsOfExperience(): number {
	const startMonth = 5;
	const startYear = 2023;

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;

	const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
	const years = Math.round((totalMonths / 12) * 10) / 10;

	return years;
}

