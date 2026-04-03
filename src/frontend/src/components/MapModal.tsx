import { useEffect, useState } from "react";

interface MapModalProps {
  onClose: () => void;
}

type LocationTab = "business" | "regoffice" | "current";

const LOCATIONS = {
  business: {
    label: "🏢 Our Office",
    labelTe: "మా కార్యాలయం",
    name: "Lakshmi Ganapathi Communications",
    address:
      "Shop No-22, Pullareddy Complex, Beside Registration Office, Near Ravi Priya Mall, Ongole",
    lat: 15.5203,
    lng: 80.0484,
    mapSrc:
      "https://maps.google.com/maps?q=Pullareddy+Complex+Registration+Office+Ravi+Priya+Mall+Ongole+Prakasam+Andhra+Pradesh+523002&output=embed",
    directionsHref:
      "https://www.google.com/maps/dir/?api=1&destination=Pullareddy+Complex+Registration+Office+Ongole+AP+523002",
  },
  regoffice: {
    label: "🏛️ Reg. Office",
    labelTe: "రిజిస్ట్రేషన్ కార్యాలయం",
    name: "Registration Office & Stamp Office",
    address:
      "Registration Office and Stamp Office, Ongole, Prakasam Dist, Andhra Pradesh",
    lat: 15.5204,
    lng: 80.048262,
    mapSrc: "https://maps.google.com/maps?q=15.5204,80.048262&output=embed",
    directionsHref:
      "https://www.google.com/maps/dir/?api=1&destination=15.5204,80.048262",
  },
  current: {
    label: "📍 My Location",
    labelTe: "నా స్థానం",
    name: "Your Current Location",
    address: "Fetching your GPS location...",
    lat: 0,
    lng: 0,
    mapSrc: "",
    directionsHref: "",
  },
};

export function MapModal({ onClose }: MapModalProps) {
  const [activeTab, setActiveTab] = useState<LocationTab>("business");
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<
    "idle" | "loading" | "ok" | "error"
  >("idle");

  useEffect(() => {
    if (activeTab === "current" && gpsStatus === "idle") {
      setGpsStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsStatus("ok");
        },
        () => {
          setGpsStatus("error");
        },
      );
    }
  }, [activeTab, gpsStatus]);

  const currentMapSrc = currentCoords
    ? `https://maps.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}&output=embed`
    : "";

  const currentDirections = currentCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${currentCoords.lat},${currentCoords.lng}`
    : "";

  const tabs: LocationTab[] = ["business", "regoffice", "current"];

  const getMapSrc = (tab: LocationTab) => {
    if (tab === "current") return currentMapSrc;
    return LOCATIONS[tab].mapSrc;
  };

  const getDirections = (tab: LocationTab) => {
    if (tab === "current") return currentDirections;
    return LOCATIONS[tab].directionsHref;
  };

  const loc = LOCATIONS[activeTab];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) onClose();
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Escape") onClose();
      }}
      data-ocid="footer.map.modal"
    >
      <div
        className="rounded-lg overflow-hidden flex flex-col"
        style={{
          width: "min(92vw, 660px)",
          maxHeight: "88vh",
          background: "#FBF6EA",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 font-bold"
          style={{ background: "#D4800A", color: "#fff", fontSize: 14 }}
        >
          <span>📍 View Location / స్థానం చూడండి</span>
          <button
            type="button"
            onClick={onClose}
            data-ocid="footer.map.close_button"
            className="rounded-full w-7 h-7 flex items-center justify-center font-bold"
            style={{ background: "rgba(255,255,255,0.25)", fontSize: 16 }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "2px solid #D4800A", background: "#FBF6EA" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 font-bold text-center"
              style={{
                fontSize: 11,
                background: activeTab === tab ? "#D4800A" : "transparent",
                color: activeTab === tab ? "#fff" : "#D4800A",
                border: "none",
                borderRight: tab !== "current" ? "1px solid #D4800A" : "none",
                cursor: "pointer",
              }}
            >
              <div>{LOCATIONS[tab].label}</div>
              <div style={{ fontSize: 9, opacity: 0.85 }}>
                {LOCATIONS[tab].labelTe}
              </div>
            </button>
          ))}
        </div>

        {/* Location name & address */}
        <div
          className="px-4 py-2"
          style={{ background: "#FFF8EC", borderBottom: "1px solid #e8d9b0" }}
        >
          <div className="font-bold" style={{ fontSize: 13, color: "#7B3F00" }}>
            {loc.name}
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
            {activeTab === "current"
              ? gpsStatus === "loading"
                ? "📡 Fetching your GPS location..."
                : gpsStatus === "error"
                  ? "❌ Could not get location. Please allow GPS access."
                  : currentCoords
                    ? `📍 ${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`
                    : "📡 Tap to fetch your location..."
              : loc.address}
          </div>
        </div>

        {/* Map iframe */}
        <div style={{ flex: 1, minHeight: 0 }}>
          {activeTab === "current" && !currentMapSrc ? (
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: 260, background: "#f5edd8", color: "#7B3F00" }}
            >
              {gpsStatus === "error" ? (
                <>
                  <div style={{ fontSize: 32 }}>❌</div>
                  <div className="font-bold mt-2" style={{ fontSize: 13 }}>
                    Location access denied
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, color: "#888" }}>
                    Please enable GPS in your browser settings
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32 }}>📡</div>
                  <div className="font-bold mt-2" style={{ fontSize: 13 }}>
                    Fetching your location...
                  </div>
                </>
              )}
            </div>
          ) : (
            <iframe
              key={activeTab + (currentCoords ? currentCoords.lat : "")}
              title={loc.name}
              src={getMapSrc(activeTab)}
              width="100%"
              height="260"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 py-3 justify-center">
          {getDirections(activeTab) && (
            <a
              href={getDirections(activeTab)}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="footer.map.directions.button"
              className="font-bold rounded text-white no-underline"
              style={{
                background: "#D4800A",
                padding: "6px 16px",
                fontSize: 12,
              }}
            >
              🗺️ Get Directions / దిశలు పొందండి
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            data-ocid="footer.map.cancel_button"
            className="font-bold rounded"
            style={{
              background: "#F6F0E2",
              padding: "6px 16px",
              fontSize: 12,
              border: "1px solid #D4800A",
              color: "#7B3F00",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
