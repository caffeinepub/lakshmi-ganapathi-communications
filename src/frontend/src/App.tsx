import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  Calculator,
  FileText,
  Home,
  Mail,
  MapPin,
  Phone,
  Ruler,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PasswordGate } from "./components/PasswordGate";

// ─── Types ────────────────────────────────────────────────────────────────────

type PropertyType = "Agricultural Land" | "Land" | "Room";
type Unit =
  | "Sq Ft"
  | "Sq Yards"
  | "Sq Meters"
  | "Gadi"
  | "Acre"
  | "Hectare"
  | "Guntha"
  | "Cents"
  | "Bigha";
type TabId = "home" | "calculator" | "regfees" | "contact";

// ─── Conversion Utilities ─────────────────────────────────────────────────────

const SQ_FT_PER_YARD = 9;
const SQ_FT_PER_METER = 10.7639;
const SQ_FT_PER_GADI = 72;
const SQ_FT_PER_GUNTHA = 1089;
const SQ_FT_PER_CENTS = 435.6;
const SQ_FT_PER_BIGHA = 14400;
const SQ_FT_PER_ACRE = 43560;
const SQ_FT_PER_HECTARE = 107639.104;

function toSqFt(value: number, unit: Unit): number {
  if (unit === "Sq Yards") return value * SQ_FT_PER_YARD;
  if (unit === "Sq Meters") return value * SQ_FT_PER_METER;
  if (unit === "Gadi") return value * SQ_FT_PER_GADI;
  if (unit === "Guntha") return value * SQ_FT_PER_GUNTHA;
  if (unit === "Cents") return value * SQ_FT_PER_CENTS;
  if (unit === "Bigha") return value * SQ_FT_PER_BIGHA;
  if (unit === "Acre") return value * SQ_FT_PER_ACRE;
  if (unit === "Hectare") return value * SQ_FT_PER_HECTARE;
  return value;
}

function fromSqFt(sqft: number, unit: Unit): number {
  if (unit === "Sq Yards") return sqft / SQ_FT_PER_YARD;
  if (unit === "Sq Meters") return sqft / SQ_FT_PER_METER;
  if (unit === "Gadi") return sqft / SQ_FT_PER_GADI;
  if (unit === "Guntha") return sqft / SQ_FT_PER_GUNTHA;
  if (unit === "Cents") return sqft / SQ_FT_PER_CENTS;
  if (unit === "Bigha") return sqft / SQ_FT_PER_BIGHA;
  if (unit === "Acre") return sqft / SQ_FT_PER_ACRE;
  if (unit === "Hectare") return sqft / SQ_FT_PER_HECTARE;
  return sqft;
}

function computeArea(
  east: number,
  west: number,
  north: number,
  south: number,
  unit: Unit,
  roomsCount: number,
  propertyType: PropertyType,
) {
  const avgEW = (east + west) / 2;
  const avgNS = (north + south) / 2;
  const rawArea = avgEW * avgNS;
  const multiplier = propertyType === "Room" ? roomsCount : 1;
  const areaInUnit = rawArea * multiplier;
  const sqFt = toSqFt(areaInUnit, unit);
  return {
    areaInUnit,
    sqFt,
    sqYards: fromSqFt(sqFt, "Sq Yards"),
    sqMeters: fromSqFt(sqFt, "Sq Meters"),
    gadi: fromSqFt(sqFt, "Gadi"),
    acre: fromSqFt(sqFt, "Acre"),
    hectare: fromSqFt(sqFt, "Hectare"),
    guntha: fromSqFt(sqFt, "Guntha"),
    cents: fromSqFt(sqFt, "Cents"),
    bigha: fromSqFt(sqFt, "Bigha"),
  };
}

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatArea(value: number, decimals = 2): string {
  return value.toLocaleString("en-IN", { maximumFractionDigits: decimals });
}

// ─── Registration Fees Rates ──────────────────────────────────────────────────

type DeedType =
  | "Sale Deed"
  | "Gift Deed"
  | "Partition Deed"
  | "Mortgage Deed"
  | "Cancellation Deed"
  | "Receipt";

interface DeedRates {
  dsdPct: number | null;
  rfPct: number | null;
  rfFixed: number | null;
  userCharges: number;
}

