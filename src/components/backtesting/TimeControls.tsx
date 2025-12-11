import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { TimeInterval, TimeRange } from './types';
import { format } from 'date-fns';

interface TimeControlsProps {
  interval: TimeInterval;
  timeRange: TimeRange;
  onIntervalChange: (interval: TimeInterval) => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

const intervals: { value: TimeInterval; label: string }[] = [
  { value: '1m', label: '1 Min' },
  { value: '5m', label: '5 Min' },
  { value: '15m', label: '15 Min' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: '1M', label: '1 Month' },
];

export const TimeControls = ({
  interval,
  timeRange,
  onIntervalChange,
  onTimeRangeChange,
}: TimeControlsProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Interval:</span>
        <Select value={interval} onValueChange={(v) => onIntervalChange(v as TimeInterval)}>
          <SelectTrigger className="w-[100px] h-8 bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {intervals.map((int) => (
              <SelectItem key={int.value} value={int.value}>
                {int.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">From:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 bg-secondary border-border">
              {format(timeRange.start, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
            <CalendarComponent
              mode="single"
              selected={timeRange.start}
              onSelect={(date) => date && onTimeRangeChange({ ...timeRange, start: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">To:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 bg-secondary border-border">
              {format(timeRange.end, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
            <CalendarComponent
              mode="single"
              selected={timeRange.end}
              onSelect={(date) => date && onTimeRangeChange({ ...timeRange, end: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
