import { Activity, TrendingUp, BarChart3, Waves, Target, LineChart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Indicator, IndicatorType } from './types';
import { cn } from '@/lib/utils';

interface IndicatorPanelProps {
  indicators: Indicator[];
  onToggleIndicator: (id: string) => void;
}

const indicatorInfo: Record<IndicatorType, { name: string; description: string; icon: React.ReactNode; color: string }> = {
  SMA: {
    name: 'Simple Moving Average',
    description: 'Trend following indicator',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-primary',
  },
  EMA: {
    name: 'Exponential Moving Average',
    description: 'Weighted trend indicator',
    icon: <LineChart className="w-4 h-4" />,
    color: 'text-warning',
  },
  RSI: {
    name: 'Relative Strength Index',
    description: 'Momentum oscillator',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-success',
  },
  MACD: {
    name: 'MACD',
    description: 'Trend & momentum',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'text-destructive',
  },
  BB: {
    name: 'Bollinger Bands',
    description: 'Volatility indicator',
    icon: <Waves className="w-4 h-4" />,
    color: 'text-purple-400',
  },
  VWAP: {
    name: 'VWAP',
    description: 'Volume weighted price',
    icon: <Target className="w-4 h-4" />,
    color: 'text-orange-400',
  },
};

export const IndicatorPanel = ({ indicators, onToggleIndicator }: IndicatorPanelProps) => {
  return (
    <div className="glass-panel p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        Indicators
      </h3>
      
      <div className="space-y-2">
        {indicators.map((indicator) => {
          const info = indicatorInfo[indicator.type];
          return (
            <div
              key={indicator.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                indicator.enabled ? "bg-accent/50" : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-1.5 rounded-md bg-background/50", info.color)}>
                  {info.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{indicator.type}</span>
                    {indicator.period && (
                      <Badge variant="secondary" className="text-xs font-mono">
                        {indicator.period}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
              </div>
              <Switch
                checked={indicator.enabled}
                onCheckedChange={() => onToggleIndicator(indicator.id)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
