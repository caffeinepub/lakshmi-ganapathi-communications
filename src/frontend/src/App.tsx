import { useState } from "react";
import { PasswordGate } from "./components/PasswordGate";

// ─── SVG Social Icons ────────────────────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg
      role="img"
      aria-label="WhatsApp"
      viewBox="0 0 24 24"
      fill="#25D366"
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
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
      width="22"
      height="22"
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
      width="22"
      height="22"
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
      width="22"
      height="22"
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
      width="22"
      height="22"
    >
      <title>Twitter X</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Unit types ──────────────────────────────────────────────────────────────
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
  gadi: { en: "Gadi", te: "గడి" },
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

// ─── Deed type definitions ────────────────────────────────────────────────────
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

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  // Calculator state
  const [propType, setPropType] = useState<PropType>("land");
  const [rooms, setRooms] = useState("");
  const [east, setEast] = useState("");
  const [west, setWest] = useState("");
  const [north, setNorth] = useState("");
  const [south, setSouth] = useState("");
  const [unit, setUnit] = useState<Unit>("sqft");
  const [rate, setRate] = useState("");

  // Reg fees state
  const [deedType, setDeedType] = useState<DeedType>("sale");
  const [propValue, setPropValue] = useState("");

  // Map modal
  const [mapOpen, setMapOpen] = useState(false);

  // ─── Area calculation
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

  // ─── Registration fee calculation
  const pv = Number.parseFloat(propValue) || 0;
  const dr = DEED_RATES[deedType];
  const dsd = dr.dsd !== null ? pv * dr.dsd : 0;
  const rf = dr.rfFixed !== null ? dr.rfFixed : dr.rf !== null ? pv * dr.rf : 0;
  const uc = dr.uc;
  const totalFees = dsd + rf + uc;

  function useCalcTotal() {
    if (totalValue > 0) setPropValue(Math.round(totalValue).toString());
  }

  if (!unlocked) {
    return <PasswordGate onSuccess={() => setUnlocked(true)} />;
  }

  return (
    <div
      className="flex flex-col bg-background text-foreground"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* ══ HEADER (auto height) ══ */}
      <header
        className="flex flex-col border-b border-border"
        style={{ height: "auto", flexShrink: 0 }}
      >
        {/* Logo banner */}
        <div
          style={{ flexShrink: 0, overflow: "hidden", background: "#1A1A3E" }}
        >
          <img
            src="/assets/generated/lgc-logo.dim_800x400.png"
            alt="Lakshmi Ganapathi Communications Logo"
            style={{
              width: "100%",
              maxHeight: 120,
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>

        {/* Branding row */}
        <div
          className="flex items-center gap-2 px-3 py-1"
          style={{ flex: "0 0 auto" }}
        >
          <img
            src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
            alt="Lakshmi Ganapathi Communications"
            className="rounded-full object-cover border-2 flex-shrink-0"
            style={{ width: 52, height: 52, borderColor: "#D4800A" }}
          />
          <div className="flex flex-col min-w-0 flex-1">
            <h1
              className="font-serif font-bold leading-tight"
              style={{
                color: "#D4800A",
                fontSize: "clamp(12px,2vw,20px)",
                lineHeight: 1.2,
              }}
            >
              Lakshmi Ganapathi Communications
            </h1>
            <div
              className="flex flex-wrap gap-x-3 gap-y-0 items-center"
              style={{ fontSize: "clamp(9px,1.1vw,12px)" }}
            >
              <span
                className="font-bold font-mono"
                style={{ color: "#2E1A0C" }}
              >
                Phone: +91 9848872469
              </span>
              <a
                href="mailto:nageswaraprasadtv@gmail.com"
                className="font-bold"
                style={{ color: "#D4800A" }}
              >
                Email Id: nageswaraprasadtv@gmail.com
              </a>
              <span className="font-bold" style={{ color: "#D4800A" }}>
                Prop: Tiruvaipati Venkata Nageswara Prasad
              </span>
            </div>
          </div>
        </div>

        {/* Banner image — 45vh */}
        <div
          style={{
            height: "45vh",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src="/assets/12-019d4c94-db38-753e-b747-bc6488393d28.png"
            alt="Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 3 external link buttons */}
        <div
          className="flex gap-2 px-3 py-1 justify-center flex-wrap"
          style={{ flex: "0 0 auto" }}
        >
          <a
            href="https://registration.ec.ap.gov.in/ecSearch"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="header.ec_search.button"
            className="font-bold rounded text-white no-underline"
            style={{
              background: "#D4800A",
              padding: "3px 12px",
              fontSize: "clamp(9px,1.1vw,13px)",
              whiteSpace: "nowrap",
            }}
          >
            E.C Search
          </a>
          <a
            href="https://registration.ap.gov.in/igrs/newPropertyvalue"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="header.market_value.button"
            className="font-bold rounded text-white no-underline"
            style={{
              background: "#D4800A",
              padding: "3px 12px",
              fontSize: "clamp(9px,1.1vw,13px)",
              whiteSpace: "nowrap",
            }}
          >
            Market Value
          </a>
          <a
            href="https://registration.ap.gov.in/igrs/ppProperty"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="header.prohibited.button"
            className="font-bold rounded text-white no-underline"
            style={{
              background: "#D4800A",
              padding: "3px 12px",
              fontSize: "clamp(9px,1.1vw,13px)",
              whiteSpace: "nowrap",
            }}
          >
            Prohibited Property
          </a>
          <a
            href="https://meebhoomi.ap.gov.in/"
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
            Mee Bhoomi
          </a>
        </div>
      </header>

      {/* ══ MAIN CONTENT ══ */}
      <main
        className="flex flex-row"
        style={{ flex: "1 1 auto", overflow: "hidden", minHeight: 0 }}
      >
        {/* LEFT: Calculator — flex 1.5 for bigger size */}
        <section
          className="flex flex-col border-r border-border"
          style={{
            flex: "0 0 35%",
            width: "35%",
            overflowY: "auto",
            padding: "5px 10px",
          }}
        >
          <div
            className="font-bold text-center font-serif mb-1"
            style={{ color: "#D4800A", fontSize: "clamp(11px,1.4vw,16px)" }}
          >
            Calculator / లెక్కింపు
          </div>

          {/* Property type */}
          <div className="flex gap-1 mb-1 justify-center flex-wrap">
            {(["agricultural", "land", "room"] as PropType[]).map((pt) => (
              <button
                key={pt}
                type="button"
                data-ocid={`calc.${pt}.toggle`}
                onClick={() => setPropType(pt)}
                className="rounded-full font-bold"
                style={{
                  padding: "2px 10px",
                  fontSize: "clamp(9px,1.05vw,12px)",
                  background: propType === pt ? "#D4800A" : "#F6F0E2",
                  color: propType === pt ? "#fff" : "#2E1A0C",
                  border: "1px solid #D4800A",
                }}
              >
                {pt === "agricultural"
                  ? "Agricultural / వ్యవసాయ"
                  : pt === "land"
                    ? "Land / భూమి"
                    : "Room / గది"}
              </button>
            ))}
          </div>

          {/* Rooms count */}
          {propType === "room" && (
            <div className="flex items-center gap-1 mb-1">
              <span
                className="font-bold"
                style={{ fontSize: "clamp(9px,1vw,12px)", minWidth: 75 }}
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
                  width: 60,
                  fontSize: "clamp(9px,1vw,12px)",
                  padding: "2px 5px",
                }}
              />
            </div>
          )}

          {/* Unit selector */}
          <div className="flex flex-wrap gap-1 mb-1 justify-center">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                data-ocid={`calc.unit.${u}.toggle`}
                onClick={() => setUnit(u)}
                className="rounded font-bold"
                style={{
                  padding: "1px 7px",
                  fontSize: "clamp(8px,0.95vw,11px)",
                  background: unit === u ? "#D4800A" : "#F6F0E2",
                  color: unit === u ? "#fff" : "#2E1A0C",
                  border: "1px solid #D4800A",
                }}
              >
                {UNIT_LABELS[u].en} / {UNIT_LABELS[u].te}
              </button>
            ))}
          </div>

          {/* Directional inputs */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-1">
            {[
              {
                id: "east-input",
                label: "East / తూర్పు",
                val: east,
                set: setEast,
                ocid: "calc.east.input",
              },
              {
                id: "west-input",
                label: "West / పడమర",
                val: west,
                set: setWest,
                ocid: "calc.west.input",
              },
              {
                id: "north-input",
                label: "North / ఉత్తర",
                val: north,
                set: setNorth,
                ocid: "calc.north.input",
              },
              {
                id: "south-input",
                label: "South / దక్షిణ",
                val: south,
                set: setSouth,
                ocid: "calc.south.input",
              },
            ].map(({ id, label, val, set, ocid }) => (
              <div key={ocid} className="flex flex-col">
                <label
                  htmlFor={id}
                  className="font-bold"
                  style={{ fontSize: "clamp(8px,0.95vw,11px)" }}
                >
                  {label}
                </label>
                <input
                  id={id}
                  type="number"
                  value={val}
                  onChange={(ev) => set(ev.target.value)}
                  data-ocid={ocid}
                  placeholder="0"
                  className="border border-border rounded"
                  style={{
                    fontSize: "clamp(9px,1vw,12px)",
                    padding: "3px 5px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Rate input */}
          <div className="flex items-center gap-1 mb-1">
            <label
              htmlFor="rate-input"
              className="font-bold"
              style={{ fontSize: "clamp(9px,1vw,12px)", minWidth: 80 }}
            >
              Rate (₹) / రేటు
            </label>
            <input
              id="rate-input"
              type="number"
              value={rate}
              onChange={(ev) => setRate(ev.target.value)}
              data-ocid="calc.rate.input"
              placeholder="per sq ft"
              className="border border-border rounded flex-1"
              style={{ fontSize: "clamp(9px,1vw,12px)", padding: "3px 5px" }}
            />
          </div>

          {/* Live results */}
          {areaSqFt > 0 && (
            <div
              className="rounded border p-1"
              style={{
                background: "#FBF6EA",
                borderColor: "#D4800A",
                fontSize: "clamp(8px,0.95vw,11px)",
              }}
              data-ocid="calc.results.panel"
            >
              <div
                className="font-bold mb-0.5"
                style={{ color: "#D4800A", fontSize: "clamp(9px,1vw,12px)" }}
              >
                Results / ఫలితాలు
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                {UNITS.map((u) => (
                  <div key={u} className="flex justify-between gap-1">
                    <span className="font-bold">
                      {UNIT_LABELS[u].en}/{UNIT_LABELS[u].te}:
                    </span>
                    <span>{fmt(fromSqFt(areaSqFt, u))}</span>
                  </div>
                ))}
              </div>
              {rateVal > 0 && (
                <div
                  className="font-bold mt-0.5"
                  style={{
                    color: "#D4800A",
                    fontSize: "clamp(9px,1vw,12px)",
                  }}
                >
                  Estimated Value / అంచనా విలువ: ₹
                  {Math.round(totalValue).toLocaleString("en-IN")}
                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT: Registration Fees */}
        <section
          className="flex flex-col"
          style={{ flex: "1 1 65%", overflowY: "auto", padding: "5px 8px" }}
        >
          <div
            className="font-bold text-center font-serif mb-1"
            style={{ color: "#D4800A", fontSize: "clamp(10px,1.2vw,14px)" }}
          >
            Registration Fees / నమోదు రుసుము
          </div>

          {/* Deed type selector */}
          <div className="flex flex-wrap gap-1 mb-1 justify-center">
            {(Object.keys(DEED_LABELS) as DeedType[]).map((dt) => (
              <button
                key={dt}
                type="button"
                data-ocid={`regfees.${dt}.toggle`}
                onClick={() => setDeedType(dt)}
                className="rounded font-bold"
                style={{
                  padding: "1px 7px",
                  fontSize: "clamp(7px,0.85vw,10px)",
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
          <div className="flex items-center gap-1 mb-1">
            <label
              htmlFor="prop-value-input"
              className="font-bold"
              style={{ fontSize: "clamp(7px,0.85vw,10px)", minWidth: 85 }}
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
              style={{ fontSize: "clamp(8px,0.9vw,11px)", padding: "2px 4px" }}
            />
            <button
              type="button"
              onClick={useCalcTotal}
              data-ocid="regfees.use_calc.button"
              className="rounded font-bold text-white flex-shrink-0"
              style={{
                background: "#D4800A",
                padding: "2px 7px",
                fontSize: "clamp(7px,0.8vw,10px)",
                whiteSpace: "nowrap",
              }}
            >
              Use Calc
            </button>
          </div>

          {/* Rates reference table */}
          <div
            className="rounded border mb-1"
            style={{
              borderColor: "#D4800A",
              overflow: "hidden",
              fontSize: "clamp(6px,0.78vw,9px)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: "#D4800A", color: "#fff" }}>
                  <th className="font-bold px-1 py-0.5 text-left">Deed Type</th>
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
                      <td className="px-1 py-0.5">{DEED_LABELS[dt]}</td>
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
          {pv > 0 && (
            <div
              className="rounded border p-1"
              style={{
                background: "#FBF6EA",
                borderColor: "#D4800A",
                fontSize: "clamp(7px,0.85vw,10px)",
              }}
              data-ocid="regfees.breakdown.panel"
            >
              <div
                className="font-bold mb-0.5"
                style={{ color: "#D4800A", fontSize: "clamp(8px,0.9vw,11px)" }}
              >
                Fee Breakdown / రుసుము వివరాలు
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-bold">DSD / డీఎస్డీ:</span>
                  <span>
                    {dr.dsd !== null
                      ? `₹${Math.round(dsd).toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">R.F / నమోదు రుసుము:</span>
                  <span>₹{Math.round(rf).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">
                    User Charges / వినియోగదారు రుసుము:
                  </span>
                  <span>₹{uc.toLocaleString("en-IN")}</span>
                </div>
                <div
                  className="flex justify-between font-bold"
                  style={{
                    color: "#D4800A",
                    borderTop: "1px solid #D4800A",
                    paddingTop: 2,
                  }}
                >
                  <span>Total / మొత్తం:</span>
                  <span>₹{Math.round(totalFees).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ══ FOOTER ══ */}
      <footer
        className="border-t border-border flex flex-col justify-between"
        style={{
          height: "20vh",
          minHeight: 100,
          flexShrink: 0,
          padding: "8px 12px 4px",
        }}
      >
        <div className="flex flex-col md:flex-row gap-2 flex-1 min-h-0">
          {/* Contact info */}
          <div
            className="flex flex-col justify-center gap-0.5"
            style={{ flex: 1, fontSize: "clamp(8px,0.95vw,12px)" }}
          >
            <div
              className="font-bold"
              style={{ color: "#D4800A", fontSize: "clamp(9px,1vw,13px)" }}
            >
              Prop: Tiruvaipati Venkata Nageswara Prasad
            </div>
            <div
              className="font-bold"
              style={{ color: "#2E1A0C", lineHeight: 1.3 }}
            >
              Shop No-22, Pullareddy Complex, Beside Registration Office, Near
              Ravi Priya Mall, Ongole, Prakasam Dist, Andhra Pradesh, Pin -
              523002
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              <a
                href="tel:+919848872469"
                className="font-bold"
                style={{ color: "#2E1A0C" }}
              >
                📞 Phone: +91 9848872469
              </a>
              <a
                href="mailto:nageswaraprasadtv@gmail.com"
                className="font-bold"
                style={{ color: "#D4800A" }}
              >
                ✉ Email Id: nageswaraprasadtv@gmail.com
              </a>
            </div>
          </div>

          {/* Social + location */}
          <div
            className="flex flex-col justify-center items-center gap-1.5"
            style={{ flexShrink: 0 }}
          >
            <div className="flex gap-2 items-center">
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
                  className="rounded-full bg-white border border-border flex items-center justify-center"
                  style={{ width: 34, height: 34, padding: 4 }}
                >
                  {icon}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              data-ocid="footer.view_location.button"
              className="font-bold rounded text-white"
              style={{
                background: "#D4800A",
                padding: "4px 14px",
                fontSize: "clamp(9px,1vw,12px)",
              }}
            >
              📍 View Location / స్థానం చూడండి
            </button>
          </div>
        </div>

        {/* Attribution */}
        <div
          className="text-center"
          style={{
            fontSize: "clamp(7px,0.75vw,9px)",
            color: "#7A5A2A",
            marginTop: 2,
          }}
        >
          © {new Date().getFullYear()} Lakshmi Ganapathi Communications · Built
          with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#D4800A" }}
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* ══ MAP MODAL ══ */}
      {mapOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setMapOpen(false);
          }}
          onKeyDown={(ev) => {
            if (ev.key === "Escape") setMapOpen(false);
          }}
          data-ocid="footer.map.modal"
        >
          <div
            className="rounded-lg overflow-hidden flex flex-col"
            style={{
              width: "min(90vw, 640px)",
              maxHeight: "80vh",
              background: "#FBF6EA",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-4 py-2 font-bold"
              style={{ background: "#D4800A", color: "#fff", fontSize: 14 }}
            >
              <span>📍 Lakshmi Ganapathi Communications</span>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                data-ocid="footer.map.close_button"
                className="rounded-full w-7 h-7 flex items-center justify-center font-bold"
                style={{ background: "rgba(255,255,255,0.25)", fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {/* Map embed */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <iframe
                title="Business Location"
                src="https://maps.google.com/maps?q=Pullareddy+Complex+Registration+Office+Ravi+Priya+Mall+Ongole+Prakasam+Andhra+Pradesh+523002&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Modal footer */}
            <div className="flex gap-2 px-4 py-3 justify-center">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Pullareddy+Complex+Registration+Office+Ongole+AP+523002"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.map.directions.button"
                className="font-bold rounded text-white no-underline"
                style={{
                  background: "#D4800A",
                  padding: "6px 16px",
                  fontSize: 13,
                }}
              >
                🗺️ Get Directions / దిశలు పొందండి
              </a>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                data-ocid="footer.map.cancel_button"
                className="font-bold rounded"
                style={{
                  background: "#F6F0E2",
                  padding: "6px 16px",
                  fontSize: 13,
                  border: "1px solid #D4800A",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
