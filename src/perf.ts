import React from 'react';

interface PerfTools {
  renderCount: {
    current: Record<string, number>;
  };
}

const isClassComponent = (
  Component: React.ComponentClass | React.FunctionComponent,
): Component is React.ComponentClass =>
  Component.prototype && !!Component.prototype.isReactComponent;

const getDisplayName = (type: any): any =>
  type.displayName ||
  type.name ||
  (type.type && getDisplayName(type.type)) ||
  (type.render && getDisplayName(type.render)) ||
  (typeof type === 'string' ? type : undefined);

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

const getPatchedComponent = (
  type: React.ComponentClass | React.FunctionComponent,
  tools: PerfTools,
) => {
  if (isClassComponent(type)) {
    return type;
  }

  return createFunctionComponent(type, tools);
};

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

    const PatchedComponent = getPatchedComponent(type, { renderCount });

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
