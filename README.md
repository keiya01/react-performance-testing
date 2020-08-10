# react-performance-testing (Experimental)

You can test react performance by using this lib. If you want to check **number of rendering** or **rendering time** in test environment, this lib is make sense. You can check react performance.

## TODO

- [ ] Function Component
  - [x] initial render count
  - [x] re-render count
  - [ ] measuring render time
- [ ] Class Component
  - [x] initial render count
  - [x] re-render count
  - [ ] measuring render time
- [ ] Memo Component
  - [x] initial render count
  - [x] re-render count
  - [ ] measuring render time
- [ ] ForwardRef Component
  - [x] initial render count
  - [x] re-render count
  - [ ] measuring render time
- [ ] support auto clear

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

  expect(renderCount.current.Counter).toBe(2);
});

// This use case is going to be implemented
// test('should rendering time be less than 16ms', () => {
//   const Counter = () => {
//     const [count, setCount] = React.useState(0);
//     return (
//       <div>
//         <p>{count}</p>
//         <button type="button" onClick={() => setCount((c) => c + 1)}>
//           count
//         </button>
//       </div>
//     );
//   };

//   const { renderTime } = perf(React);

//   render(<Counter />);

//   fireEvent.click(screen.getByRole('button', { name: /count/i }));

//   expect(renderTime.current.Counter).toBeLessThan(0.16);
// });
```

## Notice

- If you use **memorized component**, you should set display name
