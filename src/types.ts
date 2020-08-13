export interface RenderCountField {
  value: number;
}

export interface RenderTimeField {
  mount: number;
  updates: number[];
}

export interface PerfTools {
  renderCount: {
    current: Record<string, RenderCountField | RenderCountField[]>;
  };
  renderTime: {
    current: Record<string, RenderTimeField | RenderTimeField[]>;
  };
}

export interface PerfState {
  hasRenderCount: boolean;
  hasRenderTime: boolean;
  renderCount?: boolean;
  renderTime?: boolean;
}
