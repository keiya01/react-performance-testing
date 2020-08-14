import typescript from 'rollup-plugin-typescript2';

const commonPlugins = [typescript({ tsconfig: 'tsconfig.json' })];

const getCJS = (file) => ({
  file,
  format: 'cjs',
});

const getESM = (file) => ({
  file,
  format: 'esm',
});

export default [
  {
    input: 'src/index.ts',
    output: [getCJS('dist/index.cjs.js'), getESM('dist/index.esm.js')],
    plugins: commonPlugins,
  },
  {
    input: 'src/native/index.ts',
    output: [
      getCJS('native/dist/index.cjs.js', getESM('native/dist/index.esm.js')),
    ],
    plugins: commonPlugins,
  },
];
