import { cn } from "@/lib/utils";
import type { NGO } from "@/types";
import { Building2, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface NGOListProps {
  ngos: NGO[];
  maxDisplay?: number;
  className?: string;
}

export function NGOList({ ngos, maxDisplay = 10, className }: NGOListProps) {
  const displayed = ngos.slice(0, maxDisplay);
  const remaining = ngos.length - maxDisplay;

  if (ngos.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Building2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-muted-foreground">No NGOs found</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {displayed.map((ngo, index) => (
        <Link key={ngo.id} to={`/ngo/${ngo.id}`} className="block">
          <div
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {ngo.name}
              </h4>

              <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {ngo.areaOfOperation.join(", ")}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {ngo.manpowerCapacity} capacity
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {remaining > 0 && (
        <button className="w-full py-2 text-sm text-primary hover:text-primary/80 font-medium">
          View {remaining} more NGOs
        </button>
      )}
    </div>
  );
}
