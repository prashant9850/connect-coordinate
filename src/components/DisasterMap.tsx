import { cn } from '@/lib/utils';
import type { DisasterProgram, Volunteer } from '@/types';
import { MapPin, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from './SeverityBadge';

interface DisasterMapProps {
  programs: DisasterProgram[];
  volunteers?: Volunteer[];
  selectedProgramId?: string;
  onProgramSelect?: (programId: string) => void;
  className?: string;
  showControls?: boolean;
  interactive?: boolean;
}

// Generate positions for disaster zones on a mock map
const getZonePosition = (program: DisasterProgram, index: number) => {
  // Deterministic positioning based on location
  const baseX = ((program.location.lng + 130) / 60) * 100;
  const baseY = ((50 - program.location.lat) / 30) * 100;
  return {
    left: `${Math.max(10, Math.min(70, baseX))}%`,
    top: `${Math.max(15, Math.min(70, baseY))}%`,
  };
};

// Get zone color based on severity
const getZoneColor = (severity: string) => {
  switch (severity) {
    case 'red': return 'bg-severity-red/20 border-severity-red';
    case 'orange': return 'bg-severity-orange/20 border-severity-orange';
    case 'yellow': return 'bg-severity-yellow/20 border-severity-yellow';
    default: return 'bg-muted/20 border-muted';
  }
};

export function DisasterMap({ 
  programs, 
  volunteers = [],
  selectedProgramId,
  onProgramSelect,
  className,
  showControls = true,
  interactive = true
}: DisasterMapProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-map-bg', className)}>
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Mock map elements */}
      <div className="absolute inset-0">
        {/* Water bodies */}
        <div className="absolute top-[10%] right-[5%] w-[25%] h-[30%] bg-map-water/40 rounded-full blur-xl" />
        <div className="absolute bottom-[20%] left-[10%] w-[15%] h-[20%] bg-map-water/30 rounded-full blur-lg" />
        
        {/* Land masses */}
        <div className="absolute top-[30%] left-[20%] w-[60%] h-[50%] bg-map-land/50 rounded-[40%] blur-md" />
      </div>

      {/* Disaster zones */}
      {programs.map((program, index) => {
        const position = getZonePosition(program, index);
        const isSelected = selectedProgramId === program.id;
        const zoneVolunteers = volunteers.filter(v => v.currentProgramId === program.id);
        
        return (
          <div
            key={program.id}
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-1/2',
              'transition-all duration-300',
              interactive && 'cursor-pointer',
              isSelected && 'scale-110 z-10'
            )}
            style={position}
            onClick={() => interactive && onProgramSelect?.(program.id)}
          >
            {/* Zone circle */}
            <div 
              className={cn(
                'rounded-full border-2 border-dashed',
                'transition-all duration-300',
                getZoneColor(program.severity),
                isSelected ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20 sm:w-28 sm:h-28'
              )}
            >
              {/* Volunteer dots */}
              {zoneVolunteers.slice(0, 5).map((vol, vIndex) => (
                <div
                  key={vol.id}
                  className={cn(
                    'absolute w-2 h-2 rounded-full bg-primary status-pulse',
                    'transform -translate-x-1/2 -translate-y-1/2'
                  )}
                  style={{
                    left: `${30 + (vIndex * 15) % 50}%`,
                    top: `${30 + (vIndex * 20) % 50}%`,
                  }}
                />
              ))}
            </div>

            {/* Zone label */}
            <div 
              className={cn(
                'absolute left-1/2 -translate-x-1/2 mt-2',
                'px-2 py-1 rounded-md bg-card/95 backdrop-blur-sm shadow-md',
                'text-xs font-medium text-foreground whitespace-nowrap',
                'border border-border'
              )}
            >
              <div className="flex items-center gap-1.5">
                <SeverityBadge severity={program.severity} size="sm" showLabel={false} />
                <span className="max-w-[80px] truncate">{program.location.name}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
            <Locate className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-card/95 backdrop-blur-sm shadow-md border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Severity</p>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-severity-red" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-severity-orange" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-severity-yellow" />
            <span>Moderate</span>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {programs.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-muted-foreground">No active disaster programs</p>
          </div>
        </div>
      )}
    </div>
  );
}
