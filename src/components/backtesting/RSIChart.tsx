import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CandleData } from './types';
import { calculateRSI } from './mockData';
import { useMemo } from 'react';

interface RSIChartProps {
  data: CandleData[];
}

export const RSIChart = ({ data }: RSIChartProps) => {
  const chartData = useMemo(() => {
    const rsi = calculateRSI(data, 14);
    return data.map((candle, i) => ({
      time: candle.time,
      rsi: rsi[i],
    }));
  }, [data]);

  return (
    <div className="chart-container h-[150px] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">RSI (14)</span>
        <span className="text-xs font-mono text-foreground">
          {chartData[chartData.length - 1]?.rsi.toFixed(2)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" opacity={0.5} />
          <XAxis
            dataKey="time"
            stroke="hsl(215, 20%, 55%)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            hide
          />
          <YAxis
            domain={[0, 100]}
            stroke="hsl(215, 20%, 55%)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            ticks={[30, 50, 70]}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 47%, 10%)',
              border: '1px solid hsl(222, 30%, 18%)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(215, 20%, 55%)' }}
          />
          <ReferenceLine y={70} stroke="hsl(0, 72%, 51%)" strokeDasharray="3 3" opacity={0.5} />
          <ReferenceLine y={30} stroke="hsl(142, 71%, 45%)" strokeDasharray="3 3" opacity={0.5} />
          <Line
            type="monotone"
            dataKey="rsi"
            stroke="hsl(142, 71%, 45%)"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
