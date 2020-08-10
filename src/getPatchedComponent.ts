import { PerfTools } from './types';
import { getDisplayName } from './getDisplayName';
import { isClassComponent } from './utils/isClassComponent';
import { isMemoComponent } from './utils/isMemoComponent';
import { ReactSymbol } from './utils/symbols';
import { isForwardRefComponent } from './utils/isForwardRefComponent';
import { isFunctionComponent } from './utils/isFunctionComponent';

const updateRenderCount = (
  renderCount: PerfTools['renderCount'],
  type: React.ElementType,
) => {
  const counter = renderCount.current;
  const count = counter[getDisplayName(type)];
  renderCount.current[getDisplayName(type)] = count ? count + 1 : 1;
};

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

const createMemoComponent = (
  type: React.MemoExoticComponent<any> & { compare: any },
  tools: PerfTools,
  React: any,
): any => {
  const { type: InnerMemoComponent } = type;

  const isInnerForwardRefComponent = isForwardRefComponent(InnerMemoComponent);

  const WrappedFunctionalComponent = isInnerForwardRefComponent
    ? InnerMemoComponent.render
    : InnerMemoComponent;

  const PatchedInnerComponent = isClassComponent(InnerMemoComponent)
    ? createClassComponent(WrappedFunctionalComponent, tools)
    : isMemoComponent(InnerMemoComponent)
    ? createMemoComponent(WrappedFunctionalComponent, tools, React)
    : createFunctionComponent(WrappedFunctionalComponent, tools);

  try {
    // @ts-ignore
    PatchedInnerComponent.displayName = getDisplayName(
      WrappedFunctionalComponent,
    );
  } catch (e) {}

  const PatchedMemoComponent = React.memo(
    isInnerForwardRefComponent
      ? React.forwardRef(PatchedInnerComponent)
      : PatchedInnerComponent,
    type.compare,
  );

  return PatchedMemoComponent;
};

const createPatchedComponent = (
  type: React.ElementType<React.ComponentClass | React.FunctionComponent> & {
    $$typeof: ReactSymbol;
  },
  tools: PerfTools,
  React: any,
): any => {
  if (isMemoComponent(type)) {
    return createMemoComponent(type, tools, React);
  }

  if (isForwardRefComponent(type)) {
    // TODO: support forwardRefComponent
    return type;
  }

  if (isClassComponent(type)) {
    return createClassComponent(type, tools);
  }

  if (isFunctionComponent(type)) {
    return createFunctionComponent(type, tools);
  }

  return type;
};

export const getPatchedComponent = (
  componentsMap: WeakMap<any, any>,
  type: React.ElementType<React.ComponentClass | React.FunctionComponent> & {
    $$typeof: ReactSymbol;
  },
  tools: PerfTools,
  React: any,
) => {
  const PatchedComponent = createPatchedComponent(type, tools, React);

  try {
    // @ts-ignore
    PatchedComponent.displayName = getDisplayName(type);
  } catch (e) {}

  componentsMap.set(type, PatchedComponent);

  return PatchedComponent;
};
