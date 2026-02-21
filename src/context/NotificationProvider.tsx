import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function NotificationProvider({ children }: any) {
  const { user } = useAuth();
  const navigate = useNavigate();

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

          const programId = payload.new.program_id;

          // ⭐ SHOW TOAST WITH REDIRECT BUTTON
          toast(payload.new.message, {
            duration: 6000, // auto disappear after 6 sec

            action: {
              label: "View",
              onClick: () => {
                navigate(`/program/${programId}`);
              },
            },

            onDismiss: () => {
              console.log("Toast dismissed");
            },
          });
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
      console.log("❌ GLOBAL listener stopped");
    };
  }, [user, navigate]);

  return children;
}
