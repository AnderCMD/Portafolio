# 🚀 Portafolio Personal - AnderCMD

<div align="center">

[![Astro](https://img.shields.io/badge/Astro-7-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](LICENSE)

**Portafolio personal moderno y optimizado para SEO**, desarrollado con las últimas tecnologías web. Diseño glassmorphism, animaciones fluidas y soporte completo de internacionalización (i18n). Es un proyecto personal, pero el repositorio es público y **abierto a contribuciones de la comunidad**.

[Ver Demo en Vivo](https://andercmd.dev) | [Reportar Bug](https://github.com/AnderCMD/Portafolio/issues) | [Solicitar Feature](https://github.com/AnderCMD/Portafolio/issues) | [Cómo contribuir](CONTRIBUTING.md)

</div>

---

## ✨ Características Principales

### 🎨 Diseño Moderno

- **Glassmorphism UI** - Efectos de vidrio esmerilado con backdrop blur
- **Gradientes Animados** - Transiciones suaves de color en títulos y elementos
- **Animaciones CSS** - Más de 10 animaciones personalizadas (fade, slide, float, etc.)
- **Modo Oscuro** - Soporte completo con transiciones suaves
- **Responsive Design** - Totalmente adaptable a todos los dispositivos

### 🚀 Optimización SEO

- ✅ **Meta Tags Completos** - Open Graph, Twitter Cards, Schema.org
- ✅ **Sitemap Automático** - Generación con soporte multiidioma
- ✅ **Robots.txt Optimizado** - Configuración para bots de búsqueda
- ✅ **PWA Ready** - Manifest.json configurado
- ✅ **Security Headers** - CSP, X-Frame-Options, y más
- ✅ **Canonical URLs** - Evita contenido duplicado
- ✅ **HTML Comprimido** - Optimización de rendimiento

### 🌍 Internacionalización

- 🇪🇸 Español (por defecto)
- 🇺🇸 Inglés
- Sistema de routing inteligente sin prefijo para idioma por defecto

### 🎯 Secciones y Componentes

- **Navbar Sticky** - Con efecto glassmorphism
- **Hero Section** - Con imagen flotante y animaciones
- **Experiencia Laboral** - Línea de tiempo visual con gradientes
- **Proyectos** - Cards con filtros por categoría y efectos hover
- **Certificados** - Cursos y diplomados obtenidos, agrupados por institución
- **Tech Stack Grid** - Iconos interactivos con animaciones
- **Footer Mejorado** - Con enlaces sociales, tooltips y enlaces legales
- **Aviso de Privacidad y Términos y Condiciones** - Páginas legales, disponibles en español e inglés

_Este proyecto es un portafolio personal desarrollado con Astro, React, TailwindCSS y soporte para internacionalización (i18n). Permite mostrar tus proyectos, experiencia, certificados y habilidades, con la capacidad de cambiar entre diferentes idiomas._

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

Mira [**Despliegue**](#despliegue-) para conocer cómo desplegar el proyecto.

### Pre-requisitos 📋

Para ejecutar este proyecto en tu máquina, necesitas tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [pnpm](https://pnpm.io/) para gestionar las dependencias

### Instalación 🔧

1. Clona el repositorio

   ```bash
   git clone https://github.com/AnderCMD/Portafolio.git
   ```

2. Navega al directorio del proyecto

   ```bash
   cd Portafolio
   ```

3. Instala las dependencias

   ```bash
   pnpm install
   ```

   > pnpm bloquea por seguridad los scripts de instalación de paquetes con binarios nativos (`esbuild`, `sharp`, `@tailwindcss/oxide`). Este repositorio ya trae la aprobación necesaria versionada en [`pnpm-workspace.yaml`](pnpm-workspace.yaml), así que no deberías necesitar ejecutar `pnpm approve-builds` manualmente. Si `pnpm install` avisa de builds ignorados, corre `pnpm approve-builds` y aprueba `esbuild`, `sharp` y `@tailwindcss/oxide`.

4. Ejecuta el proyecto en modo desarrollo

   ```bash
   pnpm dev
   ```

5. Abre el navegador y accede a `http://localhost:4321`

## Scripts disponibles 📜

| Script              | Descripción                                                           |
| :------------------ | :-------------------------------------------------------------------- |
| `pnpm dev`          | Levanta el servidor de desarrollo en `http://localhost:4321`.         |
| `pnpm build`        | Verifica tipos (`astro check`) y genera el sitio estático en `dist/`. |
| `pnpm preview`      | Sirve localmente el build de producción generado en `dist/`.          |
| `pnpm lint`         | Analiza `.astro`, `.ts`, `.tsx`, `.js` y `.jsx` con ESLint.           |
| `pnpm lint:fix`     | Igual que `lint`, pero aplica automáticamente los fixes seguros.      |
| `pnpm format`       | Formatea todo el repositorio con Prettier.                            |
| `pnpm format:check` | Verifica el formato sin escribir cambios (recomendado para CI).       |

## Ejecutando las pruebas ⚙️

Este proyecto no incluye pruebas automatizadas, pero puedes verificar su funcionamiento manualmente:

1. Corre `pnpm lint` y `pnpm format:check` para validar estilo y calidad de código.
2. Corre `pnpm build` para confirmar que el sitio compila sin errores de tipos.
3. Abre el sitio en tu navegador y navega por las distintas secciones.
4. Cambia entre los idiomas (español e inglés) y entre modo claro/oscuro, y verifica que el contenido se muestre correctamente.

## Despliegue 📦

Para desplegar este proyecto en un servidor web:

1. Construye el proyecto:

   ```bash
   pnpm build
   ```

2. Sube el contenido de la carpeta `dist/` a tu hosting de sitios estáticos (Vercel, Netlify, Cloudflare Pages, etc.).

Este sitio en particular corre en **Hostinger (Node.js PaaS)** desplegando directamente desde este repositorio con `pnpm` como gestor de paquetes; el build remoto ejecuta el mismo script `pnpm build` de este `package.json`.

## 🛠️ Stack Tecnológico

### Core

- **[Astro 7](https://astro.build/)** - Framework web moderno para sitios rápidos
- **[React 19](https://react.dev/)** - Librería UI para componentes interactivos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### Características

- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - Generación automática de sitemap
- **i18n nativo de Astro** - Sistema de internacionalización integrado
- **Font Awesome 6** - Iconos vectoriales
- **Sharp** - Optimización de imágenes vía `astro:assets`

### Calidad de código

- **[Prettier](https://prettier.io/)** (+ `prettier-plugin-astro`, `prettier-plugin-tailwindcss`) - Formato consistente en todo el repo (`pnpm format` / `pnpm format:check`).
- **[ESLint](https://eslint.org/)** (+ `eslint-plugin-astro`, `typescript-eslint`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`) - Linting de `.astro`, `.ts` y `.jsx`, incluyendo reglas de accesibilidad (`pnpm lint` / `pnpm lint:fix`).

### Herramientas para agentes de IA

- **Graphify** - Skill que convierte el código de este repositorio en un grafo de conocimiento persistente (nodos "god", detección de comunidades y consultas de rutas/relaciones). Útil para que un agente de IA entienda rápidamente la arquitectura y las relaciones entre archivos antes de hacer cambios. Ver [AGENTS.md](AGENTS.md) para más contexto sobre el flujo de trabajo con agentes.

### DevOps & Deployment

- **pnpm** - Gestor de paquetes eficiente
- **Hostinger Node.js PaaS** - Hosting y build en producción
- Compatible con **Vercel/Netlify/Cloudflare Pages** para quien haga fork del proyecto

## Contribuyendo 🖇️

Este es mi portafolio personal, pero el repositorio es público y las contribuciones de la comunidad son bienvenidas: correcciones de bugs, mejoras de accesibilidad/performance, traducciones, etc. Antes de abrir un PR, lee la [guía de contribución](CONTRIBUTING.md) y [AGENTS.md](AGENTS.md) (convenciones de arquitectura, estilo y linting del proyecto).

## Autores ✒️

- **Ander González** - _Ingeniero en Software_ - [AnderCMD](https://github.com/AnderCMD)

## Licencia 📄

Este proyecto está bajo la Licencia Apache 2.0 - mira el archivo [LICENSE](LICENSE) para más detalles.

---

⌨️ con ❤️ por [AnderCMD](https://github.com/AnderCMD) 😊
