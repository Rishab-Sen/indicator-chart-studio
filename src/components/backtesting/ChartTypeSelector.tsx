import { CandlestickChart, LineChart, AreaChart } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChartType } from './types';
import { cn } from '@/lib/utils';

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const chartTypes: { value: ChartType; icon: React.ReactNode; label: string }[] = [
  { value: 'candlestick', icon: <CandlestickChart className="w-4 h-4" />, label: 'Candlestick' },
  { value: 'line', icon: <LineChart className="w-4 h-4" />, label: 'Line' },
  { value: 'area', icon: <AreaChart className="w-4 h-4" />, label: 'Area' },
];

export const ChartTypeSelector = ({ chartType, onChartTypeChange }: ChartTypeSelectorProps) => {
  return (
    <ToggleGroup
      type="single"
      value={chartType}
      onValueChange={(value) => value && onChartTypeChange(value as ChartType)}
      className="bg-secondary/50 rounded-lg p-1"
    >
      {chartTypes.map((type) => (
        <ToggleGroupItem
          key={type.value}
          value={type.value}
          aria-label={type.label}
          className={cn(
            "px-3 py-2 gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            "transition-all duration-200"
          )}
        >
          {type.icon}
          <span className="text-sm hidden sm:inline">{type.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
