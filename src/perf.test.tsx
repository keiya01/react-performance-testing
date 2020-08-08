import React from 'react';
import { perf } from './index';
import { render, fireEvent, screen } from '@testing-library/react';

describe('perf()', () => {
  describe('with FunctionComponent', () => {
    it('should get 1 from renderCount.current.* in initial render', () => {
      const Text = () => <p>Test</p>;
      const Component = () => {
        return <Text />;
      };

      const { renderCount } = perf();

      render(<Component />);

      expect(renderCount.current.Component).toBe(1);
      expect(renderCount.current.Text).toBe(1);
    });

    it('should get 2 from renderCount.current.Text when state is updated', () => {
      const Text = () => {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <p>{count}</p>
            <button type="button" onClick={() => setCount((c) => c + 1)}>
              count
            </button>
          </div>
        );
      };
      const Component = () => {
        return <Text />;
      };

      const { renderCount } = perf();

      render(<Component />);

      fireEvent.click(screen.getByRole('button', { name: /count/i }));

      expect(screen.queryByText('2')).toBeDefined();
      expect(renderCount.current.Text).toBe(2);
    });
  });
});
