![npm](https://img.shields.io/npm/v/react-performance-testing)
[![codecov](https://codecov.io/gh/keiya01/react-performance-testing/branch/master/graph/badge.svg)](https://codecov.io/gh/keiya01/react-performance-testing)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/test/badge.svg)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/build/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# react-performance-testing

You can test React runtime performance by using this lib. If you want to check **number of rendering** or **rendering time** in test environment, this lib is make sense.

## Table of Contents

- [Installation](#installation)
- [Examples](#examples)
- [API](#api)
  - [perf](#perf)
    - [renderCount](#renderCount)
    - [renderTime](#renderTime)
  - [cleanup](#cleanup)
- [LICENSE](#license)

## Installation

npm:

```sh
npm install --save-dev react-performance-testing
```

yarn:

```sh
yarn add --dev react-performance-testing
```

## Example

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { perf } from 'react-performance-testing';

test('should two render when state is updated', () => {
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

  expect(renderCount.current.Counter.value).toBe(2);
});

test('should two render when state is updated with it have multiple same component', () => {
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

  expect(renderCount.current.Counter[0].value).toBe(1);
  expect(renderCount.current.Counter[1].value).toBe(2);
  expect(renderCount.current.Counter[2].value).toBe(1);
});

test('should rendering time be less than 16ms', () => {
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

  // 16ms is meaning it is 60fps
  expect(renderTime.current.Counter.mount).toBeLessThan(16);
  // renderTime.current.Counter.updates[0] is first render
  expect(renderTime.current.Counter.updates[0]).toBeLessThan(16);
});

test('should measure re-render time when state is updated with it have multiple same component', () => {
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

  expect(renderTime.current.Counter[0].updates).toHaveLength(0);
  expect(renderTime.current.Counter[1].updates[0]).toBeLessThan(16);
  expect(renderTime.current.Counter[2].updates).toHaveLength(0);
});
```

## API

If you use API with large component, component's performance might be **down** because we monkey patches React.
Therefore you should use API with **component that has one feature** like `List`, `Modal` etc.

### perf

`perf` method observe your component. So you can get `renderCount` to count number of re-render.  
**Note**: If you want to measure render time, please just wait. This feature is coming soon.

```js
const { renderCount, renderTime } = perf(React);
```

**Note**: we need to pass `React` because we monkey patch React to observe your component.

#### renderCount

`renderCount` has number of re-render in some component. You can get number of re-render like bellow.

```jsx
const Component = () => <p>test</p>;
const { renderCount } = perf(React);
// render is imported from react-testing-library
render(<Component />);
console.log(renderCount.current.Component.value); // output: 1
```

**Note**: You need to set display name. If you have anonymous component, we can not set property to `renderCount` correctly.

##### Properties

- `renderCount.current`
  - `ComponentName: string | Array`
    - `value: number`

**Note**: If you have some same component, these component combine to `array`

#### renderTime

`renderTime` has rendering time in some component. You can get rendering time like bellow.

```jsx
const Component = () => <p>test</p>;
const { renderTime } = perf(React);
// render is imported from react-testing-library
render(<Component />);
console.log(renderTime.current.Component.mount); // output: ...ms
console.log(renderTime.current.Component.updates); // output: []
```

**Note**: You need to set display name. If you have anonymous component, we can not set property to `renderCount` correctly.

##### Properties

- `renderCount.current`
  - `ComponentName: string | Array`
    - `mount: number` ... This property has first render time
    - `updates: Array<number>` ... This property has the second and the subsequent render time(second render is the index of `0`)

**Note**: If you have some same component, these component combine to `array`  
**Note**: Each times are displayed with `ms`

### cleanup

`cleanup` method is executed automatically in `afterEach()` if you are using `Jest`, `Mocha` and `Jasmine`. You need to cleanup your component by using `cleanup`.  
If your testing lib has `afterEach()`, you need to invoke `cleanup()` manually.

## LICENSE

[MIT](LICENSE)
