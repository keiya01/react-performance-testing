import { exec } from './exec';
import { getAllFilesBy } from './getAllFilesBy';
import { validate } from './validate';
import { getArgv } from './getArgv';
import { toArgs } from './toArgs';
import { options } from './options';

export const run = async () => {
  const argv = getArgv();

  if (!validate(argv)) {
    return process.exit(1);
  }

  const root = argv._[0] || argv.root!;
  const concurrent = argv.concurrent as number;

  // We are checking if file is exist in `validate()`
  // Therefore, we will not receive undefined from `getAllFilesBy()`
  const matchedFiles = getAllFilesBy(root, argv.match)!;

  const excludes = Object.keys(options)
    .reduce(
      (res, key) => [...res, key, (options as Record<string, any>)[key].alias],
      ['_', '$1'],
    )
    .filter(Boolean);
  const args = toArgs(argv, excludes);

  let pending = [];
  let i = 0;
  while (matchedFiles[i]) {
    pending.push(exec(argv.cmd!, matchedFiles[i], args));
    if (pending.length >= concurrent) {
      await Promise.all(pending);
      pending = [];
    }
    i++;
  }

  if (pending.length) {
    await Promise.all(pending);
  }
};
