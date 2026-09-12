// Imagenes
import CoddyTechJSFundamentals from '@/assets/images/certificates/coddytech-javascript-fundamentals.webp';
import HackerRankProblemSolvingIntermediate from '@/assets/images/certificates/hackerrank-problem-solving-intermediate.webp';
import HackerRankCSharpBasic from '@/assets/images/certificates/hackerrank-csharp-basic.webp';
import HackerRankNodeBasic from '@/assets/images/certificates/hackerrank-node-basic.webp';
import HackerRankPythonBasic from '@/assets/images/certificates/hackerrank-python-basic.webp';
import HackerRankJavaScriptIntermediate from '@/assets/images/certificates/hackerrank-javascript-intermediate.webp';
import HackerRankSoftwareEngineer from '@/assets/images/certificates/hackerrank-software-engineer.webp';
import HackerRankProblemSolvingBasic from '@/assets/images/certificates/hackerrank-problem-solving-basic.webp';
import HackerRankJavaScriptBasic from '@/assets/images/certificates/hackerrank-javascript-basic.webp';
import HackerRankCSSBasic from '@/assets/images/certificates/hackerrank-css-basic.webp';
import PlatziEscuelaDesarrolloWeb from '@/assets/images/certificates/platzi-escuela-desarrollo-web.webp';
import PlatziPreworkEntornoTrabajo from '@/assets/images/certificates/platzi-prework-entorno-trabajo.webp';
import PlatziBackendNestJS from '@/assets/images/certificates/platzi-backend-nestjs.webp';
import OtrosIncubacionEmprendimiento from '@/assets/images/certificates/otros-incubacion-emprendimiento.webp';
import OtrosTecnologiasEmergentes2024 from '@/assets/images/certificates/otros-tecnologias-emergentes-2024.webp';
import PlatziFullstackJavaScript from '@/assets/images/certificates/platzi-fullstack-javascript.webp';
import PlatziGitGithub from '@/assets/images/certificates/platzi-git-github.webp';
import PlatziEntornoLinux from '@/assets/images/certificates/platzi-entorno-linux.webp';
import PlatziEntornoMacOS from '@/assets/images/certificates/platzi-entorno-macos.webp';
import PlatziTerminalLineaComandos from '@/assets/images/certificates/platzi-terminal-linea-comandos.webp';
import PlatziEntornoWindows from '@/assets/images/certificates/platzi-entorno-windows.webp';
import PlatziIntroduccionReactNative from '@/assets/images/certificates/platzi-introduccion-react-native.webp';
import DMFHackAI2024 from '@/assets/images/certificates/dmf-hackai-2024.webp';
import DMF2024 from '@/assets/images/certificates/dmf-2024.webp';
import FCSFundamentosIA from '@/assets/images/certificates/fcs-fundamentos-ia.webp';
import FCSDesarrolloWebIntegral from '@/assets/images/certificates/fcs-desarrollo-web-integral.webp';
import OtrosSIGA2023 from '@/assets/images/certificates/otros-siga-2023.webp';
import FCSValoresDelSer from '@/assets/images/certificates/fcs-valores-del-ser.webp';
import FCSAsistenteWeb from '@/assets/images/certificates/fcs-asistente-web.webp';

