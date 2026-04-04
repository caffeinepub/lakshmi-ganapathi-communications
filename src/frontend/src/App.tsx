import { useState } from "react";
import { MapModal } from "./components/MapModal";
import { PasswordGate } from "./components/PasswordGate";

function WhatsAppIcon() {
  return (
    <svg
      role="img"
      aria-label="WhatsApp"
      viewBox="0 0 24 24"
      fill="#25D366"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <title>WhatsApp</title>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.857L.057 23.882a.5.5 0 0 0 .61.61l6.109-1.458A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 0 1-5.074-1.383l-.364-.216-3.768.899.914-3.684-.236-.378A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg
      role="img"
      aria-label="Telegram"
      viewBox="0 0 24 24"
      fill="#0088cc"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <title>Telegram</title>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.892z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg
      role="img"
      aria-label="Facebook"
      viewBox="0 0 24 24"
      fill="#1877F2"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <title>Facebook</title>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg
      role="img"
      aria-label="Instagram"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <title>Instagram</title>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        fill="url(#ig-grad)"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
      />
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg
      role="img"
      aria-label="Twitter X"
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <title>Twitter X</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const PAYMENT_LINK =
  "https://prdcfms.apcfss.in:44300/sap/bc/ui5_ui5/sap/zfi_rcp_challan/index.html?sap-client=350";

type Unit =
  | "sqft"
  | "sqyd"
  | "sqm"
  | "gadi"
  | "guntha"
  | "cent"
  | "bigha"
  | "acre"
  | "hectare";
const UNIT_LABELS: Record<Unit, { en: string; te: string }> = {
  sqft: { en: "Sq Ft", te: "చ.అ" },
  sqyd: { en: "Sq Yards", te: "చ.గ" },
  sqm: { en: "Sq Meters", te: "చ.మీ" },
  gadi: { en: "Gadhulu", te: "గడి" },
  guntha: { en: "Guntha", te: "గుంట" },
  cent: { en: "Cents", te: "సెంట్" },
  bigha: { en: "Bigha", te: "బిఘా" },
  acre: { en: "Acre", te: "ఎకరం" },
  hectare: { en: "Hectare", te: "హెక్టార్" },
};
const UNITS: Unit[] = [
  "sqft",
  "sqyd",
  "sqm",
  "gadi",
  "guntha",
  "cent",
  "bigha",
  "acre",
  "hectare",
];

function toSqFt(val: number, unit: Unit): number {
  if (!val) return 0;
  switch (unit) {
    case "sqft":
      return val;
    case "sqyd":
      return val * 9;
    case "sqm":
      return val * 10.7639;
    case "gadi":
      return val * 72;
    case "guntha":
      return val * 1089;
    case "cent":
      return val * 435.6;
    case "bigha":
      return val * 14400;
    case "acre":
      return val * 43560;
    case "hectare":
      return val * 107639.104;
  }
}
function fromSqFt(sqft: number, unit: Unit): number {
  if (!sqft) return 0;
  switch (unit) {
    case "sqft":
      return sqft;
    case "sqyd":
      return sqft / 9;
    case "sqm":
      return sqft / 10.7639;
    case "gadi":
      return sqft / 72;
    case "guntha":
      return sqft / 1089;
    case "cent":
      return sqft / 435.6;
    case "bigha":
      return sqft / 14400;
    case "acre":
      return sqft / 43560;
    case "hectare":
      return sqft / 107639.104;
  }
}
function fmt(n: number): string {
  if (!n) return "0";
  if (n > 1000) return n.toFixed(2);
  return n.toFixed(4);
}

type DeedType =
  | "sale"
  | "gift"
  | "partition"
  | "mortgage"
  | "cancellation"
  | "receipt";
const DEED_LABELS: Record<DeedType, string> = {
  sale: "Sale Deed",
  gift: "Gift Deed",
  partition: "Partition Deed",
  mortgage: "Mortgage Deed",
  cancellation: "Cancellation Deed",
  receipt: "Receipt",
};
const DEED_RATES: Record<
  DeedType,
  { dsd: number | null; rf: number | null; rfFixed: number | null; uc: number }
> = {
  sale: { dsd: 0.065, rf: 0.01, rfFixed: null, uc: 600 },
  gift: { dsd: 0.02, rf: 0.005, rfFixed: null, uc: 600 },
  partition: { dsd: 0.03, rf: 0.005, rfFixed: null, uc: 600 },
  mortgage: { dsd: 0.005, rf: 0.001, rfFixed: null, uc: 600 },
  cancellation: { dsd: null, rf: null, rfFixed: 1000, uc: 500 },
  receipt: { dsd: null, rf: null, rfFixed: 1000, uc: 500 },
};

type PropType = "agricultural" | "land" | "room";
const PROP_TYPE_LABELS: Record<PropType, string> = {
  agricultural: "Agricultural / వ్యవసాయ",
  land: "Land / భూమి",
  room: "Room / గది",
};

// Directional field definitions with split English and Telugu labels
const DIR_FIELDS = [
  {
    id: "east-input",
    enLabel: "East",
    teLabel: "తూర్పు",
    ocid: "calc.east.input",
  },
  {
    id: "south-input",
    enLabel: "South",
    teLabel: "దక్షిణం",
    ocid: "calc.south.input",
  },
  {
    id: "west-input",
    enLabel: "West",
    teLabel: "పడమర",
    ocid: "calc.west.input",
  },
  {
    id: "north-input",
    enLabel: "North",
    teLabel: "ఉత్తరం",
    ocid: "calc.north.input",
  },
] as const;

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [propType, setPropType] = useState<PropType>("land");
  const [rooms, setRooms] = useState("");
  const [east, setEast] = useState("");
  const [west, setWest] = useState("");
  const [north, setNorth] = useState("");
  const [south, setSouth] = useState("");
  // Unit is fixed to sqft — selector removed from Calculator box per user request
  const unit: Unit = "sqft";
  const [rate, setRate] = useState("");
  const [deedType, setDeedType] = useState<DeedType>("sale");
  const [propValue, setPropValue] = useState("");
  const [mapOpen, setMapOpen] = useState(false);

  const e = Number.parseFloat(east) || 0;
  const w = Number.parseFloat(west) || 0;
  const n = Number.parseFloat(north) || 0;
  const s = Number.parseFloat(south) || 0;
  const roomMult = propType === "room" ? Number.parseFloat(rooms) || 1 : 1;
  const avgEW = (e + w) / 2;
  const avgNS = (n + s) / 2;
  const areaSqFt =
    avgEW > 0 && avgNS > 0 ? toSqFt(avgEW * avgNS * roomMult, unit) : 0;
  const rateVal = Number.parseFloat(rate) || 0;
  const totalValue = areaSqFt * rateVal;

  const pv = Number.parseFloat(propValue) || 0;
  const dr = DEED_RATES[deedType];
  const dsd = dr.dsd !== null ? pv * dr.dsd : 0;
  const rf = dr.rfFixed !== null ? dr.rfFixed : dr.rf !== null ? pv * dr.rf : 0;
  const uc = dr.uc;
  const totalFees = dsd + rf + uc;

  const dirValues: Record<string, string> = {
    "east-input": east,
    "south-input": south,
    "west-input": west,
    "north-input": north,
  };
  const dirSetters: Record<string, (v: string) => void> = {
    "east-input": setEast,
    "south-input": setSouth,
    "west-input": setWest,
    "north-input": setNorth,
  };

  function useCalcTotal() {
    if (totalValue > 0) setPropValue(Math.round(totalValue).toString());
  }

  if (!unlocked) return <PasswordGate onSuccess={() => setUnlocked(true)} />;

  const sectionHeadStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #D4800A 0%, #b86a00 100%)",
    color: "#FFD700",
    fontWeight: 900,
    fontSize: "clamp(13px,1.6vw,18px)",
    textAlign: "center",
    padding: "5px 4px",
    letterSpacing: "0.04em",
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
    flexShrink: 0,
    fontFamily: "serif",
  };

  // English part of directional labels — attractive bold font
  const dirEnStyle: React.CSSProperties = {
    fontSize: "clamp(15px,1.9vw,23px)",
    color: "#2E1A0C",
    fontWeight: 900,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontStyle: "italic",
    letterSpacing: "0.04em",
    textShadow: "0 1px 2px rgba(212,128,10,0.3)",
  };

  // Telugu part of directional labels — normal weight
  const dirTeStyle: React.CSSProperties = {
    fontSize: "clamp(12px,1.5vw,18px)",
    color: "#5A3A00",
    fontWeight: 400,
    fontFamily: "'Noto Sans Telugu', 'Gautami', sans-serif",
  };

  const dirLabelWrapStyle: React.CSSProperties = {
    minWidth: 110,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1.15,
  };

  const dirInputStyle: React.CSSProperties = {
    fontSize: "clamp(16px,2vw,26px)",
    padding: "4px 8px",
    fontWeight: 900,
    minHeight: 34,
    textAlign: "center",
    flex: 1,
    minWidth: 0,
    width: "60px",
    maxWidth: "90px",
  };

  // Shared button style matching deed type buttons in Registration Fees box
  const propTypeBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "4px 10px",
    fontSize: "clamp(10px,1.2vw,14px)",
    fontWeight: 900,
    letterSpacing: "0.03em",
    background: active ? "#D4800A" : "#F6F0E2",
    color: active ? "#fff" : "#2E1A0C",
    border: "1px solid #D4800A",
    borderRadius: 4,
  });

  return (
    <div
      className="flex flex-col bg-background text-foreground"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* ══ BANNER ══ */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{ height: "42vh", position: "relative", overflow: "hidden" }}
        >
          <img
            src="/assets/12-019d4c94-db38-753e-b747-bc6488393d28.png"
            alt="Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Branding overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "48%",
              background:
                "linear-gradient(135deg, rgba(5,5,25,0.92) 0%, rgba(20,10,50,0.85) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "10px 14px",
              gap: 6,
              borderRight: "3px solid #D4800A",
              boxShadow: "4px 0 18px rgba(212,128,10,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 2,
              }}
            >
              <img
                src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
                alt="Logo"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #FFD700",
                  boxShadow:
                    "0 0 16px 4px rgba(255,215,0,0.7), 0 0 6px 2px rgba(212,128,10,0.8)",
                  flexShrink: 0,
                }}
              />
              <h1
                className="font-serif font-bold"
                style={{
                  color: "#FFD700",
                  fontSize: "clamp(14px,2.2vw,30px)",
                  lineHeight: 1.15,
                  margin: 0,
                  whiteSpace: "nowrap",
                  textShadow:
                    "0 0 12px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                  filter: "drop-shadow(0 0 6px #D4800A)",
                }}
              >
                Lakshmi Ganapathi Communications
              </h1>
            </div>
            <div
              style={{
                background: "rgba(212,128,10,0.25)",
                border: "1.5px solid #FFD700",
                borderRadius: 6,
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{ fontSize: "clamp(11px,1.5vw,18px)", color: "#FFD700" }}
              >
                📞
              </span>
              <span
                className="font-bold font-mono"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(11px,1.4vw,17px)",
                  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  letterSpacing: "0.05em",
                }}
              >
                Phone: +91 9848872469
              </span>
            </div>
            <div
              style={{
                background: "rgba(212,128,10,0.18)",
                border: "1.5px solid #D4800A",
                borderRadius: 6,
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{ fontSize: "clamp(11px,1.5vw,18px)", color: "#FFD700" }}
              >
                ✉
              </span>
              <a
                href="mailto:nageswaraprasadtv@gmail.com"
                className="font-bold"
                style={{
                  color: "#FFD700",
                  fontSize: "clamp(10px,1.25vw,15px)",
                  textDecoration: "none",
                  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  wordBreak: "break-all",
                }}
              >
                Email Id: nageswaraprasadtv@gmail.com
              </a>
            </div>
            <div
              style={{
                background: "rgba(255,215,0,0.12)",
                border: "1.5px solid #FFD700",
                borderRadius: 6,
                padding: "4px 10px",
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: "#FFD700",
                  fontSize: "clamp(10px,1.3vw,16px)",
                  textShadow:
                    "0 0 8px rgba(255,215,0,0.6), 0 1px 4px rgba(0,0,0,0.9)",
                  display: "block",
                }}
              >
                🏢 Prop: Tiruvaipati Venkata Nageswara Prasad
              </span>
            </div>
          </div>
        </div>

        {/* External link buttons */}
        <div
          className="flex gap-2 px-3 py-1 justify-center flex-wrap"
          style={{ flexShrink: 0 }}
        >
          {[
            {
              href: "https://registration.ec.ap.gov.in/ecSearch",
              label: "E.C Search",
            },
            {
              href: "https://registration.ap.gov.in/igrs/newPropertyvalue",
              label: "Market Value",
            },
            {
              href: "https://registration.ap.gov.in/igrs/ppProperty",
              label: "Prohibited Property",
            },
            { href: "https://meebhoomi.ap.gov.in/", label: "Mee Bhoomi" },
            {
              href: "https://cdma.ap.gov.in/services/payments/",
              label: "Property Tax",
            },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold rounded text-white no-underline"
              style={{
                background: "#D4800A",
                padding: "3px 12px",
                fontSize: "clamp(9px,1.1vw,13px)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ══ MAIN CONTENT — 3 EQUAL COLUMNS ══ */}
      <main
        className="flex flex-row"
        style={{ flex: "1 1 0", overflow: "hidden", minHeight: 0 }}
      >
        {/* COLUMN 1: Calculator Inputs */}
        <section
          className="flex flex-col border-r border-border"
          style={{ flex: "1 1 33.33%", overflow: "hidden" }}
        >
          <div style={sectionHeadStyle}>Calculator</div>
          <div
            className="flex flex-col overflow-y-auto"
            style={{ flex: 1, padding: "4px 8px 6px", gap: 5 }}
          >
            {/* Property type — styled to match deed type buttons */}
            <div
              className="flex gap-1 justify-center flex-wrap"
              style={{ flexShrink: 0 }}
            >
              {(["agricultural", "land", "room"] as PropType[]).map((pt) => (
                <button
                  key={pt}
                  type="button"
                  data-ocid={`calc.${pt}.toggle`}
                  onClick={() => setPropType(pt)}
                  className="font-bold"
                  style={propTypeBtnStyle(propType === pt)}
                >
                  {PROP_TYPE_LABELS[pt]}
                </button>
              ))}
            </div>

            {propType === "room" && (
              <div
                className="flex items-center gap-1"
                style={{ flexShrink: 0 }}
              >
                <span
                  className="font-bold"
                  style={{ fontSize: "clamp(13px,1.5vw,18px)", minWidth: 70 }}
                >
                  Rooms / గదులు
                </span>
                <input
                  id="rooms-input"
                  type="number"
                  value={rooms}
                  onChange={(ev) => setRooms(ev.target.value)}
                  data-ocid="calc.rooms.input"
                  placeholder="Count"
                  className="border border-border rounded"
                  style={{
                    width: 70,
                    fontSize: "clamp(13px,1.5vw,18px)",
                    padding: "2px 4px",
                  }}
                />
              </div>
            )}

            {/* Directional inputs — split English (bold italic) and Telugu (normal) labels */}
            <div className="flex flex-col gap-1" style={{ flexShrink: 0 }}>
              {DIR_FIELDS.map(({ id, enLabel, teLabel, ocid }) => (
                <div key={id} className="flex items-center gap-2">
                  <label htmlFor={id} style={dirLabelWrapStyle}>
                    <span style={dirEnStyle}>{enLabel}</span>
                    <span style={dirTeStyle}>{teLabel}</span>
                  </label>
                  <input
                    id={id}
                    type="number"
                    value={dirValues[id]}
                    onChange={(ev) => dirSetters[id](ev.target.value)}
                    data-ocid={ocid}
                    placeholder="0"
                    className="border border-border rounded text-center"
                    style={dirInputStyle}
                  />
                </div>
              ))}
            </div>

            {/* Rate input */}
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <label htmlFor="rate-input" style={{ ...dirLabelWrapStyle }}>
                <span style={dirEnStyle}>Rate (₹)</span>
                <span style={dirTeStyle}>రేటు</span>
              </label>
              <input
                id="rate-input"
                type="number"
                value={rate}
                onChange={(ev) => setRate(ev.target.value)}
                data-ocid="calc.rate.input"
                placeholder="per sq ft"
                className="border border-border rounded"
                style={{
                  fontSize: "clamp(16px,2vw,26px)",
                  padding: "4px 8px",
                  fontWeight: 900,
                  minHeight: 34,
                  width: "60px",
                  maxWidth: "90px",
                  flex: 1,
                  minWidth: 0,
                  textAlign: "center",
                }}
              />
            </div>

            {/* Clear button */}
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => {
                  setEast("");
                  setSouth("");
                  setWest("");
                  setNorth("");
                  setRate("");
                }}
                data-ocid="calc.clear.button"
                className="rounded font-bold text-white"
                style={{
                  background: "#c0392b",
                  padding: "3px 18px",
                  fontSize: "clamp(10px,1.2vw,14px)",
                  border: "1px solid #922b21",
                }}
              >
                Clear / క్లియర్
              </button>
            </div>
          </div>
        </section>

        {/* COLUMN 2: Results */}
        <section
          className="flex flex-col border-r border-border"
          style={{ flex: "1 1 33.33%", overflow: "hidden" }}
        >
          <div style={sectionHeadStyle}>Results</div>
          <div
            className="flex flex-col overflow-y-auto"
            style={{ flex: 1, padding: "6px 8px" }}
          >
            {areaSqFt > 0 ? (
              <div
                className="rounded border p-2 mb-2"
                style={{
                  background: "#FBF6EA",
                  borderColor: "#D4800A",
                  fontSize: "clamp(11px,1.3vw,15px)",
                }}
                data-ocid="calc.results.panel"
              >
                <div
                  className="font-bold mb-1"
                  style={{
                    color: "#D4800A",
                    fontSize: "clamp(13px,1.5vw,17px)",
                    textAlign: "center",
                  }}
                >
                  Area Conversions / విస్తీర్ణం
                </div>
                <div className="grid grid-cols-1 gap-y-0.5">
                  {UNITS.map((u) => (
                    <div
                      key={u}
                      className="flex justify-between gap-1"
                      style={{
                        borderBottom: "1px dotted #D4800A",
                        paddingBottom: 2,
                      }}
                    >
                      <span
                        className="font-bold"
                        style={{
                          color: "#7A3A00",
                          fontSize: "clamp(11px,1.3vw,15px)",
                        }}
                      >
                        {UNIT_LABELS[u].en}
                      </span>
                      <span className="flex gap-1 items-center">
                        <span
                          className="font-bold"
                          style={{
                            color: "#1A1A1A",
                            fontSize: "clamp(11px,1.3vw,15px)",
                          }}
                        >
                          {fmt(fromSqFt(areaSqFt, u))}
                        </span>
                        <span
                          className="font-bold"
                          style={{
                            color: "#7A3A00",
                            fontSize: "clamp(11px,1.3vw,15px)",
                          }}
                        >
                          {UNIT_LABELS[u].te}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                {rateVal > 0 && (
                  <div
                    className="font-bold mt-2 text-center rounded p-1"
                    style={{
                      color: "#fff",
                      fontSize: "clamp(10px,1.3vw,15px)",
                      background: "linear-gradient(90deg, #D4800A, #b86a00)",
                      textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Estimated Value / అంచనా విలువ
                    <br />₹{Math.round(totalValue).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center h-full"
                style={{
                  color: "#7A5A2A",
                  fontSize: "clamp(9px,1vw,12px)",
                  textAlign: "center",
                  opacity: 0.7,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>📐</div>
                <div className="font-bold">
                  Enter East, South, West, North
                  <br />
                  to see results
                </div>
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 3: Registration Fees */}
        <section
          className="flex flex-col"
          style={{ flex: "1 1 33.33%", overflow: "hidden" }}
        >
          <div style={sectionHeadStyle}>Registration Fees</div>
          <div
            className="flex flex-col overflow-y-auto"
            style={{ flex: 1, padding: "4px 8px 6px", gap: 5 }}
          >
            {/* Deed type selector */}
            <div
              className="flex flex-wrap gap-1 justify-center"
              style={{ flexShrink: 0 }}
            >
              {(Object.keys(DEED_LABELS) as DeedType[]).map((dt) => (
                <button
                  key={dt}
                  type="button"
                  data-ocid={`regfees.${dt}.toggle`}
                  onClick={() => setDeedType(dt)}
                  className="rounded font-bold"
                  style={{
                    padding: "4px 10px",
                    fontSize: "clamp(10px,1.2vw,14px)",
                    fontWeight: 900,
                    letterSpacing: "0.03em",
                    background: deedType === dt ? "#D4800A" : "#F6F0E2",
                    color: deedType === dt ? "#fff" : "#2E1A0C",
                    border: "1px solid #D4800A",
                  }}
                >
                  {DEED_LABELS[dt]}
                </button>
              ))}
            </div>

            {/* Property value input */}
            <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
              <label
                htmlFor="prop-value-input"
                className="font-bold"
                style={{
                  fontSize: "clamp(11px,1.4vw,16px)",
                  minWidth: 110,
                  color: "#2E1A0C",
                }}
              >
                Property Value / ఆస్తి విలువ
              </label>
              <input
                id="prop-value-input"
                type="number"
                value={propValue}
                onChange={(ev) => setPropValue(ev.target.value)}
                data-ocid="regfees.property_value.input"
                placeholder="₹"
                className="border border-border rounded flex-1"
                style={{
                  fontSize: "clamp(12px,1.5vw,18px)",
                  padding: "2px 4px",
                }}
              />
              <button
                type="button"
                onClick={useCalcTotal}
                data-ocid="regfees.use_calc.button"
                className="rounded font-bold text-white flex-shrink-0"
                style={{
                  background: "#D4800A",
                  padding: "2px 6px",
                  fontSize: "clamp(7px,0.8vw,9px)",
                  whiteSpace: "nowrap",
                }}
              >
                Use Calc
              </button>
            </div>

            {/* Rates table */}
            <div
              className="rounded border"
              style={{
                borderColor: "#D4800A",
                overflow: "hidden",
                fontSize: "clamp(6px,0.75vw,8px)",
                flexShrink: 0,
              }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#D4800A", color: "#FFD700" }}>
                    <th className="font-bold px-1 py-0.5 text-left">
                      Deed Type
                    </th>
                    <th className="font-bold px-1 py-0.5 text-right">DSD</th>
                    <th className="font-bold px-1 py-0.5 text-right">R.F</th>
                    <th className="font-bold px-1 py-0.5 text-right">U.C</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(DEED_LABELS) as DeedType[]).map((dt, i) => {
                    const dr2 = DEED_RATES[dt];
                    return (
                      <tr
                        key={dt}
                        style={{
                          background: i % 2 === 0 ? "#FBF6EA" : "#F6F0E2",
                        }}
                        data-ocid={`regfees.rate_table.item.${i + 1}`}
                      >
                        <td className="px-1 py-0.5 font-bold">
                          {DEED_LABELS[dt]}
                        </td>
                        <td className="px-1 py-0.5 text-right">
                          {dr2.dsd !== null
                            ? `${(dr2.dsd * 100).toFixed(1)}%`
                            : "—"}
                        </td>
                        <td className="px-1 py-0.5 text-right">
                          {dr2.rfFixed !== null
                            ? `₹${dr2.rfFixed}`
                            : dr2.rf !== null
                              ? `${(dr2.rf * 100).toFixed(1)}%`
                              : "—"}
                        </td>
                        <td className="px-1 py-0.5 text-right">₹{dr2.uc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Fee breakdown */}
            <div
              className="rounded border p-2 flex-1"
              style={{
                background: "#FBF6EA",
                borderColor: "#D4800A",
                fontSize: "clamp(13px,1.5vw,17px)",
                minHeight: 0,
              }}
              data-ocid="regfees.breakdown.panel"
            >
              <div
                className="font-bold mb-1 text-center"
                style={{
                  color: "#D4800A",
                  fontSize: "clamp(14px,1.6vw,20px)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                Fee Breakdown
              </div>
              {pv > 0 ? (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <a
                      href={PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline"
                      style={{
                        color: "#1A5FA8",
                        fontSize: "clamp(13px,1.5vw,17px)",
                      }}
                    >
                      DSD
                    </a>
                    <span
                      className="font-bold"
                      style={{
                        color: "#2E1A0C",
                        fontSize: "clamp(13px,1.5vw,17px)",
                      }}
                    >
                      {dr.dsd !== null
                        ? `₹${Math.round(dsd).toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href={PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline"
                      style={{
                        color: "#1A5FA8",
                        fontSize: "clamp(13px,1.5vw,17px)",
                      }}
                    >
                      R.F
                    </a>
                    <span
                      className="font-bold"
                      style={{
                        color: "#2E1A0C",
                        fontSize: "clamp(13px,1.5vw,17px)",
                      }}
                    >
                      ₹{Math.round(rf).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href={PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline"
                      style={{
                        color: "#1A5FA8",
                        fontSize: "clamp(12px,1.4vw,16px)",
                      }}
                    >
                      User Charges
                    </a>
                    <span
                      className="font-bold"
                      style={{
                        color: "#2E1A0C",
                        fontSize: "clamp(12px,1.4vw,16px)",
                      }}
                    >
                      ₹{uc.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div
                    className="flex justify-between font-bold rounded p-1"
                    style={{
                      color: "#fff",
                      background: "linear-gradient(90deg,#D4800A,#b86a00)",
                      fontSize: "clamp(14px,1.7vw,21px)",
                      marginTop: 4,
                    }}
                  >
                    <span>Total:</span>
                    <span>
                      ₹{Math.round(totalFees).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    color: "#7A5A2A",
                    fontSize: "clamp(7px,0.82vw,10px)",
                  }}
                >
                  Enter property value above to see fee breakdown.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══ */}
      <footer
        style={{
          flexShrink: 0,
          background:
            "linear-gradient(90deg, #1a0a00 0%, #2E1A0C 60%, #1a0a00 100%)",
          borderTop: "2px solid #D4800A",
          padding: "3px 10px 2px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 44,
          maxHeight: 54,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="font-bold"
            style={{
              color: "#FFD700",
              fontSize: "clamp(7px,0.9vw,11px)",
              lineHeight: 1.3,
              textShadow: "0 0 6px rgba(255,215,0,0.4)",
            }}
          >
            Prop: Tiruvaipati Venkata Nageswara Prasad
          </div>
          <div
            className="font-bold"
            style={{
              color: "#FFA040",
              fontSize: "clamp(6px,0.75vw,9px)",
              lineHeight: 1.2,
            }}
          >
            Shop No-22, Pullareddy Complex, Beside Registration Office, Near
            Ravi Priya Mall, Ongole, AP - 523002
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="tel:+919848872469"
              className="font-bold"
              style={{
                color: "#FFD700",
                fontSize: "clamp(7px,0.85vw,10px)",
                textDecoration: "none",
                textShadow: "0 0 4px rgba(255,215,0,0.4)",
              }}
            >
              📞 +91 9848872469
            </a>
            <a
              href="mailto:nageswaraprasadtv@gmail.com"
              className="font-bold"
              style={{
                color: "#FFA040",
                fontSize: "clamp(6px,0.75vw,9px)",
                textDecoration: "none",
              }}
            >
              ✉ nageswaraprasadtv@gmail.com
            </a>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {[
            {
              href: "https://wa.me/919848872469",
              icon: <WhatsAppIcon />,
              ocid: "footer.whatsapp.button",
            },
            {
              href: "https://t.me/",
              icon: <TelegramIcon />,
              ocid: "footer.telegram.button",
            },
            {
              href: "https://facebook.com/",
              icon: <FacebookIcon />,
              ocid: "footer.facebook.button",
            },
            {
              href: "https://instagram.com/",
              icon: <InstagramIcon />,
              ocid: "footer.instagram.button",
            },
            {
              href: "https://twitter.com/",
              icon: <TwitterXIcon />,
              ocid: "footer.twitter.button",
            },
          ].map(({ href, icon, ocid }) => (
            <a
              key={ocid}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={ocid}
              className="rounded-full flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                padding: 2,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #D4800A",
              }}
            >
              {icon}
            </a>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            data-ocid="footer.view_location.button"
            className="font-bold rounded text-white"
            style={{
              background: "linear-gradient(90deg,#D4800A,#b86a00)",
              padding: "2px 10px",
              fontSize: "clamp(7px,0.85vw,10px)",
              border: "1px solid #FFD700",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              boxShadow: "0 0 6px rgba(212,128,10,0.4)",
            }}
          >
            📍 View Location / స్థానం చూడండి
          </button>
          <div style={{ fontSize: "clamp(5px,0.6vw,7px)", color: "#7A5A2A" }}>
            © {new Date().getFullYear()} Lakshmi Ganapathi Communications ·{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#D4800A" }}
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {mapOpen && <MapModal onClose={() => setMapOpen(false)} />}
    </div>
  );
}
