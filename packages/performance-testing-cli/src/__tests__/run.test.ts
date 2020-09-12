import mockFs from 'mock-fs';
import { run } from '../index';
import * as executer from '../exec';
import * as _argv from '../getArgv';
import { matchDefault } from '../constants/matchDefault';

mockFs({
  path: {
    'test1.test.ts': 'test1',
    'test2.spec.js': 'test2',
    'test3.test.ts': 'test3',
  },
});

let argv = {};

beforeEach(() => {
  jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: number) => code as never);
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(_argv, 'getArgv').mockImplementation(() => argv as any);
});

afterEach(() => {
  // @ts-ignore
  process.exit.mockRestore();
});

afterAll(() => mockFs.restore());

test('should exit when argv is invalid', () => {
  argv = { _: [] };

  run();

  expect(process.exit).toBeCalled();
});

test('should exit when file could not find', () => {
  argv = { cmd: 'test', root: 'path/notFound.js', match: matchDefault, _: [] };

  run();

  expect(process.exit).toBeCalled();
});

test('should not exit when argv is valid', () => {
  argv = { cmd: 'test', root: 'path', match: matchDefault, _: [] };

  run();

  expect(process.exit).not.toBeCalled();
});

test('should invoke exec method', () => {
  jest.spyOn(executer, 'exec').mockImplementation(() => {});

  argv = { cmd: 'test', root: 'path', match: matchDefault, _: [] };

  run();

  expect(executer.exec).toBeCalledTimes(3);
  // @ts-ignore
  executer.exec.mockRestore();
});

test('should invoke exec method when _ argument has path', () => {
  jest.spyOn(executer, 'exec').mockImplementation(() => {});

  argv = {
    cmd: 'test',
    root: 'path',
    match: matchDefault,
    _: ['path/test1.test.ts'],
  };

  run();

  expect(executer.exec).toBeCalledTimes(1);

  // @ts-ignore
  executer.exec.mockRestore();
});
