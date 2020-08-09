import React from 'react';
import { perf } from '../perf';
import { render, fireEvent, screen } from '@testing-library/react';

test('should get 1 from renderCount.current.* in initial render', () => {
  class Text extends React.Component {
    render() {
      return <p>Test</p>;
    }
  }

  class Component extends React.Component {
    render() {
      return <Text />;
    }
  }

  const { renderCount } = perf(React);

  render(<Component />);

  expect(renderCount.current.Component).toBe(1);
  expect(renderCount.current.Text).toBe(1);
});

test('should get 2 from renderCount.current.Text when state is updated', () => {
  class Text extends React.Component<any, { count: number }> {
    constructor(props: any) {
      super(props);

      this.state = {
        count: 0,
      };
    }

    updateCount = () => {
      this.setState((prev) => ({ ...prev, count: prev.count + 1 }));
    };

    render() {
      return (
        <div>
          <p>{this.state.count}</p>
          <button type="button" onClick={this.updateCount}>
            count
          </button>
        </div>
      );
    }
  }

  class Component extends React.Component {
    render() {
      return <Text />;
    }
  }

  const { renderCount } = perf(React);

  render(<Component />);

  fireEvent.click(screen.getByRole('button', { name: /count/i }));

  expect(screen.queryByText('2')).toBeDefined();
  expect(renderCount.current.Text).toBe(2);
});

test('should get 1 from renderCount.current.* in initial render with memo()', () => {
  class Text extends React.Component {
    render() {
      return <p>Test</p>;
    }
  }

  class MemorizedComponent extends React.PureComponent {
    render() {
      return <Text />;
    }
  }

  const { renderCount } = perf(React);

  render(<MemorizedComponent />);

  expect(renderCount.current.MemorizedComponent).toBe(1);
  expect(renderCount.current.Text).toBe(1);
});

test('should get 2 from renderCount.current.Text when state is updated with memo()', () => {
  class MemorizedText extends React.PureComponent {
    render() {
      return <p>memo</p>;
    }
  }

  class Text extends React.Component<any, { count: number }> {
    constructor(props: any) {
      super(props);

      this.state = {
        count: 0,
      };
    }

    updateCount = () => {
      this.setState((prev) => ({ ...prev, count: prev.count + 1 }));
    };

    render() {
      return (
        <div>
          <p>{this.state.count}</p>
          <MemorizedText />
          <button type="button" onClick={this.updateCount}>
            count
          </button>
        </div>
      );
    }
  }

  class Component extends React.Component {
    render() {
      return <Text />;
    }
  }

  const { renderCount } = perf(React);

  render(<Component />);

  fireEvent.click(screen.getByRole('button', { name: /count/i }));

  expect(screen.queryByText('2')).toBeDefined();
  expect(renderCount.current.Text).toBe(2);
  expect(renderCount.current.MemorizedText).toBe(1);
});
