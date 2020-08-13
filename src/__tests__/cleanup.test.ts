import { cleanup } from '../perf';

test('should not throw error else if cleanup is invoked before invoke perf()', () => {
  expect(() => cleanup()).not.toThrow();
});
