import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { CandleData } from './types';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  data: CandleData[];
}

export const StatsPanel = ({ data }: StatsPanelProps) => {
  const latestCandle = data[data.length - 1];
  const previousCandle = data[data.length - 2];
  
  const priceChange = latestCandle.close - previousCandle.close;
  const priceChangePercent = (priceChange / previousCandle.close) * 100;
  const isUp = priceChange >= 0;

  const high24h = Math.max(...data.slice(-30).map(d => d.high));
  const low24h = Math.min(...data.slice(-30).map(d => d.low));
  const avgVolume = data.slice(-30).reduce((acc, d) => acc + d.volume, 0) / 30;

  const stats = [
    {
      label: 'Current Price',
      value: `$${latestCandle.close.toLocaleString()}`,
      change: `${isUp ? '+' : ''}${priceChangePercent.toFixed(2)}%`,
      isUp,
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: '30D High',
      value: `$${high24h.toLocaleString()}`,
      icon: <TrendingUp className="w-4 h-4 text-success" />,
    },
    {
      label: '30D Low',
      value: `$${low24h.toLocaleString()}`,
      icon: <TrendingDown className="w-4 h-4 text-destructive" />,
    },
    {
      label: 'Avg Volume',
      value: `${(avgVolume / 1000000).toFixed(2)}M`,
      icon: <Activity className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className="glass-panel p-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-secondary">
              {stat.icon}
            </div>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold font-mono text-foreground">{stat.value}</span>
            {stat.change && (
              <span className={cn(
                "text-xs font-mono",
                stat.isUp ? "text-success" : "text-destructive"
              )}>
                {stat.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
