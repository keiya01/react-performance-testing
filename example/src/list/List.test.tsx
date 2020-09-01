import React from 'react';
import { render } from '@testing-library/react';
import { perf, wait } from 'react-performance-testing';
import 'jest-performance-testing';
import { List } from './List';

test('should not render other Item when item is appended', async () => {
  const { renderCount } = perf<{ List: unknown; Item: unknown[] }>(React);

  const { rerender } = render(<List list={['test1', 'test2']} />);
  rerender(<List list={['test1', 'test2', 'test3']} />);

  await wait(() => {
    expect(renderCount.current.Item[0]).toBeRenderedTimes(1);
    expect(renderCount.current.Item[1]).toBeRenderedTimes(1);
    expect(renderCount.current.Item[2]).toBeRenderedTimes(1);
  });
});
