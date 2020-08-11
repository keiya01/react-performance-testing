import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
  ],
  plugins: [typescript({ tsconfig: 'tsconfig.json' })],
};
