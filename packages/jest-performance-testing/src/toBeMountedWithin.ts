import { RenderTimeField } from '../../react-performance-testing/src/types';
import { matcherHint } from 'jest-matcher-utils';
import { isNotMounted } from './errorMessage';

export function toBeMountedWithin(
  this: jest.MatcherUtils,
  received: RenderTimeField | undefined,
  expected: number,
) {
  if (!received) {
    return isNotMounted();
  }

  const pass = received.mount < expected;
  const message = () => {
    return [
      matcherHint('toBeMountedWithin', undefined, undefined, {
        isNot: this.isNot,
      }),
      `Expected: ${expected}`,
      `Received: ${received.mount}`,
    ].join('\n');
  };

  return {
    pass,
    message,
  };
}
