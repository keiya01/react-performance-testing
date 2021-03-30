import React from 'react';
import { render } from '@testing-library/react';
import { perf, wait } from '../index';

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  // @ts-ignore
  console.warn.mockClear();
});

describe('FunctionComponent', () => {
  it('should initialize Component with flat structure', async () => {
    const Text = () => <p>test</p>;
    const Component = () => {
      return <Text />;
    };

    const { renderCount, renderTime } = perf(React);

    render(<Component />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        Text: { value: 1 },
        Component: { value: 1 },
      }),
    );

    await wait(() =>
      expect(renderTime.current).toEqual({
        Text: { mount: expect.any(Number), updates: [] },
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should initialize Component with nested structure', async () => {
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

    const { renderCount, renderTime } = perf(React);

    render(<Component />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        NestedText: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        Text: [{ value: 1 }, { value: 1 }, { value: 1 }],
        Component: { value: 1 },
      }),
    );

    await wait(() =>
      expect(renderTime.current).toEqual({
        NestedText: [
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
        ],
        Text: [
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
        ],
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should initialize Component with memo()', async () => {
    const Text = () => <p>Test</p>;
    const Component = React.memo(function MemorizedComponent() {
      return <Text />;
    });

    const { renderCount } = perf(React);

    render(<Component />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        MemorizedComponent: { value: 1 },
        Text: { value: 1 },
      }),
    );
  });

  it('should initialize memo component is wrapped with memo()', async () => {
    const MemoComponent = React.memo(
      React.memo(function ForwardRefComponent() {
        return <p>memo</p>;
      }),
    );

    const { renderCount } = perf(React);

    // @ts-ignore
    render(<MemoComponent />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        ForwardRefComponent: { value: 1 },
      }),
    );
  });

  it('should initialize forwardRef component is wrapped with memo()', async () => {
    const MemoComponent = React.memo(
      React.forwardRef(function ForwardRefComponent() {
        return <p>memo</p>;
      }),
    );

    const { renderCount } = perf(React);

    render(<MemoComponent />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        ForwardRefComponent: { value: 1 },
      }),
    );
  });
});

describe('ClassComponent', () => {
  it('should initialize Component with flat structure', async () => {
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

    const { renderCount, renderTime } = perf(React);

    render(<Component />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        Text: { value: 1 },
        Component: { value: 1 },
      }),
    );

    await wait(() =>
      expect(renderTime.current).toEqual({
        Text: { mount: expect.any(Number), updates: [] },
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should initial Component with nested structure', async () => {
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

    const { renderCount, renderTime } = perf(React);

    render(<Component />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        NestedText: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        Text: [{ value: 1 }, { value: 1 }, { value: 1 }],
        Component: { value: 1 },
      }),
    );

    await wait(() =>
      expect(renderTime.current).toEqual({
        NestedText: [
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
        ],
        Text: [
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
          { mount: expect.any(Number), updates: [] },
        ],
        Component: { mount: expect.any(Number), updates: [] },
      }),
    );
  });

  it('should initialize Component with memo()', async () => {
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

    await wait(() =>
      expect(renderCount.current).toEqual({
        Text: { value: 1 },
        MemorizedComponent: { value: 1 },
      }),
    );
  });

  it('should initialize component is wrapper with memo()', async () => {
    class Component extends React.Component {
      render() {
        return <p>Test</p>;
      }
    }

    const MemorizedComponent = React.memo(Component);

    const { renderCount } = perf(React);

    render(<MemorizedComponent />);

    await wait(() =>
      expect(renderCount.current).toEqual({
        Component: { value: 1 },
      }),
    );
  });

  it('should initialize PureComponent is wrapped with forwardRef()', async () => {
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

    await wait(() =>
      expect(renderCount.current).toEqual({
        MemorizedComponent: { value: 1 },
        ForwardRefComponent: { value: 1 },
      }),
    );
  });

  it('should initialize forwardRef component is wrapped with PureComponent', async () => {
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

    await wait(() =>
      expect(renderCount.current).toEqual({
        MemorizedComponent: { value: 1 },
        ForwardRefComponent: { value: 1 },
      }),
    );
  });

  it('should initialize Component when render method is arrow function', async () => {
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

    await wait(() =>
      expect(renderCount.current).toEqual({
        Text: { value: 1 },
        Component: { value: 1 },
      }),
    );
  });
});

/**
 * Wrapping memo() in forwardRef() is not supported by React 16.9.
 * But we are supporting previous version.
 */
test('should throw error when component is wrapping memo() in forwardRef()', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const ForwardRefComponent = React.forwardRef(React.memo(() => <p>memo</p>));

  const { renderCount } = perf(React);

  await wait(() => expect(renderCount.current).toEqual({}));
  expect(() => render(<ForwardRefComponent />)).toThrow();

  // @ts-ignore
  console.error.mockRestore();
});

test('should invoke console.warn when it has anonymous function component', async () => {
  const Component = React.memo(() => <p>test</p>);

  const tools = perf(React);
  tools.renderCount;
  tools.renderTime;

  render(<Component />);

  await wait(() => expect(console.warn).toBeCalledTimes(2));
});

test('should not set value when property is not defined', async () => {
  jest.spyOn(window, 'Proxy').mockImplementation((target) => target);

  const Component = () => <p>test</p>;

  const { renderCount, renderTime } = perf(React);

  render(<Component />);

  await wait(() => expect(renderCount.current).toEqual({}));
  await wait(() => expect(renderTime.current).toEqual({}));
});

test('should work correctly when Proxy is undefined', async () => {
  const proxy = window.Proxy;

  // @ts-ignore
  window.Proxy = undefined;

  const Component = () => <p>test</p>;

  const { renderCount, renderTime } = perf(React);

  render(<Component />);

  await wait(() =>
    expect(renderCount.current).toEqual({ Component: { value: 1 } }),
  );
  await wait(() =>
    expect(renderTime.current).toEqual({
      Component: { mount: expect.any(Number), updates: [] },
    }),
  );

  window.Proxy = proxy;
});
