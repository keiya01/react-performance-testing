module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: '../../tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};
