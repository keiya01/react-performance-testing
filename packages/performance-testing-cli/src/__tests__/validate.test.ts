import fs from 'fs';
import { validate } from '../validate';
import * as logger from '../logger';

jest.mock('fs');

beforeEach(() => {
  jest.spyOn(logger, 'logError').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  logger.logError.mockRestore();
});

test('should output error when option is undefined', () => {
  expect(validate({})).toBeFalsy();
  expect(logger.logError).toBeCalledTimes(2);
});

test('should output error when root path not found', () => {
  // @ts-ignore
  fs.__setMockFiles(['path']);

  const argv = { cmd: 'test', root: 'test' };

  expect(validate(argv)).toBeFalsy();
  expect(logger.logError).toBeCalledTimes(1);
});

test('should not output error', () => {
  // @ts-ignore
  fs.__setMockFiles(['path/to']);

  const argv = { cmd: 'test', root: 'path/to' };

  expect(validate(argv)).toBeTruthy();
  expect(logger.logError).not.toBeCalled();
});
