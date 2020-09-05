import path from 'path';
import origFs from 'fs';

const fs = jest.genMockFromModule<typeof origFs & Record<string, any>>('fs');

let mockFiles = Object.create(null);

const searchPath = (pathname: string) => {
  const dirs = path.dirname(pathname).split('/');
  let files = mockFiles;
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    files = files[dir];
  }

  return files;
};

const setDirectory = (pathname: string) => {
  const dirs = path.dirname(pathname).split('/');
  let files = mockFiles;

  const setDir = (dir: string) => !files[dir] && (files[dir] = {});
  const setFile = (filename: string, dir: string, isLast: boolean) =>
    isLast && (files[dir][filename] = true);

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    setDir(dir);
    setFile(path.basename(pathname), dir, i === dirs.length - 1);
    files = files[dir];
  }
};

fs.__setMockFiles = (newMockFiles: string[]) => {
  mockFiles = Object.create(null);

  for (const file of newMockFiles) {
    setDirectory(file);
  }
};

fs.existsSync = (pathname) =>
  !!searchPath(pathname as string)[path.basename(pathname as string)];

fs.lstatSync = (pathname) => {
  const isDirectory = () => {
    return !path.extname(pathname as string);
  };
  return { isDirectory } as origFs.Stats;
};

fs.readdirSync = (pathname: origFs.PathLike) => {
  const files = searchPath(pathname as string);
  return (Object.keys(files[path.basename(pathname as string)]) || []) as any;
};

export default fs;
