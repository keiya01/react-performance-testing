import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { perf } from '../index';

test('should initialize clone element', async () => {
  const Text: React.FC = () => <p>test</p>;
  const Wrapper: React.FC = ({ children }) =>
    React.isValidElement(children) ? React.cloneElement(children) : null;
  const Component = () => {
    return (
      <Wrapper>
        <Text />
      </Wrapper>
    );
  };

  const { renderCount } = perf(React);

  render(<Component />);

  await waitFor(() =>
    expect(renderCount.current).toEqual({
      Text: { value: 1 },
      Wrapper: { value: 1 },
      Component: { value: 1 },
    }),
  );
});
