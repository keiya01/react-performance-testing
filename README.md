# react-performance-testing

![npm](https://img.shields.io/npm/v/react-performance-testing)
[![codecov](https://codecov.io/gh/keiya01/react-performance-testing/branch/master/graph/badge.svg)](https://codecov.io/gh/keiya01/react-performance-testing)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/test/badge.svg)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/build/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This library is perfect for testing React or ReactNative runtime performance. `react-performance-testing` counts **the number of renders** and the **render time** in a test environment.

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

If you need to develop high-performance features, you need to count renders and render time. Normally you would have to go through the arduous process of manually checking dev-tools or Lighthouse. With `react-performance-testing` you can automate this process, saving you time and ensuring you always have one eye on performance.

## The solution

`react-performance-testing` monkey patches `React` to provide you with an API that can count the number of renders and measure render time.

## Installation

npm:

```sh
npm install --save-dev react-performance-testing
```

yarn:

```sh
yarn add --dev react-performance-testing
```

Use [jest-performance-testing](https://github.com/keiya01/react-performance-testing/tree/master/packages/jest-performance-testing) for a great testing experience.
  
Additionally, you can use [performance-testing-cli](https://github.com/keiya01/react-performance-testing/tree/master/packages/performance-testing-cli) if you use `renderTime`. If you use this library, you can execute test for each files. Therefore you will not need to test one by one.

## Example

### count renders

```jsx
test('should have two renders when state is updated', async () => {
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

test('should have two renders when state is updated with multiple of the same component', async () => {
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

If you want to use `renderTime`, please check out the docs: [renderTime](#renderTime).

```jsx
test('render time should be less than 16ms', async () => {
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

test('should measure re-render time when state is updated with multiple of the same component', async () => {
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

If you use the API with a large component, the component's performance could be affected because we monkey patch React.
Therefore, if you want to measure accurately, you should use the API with **components that have one feature** like `List`, `Modal` etc.

### perf

`perf` method observes your component. So you can get the `renderCount` to count the number of renders and `renderTime` to measure render time.

```js
const { renderCount, renderTime } = perf(React);
```

Note that You need to invoke the `perf` method before the `render` method is invoked. Additionally, You need to pass `React` to the `perf` method because we are monkey patching `React`.

**Note**: You need to wrap the returned value with [wait](#wait) method.

#### renderCount

`renderCount` will count the number of renders.

```jsx
const Component = () => <p>test</p>;
const { renderCount } = perf(React);
// render is imported from react-testing-library
render(<Component />);
wait(() => console.log(renderCount.current.Component.value)); // output: 1
```

**Note**: You need to set a display name. If you have an anonymous component, we can not set the `renderCount` property correctly.

##### Properties

- `renderCount.current`
  - `ComponentName: string | Array`
    - `value: number`

**Note**: If you have the same component, these components combine into an `array`

#### renderTime

`renderTime` will count the time elapsed between renders.

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

**Note**: If you want to measure render time, you need to test renders **one by one**. V8 has a feature called [inline caching](https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e), so if you measure just the result there will be a **large difference**. Therefore You need to execute tests **one by one** like `jest --testNamePattern=...` or `jest src/something.test.js`.

**Note**: You need to set a display name. If you have an anonymous component, we can not set a property to `renderTime` correctly.

##### Properties

- `renderCount.current`
  - `ComponentName: string | Array`
    - `mount: number` ... This property has the initial render time.
    - `updates: Array<number>` ... This property has the second and the subsequent render time (the second render is the index of `0`)

**Note**: If you have the duplicate components, these components combine into `array`  
**Note**: time is measured in `ms`, milliseconds elapsed.

### wait

The `wait` method is a feature that waits for `renderCount` or `renderTime` to be assigned. We need to wrap all returned values from `perf()` because we are assigning `renderCount` and `renderTime` asynchronous. If we were to assign some value to `renderCount` or `renderTime` synchronous, extra processing would be included in the rendering phase.

```js
wait(() => console.log(renderTime.current.Component));
```

### cleanup

The `cleanup` method is executed automatically in `afterEach()` if you are using `Jest`, `Mocha`, and `Jasmine`. You need to clean up your component by using `cleanup`.
If your testing library has `afterEach()`, you need to invoke `cleanup()` manually.

### ReactNative

If you are using ReactNative, you need to import modules from `react-performance-testing/native`.

```js
import { perf } from 'react-performance-testing/native';
```

### TypeScript

If you are using Typescript, you can get benefits from type inference as seen below.

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

You can pass the `{ComponentName: unknown or unknown[]}` type for the type argument. If you passed to the type argument, then the editor will suggest the correct type dependent on the passed type.

**Note**: If you are using `ts-jest`, you need to combine it with `babel`. You can check the way to set up config [here](https://github.com/keiya01/react-performance-testing/tree/master/example). This is because, `TypeScript` compiler can not compile named arrow functions correctly. You can read up on the issue here: https://github.com/microsoft/TypeScript/issues/6433.

## Tips

### Performance

This library is using the `Proxy` API to optimize testing speed. So you should use either `renderCount` or `renderTime` in a single test case. If you use both variables or you are testing a large component, the testing time will be a little slower.

### Anonymous Component

If you are using an anonymous component, this library doesn't work correctly. To make this library work correctly, you need to set the display name as seen below.

```js
React.memo(function MemoComponent() {
  return <p>test</p>;
});

// or

const MemoComponent = () => <p>test</p>;
React.memo(MemoComponent);
```

Setting a display name will get benefits not only from this library but also when [you debug in React](https://reactjs.org/docs/react-component.html#displayname).

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

This is because the `renderHook` method is wrapping callbacks with the `TestHook` component.

## LICENSE

[MIT](LICENSE)
