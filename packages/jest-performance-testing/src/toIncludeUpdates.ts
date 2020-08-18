import { matcherHint } from 'jest-matcher-utils';
import { RenderTimeField } from '../../react-performance-testing/src/types';

export function toIncludeUpdates(
  this: jest.MatcherUtils,
  received: RenderTimeField | undefined,
  expected: number | number[],
) {
  if (!received) {
    return {
      pass: false,
      message: () =>
        'Specified component could not be found. It is possible to be not mounted or to be a typo.',
    };
  }

  if (!received.updates) {
    return {
      pass: false,
      message: () =>
        'You need to pass Component property like `expect(renderTime.current.Component).toIncludeUpdates(...)`',
    };
  }

  const { updates } = received;
  const formattedExpected = Array.isArray(expected)
    ? expected
    : Array(updates.length).fill(expected);

  const pass = updates.every((num, i) => num < formattedExpected[i]);

  const message = () => {
    return [
      matcherHint('toIncludeUpdates', undefined, undefined, {
        isNot: this.isNot,
      }),
      `Expected: [${formattedExpected.join(', ')}]`,
      `Received: [${updates.join(', ')}]`,
    ].join('\n');
  };

  return { pass, message };
}
