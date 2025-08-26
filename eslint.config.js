import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import cypressPlugin from 'eslint-plugin-cypress';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import storybookPlugin from 'eslint-plugin-storybook';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';

export default [
  // Base configuration for all files
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        // Custom globals
        Set: 'readonly',
        Map: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // ESLint recommended rules
  js.configs.recommended,

  // Main configuration for source files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      storybook: storybookPlugin,
      import: importPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,

      // ESLint rules
      'no-unused-vars': 'warn',
      // 명명 규칙: 액션 함수는 표준 접두사 권장(내보낸 함수 우선 적용)
      '@typescript-eslint/naming-convention': [
        {
          selector: 'function',
          modifiers: ['exported'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'forbid',
          custom: {
            // Action 함수 권장 접두사 목록
            regex:
              '^(create|add|push|insert|new|append|spawn|make|build|generate|get|fetch|query|parse|split|transform|serialize|update|mutation|delete|remove|put|send|dispatch|receive|validate|check|calc|compute|init|configure|start|stop|save|store|log|record)[A-Z].*$',
            match: true,
          },
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      // 혼용 용어 가이드(경고): 통일된 용어 사용 유도
      'no-restricted-syntax': [
        'warn',
        {
          selector: "Identifier[name=/^display[A-Z]/]",
          message: "UI 동작 명명은 'show*'로 통일하세요.",
        },
        {
          selector: "Identifier[name=/^load[A-Z]/]",
          message: "데이터 조회는 'get*' 또는 'fetch*'를 사용하세요.",
        },
        {
          selector: "Identifier[name=/^write[A-Z]/]",
          message: "저장은 'save*'를 사용하세요.",
        },
      ],

      // React rules
      'react/prop-types': 'off',
      ...reactHooksPlugin.configs.recommended.rules,

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // Prettier rules
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // Storybook rules
      ...storybookPlugin.configs.recommended.rules,
    },
  },

  // Test files configuration (Vitest)
  {
    files: [
      '**/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
      '**/__mocks__/**/*.{js,jsx,ts,tsx}',
      './src/setupTests.ts',
      './src/__tests__/utils.ts',
    ],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/expect-expect': 'off',
    },
    languageOptions: {
      globals: {
        globalThis: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },

  // Cypress E2E test files configuration
  {
    files: ['cypress/e2e/**/*.cy.js'],
    plugins: {
      cypress: cypressPlugin,
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
      },
    },
  },
];
