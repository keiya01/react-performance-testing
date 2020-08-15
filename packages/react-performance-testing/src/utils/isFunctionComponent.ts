export const isFunctionComponent = (
  type: React.ElementType<React.ComponentClass | React.FunctionComponent>,
): type is React.FunctionComponent => typeof type === 'function';
