import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  /* ===============================
     🔥 LOAD NOTIFICATIONS
  ================================= */
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      const { data: notifData, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !notifData) {
        console.error(error);
        return;
      }

      const enriched = await Promise.all(
        notifData.map(async (n) => {
          // 🧩 Program
          const { data: program } = await supabase
            .from("programs")
            .select("id, status, created_by")
            .eq("id", n.program_id)
            .maybeSingle();

          // 👤 Creator
          let creator = null;
          if (program?.created_by) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, role")
              .eq("id", program.created_by)
              .maybeSingle();

            creator = profile;
          }

          // 👥 Joined check
          let joined = false;

          if (program) {
            const { data: volunteer } = await supabase
              .from("program_volunteers")
              .select("id")
              .eq("program_id", n.program_id)
              .eq("volunteer_id", user.id)
              .maybeSingle();

            joined = !!volunteer;
          }

          return {
            ...n,
            program,
            creator,
            joined,
          };
        }),
      );

      setNotifications(enriched);
    };

    loadNotifications();
  }, [user]);

  /* ===============================
     🔥 JOIN PROGRAM
  ================================= */
  const joinProgram = async (programId: string) => {
    if (!user) return;

    // ❗ Check again to avoid duplicates
    const { data: existing } = await supabase
      .from("program_volunteers")
      .select("id")
      .eq("program_id", programId)
      .eq("volunteer_id", user.id)
      .maybeSingle();

    if (existing) {
      alert("Already joined");
      return;
    }

    const { error } = await supabase.from("program_volunteers").insert({
      program_id: programId,
      volunteer_id: user.id,
    });

    if (error) {
      alert("Failed to join program");
      return;
    }

    alert("You joined this program ✅");

    // 🔄 Update UI instantly
    setNotifications((prev) =>
      prev.map((n) =>
        n.program_id === programId ? { ...n, joined: true } : n,
      ),
    );
  };

  /* ===============================
     🌐 NAVIGATION
  ================================= */
  const openProgram = (program: any) => {
    if (!program) return;

    if (program.status !== "active") {
      alert("This program has ended");
      return;
    }

    navigate(`/program/${program.id}`);
  };
  const handleAccept = async (requestId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("resource_requests")
      .update({
        status: "providing",
        accepted_by: user.id,
      })
      .eq("id", requestId);

    if (!error) alert("You are providing this resource");
  };

  const handleComplete = async (requestId: string) => {
    const { error } = await supabase
      .from("resource_requests")
      .update({ status: "completed" })
      .eq("id", requestId);

    if (!error) alert("Marked as completed");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>

          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2",
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
                "p-2",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {notifications.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3",
            )}
          >
            {notifications.map((n) => {
              const program = n.program;
              const creator = n.creator;

              const isEnded = !program || program.status !== "active";
              const isJoined = n.joined;

              return (
                <div
                  key={n.id}
                  onClick={() => openProgram(program)}
                  className="cursor-pointer p-4 border rounded-xl bg-card hover:shadow-lg transition flex flex-col h-full"
                >
                  {/* TOP CONTENT */}
                  <div>
                    {/* Message */}
                    <p className="font-semibold text-lg mb-2">{n.message}</p>

                    {/* Creator */}
                    {creator && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Started by:{" "}
                        <span className="font-medium text-foreground">
                          {creator.full_name || "Unknown"}
                        </span>{" "}
                        ({creator.role?.toUpperCase()})
                      </p>
                    )}

                    {/* Time */}
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>

                  {n.type === "resource_request" ? (
                    <Button
                      size="sm"
                      className="w-full mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(n.resource_request_id);
                      }}
                    >
                      Accept Request
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className={cn(
                        "w-full mt-auto",
                        isEnded && "bg-destructive",
                        isJoined && "bg-green-600",
                      )}
                      disabled={isEnded || isJoined}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isEnded && !isJoined) joinProgram(n.program_id);
                      }}
                    >
                      {isEnded
                        ? "Program Ended"
                        : isJoined
                          ? "Already Joined"
                          : "Join Program"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">
            No notifications available
          </p>
        )}
      </main>
    </div>
  );
}
