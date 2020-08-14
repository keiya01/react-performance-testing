const common = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};

const web = {
  ...common,
  displayName: {
    name: 'Web',
    color: 'cyan',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/native/'],
  testMatch: ['**/*.test.ts?(x)'],
};

const native = {
  ...common,
  displayName: {
    name: 'Native',
    color: 'magenta',
  },
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

module.exports = {
  collectCoverageFrom: [
    '**/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/__tests__/**',
  ],
  projects: [web, native],
};
