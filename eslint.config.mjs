// ESLint v9+ flat config for TypeScript (minimal)
import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': plugin },
    rules: {
      ...plugin.configs.recommended.rules,
      ...plugin.configs['recommended-type-checked'].rules,
      '@typescript-eslint/no-unnecessary-condition': 'warn',
    },
  },
];
