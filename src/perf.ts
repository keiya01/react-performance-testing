import { PerfTools } from './types';
import { getPatchedComponent } from './getPatchedComponent';
import { getDisplayName } from './getDisplayName';
import { isClassComponent } from './isClassComponent';

const shouldObserve = (
  component: any,
): component is React.ComponentClass | React.FunctionComponent =>
  isClassComponent(component) || typeof component === 'function';

export const perf = (React: any) => {
  const renderCount: { current: Record<string, any> } = { current: {} };

  const origCreateElement = React.createElement;
  const origCreateFactory = React.createFactory;
  const origCloneElement = React.cloneElement;

  // @ts-ignore
  React.createElement = (type: React.ElementType, ...rest: any) => {
    if (!shouldObserve(type)) {
      return origCreateElement.apply(React, [type, ...rest]);
    }

    const PatchedComponent = getPatchedComponent(type, { renderCount });

    try {
      // @ts-ignore
      PatchedComponent.displayName = getDisplayName(type);
    } catch (e) {}

    return origCreateElement.apply(React, [PatchedComponent, ...rest]);
  };

  Object.assign(React.createElement, origCreateElement);

  // @ts-ignore
  React.createFactory = (type: React.ElementType) => {
    const factory = React.createElement.bind(null, type);
    // @ts-ignore
    factory.type = type;
    return factory;
  };

  Object.assign(React.createFactory, origCreateFactory);

  // @ts-ignore
  React.cloneElement = (...args: any) => {
    const element = origCloneElement.apply(React, args);
    return element;
  };

  Object.assign(React.cloneElement, origCloneElement);

  return { renderCount } as PerfTools;
};
