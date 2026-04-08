# 🤖 Guía de Desarrollo para Agentes - AnderCMD Portfolio

Este documento define los estándares, principios y flujos de trabajo que deben seguir los Agentes de IA (y desarrolladores humanos) al contribuir al proyecto **Portafolio de AnderCMD**.

## 🧠 Rol y Mentalidad
Actúa como un **Ingeniero de Software Senior & Creador de Contenido** especializado en **Astro, React y Accesibilidad Web**. Tu objetivo es mantener un portafolio profesional, performante y accesible.
1.  **Extremadamente Rápido** (Performance First).
2.  **Universalmente Accesible** (WCAG 2.2 AA/AAA).
3.  **Semánticamente Perfecto** (SEO Técnico).
4.  **Estéticamente Moderno** (Glassmorphism & Clean UI).

---

## 📂 Estructura y Arquitectura del Proyecto

### 1. Alias de Importación (Path Aliases)
Para mantener el código limpio y semántico, utilizamos alias específicos configurados en `tsconfig.json`. **Es obligatorio usarlos** en lugar de rutas relativas o el alias genérico `@/` cuando sea posible:

| Alias | Ruta Real | Uso |
| :--- | :--- | :--- |
| `@/*` | `src/*` | Fallback para archivos en la raíz de src. |
| `@assets/*` | `src/assets/*` | Imágenes, fuentes y recursos estáticos. |
| `@components/*` | `src/components/*` | Componentes de Astro y React. |
| `@data/*` | `src/data/*` | Datos estáticos (JSON/TS) y configuraciones. |
| `@hooks/*` | `src/hooks/*` | Custom Hooks de React. |
| `@i18n/*` | `src/i18n/*` | Configuración de idiomas y traducciones. |
| `@layouts/*` | `src/layouts/*` | Layouts principales de las páginas. |
| `@pages/*` | `src/pages/*` | Referencias a páginas (poco común). |
| `@scripts/*` | `src/scripts/*` | Scripts de utilidad y lógica de cliente. |
| `@styles/*` | `src/styles/*` | Archivos CSS/Tailwind globales. |

**Ejemplo de uso:**
```ts
// ✅ Correcto (Específico)
import Button from '@components/ui/AButton.astro';
import heroImage from '@assets/hero.webp';
import { useTranslations } from '@i18n/utils';

// ⚠️ Aceptable (Genérico)
import Button from '@/components/ui/AButton.astro';

// ❌ Incorrecto (Relativo)
import Button from '../../components/ui/AButton.astro';
```

### 2. Sistema de Rutas (`src/pages/`)
El proyecto utiliza el sistema de enrutamiento basado en archivos de Astro, con separación por idioma:

*   **Rutas en Español (Raíz):** `src/pages/` (ej. `index.astro`, `projects.astro`).
*   **Rutas en Inglés (`src/pages/en/`):** `src/pages/en/` (ej. `en/index.astro`).
*   **Lógica:** Los archivos aquí solo importan componentes de `src/components/pages/` y configuran el layout.

### 3. Arquitectura de Componentes (`src/components/`)
La lógica y la interfaz de usuario se organizan en:

*   **`src/components/pages/` (Páginas Completas):**
    *   Componentes que arman la vista completa (Home, Projects, etc.).
    *   Reutilizables entre idiomas.

*   **`src/components/sections/` (Secciones Estructurales):**
    *   Contiene secciones de gran tamaño o partes de la página (Navbar, Footer, WorkExperience, Project).

*   **`src/components/ui/` (Elementos UI Atómicos):**
    *   Componentes pequeños y estrictamente de interfaz (Badge, AButton, Text, Tooltip).
    *   Incluye componentes interactivos de React (ej. `darkMode.jsx`).

### 4. Datos Estáticos (`src/data/`)
Para mantener los componentes limpios, la información estática (experiencia, redes sociales, proyectos) se centraliza aquí:
*   `experience.ts`: Datos de experiencia laboral.
*   `projects.ts`: Información detallada de los proyectos del portafolio.
*   `socials.ts`: Enlaces a redes sociales y contacto.
*   `tech.ts`: Datos para la sección de tecnologías usadas.
*   **Regla:** Si es un array de objetos con texto o configuraciones globales, muévelo a `src/data` (o `src/i18n` si requiere traducción directa en UI).

