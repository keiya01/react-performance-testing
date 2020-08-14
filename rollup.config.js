import typescript from 'rollup-plugin-typescript2';

const commonPlugins = [typescript({ tsconfig: 'tsconfig.json' })];

const getCJS = (file) => ({
  file,
  format: 'cjs',
});

export default [
  {
    input: 'src/index.ts',
    output: [getCJS('dist/index.cjs.js')],
    plugins: commonPlugins,
  },
  {
    input: 'src/native/index.ts',
    output: [getCJS('dist/native/index.cjs.js')],
    plugins: commonPlugins,
  },
];
