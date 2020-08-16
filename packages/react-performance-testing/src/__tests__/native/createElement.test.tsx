import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';
import { perf } from '../../native/index';

test('should get correct value when Component is initialized', () => {
  const Component = () => (
    <View>
      <Text>test</Text>
    </View>
  );

  const { renderCount } = perf(React);

  render(<Component />);

  expect(renderCount.current).toEqual({
    Component: { value: 1 },
  });
});

test('should get correct value when Component is updated', () => {
  const Child = () => <p>test</p>;
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <View>
        <Text>{count}</Text>
        <Child />
        <Button title="button" onPress={() => setCount((c) => c + 1)} />
      </View>
    );
  };

  const { renderCount } = perf(React);

  const { getByText } = render(<Counter />);

  fireEvent.press(getByText('button'));

  expect(renderCount.current).toEqual({
    Counter: { value: 2 },
    Child: { value: 2 },
  });
});