import { ReactSymbol, REACT_MEMO_TYPE } from './symbols';

export const isMemoComponent = (
  Component: React.ReactType & { $$typeof: ReactSymbol },
): Component is React.MemoExoticComponent<any> & { compare: any } =>
  Component.$$typeof === REACT_MEMO_TYPE;
