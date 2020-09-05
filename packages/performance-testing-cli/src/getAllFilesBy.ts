import fs from 'fs';
import path from 'path';
import micromatch from 'micromatch';

export const getAllFilesBy = (
  root: string,
  match: string,
  _matchedFiles: readonly string[] = [],
) => {
  let matchedFiles = [..._matchedFiles];
  const files = fs.readdirSync(root);
  for (let i = 0; i < files.length; i++) {
    const filepath = path.join(root, files[i]);
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      matchedFiles = getAllFilesBy(filepath, match, matchedFiles);
      continue;
    }
    if (micromatch.isMatch(filepath, match)) {
      matchedFiles.push(filepath);
    }
  }

  return matchedFiles;
};
