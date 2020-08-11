import { cleanup } from '../perf';

test('should not throw error else if cleanup is invoked before invoke perf()', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  cleanup();

  expect(console.warn).toBeCalledTimes(1);

  // @ts-ignore
  console.warn.mockRestore();
});
