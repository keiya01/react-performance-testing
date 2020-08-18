import React from 'react';
import { render } from '@testing-library/react';
import { perf } from '../../../react-performance-testing/src/index';
import '../index';

test('should true when component is mounted', () => {
  const Component = () => <div />;

  const { renderCount } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(renderCount.current.Component).toMount();
});

test('should throw error when component is not mounted', () => {
  const { renderCount } = perf<{ Component: unknown }>(React);

  expect(() => expect(renderCount.current.Component).toMount()).toThrow(
    /Specified component could not be found/,
  );
});

test('should true even if component is not mounted when using `not` declaration', () => {
  const { renderCount } = perf<{ Component: unknown }>(React);

  expect(renderCount.current.Component).not.toMount();
});

test('should throw error even if component is mounted when using `not` declaration', () => {
  const Component = () => <div />;

  const { renderCount } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(() => expect(renderCount.current.Component).not.toMount()).toThrow(
    /Specified component could be found/,
  );
});

test('should true when mount time is less than expected time', () => {
  const Component = () => <div />;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(renderTime.current.Component).toMount(16);
});

test('should throw error when mount time is greater than expected time', () => {
  const Component = () => <div />;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(() => expect(renderTime.current.Component).toMount(0)).toThrow(
    /toMount/,
  );
});

test('should true else if mount time is greater than expected time when using `not` declaration', () => {
  const Component = () => <div />;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(renderTime.current.Component).not.toMount(0);
});

test('should throw error even if mount time is less than expected time when using `not` declaration', () => {
  const Component = () => <div />;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(() => expect(renderTime.current.Component).not.toMount(16)).toThrow(
    /not/,
  );
});

test('should warn log when using renderCount and passing value to toMount', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  const Component = () => <div />;

  const { renderCount } = perf<{ Component: unknown }>(React);

  render(<Component />);

  expect(renderCount.current.Component).toMount(16);

  expect(console.warn).toBeCalledTimes(1);

  // @ts-ignore
  console.warn.mockRestore();
});
