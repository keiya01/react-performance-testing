import yargs from 'yargs';
import { exec } from './exec';
import { getAllFilesBy } from './getAllFilesBy';
import { options } from './options';
import { validate } from './validate';

export const run = async () => {
  const argv = yargs.wrap(yargs.terminalWidth()).options(options).argv;

  if (!validate(argv)) {
    return process.exit(1);
  }

  const root = argv.root!;

  const matchedFiles: string[] = getAllFilesBy(root, argv.match);

  for (let i = 0; i < matchedFiles.length; i++) {
    exec(argv.cmd!, matchedFiles[i]);
  }
};
