export const getWorkExperience = (t: (key: string) => string) => [
	{
		active: true,
		nameCompany: 'NTT DATA México S. de R.L. de C.V.',
		position: t('WorkExperience.Companies.Position.5'),
		startDate: '11/2025',
		descriptionKey: 'WorkExperience.Companies.Description.5',
		...extractTechnologies(t('WorkExperience.Companies.Description.5')),
		location: 'Remoto',
		visit: '',
	},
	{
		active: false,
		nameCompany: 'Resser Tecnologías S.A de C.V',
		position: t('WorkExperience.Companies.Position.4'),
		startDate: '06/2025 • 09/2025',
		...extractTechnologies(t('WorkExperience.Companies.Description.4')),
		location: 'Presencial',
		visit: '',
	},
	{
		active: false,
		nameCompany: 'AMEDigital A.C.',
		position: t('WorkExperience.Companies.Position.3'),
		startDate: '06/2024 • 12/2024',
		...extractTechnologies(t('WorkExperience.Companies.Description.3')),
		location: 'Remoto',
		visit: 'https://www.amedigital.mx/',
	},
	{
		active: false,
		nameCompany: 'Diagnostico Moderno',
		position: t('WorkExperience.Companies.Position.2'),
		startDate: '03/2023 • 12/2024',
		...extractTechnologies(t('WorkExperience.Companies.Description.2')),
		location: 'Remoto',
		visit: 'https://www.diagnosticomoderno.com/',
	},
	{
		active: false,
		nameCompany: 'Intellion',
		position: t('WorkExperience.Companies.Position.1'),
		startDate: '05/2023 • 04/2024',
		...extractTechnologies(t('WorkExperience.Companies.Description.1')),
		location: 'Remoto',
		visit: '',
	},
];

// Helper function that was in the component
function extractTechnologies(description: string): { cleanDescription: string; technologies: string[] } {
	const techMatch = description.match(
		/Some of the technologies used are:|Algunas de las tecnologías utilizadas son:/i
	);

	if (!techMatch) {
		return { cleanDescription: description, technologies: [] };
	}

	const parts = description.split(techMatch[0]);
	const cleanDescription = parts[0].trim();

	const techString = parts[1] || '';
	const techMatch2 = techString.match(/\(([^)]+)\)/);

	if (!techMatch2) {
		return { cleanDescription, technologies: [] };
	}

	const technologies = techMatch2[1]
		.split(',')
		.map((tech) => tech.trim())
		.filter((tech) => tech.length > 0);

	return { cleanDescription, technologies };
}