const DEED_RATES: Record<DeedType, DeedRates> = {
  "Sale Deed": { dsdPct: 6.5, rfPct: 1, rfFixed: null, userCharges: 600 },
  "Gift Deed": { dsdPct: 2, rfPct: 0.5, rfFixed: null, userCharges: 600 },
  "Partition Deed": { dsdPct: 3, rfPct: 0.5, rfFixed: null, userCharges: 600 },
  "Mortgage Deed": { dsdPct: 0.5, rfPct: 0.1, rfFixed: null, userCharges: 600 },
  "Cancellation Deed": {
    dsdPct: null,
    rfPct: null,
    rfFixed: 1000,
    userCharges: 500,
  },
  Receipt: { dsdPct: null, rfPct: null, rfFixed: 1000, userCharges: 500 },
};

// ─── Social Icons ─────────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://wa.me/919848872469",
    bg: "#25D366",
    icon: <WhatsAppIcon />,
    label: "WhatsApp",
  },
  {
    href: "https://t.me/",
    bg: "#0088cc",
    icon: <TelegramIcon />,
    label: "Telegram",
  },
  {
    href: "https://facebook.com/",
    bg: "#1877F2",
    icon: <FacebookIcon />,
    label: "Facebook",
  },
  {
    href: "https://instagram.com/",
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    icon: <InstagramIcon />,
    label: "Instagram",
  },
  {
    href: "https://twitter.com/",
    bg: "#000000",
    icon: <TwitterXIcon />,
    label: "Twitter/X",
  },
];

