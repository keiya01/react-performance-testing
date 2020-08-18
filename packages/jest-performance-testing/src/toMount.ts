import {
  RenderTimeField,
  RenderCountField,
} from '../../react-performance-testing/src/types';
import { matcherHint } from 'jest-matcher-utils';

const isUndefined = <T>(val?: T): val is undefined => val === undefined;

const isRenderTimeField = (
  field: (RenderCountField | RenderTimeField) & Object,
): field is RenderTimeField =>
  field.hasOwnProperty('mount') && field.hasOwnProperty('updates');

const compareMountTime = (field: RenderTimeField, mount: number) => {
  return field.mount < mount;
};

export function toMount(
  this: jest.MatcherUtils,
  received: RenderCountField | RenderTimeField | undefined,
  expected?: number,
) {
  if (!received) {
    return {
      pass: false,
      message: () =>
        'Specified component could not be found. It is possible to be not mounted or to be a typo.',
    };
  }

  if (isRenderTimeField(received) && !isUndefined(expected)) {
    const pass = compareMountTime(received, expected);
    const message = () => {
      return [
        matcherHint('toMount', undefined, undefined, {
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

  if (!isUndefined(expected)) {
    console.warn(
      '[react-performance-testing] Probably you are passing renderCount. If you want to test mount time, you need to pass renderTime.',
    );
  }

  return {
    pass: true,
    message: () => 'Specified component could be found.',
  };
}
