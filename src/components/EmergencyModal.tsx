import { useState } from "react";
import { cn } from "@/lib/utils";
import type { EmergencyType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay, // ✅ IMPORTANT
} from "@/components/ui/dialog";
import {
  Heart,
  AlertTriangle,
  Truck,
  UtensilsCrossed,
  HelpCircle,
  Check,
  MapPin,
} from "lucide-react";

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (type: EmergencyType) => void;
}

const emergencyTypes: {
  type: EmergencyType;
  icon: React.ElementType;
  label: string;
  description: string;
}[] = [
  {
    type: "medical",
    icon: Heart,
    label: "Medical Emergency",
    description: "Injuries, illness, or health crisis",
  },
  {
    type: "trapped",
    icon: AlertTriangle,
    label: "Trapped / Stuck",
    description: "Unable to move or escape",
  },
  {
    type: "evacuation",
    icon: Truck,
    label: "Need Evacuation",
    description: "Require transport to safety",
  },
  {
    type: "food",
    icon: UtensilsCrossed,
    label: "Food / Water",
    description: "Essential supplies needed",
  },
  {
    type: "other",
    icon: HelpCircle,
    label: "Other Emergency",
    description: "Any other urgent situation",
  },
];

export function EmergencyModal({
  open,
  onOpenChange,
  onSubmit,
}: EmergencyModalProps) {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!selectedType) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit?.(selectedType);

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
      onSubmit?.("other");

      setTimeout(() => {
        setIsSuccess(false);
        setSelectedType(null);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 🌑 DARK + BLUR BACKGROUND */}
      <DialogOverlay className="bg-black/70 backdrop-blur-md z-[9999]" />

      {/* 🚨 MODAL CONTENT */}
      <DialogContent className="sm:max-w-md z-[10000]">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>

            <h3 className="text-xl font-semibold mb-2">Help is on the way!</h3>

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

            {/* 📍 Location Notice */}
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location will be shared automatically</span>
            </div>

            {/* 🚑 Emergency Options */}
            <div className="grid gap-2 py-4">
              {emergencyTypes.map(
                ({ type, icon: Icon, label, description }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                      selectedType === type
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-400 hover:bg-red-500/5",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        selectedType === type
                          ? "bg-red-500 text-white"
                          : "bg-secondary",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </button>
                ),
              )}
            </div>

            {/* 🔘 Buttons */}
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
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={handleSubmit}
                disabled={!selectedType || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Emergency"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
