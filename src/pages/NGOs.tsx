import { useState } from "react";
import { Header } from "@/components/Header";
import { EmergencyModal } from "@/components/EmergencyModal";
import { NGOList } from "@/components/NGOList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockNGOs } from "@/data/mockData";

export default function NGOs() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNGOs = mockNGOs.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.areaOfOperation.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setEmergencyModalOpen(true)} />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">NGOs</h1>
          <p className="text-muted-foreground">
            Browse verified partner organizations
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search NGOs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Result count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredNGOs.length} NGO
          {filteredNGOs.length !== 1 ? "s" : ""}
        </p>

        {/* NGO list */}
        <div className="bg-card border border-border rounded-xl p-4">
          <NGOList ngos={filteredNGOs} maxDisplay={20} />
        </div>
      </main>

      <EmergencyModal
        open={emergencyModalOpen}
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
