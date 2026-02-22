import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResourceRequestCardProps {
  request: any;
  className?: string;
}

export function ResourceRequestCard({
  request,
  className,
}: ResourceRequestCardProps) {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  if (!request) return null;

  const handleSave = () => {
    if (!customText.trim()) return;

    // 🔥 For now just log — you can connect to Supabase later
    console.log("Custom requirement:", customText);

    alert("Custom requirement saved");
    setCustomText("");
  };

  return (
    <>
      {/* ===== CARD ===== */}
      <div
        onClick={() => setOpen(true)}
        className={cn(
          "cursor-pointer p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />

          <div className="flex-1">
            <p className="font-medium capitalize">{request.item_name}</p>

            <p className="text-xs text-muted-foreground capitalize">
              {request.status}
            </p>
          </div>

          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* ===== POPUP ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="bg-black/70 backdrop-blur-md z-[9999]" />

        <DialogContent className="sm:max-w-md z-[10000]">
          <h3 className="text-xl font-semibold mb-4">
            Resource Request Details
          </h3>

          <div className="space-y-3">
            <p>
              <strong>Item:</strong>{" "}
              <span className="capitalize">{request.item_name}</span>
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{request.status}</span>
            </p>

            <p>
              <strong>Requested At:</strong>{" "}
              {new Date(request.created_at).toLocaleString()}
            </p>
          </div>

          {/* 🔥 NEW: CUSTOM REQUIREMENT INPUT */}
          <div className="mt-6 space-y-3">
            <p className="font-medium">Need something specific?</p>

            <Input
              placeholder="Enter additional requirement..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />

            <Button
              onClick={handleSave}
              disabled={!customText.trim()}
              className="w-full"
            >
              Save Requirement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
