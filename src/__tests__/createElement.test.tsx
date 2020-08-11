import React from 'react';
import { perf } from '../index';
import { render, fireEvent, screen } from '@testing-library/react';

describe('FunctionComponent', () => {
  it('should get 1 from renderCount.current.* in initial render with flat structure', () => {
    const Text = () => <p>test</p>;
    const Component = () => {
      return <Text />;
    };

    const { renderCount } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      Text: { value: 1 },
      Component: { value: 1 },
    });
  });

  it('should get 1 from renderCount.current.* in initial render with nested structure', () => {
    const NestedText = () => <p>test</p>;
    const Text = () => <NestedText />;
    const Component = () => {
      return (
        <>
          <Text />
          <Text />
          <Text />
          <NestedText />
        </>
      );
    };

    const { renderCount } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      NestedText: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
      Text: [{ value: 1 }, { value: 1 }, { value: 1 }],
      Component: { value: 1 },
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated with flat structure', () => {
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
      Text: { value: 2 },
      Component: { value: 1 },
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated with nested structure', () => {
    const NestedText = ({ count }: { count: number }) => <p>{count}</p>;
    const Text = ({ testid }: { testid?: string }) => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <NestedText count={count} />
          <button
            data-testid={testid}
            type="button"
            onClick={() => setCount((c) => c + 1)}
          >
            count
          </button>
        </div>
      );
    };
    const Component = () => {
      return (
        <>
          <Text testid="button1" />
          <Text testid="button2" />
          <Text />
        </>
      );
    };

    const { renderCount } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByTestId('button1'));
    fireEvent.click(screen.getByTestId('button2'));

    expect(screen.queryByText('2')).toBeDefined();
    expect(renderCount.current).toEqual({
      NestedText: [{ value: 2 }, { value: 2 }, { value: 1 }],
      Text: [{ value: 2 }, { value: 2 }, { value: 1 }],
      Component: { value: 1 },
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
      MemorizedComponent: { value: 1 },
      Text: { value: 1 },
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
      MemorizedText: { value: 1 },
      Text: { value: 2 },
      Component: { value: 1 },
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
      MemoComponent: { value: 1 },
      ForwardRefComponent: { value: 1 },
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
      MemoComponent: { value: 1 },
      ForwardRefComponent: { value: 1 },
    });
  });
});

describe('ClassComponent', () => {
  it('should get 1 from renderCount.current.* in initial render with flat structure', () => {
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
      Text: { value: 1 },
      Component: { value: 1 },
    });
  });

  it('should get 1 from renderCount.current.* in initial render with nested structure', () => {
    class NestedText extends React.Component {
      render() {
        return <p>Test</p>;
      }
    }

    class Text extends React.Component {
      render() {
        return <NestedText />;
      }
    }

    class Component extends React.Component {
      render() {
        return (
          <>
            <NestedText />
            <Text />
            <Text />
            <Text />
          </>
        );
      }
    }

    const { renderCount } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      NestedText: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
      Text: [{ value: 1 }, { value: 1 }, { value: 1 }],
      Component: { value: 1 },
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated with flat structure', () => {
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
      Text: { value: 2 },
      Component: { value: 1 },
    });
  });

  it('should get 2 from renderCount.current.Text when state is updated with nested structure', () => {
    interface NestedTextProps {
      count: number;
    }
    class NestedText extends React.Component<NestedTextProps> {
      constructor(props: NestedTextProps) {
        super(props);
      }

      render() {
        return <p>{this.props.count}</p>;
      }
    }

    interface TextProps {
      testid?: string;
    }
    class Text extends React.Component<TextProps, { count: number }> {
      constructor(props: TextProps) {
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
            <NestedText count={this.state.count} />
            <button
              data-testid={this.props.testid}
              type="button"
              onClick={this.updateCount}
            >
              count
            </button>
          </div>
        );
      }
    }

    class Component extends React.Component {
      render() {
        return (
          <>
            <Text testid="button1" />
            <Text testid="button2" />
            <Text />
          </>
        );
      }
    }

    const { renderCount } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByTestId('button1'));
    fireEvent.click(screen.getByTestId('button2'));

    expect(screen.queryByText('2')).toBeDefined();
    expect(renderCount.current).toEqual({
      NestedText: [{ value: 2 }, { value: 2 }, { value: 1 }],
      Text: [{ value: 2 }, { value: 2 }, { value: 1 }],
      Component: { value: 1 },
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
      Text: { value: 1 },
      MemorizedComponent: { value: 1 },
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
      MemorizedText: { value: 1 },
      Text: { value: 2 },
      Component: { value: 1 },
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
      MemorizedComponent: { value: 1 },
      ForwardRefComponent: { value: 1 },
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
      MemorizedComponent: { value: 1 },
      ForwardRefComponent: { value: 1 },
    });
  });

  it('should get 1 from renderCount.current.* in initial render when render method is arrow function', () => {
    class Text extends React.Component {
      render() {
        return <p>Test</p>;
      }
    }

    class Component extends React.Component {
      render = () => {
        return <Text />;
      };
    }

    const { renderCount } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      Text: { value: 1 },
      Component: { value: 1 },
    });
  });
});

test('should invoke console.warn when it has anonymous component', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  const Component = React.memo(() => <p>test</p>);

  perf(React);

  render(<Component />);

  expect(console.warn).toBeCalledTimes(1);

  // @ts-ignore
  console.warn.mockRestore();
});
