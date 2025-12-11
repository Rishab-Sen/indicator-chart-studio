export type TimeInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';

export type ChartType = 'candlestick' | 'line' | 'area';

export type IndicatorType = 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB' | 'VWAP';

export interface Indicator {
  id: string;
  type: IndicatorType;
  enabled: boolean;
  period?: number;
  color?: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartSettings {
  type: ChartType;
  interval: TimeInterval;
  timeRange: TimeRange;
  indicators: Indicator[];
}
