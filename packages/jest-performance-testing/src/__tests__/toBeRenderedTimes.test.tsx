import React from 'react';
import { render } from '@testing-library/react';
import { perf, wait } from '../../../react-performance-testing/src/index';
import '../index';

test('should throw error when component is not mounted', async () => {
  const { renderCount } = perf<{ Component: unknown }>(React);

  await wait(() =>
    expect(() =>
      expect(renderCount.current.Component).toBeRenderedTimes(),
    ).toThrow(/Specified component could not be found/),
  );
});

test('should true when expected value is equal', async () => {
  const Component = () => <div />;

  const { renderCount } = perf(React);

  render(<Component />);

  await wait(() => expect(renderCount.current.Component).toBeRenderedTimes(1));
});

test('should throw error when expected value not is equal', async () => {
  const Component = () => <div />;

  const { renderCount } = perf(React);

  render(<Component />);

  await wait(() =>
    expect(() =>
      expect(renderCount.current.Component).toBeRenderedTimes(2),
    ).toThrow(/toBeRenderedTimes/),
  );
});

test('should true even if expected value is not equal when using `not` declaration', async () => {
  const Component = () => <div />;

  const { renderCount } = perf(React);

  render(<Component />);

  await wait(() =>
    expect(renderCount.current.Component).not.toBeRenderedTimes(2),
  );
});

test('should throw error even if expected value is equal when using `not` declaration', async () => {
  const Component = () => <div />;

  const { renderCount } = perf(React);

  render(<Component />);

  await wait(() =>
    expect(() =>
      expect(renderCount.current.Component).not.toBeRenderedTimes(1),
    ).toThrow(/not/),
  );
});
