import * as extensions from './matchers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toIncludeUpdates(expected: number | number[]): R;
      toMount(expected?: number): R;
    }
  }
}

expect.extend(extensions);
