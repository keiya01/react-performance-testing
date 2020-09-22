import mockFs from 'mock-fs';
import { run } from '../index';
import * as executer from '../exec';
import * as args from '../toArgs';
import * as _argv from '../getArgv';
import { matchDefault, concurrentDefault } from '../constants/defaultOptions';

mockFs({
  path: {
    'test1.test.ts': 'test1',
    'test2.spec.js': 'test2',
    'test3.test.ts': 'test3',
    dir: {
      'test4.test.ts': 'test4',
      'test5.test.ts': 'test5',
      'test6.test.ts': 'test6',
      'test7.test.ts': 'test7',
      'test8.test.ts': 'test8',
      'test9.test.ts': 'test9',
      'test10.test.ts': 'test10',
      'test11.test.ts': 'test11',
      'test12.test.ts': 'test12',
      'test13.test.ts': 'test13',
      'test14.test.ts': 'test14',
      'test15.test.ts': 'test15',
      'test16.test.ts': 'test16',
      'test17.test.ts': 'test17',
      'test18.test.ts': 'test18',
    },
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

test('should exit when argv is invalid', async () => {
  argv = { _: [] };

  await run();

  expect(process.exit).toBeCalled();
});

test('should exit when file could not find', async () => {
  argv = {
    cmd: 'test',
    root: 'path/notFound.js',
    match: matchDefault,
    concurrent: concurrentDefault,
    _: [],
  };

  await run();

  expect(process.exit).toBeCalled();
});

test('should not exit when argv is valid', async () => {
  argv = {
    cmd: 'test',
    root: 'path',
    match: matchDefault,
    concurrent: concurrentDefault,
    _: [],
  };

  await run();

  expect(process.exit).not.toBeCalled();
});

test('should exclude argv correctly when toArgs method is called', async () => {
  jest.spyOn(args, 'toArgs');

  argv = {
    cmd: 'test',
    root: 'path',
    match: matchDefault,
    concurrent: concurrentDefault,
    _: [],
  };

  await run();

  expect(args.toArgs).toBeCalledWith(expect.any(Object), [
    '_',
    '$1',
    'cmd',
    'c',
    'root',
    'r',
    'match',
    'm',
    'concurrent',
  ]);

  // @ts-ignore
  args.toArgs.mockRestore();
});

test('should invoke exec method', async () => {
  jest.spyOn(executer, 'exec').mockImplementation(async () => {});

  argv = {
    cmd: 'test',
    root: 'path',
    match: matchDefault,
    concurrent: concurrentDefault,
    _: [],
  };

  await run();

  expect(executer.exec).toBeCalledTimes(18);
  // @ts-ignore
  executer.exec.mockRestore();
});

test('should invoke exec method when _ argument has path', async () => {
  jest.spyOn(executer, 'exec').mockImplementation(async () => {});

  argv = {
    cmd: 'test',
    root: 'path',
    match: matchDefault,
    concurrent: concurrentDefault,
    _: ['path/test1.test.ts'],
  };

  await run();

  expect(executer.exec).toBeCalledTimes(1);

  // @ts-ignore
  executer.exec.mockRestore();
});

test('should resolve all execution at once', async () => {
  jest.spyOn(executer, 'exec').mockImplementation(async () => {});
  jest.spyOn(Promise, 'all');

  argv = {
    cmd: 'test',
    root: 'path/dir',
    match: matchDefault,
    concurrent: concurrentDefault,
    _: [],
  };

  await run();

  expect(Promise.all).toBeCalledTimes(1);

  // @ts-ignore
  executer.exec.mockRestore();
  // @ts-ignore
  Promise.all.mockRestore();
});
