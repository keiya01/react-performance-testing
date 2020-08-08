import React from 'react';
import { PerfTools } from './types';
import { createPatchedComponent } from './createPatchedComponent';

export const perf = () => {
  const renderCount: { current: Record<string, any> } = { current: {} };

  const origCreateElement = React.createElement;
  const origCreateFactory = React.createFactory;
  const origCloneElement = React.cloneElement;

  const componentsMap = new WeakMap();

  // @ts-ignore
  React.createElement = (type: React.ElementType, ...rest: any) => {
    if (!type || typeof type === 'string') {
      return origCreateElement.apply(React, [type, ...rest]);
    }

    if (componentsMap.has(type)) {
      return componentsMap.get(type);
    }

    const PatchedComponent = createPatchedComponent(type, { renderCount });

    componentsMap.set(type, PatchedComponent);

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
