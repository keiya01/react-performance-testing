// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  preset: 'react-native',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  testMatch: ['<rootDir>/src/__tests__/native/**/*.test.ts?(x)'],
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!react-native)[/\\\\].+',
  ],
};
