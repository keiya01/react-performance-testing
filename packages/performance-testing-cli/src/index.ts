import { exec } from './exec';
import { getAllFilesBy } from './getAllFilesBy';
import { argv } from './option';

export const run = async () => {
  const root = argv.root!;

  const matchedFiles: string[] = getAllFilesBy(root, argv.match);

  for (let i = 0; i < matchedFiles.length; i++) {
    exec(argv.cmd!, matchedFiles[i]);
  }
};
