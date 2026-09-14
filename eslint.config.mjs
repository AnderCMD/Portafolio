import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'dist/**',
			'.astro/**',
			'node_modules/**',
			'public/**',
			'.vscode/**',
			'.agents/**',
			'skills-lock.json',
		],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs['flat/recommended'],
	...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],

	{
		files: ['**/*.{js,jsx,ts,tsx,mjs}'],
		plugins: { react, 'jsx-a11y': jsxA11y },
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		settings: {
			react: { version: '19' },
		},
		rules: {
			...react.configs.recommended.rules,
			...jsxA11y.configs.recommended.rules,
			// React 19 usa el runtime automático de JSX: no hace falta `import React`.
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},

	{
		// El frontmatter de los .astro se analiza como TS; relajamos algunas
		// reglas de tipado que no aportan valor en componentes de plantilla.
		files: ['**/*.astro'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-unused-vars': 'off',
		},
	},

	{
		// Astro genera env.d.ts con triple-slash references; es la sintaxis
		// requerida por TypeScript para este archivo, no un import válido.
		files: ['**/env.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},

	// Debe ir al final: desactiva las reglas de estilo que Prettier ya resuelve.
	eslintConfigPrettier,
];
