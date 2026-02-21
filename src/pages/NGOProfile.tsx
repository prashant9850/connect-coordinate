import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EmergencyModal } from "@/components/EmergencyModal";
import { ProgramCard } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, MapPin, Users, Building2, Clock, Mail } from "lucide-react";

export default function NGOProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ngo, setNgo] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  /* ===============================
     🔥 FETCH ALL DATA
  ================================= */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      /* 🏢 NGO DATA */
      const { data: ngoData } = await supabase
        .from("ngos")
        .select("*")
        .eq("id", id)
        .single();

      /* 👤 PROFILE DATA */
      const { data: profileData } = await supabase
        .from("profiles")
        .select("email, location")
        .eq("id", id)
        .maybeSingle();

      /* 📋 PROGRAMS CREATED BY THIS NGO */
      const { data: programsData } = await supabase
        .from("programs")
        .select("*")
        .eq("created_by", id)
        .order("created_at", { ascending: false });

      /* 👥 VOLUNTEER LINKS */
      const { data: pvData } = await supabase
        .from("program_volunteers")
        .select("program_id");

      /* 🔢 VOLUNTEER COUNT PER PROGRAM */
      const volunteerCounts: Record<string, number> = {};
      pvData?.forEach((row) => {
        volunteerCounts[row.program_id] =
          (volunteerCounts[row.program_id] || 0) + 1;
      });

      /* ⭐ FORMAT PROGRAMS — SAME AS Programs PAGE */
      const formattedPrograms =
        programsData?.map((p) => ({
          ...p,
          title: p.title || p.disaster_type,
          disasterType: p.disaster_type,

          location: {
            name: p.location_name || "Unknown location",
          },

          requiredSkills: p.required_skills || [],
          volunteerCount: volunteerCounts[p.id] || 0,
          maxVolunteers: p.max_volunteers || 50,
        })) || [];

      setNgo(ngoData);
      setProfile(profileData || null);
      setPrograms(formattedPrograms);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  /* ===============================
     ⏳ LOADING
  ================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading NGO data...
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        NGO not found
      </div>
    );
  }

  /* ===============================
     📊 PROGRAM FILTERS
  ================================= */
  const activePrograms = programs.filter((p) => p.status === "active");
  const completedPrograms = programs.filter((p) => p.status !== "active");

  /* ===============================
     🧠 DISPLAY DATA
  ================================= */
  const location = profile?.location || "Not specified";
  const email = profile?.email || user?.email || "No email";
  const capacity = ngo.manpower || ngo.manpower_count || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* 🔙 BACK BUTTON */}
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/NGOs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        {/* ================= NGO HEADER ================= */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-primary" />
            </div>

            {/* NGO INFO */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{ngo.ngo_name}</h1>

              <p className="text-muted-foreground mb-4">
                {ngo.description || "No description provided"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                {/* Location */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {location}
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {capacity} volunteers capacity
                </div>

                {/* Email */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {email}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-4 md:text-right">
              <div>
                <p className="text-3xl font-bold">{activePrograms.length}</p>
                <p className="text-sm text-muted-foreground">Active Programs</p>
              </div>

              <div>
                <p className="text-3xl font-bold">{programs.length}</p>
                <p className="text-sm text-muted-foreground">Total Programs</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ACTIVE PROGRAMS ================= */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Active Programs</h2>

          {activePrograms.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card border rounded-xl">
              <Clock className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
              No active programs
            </div>
          )}
        </div>

        {/* ================= PROGRAM HISTORY ================= */}
        <div>
          <h2 className="text-xl font-bold mb-4">Program History</h2>

          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left">Program</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {completedPrograms.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-4 font-medium">{p.title}</td>
                    <td className="p-4">{p.disasterType}</td>
                    <td className="p-4">{p.location?.name}</td>
                    <td className="p-4">{p.status}</td>
                    <td className="p-4">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {completedPrograms.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-muted-foreground"
                    >
                      No past programs
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
