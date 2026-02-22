import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EmergencyButton } from "@/components/EmergencyButton";
import { EmergencyModal } from "@/components/EmergencyModal";
import { SeverityBadge } from "@/components/SeverityBadge";
import { VolunteerList } from "@/components/VolunteerList";
import { ResourceRequestCard } from "@/components/ResourceRequestCard";
import { DisasterMap } from "@/components/DisasterMap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  MapPin,
  Clock,
  UserPlus,
  Package,
  Check,
} from "lucide-react";

import type { ResourceType } from "@/types";

const resourceOptions = [
  { value: "rope", label: "Rope" },
  { value: "torch", label: "Torch/Flashlight" },
  { value: "medical_kit", label: "Medical Kit" },
  { value: "stretcher", label: "Stretcher" },
  { value: "water", label: "Water Supply" },
  { value: "blanket", label: "Blankets" },
  { value: "tent", label: "Tent" },
  { value: "radio", label: "Radio" },
];

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [program, setProgram] = useState<any | null>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [resourceRequests, setResourceRequests] = useState<any[]>([]);
  const [creatorName, setCreatorName] = useState("");

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  const [resourceForm, setResourceForm] = useState({
    type: "" as ResourceType | "",
  });

  /* ===============================
     FETCH ALL DATA
  ================================= */
  const fetchAllData = async () => {
    if (!id) return;

    // PROGRAM
    const { data: programData } = await supabase
      .from("programs")
      .select("*")
      .eq("id", id)
      .single();

    if (programData) {
      const formatted = {
        ...programData,
        title: programData.title || programData.disaster_type,
        location: {
          lat: programData.lat,
          lng: programData.lng,
          name: programData.location_name || "Unknown location",
        },
      };

      setProgram(formatted);

      // CREATOR NAME
      if (programData.created_by) {
        const { data: creator } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", programData.created_by)
          .single();

        if (creator) setCreatorName(creator.name);
      }
    }

    // VOLUNTEERS
    const { data: pv } = await supabase
      .from("program_volunteers")
      .select("volunteer_id")
      .eq("program_id", id);

    if (pv?.length) {
      const ids = pv.map((v) => v.volunteer_id);

      const { data: volunteersData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);

      if (volunteersData) {
        setVolunteers(
          volunteersData.map((v) => ({
            id: v.id,
            name: v.name,
            phone: v.phone,
            location: v.location,
            skills: [],
            availability: "available",
          })),
        );
      }

      if (user) {
        const hasJoined = pv.some((v) => v.volunteer_id === user.id);
        setJoined(hasJoined);
      }
    } else {
      setVolunteers([]);
      setJoined(false);
    }

    // RESOURCE REQUESTS
    const { data: rr } = await supabase
      .from("resource_requests")
      .select("*")
      .eq("program_id", id)
      .order("created_at", { ascending: false });

    if (rr) setResourceRequests(rr);
  };

  useEffect(() => {
    fetchAllData();
  }, [id, user]);

  if (!program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <h1 className="text-2xl font-bold">Program not found</h1>
      </div>
    );
  }

  /* ===============================
     JOIN PROGRAM
  ================================= */
  const handleJoinProgram = async () => {
    if (!user) return;

    await supabase.from("program_volunteers").insert({
      program_id: program.id,
      volunteer_id: user.id,
    });

    await fetchAllData();
  };

  /* ===============================
     RESOURCE REQUEST + NOTIFICATION 🔥
  ================================= */
  const handleResourceRequest = async () => {
    if (!user) return;

    // 1️⃣ CREATE RESOURCE REQUEST
    const { data: requestData, error } = await supabase
      .from("resource_requests")
      .insert({
        program_id: program.id,
        requested_by: user.id,
        item_name: resourceForm.type,
        status: "pending",
      })
      .select()
      .single();

    if (error || !requestData) {
      alert("Failed to create request");
      return;
    }

    // 2️⃣ NOTIFY ALL VOLUNTEERS IN PROGRAM 🔥
    const { data: volunteers } = await supabase
      .from("program_volunteers")
      .select("volunteer_id")
      .eq("program_id", program.id);

    if (volunteers?.length) {
      const notifications = volunteers.map((v) => ({
        user_id: v.volunteer_id,
        program_id: program.id,
        message: `Resource needed — ${resourceForm.type}`,
        type: "resource_request",
        resource_request_id: requestData.id,
      }));

      await supabase.from("notifications").insert(notifications);
    }

    setResourceModalOpen(false);
    setResourceForm({ type: "" });

    await fetchAllData();
  };

  /* ===============================
     UI
  ================================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* HEADER */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SeverityBadge severity={program.severity} />

                <span className="text-sm text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                  {program.disaster_type}
                </span>

                <span className="text-sm px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {program.status}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {program.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {program.location?.name}
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Started {new Date(program.created_at).toLocaleDateString()}
                </div>

                {creatorName && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    👤 By {creatorName}
                  </div>
                )}
              </div>
            </div>

            <EmergencyButton
              size="large"
              onClick={() => setEmergencyModalOpen(true)}
            />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold mb-4">Program Area</h2>

              <DisasterMap
                programs={[program]}
                volunteers={[]}
                className="h-[250px]"
                showControls={false}
                interactive={false}
              />
            </div>

            {/* JOIN */}
            <div className="bg-card border border-border rounded-xl p-4">
              {!joined ? (
                <Button className="w-full" onClick={handleJoinProgram}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join This Program
                </Button>
              ) : (
                <div className="text-center py-3 rounded-lg bg-success/10 text-success">
                  <Check className="inline h-5 w-5 mr-2" />
                  You've joined this program
                </div>
              )}
            </div>

            {/* RESOURCES */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Resource Requests</h2>

                <Button
                  size="sm"
                  onClick={() => setResourceModalOpen(true)}
                  disabled={!joined}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Request Resource
                </Button>
              </div>

              {resourceRequests.length > 0 ? (
                resourceRequests.map((r) => (
                  <ResourceRequestCard key={r.id} request={r} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  No resource requests yet
                </p>
              )}
            </div>
          </div>

          {/* VOLUNTEERS */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Active Volunteers</h2>

            <VolunteerList volunteers={volunteers} maxDisplay={8} />
          </div>
        </div>
      </main>

      <EmergencyModal
        open={emergencyModalOpen}
        onOpenChange={setEmergencyModalOpen}
      />

      {/* RESOURCE MODAL */}
      <Dialog open={resourceModalOpen} onOpenChange={setResourceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Resource</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Resource Type</Label>

            <Select
              value={resourceForm.type}
              onValueChange={(v) =>
                setResourceForm({ type: v as ResourceType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>

              <SelectContent>
                {resourceOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleResourceRequest} disabled={!resourceForm.type}>
            Submit Request
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
