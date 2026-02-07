import { cn } from '@/lib/utils';
import { MapPin, Users, Clock, ChevronRight } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import type { DisasterProgram } from '@/types';
import { Link } from 'react-router-dom';

interface ProgramCardProps {
  program: DisasterProgram;
  variant?: 'default' | 'compact';
  className?: string;
}

export function ProgramCard({ program, variant = 'default', className }: ProgramCardProps) {
  const progressPercent = (program.volunteerCount / program.maxVolunteers) * 100;

  if (variant === 'compact') {
    return (
      <Link
        to={`/program/${program.id}`}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-card border border-border',
          'hover:border-primary/30 hover:shadow-md transition-all duration-200',
          className
        )}
      >
        <SeverityBadge severity={program.severity} showLabel={false} />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{program.title}</h4>
          <p className="text-sm text-muted-foreground truncate">{program.location.name}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{program.volunteerCount}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    );
  }

  return (
    <Link
      to={`/program/${program.id}`}
      className={cn(
        'block p-4 rounded-xl bg-card border border-border',
        'hover:border-primary/30 hover:shadow-lg transition-all duration-200',
        'fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={program.severity} size="sm" />
            <span className="text-xs text-muted-foreground">{program.disasterType}</span>
          </div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {program.title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {program.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-[120px]">{program.location.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{new Date(program.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Volunteers</span>
          <span className="font-medium text-foreground">
            {program.volunteerCount} / {program.maxVolunteers}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-500',
              program.severity === 'red' && 'bg-severity-red',
              program.severity === 'orange' && 'bg-severity-orange',
              program.severity === 'yellow' && 'bg-severity-yellow',
            )}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {program.requiredSkills.slice(0, 3).map(skill => (
          <span 
            key={skill}
            className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize"
          >
            {skill.replace('_', ' ')}
          </span>
        ))}
        {program.requiredSkills.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            +{program.requiredSkills.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
