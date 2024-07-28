/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import constCase from 'eslint-plugin-const-case';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['./dist/**/*', '**/.eslintrc.json', '**/tsconfig.eslint.json', '**/tsconfig.json'],
  },
  ...compat.extends(
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      'const-case': constCase,
      promise,
      prettier,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        extraFileExtensions: ['.json'],
        project: ['tsconfig.json', 'tsconfig.eslint.json'],
      },
    },

    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',

      'class-methods-use-this': [
        'error',
        {
          exceptMethods: [
            'run',
            'chatInputRun',
            'autocompleteRun',
            'sendLog',
            'registerApplicationCommands',
          ],
        },
      ],

      'eslint-comments/no-unused-disable': 'error',
      'implicit-arrow-linebreak': 'off',
      'no-new-object': 'off',

      'no-void': [
        'error',
        {
          allowAsStatement: true,
        },
      ],

      'simple-import-sort/exports': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000', '^node:', '^@?\\w', '^', '^\\.']],
        },
      ],

      'unused-imports/no-unused-imports': 'error',
    },
  },
];
