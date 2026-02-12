import { cn } from "@/lib/utils";
import type { Volunteer } from "@/types";
import { User, Phone, MapPin } from "lucide-react";

interface VolunteerListProps {
  volunteers: Volunteer[];
  maxDisplay?: number;
  className?: string;
  limited?: boolean; // used to hide details for guests
}

const availabilityStyles = {
  available: "bg-success text-success-foreground",
  busy: "bg-severity-orange text-success-foreground",
  offline: "bg-muted text-muted-foreground",
};

const skillColors = [
  "bg-primary/10 text-primary",
  "bg-severity-orange-bg text-severity-orange",
  "bg-severity-yellow-bg text-severity-yellow",
  "bg-success/10 text-success",
];

export function VolunteerList({
  volunteers,
  maxDisplay = 5,
  className,
  limited = false, // default false
}: VolunteerListProps) {
  const displayedVolunteers = volunteers.slice(0, maxDisplay);
  const remainingCount = volunteers.length - maxDisplay;

  if (volunteers.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <User className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-muted-foreground">No volunteers yet</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {displayedVolunteers.map((volunteer, index) => (
        <div
          key={volunteer.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>

            {!limited && (
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                  volunteer.availability === "available" && "bg-success",
                  volunteer.availability === "busy" && "bg-severity-orange",
                  volunteer.availability === "offline" && "bg-muted-foreground",
                )}
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground truncate">
                {volunteer.name}
              </h4>

              {!limited && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full capitalize",
                    availabilityStyles[volunteer.availability],
                  )}
                >
                  {volunteer.availability}
                </span>
              )}
            </div>

            {!limited && (
              <div className="flex flex-wrap gap-1 mt-1">
                {volunteer.skills.slice(0, 2).map((skill, sIndex) => (
                  <span
                    key={skill}
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded capitalize",
                      skillColors[sIndex % skillColors.length],
                    )}
                  >
                    {skill.replace("_", " ")}
                  </span>
                ))}

                {volunteer.skills.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{volunteer.skills.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Contact */}
          {!limited && (
            <div className="flex-shrink-0 flex gap-2">
              <button
                className="p-2 rounded-lg bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                title="Call"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                title="Location"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <button className="w-full py-2 text-sm text-primary hover:text-primary/80 font-medium">
          View {remainingCount} more volunteers
        </button>
      )}
    </div>
  );
}
