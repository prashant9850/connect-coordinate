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
  DialogOverlay,
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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (type: EmergencyType) => void;
  programId?: string;
}

const emergencyTypes = [
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
] as const;

export function EmergencyModal({
  open,
  onOpenChange,
  onSubmit,
  programId,
}: EmergencyModalProps) {
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ======================================
     🌍 CONVERT LAT/LNG → ADDRESS
  ====================================== */
  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      return data.display_name || "Unknown location";
    } catch {
      return "Unknown location";
    }
  };

  /* ======================================
     🚨 SEND EMERGENCY
  ====================================== */
  const sendEmergency = async (type: EmergencyType) => {
    if (!user) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const address = await getAddress(lat, lng);

        /* 🔴 SAVE EMERGENCY */
        const { data: emergency } = await supabase
          .from("emergency_requests")
          .insert({
            program_id: programId,
            lat,
            lng,
            request_type: type,
            status: "pending",
          })
          .select()
          .single();

        /* 🔔 NOTIFY ALL USERS */
        const { data: users } = await supabase.from("profiles").select("id");

        if (users && emergency) {
          const payload = users.map((u) => ({
            user_id: u.id,
            program_id: programId,
            type: "emergency",
            message: `🚨 ${type.toUpperCase()} emergency at ${address}`,
            emergency_id: emergency.id,
          }));

          await supabase.from("notifications").insert(payload);
        }

        onSubmit?.(type);
      },
      () => {
        alert("Location permission denied");
      },
    );
  };

  const handleSubmit = () => {
    if (!selectedType) return;

    setIsSubmitting(true);
    sendEmergency(selectedType);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setSelectedType(null);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  const handleSkip = () => {
    setIsSubmitting(true);
    sendEmergency("other");

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setSelectedType(null);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/70 backdrop-blur-md z-[9999]" />

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

            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location will be shared automatically</span>
            </div>

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
