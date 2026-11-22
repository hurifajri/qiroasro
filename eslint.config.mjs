import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import drizzle from 'eslint-plugin-drizzle';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const nextCoreWebVitals = nextVitals.filter(
  (config) => config.name !== 'next/typescript',
);

const typeCheckedConfigs = [
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx,mts,cts}'],
}));

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    'next-env.d.ts',
    '.agents/**',
    '.agent/**',
    '.remember/**',
  ]),

  js.configs.recommended,
  ...nextCoreWebVitals,
  ...typeCheckedConfigs,
  sonarjs.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],

  // Type-aware TypeScript + Drizzle + Import Hygiene + Guardrails
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      drizzle,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Auto-remove unused imports & unused vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'sonarjs/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Auto-sort imports and exports deterministically
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Drizzle ORM safety
      'drizzle/enforce-delete-with-where': [
        'error',
        { drizzleObjectName: ['db'] },
      ],
      'drizzle/enforce-update-with-where': [
        'error',
        { drizzleObjectName: ['db'] },
      ],

      // Strict TypeScript best practices
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',

      // SonarQube parity (SonarJS)
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/prefer-read-only-props': 'error',
      'sonarjs/deprecation': 'error',
      'sonarjs/pseudo-random': 'error',
      'sonarjs/function-return-type': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-selector-parameter': 'error',
      'sonarjs/no-nested-template-literals': 'error',
      'sonarjs/no-commented-code': 'off',
      'sonarjs/todo-tag': 'off',

      // World-class framework guardrails (Next.js i18n, React 19, Zustand, React Flow)
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/navigation',
              importNames: [
                'Link',
                'redirect',
                'usePathname',
                'useRouter',
                'getPathname',
              ],
              message:
                'Import navigation helpers from "@/i18n/navigation" instead of "next/navigation".',
            },
            {
              name: 'zustand',
              importNames: ['create'],
              message:
                'Prefer createStore from "zustand/vanilla" with a scoped Context provider for SSR safety.',
            },
            {
              name: '@xyflow/react',
              importNames: ['Handle'],
              allowTypeImports: true,
              message:
                'Import BaseHandle from "@/components/graph/base-handle" instead of raw Handle.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "ImportDeclaration[source.value='react'] ImportSpecifier[imported.name='forwardRef']",
          message:
            'React 19 passes ref as a regular prop; do not use forwardRef.',
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'React',
          property: 'forwardRef',
          message:
            'React 19 passes ref as a regular prop; do not use React.forwardRef.',
        },
      ],
    },
  },

  // Allow next/navigation inside i18n wrapper module
  {
    files: ['src/i18n/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // Allow raw React Flow Handle inside shared graph primitives
  {
    files: ['src/components/graph/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // Generated shadcn/ui primitives
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'sonarjs/prefer-read-only-props': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },

  // Plain JS/MJS config & helper files (disable type-checked TS rules)
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      'no-unused-vars': 'off',
      'sonarjs/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // Must remain last so Prettier handles all formatting
  eslintConfigPrettier,
]);
