# Guía de Contribución

¡Gracias por tu interés en contribuir al portafolio de **AnderCMD**! Aunque es un proyecto personal, el repositorio es público y abierto a la comunidad: correcciones de bugs, mejoras de accesibilidad/rendimiento, traducciones o ajustes de estilo son bienvenidos.

## Antes de empezar

- Revisa los [issues abiertos](https://github.com/AnderCMD/Portafolio/issues) para evitar trabajo duplicado.
- Para cambios grandes o de diseño, abre primero un issue describiendo la propuesta antes de invertir tiempo en el PR.
- Lee [AGENTS.md](AGENTS.md): define la arquitectura, los alias de importación, las convenciones de i18n/SEO/accesibilidad y las reglas de estilo que sigue este proyecto (usado tanto por agentes de IA como por personas).

## Requisitos

- [Node.js](https://nodejs.org/) LTS
- [pnpm](https://pnpm.io/)

## Flujo de trabajo

1. Haz un fork del repositorio y clónalo localmente.
2. Instala las dependencias:

   ```bash
   pnpm install
   ```

   Si `pnpm` avisa de "ignored builds", corre `pnpm approve-builds` y aprueba `esbuild`, `sharp` y `@tailwindcss/oxide` (necesarios para compilar imágenes y estilos). El archivo `pnpm-workspace.yaml` con esa aprobación ya está versionado en el repo.

3. Crea una rama descriptiva a partir de `dev`:

   ```bash
   git checkout -b fix/nombre-del-cambio
   ```

4. Levanta el entorno de desarrollo:

   ```bash
   pnpm dev
   ```

5. Haz tus cambios siguiendo las convenciones de [AGENTS.md](AGENTS.md) (alias `@/`, `@components/`, etc., i18n en `src/i18n/locales/`, datos estáticos en `src/data/`).

6. Antes de abrir el PR, verifica que todo pase:

   ```bash
   pnpm format       # formatea con Prettier
   pnpm lint         # linting con ESLint (incluye .astro y accesibilidad)
   pnpm build        # astro check + build de producción
   ```

7. Si tu cambio afecta texto visible, agrega la traducción correspondiente en **ambos** `src/i18n/locales/es.ts` y `src/i18n/locales/en.ts`.

8. Prueba manualmente en el navegador: ambos idiomas (`/` y `/en/`) y ambos modos de color (claro/oscuro).

## Estilo de commits

Este proyecto usa un estilo tipo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.) para los mensajes de commit. No es estrictamente obligatorio, pero ayuda a mantener el historial legible.

## Abriendo el Pull Request

- Describe **qué** cambia y **por qué**.
- Incluye capturas de pantalla o un GIF si el cambio es visual.
- Confirma en la descripción que corriste `pnpm lint`, `pnpm format:check` y `pnpm build` sin errores.
- Un PR pequeño y enfocado en un solo cambio se revisa (y se mergea) mucho más rápido que uno grande con varios temas mezclados.

## Reportar bugs o proponer features

Usa la [página de issues](https://github.com/AnderCMD/Portafolio/issues) e incluye:

- Pasos para reproducir (para bugs) o el problema que resuelve la feature.
- Navegador/SO si es relevante.
- Capturas de pantalla cuando ayuden a explicar el problema.

¡Gracias de nuevo por contribuir! 🚀
