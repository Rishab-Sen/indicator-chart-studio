import { useState, useMemo } from 'react';
import { Play, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeControls } from './TimeControls';
import { IndicatorPanel } from './IndicatorPanel';
import { ChartTypeSelector } from './ChartTypeSelector';
import { PriceChart } from './PriceChart';
import { RSIChart } from './RSIChart';
import { StatsPanel } from './StatsPanel';
import { generateMockData } from './mockData';
import { ChartSettings, Indicator, TimeInterval, TimeRange, ChartType } from './types';
import { toast } from 'sonner';

const defaultIndicators: Indicator[] = [
  { id: 'sma', type: 'SMA', enabled: true, period: 20 },
  { id: 'ema', type: 'EMA', enabled: false, period: 12 },
  { id: 'rsi', type: 'RSI', enabled: true, period: 14 },
  { id: 'macd', type: 'MACD', enabled: false },
  { id: 'bb', type: 'BB', enabled: false, period: 20 },
  { id: 'vwap', type: 'VWAP', enabled: false },
];

export const BacktestingDashboard = () => {
  const [settings, setSettings] = useState<ChartSettings>({
    type: 'area',
    interval: '1d',
    timeRange: {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    indicators: defaultIndicators,
  });

  const [isRunning, setIsRunning] = useState(false);

  const data = useMemo(() => generateMockData(90), []);

  const handleIntervalChange = (interval: TimeInterval) => {
    setSettings({ ...settings, interval });
  };

  const handleTimeRangeChange = (timeRange: TimeRange) => {
    setSettings({ ...settings, timeRange });
  };

  const handleChartTypeChange = (type: ChartType) => {
    setSettings({ ...settings, type });
  };

  const handleToggleIndicator = (id: string) => {
    setSettings({
      ...settings,
      indicators: settings.indicators.map((ind) =>
        ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
      ),
    });
  };

  const handleRunBacktest = () => {
    setIsRunning(true);
    toast.success('Backtest started!', {
      description: 'Processing historical data...',
    });
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Backtest complete!', {
        description: 'Results are ready for analysis.',
      });
    }, 2000);
  };

  const rsiEnabled = settings.indicators.find(ind => ind.type === 'RSI')?.enabled;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Backtest<span className="text-primary">Pro</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced trading strategy backtesting platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => toast.info('Refreshing data...')}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button
              size="sm"
              className="gap-2 glow-primary"
              onClick={handleRunBacktest}
              disabled={isRunning}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running...' : 'Run Backtest'}
            </Button>
          </div>
        </header>

        {/* Stats */}
        <StatsPanel data={data} />

        {/* Controls Bar */}
        <div className="glass-panel p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TimeControls
            interval={settings.interval}
            timeRange={settings.timeRange}
            onIntervalChange={handleIntervalChange}
            onTimeRangeChange={handleTimeRangeChange}
          />
          <ChartTypeSelector
            chartType={settings.type}
            onChartTypeChange={handleChartTypeChange}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Charts */}
          <div className="lg:col-span-3 space-y-4">
            <PriceChart
              data={data}
              chartType={settings.type}
              indicators={settings.indicators}
            />
            {rsiEnabled && <RSIChart data={data} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <IndicatorPanel
              indicators={settings.indicators}
              onToggleIndicator={handleToggleIndicator}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
