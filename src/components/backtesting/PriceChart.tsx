import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CandleData, ChartType, Indicator } from './types';
import { calculateSMA, calculateEMA, calculateRSI } from './mockData';
import { useMemo } from 'react';

interface PriceChartProps {
  data: CandleData[];
  chartType: ChartType;
  indicators: Indicator[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.close >= data.open;
    
    return (
      <div className="glass-panel p-3 space-y-1 text-sm">
        <p className="text-muted-foreground font-mono">{label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-mono text-foreground">${data.open?.toLocaleString()}</span>
          <span className="text-muted-foreground">High:</span>
          <span className="font-mono text-foreground">${data.high?.toLocaleString()}</span>
          <span className="text-muted-foreground">Low:</span>
          <span className="font-mono text-foreground">${data.low?.toLocaleString()}</span>
          <span className="text-muted-foreground">Close:</span>
          <span className={`font-mono ${isUp ? 'text-success' : 'text-destructive'}`}>
            ${data.close?.toLocaleString()}
          </span>
        </div>
        {data.sma20 && (
          <div className="pt-1 border-t border-border">
            <span className="text-muted-foreground">SMA(20): </span>
            <span className="font-mono text-primary">${data.sma20?.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const PriceChart = ({ data, chartType, indicators }: PriceChartProps) => {
  const chartData = useMemo(() => {
    const sma20 = calculateSMA(data, 20);
    const ema12 = calculateEMA(data, 12);
    const rsi14 = calculateRSI(data, 14);

    return data.map((candle, i) => ({
      ...candle,
      sma20: indicators.find(ind => ind.type === 'SMA' && ind.enabled) ? sma20[i] : undefined,
      ema12: indicators.find(ind => ind.type === 'EMA' && ind.enabled) ? ema12[i] : undefined,
      rsi: rsi14[i],
      candleColor: candle.close >= candle.open ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)',
    }));
  }, [data, indicators]);

  const minPrice = Math.min(...data.map(d => d.low)) * 0.995;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.005;

  const smaEnabled = indicators.find(ind => ind.type === 'SMA')?.enabled;
  const emaEnabled = indicators.find(ind => ind.type === 'EMA')?.enabled;

  return (
    <div className="chart-container h-[400px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" opacity={0.5} />
          <XAxis
            dataKey="time"
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />

          {chartType === 'area' && (
            <Area
              type="monotone"
              dataKey="close"
              stroke="hsl(187, 92%, 50%)"
              fill="url(#areaGradient)"
              strokeWidth={2}
            />
          )}

          {chartType === 'line' && (
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(187, 92%, 50%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(187, 92%, 50%)' }}
            />
          )}

          {chartType === 'candlestick' && (
            <>
              <Bar
                dataKey="high"
                fill="transparent"
                stroke="transparent"
              />
              {chartData.map((entry, index) => {
                const isUp = entry.close >= entry.open;
                return (
                  <ReferenceLine
                    key={`candle-${index}`}
                    segment={[
                      { x: entry.time, y: entry.low },
                      { x: entry.time, y: entry.high }
                    ]}
                    stroke={isUp ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'}
                    strokeWidth={1}
                  />
                );
              })}
              <Bar
                dataKey={(entry: any) => Math.abs(entry.close - entry.open)}
                stackId="candle"
                fill="hsl(142, 71%, 45%)"
                stroke="none"
              />
            </>
          )}

          {smaEnabled && (
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="hsl(187, 92%, 50%)"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="5 5"
            />
          )}

          {emaEnabled && (
            <Line
              type="monotone"
              dataKey="ema12"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={1.5}
              dot={false}
            />
          )}

          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(187, 92%, 50%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(187, 92%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
