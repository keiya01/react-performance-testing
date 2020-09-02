// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('../../scripts/jest/jest.common.config');

module.exports = {
  ...common,
  displayName: {
    name: 'CLI',
    color: 'yellow',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.test.ts?(x)'],
};
