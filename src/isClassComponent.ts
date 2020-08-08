export const isClassComponent = (
  Component: React.ComponentClass | React.FunctionComponent,
): Component is React.ComponentClass =>
  Component.prototype && !!Component.prototype.isReactComponent;
