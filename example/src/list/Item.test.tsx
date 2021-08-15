import { render } from '@testing-library/react';
import { perf, wait } from 'react-performance-testing';
import 'jest-performance-testing';
import { Item } from './Item';

test('should render only once if item is not changed', async () => {
  const { renderCount } = perf<{ Item: unknown }>();

  const { rerender } = render(<Item item={'test'} />);
  rerender(<Item item={'test'} />);

  await wait(() => expect(renderCount.current.Item).toBeRenderedTimes(1));
});