export const getCertificates = (t: (key: string) => string) => [
	{
		title: t('Certificates.Items.Title.1'),
		issuer: 'Coddy Tech',
		date: '07/2026',
		image: CoddyTechJSFundamentals,
	},
	{
		title: t('Certificates.Items.Title.2'),
		issuer: 'HackerRank',
		date: '04/2025',
		image: HackerRankProblemSolvingIntermediate,
	},
	{
		title: t('Certificates.Items.Title.3'),
		issuer: 'HackerRank',
		date: '04/2025',
		image: HackerRankCSharpBasic,
	},
	{
		title: t('Certificates.Items.Title.4'),
		issuer: 'HackerRank',
		date: '04/2025',
		image: HackerRankNodeBasic,
	},
	{
		title: t('Certificates.Items.Title.5'),
		issuer: 'HackerRank',
		date: '04/2025',
		image: HackerRankPythonBasic,
	},
	{
		title: t('Certificates.Items.Title.6'),
		issuer: 'HackerRank',
		date: '01/2025',
		image: HackerRankJavaScriptIntermediate,
	},
	{
		title: t('Certificates.Items.Title.7'),
		issuer: 'HackerRank',
		date: '12/2024',
		image: HackerRankSoftwareEngineer,
	},
	{
		title: t('Certificates.Items.Title.8'),
		issuer: 'HackerRank',
		date: '12/2024',
		image: HackerRankProblemSolvingBasic,
	},
	{
		title: t('Certificates.Items.Title.9'),
		issuer: 'HackerRank',
		date: '12/2024',
		image: HackerRankJavaScriptBasic,
	},
	{
		title: t('Certificates.Items.Title.10'),
		issuer: 'HackerRank',
		date: '12/2024',
		image: HackerRankCSSBasic,
	},
	{
		title: t('Certificates.Items.Title.11'),
		issuer: 'Platzi',
		date: '11/2024',
		image: PlatziEscuelaDesarrolloWeb,
	},
	{
		title: t('Certificates.Items.Title.12'),
		issuer: 'Platzi',
		date: '11/2024',
		image: PlatziPreworkEntornoTrabajo,
	},
	{
		title: t('Certificates.Items.Title.13'),
		issuer: 'Platzi',
		date: '09/2024',
		image: PlatziBackendNestJS,
	},
	{
		title: t('Certificates.Items.Title.14'),
		issuer: 'Idea GTO · JuventudEsGTO',
		date: '08/2024',
		image: OtrosIncubacionEmprendimiento,
	},
	{
		title: t('Certificates.Items.Title.15'),
		issuer: 'Emtech Institute & Santander Open Academy',
		date: '06/2024',
		image: OtrosTecnologiasEmergentes2024,
	},
	{
		title: t('Certificates.Items.Title.16'),
		issuer: 'Platzi',
		date: '06/2024',
		image: PlatziFullstackJavaScript,
	},
	{
		title: t('Certificates.Items.Title.17'),
		issuer: 'Platzi',
		date: '06/2024',
		image: PlatziGitGithub,
	},
	{
		title: t('Certificates.Items.Title.18'),
		issuer: 'Platzi',
		date: '06/2024',
		image: PlatziEntornoLinux,
	},
	{
		title: t('Certificates.Items.Title.19'),
		issuer: 'Platzi',
		date: '06/2024',
		image: PlatziEntornoMacOS,
	},
	{
		title: t('Certificates.Items.Title.20'),
		issuer: 'Platzi',
		date: '06/2024',
		image: PlatziTerminalLineaComandos,
	},
	{
		title: t('Certificates.Items.Title.21'),
		issuer: 'Platzi',
		date: '05/2024',
		image: PlatziEntornoWindows,
	},
	{
		title: t('Certificates.Items.Title.22'),
		issuer: 'Platzi',
		date: '05/2024',
		image: PlatziIntroduccionReactNative,
	},
	{
		title: t('Certificates.Items.Title.23'),
		issuer: 'IDEA GTO · Gobierno de Guanajuato',
		date: '04/2024',
		image: DMFHackAI2024,
	},
	{
		title: t('Certificates.Items.Title.24'),
		issuer: 'IDEA GTO · Gobierno de Guanajuato',
		date: '04/2024',
		image: DMF2024,
	},
	{
		title: t('Certificates.Items.Title.25'),
		issuer: 'Fundación Carlos Slim',
		date: '04/2024',
		image: FCSFundamentosIA,
	},
	{
		title: t('Certificates.Items.Title.26'),
		issuer: 'Fundación Carlos Slim',
		date: '10/2023',
		image: FCSDesarrolloWebIntegral,
	},
	{
		title: t('Certificates.Items.Title.27'),
		issuer: 'Gobierno de Monterrey',
		date: '07/2023',
		image: OtrosSIGA2023,
	},
	{
		title: t('Certificates.Items.Title.28'),
		issuer: 'Fundación Carlos Slim',
		date: '11/2022',
		image: FCSValoresDelSer,
	},
	{
		title: t('Certificates.Items.Title.29'),
		issuer: 'Fundación Carlos Slim',
		date: '11/2017',
		image: FCSAsistenteWeb,
	},
];
