import React from 'react';
import { perf } from '../index';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

describe('FunctionComponent', () => {
  it('should get correct value from renderTime.current.Text when state is updated with flat structure', async () => {
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

    const { renderTime } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByRole('button', { name: /count/i }));

    expect(screen.queryByText('1')).toBeInTheDocument();
    await waitFor(() =>
      expect(renderTime.current).toEqual({
        Text: { mount: expect.any(Number), updates: [expect.any(Number)] },
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should get correct value from renderTime.current.Text when state is updated with nested structure', async () => {
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

    const { renderTime } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByTestId('button1'));
    fireEvent.click(screen.getByTestId('button2'));

    expect(screen.queryByText('2')).toBeDefined();
    await waitFor(() =>
      expect(renderTime.current).toEqual({
        NestedText: [
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [] },
        ],
        Text: [
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [] },
        ],
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should get correct value from renderTime.current.Text when state is updated with memo()', async () => {
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

    const { renderTime } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByRole('button', { name: /count/i }));

    expect(screen.queryByText('2')).toBeDefined();
    await waitFor(() =>
      expect(renderTime.current).toEqual({
        MemorizedText: { mount: expect.any(Number), updates: [] },
        Text: { mount: expect.any(Number), updates: [expect.any(Number)] },
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });
});

describe('ClassComponent', () => {
  it('should get correct value from renderTime.current.Text when state is updated with flat structure', async () => {
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

    const { renderTime } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByRole('button', { name: /count/i }));

    expect(screen.queryByText('2')).toBeDefined();

    await waitFor(() =>
      expect(renderTime.current).toEqual({
        Text: { mount: expect.any(Number), updates: [expect.any(Number)] },
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should get correct value from renderTime.current.Text when state is updated with nested structure', async () => {
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

    const { renderTime } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByTestId('button1'));
    fireEvent.click(screen.getByTestId('button2'));

    expect(screen.queryByText('2')).toBeDefined();
    await waitFor(() =>
      expect(renderTime.current).toEqual({
        NestedText: [
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [] },
        ],
        Text: [
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [expect.any(Number)] },
          { mount: expect.any(Number), updates: [] },
        ],
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should get correct value from renderTime.current.Text when state is updated with memo()', async () => {
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

    const { renderTime } = perf(React);

    render(<Component />);

    fireEvent.click(screen.getByRole('button', { name: /count/i }));

    expect(screen.queryByText('2')).toBeDefined();
    await waitFor(() =>
      expect(renderTime.current).toEqual({
        MemorizedText: { mount: expect.any(Number), updates: [] },
        Text: { mount: expect.any(Number), updates: [expect.any(Number)] },
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });
});
