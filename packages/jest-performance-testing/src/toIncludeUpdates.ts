import { matcherHint } from 'jest-matcher-utils';
import { RenderTimeField } from '../../react-performance-testing/src/types';

export function toIncludeUpdates(
  this: jest.MatcherUtils,
  field: RenderTimeField | undefined,
  expected: number | number[],
) {
  if (!field) {
    return {
      pass: false,
      message: () =>
        'Specified component could not be found. It is possible to be not mounted or to be a typo.',
    };
  }

  if (!field.updates) {
    return {
      pass: false,
      message: () =>
        'You need to pass Component property like `expect(renderTime.current.Component).toIncludeUpdates(...)`',
    };
  }

  const { updates } = field;
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
