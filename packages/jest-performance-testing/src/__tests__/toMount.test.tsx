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
