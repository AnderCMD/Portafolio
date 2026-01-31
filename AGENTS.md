# 🤖 Guía de Desarrollo para Agentes - AnderCMD Portfolio

Este documento define los estándares, principios y flujos de trabajo que deben seguir los Agentes de IA (y desarrolladores humanos) al contribuir al proyecto **Portafolio de AnderCMD**.

## 🧠 Rol y Mentalidad
Actúa como un **Ingeniero de Software Senior & Creador de Contenido** especializado en **Astro, React y Accesibilidad Web**. Tu objetivo es mantener un portafolio profesional, performante y accesible.
1.  **Extremadamente Rápido** (Performance First).
2.  **Universalmente Accesible** (WCAG 2.1 AA/AAA).
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

*   **`src/components/common/` (Componentes Compartidos):**
    *   Contiene tanto elementos de UI atómicos (Badge, Button) como secciones (Navbar, Footer, WorkExperience).
    *   Incluye componentes interactivos de React (ej. `darkMode.jsx`).

### 4. Datos Estáticos (`src/data/`)
Para mantener los componentes limpios, la información estática (experiencia, redes sociales, proyectos) se centraliza aquí:
*   `experience.ts`: Datos de experiencia laboral.
*   `socials.ts`: Enlaces a redes sociales.
*   **Regla:** Si es un array de objetos con texto, muévelo a `src/data` (o `src/i18n` si requiere traducción directa en UI).

---

## 🛠️ Stack Tecnológico Estricto

*   **Framework Core:** Astro 5.0 (con `ClientRouter` activado para navegación SPA).
*   **Interactividad:** React 19 (Solo para componentes que requieren estado complejo).
*   **Estilos:** Tailwind CSS 4.0.
*   **Lenguaje:** TypeScript (Tipado estricto, **PROHIBIDO** el uso de `any` en archivos `.ts`, `.tsx`, `.jsx` y `.astro`).
*   **Iconos:** FontAwesome 6 (vía CDN/Assets).
*   **i18n:** Sistema nativo de Astro + `src/i18n/`.

---

## 📏 Reglas de Desarrollo

### 1. Internacionalización (i18n)
*   **Método:** Usa `useTranslations` importando de `@i18n/utils`.
    ```ts
    import { useTranslations } from '@i18n/utils';
    const t = useTranslations(lang);
    ```
*   **Archivos:** `src/i18n/locales/es.ts` y `en.ts`.
*   **Hreflang:** Asegura que `Layout.astro` tenga las referencias cruzadas correctas.

### 2. Accesibilidad (A11y) - NO NEGOCIABLE
*   **Imágenes:** Todas las etiquetas `<img>` o `<Image />` deben tener un `alt` descriptivo.
*   **Iconos:** Los iconos decorativos deben tener `aria-hidden="true"`.
*   **Botones:**
    *   Si navega a otra URL, usa `<a>`.
    *   Elementos interactivos sin texto visible **DEBEN** tener `aria-label`.

### 3. Estilos y UI (Glassmorphism)
*   Mantén la consistencia del diseño "Glass":
    *   Fondos con opacidad (`bg-white/70`, `dark:bg-slate-900/70`).
    *   Blur (`backdrop-blur-xl`).
    *   Bordes sutiles (`border-white/20`).
*   **Modo Oscuro:** Todo componente nuevo debe verse bien en Light y Dark mode.

---

## 🔄 Flujo de Trabajo para Tareas

1.  **Analizar:** Revisar requerimientos y estructura actual.
2.  **Estructura:** Crear/Modificar componentes en `@components/common/`.
3.  **Datos:** Centralizar datos en `@data/` si aplica.
4.  **Traducciones:** Agregar claves en `@i18n/locales/`.
5.  **Verificación:** Compilar (`pnpm build`) y verificar en ambos idiomas y modos de color.
