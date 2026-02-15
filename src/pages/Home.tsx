import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmergencyButton } from "@/components/EmergencyButton";
import { EmergencyModal } from "@/components/EmergencyModal";
import { ProgramCard } from "@/components/ProgramCard";
import { DisasterMap } from "@/components/DisasterMap";
import { supabase } from "@/lib/supabase";

import {
  Flame,
  Ambulance,
  Phone,
  Shield,
  Users,
  MapPin,
  ArrowRight,
  Building2,
  AlertTriangle,
  LogIn,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const [programs, setPrograms] = useState<any[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [ngoCount, setNgoCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: programData } = await supabase
        .from("programs")
        .select("*")
        .eq("status", "active");

      if (programData) {
        const formatted = programData.map((p) => ({
          ...p,

          // ⭐ Required by ProgramCard & DisasterMap
          title: p.title || p.disaster_type,

          location: {
            lat: p.lat,
            lng: p.lng,
            name: p.location_name || "Unknown location",
          },

          disasterType: p.disaster_type,

          volunteerCount: 0, // will fix later dynamically
          maxVolunteers: p.max_volunteers || 50,

          requiredSkills: p.required_skills || [],
        }));

        setPrograms(formatted);
      }

      // Volunteers count
      const { count: vCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "volunteer");

      setVolunteerCount(vCount || 0);

      // NGOs count
      const { count: nCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "ngo");

      setNgoCount(nCount || 0);
    };

    fetchData();
  }, []);

  const activeProgramCount = programs.length;

  const stats = [
    { icon: Shield, value: "24/7", label: "Emergency Response" },
    {
      icon: Users,
      value: volunteerCount.toString(),
      label: "Active Volunteers",
    },
    {
      icon: MapPin,
      value: activeProgramCount.toString(),
      label: "Active Programs",
    },
    {
      icon: Building2,
      value: ngoCount.toString(),
      label: "Partner NGOs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-50" />

        <div className="container relative z-10 mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                {activeProgramCount} Active Emergency Programs
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 md:mb-6">
                Coordinating
                <span className="text-destructive"> Disaster Relief</span>
                <br />
                in Real-Time
              </h1>

              <p className="text-base md:text-lg text-primary-foreground/80 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
                Connecting verified NGOs, skilled volunteers, and those in need.
                One platform for efficient, coordinated disaster response.
              </p>

              {/* AUTH BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 md:mb-12">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-black hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/register">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Register
                  </Link>
                </Button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <Icon className="h-4 w-4 text-destructive" />
                      <span className="text-xl md:text-2xl font-bold">
                        {value}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-primary-foreground/60">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* EMERGENCY BUTTON */}
            <div className="flex flex-col items-center">
              <EmergencyButton
                size="hero"
                onClick={() => setEmergencyModalOpen(true)}
              />

              <p className="mt-6 text-primary-foreground/60 text-center">
                No registration required
                <br />
                One tap sends your location
              </p>

              {/* QUICK CALL BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-xs">
                <a href="tel:100">
                  <Button variant="outline" className="w-full text-black">
                    <Shield className="mr-2 h-4 w-4" />
                    Police (100)
                  </Button>
                </a>

                <a href="tel:101">
                  <Button variant="outline" className="w-full text-black">
                    <Flame className="mr-2 h-4 w-4" />
                    Fire (101)
                  </Button>
                </a>

                <a href="tel:102">
                  <Button variant="outline" className="w-full text-black">
                    <Ambulance className="mr-1 h-4 w-4" />
                    Ambulance (102)
                  </Button>
                </a>

                <a href="tel:1091">
                  <Button variant="outline" className="w-full text-black">
                    <Phone className="mr-2 h-4 w-4" />
                    Women (1091)
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Live Disaster Map
              </h2>
              <p className="text-muted-foreground">
                Real-time view of active relief programs
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link to="/dashboard">
                View Full Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <DisasterMap
            programs={programs}
            volunteers={[]}
            className="h-[300px] md:h-[400px]"
          />
        </div>
      </section>

      {/* ================= ACTIVE PROGRAMS ================= */}
      <section className="py-8 md:py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Active Programs</h2>
              <p className="text-muted-foreground">
                Join ongoing relief efforts
              </p>
            </div>

            <Button variant="ghost" asChild>
              <Link to="/programs">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {programs.slice(0, 4).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (ORIGINAL 3 BLOCKS) ================= */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How DisasterConnect Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A coordinated approach to disaster relief connecting NGOs,
              volunteers, and people in need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-destructive" />
              <h3 className="font-semibold mb-2">Report Emergencies</h3>
              <p className="text-muted-foreground text-sm">
                Anyone can instantly report emergencies with location data.
              </p>
            </div>

            <div className="text-center">
              <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h3 className="font-semibold mb-2">Mobilize Volunteers</h3>
              <p className="text-muted-foreground text-sm">
                Skilled volunteers nearby are notified in real time.
              </p>
            </div>

            <div className="text-center">
              <Building2 className="mx-auto mb-4 h-10 w-10 text-success" />
              <h3 className="font-semibold mb-2">Coordinate NGOs</h3>
              <p className="text-muted-foreground text-sm">
                Verified NGOs manage programs and resources efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="mb-8 max-w-xl mx-auto">
          Join thousands of volunteers and NGOs working together to provide
          faster disaster relief.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" className="text-black" asChild>
            <Link to="/programs">View Active Programs</Link>
          </Button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 DisasterConnect. Coordinating relief efforts worldwide.
        </p>
      </footer>

      {/* EMERGENCY MODAL */}
      <EmergencyModal
        open={emergencyModalOpen}
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
