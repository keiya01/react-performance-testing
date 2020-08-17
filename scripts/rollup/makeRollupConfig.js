import typescript from 'rollup-plugin-typescript2';
import path from 'path';

const commonPlugins = [
  typescript({ tsconfig: path.resolve(__dirname, 'tsconfig.json') }),
];

const formatter = {
  cjs: (file) => ({
    file,
    format: 'cjs',
  }),
  esm: (file) => ({
    file,
    format: 'esm',
  }),
};

export const makeRollupConfig = (entryPath, outputPath) => {
  const input = path.resolve(__dirname, entryPath);

  const output = Object.keys(formatter).map((extension) => {
    const pathArr = outputPath.split(/\./);
    const pathname = path.resolve(
      __dirname,
      [...pathArr.slice(0, -1), extension, pathArr[pathArr.length - 1]].join(
        '.',
      ),
    );
    return formatter[extension](pathname);
  });

  const plugins = [...commonPlugins];

  return {
    input,
    output,
    plugins,
  };
};
