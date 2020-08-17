import { makeRollupConfig } from '../../scripts/rollup/makeRollupConfig';

export default [
  makeRollupConfig('src/index.ts', 'dist/index.js'),
  makeRollupConfig('src/native/index.ts', 'native/dist/index.js'),
];
