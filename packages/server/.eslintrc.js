module.exports = {
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-warning-comments': [
      'warn',
      {
        terms: ['todo', 'fixme', 'any other term'],
        location: 'anywhere'
      }
    ],
    'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
    "linebreak-style": 0
  }
};
