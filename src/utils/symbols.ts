/**
 * Copied from ReactSymbols.js
 * https://github.com/facebook/react/blob/master/packages/shared/ReactSymbols.js
 */

export type ReactSymbol = Symbol | number;

export const REACT_MEMO_TYPE: ReactSymbol = Symbol.for('react.memo');
export const REACT_FORWARD_REF_TYPE: ReactSymbol = Symbol.for(
  'react.forward_ref',
);
