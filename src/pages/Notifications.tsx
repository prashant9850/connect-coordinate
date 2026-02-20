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

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      // 1️⃣ Load notifications + program info
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
        *,
        programs (
          id,
          created_by
        )
      `,
        )
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      // 2️⃣ Fetch creator profiles
      const creatorIds = data
        .map((n) => n.programs?.created_by)
        .filter(Boolean);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("id", creatorIds);

      // 3️⃣ Merge data
      const enriched = data.map((n) => {
        const creator = profiles?.find((p) => p.id === n.programs?.created_by);

        return {
          ...n,
          creator,
        };
      });

      setNotifications(enriched);
    };

    loadNotifications();
  }, [user]);

  // 🔥 JOIN PROGRAM
  const joinProgram = async (programId: string) => {
    if (!user) return;

    const { error } = await supabase.from("program_volunteers").insert({
      program_id: programId,
      volunteer_id: user.id,
    });

    if (error) {
      alert("Already joined or failed");
      console.error(error);
    } else {
      alert("You joined this program ✅");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
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

        {/* Notifications */}
        {notifications.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3",
            )}
          >
            {notifications.map((n) => {
              const creator = n.programs?.profiles;

              return (
                <div
                  key={n.id}
                  onClick={() => navigate(`/program/${n.program_id}`)}
                  className="cursor-pointer p-4 border rounded-xl bg-card hover:shadow-lg transition"
                >
                  {/* Message */}
                  <p className="font-semibold text-lg mb-2">{n.message}</p>

                  {/* Creator Info */}
                  {creator && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Started by:{" "}
                      <span className="font-medium text-foreground">
                        {creator.full_name || "Unknown"}
                      </span>{" "}
                      ({creator.role?.toUpperCase()})
                    </p>
                  )}

                  {/* Date */}
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date(n.created_at).toLocaleString()}
                  </p>

                  {/* Join Button */}
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      joinProgram(n.program_id);
                    }}
                  >
                    Join Program
                  </Button>
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
