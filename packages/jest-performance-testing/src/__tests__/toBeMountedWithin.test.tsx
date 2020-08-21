import React from 'react';
import { render } from '@testing-library/react';
import { perf, wait } from '../../../react-performance-testing/src/index';
import '../index';

test('should throw error when component is not mounted', async () => {
  const { renderTime } = perf<{ Component: unknown }>(React);

  await wait(() =>
    expect(() =>
      expect(renderTime.current.Component).toBeMountedWithin(),
    ).toThrow(/Specified component could not be found/),
  );
});

test('should true when mount time is less than expected time', async () => {
  const Component = () => <div>test</div>;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  await wait(() => expect(renderTime.current.Component).toBeMountedWithin(16));
});

test('should throw error when mount time is greater than expected time', async () => {
  const Component = () => <div>test</div>;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  await wait(() =>
    expect(() =>
      expect(renderTime.current.Component).toBeMountedWithin(0),
    ).toThrow(/toBeMountedWithin/),
  );
});

test('should true else if mount time is greater than expected time when using `not` declaration', async () => {
  const Component = () => <div>test</div>;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  await wait(() =>
    expect(renderTime.current.Component).not.toBeMountedWithin(0),
  );
});

test('should throw error even if mount time is less than expected time when using `not` declaration', async () => {
  const Component = () => <div>test</div>;

  const { renderTime } = perf<{ Component: unknown }>(React);

  render(<Component />);

  await wait(() =>
    expect(() =>
      expect(renderTime.current.Component).not.toBeMountedWithin(16),
    ).toThrow(/not/),
  );
});
