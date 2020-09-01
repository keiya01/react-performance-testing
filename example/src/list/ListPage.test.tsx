import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { perf, wait } from 'react-performance-testing';
import 'jest-performance-testing';
import { ListPage } from './ListPage';

test('should not re-render Form component when list is appended', async () => {
  const { renderCount } = perf<{ ListPage: unknown; Form: unknown }>(React);

  render(<ListPage />);

  fireEvent.click(screen.getByRole('textbox'), { target: { value: 'test' } });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  await wait(() => expect(renderCount.current.Form).toBeRenderedTimes(1));
});
