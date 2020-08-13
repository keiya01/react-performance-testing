import { PerfTools, PerfState } from './types';
import { getPatchedComponent } from './getPatchedComponent';
import { shouldTrack } from './utils/shouldTrack';

let origCreateElement: any = null;
let origCreateFactory: any = null;
let origCloneElement: any = null;
let origReact: any = null;

export const perf = (React: any) => {
  const renderCount: PerfTools['renderCount'] = {
    current: {},
  };
  const renderTime: PerfTools['renderTime'] = {
    current: {},
  };

  const perfState: PerfState = {
    hasRenderCount: !Proxy,
    hasRenderTime: !Proxy,
  };

  Object.defineProperties(perfState, {
    renderCount: {
      set(val: boolean) {
        this.hasRenderCount = val;
      },
    },
    renderTime: {
      set(val: boolean) {
        this.hasRenderTime = val;
      },
    },
  });

  origReact = React;
  origCreateElement = React.createElement;
  origCreateFactory = React.createFactory;
  origCloneElement = React.cloneElement;

  // store memorized Component
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
        { renderCount, renderTime },
        perfState,
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

  const tools: PerfTools = { renderCount, renderTime };

  return window.Proxy
    ? new Proxy<PerfTools>(tools, {
        get: (target, prop: keyof PerfTools) => {
          perfState[prop] = true;
          return target[prop];
        },
      })
    : tools;
};

export const cleanup = () => {
  if (!origReact) {
    return;
  }

  Object.assign(origReact, {
    createElement: origCreateElement,
    createFactory: origCreateFactory,
    cloneElement: origCloneElement,
  });

  origReact = null;
  origCreateElement = null;
  origCreateFactory = null;
  origCloneElement = null;
};