type CalcResult = ReturnType<typeof computeArea> & { totalValue: number };

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const [propertyType, setPropertyType] = useState<PropertyType>("Land");
  const [east, setEast] = useState("");
  const [west, setWest] = useState("");
  const [north, setNorth] = useState("");
  const [south, setSouth] = useState("");
  const [unit, setUnit] = useState<Unit>("Sq Ft");
  const [unitRate, setUnitRate] = useState("");
  const [roomsCount, setRoomsCount] = useState("1");

  const [regDeedType, setRegDeedType] = useState<DeedType>("Sale Deed");
  const [regPropertyValue, setRegPropertyValue] = useState("");

  const [showMap, setShowMap] = useState(false);

  const calc = useMemo<CalcResult | null>(() => {
    const e = Number.parseFloat(east) || 0;
    const w = Number.parseFloat(west) || 0;
    const n = Number.parseFloat(north) || 0;
    const s = Number.parseFloat(south) || 0;
    const rate = Number.parseFloat(unitRate) || 0;
    const rooms = Number.parseInt(roomsCount) || 1;
    if (!e && !w && !n && !s) return null;
    const areas = computeArea(e, w, n, s, unit, rooms, propertyType);
    return { ...areas, totalValue: areas.areaInUnit * rate };
  }, [east, west, north, south, unit, unitRate, roomsCount, propertyType]);

  const regCalc = useMemo(() => {
    const propVal = Number.parseFloat(regPropertyValue) || 0;
    if (propVal <= 0) return null;
    const rates = DEED_RATES[regDeedType];
    const dsd = rates.dsdPct !== null ? (propVal * rates.dsdPct) / 100 : null;
    const rf =
      rates.rfPct !== null
        ? (propVal * rates.rfPct) / 100
        : (rates.rfFixed ?? 0);
    const userCharges = rates.userCharges;
    const total = (dsd ?? 0) + rf + userCharges;
    return { dsd, rf, userCharges, total };
  }, [regDeedType, regPropertyValue]);

  if (!isAuthenticated)
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home / హోమ్", icon: <Home className="w-3.5 h-3.5" /> },
    {
      id: "calculator",
      label: "Calculator / లెక్కింపు",
      icon: <Calculator className="w-3.5 h-3.5" />,
    },
    {
      id: "regfees",
      label: "Reg. Fees / నమోదు రుసుము",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: "contact",
      label: "Contact / సంప్రదించండి",
      icon: <Phone className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      className="bg-background"
    >
      <Toaster richColors position="top-center" />

      {/* HEADER */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 border-b-2"
        style={{
          height: "62px",
          backgroundColor: "oklch(var(--card))",
          borderColor: "#D4800A",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-full border-2 overflow-hidden flex-shrink-0"
            style={{ borderColor: "#D4800A" }}
          >
            <img
              src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
              alt="Proprietor"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <p
              className="font-serif font-bold text-sm sm:text-base leading-tight truncate"
              style={{ color: "#D4800A" }}
            >
              Lakshmi Ganapathi Communications
            </p>
            <p
              className="text-xs font-bold truncate"
              style={{ color: "#D4800A", opacity: 0.8 }}
            >
              Prop: Tiruvaipati Venkata Nageswara Prasad
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
          <a
            href="tel:+919848872469"
            className="font-mono font-bold text-xs hover:opacity-80"
            style={{ color: "#D4800A" }}
          >
            +91 9848872469
          </a>
          <a
            href="mailto:nageswaraprasadtv@gmail.com"
            className="font-bold text-xs hover:underline text-foreground"
          >
            nageswaraprasadtv@gmail.com
          </a>
        </div>
      </header>

      {/* TAB NAV */}
      <nav
        className="flex-shrink-0 flex items-center border-b overflow-x-auto"
        style={{ height: "44px", backgroundColor: "oklch(var(--card))" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`nav.${tab.id}.tab`}
            className="flex items-center gap-1.5 px-3 sm:px-5 h-full text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-150 flex-shrink-0"
            style={{
              borderBottomColor:
                activeTab === tab.id ? "#D4800A" : "transparent",
              color:
                activeTab === tab.id
                  ? "#D4800A"
                  : "oklch(var(--muted-foreground))",
              backgroundColor:
                activeTab === tab.id ? "rgba(212,128,10,0.06)" : "transparent",
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* TAB CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HomeTab />
            </motion.div>
          )}
          {activeTab === "calculator" && (
            <motion.div
              key="calc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CalculatorTab
                propertyType={propertyType}
                setPropertyType={setPropertyType}
                east={east}
                setEast={setEast}
                west={west}
                setWest={setWest}
                north={north}
                setNorth={setNorth}
                south={south}
                setSouth={setSouth}
                unit={unit}
                setUnit={setUnit}
                unitRate={unitRate}
                setUnitRate={setUnitRate}
                roomsCount={roomsCount}
                setRoomsCount={setRoomsCount}
                calc={calc}
              />
            </motion.div>
          )}
          {activeTab === "regfees" && (
            <motion.div
              key="reg"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RegFeesTab
                regDeedType={regDeedType}
                setRegDeedType={setRegDeedType}
                regPropertyValue={regPropertyValue}
                setRegPropertyValue={setRegPropertyValue}
                regCalc={regCalc}
                calc={calc}
              />
            </motion.div>
          )}
          {activeTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ContactTab onViewMap={() => setShowMap(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer
        className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 border-t gap-2"
        style={{
          height: "46px",
          backgroundColor: "oklch(var(--card))",
          borderColor: "rgba(212,128,10,0.3)",
        }}
      >
        <p
          className="text-xs font-bold truncate hidden sm:block"
          style={{ color: "#D4800A" }}
        >
          Prop: T.V. Nageswara Prasad | Ongole, AP
        </p>
        <div className="flex items-center gap-1.5">
          {SOCIAL_LINKS.map((sm) => (
            <a
              key={sm.label}
              href={sm.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={sm.label}
              title={sm.label}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white hover:opacity-85 hover:scale-110 transition-all duration-200"
              style={{ background: sm.bg }}
            >
              <span className="sr-only">{sm.label}</span>
              {sm.icon}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex items-center gap-1 text-xs font-bold hover:underline"
            style={{ color: "#D4800A" }}
            data-ocid="footer.location.button"
          >
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">View Location</span>
          </button>
          <span className="text-xs text-muted-foreground hidden md:inline">
            © {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#D4800A" }}
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>

      {/* MAP MODAL */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowMap(false)}
            data-ocid="map.modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "#D4800A" }} />
                  Our Location / మా స్థానం
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMap(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                  data-ocid="map.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-5 py-2.5 bg-amber-50 border-b text-xs font-bold text-gray-700">
                Shop No-22, Pullareddy Complex, Beside Registration Office, Near
                Ravi Priya Mall, Ongole, AP - 523002
              </div>
              <div className="w-full h-64">
                <iframe
                  title="Business Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps?q=Pullareddy+Complex,+Registration+Office,+Ravi+Priya+Mall,+Ongole,+Prakasam,+Andhra+Pradesh+523002&output=embed"
                />
              </div>
              <div className="flex gap-3 px-5 py-4 border-t">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Pullareddy+Complex,+Registration+Office,+Ravi+Priya+Mall,+Ongole,+Prakasam,+Andhra+Pradesh+523002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#D4800A" }}
                  data-ocid="map.directions.button"
                >
                  Get Directions / దిశలు పొందండి
                </a>
                <button
                  type="button"
                  onClick={() => setShowMap(false)}
                  className="px-5 text-sm font-bold border rounded-xl hover:bg-gray-50 transition-colors"
                  data-ocid="map.cancel_button"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab() {
  return (
    <div className="p-3 sm:p-4 space-y-4">
      <div
        className="w-full rounded-xl overflow-hidden border border-border"
        style={{ height: "22vh", minHeight: "120px" }}
      >
        <img
          src="/assets/uploads/d3911ffd02da7e389eb7e2bfd77965c8-019d2a3e-9149-703a-b7f3-dd338325d17f-1.jpg"
          alt="Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            title: "Unit Conversion",
            telugu: "యూనిట్ మార్పిడి",
            desc: "Sq Ft, Yards, Meters, Gadi, Guntha, Cents, Bigha, Acre, Hectare",
            icon: <Ruler className="w-5 h-5" />,
          },
          {
            title: "Registration Fees",
            telugu: "నమోదు రుసుములు",
            desc: "DSD, R.F and User Charges for all deed types",
            icon: <FileText className="w-5 h-5" />,
          },
          {
            title: "Bilingual Interface",
            telugu: "ద్విభాషా ఇంటర్ఫేస్",
            desc: "English + Telugu labels for all fields and results",
            icon: <Calculator className="w-5 h-5" />,
          },
        ].map((svc) => (
          <Card
            key={svc.title}
            className="border-border hover:border-primary/40 transition-all duration-200"
          >
            <CardContent className="pt-4 pb-4 flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "rgba(212,128,10,0.12)",
                  color: "#D4800A",
                }}
              >
                {svc.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{svc.title}</p>
                <p className="text-xs font-bold" style={{ color: "#D4800A" }}>
                  {svc.telugu}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {svc.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className="px-4 py-2.5 border-b"
          style={{ backgroundColor: "rgba(212,128,10,0.06)" }}
        >
          <h3 className="font-bold text-sm text-foreground">
            Unit Reference / యూనిట్ సూచన
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-accent/40">
                <th className="py-2 px-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Unit / యూనిట్
                </th>
                <th className="py-2 px-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Equivalent in Sq Ft
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { unit: "Sq Ft / చ.అ", val: "1 sq ft" },
                { unit: "Sq Yards / చ.గ", val: "9 sq ft" },
                { unit: "Sq Meters / చ.మీ", val: "10.7639 sq ft" },
                { unit: "Gadi / గడి", val: "72 sq ft (= 8 sq yd)" },
                { unit: "Guntha / గుంట", val: "1,089 sq ft" },
                { unit: "Cents / సెంట్", val: "435.6 sq ft" },
                { unit: "Bigha / బిఘా", val: "14,400 sq ft" },
                { unit: "Acre / ఎకరం", val: "43,560 sq ft" },
                { unit: "Hectare / హెక్టార్", val: "1,07,639 sq ft" },
              ].map((row, i) => (
                <tr
                  key={row.unit}
                  className={i % 2 === 0 ? "bg-background" : "bg-accent/20"}
                >
                  <td className="py-2 px-4 font-bold text-foreground text-xs">
                    {row.unit}
                  </td>
                  <td className="py-2 px-4 text-muted-foreground text-xs">
                    {row.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Calculator Tab ───────────────────────────────────────────────────────────

interface CalculatorTabProps {
  propertyType: PropertyType;
  setPropertyType: (v: PropertyType) => void;
  east: string;
  setEast: (v: string) => void;
  west: string;
  setWest: (v: string) => void;
  north: string;
  setNorth: (v: string) => void;
  south: string;
  setSouth: (v: string) => void;
  unit: Unit;
  setUnit: (v: Unit) => void;
  unitRate: string;
  setUnitRate: (v: string) => void;
  roomsCount: string;
  setRoomsCount: (v: string) => void;
  calc: CalcResult | null;
}

function CalculatorTab({
  propertyType,
  setPropertyType,
  east,
  setEast,
  west,
  setWest,
  north,
  setNorth,
  south,
  setSouth,
  unit,
  setUnit,
  unitRate,
  setUnitRate,
  roomsCount,
  setRoomsCount,
  calc,
}: CalculatorTabProps) {
  return (
    <div className="p-3 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-sm font-serif text-foreground">
              <Calculator className="w-4 h-4" style={{ color: "#D4800A" }} />
              Enter Measurements / కొలతలు నమోదు చేయండి
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Property Type / ఆస్తి రకం
              </Label>
              <div className="flex gap-1.5 flex-wrap">
                {(["Agricultural Land", "Land", "Room"] as PropertyType[]).map(
                  (pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setPropertyType(pt)}
                      data-ocid={`calc.${pt.toLowerCase().replace(/ /g, "_")}.toggle`}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border"
                      style={
                        propertyType === pt
                          ? {
                              backgroundColor: "#D4800A",
                              color: "white",
                              borderColor: "#D4800A",
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: "oklch(var(--border))",
                            }
                      }
                    >
                      {pt}
                    </button>
                  ),
                )}
              </div>
            </div>

            {propertyType === "Room" && (
              <div>
                <Label
                  htmlFor="rooms"
                  className="text-xs font-bold text-foreground mb-1 block"
                >
                  Number of Rooms / గదుల సంఖ్య
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                  className="w-28 h-8"
                  data-ocid="calc.rooms.input"
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Dimensions / కొలతలు
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      label: "East / తూర్పు",
                      val: east,
                      set: setEast,
                      id: "east",
                    },
                    {
                      label: "West / పడమర",
                      val: west,
                      set: setWest,
                      id: "west",
                    },
                    {
                      label: "North / ఉత్తర",
                      val: north,
                      set: setNorth,
                      id: "north",
                    },
                    {
                      label: "South / దక్షిణ",
                      val: south,
                      set: setSouth,
                      id: "south",
                    },
                  ] as const
                ).map(({ label, val, set, id }) => (
                  <div key={id}>
                    <Label
                      htmlFor={id}
                      className="text-xs font-bold text-foreground mb-1 block"
                    >
                      {label}
                    </Label>
                    <Input
                      id={id}
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      className="h-8"
                      data-ocid={`calc.${id}.input`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                  Unit / యూనిట్
                </Label>
                <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                  <SelectTrigger className="h-8" data-ocid="calc.unit.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        ["Sq Ft", "Sq Ft / చ.అ"],
                        ["Sq Yards", "Sq Yards / చ.గ"],
                        ["Sq Meters", "Sq Meters / చ.మీ"],
                        ["Gadi", "Gadi / గడి"],
                        ["Guntha", "Guntha / గుంట"],
                        ["Cents", "Cents / సెంట్"],
                        ["Bigha", "Bigha / బిఘా"],
                        ["Acre", "Acre / ఎకరం"],
                        ["Hectare", "Hectare / హెక్టార్"],
                      ] as [Unit, string][]
                    ).map(([v, lbl]) => (
                      <SelectItem key={v} value={v}>
                        {lbl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="unitRate"
                  className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block"
                >
                  Rate (₹) / రేటు
                </Label>
                <Input
                  id="unitRate"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="₹ per unit"
                  value={unitRate}
                  onChange={(e) => setUnitRate(e.target.value)}
                  className="h-8"
                  data-ocid="calc.unit_rate.input"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-sm font-serif text-foreground">
              <Ruler className="w-4 h-4" style={{ color: "#D4800A" }} />
              Live Results / తక్షణ ఫలితాలు
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <AnimatePresence mode="wait">
              {calc ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                  data-ocid="results.card"
                >
                  <div
                    className="rounded-lg p-3 text-center border"
                    style={{
                      backgroundColor: "rgba(212,128,10,0.08)",
                      borderColor: "rgba(212,128,10,0.3)",
                    }}
                  >
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                      Total Area / మొత్తం విస్తీర్ణం ({unit})
                    </p>
                    <p
                      className="font-mono text-3xl font-bold"
                      style={{ color: "#D4800A" }}
                    >
                      {formatArea(calc.areaInUnit)}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      {
                        label: "Square Feet / చదరపు అడుగులు",
                        value: calc.sqFt,
                        suffix: "sq ft",
                      },
                      {
                        label: "Square Yards / చ.గజాలు",
                        value: calc.sqYards,
                        suffix: "sq yds",
                      },
                      {
                        label: "Square Meters / చదరపు మీటర్లు",
                        value: calc.sqMeters,
                        suffix: "sq m",
                      },
                      { label: "Gadi / గడి", value: calc.gadi, suffix: "gadi" },
                      {
                        label: "Acre / ఎకరం",
                        value: calc.acre,
                        suffix: "acre",
                      },
                      {
                        label: "Hectare / హెక్టార్",
                        value: calc.hectare,
                        suffix: "ha",
                      },
                      {
                        label: "Guntha / గుంట",
                        value: calc.guntha,
                        suffix: "guntha",
                      },
                      {
                        label: "Cents / సెంట్",
                        value: calc.cents,
                        suffix: "cents",
                      },
                      {
                        label: "Bigha / బిఘా",
                        value: calc.bigha,
                        suffix: "bigha",
                      },
                    ].map(({ label, value, suffix }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-background border border-border text-xs"
                      >
                        <span className="text-muted-foreground font-bold">
                          {label}
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatArea(value)}{" "}
                          <span className="text-muted-foreground">
                            {suffix}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  {Number.parseFloat(unitRate) > 0 && (
                    <div
                      className="rounded-lg p-3 text-center border"
                      style={{
                        backgroundColor: "rgba(212,128,10,0.06)",
                        borderColor: "rgba(212,128,10,0.3)",
                      }}
                    >
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                        Estimated Value / అంచనా విలువ
                      </p>
                      <p
                        className="font-mono text-2xl font-bold"
                        style={{ color: "#D4800A" }}
                      >
                        {formatINR(calc.totalValue)}
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="results.empty_state"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: "rgba(212,128,10,0.1)" }}
                  >
                    <Ruler
                      className="w-7 h-7"
                      style={{ color: "#D4800A", opacity: 0.5 }}
                    />
                  </div>
                  <p className="text-muted-foreground font-serif italic text-sm">
                    Enter measurements to see live results
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    కొలతలు నమోదు చేయండి
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Reg Fees Tab ─────────────────────────────────────────────────────────────

interface RegFeesTabProps {
  regDeedType: DeedType;
  setRegDeedType: (v: DeedType) => void;
  regPropertyValue: string;
  setRegPropertyValue: (v: string) => void;
  regCalc: {
    dsd: number | null;
    rf: number;
    userCharges: number;
    total: number;
  } | null;
  calc: CalcResult | null;
}

function RegFeesTab({
  regDeedType,
  setRegDeedType,
  regPropertyValue,
  setRegPropertyValue,
  regCalc,
  calc,
}: RegFeesTabProps) {
  return (
    <div className="p-3 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-sm font-serif text-foreground">
              <FileText className="w-4 h-4" style={{ color: "#D4800A" }} />
              Select Deed Type / డీడ్ రకం
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Deed Type / పత్రం రకం
              </Label>
              <Select
                value={regDeedType}
                onValueChange={(v) => setRegDeedType(v as DeedType)}
              >
                <SelectTrigger className="h-8" data-ocid="reg.deed_type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DEED_RATES) as DeedType[]).map((deed) => (
                    <SelectItem key={deed} value={deed}>
                      {deed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-xs">
                <span className="font-bold text-foreground">DSD:</span>
                <span className="text-muted-foreground">
                  {DEED_RATES[regDeedType].dsdPct !== null
                    ? `${DEED_RATES[regDeedType].dsdPct}%`
                    : "N/A"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-xs">
                <span className="font-bold text-foreground">R.F:</span>
                <span className="text-muted-foreground">
                  {DEED_RATES[regDeedType].rfPct !== null
                    ? `${DEED_RATES[regDeedType].rfPct}%`
                    : `₹${DEED_RATES[regDeedType].rfFixed?.toLocaleString("en-IN")} fixed`}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-xs">
                <span className="font-bold text-foreground">User Ch.:</span>
                <span className="text-muted-foreground">
                  ₹{DEED_RATES[regDeedType].userCharges}
                </span>
              </span>
            </div>

            <div>
              <Label
                htmlFor="regValue"
                className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block"
              >
                Property Value / ఆస్తి విలువ (₹)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="regValue"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter property value in ₹"
                  value={regPropertyValue}
                  onChange={(e) => setRegPropertyValue(e.target.value)}
                  className="flex-1 h-8"
                  data-ocid="reg.property_value.input"
                />
                {calc && calc.totalValue > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRegPropertyValue(String(Math.round(calc.totalValue)))
                    }
                    className="whitespace-nowrap text-xs h-8"
                    style={{
                      borderColor: "rgba(212,128,10,0.4)",
                      color: "#D4800A",
                    }}
                    data-ocid="reg.use_total.secondary_button"
                  >
                    Use Calc Total
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-3 py-1.5 border-b bg-accent/40">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  All Rates Reference
                </p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-background">
                    <th className="py-1.5 px-3 text-left font-semibold text-muted-foreground">
                      Deed
                    </th>
                    <th className="py-1.5 px-3 text-center font-semibold text-muted-foreground">
                      DSD
                    </th>
                    <th className="py-1.5 px-3 text-center font-semibold text-muted-foreground">
                      R.F
                    </th>
                    <th className="py-1.5 px-3 text-center font-semibold text-muted-foreground">
                      UC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(DEED_RATES) as [DeedType, DeedRates][]).map(
                    ([deed, rates], i) => (
                      <tr
                        key={deed}
                        className={
                          i % 2 === 0 ? "bg-accent/20" : "bg-background"
                        }
                        style={
                          regDeedType === deed
                            ? { outline: "1px solid rgba(212,128,10,0.4)" }
                            : {}
                        }
                      >
                        <td className="py-1 px-3 font-medium text-foreground">
                          {deed}
                        </td>
                        <td className="py-1 px-3 text-center text-muted-foreground">
                          {rates.dsdPct !== null ? `${rates.dsdPct}%` : "—"}
                        </td>
                        <td className="py-1 px-3 text-center text-muted-foreground">
                          {rates.rfPct !== null
                            ? `${rates.rfPct}%`
                            : `₹${rates.rfFixed?.toLocaleString("en-IN")}`}
                        </td>
                        <td className="py-1 px-3 text-center text-muted-foreground">
                          ₹{rates.userCharges}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-sm font-serif text-foreground">
              <Calculator className="w-4 h-4" style={{ color: "#D4800A" }} />
              Fee Breakdown / రుసుముల వివరాలు
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <AnimatePresence mode="wait">
              {regCalc ? (
                <motion.div
                  key="reg-results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                  data-ocid="reg_fees.card"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-border bg-background p-3 text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-0.5">
                        DSD
                      </p>
                      <p className="font-mono text-base font-bold text-foreground">
                        {regCalc.dsd !== null ? formatINR(regCalc.dsd) : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {DEED_RATES[regDeedType].dsdPct !== null
                          ? `${DEED_RATES[regDeedType].dsdPct}%`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3 text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-0.5">
                        R.F
                      </p>
                      <p className="font-mono text-base font-bold text-foreground">
                        {formatINR(regCalc.rf)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {DEED_RATES[regDeedType].rfPct !== null
                          ? `${DEED_RATES[regDeedType].rfPct}%`
                          : "Fixed"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3 text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-0.5">
                        User Ch.
                      </p>
                      <p className="font-mono text-base font-bold text-foreground">
                        {formatINR(regCalc.userCharges)}
                      </p>
                      <p className="text-xs text-muted-foreground">Fixed</p>
                    </div>
                  </div>
                  <Separator />
                  <div
                    className="rounded-xl p-4 text-center border"
                    style={{
                      backgroundColor: "rgba(212,128,10,0.08)",
                      borderColor: "rgba(212,128,10,0.4)",
                    }}
                  >
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Total Fees / మొత్తం రుసుమలు
                    </p>
                    <p
                      className="font-mono text-3xl font-bold"
                      style={{ color: "#D4800A" }}
                    >
                      {formatINR(regCalc.total)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-accent/60 border-b border-border">
                          <th className="py-2 px-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                            Item
                          </th>
                          <th className="py-2 px-4 text-right text-xs font-semibold text-muted-foreground uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-2 px-4 font-bold text-foreground text-sm">
                            DSD / డాక్యుమెంట్ స్టాంప్ డ్యూటీ
                          </td>
                          <td className="py-2 px-4 text-right font-mono font-semibold text-sm">
                            {regCalc.dsd !== null
                              ? formatINR(regCalc.dsd)
                              : "—"}
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 px-4 font-bold text-foreground text-sm">
                            R.F / రిజిస్ట్రేషన్ ఫీజు
                          </td>
                          <td className="py-2 px-4 text-right font-mono font-semibold text-sm">
                            {formatINR(regCalc.rf)}
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 px-4 font-bold text-foreground text-sm">
                            User Charges / వినియోగదారు రుసుము
                          </td>
                          <td className="py-2 px-4 text-right font-mono font-semibold text-sm">
                            {formatINR(regCalc.userCharges)}
                          </td>
                        </tr>
                        <tr
                          style={{ backgroundColor: "rgba(212,128,10,0.06)" }}
                        >
                          <td className="py-2.5 px-4 font-bold text-foreground">
                            Total / మొత్తం
                          </td>
                          <td
                            className="py-2.5 px-4 text-right font-mono font-bold"
                            style={{ color: "#D4800A" }}
                          >
                            {formatINR(regCalc.total)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reg-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="reg_fees.empty_state"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: "rgba(212,128,10,0.1)" }}
                  >
                    <FileText
                      className="w-7 h-7"
                      style={{ color: "#D4800A", opacity: 0.5 }}
                    />
                  </div>
                  <p className="text-muted-foreground font-serif italic text-sm">
                    Enter property value to calculate fees
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ఆస్తి విలువ నమోదు చేయండి
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────

function ContactTab({ onViewMap }: { onViewMap: () => void }) {
  return (
    <div className="p-3 sm:p-4 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="tel:+919848872469" className="block">
          <Card className="h-full border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
            <CardContent className="pt-5 pb-5 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: "rgba(212,128,10,0.12)",
                  color: "#D4800A",
                }}
              >
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">Phone</h3>
              <p
                className="font-mono font-bold text-sm"
                style={{ color: "#D4800A" }}
              >
                +91 9848872469
              </p>
              <p className="text-xs text-muted-foreground mt-1">ఫోన్ చేయండి</p>
            </CardContent>
          </Card>
        </a>

        <a href="mailto:nageswaraprasadtv@gmail.com" className="block">
          <Card className="h-full border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
            <CardContent className="pt-5 pb-5 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: "rgba(212,128,10,0.12)",
                  color: "#D4800A",
                }}
              >
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">Email</h3>
              <p className="font-bold text-xs" style={{ color: "#D4800A" }}>
                nageswaraprasadtv@gmail.com
              </p>
              <p className="text-xs text-muted-foreground mt-1">ఇమెయిల్ చేయండి</p>
            </CardContent>
          </Card>
        </a>

        <Card className="border-border hover:border-primary/40 hover:shadow-sm transition-all group">
          <CardContent className="pt-5 pb-5 flex flex-col items-center text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
              style={{
                backgroundColor: "rgba(212,128,10,0.12)",
                color: "#D4800A",
              }}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-foreground mb-1">Address</h3>
            <p className="text-xs font-bold text-foreground leading-relaxed">
              Shop No-22, Pullareddy Complex,
              <br />
              Beside Registration Office,
              <br />
              Near Ravi Priya Mall, Ongole,
              <br />
              Prakasam Dist, AP - 523002
            </p>
            <button
              type="button"
              onClick={onViewMap}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold hover:underline"
              style={{ color: "#D4800A" }}
              data-ocid="contact.location.button"
            >
              <MapPin className="w-3 h-3" />
              View Location / స్థానం చూడండి
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 flex justify-center gap-3">
        {SOCIAL_LINKS.map((sm) => (
          <a
            key={sm.label}
            href={sm.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={sm.label}
            title={sm.label}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-85 hover:scale-110 transition-all duration-200 shadow-md"
            style={{ background: sm.bg }}
          >
            <span className="sr-only">{sm.label}</span>
            {sm.icon}
          </a>
        ))}
      </div>

      <Card className="mt-4 border-border">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs font-bold" style={{ color: "#D4800A" }}>
            Prop: Tiruvaipati Venkata Nageswara Prasad
          </p>
          <p className="text-xs text-foreground font-bold mt-1">
            Shop No-22, Pullareddy Complex, Beside Registration Office, Near
            Ravi Priya Mall, Ongole, Prakasam Dist, Andhra Pradesh, Pin - 523002
          </p>
          <p className="mt-2">
            <a
              href="tel:+919848872469"
              className="font-mono font-bold text-xs hover:underline"
              style={{ color: "#D4800A" }}
            >
              +91 9848872469
            </a>
            {" · "}
            <a
              href="mailto:nageswaraprasadtv@gmail.com"
              className="font-bold text-xs hover:underline text-foreground"
            >
              nageswaraprasadtv@gmail.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
