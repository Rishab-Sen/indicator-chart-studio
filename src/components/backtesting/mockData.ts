import { CandleData } from './types';

export const generateMockData = (days: number = 90): CandleData[] => {
  const data: CandleData[] = [];
  let basePrice = 42000;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const volatility = Math.random() * 0.05;
    const trend = Math.random() > 0.5 ? 1 : -1;
    
    const open = basePrice + (Math.random() - 0.5) * basePrice * volatility;
    const close = open + trend * Math.random() * basePrice * volatility;
    const high = Math.max(open, close) + Math.random() * basePrice * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * basePrice * volatility * 0.5;
    const volume = Math.floor(Math.random() * 10000000) + 1000000;

    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    basePrice = close;
  }

  return data;
};

export const calculateSMA = (data: CandleData[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(data[i].close);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      sma.push(parseFloat((sum / period).toFixed(2)));
    }
  }
  return sma;
};

export const calculateEMA = (data: CandleData[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  let prevEma = data[0].close;
  ema.push(prevEma);
  
  for (let i = 1; i < data.length; i++) {
    const currentEma = (data[i].close - prevEma) * multiplier + prevEma;
    ema.push(parseFloat(currentEma.toFixed(2)));
    prevEma = currentEma;
  }
  
  return ema;
};

export const calculateRSI = (data: CandleData[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  rsi.push(50);
  
  for (let i = period; i < data.length; i++) {
    const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
    }
  }
  
  while (rsi.length < data.length) {
    rsi.unshift(50);
  }
  
  return rsi;
};
