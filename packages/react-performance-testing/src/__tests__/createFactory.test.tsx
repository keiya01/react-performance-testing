import React from 'react';
import { render } from '@testing-library/react';
import { perf, wait } from '../index';

test('should initialize with createFactory', async () => {
  const Text: React.FC = () => <p>test</p>;
  const Component: React.FC = () => {
    return React.createFactory(Text)();
  };

  const { renderCount } = perf(React);

  render(<Component />);

  await wait(() =>
    expect(renderCount.current).toEqual({
      Text: { value: 1 },
      Component: { value: 1 },
    }),
  );
});
