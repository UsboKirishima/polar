import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: false,
    quotes: 'single',
  },
}, {
  rules: {
    'no-console': 'warn',
    'ts/consistent-type-definitions': ['error', 'type'],
    'perfectionist/sort-imports': ['error', {
      tsconfigRootDir: '.',
    }],
    'unicorn/filename-case': ['error', {
      case: 'kebabCase',
      ignore: ['README.md'],
    }],
  },
  ignores: [
    'dist',
    'node_modules',
    '*.d.ts',
  ],
})
