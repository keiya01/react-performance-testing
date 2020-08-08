import { PerfTools } from './types';
import { getDisplayName } from './getDisplayName';
import { isClassComponent } from './isClassComponent';

const updateRenderCount = (
  renderCount: PerfTools['renderCount'],
  type: React.ReactType,
) => {
  const counter = renderCount.current;
  const count = counter[getDisplayName(type)];
  renderCount.current[getDisplayName(type)] = count ? count + 1 : 1;
};

// TODO: extend type with React.Component
export interface PatchedClassComponent {}

const createClassComponent = (
  type: React.ComponentClass,
  { renderCount }: PerfTools,
): PatchedClassComponent => {
  const ClassComponent = type as new (...args: any) => any;

  class _PatchedClassComponent extends ClassComponent
    implements PatchedClassComponent {
    constructor(props: any, context: any) {
      super(props, context);

      const origRender = super.render || this.render;

      // this probably means render is an arrow function or this.render.bind(this) was called on the original class
      // https://github.com/welldone-software/why-did-you-render/blob/master/src/patches/patchClassComponent.js#L16
      const IsBoundFunction = origRender !== ClassComponent.prototype.render;
      if (IsBoundFunction) {
        this.render = () => {
          _PatchedClassComponent.prototype.render.apply(this);
          return origRender();
        };
      }
    }

    render() {
      updateRenderCount(renderCount, type);
      return super.render ? super.render() : null;
    }
  }

  return _PatchedClassComponent;
};

const createFunctionComponent = (
  type: React.FunctionComponent,
  { renderCount }: PerfTools,
) => {
  const FunctionComponent = type as (...args: any[]) => React.ReactElement;
  const PatchedFunctionComponent = (...args: any) => {
    updateRenderCount(renderCount, type);
    return FunctionComponent(...args);
  };
  return PatchedFunctionComponent;
};

export const getPatchedComponent = (
  type: React.ComponentClass | React.FunctionComponent,
  tools: PerfTools,
): any => {
  if (isClassComponent(type)) {
    return createClassComponent(type, tools);
  }

  if (typeof type === 'function') {
    return createFunctionComponent(type, tools);
  }

  return type;
};
