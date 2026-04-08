import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
    { ignores: ['dist', '.next', 'next-env.d.ts'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@next/next': nextPlugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // Next.js core rules
            ...nextPlugin.configs.recommended.rules,
            // react-refresh is a Vite HMR tool — irrelevant for Next.js
            'react-refresh/only-export-components': 'off',
            'react-hooks/set-state-in-effect': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    // Admin images are behind auth — onError fallbacks and unknown dimensions make
    // next/image migration complex with minimal benefit. Suppress for admin files.
    // Must come AFTER the general config so it takes final precedence in flat config.
    {
        files: ['src/components/admin/**/*.{ts,tsx}', 'src/components/AdminPanel.tsx', 'src/views/AdminLogin.tsx'],
        rules: { '@next/next/no-img-element': 'off' },
    },
);
