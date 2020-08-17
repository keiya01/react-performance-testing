import { makeRollupConfig } from '../../scripts/rollup/makeRollupConfig';

export default makeRollupConfig('src/index.ts', 'dist/index.js', [
  'jest-matcher-utils',
]);
