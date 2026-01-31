// Imagenes
import HoroscopoImagen from '@/assets/images/projects/Horoscope.webp';
import CalculatorImagen from '@/assets/images/projects/Calculator.webp';
import GPTLocalImagen from '@/assets/images/projects/GPT-Local.webp';
import AMEDigitalImagen from '@/assets/images/projects/AMEDigital.webp';
import DiagnosticoModernoImagen from '@/assets/images/projects/DiagnosticoModerno.webp';
import EcologiXImagen from '@/assets/images/projects/EcologiX.webp';
import FlappyBatImagen from '@/assets/images/projects/FlappyBat.webp';
import ChatBotImagen from '@/assets/images/projects/ChatBot.webp';
import FrontendMentorImagen from '@/assets/images/projects/Frontend-Mentor.webp';
import WindowsRepairImagen from '@/assets/images/projects/WindowsRepair.webp';
import TasksFlowImagen from '@/assets/images/projects/TasksFlow.webp';
import SETIPOSImagen from '@/assets/images/projects/SETIPOS.webp';
import ResserSaaSImagen from '@/assets/images/projects/ResserSaaS.webp';
import SETIImagen from '@/assets/images/projects/SETI.webp';

export const getProjects = (t: (key: string) => string) => [
	{
		type: 'web',
		title: t('Projects.Title.1'),
		description: t('Projects.Description.1'),
		image: HoroscopoImagen,
		linkView: 'https://andercmd.github.io/Desafios-Codedex/Horoscopo/',
		linkCode: 'https://github.com/AnderCMD/Desafios-Codedex/tree/main/Horoscopo',
		year: 2024,
		technologies: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub']
	},
	{
		type: 'web',
		title: t('Projects.Title.2'),
		description: t('Projects.Description.2'),
		image: CalculatorImagen,
		linkView: 'https://andercmd.github.io/Calculadora/',
		linkCode: 'https://github.com/AnderCMD/Calculadora',
		year: 2023,
		technologies: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub']
	},
	{
		type: 'web',
		title: t('Projects.Title.3'),
		description: t('Projects.Description.3'),
		image: GPTLocalImagen,
		linkView: 'https://andercmd.github.io/GPT-Local/',
		linkCode: 'https://github.com/AnderCMD/GPT-Local',
		year: 2024,
		technologies: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub']
	},
	{
		type: 'web',
		title: t('Projects.Title.4'),
		description: t('Projects.Description.4'),
		image: AMEDigitalImagen,
		linkView: 'https://www.amedigital.mx',
		year: 2024,
		technologies: ['Astro', ' React', 'JavaScript', 'TailwindCSS', 'Git & GitHub']
	},
	{
		type: 'web',
		title: t('Projects.Title.5'),
		description: t('Projects.Description.5'),
		image: DiagnosticoModernoImagen,
		linkView: 'https://www.diagnosticomoderno.com/',
		year: 2023,
		technologies: ['Astro', ' React', 'JavaScript', 'TailwindCSS', 'Git & GitHub']
	},
	{
		type: 'web',
		title: t('Projects.Title.7'),
		description: t('Projects.Description.7'),
		image: EcologiXImagen,
		linkCode: 'https://github.com/AnderCMD/EcologiX',
		year: 2023,
		technologies: ['React Vite', 'NodeJS Express', 'JavaScript', 'TailwindCSS', 'Arduino', 'Git & GitHub']
	},
	{
		type: 'mobile',
		title: t('Projects.Title.8'),
		description: t('Projects.Description.8'),
		image: FlappyBatImagen,
		linkCode: 'https://github.com/AnderCMD/Flappy-Bat',
		linkDownload: 'https://1drv.ms/f/c/520c89d29ae3998b/IgBMU_9g6VKfQZw7eHa4z2YXAfcKjJ94gAIPsUTK0pgzzFk?e=znQZou',
		year: 2022,
		technologies: ['Unity', 'C#']
	},
	{
		type: 'web',
		title: t('Projects.Title.9'),
		description: t('Projects.Description.9'),
		image: ChatBotImagen,
		linkView: 'https://andercmd.github.io/Chat-Bot/',
		linkCode: 'https://github.com/AnderCMD/Chat-Bot',
		year: 2022,
		technologies: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub']
	},
	{
		type: 'web',
		title: t('Projects.Title.10'),
		description: t('Projects.Description.10'),
		image: FrontendMentorImagen,
		linkView: 'https://andercmd.github.io/Desafios-Frontend-Mentor/',
		linkCode: 'https://github.com/AnderCMD/Desafios-Frontend-Mentor/',
		year: 2023,
		technologies: ['React Vite', 'JavaScript', 'HTML', 'CSS', 'TailwindCSS', 'Git & GitHub']
	},
	{
		type: 'other',
		title: t('Projects.Title.11'),
		description: t('Projects.Description.11'),
		image: WindowsRepairImagen,
		linkCode: 'https://github.com/AnderCMD/Fix-Windows',
		linkDownload: '/Download/Scripts/FixWindows.bat',
		year: 2024,
		technologies: ['Batch']
	},
	{
		type: 'web',
		title: t('Projects.Title.12'),
		description: t('Projects.Description.12'),
		image: TasksFlowImagen,
		linkView: 'https://tasksflow.andercmd.dev',
		linkCode: 'https://github.com/AnderCMD/TasksFlow',
		year: 2025,
		technologies: ['Redux', 'React Vite', 'JavaScript', 'TailwindCSS', 'Git & Github']
	},
	{
		type: 'web',
		title: t('Projects.Title.13'),
		description: t('Projects.Description.13'),
		image: SETIPOSImagen,
		year: 2025,
		technologies: ['React Vite', 'JavaScript', 'TypeScript', 'TailwindCSS', 'NodeJS Express', 'MongoDB', 'Docker', 'Git & GitHub'],
	},
	{
		type: 'web',
		title: t('Projects.Title.14'),
		description: t('Projects.Description.14'),
		image: ResserSaaSImagen,
		year: 2025,
		technologies: ['React Vite', 'TypeScript', 'AntDesign', 'C# .Net 8', 'SQL Server', 'Azure', 'Git'],
	},
	{
		type: 'web',
		title: t('Projects.Title.15'),
		description: t('Projects.Description.15'),
		image: SETIImagen,
		linkView: 'https://sistemasempresariales.com.mx',
		year: 2026,
		technologies: ['Astro', 'TypeScript', 'TailwindCSS', 'Git', 'i18n', 'React'],
	},
];
