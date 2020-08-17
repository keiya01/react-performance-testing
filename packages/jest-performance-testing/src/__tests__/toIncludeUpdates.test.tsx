import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { perf } from '../../../react-performance-testing/src';
import '../index';

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

  expect(renderTime.current.Counter).toIncludeUpdates([
    16, // first render
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
    expect(renderTime.current.Counter).toIncludeUpdates([
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

  expect(renderTime.current.Counter).toIncludeUpdates(16);
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

  expect(() => expect(renderTime.current.Counter).toIncludeUpdates(0)).toThrow(
    /\[0, 0\]/,
  );
});

test('should throw error when expected value is incorrect number', () => {
  expect(() => expect(undefined).toIncludeUpdates(16)).toThrow(
    /Specified component could not be found/,
  );
});
