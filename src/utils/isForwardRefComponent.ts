import { ReactSymbol, REACT_FORWARD_REF_TYPE } from './symbols';

export const isForwardRefComponent = (
  Component: React.ReactType & { $$typeof: ReactSymbol },
) => Component.$$typeof === REACT_FORWARD_REF_TYPE;
