import React from 'react';
import { render } from '@testing-library/react';
import { perf } from '../index';
// import { everyIsFloat } from './testUtils/everyIsFloat';

describe('FunctionComponent', () => {
  it('should initialize Component with flat structure', () => {
    const Text = () => <p>test</p>;
    const Component = () => {
      return <Text />;
    };

    const { renderCount, renderTime } = perf(React);

    render(<Component />);

    expect(renderCount.current).toEqual({
      Text: { value: 1 },
      Component: { value: 1 },
    });

    expect(renderTime.current).toEqual({
      Text: { mount: expect.any(Number), updates: [] },
      Component: { mount: expect.any(Number), updates: [] },
    });
  });

  it('should initialize Component with nested structure', () => {
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

    expect(renderCount.current).toEqual({
      NestedText: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
      Text: [{ value: 1 }, { value: 1 }, { value: 1 }],
      Component: { value: 1 },
    });

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
    });
  });

  it('should initialize Component with memo()', () => {
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

  it('should initialize memo component is wrapped with memo()', () => {
    const MemoComponent = React.memo(
      React.memo(function ForwardRefComponent() {
        return <p>memo</p>;
      }),
    );

    const { renderCount } = perf(React);

    // @ts-ignore
    render(<MemoComponent />);

    expect(renderCount.current).toEqual({
      ForwardRefComponent: { value: 1 },
    });
  });

  it('should initialize forwardRef component is wrapped with memo()', () => {
    const MemoComponent = React.memo(
      React.forwardRef(function ForwardRefComponent() {
        return <p>memo</p>;
      }),
    );

    const { renderCount } = perf(React);

    render(<MemoComponent />);

    expect(renderCount.current).toEqual({
      ForwardRefComponent: { value: 1 },
    });
  });
});

describe('ClassComponent', () => {
  it('should initialize Component with flat structure', () => {
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

  it('should initial Component with nested structure', () => {
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

  it('should initialize Component with memo()', () => {
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

  it('should initialize component is wrapper with memo()', () => {
    class Component extends React.Component {
      render() {
        return <p>Test</p>;
      }
    }

    const MemorizedComponent = React.memo(Component);

    const { renderCount } = perf(React);

    render(<MemorizedComponent />);

    expect(renderCount.current).toEqual({
      Component: { value: 1 },
    });
  });

  it('should initialize PureComponent is wrapped with forwardRef()', () => {
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

  it('should initialize forwardRef component is wrapped with PureComponent', () => {
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

  it('should initialize Component when render method is arrow function', () => {
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

/**
 * Wrapping memo() in forwardRef() is not supported by React 16.9.
 * But we are supporting previous version.
 */
test('should throw error when component is wrapping memo() in forwardRef()', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  const ForwardRefComponent = React.forwardRef(React.memo(() => <p>memo</p>));

  const { renderCount } = perf(React);

  expect(() => render(<ForwardRefComponent />)).toThrow();
  expect(renderCount.current).toEqual({});

  // @ts-ignore
  console.error.mockRestore();
  // @ts-ignore
  console.warn.mockRestore();
});

test('should invoke console.warn when it has anonymous function component', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  const Component = React.memo(() => <p>test</p>);

  perf(React);

  render(<Component />);

  expect(console.warn).toBeCalledTimes(1);

  // @ts-ignore
  console.warn.mockRestore();
});

test('should invoke console.warn when it has anonymous class component', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  const Component = React.memo(
    class extends React.Component {
      render() {
        return <p>test</p>;
      }
    },
  );

  perf(React);

  render(<Component />);

  expect(console.warn).toBeCalledTimes(1);

  // @ts-ignore
  console.warn.mockRestore();
});
