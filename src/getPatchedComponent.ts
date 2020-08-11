import { PerfTools } from './types';
import { getDisplayName } from './getDisplayName';
import { isClassComponent } from './utils/isClassComponent';
import { isMemoComponent } from './utils/isMemoComponent';
import { ReactSymbol } from './utils/symbols';
import { isForwardRefComponent } from './utils/isForwardRefComponent';
import { isFunctionComponent } from './utils/isFunctionComponent';

const setArray = (
  type: React.ElementType<React.ComponentClass | React.FunctionComponent>,
  renderCount: PerfTools['renderCount'],
) => {
  const displayName = getDisplayName(type);
  const obj = renderCount.current[displayName];
  let currentIndex = -1;
  if (obj) {
    renderCount.current[displayName] = Array.isArray(obj)
      ? [...obj, { value: 0 }]
      : [{ ...obj }, { value: 0 }];

    currentIndex = Array.isArray(obj) ? obj.length : 1;
  }
  return currentIndex;
};

const updateRenderCount = (
  renderCount: PerfTools['renderCount'],
  type: React.ElementType,
  index: number,
) => {
  const displayName = getDisplayName(type);
  if (!displayName) {
    console.warn(
      "You have anonymous component. If your component don't have display name, we can not set property to renderCount.current",
    );
  }

  const obj = renderCount.current;
  const field = obj[displayName];

  if (Array.isArray(field)) {
    const formattedIndex = index === -1 ? 0 : index;
    field[formattedIndex].value += 1;
    return;
  }

  if (field) {
    field.value += 1;
  } else {
    obj[displayName] = { value: 1 };
  }
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
      this.currentIndex = setArray(type, renderCount);

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
      updateRenderCount(renderCount, type, this.currentIndex);
      return super.render ? super.render() : null;
    }
  }

  return _PatchedClassComponent;
};

const createFunctionComponent = (
  type: React.FunctionComponent,
  { renderCount }: PerfTools,
  React: any,
) => {
  const FunctionComponent = type as (...args: any[]) => React.ReactElement;
  const PatchedFunctionComponent = (...args: any) => {
    const currentIndex = React.useMemo(() => setArray(type, renderCount), []);
    updateRenderCount(renderCount, type, currentIndex);
    return FunctionComponent(...args);
  };
  return PatchedFunctionComponent;
};

const createMemoComponent = (
  type: React.MemoExoticComponent<any> & {
    compare: (state: any, props: any) => boolean;
  },
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
    : createFunctionComponent(WrappedFunctionalComponent, tools, React);

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

const createForwardRefComponent = (
  type: React.ForwardRefExoticComponent<any> & {
    render: React.ForwardRefRenderFunction<any>;
  },
  tools: PerfTools,
  React: any,
): any => {
  const { render: InnerForwardRefComponent } = type;

  const isInnerMemoComponent = isMemoComponent(InnerForwardRefComponent as any);

  const WrappedFunctionalComponent = isInnerMemoComponent
    ? (InnerForwardRefComponent as any).type
    : InnerForwardRefComponent;

  const PatchedInnerComponent = createFunctionComponent(
    WrappedFunctionalComponent,
    tools,
    React,
  );

  try {
    // @ts-ignore
    PatchedInnerComponent.displayName = getDisplayName(
      WrappedFunctionalComponent,
    );
  } catch (e) {}

  const PatchedForwardRefComponent = React.forwardRef(
    isInnerMemoComponent
      ? React.memo(PatchedInnerComponent, WrappedFunctionalComponent.compare)
      : PatchedInnerComponent,
  );

  return PatchedForwardRefComponent;
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
    return createForwardRefComponent(type, tools, React);
  }

  if (isClassComponent(type)) {
    return createClassComponent(type, tools);
  }

  if (isFunctionComponent(type)) {
    return createFunctionComponent(type, tools, React);
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