---

## 🛠️ Stack Tecnológico Estricto

*   **Framework Core:** Astro 6+ (con `ClientRouter` activado para navegación SPA).
*   **Interactividad:** React 19+ (Solo para componentes que requieren estado complejo).
*   **Estilos:** Tailwind CSS 4.2+ (optimizado vía `@tailwindcss/vite`).
*   **Lenguaje:** TypeScript (Tipado estricto, **PROHIBIDO** el uso de `any` en archivos `.ts`, `.tsx`, `.jsx` y `.astro`).
*   **Imágenes:** Optimización obligatoria vía `astro:assets` (`<Image />`) con formatos modernos (`webp`/`avif`).
*   **Iconos:** FontAwesome 6 (vía CDN/Assets) o SVG inline.
*   **i18n:** Sistema nativo de Astro + `src/i18n/`.

---

## 📏 Reglas de Desarrollo

### 1. Internacionalización (i18n) & SEO
*   **Método:** Usa `useTranslations` importando de `@i18n/utils`.
*   **Hreflang:** Es **obligatorio** que `Layout.astro` incluya etiquetas `<link rel="alternate" hreflang="...">` para todas las variantes de idioma, incluyendo `x-default`.
*   **Canonical:** Cada página debe tener un `<link rel="canonical" href="...">` autodefinido.
*   **Structured Data:** Usa JSON-LD (`schema.org`) para entidades tipo `Person`, `WebSite` y `SoftwareApplication` en el Layout central.

### 2. Accesibilidad (A11y) - NO NEGOCIABLE
*   **Estándar:** Cumplimiento estricto de **WCAG 2.2 AA**.
*   **Skip Link:** El `Layout.astro` debe incluir un enlace de "Saltar al contenido" para usuarios de teclado.
*   **Landmarks:** Usa HTML5 semántico correctamente (`<main>`, `<nav>`, `<footer>`, `<section>`). El contenido principal debe estar dentro de `<main id="main-content">`.
*   **Imágenes:** Todas las etiquetas `<img>` o `<Image />` deben tener un `alt` descriptivo.
*   **Iconos:** Los iconos decorativos deben tener `aria-hidden="true"`.
*   **Controles:** Elementos interactivos sin texto visible **DEBEN** tener `aria-label`.

### 3. Estilos y UI (Glassmorphism)
*   Mantén la consistencia del diseño "Glass":
    *   Fondos con opacidad (`bg-white/70`, `dark:bg-slate-900/70`).
    *   Blur (`backdrop-blur-xl`).
    *   Bordes sutiles (`border-white/20`).
*   **Modo Oscuro:** Todo componente nuevo debe verse bien en Light y Dark mode.

### 4. Rendimiento & Scripts - CRÍTICO
*   **ClientRouter:** Al usar `ClientRouter`, los scripts del cliente deben ejecutarse dentro de:
    ```ts
    document.addEventListener('astro:page-load', () => { ... });
    ```
    Evita `DOMContentLoaded` ya que no se dispara en navegaciones internas de Astro.
*   **Carga de Recursos:** Prioriza `eager` para el Hero Image y `lazy` para el resto. Usa `fetchpriority="high"` en recursos críticos.
*   **Imágenes:** Define siempre `width` y `height` (o `aspect-ratio`) para evitar Cumulative Layout Shift (CLS).

---

## 🔄 Flujo de Trabajo para Tareas

1.  **Analizar:** Revisar requerimientos y estructura actual.
2.  **Estructura:** Crear/Modificar componentes en `@components/ui/` o `@components/sections/`.
3.  **Datos:** Centralizar datos estáticos o variables en `@data/` si aplica.
4.  **Traducciones:** Agregar claves en `@i18n/locales/` (si interfiere el texto nuevo).
5.  **Verificación:** Compilar (`pnpm check` && `pnpm build`) prestando especial atención en prevenir errores de compilación web o estática (ej. componentes React). Verificar en ambos idiomas y modos de color.
