import { DefaultPerfToolsField } from '../types';
import { getPatchedComponent } from './getPatchedComponent';
import { shouldTrack } from './utils/shouldTrack';
import { store, getPerfTools, getDefaultStore } from './store';

let origCreateElement: any = null;
let origCreateFactory: any = null;
let origCloneElement: any = null;
let origReact: any = null;

export const perf = <T = DefaultPerfToolsField>(React?: any) => {
  if (!React) {
    return getPerfTools<T>();
  }

  const { tools, perfState, componentsMap } = store;

  origReact = React;
  origCreateElement = React.createElement;
  origCreateFactory = React.createFactory;
  origCloneElement = React.cloneElement;

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

  return getPerfTools<T>();
};

export const cleanup = () => {
  Object.assign(store, getDefaultStore());

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
