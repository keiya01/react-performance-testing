import { validate } from '../validate';
import fs from 'fs';

jest.mock('fs');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  console.error.mockRestore();
});

test('should output error when option is undefined', () => {
  expect(validate({})).toBeFalsy();
  expect(console.error).toBeCalledTimes(2);
});

test('should output error when root path not found', () => {
  // @ts-ignore
  fs.__setMockFiles(['path']);

  const argv = { cmd: 'test', root: 'test' };

  expect(validate(argv)).toBeFalsy();
  expect(console.error).toBeCalledTimes(1);
});

test('should not output error', () => {
  // @ts-ignore
  fs.__setMockFiles(['path/to']);

  const argv = { cmd: 'test', root: 'path/to' };

  expect(validate(argv)).toBeTruthy();
  expect(console.error).not.toBeCalled();
});
