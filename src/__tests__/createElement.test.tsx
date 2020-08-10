import React from 'react';
import { perf } from '../perf';
import { render, fireEvent, screen } from '@testing-library/react';

describe('FunctionComponent', () => {
  it('should get 1 from renderCount.current.* in initial render', () => {
    const Text = () => <p>Test</p>;
    const Component = () => {
      return <Text />;
    };

    const { renderCount } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      Text: 1,
      Component: 1,
    });
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

    const { renderCount } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByRole('button', { name: /count/i }));

    expect(screen.queryByText('2')).toBeDefined();
    expect(renderCount.current).toEqual({
      Text: 2,
      Component: 1,
    });
  });

  it('should get 1 from renderCount.current.* in initial render with memo()', () => {
    const Text = () => <p>Test</p>;
    const Component = React.memo(function MemorizedComponent() {
      return <Text />;
    });

    const { renderCount } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      MemorizedComponent: 1,
      Text: 1,
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated with memo()', () => {
    const Wrapper = React.memo(function MemorizedText() {
      return <p>memo</p>;
    });
    const Text = () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <p>{count}</p>
          <Wrapper />
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            count
          </button>
        </div>
      );
    };
    const Component = () => {
      return <Text />;
    };

    const { renderCount } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByRole('button', { name: /count/i }));

    expect(screen.queryByText('2')).toBeDefined();
    expect(renderCount.current).toEqual({
      MemorizedText: 1,
      Text: 2,
      Component: 1,
    });
  });

  it('should initialize memo component is wrapped with forwardRef()', () => {
    const MemoComponent = React.memo(function MemoComponent() {
      return <p>forwardRef</p>;
    });
    const ForwardRefComponent = React.forwardRef(
      function ForwardRefComponent() {
        return <MemoComponent />;
      },
    );

    const { renderCount } = perf(React);

    render(<ForwardRefComponent />);

    expect(renderCount.current).toEqual({
      MemoComponent: 1,
      ForwardRefComponent: 1,
    });
  });

  it('should initialize forwardRef component is wrapped with memo()', () => {
    const ForwardRefComponent = React.forwardRef(
      function ForwardRefComponent() {
        return <p>memo</p>;
      },
    );
    const MemoComponent = React.memo(function MemoComponent() {
      return <ForwardRefComponent />;
    });

    const { renderCount } = perf(React);

    render(<MemoComponent />);

    expect(renderCount.current).toEqual({
      MemoComponent: 1,
      ForwardRefComponent: 1,
    });
  });
});

describe('ClassComponent', () => {
  it('should get 1 from renderCount.current.* in initial render', () => {
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

    expect(renderCount.current).toEqual({
      Text: 1,
      Component: 1,
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated', () => {
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

    expect(renderCount.current).toEqual({
      Text: 2,
      Component: 1,
    });
  });

  it('should get 1 from renderCount.current.* in initial render with memo()', () => {
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

    expect(renderCount.current).toEqual({
      Text: 1,
      MemorizedComponent: 1,
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated with memo()', () => {
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
    expect(renderCount.current).toEqual({
      MemorizedText: 1,
      Text: 2,
      Component: 1,
    });
  });

  it('should initialize memo component is wrapped with forwardRef()', () => {
    const ForwardRefComponent = React.forwardRef(
      function ForwardRefComponent() {
        return <p>forwardRef</p>;
      },
    );
    class MemorizedComponent extends React.PureComponent {
      render() {
        return <ForwardRefComponent />;
      }
    }

    const { renderCount } = perf(React);

    render(<MemorizedComponent />);

    expect(renderCount.current).toEqual({
      MemorizedComponent: 1,
      ForwardRefComponent: 1,
    });
  });

  it('should initialize forwardRef component is wrapped with memo()', () => {
    class MemorizedComponent extends React.PureComponent {
      render() {
        return <p>memo</p>;
      }
    }
    const ForwardRefComponent = React.forwardRef(
      function ForwardRefComponent() {
        return <MemorizedComponent />;
      },
    );

    const { renderCount } = perf(React);

    render(<ForwardRefComponent />);

    expect(renderCount.current).toEqual({
      MemorizedComponent: 1,
      ForwardRefComponent: 1,
    });
  });
});
