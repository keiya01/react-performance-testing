import { exec } from './exec';
import { getAllFilesBy } from './getAllFilesBy';
import { validate } from './validate';
import { getArgv } from './getArgv';
import { toArgs } from './toArgs';

export const run = () => {
  const argv = getArgv();

  if (!validate(argv)) {
    return process.exit(1);
  }

  const root = argv._[0] || argv.root!;

  // We are checking if file is exist in `validate()`
  // Therefore, we will not receive undefined from `getAllFilesBy()`
  const matchedFiles = getAllFilesBy(root, argv.match)!;

  const excludes = ['_', '$1', 'cmd', 'c', 'root', 'r', 'match', 'm'];
  const args = toArgs(argv, excludes);

  for (let i = 0; i < matchedFiles.length; i++) {
    exec(argv.cmd!, matchedFiles[i], args);
  }
};
