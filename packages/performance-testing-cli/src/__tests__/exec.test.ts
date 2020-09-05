import child_process from 'child_process';
import { exec } from '../exec';
import * as logger from '../logger';

beforeEach(() => {
  jest.spyOn(logger, 'logError').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  logger.logError.mockRestore();
});

test('should output error', () => {
  jest.spyOn(child_process, 'spawnSync').mockImplementation(() => {
    return { error: new Error() } as any;
  });

  exec('test', 'path');

  expect(logger.logError).toBeCalledTimes(1);
});

test('should not output error when error is undefined', () => {
  jest.spyOn(child_process, 'spawnSync').mockImplementation(() => {
    return { error: undefined } as any;
  });

  exec('test', 'path');

  expect(logger.logError).not.toBeCalled();
});
