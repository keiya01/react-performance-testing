import fs from 'fs';
import { getAllFilesBy } from '../getAllFilesBy';

jest.mock('fs');

test('should get matched all files', () => {
  // @ts-ignore
  fs.__setMockFiles([
    'path/to/file1.test.ts',
    'path/to/file2.ts',
    'path/to/dir/file3.test.ts',
  ]);

  expect(getAllFilesBy('path/to', '**/*.test.ts')).toEqual([
    'path/to/file1.test.ts',
    'path/to/dir/file3.test.ts',
  ]);
});
