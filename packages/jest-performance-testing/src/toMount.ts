import {
  RenderTimeField,
  RenderCountField,
} from '../../react-performance-testing/src/types';

export function toMount(
  this: jest.MatcherUtils,
  received: RenderCountField | RenderTimeField | undefined,
) {
  return {
    pass: !!received,
    message: () =>
      this.isNot
        ? 'Specified component could be found.'
        : 'Specified component could not be found. It is possible to be not mounted or to be a typo.',
  };
}
