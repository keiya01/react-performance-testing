import mockFs from 'mock-fs';
import { validate } from '../validate';
import * as logger from '../logger';

mockFs({
  'path/to': {},
});

beforeEach(() => {
  jest.spyOn(logger, 'logError').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  logger.logError.mockRestore();
});

afterAll(() => mockFs.restore());

test('should output error when option is undefined', () => {
  expect(validate({ _: [] })).toBeFalsy();
  expect(logger.logError).toBeCalledTimes(2);
});

test('should output error when root path not found', () => {
  const argv = { cmd: 'test', root: 'test', _: [] };

  expect(validate(argv)).toBeFalsy();
  expect(logger.logError).toBeCalledTimes(1);
});

test('should not output error', () => {
  const argv = { cmd: 'test', root: 'path/to', _: [] };

  expect(validate(argv)).toBeTruthy();
  expect(logger.logError).not.toBeCalled();
});

test('should not output error when _ argument has path', () => {
  const argv = { cmd: 'test', _: ['path/to'] };

  expect(validate(argv)).toBeTruthy();
  expect(logger.logError).not.toBeCalled();
});
