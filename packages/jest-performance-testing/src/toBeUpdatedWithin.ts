import { matcherHint } from 'jest-matcher-utils';
import { RenderTimeField } from '../../react-performance-testing/types';
import { isNotMounted } from './errorMessage';

export function toBeUpdatedWithin(
  this: jest.MatcherUtils,
  received: RenderTimeField | undefined,
  expected: number | number[],
) {
  if (!received) {
    return isNotMounted();
  }

  if (!received.updates) {
    return {
      pass: false,
      message: () =>
        'You need to pass Component property like `expect(renderTime.current.Component).toBeUpdatedWithin(...)`',
    };
  }

  const { updates } = received;
  const formattedExpected = Array.isArray(expected)
    ? expected
    : Array(updates.length).fill(expected);

  const pass = updates.every((num, i) => num < formattedExpected[i]);

  const message = () => {
    return [
      matcherHint('toBeUpdatedWithin', undefined, undefined, {
        isNot: this.isNot,
      }),
      `Expected: [${formattedExpected.join(', ')}]`,
      `Received: [${updates.join(', ')}]`,
    ].join('\n');
  };

  return { pass, message };
}
