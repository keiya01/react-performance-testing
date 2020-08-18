import * as extensions from './matchers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeUpdatedWithin(expected: number | number[]): R;
      toBeMounted(): R;
      toBeMountedWithin(expected?: number): R;
      toBeRenderedTimes(expected?: number): R;
    }
  }
}

expect.extend(extensions);
