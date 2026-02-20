import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function NotificationProvider({ children }: any) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log("🔔 GLOBAL listener started for:", user.id);

    const channel = supabase
      .channel("global-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("🔥 GLOBAL NEW NOTIFICATION:", payload.new);

          alert(payload.new.message); // test popup
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
      console.log("❌ GLOBAL listener stopped");
    };
  }, [user]);

  return children;
}
