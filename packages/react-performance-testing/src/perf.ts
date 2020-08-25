import { PerfTools, PerfState, DefaultPerfToolsField } from './types';
import { getPatchedComponent } from './getPatchedComponent';
import { shouldTrack } from './utils/shouldTrack';
import { globalOption } from './constants/globalOption';

const checkRenderTimeDeclaring = (prop: keyof PerfTools) => {
  if (prop === 'renderTime' && globalOption.isDeclaredRenderTime) {
    console.warn(
      '[react-performance-testing] You need to execute test one by one when you use `renderTime`. Please check here: https://github.com/keiya01/react-performance-testing#renderTime',
    );
  } else {
    globalOption.isDeclaredRenderTime = true;
  }
};

let origCreateElement: any = null;
let origCreateFactory: any = null;
let origCloneElement: any = null;
let origReact: any = null;

export const perf = <T = DefaultPerfToolsField>(React: any) => {
  const tools: PerfTools<T> = {
    renderCount: { current: {} },
    renderTime: { current: {} },
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
  React.createElement = function (type: React.ElementType, ...rest: any) {
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
        tools,
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

  return Proxy
    ? new Proxy(tools, {
        get: (target, prop: keyof PerfTools) => {
          checkRenderTimeDeclaring(prop);
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
