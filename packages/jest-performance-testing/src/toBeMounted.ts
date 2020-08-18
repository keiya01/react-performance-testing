import { RenderCountField } from '../../react-performance-testing/src/types';
import { isNotMounted } from './errorMessage';

export function toBeMounted(
  this: jest.MatcherUtils,
  received: RenderCountField | undefined,
) {
  if (!received) {
    return isNotMounted();
  }

  return {
    pass: true,
    message: () => 'Specified component could be found.',
  };
}
