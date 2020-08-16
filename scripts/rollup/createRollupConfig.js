import typescript from 'rollup-plugin-typescript2';
import path from 'path';

const commonPlugins = [typescript({ tsconfig: 'tsconfig.json' })];

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

export const createRollupConfig = (
  { inputRoot, inputFile },
  { outputRoot, outputFileName, extensions },
  paths = [],
) => {
  paths.push('');

  return paths.map((pathname) => {
    const input = path.resolve(
      __dirname,
      [inputRoot, pathname, inputFile].join('/'),
    );

    const output = extensions.map((extension) => {
      const filename = [outputFileName, extension, 'js'].join('.');
      const outputPath = path.resolve(
        __dirname,
        [outputRoot, pathname, filename].join('/'),
      );

      if (formatter[extension]) {
        return formatter[extension](outputPath);
      }

      throw new Error(
        `Can not find ${extension}. You can use only 'cjs' or 'esm'.`,
      );
    });

    const plugins = [...commonPlugins];

    return {
      input,
      output,
      plugins,
    };
  });
};
