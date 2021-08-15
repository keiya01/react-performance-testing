/* eslint-disable*/
const jsxDevRuntime = require('react/jsx-dev-runtime');
const React = require('react');
const {
  __getPatchedComponent,
  __store,
  __shouldTrack,
} = require('react-performance-testing');

const origJsxDev = jsxDevRuntime.jsxDEV;

module.exports = jsxDevRuntime;
module.exports.jsxDEV = function jsxDEV() {
  const { tools, perfState, componentsMap } = __store;

  const args = Array.prototype.slice.call(arguments);

  const origType = args[0];
  const rest = args.slice(1);

  if (!__shouldTrack(origType)) {
    return origJsxDev.apply(null, [origType, ...rest]);
  }

  let PatchedComponent;

  if (componentsMap.has(origType)) {
    PatchedComponent = componentsMap.get(origType);
  } else {
    PatchedComponent = __getPatchedComponent(
      componentsMap,
      origType,
      tools,
      perfState,
      React,
    );
  }

  const element = origJsxDev.apply(null, [PatchedComponent, ...rest]);
  return element;
};
