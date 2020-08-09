import { isClassComponent } from './isClassComponent';
import { isMemoComponent } from './isMemoComponent';
import { isForwardRefComponent } from './isForwardRefComponent';
import { ReactSymbol } from './symbols';

export const shouldTrack = (
  component: any,
): component is React.ReactType & { $$typeof: ReactSymbol } & (
    | React.ComponentClass
    | React.FunctionComponent
  ) =>
  isClassComponent(component) ||
  isMemoComponent(component) ||
  isForwardRefComponent(component) ||
  typeof component === 'function';
