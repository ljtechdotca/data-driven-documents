export interface Options {
  width: number;
  height: number;
  gap: number;
}

export interface Headers {
  x: string;
  y: string;
}

export interface PlotDimensions {
  width: number;
  height: number;
  margin: [number, number, number, number];
}

export interface PieDimensions {
  innerRadius: number;
  outerRadius: number;
  margin: [number, number, number, number];
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
