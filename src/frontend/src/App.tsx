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
  ListOrdered,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
const SQ_FT_PER_GADI = 72; // 1 Gadi = 72 sq ft = 8 sq yards
const SQ_FT_PER_GUNTHA = 1089; // 1 Guntha = 1089 sq ft
const SQ_FT_PER_CENTS = 435.6; // 1 Cent = 435.6 sq ft
const SQ_FT_PER_BIGHA = 14400; // 1 Bigha = 14400 sq ft
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

// ─── Formatting Utilities ─────────────────────────────────────────────────────

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
  dsdPct: number | null; // null = N/A
  rfPct: number | null; // null = use rfFixed
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

// ─── Property Type Button ─────────────────────────────────────────────────────

function PropertyTypeButton({
  label,
  active,
  onClick,
}: {
  label: PropertyType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-gold"
          : "bg-card text-foreground border-border hover:border-primary/60 hover:bg-accent/50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ─── Ornament Divider ─────────────────────────────────────────────────────────

function OrnamentDivider({ label }: { label?: string }) {
  return (
    <div className="ornament-divider my-2">
      <span className="text-xs font-serif text-primary/70 px-1 select-none">
        ✦
      </span>
      {label && (
        <span className="text-xs font-serif text-primary/80 tracking-wider uppercase">
          {label}
        </span>
      )}
      <span className="text-xs font-serif text-primary/70 px-1 select-none">
        ✦
      </span>
    </div>
  );
}

// ─── App Component ────────────────────────────────────────────────────────────

export default function App() {
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

  // ── Local entries state (displayed while backend syncs) ──
  const [localEntries, setLocalEntries] = useState<LocalEntry[]>([]);
  const [showMap, setShowMap] = useState(false);

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
    return {
      ...areas,
      totalValue: areas.areaInUnit * rate,
    };
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

    // Save to backend
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
      {
        onError: () => {
          // Fallback to local
          setLocalEntries((prev) => [...prev, newEntry]);
        },
      },
    );

    // Optimistic local update
    if (!backendEntries || backendEntries.length === 0) {
      setLocalEntries((prev) => [...prev, newEntry]);
    }

    toast.success("Measurement added to list!");
    // Reset form
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

  // ── Grand totals ──
  const grandTotals = useMemo(() => {
    if (displayEntries.length === 0) return null;
    const totalValue = displayEntries.reduce((sum, e) => sum + e.totalValue, 0);
    return { totalValue };
  }, [displayEntries]);

  // ── Registration Fees calculation ──
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

  // Auto-sync calculator total to registration fees when unit rate changes
  useEffect(() => {
    if (calc && calc.totalValue > 0 && Number.parseFloat(unitRate) > 0) {
      setRegPropertyValue(String(Math.round(calc.totalValue)));
    }
  }, [calc, unitRate]);

  return (
    <div className="min-h-screen mandala-bg bg-background">
      <Toaster richColors position="top-center" />

      {/* ── Header ── */}
      <header className="relative border-b-2 border-primary/30 bg-card shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Ornamental top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Sai Baba image + App name */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/50 overflow-hidden shadow-gold bg-accent/40 flex-shrink-0">
                    <img
                      src="/assets/uploads/20220114_213453-019d2931-0747-7085-a4e7-c0c1afaeac91-1.jpg"
                      alt="Tiruvaipati Venkata Nageswara Prasad"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-primary text-base">
                    ✦
                  </div>
                </div>
              </div>
              <div>
                <h1
                  className="font-serif text-2xl md:text-3xl font-bold leading-tight"
                  style={{ color: "#D4800A" }}
                >
                  Lakshmi Ganapathi Communications
                </h1>
                <h2 className="font-serif text-base md:text-lg font-semibold text-secondary leading-tight mt-0.5">
                  Property Land Measurement Calculator
                </h2>
              </div>
            </div>

            {/* Decorative middle */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <span className="font-serif text-primary/40 text-3xl tracking-[0.5em]">
                ✦ ❈ ✦
              </span>
            </div>

            {/* Tagline + Contact */}
            <div className="text-center md:text-right">
              <p className="font-serif italic text-secondary/70 text-sm">
                "Measure with precision,"
              </p>
              <p className="font-serif italic text-secondary/70 text-sm">
                "plan with wisdom"
              </p>
              <div className="mt-2 flex flex-col items-center md:items-end gap-1">
                <a
                  href="tel:+919848872469"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-3 h-3 text-primary" />
                  <span className="font-mono font-bold tracking-wider text-lg text-primary">
                    +91 9848872469
                  </span>
                </a>
                <a
                  href="mailto:nageswaraprasadtv@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-3 h-3 text-primary" />
                  <span className="font-bold">nageswaraprasadtv@gmail.com</span>
                </a>
                <div className="mt-1 text-center md:text-right">
                  <p className="font-bold text-sm text-primary">
                    Prop: Tiruvaipati Venkata Nageswara Prasad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom ornamental border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl md:text-4xl font-bold text-secondary leading-tight mb-3"
            >
              <span className="text-primary">Land Measurement Calculator</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground text-base max-w-md mx-auto md:mx-0 mb-5"
            >
              Calculate agricultural land, plots, and room dimensions with
              instant unit conversions and property value estimation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20">
                <span className="text-primary">✦</span> Sq Ft / Yards / Meters /
                Gadi
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20">
                <span className="text-primary">✦</span> Instant ₹ Valuation
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20">
                <span className="text-primary">✦</span> Multiple Property Types
              </span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-shrink-0"
          >
            <div className="relative w-56 h-52 md:w-72 md:h-64">
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 bg-accent/30" />
              <img
                src="/assets/uploads/d3911ffd02da7e389eb7e2bfd77965c8-019d2a3e-9149-703a-b7f3-dd338325d17f-1.jpg"
                alt="Lakshmi Ganapathi Communications"
                className="relative z-10 w-full h-full object-cover rounded-xl"
              />
              {/* Corner ornaments */}
              <span className="absolute -top-2 -left-2 text-primary text-lg">
                ✦
              </span>
              <span className="absolute -top-2 -right-2 text-primary text-lg">
                ✦
              </span>
              <span className="absolute -bottom-2 -left-2 text-primary text-lg">
                ✦
              </span>
              <span className="absolute -bottom-2 -right-2 text-primary text-lg">
                ✦
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <OrnamentDivider label="Property Measurement" />

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Calculator Form (left, larger) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="shadow-card border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-secondary">
                  <Calculator className="w-5 h-5 text-primary" />
                  Land Measurement Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Property Type */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Property Type
                  </Label>
                  <div
                    className="flex flex-wrap gap-2"
                    data-ocid="property_type.toggle"
                  >
                    {(
                      ["Agricultural Land", "Land", "Room"] as PropertyType[]
                    ).map((pt) => (
                      <PropertyTypeButton
                        key={pt}
                        label={pt}
                        active={propertyType === pt}
                        onClick={() => setPropertyType(pt)}
                      />
                    ))}
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Unit Selector */}
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    Input Unit
                  </Label>
                  <Select
                    value={unit}
                    onValueChange={(v) => setUnit(v as Unit)}
                  >
                    <SelectTrigger
                      className="flex-1 bg-background border-border focus:ring-primary"
                      data-ocid="unit.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        [
                          { value: "Sq Ft", label: "Sq Ft / చ.అడుగు" },
                          { value: "Sq Yards", label: "Sq Yards / చ.గజాలు" },
                          { value: "Sq Meters", label: "Sq Meters / చ.మీటరు" },
                          {
                            value: "Gadi",
                            label: "Gadi / గడి (1 Gadi = 72 Sq Ft)",
                          },
                          {
                            value: "Guntha",
                            label: "Guntha / గుంట (1 Guntha = 1089 Sq Ft)",
                          },
                          {
                            value: "Cents",
                            label: "Cents / సెంట్ (1 Cent = 435.6 Sq Ft)",
                          },
                          {
                            value: "Bigha",
                            label: "Bigha / బిఘా (1 Bigha = 14400 Sq Ft)",
                          },
                          {
                            value: "Acre",
                            label: "Acre / ఎకరం (1 Acre = 43560 Sq Ft)",
                          },
                          {
                            value: "Hectare",
                            label: "Hectare / హెక్టారు (1 Hectare = 10000 Sq M)",
                          },
                        ] as { value: Unit; label: string }[]
                      ).map(({ value: u, label: uLabel }) => (
                        <SelectItem key={u} value={u} className="font-bold">
                          {uLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Directional Inputs */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                    Directional Measurements ({unit})
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "East / తూర్పు",
                        value: east,
                        setter: setEast,
                        id: "east.input",
                      },
                      {
                        label: "West / పడమర",
                        value: west,
                        setter: setWest,
                        id: "west.input",
                      },
                      {
                        label: "North / ఉత్తరం",
                        value: north,
                        setter: setNorth,
                        id: "north.input",
                      },
                      {
                        label: "South / దక్షిణం",
                        value: south,
                        setter: setSouth,
                        id: "south.input",
                      },
                    ].map(({ label, value, setter, id }) => (
                      <div key={label}>
                        <Label className="text-xs text-muted-foreground mb-1.5 block font-bold">
                          {label}
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="bg-background border-border focus:ring-primary pl-3 pr-3 text-foreground"
                            data-ocid={id}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rooms Count (only for Room type) */}
                <AnimatePresence>
                  {propertyType === "Room" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label className="text-xs text-muted-foreground mb-1.5 block font-bold">
                        Number of Rooms
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="1"
                        value={roomsCount}
                        onChange={(e) => setRoomsCount(e.target.value)}
                        className="bg-background border-border focus:ring-primary max-w-32"
                        data-ocid="rooms.input"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Unit Rate */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Unit Rate (₹ per {unit})
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-semibold text-sm">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={unitRate}
                      onChange={(e) => setUnitRate(e.target.value)}
                      className="bg-background border-border focus:ring-primary pl-7"
                      data-ocid="unit_rate.input"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddEntry}
                  disabled={addEntryMutation.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide shadow-gold"
                  data-ocid="measurement.add_button"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {addEntryMutation.isPending ? "Adding..." : "Add to List"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Right Column: Results + Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Live Results Panel */}
            <Card className="shadow-card border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-secondary text-base">
                  Live Results / లైవ్ ఫలితాలు
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {calc ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Total Area Highlight */}
                      <div className="rounded-xl bg-accent border border-primary/30 p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Total Area / మొత్తం విస్తీర్ణం ({unit})
                        </p>
                        <p className="font-mono text-3xl font-bold text-secondary">
                          {formatArea(calc.areaInUnit)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {unit}
                        </p>
                      </div>

                      {/* Unit Conversions */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          All Units / అన్ని యూనిట్లు
                        </p>
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
                            className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-background border border-border"
                          >
                            <span className="text-sm text-muted-foreground">
                              {label}
                            </span>
                            <span className="font-semibold text-foreground text-sm">
                              {formatArea(value)}{" "}
                              <span className="text-xs text-muted-foreground">
                                {suffix}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total Value */}
                      {Number.parseFloat(unitRate) > 0 && (
                        <div className="rounded-xl bg-secondary/10 border border-secondary/30 p-4 text-center">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                            Estimated Value / అంచనా విలువ
                          </p>
                          <p className="font-mono text-2xl font-bold text-secondary">
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
                      className="text-center py-8"
                      data-ocid="results.empty_state"
                    >
                      <div className="text-3xl mb-2 text-primary/40">✦</div>
                      <p className="text-sm text-muted-foreground font-serif italic">
                        Enter measurements above to see live results
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {displayEntries.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-card border border-border p-3 text-center shadow-xs">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Entries
                  </p>
                  <p className="font-mono text-2xl font-bold text-primary">
                    {displayEntries.length}
                  </p>
                </div>
                <div className="rounded-xl bg-card border border-border p-3 text-center shadow-xs">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Value
                  </p>
                  <p className="font-mono text-lg font-bold text-secondary leading-tight">
                    {formatINR(grandTotals?.totalValue ?? 0)}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Entries List ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <OrnamentDivider label="Recent Entries" />

          <Card className="shadow-card border-border bg-card mt-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-serif text-secondary">
                  <ListOrdered className="w-5 h-5 text-primary" />
                  Saved Measurements
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
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Loading entries...
                  </p>
                </div>
              ) : displayEntries.length === 0 ? (
                <div
                  className="text-center py-10"
                  data-ocid="entries.empty_state"
                >
                  <div className="text-4xl mb-3 text-primary/30">❈</div>
                  <p className="font-serif italic text-muted-foreground text-sm">
                    No measurements saved yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add measurements using the calculator above.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-b border-border">
                        {[
                          "#",
                          "Property Type",
                          "Dimensions (E×W / N×S)",
                          "Total Area",
                          "Value",
                          "",
                        ].map((h) => (
                          <th
                            key={h}
                            className="pb-2 px-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayEntries.map((entry, idx) => (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={[
                            "border-b border-border/50 transition-colors hover:bg-accent/30",
                            idx % 2 === 0 ? "bg-background" : "bg-accent/10",
                          ].join(" ")}
                          data-ocid={`entries.item.${idx + 1}`}
                        >
                          <td className="py-2.5 px-2 text-muted-foreground text-xs font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                              {entry.propertyType}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-foreground font-mono text-xs">
                            {entry.east}×{entry.west} / {entry.north}×
                            {entry.south}
                            <span className="text-muted-foreground ml-1">
                              ({entry.unit})
                            </span>
                            {entry.propertyType === "Room" && (
                              <span className="ml-1 text-primary">
                                × {entry.roomsCount}R
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-secondary">
                            {formatArea(entry.totalArea, 2)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {entry.unit}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-secondary">
                            {entry.unitRate > 0
                              ? formatINR(entry.totalValue)
                              : "—"}
                          </td>
                          <td className="py-2.5 px-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              data-ocid={`entries.delete_button.${idx + 1}`}
                              aria-label="Remove entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                    {grandTotals && (
                      <tfoot>
                        <tr className="border-t-2 border-primary/30 bg-accent/40">
                          <td
                            colSpan={3}
                            className="py-2.5 px-2 font-mono font-semibold text-secondary text-sm"
                          >
                            Grand Total
                          </td>
                          <td className="py-2.5 px-2" />
                          <td className="py-2.5 px-2 font-bold text-secondary font-mono">
                            {formatINR(grandTotals.totalValue)}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Registration Fees Calculator ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <OrnamentDivider label="Registration Fees" />

          <Card className="shadow-card border-border bg-card mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-serif text-secondary">
                <span className="text-primary text-lg">₹</span>
                Registration Fees Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Deed Type + Property Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deed Type */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Deed Type
                  </Label>
                  <Select
                    value={regDeedType}
                    onValueChange={(v) => setRegDeedType(v as DeedType)}
                  >
                    <SelectTrigger
                      className="bg-background border-border focus:ring-primary"
                      data-ocid="reg_deed.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DEED_RATES) as DeedType[]).map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Value */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Property Value (₹)
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-semibold text-sm">
                        ₹
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="0"
                        value={regPropertyValue}
                        onChange={(e) => setRegPropertyValue(e.target.value)}
                        className="bg-background border-border focus:ring-primary pl-7"
                        data-ocid="reg_property_value.input"
                      />
                    </div>
                    {grandTotals && grandTotals.totalValue > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRegPropertyValue(
                            String(Math.round(grandTotals.totalValue)),
                          )
                        }
                        className="whitespace-nowrap text-xs border-primary/40 text-primary hover:bg-primary/10"
                        data-ocid="reg_use_total.button"
                      >
                        Use Calculator Total
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Rate Reference */}
              <div className="rounded-lg bg-accent/50 border border-primary/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Applicable Rates — {regDeedType}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border text-xs">
                    <span className="font-semibold text-secondary">DSD:</span>
                    <span className="text-foreground">
                      {DEED_RATES[regDeedType].dsdPct !== null
                        ? `${DEED_RATES[regDeedType].dsdPct}%`
                        : "N/A"}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border text-xs">
                    <span className="font-semibold text-secondary">R.F:</span>
                    <span className="text-foreground">
                      {DEED_RATES[regDeedType].rfPct !== null
                        ? `${DEED_RATES[regDeedType].rfPct}%`
                        : `₹${DEED_RATES[regDeedType].rfFixed?.toLocaleString("en-IN")} fixed`}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border text-xs">
                    <span className="font-semibold text-secondary">
                      User Charges:
                    </span>
                    <span className="text-foreground">
                      ₹
                      {DEED_RATES[regDeedType].userCharges.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </span>
                </div>
              </div>

              {/* Calculated Breakdown */}
              <AnimatePresence mode="wait">
                {regCalc ? (
                  <motion.div
                    key="reg-results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-primary/30 overflow-hidden"
                    data-ocid="reg_fees.card"
                  >
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
                        {/* DSD Row */}
                        <tr className="border-b border-border/50 bg-background">
                          <td className="py-2.5 px-4 font-medium text-foreground">
                            DSD (Duty Stamp Duty)
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground text-xs">
                            {DEED_RATES[regDeedType].dsdPct !== null
                              ? `${DEED_RATES[regDeedType].dsdPct}%`
                              : "—"}
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-secondary">
                            {regCalc.dsd !== null
                              ? formatINR(regCalc.dsd)
                              : "—"}
                          </td>
                        </tr>
                        {/* R.F Row */}
                        <tr className="border-b border-border/50 bg-accent/10">
                          <td className="py-2.5 px-4 font-medium text-foreground">
                            R.F (Registration Fee)
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground text-xs">
                            {DEED_RATES[regDeedType].rfPct !== null
                              ? `${DEED_RATES[regDeedType].rfPct}%`
                              : `₹${DEED_RATES[regDeedType].rfFixed?.toLocaleString("en-IN")} fixed`}
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-secondary">
                            {formatINR(regCalc.rf)}
                          </td>
                        </tr>
                        {/* User Charges Row */}
                        <tr className="border-b border-border/50 bg-background">
                          <td className="py-2.5 px-4 font-medium text-foreground">
                            User Charges
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground text-xs">
                            Fixed
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-secondary">
                            {formatINR(regCalc.userCharges)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-secondary/10 border-t-2 border-secondary/30">
                          <td
                            colSpan={2}
                            className="py-3 px-4 font-mono font-bold text-secondary"
                          >
                            Total Registration Cost
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-secondary text-base">
                            {formatINR(regCalc.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reg-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 rounded-xl border border-border bg-accent/20"
                    data-ocid="reg_fees.empty_state"
                  >
                    <div className="text-2xl mb-2 text-primary/30">₹</div>
                    <p className="text-sm text-muted-foreground font-serif italic">
                      Enter a property value above to calculate registration
                      fees
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-primary/20 bg-card py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="ornament-divider mb-4">
            <span className="text-xs font-serif text-primary/60 px-2">
              ✦ ❈ ✦
            </span>
          </div>
          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
            <a
              href="tel:+919848872469"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono font-bold tracking-wider text-lg text-primary">
                +91 9848872469
              </span>
            </a>
            <span className="text-primary/30 text-xs">✦</span>
            <a
              href="mailto:nageswaraprasadtv@gmail.com"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold">nageswaraprasadtv@gmail.com</span>
            </a>
          </div>
          <div className="mt-2 text-center">
            <p className="font-bold text-sm text-primary">
              Prop: Tiruvaipati Venkata Nageswara Prasad
            </p>
            <p className="text-xs font-bold">
              Shop No-22, Pullareddy Complex, Beside Registration Office, Near
              Ravi Priya Mall, Ongole, Prakasam Dist, Andhra Pradesh, Pin -
              523002
            </p>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              View Location / స్థానం చూడండి
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <a
              href="https://wa.me/919848872469"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity hover:scale-110"
              style={{ backgroundColor: "#25D366" }}
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              <span className="sr-only">WhatsApp</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="white"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity hover:scale-110"
              style={{ backgroundColor: "#0088cc" }}
              title="Telegram"
              aria-label="Telegram"
            >
              <span className="sr-only">Telegram</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="white"
                aria-hidden="true"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity hover:scale-110"
              style={{ backgroundColor: "#1877F2" }}
              title="Facebook"
              aria-label="Facebook"
            >
              <span className="sr-only">Facebook</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="white"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity hover:scale-110"
              style={{
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
              title="Instagram"
              aria-label="Instagram"
            >
              <span className="sr-only">Instagram</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="white"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity hover:scale-110"
              style={{ backgroundColor: "#000000" }}
              title="Twitter/X"
              aria-label="Twitter/X"
            >
              <span className="sr-only">Twitter/X</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="white"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Property Land Measurement Calculator |
            Lakshmi Ganapathi Communications. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Our Location / మా స్థానం
              </h3>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-4 py-2 text-xs font-bold text-gray-700">
              Shop No-22, Pullareddy Complex, Beside Registration Office, Near
              Ravi Priya Mall, Ongole, Prakasam Dist, AP - 523002
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
            <div className="flex gap-2 px-4 py-3 border-t">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Pullareddy+Complex,+Registration+Office,+Ravi+Priya+Mall,+Ongole,+Prakasam,+Andhra+Pradesh+523002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-primary text-white text-sm font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Directions / దిశలు పొందండి
              </a>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="px-4 text-sm font-bold border rounded-lg hover:bg-gray-50"
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
