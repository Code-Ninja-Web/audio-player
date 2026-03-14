const mod = (value) => value.default ?? value

const js = mod(require('@eslint/js'))
const globals = mod(require('globals'))
const tsParser = mod(require('@typescript-eslint/parser'))
const tsPlugin = mod(require('@typescript-eslint/eslint-plugin'))
const reactPlugin = mod(require('eslint-plugin-react'))
const reactHooksPlugin = mod(require('eslint-plugin-react-hooks'))
const reactRefreshPlugin = mod(require('eslint-plugin-react-refresh'))
const prettierRecommended = mod(require('eslint-plugin-prettier/recommended'))

module.exports = [
    {
        ignores: [
            'build/**',
            'dist/**',
            'node_modules/**',
            '.yarn/**',
            '.pnp.*',
        ],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    {
        files: ['**/*.{test,spec}.{ts,tsx}', 'src/setupTests.ts'],
        languageOptions: {
            globals: {
                ...globals.vitest,
                ...globals.node,
            },
        },
    },
    {
        files: ['scripts/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
        },
    },
    prettierRecommended,
]
