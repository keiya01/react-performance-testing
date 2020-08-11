export interface RenderCountField {
  value: number;
}

export interface PerfTools {
  renderCount: {
    current: Record<string, RenderCountField | RenderCountField[]>;
  };
}
