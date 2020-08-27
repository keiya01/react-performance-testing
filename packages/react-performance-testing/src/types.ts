export interface RenderCountField {
  value: number;
}

export interface RenderTimeField {
  mount: number;
  updates: number[];
}

export type DefaultPerfToolsField = Record<string, any>;

export type PerfToolsMutation<T, U> = {
  [K in keyof T]: T[K] extends unknown[]
    ? U[]
    : U extends unknown
    ? U
    : U | U[] | undefined;
};

export interface PerfTools<T = DefaultPerfToolsField> {
  renderCount: {
    current: PerfToolsMutation<T, RenderCountField>;
  };
  renderTime: {
    current: PerfToolsMutation<T, RenderTimeField>;
  };
}

export interface PerfState {
  hasRenderCount: boolean;
  hasRenderTime: boolean;
  renderCount?: boolean;
  renderTime?: boolean;
}
