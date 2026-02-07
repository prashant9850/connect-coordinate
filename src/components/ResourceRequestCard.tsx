import { cn } from '@/lib/utils';
import type { ResourceRequest, ResourceType } from '@/types';
import { 
  Package, 
  Flashlight, 
  Stethoscope, 
  Bed,
  Droplets,
  Layers,
  Tent,
  Radio,
  Check,
  Clock,
  Hand
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceRequestCardProps {
  request: ResourceRequest;
  onProvide?: (requestId: string) => void;
  showProvideButton?: boolean;
  className?: string;
}

const resourceIcons: Record<ResourceType, React.ElementType> = {
  rope: Package,
  torch: Flashlight,
  medical_kit: Stethoscope,
  stretcher: Bed,
  water: Droplets,
  blanket: Layers,
  tent: Tent,
  radio: Radio,
};

const resourceLabels: Record<ResourceType, string> = {
  rope: 'Rope',
  torch: 'Torch/Flashlight',
  medical_kit: 'Medical Kit',
  stretcher: 'Stretcher',
  water: 'Water Supply',
  blanket: 'Blankets',
  tent: 'Tent',
  radio: 'Radio',
};

const urgencyStyles = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-severity-yellow-bg text-severity-yellow',
  high: 'bg-severity-red-bg text-severity-red',
};

const statusConfig = {
  open: {
    icon: Clock,
    label: 'Open Request',
    className: 'text-muted-foreground',
  },
  claimed: {
    icon: Hand,
    label: 'Being Provided',
    className: 'text-severity-orange',
  },
  fulfilled: {
    icon: Check,
    label: 'Fulfilled',
    className: 'text-success',
  },
};

export function ResourceRequestCard({ 
  request, 
  onProvide,
  showProvideButton = true,
  className 
}: ResourceRequestCardProps) {
  const Icon = resourceIcons[request.resourceType];
  const StatusIcon = statusConfig[request.status].icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-card border border-border',
        'hover:shadow-md transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-secondary">
          <Icon className="h-5 w-5 text-secondary-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">
              {resourceLabels[request.resourceType]}
            </h4>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
              urgencyStyles[request.urgency]
            )}>
              {request.urgency}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            Quantity: {request.quantity} • Requested by {request.requesterName}
          </p>

          <div className="flex items-center gap-1 text-sm">
            <StatusIcon className={cn('h-4 w-4', statusConfig[request.status].className)} />
            <span className={statusConfig[request.status].className}>
              {statusConfig[request.status].label}
              {request.status === 'claimed' && request.providerName && (
                <span className="text-foreground"> by {request.providerName}</span>
              )}
              {request.status === 'fulfilled' && request.providerName && (
                <span className="text-foreground"> by {request.providerName}</span>
              )}
            </span>
          </div>
        </div>

        {showProvideButton && request.status === 'open' && onProvide && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onProvide(request.id)}
            className="flex-shrink-0"
          >
            <Hand className="h-4 w-4 mr-1" />
            Provide
          </Button>
        )}
      </div>
    </div>
  );
}
