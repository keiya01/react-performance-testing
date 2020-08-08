module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/*.test.ts?(x)'],
};
