export const isClassComponent = (
  Component: React.ReactType & (React.ComponentClass | React.FunctionComponent),
): Component is React.ComponentClass =>
  Component.prototype && !!Component.prototype.isReactComponent;
