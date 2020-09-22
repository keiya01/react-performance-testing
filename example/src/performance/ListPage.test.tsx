import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { perf, wait } from 'react-performance-testing';
import 'jest-performance-testing';
import { ListPage } from '../list/ListPage';

test('should render within specified time', async () => {
  const { renderTime } = perf<{ ListPage: unknown; List: unknown }>(React);

  render(<ListPage />);

  fireEvent.input(screen.getByRole('textbox'), {
    target: { value: 'test' },
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await wait(() => {
    expect(renderTime.current.ListPage).toBeMountedWithin(18);
    expect(renderTime.current.ListPage).toBeUpdatedWithin(18);
  });
});
