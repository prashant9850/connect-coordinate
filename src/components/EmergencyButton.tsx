import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface EmergencyButtonProps {
  onClick?: () => void;
  size?: 'default' | 'large' | 'hero';
  className?: string;
  showPulse?: boolean;
}

export function EmergencyButton({ 
  onClick, 
  size = 'default', 
  className,
  showPulse = true 
}: EmergencyButtonProps) {
  const sizeClasses = {
    default: 'h-14 w-14 text-sm',
    large: 'h-20 w-20 text-base',
    hero: 'h-32 w-32 sm:h-40 sm:w-40 text-lg sm:text-xl',
  };

  const iconSizes = {
    default: 'h-6 w-6',
    large: 'h-8 w-8',
    hero: 'h-12 w-12 sm:h-16 sm:w-16',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-full',
        'bg-gradient-emergency text-destructive-foreground',
        'font-bold uppercase tracking-wider',
        'transition-all duration-200',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-destructive/50',
        showPulse && 'emergency-pulse',
        sizeClasses[size],
        className
      )}
      aria-label="Emergency Help Button"
    >
      <AlertTriangle className={cn(iconSizes[size], 'mb-1')} />
      {size === 'hero' && (
        <span className="text-center leading-tight">
          EMERGENCY<br />HELP
        </span>
      )}
      {size === 'large' && <span>SOS</span>}
    </button>
  );
}
