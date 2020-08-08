import { PerfTools } from "./types";
import { getDisplayName } from "./getDisplayName";

const isClassComponent = (
  Component: React.ComponentClass | React.FunctionComponent,
): Component is React.ComponentClass =>
  Component.prototype && !!Component.prototype.isReactComponent;

const createFunctionComponent = (
  type: React.FunctionComponent,
  { renderCount }: PerfTools,
) => {
  const FunctionComponent = type as (...args: any[]) => React.ReactElement;
  const PatchedComponent = (...args: any) => {
    const counter = renderCount.current;
    const count = counter[getDisplayName(type)];
    renderCount.current[getDisplayName(type)] = count ? count + 1 : 1;
    return FunctionComponent(...args);
  };
  return PatchedComponent;
};

export const createPatchedComponent = (type: React.ComponentClass | React.FunctionComponent, tools: PerfTools) => {
  if (isClassComponent(type)) {
    return type;
  }

  if(typeof type === 'function') {
    return createFunctionComponent(type, tools);
  }

  return type;
}
