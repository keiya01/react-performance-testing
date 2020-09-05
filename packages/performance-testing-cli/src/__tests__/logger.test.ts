import chalk from 'chalk';
import { logError } from '../logger';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  console.error.mockRestore();
});

test('should output console.error', () => {
  Object.defineProperty(chalk, 'red', { value: jest.fn() });

  logError('test');

  expect(console.error).toBeCalled();
  expect(chalk.red).toBeCalled();
});
