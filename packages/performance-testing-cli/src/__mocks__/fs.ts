import path from 'path';
import origFs from 'fs';

const fs = jest.genMockFromModule<typeof origFs & Record<string, any>>('fs');

let mockFiles = Object.create(null);
fs.__setMockFiles = (newMockFiles: string[]) => {
  mockFiles = Object.create(null);

  for (const file of newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }

    mockFiles[dir].push(path.basename(file));
  }
};

fs.existsSync = (pathname) => {
  const dir = path.dirname(pathname as string);
  return !!mockFiles[dir].includes(path.basename(pathname as string));
};

export default fs;
