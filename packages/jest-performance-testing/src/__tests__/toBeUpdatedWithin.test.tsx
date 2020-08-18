import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { perf } from '../../../react-performance-testing/src';
import '../index';

test('should throw error when component is not mounted', () => {
  const { renderCount } = perf<{ Component: unknown }>(React);

  expect(() =>
    expect(renderCount.current.Component).toBeUpdatedWithin(0),
  ).toThrow(/Specified component could not be found/);
});

test('should be true when expected value is correct array', () => {
  const Text = ({ count }: { count: number }): React.ReactElement => (
    <p>{count}</p>
  );
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <Text count={count} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const { renderTime } = perf<{ Text: unknown; Counter: unknown }>(React);

  render(<Counter />);

  const countButton = screen.getByRole('button', { name: /count/ });

  fireEvent.click(countButton);

  fireEvent.click(countButton);

  expect(renderTime.current.Counter).toBeUpdatedWithin([
    16, // first render
    16, // second render
  ]);
});

test('should be true even if expected value is incorrect array when using `not` declaration', () => {
  const Text = ({ count }: { count: number }): React.ReactElement => (
    <p>{count}</p>
  );
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <Text count={count} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const { renderTime } = perf<{ Text: unknown; Counter: unknown }>(React);

  render(<Counter />);

  const countButton = screen.getByRole('button', { name: /count/ });

  fireEvent.click(countButton);

  fireEvent.click(countButton);

  expect(renderTime.current.Counter).not.toBeUpdatedWithin([
    0, // first render
    16, // second render
  ]);
});

test('should throw error when expected value is incorrect array', () => {
  const Text = ({ count }: { count: number }): React.ReactElement => (
    <p>{count}</p>
  );
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <Text count={count} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const { renderTime } = perf<{ Text: unknown; Counter: unknown }>(React);

  render(<Counter />);

  const countButton = screen.getByRole('button', { name: /count/ });

  fireEvent.click(countButton);

  fireEvent.click(countButton);

  expect(() =>
    expect(renderTime.current.Counter).toBeUpdatedWithin([
      0, // incorrect
      16, // correct
    ]),
  ).toThrow(/\[0, 16\]/);
});

test('should be true when expected value is correct number', () => {
  const Text = ({ count }: { count: number }): React.ReactElement => (
    <p>{count}</p>
  );
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <Text count={count} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const { renderTime } = perf<{ Text: unknown; Counter: unknown }>(React);

  render(<Counter />);

  const countButton = screen.getByRole('button', { name: /count/ });

  fireEvent.click(countButton);

  fireEvent.click(countButton);

  expect(renderTime.current.Counter).toBeUpdatedWithin(16);
});

test('should throw error when expected value is incorrect number', () => {
  const Text = ({ count }: { count: number }): React.ReactElement => (
    <p>{count}</p>
  );
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <Text count={count} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const { renderTime } = perf<{ Text: unknown; Counter: unknown }>(React);

  render(<Counter />);

  const countButton = screen.getByRole('button', { name: /count/ });

  fireEvent.click(countButton);

  fireEvent.click(countButton);

  expect(() => expect(renderTime.current.Counter).toBeUpdatedWithin(0)).toThrow(
    /\[0, 0\]/,
  );
});

test('should throw error when updates property is passed', () => {
  const Text = ({ count }: { count: number }): React.ReactElement => (
    <p>{count}</p>
  );
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <Text count={count} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const { renderTime } = perf<{ Text: unknown; Counter: unknown }>(React);

  render(<Counter />);

  const countButton = screen.getByRole('button', { name: /count/ });

  fireEvent.click(countButton);

  expect(() =>
    expect(renderTime.current.Counter?.updates).toBeUpdatedWithin(0),
  ).toThrow(/You need to pass Component property/);
});

test('should throw error when expected value is incorrect number', () => {
  expect(() => expect(undefined).toBeUpdatedWithin(16)).toThrow(
    /Specified component could not be found/,
  );
});
