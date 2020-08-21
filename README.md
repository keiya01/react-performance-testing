# react-performance-testing

![npm](https://img.shields.io/npm/v/react-performance-testing)
[![codecov](https://codecov.io/gh/keiya01/react-performance-testing/branch/master/graph/badge.svg)](https://codecov.io/gh/keiya01/react-performance-testing)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/test/badge.svg)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/build/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

You can test React(ReactNative) runtime performance by using this lib. If you want to check **the number of renders**, or **render time** in a test environment, this lib makes sense.

## Table of Contents

- [The problem](#the-problem)
- [The solution](#the-solution)
- [Installation](#installation)
- [Example](#example)
  - [count renders](#count-renders)
  - [measure render time](#measure-render-time)
- [API](#api)
  - [perf](#perf)
    - [renderCount](#renderCount)
    - [renderTime](#renderTime)
  - [wait](#wait)
  - [cleanup](#cleanup)
  - [ReactNative](#reactnative)
  - [TypeScript](#typescript)
- [Tips](#tips)
  - [Performance](#performance)
  - [Anonymous Component](#anonymous-component)
  - [Hooks](#hooks)
- [LICENSE](#license)

## The problem

If you are developing high-performance features, you would like to write tests about the number of renders or render time. We have to check with devtools or Lighthouse manually, but we could not test these cases automatically. Additionally, we cannot predict re-renders without getting nervous. The `react-performance-testing` provides a solution for these cases.

## The solution

The `react-performance-testing` provides a simple and easy way as a solution for the above problem. It provides some features by monkey patched `React`. We can count the number of renders and measure renders time as well, so we can test by using these values.

## Installation

npm:

```sh
npm install --save-dev react-performance-testing
```

yarn:

```sh
yarn add --dev react-performance-testing
```

You can increase testing experience by using [jest-performance-testing](https://github.com/keiya01/react-performance-testing/tree/master/packages/jest-performance-testing).

## Example

### count renders

```jsx
test('should two renders when state is updated', async () => {
  const Counter = () => {
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
    return <Counter />;
  };

  const { renderCount } = perf(React);

  render(<Component />);

  fireEvent.click(screen.getByRole('button', { name: /count/i }));

  await wait(() => expect(renderCount.current.Counter.value).toBe(2));
});

test('should two renders when state is updated with it have multiple same component', async () => {
  const Counter = ({ testid }) => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <p>{count}</p>
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
      <div>
        <Counter />
        <Counter testid="button" />
        <Counter />
      </div>
    );
  };

  const { renderCount } = perf(React);

  render(<Component />);

  fireEvent.click(screen.getByTestId('button'));

  await wait(() => {
    expect(renderCount.current.Counter[0].value).toBe(1);
    expect(renderCount.current.Counter[1].value).toBe(2);
    expect(renderCount.current.Counter[2].value).toBe(1);
  });
});
```

### measure render time

```jsx
test('should render time be less than 16ms', async () => {
  const Counter = () => {
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

  const { renderTime } = perf(React);

  render(<Counter />);

  fireEvent.click(screen.getByRole('button', { name: /count/i }));

  await wait(() => {
    // 16ms is meaning it is 60fps
    expect(renderTime.current.Counter.mount).toBeLessThan(16);
    // renderTime.current.Counter.updates[0] is second render
    expect(renderTime.current.Counter.updates[0]).toBeLessThan(16);
  });
});

test('should measure re-render time when state is updated with it have multiple same component', async () => {
  const Counter = ({ testid }) => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <p>{count}</p>
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
      <div>
        <Counter />
        <Counter testid="button" />
        <Counter />
      </div>
    );
  };

  const { renderTime } = perf(React);

  render(<Component />);

  fireEvent.click(screen.getByTestId('button'));

  await wait(() => {
    expect(renderTime.current.Counter[0].updates).toHaveLength(0);
    expect(renderTime.current.Counter[1].updates[0]).toBeLessThan(16);
    expect(renderTime.current.Counter[2].updates).toHaveLength(0);
  });
});
```

## API

If you use the API with a large component, the component's performance might be **worse** because we monkey patches React.
Therefore, you should use API with **components that have one feature** like `List`, `Modal` etc.

### perf

`perf` method observes your component. So you can get `renderCount` to count the number of renders and `renderTime` to measure render time.

```js
const { renderCount, renderTime } = perf(React);
```

Note that You need to invoke the `perf` method before the `render` method is invoked. Additionally, You need to pass `React` to the `perf` method. This is because we are monkey patching `React`.

**Note**: You need to wrap returned value with [wait](#wait) method.

#### renderCount

`renderCount` has several re-render in some component. You can get the number of renders like bellow.

```jsx
const Component = () => <p>test</p>;
const { renderCount } = perf(React);
// render is imported from react-testing-library
render(<Component />);
wait(() => console.log(renderCount.current.Component.value)); // output: 1
```

**Note**: You need to set a display name. If you have an anonymous component, we can not set a property to `renderCount` correctly.

##### Properties

- `renderCount.current`
  - `ComponentName: string | Array`
    - `value: number`

**Note**: If you have some same component, these components combine to `array`

#### renderTime

`renderTime` has rendering time in some component. You can get render time like bellow.

```jsx
const Component = () => <p>test</p>;
const { renderTime } = perf(React);
// render is imported from react-testing-library
render(<Component />);
wait(() => {
  console.log(renderTime.current.Component.mount); // output: ...ms
  console.log(renderTime.current.Component.updates); // output: []
});
```

**Note**: You need to set a display name. If you have an anonymous component, we can not set a property to `renderTime` correctly.

##### Properties

- `renderCount.current`
  - `ComponentName: string | Array`
    - `mount: number` ... This property has first render time
    - `updates: Array<number>` ... This property has the second and the subsequent render time(the second render is the index of `0`)

**Note**: If you have some same component, these components combine to `array`  
**Note**: Each time are displayed with `ms`

### wait

`wait` method is feature to wait for `renderCount` or `renderTime` is set. You need to wrap all `Matcher` is using `renderCount` or `renderTime` because we are assign `renderCount` and `renderTime` in asynchronous.  
This is because, if we assign some value to `renderCount` or `renderTime` in synchronous, extra processing is included in rendering phase.

```js
wait(() => console.log(renderTime.current.Component));
```

### cleanup

`cleanup` method is executed automatically in `afterEach()` if you are using `Jest`, `Mocha`, and `Jasmine`. You need to clean up your component by using `cleanup`.  
If your testing lib has `afterEach()`, you need to invoke `cleanup()` manually.

### ReactNative

If you are using ReactNative, you need to import modules from `react-performance-testing/native`.

```js
import { perf } from 'react-performance-testing/native';
```

### TypeScript

If you are using Typescript, you can get benefits from type inference as bellow.

```tsx
const Text = (): React.ReactElement => <p>test</p>;
const Component = (): React.ReactElement => (
  <div>
    <Text />
    <Text />
  </div>
);

// If you didn't pass your type to the type argument
const { renderCount, renderTime } = perf(React);
renderCount.current // Editor will suggest `Text | Text[]` and `Component | Component[]`

// If you passed your type to the type argument
const { renderCount, renderTime } = perf <{ Text: unknown[], Component: unknown }> React;
renderCount.current // Editor will suggest `Text[]` and `Component`
```

You can pass `{ComponentName: unknown or unknown[]}` type for the type argument. If you passed to the type argument, then the editor will suggest the correct type dependent on the passed type.

## Tips

### Performance

This lib is using `Proxy` API to optimize testing speed. So you should use either `renderCount` or `renderTime` in a single test case. If you use both variables and you are testing a large component, testing time will be a little slower.

### Anonymous Component

If you are using an anonymous component, this lib doesn't work correctly. To make this lib work correctly, you need to set the display name as bellows.

```js
React.memo(function MemoComponent {
  return <p>test</p>;
});

// or

const MemoComponent = () => <p>test</p>;
React.memo(MemoComponent);
```

Setting a display name will get benefits not only this lib but also when [you debug in React](https://reactjs.org/docs/react-component.html#displayname).

### Hooks

If you are using `@testing-library/react-hooks`, you can check the number of renders with the `perf` method as bellows.

```js
const { renderCount } = perf(React);
const { result } = renderHook(() => {
  /**
   * use some hooks
   */
});

// You can get value from the TestHook component
wait(() => console.log(renderCount.current.TestHook.value));
```

This is because the `renderHook` method is wrapping callback with the `TestHook` component.

## LICENSE

[MIT](LICENSE)
