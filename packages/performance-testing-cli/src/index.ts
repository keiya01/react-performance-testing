import { exec } from './exec';
import { getAllFilesBy } from './getAllFilesBy';
import { validate } from './validate';
import { getArgv } from './getArgv';

export const run = () => {
  const argv = getArgv();

  if (!validate(argv)) {
    return process.exit(1);
  }

  const root = argv.root!;

  const matchedFiles: string[] = getAllFilesBy(root, argv.match);

  for (let i = 0; i < matchedFiles.length; i++) {
    exec(argv.cmd!, matchedFiles[i]);
  }
};
