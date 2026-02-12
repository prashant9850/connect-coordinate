import { useState } from "react";
import { Header } from "@/components/Header";
import { EmergencyModal } from "@/components/EmergencyModal";
import { DisasterMap } from "@/components/DisasterMap";
import { ProgramCard } from "@/components/ProgramCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Users,
  Building2,
  Clock,
} from "lucide-react";
import { mockPrograms, mockVolunteers, mockNGOs } from "@/data/mockData";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const { user } = useAuth();
  const [selectedProgramId, setSelectedProgramId] = useState<
    string | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");

  const activePrograms = mockPrograms.filter((p) => p.status === "active");
  const filteredPrograms = activePrograms.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
      value: mockVolunteers.length * 20,
      label: "Total Volunteers",
      iconClass: "text-primary",
    },
    {
      icon: Building2,
      value: mockNGOs.length,
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
      <Header onEmergencyClick={() => setEmergencyModalOpen(true)} />

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
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

        {/* Map and Programs Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map - takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Disaster Map
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary status-pulse" />
                  Live
                </div>
              </div>
            </div>

            <DisasterMap
              programs={activePrograms}
              volunteers={mockVolunteers}
              selectedProgramId={selectedProgramId}
              onProgramSelect={setSelectedProgramId}
              className="h-[400px] md:h-[500px]"
            />

            {/* Selected program preview */}
            {selectedProgramId && (
              <div className="p-4 rounded-xl bg-card border border-border fade-in">
                {(() => {
                  const program = activePrograms.find(
                    (p) => p.id === selectedProgramId,
                  );
                  if (!program) return null;
                  return (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <SeverityBadge
                            severity={program.severity}
                            size="sm"
                          />
                          <span className="text-sm text-muted-foreground">
                            {program.disasterType}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {program.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {program.location.name}
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

          {/* Programs list - 1 column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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

            {/* Search and filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Programs list */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  variant="compact"
                />
              ))}
              {filteredPrograms.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No programs found</p>
                </div>
              )}
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
