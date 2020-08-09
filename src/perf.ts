import { PerfTools } from './types';
import { getPatchedComponent } from './getPatchedComponent';
import { shouldTrack } from './utils/shouldTrack';

export const perf = (React: any) => {
  const renderCount: { current: Record<string, any> } = { current: {} };

  const origCreateElement = React.createElement;
  const origCreateFactory = React.createFactory;
  const origCloneElement = React.cloneElement;

  // memorize MemoComponent
  const componentsMap = new WeakMap();

  // @ts-ignore
  React.createElement = (type: React.ElementType, ...rest: any) => {
    if (!shouldTrack(type)) {
      return origCreateElement.apply(React, [type, ...rest]);
    }

    let PatchedComponent: any;

    if (componentsMap.has(type)) {
      PatchedComponent = componentsMap.get(type);
    } else {
      PatchedComponent = getPatchedComponent(
        componentsMap,
        type,
        { renderCount },
        React,
      );
    }

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
