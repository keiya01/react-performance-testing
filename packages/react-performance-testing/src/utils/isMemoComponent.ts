import { ReactSymbol, REACT_MEMO_TYPE } from './symbols';

export const isMemoComponent = (
  Component: React.ElementType<
    React.ComponentClass | React.FunctionComponent
  > & { $$typeof: ReactSymbol },
): Component is React.MemoExoticComponent<any> & {
  compare: (state: any, props: any) => boolean;
} => Component.$$typeof === REACT_MEMO_TYPE;
