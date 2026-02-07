import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { EmergencyType } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Heart, 
  AlertTriangle, 
  Truck, 
  UtensilsCrossed,
  HelpCircle,
  Check,
  MapPin
} from 'lucide-react';

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (type: EmergencyType) => void;
}

const emergencyTypes: { type: EmergencyType; icon: React.ElementType; label: string; description: string }[] = [
  { type: 'medical', icon: Heart, label: 'Medical Emergency', description: 'Injuries, illness, or health crisis' },
  { type: 'trapped', icon: AlertTriangle, label: 'Trapped / Stuck', description: 'Unable to move or escape' },
  { type: 'evacuation', icon: Truck, label: 'Need Evacuation', description: 'Require transport to safety' },
  { type: 'food', icon: UtensilsCrossed, label: 'Food / Water', description: 'Essential supplies needed' },
  { type: 'other', icon: HelpCircle, label: 'Other Emergency', description: 'Any other urgent situation' },
];

export function EmergencyModal({ open, onOpenChange, onSubmit }: EmergencyModalProps) {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit?.(selectedType);
      
      // Reset and close after showing success
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedType(null);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  const handleSkip = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit?.('other');
      
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedType(null);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="py-8 text-center fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Help is on the way!</h3>
            <p className="text-muted-foreground">
              Your location has been shared. Stay safe.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                What type of help do you need?
              </DialogTitle>
              <DialogDescription className="text-center">
                Select one option or skip to send your location immediately
              </DialogDescription>
            </DialogHeader>

            {/* Location indicator */}
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location will be shared automatically</span>
            </div>

            {/* Emergency type selection */}
            <div className="grid gap-2 py-4">
              {emergencyTypes.map(({ type, icon: Icon, label, description }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left',
                    selectedType === type 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-border hover:border-destructive/50 hover:bg-destructive/5'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    selectedType === type ? 'bg-destructive text-destructive-foreground' : 'bg-secondary'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip & Send Location
              </Button>
              <Button 
                className="flex-1 bg-gradient-emergency hover:opacity-90"
                onClick={handleSubmit}
                disabled={!selectedType || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Emergency'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
