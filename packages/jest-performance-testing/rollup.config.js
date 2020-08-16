import { createRollupConfig } from '../../scripts/rollup/createRollupConfig';

export default createRollupConfig(
  { inputRoot: 'src', inputFile: 'index.ts' },
  {
    outputRoot: 'dist',
    outputFileName: 'index',
    extensions: ['cjs', 'esm'],
  },
);
