import { matcherHint } from 'jest-matcher-utils';
import { RenderCountField } from '../../react-performance-testing/src/types';
import { isNotMounted } from './errorMessage';

export function toBeRenderedTimes(
  this: jest.MatcherUtils,
  received: RenderCountField | undefined,
  expected: number,
) {
  if (!received) {
    return isNotMounted();
  }

  const pass = received.value === expected;

  const message = () => {
    return [
      matcherHint('toBeRenderedTimes', undefined, undefined, {
        isNot: this.isNot,
      }),
      `Expected: ${expected}`,
      `Received: ${received.value}`,
    ].join('\n');
  };

  return {
    pass,
    message,
  };
}
