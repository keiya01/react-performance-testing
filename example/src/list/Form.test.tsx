import { render, screen, fireEvent } from '@testing-library/react';
import { perf, wait } from 'react-performance-testing';
import 'jest-performance-testing';
import { Form } from './Form';

test('should not re-render when input event is invoked', async () => {
  const { renderCount } = perf<{ Form: unknown }>();

  render(<Form onSubmit={jest.fn()} />);

  fireEvent.input(screen.getByRole('textbox'), { target: { value: 'test' } });

  await wait(() => expect(renderCount.current.Form).toBeRenderedTimes(1));
});
