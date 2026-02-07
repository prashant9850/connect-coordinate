import { cn } from '@/lib/utils';
import type { SeverityLevel } from '@/types';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const severityConfig = {
  red: {
    label: 'Critical',
    bgClass: 'bg-severity-red-bg',
    textClass: 'text-severity-red',
    dotClass: 'bg-severity-red',
  },
  orange: {
    label: 'High',
    bgClass: 'bg-severity-orange-bg',
    textClass: 'text-severity-orange',
    dotClass: 'bg-severity-orange',
  },
  yellow: {
    label: 'Moderate',
    bgClass: 'bg-severity-yellow-bg',
    textClass: 'text-severity-yellow',
    dotClass: 'bg-severity-yellow',
  },
};

export function SeverityBadge({ 
  severity, 
  size = 'default', 
  showLabel = true,
  className 
}: SeverityBadgeProps) {
  const config = severityConfig[severity];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    default: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('rounded-full', config.dotClass, dotSizes[size])} />
      {showLabel && config.label}
    </span>
  );
}
