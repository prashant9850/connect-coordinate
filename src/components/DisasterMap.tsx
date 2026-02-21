import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import { LatLngExpression, LatLngBounds } from "leaflet";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface Program {
  id: string;
  severity: "red" | "orange" | "yellow";
  lat: number;
  lng: number;
}

/* ---------- Auto Fit Component ---------- */

function FitBounds({ programs }: { programs: Program[] }) {
  const map = useMap();

  useEffect(() => {
    if (programs.length === 0) return;

    if (programs.length === 1) {
      const p = programs[0];
      const offset = 0.25;

      const bounds = new LatLngBounds(
        [p.lat - offset, p.lng - offset],
        [p.lat + offset, p.lng + offset],
      );

      map.fitBounds(bounds, { padding: [50, 50] });
      return;
    }

    const bounds = new LatLngBounds(
      programs.map((p) => [p.lat, p.lng] as LatLngExpression),
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [programs, map]);

  return null;
}

/* ---------- Main Component ---------- */

export function DisasterMap({
  programs = [],
  className,
  interactive = true,
}: {
  programs?: Program[];
  className?: string;
  interactive?: boolean;
}) {
  const center: LatLngExpression =
    programs.length > 0
      ? [programs[0].lat, programs[0].lng]
      : [20.5937, 78.9629];

  const getColor = (s: string) => {
    if (s === "red") return "#ef4444";
    if (s === "orange") return "#f97316";
    if (s === "yellow") return "#eab308";
    return "#6b7280";
  };

  return (
    /* 🔥 CRITICAL FIX — prevents map overlapping dialogs */
    <div
      className={cn(
        "relative z-0 overflow-hidden rounded-xl h-full",
        className,
      )}
      style={{ contain: "layout paint size" }} // ⭐ important for Leaflet
    >
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={interactive}
        dragging={interactive}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds programs={programs} />

        {programs.map((p) => (
          <Circle
            key={p.id}
            center={[p.lat, p.lng]}
            radius={8000}
            pathOptions={{
              color: getColor(p.severity),
              fillColor: getColor(p.severity),
              fillOpacity: 0.35,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
