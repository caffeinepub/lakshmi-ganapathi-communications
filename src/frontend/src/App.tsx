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
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  ListOrdered,
  Mail,
  MapPin,
  Menu,
  Phone,
  PlusCircle,
  RefreshCw,
  Ruler,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PasswordGate } from "./components/PasswordGate";
import {
  useAddEntry,
  useClearEntries,
  useGetAllEntries,
} from "./hooks/useQueries";

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

interface LocalEntry {
  id: string;
  propertyType: PropertyType;
  east: number;
  west: number;
  north: number;
  south: number;
  unit: Unit;
  unitRate: number;
  roomsCount: number;
  totalArea: number;
  totalValue: number;
}

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
): {
  areaInUnit: number;
  sqFt: number;
  sqYards: number;
  sqMeters: number;
  gadi: number;
  acre: number;
  hectare: number;
  guntha: number;
  cents: number;
  bigha: number;
} {
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

// ─── Social Media SVGs ────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
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
      width="20"
      height="20"
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
      width="20"
      height="20"
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
      width="20"
      height="20"
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
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── App Component ────────────────────────────────────────────────────────────

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ── Form state ──
  const [propertyType, setPropertyType] = useState<PropertyType>("Land");
  const [east, setEast] = useState("");
  const [west, setWest] = useState("");
  const [north, setNorth] = useState("");
  const [south, setSouth] = useState("");
  const [unit, setUnit] = useState<Unit>("Sq Ft");
  const [unitRate, setUnitRate] = useState("");
  const [roomsCount, setRoomsCount] = useState("1");

  // ── Registration Fees state ──
  const [regDeedType, setRegDeedType] = useState<DeedType>("Sale Deed");
  const [regPropertyValue, setRegPropertyValue] = useState("");

  // ── Local entries state ──
  const [localEntries, setLocalEntries] = useState<LocalEntry[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Backend hooks ──
  const { data: backendEntries, isLoading: entriesLoading } =
    useGetAllEntries();
  const addEntryMutation = useAddEntry();
  const clearEntriesMutation = useClearEntries();

  // ── Live calculations ──
  const calc = useMemo(() => {
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

  // ── Combine backend + local entries ──
  const displayEntries = useMemo<LocalEntry[]>(() => {
    if (backendEntries && backendEntries.length > 0) {
      return backendEntries.map((e, i) => ({
        id: `backend-${i}-${e.timestamp}`,
        propertyType: e.propertyType as PropertyType,
        east: e.east,
        west: e.west,
        north: e.north,
        south: e.south,
        unit: e.unit as Unit,
        unitRate: e.unitRate,
        roomsCount: Number(e.roomsCount),
        totalArea: e.totalArea,
        totalValue: e.totalValue,
      }));
    }
    return localEntries;
  }, [backendEntries, localEntries]);

  // ── Add entry ──
  function handleAddEntry() {
    const e = Number.parseFloat(east);
    const w = Number.parseFloat(west);
    const n = Number.parseFloat(north);
    const s = Number.parseFloat(south);
    if (!e || !w || !n || !s) {
      toast.error("Please fill in all four directional measurements.");
      return;
    }
    const rate = Number.parseFloat(unitRate) || 0;
    const rooms = Number.parseInt(roomsCount) || 1;
    const areas = computeArea(e, w, n, s, unit, rooms, propertyType);
    const totalValue = areas.areaInUnit * rate;
    const newEntry: LocalEntry = {
      id: `local-${Date.now()}`,
      propertyType,
      east: e,
      west: w,
      north: n,
      south: s,
      unit,
      unitRate: rate,
      roomsCount: rooms,
      totalArea: areas.areaInUnit,
      totalValue,
    };
    addEntryMutation.mutate(
      {
        propertyType,
        east: e,
        west: w,
        north: n,
        south: s,
        unit,
        unitRate: rate,
        roomsCount: BigInt(rooms),
        totalArea: areas.areaInUnit,
        totalValue,
      },
      { onError: () => setLocalEntries((prev) => [...prev, newEntry]) },
    );
    if (!backendEntries || backendEntries.length === 0) {
      setLocalEntries((prev) => [...prev, newEntry]);
    }
    toast.success("Measurement added to list!");
    setEast("");
    setWest("");
    setNorth("");
    setSouth("");
    setUnitRate("");
    setRoomsCount("1");
  }

  function handleRemoveEntry(id: string) {
    setLocalEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleClearAll() {
    clearEntriesMutation.mutate(undefined, {
      onSuccess: () => {
        setLocalEntries([]);
        toast.success("All entries cleared.");
      },
      onError: () => {
        setLocalEntries([]);
        toast.success("All entries cleared.");
      },
    });
  }

  const grandTotals = useMemo(() => {
    if (displayEntries.length === 0) return null;
    const totalValue = displayEntries.reduce((sum, e) => sum + e.totalValue, 0);
    return { totalValue };
  }, [displayEntries]);

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

  useEffect(() => {
    if (calc && calc.totalValue > 0 && Number.parseFloat(unitRate) > 0) {
      setRegPropertyValue(String(Math.round(calc.totalValue)));
    }
  }, [calc, unitRate]);

  // ── Smooth scroll helper ──
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { label: "Home / హోమ్", id: "hero" },
    { label: "Services / సేవలు", id: "services" },
    { label: "Calculator / లెక్కింపు", id: "calculator" },
    { label: "Reg. Fees / నమోదు రుసుమু", id: "registration" },
    { label: "Contact / సంప్రదించండి", id: "contact" },
  ];

  if (!isAuthenticated)
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" />

      {/* ═══════════════════════════════════════════════
          STICKY NAVIGATION
      ═══════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-primary/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary/60 overflow-hidden shadow-gold flex-shrink-0">
                <img
                  src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
                  alt="Proprietor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="hidden sm:block">
                <p
                  className="font-serif text-sm font-bold leading-none"
                  style={{ color: "#D4800A" }}
                >
                  Lakshmi Ganapathi
                </p>
                <p className="font-serif text-xs text-muted-foreground leading-none mt-0.5">
                  Communications
                </p>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-md transition-all duration-150"
                  data-ocid={`nav.${link.id}.link`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + mobile menu */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold"
                onClick={() => scrollTo("calculator")}
                data-ocid="nav.calculator.primary_button"
              >
                <Calculator className="w-3.5 h-3.5 mr-1.5" />
                Calculate
              </Button>
              <button
                type="button"
                className="md:hidden p-2 rounded-md hover:bg-accent/60 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-primary/20 bg-card"
            >
              <div className="px-4 py-2 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-md transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col">
        {/* Full-width banner background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/assets/uploads/d3911ffd02da7e389eb7e2bfd77965c8-019d2a3e-9149-703a-b7f3-dd338325d17f-1.jpg"
            alt="Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-16 px-4 text-center">
          {/* Circular profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 overflow-hidden mx-auto shadow-[0_0_40px_rgba(212,128,10,0.5)]"
              style={{ borderColor: "#D4800A" }}
            >
              <img
                src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
                alt="Proprietor"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-2"
            style={{ color: "#D4800A" }}
          >
            Lakshmi Ganapathi
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-2xl md:text-3xl font-semibold text-white mb-1"
          >
            Communications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-amber-100/80 text-lg md:text-xl font-medium mb-6"
          >
            Property Land Measurement Calculator
          </motion.p>

          {/* Prop name */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-bold text-base mb-8"
            style={{ color: "#D4800A" }}
          >
            Prop: Tiruvaipati Venkata Nageswara Prasad
          </motion.p>

          {/* Contact pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <a
              href="tel:+919848872469"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Phone className="w-4 h-4" style={{ color: "#D4800A" }} />
              <span className="font-mono font-bold tracking-wider">
                +91 9848872469
              </span>
            </a>
            <a
              href="mailto:nageswaraprasadtv@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Mail className="w-4 h-4" style={{ color: "#D4800A" }} />
              <span className="font-bold">nageswaraprasadtv@gmail.com</span>
            </a>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="text-base px-8 shadow-[0_4px_20px_rgba(212,128,10,0.4)] hover:shadow-[0_4px_30px_rgba(212,128,10,0.6)] transition-all"
              style={{ backgroundColor: "#D4800A", color: "white" }}
              onClick={() => scrollTo("calculator")}
              data-ocid="hero.primary_button"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Start Calculating
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 text-white border-white/40 hover:bg-white/10"
              onClick={() => scrollTo("services")}
              data-ocid="hero.secondary_button"
            >
              Learn More
              <ChevronDown className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="relative z-10 pb-8 flex justify-center"
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES / ABOUT SECTION
      ═══════════════════════════════════════════════ */}
      <section id="services" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section heading */}
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                color: "#D4800A",
                backgroundColor: "rgba(212,128,10,0.1)",
              }}
            >
              ✦ Our Services ✦
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl font-bold text-foreground"
            >
              What We Offer
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-muted-foreground text-base max-w-xl mx-auto"
            >
              Comprehensive property measurement and registration fee
              calculation tools for Agricultural Land, Plots &amp; Rooms — in
              English &amp; Telugu.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Ruler className="w-7 h-7" />,
                title: "Property Measurement",
                telugu: "ఆస్తి కొలత",
                desc: "Measure Agricultural Land, Plots, and Rooms with directional inputs (East, West, North, South).",
              },
              {
                icon: <Calculator className="w-7 h-7" />,
                title: "Unit Conversion",
                telugu: "యూనిట్ మార్పిడి",
                desc: "Convert instantly between Sq Ft, Sq Yards, Sq Meters, Gadi, Guntha, Cents, Bigha, Acre, and Hectare.",
              },
              {
                icon: <FileText className="w-7 h-7" />,
                title: "Registration Fees",
                telugu: "నమోదు రుసుములు",
                desc: "Calculate DSD, R.F, and User Charges for Sale, Gift, Partition, Mortgage, Cancellation Deeds.",
              },
              {
                icon: <ClipboardList className="w-7 h-7" />,
                title: "Bilingual Interface",
                telugu: "ద్విభాషా ఇంటర్ఫేస్",
                desc: "All labels, results and measurements displayed in both English and Telugu for maximum clarity.",
              },
            ].map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border hover:border-primary/40 hover:shadow-gold transition-all duration-300 group">
                  <CardContent className="pt-6 pb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: "rgba(212,128,10,0.12)",
                        color: "#D4800A",
                      }}
                    >
                      {svc.icon}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-0.5">
                      {svc.title}
                    </h3>
                    <p
                      className="text-xs font-bold mb-2"
                      style={{ color: "#D4800A" }}
                    >
                      {svc.telugu}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {svc.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Unit reference table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-2xl border border-border overflow-hidden"
          >
            <div
              className="px-6 py-4 border-b border-border"
              style={{ backgroundColor: "rgba(212,128,10,0.06)" }}
            >
              <h3 className="font-serif text-lg font-bold text-foreground">
                Unit Reference / యూనిట్ సూచన
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-accent/40">
                    <th className="py-2.5 px-4 text-left font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                      Unit / యూనిట్
                    </th>
                    <th className="py-2.5 px-4 text-left font-semibold text-muted-foreground uppercase tracking-wide text-xs">
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
                      <td className="py-2.5 px-4 font-bold text-foreground">
                        {row.unit}
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">
                        {row.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CALCULATOR SECTION
      ═══════════════════════════════════════════════ */}
      <section id="calculator" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section heading */}
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                color: "#D4800A",
                backgroundColor: "rgba(212,128,10,0.1)",
              }}
            >
              ✦ Calculator ✦
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Property Measurement Calculator
            </h2>
            <p className="mt-2 text-muted-foreground">ఆస్తి కొలత కాలిక్యులేటర్</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-card border-border bg-card h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-serif text-foreground">
                    <Calculator
                      className="w-5 h-5"
                      style={{ color: "#D4800A" }}
                    />
                    Enter Measurements / కొలతలు నమోదు చేయండి
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Property Type */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block">
                      Property Type / ఆస్తి రకం
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {(
                        ["Agricultural Land", "Land", "Room"] as PropertyType[]
                      ).map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setPropertyType(pt)}
                          data-ocid={`calc.${pt.toLowerCase().replace(" ", "_")}.toggle`}
                          className={[
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                            propertyType === pt
                              ? "text-white border-transparent shadow-gold"
                              : "bg-card text-foreground border-border hover:border-primary/60",
                          ].join(" ")}
                          style={
                            propertyType === pt
                              ? { backgroundColor: "#D4800A" }
                              : {}
                          }
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Room count */}
                  {propertyType === "Room" && (
                    <div>
                      <Label
                        htmlFor="rooms"
                        className="text-sm font-bold text-foreground mb-1 block"
                      >
                        Number of Rooms / గదుల సంఖ్య
                      </Label>
                      <Input
                        id="rooms"
                        type="number"
                        min="1"
                        value={roomsCount}
                        onChange={(e) => setRoomsCount(e.target.value)}
                        className="w-32"
                        data-ocid="calc.rooms.input"
                      />
                    </div>
                  )}

                  {/* Directional inputs */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block">
                      Dimensions / కొలతలు
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
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
                            data-ocid={`calc.${id}.input`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unit selector */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block">
                      Unit / యూనిట్
                    </Label>
                    <Select
                      value={unit}
                      onValueChange={(v) => setUnit(v as Unit)}
                    >
                      <SelectTrigger data-ocid="calc.unit.select">
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
                        ).map(([val, label]) => (
                          <SelectItem key={val} value={val}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit rate */}
                  <div>
                    <Label
                      htmlFor="unitRate"
                      className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block"
                    >
                      Rate per {unit} / ₹ రేటు
                    </Label>
                    <Input
                      id="unitRate"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Enter ₹ per unit (optional)"
                      value={unitRate}
                      onChange={(e) => setUnitRate(e.target.value)}
                      data-ocid="calc.unit_rate.input"
                    />
                  </div>

                  <Separator />

                  {/* Add entry button */}
                  <Button
                    onClick={handleAddEntry}
                    disabled={addEntryMutation.isPending}
                    className="w-full text-white"
                    style={{ backgroundColor: "#D4800A" }}
                    data-ocid="calc.add_entry.primary_button"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add to List / జాబితాకు జోడించు
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Live Results ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-card border-border bg-card h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-serif text-foreground">
                    <Ruler className="w-5 h-5" style={{ color: "#D4800A" }} />
                    Live Results / తక్షణ ఫలితాలు
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {calc ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                        data-ocid="results.card"
                      >
                        {/* Total area highlight */}
                        <div
                          className="rounded-xl p-5 text-center border"
                          style={{
                            backgroundColor: "rgba(212,128,10,0.08)",
                            borderColor: "rgba(212,128,10,0.3)",
                          }}
                        >
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                            Total Area / మొత్తం విస్తీర్ణం ({unit})
                          </p>
                          <p
                            className="font-mono text-4xl font-bold"
                            style={{ color: "#D4800A" }}
                          >
                            {formatArea(calc.areaInUnit)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {unit}
                          </p>
                        </div>

                        {/* All unit conversions */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            All Units / అన్ని యూనిట్లు
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
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
                              {
                                label: "Gadi / గడి",
                                value: calc.gadi,
                                suffix: "gadi",
                              },
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
                                className="flex justify-between items-center py-2 px-3 rounded-lg bg-background border border-border text-sm"
                              >
                                <span className="text-muted-foreground font-bold">
                                  {label}
                                </span>
                                <span className="font-semibold text-foreground">
                                  {formatArea(value)}{" "}
                                  <span className="text-xs text-muted-foreground">
                                    {suffix}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total value */}
                        {Number.parseFloat(unitRate) > 0 && (
                          <div
                            className="rounded-xl p-4 text-center border"
                            style={{
                              backgroundColor: "rgba(212,128,10,0.06)",
                              borderColor: "rgba(212,128,10,0.3)",
                            }}
                          >
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
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
                        className="flex flex-col items-center justify-center py-16 text-center"
                        data-ocid="results.empty_state"
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: "rgba(212,128,10,0.1)" }}
                        >
                          <Ruler
                            className="w-8 h-8"
                            style={{ color: "#D4800A", opacity: 0.5 }}
                          />
                        </div>
                        <p className="text-muted-foreground font-serif italic">
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
            </motion.div>
          </div>

          {/* ── Entries List ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <Card className="shadow-card border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-serif text-foreground">
                    <ListOrdered
                      className="w-5 h-5"
                      style={{ color: "#D4800A" }}
                    />
                    Saved Measurements / సేవ్ చేసిన కొలతలు
                  </CardTitle>
                  {displayEntries.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={clearEntriesMutation.isPending}
                      className="text-muted-foreground hover:text-destructive text-xs gap-1.5"
                      data-ocid="entries.delete_button"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {entriesLoading ? (
                  <div
                    className="text-center py-8"
                    data-ocid="entries.loading_state"
                  >
                    <div
                      className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent rounded-full mb-2"
                      style={{
                        borderColor: "#D4800A",
                        borderTopColor: "transparent",
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Loading entries...
                    </p>
                  </div>
                ) : displayEntries.length === 0 ? (
                  <div
                    className="text-center py-10"
                    data-ocid="entries.empty_state"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: "rgba(212,128,10,0.1)" }}
                    >
                      <ListOrdered
                        className="w-6 h-6"
                        style={{ color: "#D4800A", opacity: 0.4 }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground font-serif italic">
                      No measurements saved yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ఇంకా కొలతలు సేవ్ చేయబడలేదు
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayEntries.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
                        data-ocid={`entries.item.${idx + 1}`}
                      >
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground font-bold">
                              Type
                            </p>
                            <p className="font-semibold text-foreground">
                              {entry.propertyType}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold">
                              Dimensions
                            </p>
                            <p className="font-semibold text-foreground">
                              E:{entry.east} W:{entry.west} N:{entry.north} S:
                              {entry.south}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold">
                              Area
                            </p>
                            <p
                              className="font-semibold"
                              style={{ color: "#D4800A" }}
                            >
                              {formatArea(entry.totalArea)} {entry.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold">
                              Value
                            </p>
                            <p className="font-semibold text-foreground">
                              {entry.totalValue > 0
                                ? formatINR(entry.totalValue)
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEntry(entry.id)}
                          className="flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          data-ocid={`entries.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}

                    {/* Grand total */}
                    {grandTotals && grandTotals.totalValue > 0 && (
                      <div
                        className="flex items-center justify-between p-4 rounded-xl border-2"
                        style={{
                          backgroundColor: "rgba(212,128,10,0.08)",
                          borderColor: "rgba(212,128,10,0.4)",
                        }}
                      >
                        <p className="font-bold text-foreground">
                          Grand Total / మొత్తం విలువ
                        </p>
                        <p
                          className="font-mono font-bold text-xl"
                          style={{ color: "#D4800A" }}
                        >
                          {formatINR(grandTotals.totalValue)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          REGISTRATION FEES SECTION
      ═══════════════════════════════════════════════ */}
      <section id="registration" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section heading */}
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                color: "#D4800A",
                backgroundColor: "rgba(212,128,10,0.1)",
              }}
            >
              ✦ Registration ✦
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Registration Fees Calculator
            </h2>
            <p className="mt-2 text-muted-foreground">నమోదు రుసుముల కాలిక్యులేటర్</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif text-foreground">
                    <FileText
                      className="w-5 h-5"
                      style={{ color: "#D4800A" }}
                    />
                    Select Deed Type / డీడ్ రకం
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Deed type */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block">
                      Deed Type / పత్రం రకం
                    </Label>
                    <Select
                      value={regDeedType}
                      onValueChange={(v) => setRegDeedType(v as DeedType)}
                    >
                      <SelectTrigger data-ocid="reg.deed_type.select">
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

                  {/* Rate info chips */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border text-xs">
                      <span className="font-bold text-foreground">DSD:</span>
                      <span className="text-muted-foreground">
                        {DEED_RATES[regDeedType].dsdPct !== null
                          ? `${DEED_RATES[regDeedType].dsdPct}%`
                          : "N/A"}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border text-xs">
                      <span className="font-bold text-foreground">R.F:</span>
                      <span className="text-muted-foreground">
                        {DEED_RATES[regDeedType].rfPct !== null
                          ? `${DEED_RATES[regDeedType].rfPct}%`
                          : `₹${DEED_RATES[regDeedType].rfFixed?.toLocaleString("en-IN")} fixed`}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border text-xs">
                      <span className="font-bold text-foreground">
                        User Charges:
                      </span>
                      <span className="text-muted-foreground">
                        ₹
                        {DEED_RATES[regDeedType].userCharges.toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </span>
                  </div>

                  {/* Property value input */}
                  <div>
                    <Label
                      htmlFor="regValue"
                      className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block"
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
                        className="flex-1"
                        data-ocid="reg.property_value.input"
                      />
                      {calc && calc.totalValue > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setRegPropertyValue(
                              String(Math.round(calc.totalValue)),
                            )
                          }
                          className="whitespace-nowrap text-xs"
                          style={{
                            borderColor: "rgba(212,128,10,0.4)",
                            color: "#D4800A",
                          }}
                          data-ocid="reg.use_total.secondary_button"
                        >
                          Use Calculator Total
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Rates reference */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2 border-b border-border bg-accent/40">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        All Deed Rates Reference
                      </p>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-background">
                          <th className="py-2 px-3 text-left font-semibold text-muted-foreground">
                            Deed
                          </th>
                          <th className="py-2 px-3 text-center font-semibold text-muted-foreground">
                            DSD
                          </th>
                          <th className="py-2 px-3 text-center font-semibold text-muted-foreground">
                            R.F
                          </th>
                          <th className="py-2 px-3 text-center font-semibold text-muted-foreground">
                            User Ch.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          Object.entries(DEED_RATES) as [DeedType, DeedRates][]
                        ).map(([deed, rates], i) => (
                          <tr
                            key={deed}
                            className={[
                              i % 2 === 0 ? "bg-accent/20" : "bg-background",
                              regDeedType === deed ? "ring-1 ring-inset" : "",
                            ].join(" ")}
                            style={
                              regDeedType === deed
                                ? { outline: "1px solid rgba(212,128,10,0.4)" }
                                : {}
                            }
                          >
                            <td className="py-1.5 px-3 font-medium text-foreground">
                              {deed}
                            </td>
                            <td className="py-1.5 px-3 text-center text-muted-foreground">
                              {rates.dsdPct !== null ? `${rates.dsdPct}%` : "—"}
                            </td>
                            <td className="py-1.5 px-3 text-center text-muted-foreground">
                              {rates.rfPct !== null
                                ? `${rates.rfPct}%`
                                : `₹${rates.rfFixed?.toLocaleString("en-IN")}`}
                            </td>
                            <td className="py-1.5 px-3 text-center text-muted-foreground">
                              ₹{rates.userCharges}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif text-foreground">
                    <Calculator
                      className="w-5 h-5"
                      style={{ color: "#D4800A" }}
                    />
                    Fee Breakdown / రుసుముల వివరాలు
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        {/* Summary cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-xl border border-border bg-background p-4 text-center">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                              DSD
                            </p>
                            <p className="font-mono text-xl font-bold text-foreground">
                              {regCalc.dsd !== null
                                ? formatINR(regCalc.dsd)
                                : "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {DEED_RATES[regDeedType].dsdPct !== null
                                ? `${DEED_RATES[regDeedType].dsdPct}%`
                                : "Not applicable"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-4 text-center">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                              R.F
                            </p>
                            <p className="font-mono text-xl font-bold text-foreground">
                              {formatINR(regCalc.rf)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {DEED_RATES[regDeedType].rfPct !== null
                                ? `${DEED_RATES[regDeedType].rfPct}%`
                                : "Fixed"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-4 text-center">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                              User Charges
                            </p>
                            <p className="font-mono text-xl font-bold text-foreground">
                              {formatINR(regCalc.userCharges)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Fixed
                            </p>
                          </div>
                        </div>

                        {/* Detailed table */}
                        <div className="rounded-xl border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-accent/60 border-b border-primary/20">
                                <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Charge
                                </th>
                                <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Rate
                                </th>
                                <th className="py-2 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-border/50 bg-background">
                                <td className="py-2.5 px-4 font-medium text-foreground">
                                  DSD (Duty Stamp Duty)
                                </td>
                                <td className="py-2.5 px-4 text-muted-foreground text-xs">
                                  {DEED_RATES[regDeedType].dsdPct !== null
                                    ? `${DEED_RATES[regDeedType].dsdPct}%`
                                    : "—"}
                                </td>
                                <td
                                  className="py-2.5 px-4 text-right font-semibold"
                                  style={{ color: "#D4800A" }}
                                >
                                  {regCalc.dsd !== null
                                    ? formatINR(regCalc.dsd)
                                    : "—"}
                                </td>
                              </tr>
                              <tr className="border-b border-border/50 bg-accent/10">
                                <td className="py-2.5 px-4 font-medium text-foreground">
                                  R.F (Registration Fee)
                                </td>
                                <td className="py-2.5 px-4 text-muted-foreground text-xs">
                                  {DEED_RATES[regDeedType].rfPct !== null
                                    ? `${DEED_RATES[regDeedType].rfPct}%`
                                    : `₹${DEED_RATES[regDeedType].rfFixed?.toLocaleString("en-IN")} fixed`}
                                </td>
                                <td
                                  className="py-2.5 px-4 text-right font-semibold"
                                  style={{ color: "#D4800A" }}
                                >
                                  {formatINR(regCalc.rf)}
                                </td>
                              </tr>
                              <tr className="border-b border-border/50 bg-background">
                                <td className="py-2.5 px-4 font-medium text-foreground">
                                  User Charges
                                </td>
                                <td className="py-2.5 px-4 text-muted-foreground text-xs">
                                  Fixed
                                </td>
                                <td
                                  className="py-2.5 px-4 text-right font-semibold"
                                  style={{ color: "#D4800A" }}
                                >
                                  {formatINR(regCalc.userCharges)}
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr
                                style={{
                                  backgroundColor: "rgba(212,128,10,0.1)",
                                  borderTop: "2px solid rgba(212,128,10,0.3)",
                                }}
                              >
                                <td
                                  colSpan={2}
                                  className="py-3 px-4 font-mono font-bold text-foreground"
                                >
                                  Total Registration Cost
                                </td>
                                <td
                                  className="py-3 px-4 text-right font-mono font-bold text-xl"
                                  style={{ color: "#D4800A" }}
                                >
                                  {formatINR(regCalc.total)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="reg-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                        data-ocid="reg_fees.empty_state"
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: "rgba(212,128,10,0.1)" }}
                        >
                          <FileText
                            className="w-8 h-8"
                            style={{ color: "#D4800A", opacity: 0.5 }}
                          />
                        </div>
                        <p className="text-muted-foreground font-serif italic">
                          Enter a property value to calculate fees
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ఆస్తి విలువ నమోదు చేయండి
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CONTACT SECTION
      ═══════════════════════════════════════════════ */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                color: "#D4800A",
                backgroundColor: "rgba(212,128,10,0.1)",
              }}
            >
              ✦ Contact ✦
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Get In Touch
            </h2>
            <p className="mt-2 text-muted-foreground">సంప్రదించండి</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <a href="tel:+919848872469" className="block h-full">
                <Card className="h-full border-border hover:border-primary/40 hover:shadow-gold transition-all duration-300 cursor-pointer group">
                  <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: "rgba(212,128,10,0.12)",
                        color: "#D4800A",
                      }}
                    >
                      <Phone className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                      Phone
                    </h3>
                    <p
                      className="font-mono font-bold text-lg"
                      style={{ color: "#D4800A" }}
                    >
                      +91 9848872469
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ఫోన్ చేయండి
                    </p>
                  </CardContent>
                </Card>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <a
                href="mailto:nageswaraprasadtv@gmail.com"
                className="block h-full"
              >
                <Card className="h-full border-border hover:border-primary/40 hover:shadow-gold transition-all duration-300 cursor-pointer group">
                  <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: "rgba(212,128,10,0.12)",
                        color: "#D4800A",
                      }}
                    >
                      <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                      Email
                    </h3>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#D4800A" }}
                    >
                      nageswaraprasadtv@gmail.com
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ఇమెయిల్ చేయండి
                    </p>
                  </CardContent>
                </Card>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-border hover:border-primary/40 hover:shadow-gold transition-all duration-300 group">
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: "rgba(212,128,10,0.12)",
                      color: "#D4800A",
                    }}
                  >
                    <MapPin className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                    Address
                  </h3>
                  <p className="text-sm text-foreground font-bold leading-relaxed">
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
                    onClick={() => setShowMap(true)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                    style={{ color: "#D4800A" }}
                    data-ocid="contact.location.button"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    View Location / స్థానం చూడండి
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center gap-4"
          >
            {[
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
            ].map((sm) => (
              <a
                key={sm.label}
                href={sm.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={sm.label}
                title={sm.label}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:opacity-85 hover:scale-110 transition-all duration-200 shadow-md"
                style={{ background: sm.bg }}
              >
                <span className="sr-only">{sm.label}</span>
                {sm.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer
        className="bg-card border-t-2 py-10"
        style={{ borderColor: "rgba(212,128,10,0.25)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full border-2 overflow-hidden flex-shrink-0"
                  style={{ borderColor: "#D4800A" }}
                >
                  <img
                    src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
                    alt="Proprietor"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p
                    className="font-serif font-bold text-base leading-tight"
                    style={{ color: "#D4800A" }}
                  >
                    Lakshmi Ganapathi
                  </p>
                  <p className="font-serif text-sm text-muted-foreground">
                    Communications
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: "#D4800A" }}>
                Prop: Tiruvaipati Venkata Nageswara Prasad
              </p>
              <p className="text-xs text-muted-foreground mt-1 italic font-serif">
                "Measure with precision, plan with wisdom"
              </p>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-serif font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
                Address
              </h4>
              <div className="flex gap-2">
                <MapPin
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#D4800A" }}
                />
                <p className="text-sm font-bold text-foreground leading-relaxed">
                  Shop No-22, Pullareddy Complex,
                  <br />
                  Beside Registration Office,
                  <br />
                  Near Ravi Priya Mall, Ongole,
                  <br />
                  Prakasam Dist, Andhra Pradesh,
                  <br />
                  Pin - 523002
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                style={{ color: "#D4800A" }}
                data-ocid="footer.location.button"
              >
                <MapPin className="w-3 h-3" />
                View Location / స్థానం చూడండి
              </button>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
                Contact
              </h4>
              <div className="space-y-2">
                <a
                  href="tel:+919848872469"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Phone className="w-4 h-4" style={{ color: "#D4800A" }} />
                  <span
                    className="font-mono font-bold"
                    style={{ color: "#D4800A" }}
                  >
                    +91 9848872469
                  </span>
                </a>
                <a
                  href="mailto:nageswaraprasadtv@gmail.com"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Mail className="w-4 h-4" style={{ color: "#D4800A" }} />
                  <span className="font-bold text-sm text-foreground">
                    nageswaraprasadtv@gmail.com
                  </span>
                </a>
              </div>
              {/* Social icons */}
              <div className="flex gap-2 mt-4">
                {[
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
                ].map((sm) => (
                  <a
                    key={sm.label}
                    href={sm.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={sm.label}
                    title={sm.label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 hover:scale-110 transition-all duration-200"
                    style={{ background: sm.bg }}
                  >
                    <span className="sr-only">{sm.label}</span>
                    {sm.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Lakshmi Ganapathi Communications. All
              rights reserved.
            </p>
            <p>
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "#D4800A" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════
          MAP MODAL
      ═══════════════════════════════════════════════ */}
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
