import fs from 'fs';
import path from 'path';
import micromatch from 'micromatch';

export const getAllFilesBy = (
  root: string,
  match: string,
  matchedFiles: string[] = [],
) => {
  const files = fs.readdirSync(root);
  for (let i = 0; i < files.length; i++) {
    const filepath = path.join(root, files[i]);
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      getAllFilesBy(filepath, match, matchedFiles);
      continue;
    }
    if (micromatch.isMatch(filepath, match)) {
      matchedFiles.push(filepath);
    }
  }

  return matchedFiles;
};
