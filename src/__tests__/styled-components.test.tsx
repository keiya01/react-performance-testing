import React from 'react';
import styled from 'styled-components';
import { render } from '@testing-library/react';
import { perf } from '../index';

test('should initialize with styled-components', () => {
  const Component = React.memo(function Component() {
    return <p>test</p>;
  });
  const StyledComponent = styled(Component)``;

  const { renderCount } = perf(React);

  render(<StyledComponent />);

  expect(renderCount.current).toEqual({
    Component: { value: 1 },
    'Styled(Component)': { value: 1 },
  });
});
