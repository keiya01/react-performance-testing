// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('../scripts/jest/jest.common.config');

module.exports = {
  ...common,
  roots: ['.'],
  transform: {
    ...common.transform,
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.test.ts?(x)'],
  globals: {
    'ts-jest': {
      ...common.globals['ts-jest'],
      babelConfig: true,
    },
  },
  setupFilesAfterEnv: ['./setup.ts'],
};
