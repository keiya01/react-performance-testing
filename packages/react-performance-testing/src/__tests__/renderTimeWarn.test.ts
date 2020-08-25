import React from 'react';
import { perf } from '../index';

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  console.warn.mockClear();
});

test('should not invoke console.warn when renderTime is declared only one', () => {
  const tools = perf(React);
  tools.renderTime;

  expect(console.warn).not.toHaveBeenCalled();
});

test('should invoke console.warn when renderTime is declared more than two times', () => {
  const tools = perf(React);
  tools.renderTime;

  expect(console.warn).toHaveBeenCalledTimes(1);
});
