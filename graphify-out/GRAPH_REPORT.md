# Graph Report - .  (2026-10-01)

## Corpus Check
- Corpus is ~33,375 words - fits in a single context window. You may not need a graph.

## Summary
- 407 nodes · 645 edges · 36 communities (28 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Tooling ESLint
- Auth de sesión Admin
- DB y acortador
- Dependencias Astro/React
- tsconfig y alias
- Tarjeta QR y legales
- package.json
- Tema oscuro y layout
- Páginas de error
- Home y contacto
- Experiencia laboral
- Animaciones Framer Motion
- Validación de URLs
- Worker redirector
- Tests de DB
- Experiencia y términos
- Certificados
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 28

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 21 edges
2. `getPool()` - 14 edges
3. `scripts` - 12 edges
4. `POST()` - 12 edges
5. `paths` - 11 edges
6. `requireSession()` - 9 edges
7. `createSessionToken()` - 8 edges
8. `verifySessionToken()` - 8 edges
9. `createLink()` - 8 edges
10. `POST()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ctx()` --calls--> `createSessionToken()`  [EXTRACTED]
  tests/api.test.ts → src/lib/shortener/auth.ts
- `plugins` --extends--> `prettier-plugin-astro`  [EXTRACTED]
  .prettierrc.json → package.json
- `plugins` --extends--> `prettier-plugin-tailwindcss`  [EXTRACTED]
  .prettierrc.json → package.json
- `POST()` --calls--> `createLink()`  [EXTRACTED]
  src/pages/api/admin/links.ts → src/lib/shortener/db.ts
- `POST()` --calls--> `requireSession()`  [EXTRACTED]
  src/pages/api/admin/links/[code].ts → src/lib/shortener/guard.ts

## Import Cycles
- None detected.

## Communities (36 total, 8 thin omitted)

### Community 0 - "Tooling ESLint"
Cohesion: 0.05
Nodes (39): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-astro, eslint-plugin-jsx-a11y, eslint-plugin-react, globals, devDependencies (+31 more)

### Community 1 - "Auth de sesión Admin"
Cohesion: 0.12
Nodes (21): createSessionToken(), safeEqual(), sign(), verifyPassword(), verifySessionToken(), verifyUsername(), findCodesByTarget(), getClientKey() (+13 more)

### Community 2 - "DB y acortador"
Cohesion: 0.16
Nodes (30): countLinks(), createLink(), deleteLinkByCode(), ensureSchema(), generateCode(), getPool(), isDuplicateEntryError(), LinkCounts (+22 more)

### Community 3 - "Dependencias Astro/React"
Cohesion: 0.06
Nodes (31): astro, @astrojs/check, @astrojs/node, @astrojs/react, @astrojs/sitemap, framer-motion, dependencies, astro (+23 more)

### Community 4 - "tsconfig y alias"
Cohesion: 0.07
Nodes (28): astro/tsconfigs/strict, ./src/assets/*, ./src/components/*, ./src/data/*, ./src/hooks/*, ./src/i18n/*, ./src/layouts/*, ./src/lib/* (+20 more)

### Community 5 - "Tarjeta QR y legales"
Cohesion: 0.09
Nodes (6): { t }, { t }, { t }, { t }, { t }, variantClasses

### Community 6 - "package.json"
Cohesion: 0.10
Nodes (19): author, email, name, description, name, scripts, astro, build (+11 more)

### Community 7 - "Tema oscuro y layout"
Cohesion: 0.16
Nodes (4): { t }, { t }, socialLinks, techStack

### Community 8 - "Páginas de error"
Cohesion: 0.15
Nodes (7): isDark(), canonicalURL, { currentLocale, t }, currentYear, ogImageURL, schemaOrg, seoDescription

### Community 9 - "Home y contacto"
Cohesion: 0.23
Nodes (7): sections, { t, currentLocale }, useLocale(), getLangFromUrl(), getRelativeLocaleUrl(), useTranslations(), getCurrentYear()

### Community 10 - "Experiencia laboral"
Cohesion: 0.19
Nodes (8): extractTechnologies(), getWorkExperience(), getYearsOfExperience(), en, es, languages, ui, location()

### Community 11 - "Animaciones Framer Motion"
Cohesion: 0.26
Nodes (14): cleanups, EASE, finish(), handled, hiddenState(), init(), initFloat(), initPage() (+6 more)

### Community 12 - "Validación de URLs"
Cohesion: 0.23
Nodes (9): parseFutureDate(), BLOCKED_HOSTNAMES, isValidCode(), isValidTargetUrl(), RESERVED_CODES, onRequest, SHORTENER_HOSTS, POST() (+1 more)

### Community 13 - "Worker redirector"
Cohesion: 0.15
Nodes (12): dependencies, mysql2, devDependencies, wrangler, name, private, scripts, deploy (+4 more)

### Community 14 - "Tests de DB"
Cohesion: 0.17
Nodes (6): ALL_COLUMNS, ALL_INDEXES, createPool, Db, load(), query

### Community 15 - "Experiencia y términos"
Cohesion: 0.20
Nodes (3): { t }, sections, { t, currentLocale }

### Community 16 - "Certificados"
Cohesion: 0.25
Nodes (4): { t }, allCertificates, { t }, getCertificates()

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): MONTHS, nowUtcMinus6(), setup()

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (3): fetch(), RESERVED_CODES, resolveTarget()

## Knowledge Gaps
- **127 isolated node(s):** `useTabs`, `tabWidth`, `printWidth`, `singleQuote`, `semi` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `location()` connect `Experiencia laboral` to `Auth de sesión Admin`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Dependencias Astro/React` to `Worker redirector`, `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Tooling ESLint` to `package.json`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `useTabs`, `tabWidth`, `printWidth` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tooling ESLint` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Auth de sesión Admin` be split into smaller, more focused modules?**
  _Cohesion score 0.12100840336134454 - nodes in this community are weakly interconnected._
- **Should `Dependencias Astro/React` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._