import { useState, useEffect } from "react";
import { EmergencyModal } from "@/components/EmergencyModal";
import { DisasterMap } from "@/components/DisasterMap";
import { ProgramCard } from "@/components/ProgramCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  AlertTriangle,
  Users,
  Building2,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const { user } = useAuth();

  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<
    string | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");

  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [partnerNGOs, setPartnerNGOs] = useState(0);

  // ✅ FETCH EVERYTHING FROM SUPABASE
  useEffect(() => {
    const fetchData = async () => {
      // ===== PROGRAMS =====
      const { data: programsData } = await supabase
        .from("programs")
        .select("*");

      if (!programsData) return;

      // ===== VOLUNTEERS PER PROGRAM =====
      const { data: pvData } = await supabase
        .from("program_volunteers")
        .select("program_id, volunteer_id");

      // Map program_id -> count
      const volunteerCountMap: Record<string, number> = {};

      pvData?.forEach((v) => {
        volunteerCountMap[v.program_id] =
          (volunteerCountMap[v.program_id] || 0) + 1;
      });

      // ===== FORMAT PROGRAMS FOR UI =====
      const formatted = programsData.map((p) => ({
        ...p,

        title: p.title || p.disaster_type,

        disasterType: p.disaster_type,

        location: {
          lat: p.lat,
          lng: p.lng,
          name: p.location_name || "Unknown location",
        },

        volunteerCount: volunteerCountMap[p.id] || 0,

        maxVolunteers: p.max_volunteers || 50,

        requiredSkills: p.required_skills || [],
      }));

      setPrograms(formatted);

      // ===== TOTAL VOLUNTEERS =====
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "volunteer");

      setTotalVolunteers(count || 0);

      // ===== TOTAL NGOs =====
      const { count: ngoCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "ngo");

      setPartnerNGOs(ngoCount || 0);
    };

    fetchData();
  }, []);

  const activePrograms = programs.filter((p) => p.status === "active");

  const filteredPrograms = activePrograms.filter((p) =>
    p.disaster_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = [
    {
      icon: AlertTriangle,
      value: activePrograms.length,
      label: "Active Programs",
      iconClass: "text-destructive",
    },
    {
      icon: Users,
      value: totalVolunteers,
      label: "Total Volunteers",
      iconClass: "text-primary",
    },
    {
      icon: Building2,
      value: partnerNGOs,
      label: "Partner NGOs",
      iconClass: "text-severity-orange",
    },
    {
      icon: Clock,
      value: "48h",
      label: "Avg Response",
      iconClass: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map(({ icon: Icon, value, label, iconClass }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Icon className={`h-5 w-5 ${iconClass}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== MAP + PROGRAMS ===== */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* MAP */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Disaster Map</h2>

            <DisasterMap
              programs={activePrograms}
              volunteers={[]}
              selectedProgramId={selectedProgramId}
              onProgramSelect={setSelectedProgramId}
              className="h-[400px] md:h-[500px]"
            />

            {selectedProgramId && (
              <div className="p-4 rounded-xl bg-card border border-border">
                {(() => {
                  const program = activePrograms.find(
                    (p) => p.id === selectedProgramId,
                  );
                  if (!program) return null;

                  return (
                    <div className="flex justify-between">
                      <div>
                        <SeverityBadge severity={program.severity} size="sm" />
                        <h3 className="font-semibold">{program.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {program.location?.name}
                        </p>
                      </div>

                      <Button size="sm" asChild>
                        <Link to={`/program/${program.id}`}>View Details</Link>
                      </Button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* PROGRAM LIST */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold text-foreground">Programs</h2>

              {user && (
                <Button size="sm" asChild>
                  <Link to="/create-program">
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Link>
                </Button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <EmergencyModal
        open={emergencyModalOpen}
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
