import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "emergency" | "resource_request" | "program";

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<FilterType>("all");

  /* ===============================
     LOAD NOTIFICATIONS
  ================================= */
  const loadNotifications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!data) return;

    const enriched = await Promise.all(
      data.map(async (n) => {
        let program = null;
        let joined = false;
        let emergency = null;
        let helperName = null;

        /* 🔴 EMERGENCY DATA */
        if (n.type === "emergency" && n.emergency_id) {
          const { data: e } = await supabase
            .from("emergency_requests")
            .select("*")
            .eq("id", n.emergency_id)
            .maybeSingle();

          emergency = e;

          if (e?.helper_id) {
            const { data: p } = await supabase
              .from("profiles")
              .select("name")
              .eq("id", e.helper_id)
              .maybeSingle();

            helperName = p?.name || "Volunteer";
          }
        }

        /* 🟡 PROGRAM DATA */
        if (n.program_id) {
          const { data: prog } = await supabase
            .from("programs")
            .select("*")
            .eq("id", n.program_id)
            .maybeSingle();

          program = prog;

          if (prog && user) {
            const { data: vol } = await supabase
              .from("program_volunteers")
              .select("id")
              .eq("program_id", prog.id)
              .eq("volunteer_id", user.id)
              .maybeSingle();

            joined = !!vol;
          }
        }

        return { ...n, program, joined, emergency, helperName };
      }),
    );

    setNotifications(enriched);
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [user]);

  /* ===============================
     FILTER
  ================================= */
  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "emergency") return n.type === "emergency";
    if (filter === "resource_request") return n.type === "resource_request";
    if (filter === "program") return n.type === "program_alert";
    return true;
  });

  /* ===============================
     ACTIONS
  ================================= */

  const handleHelp = async (id: string) => {
    if (!user) return;

    await supabase
      .from("emergency_requests")
      .update({
        status: "in_progress",
        helper_id: user.id,
      })
      .eq("id", id);

    loadNotifications();
  };

  const handleComplete = async (id: string) => {
    await supabase
      .from("emergency_requests")
      .update({ status: "completed" })
      .eq("id", id);

    loadNotifications();
  };

  const joinProgram = async (programId: string) => {
    if (!user) return;

    await supabase.from("program_volunteers").insert({
      program_id: programId,
      volunteer_id: user.id,
    });

    loadNotifications();
  };

  const openProgram = (program: any) => {
    if (!program) return;
    navigate(`/program/${program.id}`);
  };

  /* ===============================
     UI
  ================================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
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

        {/* FILTER */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "emergency", label: "Emergencies" },
            { key: "resource_request", label: "Resources" },
            { key: "program", label: "Programs" },
          ].map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key as FilterType)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* CARDS */}
        {filtered.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3",
            )}
          >
            {filtered.map((n) => {
              const program = n.program;
              const e = n.emergency;

              const isEnded = program && program.status !== "active";
              const isJoined = n.joined;

              return (
                <div
                  key={n.id}
                  onClick={() => program && openProgram(program)}
                  className={cn(
                    "cursor-pointer p-4 border rounded-xl transition flex flex-col h-full",
                    n.type === "emergency"
                      ? "bg-red-600 text-white border-red-700"
                      : "bg-card hover:shadow-lg",
                  )}
                >
                  <div>
                    <p className="font-semibold text-lg mb-2">{n.message}</p>

                    <p className="text-xs opacity-80 mb-3">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* ===== EMERGENCY ===== */}
                  {n.type === "emergency" && e && (
                    <>
                      {e.status === "pending" && (
                        <Button
                          size="sm"
                          className="w-full mt-auto bg-white text-red-600"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleHelp(e.id);
                          }}
                        >
                          🚑 I WILL HELP
                        </Button>
                      )}

                      {e.status === "in_progress" &&
                        (e.helper_id === user?.id ? (
                          <Button
                            size="sm"
                            className="w-full mt-auto bg-green-600"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              handleComplete(e.id);
                            }}
                          >
                            Mark Completed
                          </Button>
                        ) : (
                          <div className="text-center text-sm mt-auto">
                            👤 {n.helperName} is helping
                          </div>
                        ))}

                      {e.status === "completed" && (
                        <div className="text-center text-sm mt-auto">
                          ✅ Help Provided
                        </div>
                      )}
                    </>
                  )}

                  {/* ===== PROGRAM ALERT ===== */}
                  {n.type === "program_alert" && program && (
                    <Button
                      size="sm"
                      className={cn(
                        "w-full mt-auto",
                        isEnded && "bg-destructive",
                        isJoined && "bg-green-600",
                      )}
                      disabled={isEnded || isJoined}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (!isEnded && !isJoined) joinProgram(program.id);
                      }}
                    >
                      {isEnded
                        ? "Program Ended"
                        : isJoined
                          ? "Already Joined"
                          : "Join Program"}
                    </Button>
                  )}

                  {/* ===== RESOURCE REQUEST ===== */}
                  {n.type === "resource_request" && (
                    <Button size="sm" className="w-full mt-auto">
                      Accept Request
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">
            No notifications found
          </p>
        )}
      </main>
    </div>
  );
}
