import mockFs from 'mock-fs';
import { getAllFilesBy } from '../getAllFilesBy';
import { matchDefault } from '../constants/matchDefault';

mockFs({
  'path/to': {
    'file1.test.js': 'test1',
    'file2.ts': 'test2',
  },
  'path/to/dir': {
    'file3.spec.ts': 'test3',
  },
});

afterAll(() => mockFs.restore());

test('should get matched all files', () => {
  expect(getAllFilesBy('path/to', matchDefault)).toEqual([
    'path/to/dir/file3.spec.ts',
    'path/to/file1.test.js',
  ]);
});
