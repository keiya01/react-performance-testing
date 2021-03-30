import child_process from 'child_process';
import { exec } from '../exec';
import * as logger from '../logger';

let error: any = null;

beforeEach(() => {
  jest.spyOn(logger, 'logError').mockImplementation(() => {});
  jest.spyOn(child_process, 'spawnSync').mockImplementation(() => {
    return { error } as any;
  });
});

afterEach(() => {
  // @ts-ignore
  logger.logError.mockRestore();
});

test('should output error', async () => {
  error = new Error();

  try {
    await exec('test', 'path', []);
  } catch (err) {}

  expect(logger.logError).toBeCalledTimes(1);
});

test('should not output error when error is undefined', async () => {
  error = null;

  await exec('test', 'path', []);

  expect(logger.logError).not.toBeCalled();
});
