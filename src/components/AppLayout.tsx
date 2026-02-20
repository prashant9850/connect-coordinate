import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { EmergencyModal } from "@/components/EmergencyModal";
import { useState } from "react";

export default function AppLayout() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setEmergencyOpen(true)} />

      <main>
        <Outlet />
      </main>

      <EmergencyModal open={emergencyOpen} onOpenChange={setEmergencyOpen} />
    </div>
  );
}
