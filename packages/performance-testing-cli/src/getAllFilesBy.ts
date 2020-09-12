import fs from 'fs';
import path from 'path';
import micromatch from 'micromatch';

const searchDir = (
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
      matchedFiles = searchDir(filepath, match, matchedFiles);
      continue;
    }
    if (micromatch.isMatch(filepath, match)) {
      matchedFiles.push(filepath);
    }
  }
  return matchedFiles;
};

export const getAllFilesBy = (root: string, match: string) => {
  try {
    const stat = fs.lstatSync(root);
    if (stat.isDirectory()) {
      return searchDir(root, match);
    } else {
      return [root];
    }
  } catch (e) {
    // do nothing
  }
};
