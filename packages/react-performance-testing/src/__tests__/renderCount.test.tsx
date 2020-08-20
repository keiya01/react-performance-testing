import React from 'react';
import { perf } from '../index';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

describe('FunctionComponent', () => {
  it('should get 2 from renderCount.current.Text when state is updated with flat structure', async () => {
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
    await waitFor(() =>
      expect(renderCount.current).toEqual({
        Text: { value: 2 },
        Component: { value: 1 },
      }),
    );
  });

  it('should get 2 from renderCount.current.Text when state is updated with nested structure', async () => {
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
    await waitFor(() =>
      expect(renderCount.current).toEqual({
        NestedText: [{ value: 2 }, { value: 2 }, { value: 1 }],
        Text: [{ value: 2 }, { value: 2 }, { value: 1 }],
        Component: { value: 1 },
      }),
    );
  });

  it('should get 2 from renderCount.current.Text when state is updated with memo()', async () => {
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
    await waitFor(() =>
      expect(renderCount.current).toEqual({
        MemorizedText: { value: 1 },
        Text: { value: 2 },
        Component: { value: 1 },
      }),
    );
  });
});

describe('ClassComponent', () => {
  it('should get 2 from renderCount.current.Text when state is updated with flat structure', async () => {
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

    await waitFor(() =>
      expect(renderCount.current).toEqual({
        Text: { value: 2 },
        Component: { value: 1 },
      }),
    );
  });

  it('should get 2 from renderCount.current.Text when state is updated with nested structure', async () => {
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
    await waitFor(() =>
      expect(renderCount.current).toEqual({
        NestedText: [{ value: 2 }, { value: 2 }, { value: 1 }],
        Text: [{ value: 2 }, { value: 2 }, { value: 1 }],
        Component: { value: 1 },
      }),
    );
  });

  it('should get 2 from renderCount.current.Text when state is updated with memo()', async () => {
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
    await waitFor(() =>
      expect(renderCount.current).toEqual({
        MemorizedText: { value: 1 },
        Text: { value: 2 },
        Component: { value: 1 },
      }),
    );
  });
});
