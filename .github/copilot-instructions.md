## Overview

-   Astro 5 + React 19 front end with Tailwind CSS 4 via the Vite plugin (`astro.config.mjs`); pnpm is the expected package manager.
-   Content lives under `src/Components/Pages` (page composition), `src/Components/Common` (shared widgets) and page entry points in `src/pages` only forward to these components.
-   Global layout is handled by `src/Layouts/Layout.astro`, which sets metadata, injects the dark theme background, wraps navigation/footer, and renders `<ClientRouter />` for Astro transitions.

## Local Dev

-   Install dependencies with `pnpm install`; run `pnpm dev` (or `pnpm start`) for local previews at `http://localhost:4321`.
-   Production builds run `pnpm build` (runs `astro check` + `astro build`); inspect the result with `pnpm preview`.
-   Tailwind utilities come from `tailwind.config.mjs`; restart the dev server after editing that config.

## Architecture Highlights

-   Layout expects a `title` prop and derives meta descriptions from i18n (`t('About.Description')`); always supply localized titles when composing pages.
-   `src/Hooks/useLocale.js` orchestrates language detection and exposes `t`, `currentLocale`, and `getRelativeLocaleUrl`. Call it from Astro components to read translations and generate locale-aware links.
-   Navigation (`Navbar.astro`) and other components assume specific element IDs (`LogoTheme`, `IconoLogoTheme`, etc.) so the dark-mode switch can swap assets; reuse those IDs if you move the elements.

## i18n & Routing

-   Supported locales are `es` (default) and `en`, configured in `astro.config.mjs`; localized routes live under `src/pages` (default Spanish slugs) and `src/pages/en` (English).
-   Route slugs for navigation are driven by translated labels. e.g. `t('Nav.About')` resolves to `Conoceme` in Spanish, so `src/pages/Conoceme.astro` must exist. Keep slug translations in sync with filenames when editing nav text.
-   All copy comes from `src/i18n/ui.ts`. Add new keys for every locale; `useTranslations` falls back to `defaultLang` but missing keys should still be filled explicitly.

## UI Patterns

-   Shared sections (projects, tech, experience, etc.) are self-contained Astro components in `src/Components/Common`. They expect i18n keys like `Projects.Title.N`; update both locales if you add array entries.
-   `src/Components/Common/Project.astro` holds the project catalog; entries are sorted by year. Provide optional `linkView`, `linkCode`, or `linkDownload` fields and maintain the translation keys used for titles/descriptions.
-   Client interactivity uses `document.addEventListener('astro:page-load', ...)` for DOM hooks (menu toggles, filters). If you add markup that these scripts touch, preserve the class/ID hooks they query.

## Assets & Styling

-   Static downloads and icons live in `public/`; logos referenced by dark-mode swaps are under `public/Logos`. Ensure new assets follow the same paths or update `DarkMode.jsx`.
-   Images used within components should be imported from `src/Assets/Images` and rendered with `astro:assets` `<Image />` for optimization.
-   Base styling is defined in `src/Styles/Default.css`; `DarkMode.jsx` also imports `src/Styles/DarkMode.css` for the toggle control.

## Gotchas

-   `useLocale` throws if it encounters an unsupported locale; keep `astro.config.mjs` locales, directory structure, and `ui.ts` keys aligned.
-   Dark-mode logo swapping relies on direct DOM element IDs; changing them breaks theme switching unless you update `DarkMode.jsx` accordingly.
-   Remember to update download paths in `Project.astro` or `Footer.astro` when replacing files under `public/Download`.
