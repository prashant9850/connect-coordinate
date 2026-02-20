import { useState, useEffect } from "react";
import { EmergencyModal } from "@/components/EmergencyModal";
import { ProgramCard } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Search, Plus, Grid3X3, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import type { SeverityLevel } from "@/types";

export default function Programs() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const { user } = useAuth();

  const [programs, setPrograms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    const fetchPrograms = async () => {
      // 1️⃣ Get programs
      const { data: programsData } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!programsData) return;

      // 2️⃣ Get volunteer links
      const { data: pvData } = await supabase
        .from("program_volunteers")
        .select("program_id");

      // 3️⃣ Count volunteers per program
      const volunteerCounts: Record<string, number> = {};

      pvData?.forEach((row) => {
        volunteerCounts[row.program_id] =
          (volunteerCounts[row.program_id] || 0) + 1;
      });

      // 4️⃣ Format for UI
      const formatted = programsData.map((p) => ({
        ...p,

        title: p.title || p.disaster_type,
        disasterType: p.disaster_type,

        location: {
          name: p.location_name || "Unknown location",
        },

        requiredSkills: p.required_skills || [],

        // ⭐ REAL volunteer count
        volunteerCount: volunteerCounts[p.id] || 0,

        maxVolunteers: p.max_volunteers || 50,
      }));

      setPrograms(formatted);
    };

    fetchPrograms();
  }, []);

  // ✅ FILTER LOGIC
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.disaster_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    const matchesSeverity =
      severityFilter === "all" || p.severity === severityFilter;

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Relief Programs
            </h1>
            <p className="text-muted-foreground">
              Browse and join active disaster relief programs
            </p>
          </div>

          {user && (
            <Button size="sm" asChild>
              <Link to="/create-program">
                <Plus className="h-4 w-4 mr-1" />
                Create a Program
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* Severity */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["all", "red", "orange", "yellow"] as const).map((severity) => (
                <button
                  key={severity}
                  onClick={() => setSeverityFilter(severity)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors",
                    severityFilter === severity
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {severity === "all"
                    ? "All"
                    : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setStatusFilter("active")}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors",
                  statusFilter === "active"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors",
                  statusFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                All
              </button>
            </div>

            {/* View Mode */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredPrograms.length} program
          {filteredPrograms.length !== 1 ? "s" : ""}
        </p>

        {/* Programs */}
        {filteredPrograms.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3",
            )}
          >
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                variant={viewMode === "list" ? "compact" : "default"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No programs found matching your criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSeverityFilter("all");
                setStatusFilter("active");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      <EmergencyModal
        open={emergencyModalOpen}
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
