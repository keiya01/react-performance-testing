import { PerfTools, PerfState, DefaultPerfToolsField } from '../types';
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

export type Store = {
  tools: PerfTools;
  componentsMap: WeakMap<object, any>;
  perfState: PerfState;
};

export const getDefaultStore = () => ({
  tools: {
    renderCount: { current: {} },
    renderTime: { current: {} },
  },
  componentsMap: new WeakMap(),
  perfState: Object.defineProperties(
    {
      hasRenderCount: !Proxy,
      hasRenderTime: !Proxy,
    },
    {
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
    },
  ),
});

export const store: Store = getDefaultStore();

export const getPerfTools = <T extends DefaultPerfToolsField>() =>
  new Proxy(store.tools, {
    get: (target, prop: keyof PerfTools) => {
      checkRenderTimeDeclaring(prop);
      store.perfState[prop] = true;
      return target[prop];
    },
  }) as PerfTools<T>;
