import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EmergencyModal } from "@/components/EmergencyModal";
import { ProgramCard } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  CheckCircle,
  Clock,
  Mail,
  Globe,
} from "lucide-react";
import { getNGOById, mockPrograms } from "@/data/mockData";

export default function NGOProfile() {
  const { id } = useParams();
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const ngo = getNGOById(id || "ngo-1") || getNGOById("ngo-1");
  const ngoPrograms = mockPrograms.filter((p) => p.ngoId === ngo?.id);
  const activePrograms = ngoPrograms.filter((p) => p.status === "active");
  const completedPrograms = ngoPrograms.filter((p) => p.status === "completed");

  if (!ngo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            NGO not found
          </h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/NGOs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        {/* NGO Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo placeholder */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {ngo.name}
                </h1>
                {ngo.verified && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">
                {ngo.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {ngo.areaOfOperation.join(", ")}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {ngo.manpowerCapacity} volunteers capacity
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {ngo.email}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-4 md:gap-2 md:text-right">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {ngo.activePrograms}
                </p>
                <p className="text-sm text-muted-foreground">Active Programs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {ngo.pastPrograms}
                </p>
                <p className="text-sm text-muted-foreground">Total Programs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Programs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Active Programs
          </h2>
          {activePrograms.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card border border-border rounded-xl">
              <Clock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">No active programs</p>
            </div>
          )}
        </div>

        {/* Past Programs */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Program History
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Program
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Location
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Volunteers
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Generate some mock historical data */}
                  {[
                    {
                      title: "Flood Relief 2023",
                      type: "Flood",
                      location: "Houston, TX",
                      volunteers: 85,
                      date: "Oct 2023",
                    },
                    {
                      title: "Tornado Response",
                      type: "Tornado",
                      location: "Oklahoma City, OK",
                      volunteers: 42,
                      date: "Aug 2023",
                    },
                    {
                      title: "Wildfire Support",
                      type: "Wildfire",
                      location: "Sacramento, CA",
                      volunteers: 120,
                      date: "Jul 2023",
                    },
                    {
                      title: "Hurricane Prep",
                      type: "Hurricane",
                      location: "Tampa, FL",
                      volunteers: 65,
                      date: "Jun 2023",
                    },
                    {
                      title: "Earthquake Relief",
                      type: "Earthquake",
                      location: "Los Angeles, CA",
                      volunteers: 95,
                      date: "Mar 2023",
                    },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium text-foreground">
                        {item.title}
                      </td>
                      <td className="p-4 text-muted-foreground">{item.type}</td>
                      <td className="p-4 text-muted-foreground">
                        {item.location}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {item.volunteers}
                      </td>
                      <td className="p-4 text-muted-foreground">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
