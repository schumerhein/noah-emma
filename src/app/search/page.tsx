"use client";

import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, SlidersHorizontal, X, Check, ChevronLeft, Bell, BellOff, ArrowUpDown, Crown, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { haalGeblokkeerdeIds, filterZichtbaar } from "@/lib/zichtbaarheid";
import Image from "next/image";

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORY_HIERARCHY: Record<string, { icon: string; sub: string[] }> = {
  "Meisjeskleding": { icon: "👧", sub: [
    "Jurken & Rokken", "Jassen & Vesten", "Truien & Sweaters", "T-shirts & Tops",
    "Broeken & Leggings", "Zwemkleding & Badpakken", "Pyjama & Ondergoed",
    "Schoenen & Laarzen", "Sokken & Kousen", "Feest & Galakleding",
    "Sportkleding", "Mutsen & Sjaals",
  ]},
  "Jongenskleding": { icon: "👦", sub: [
    "Jassen & Vesten", "Truien & Sweaters", "T-shirts & Poloshirts",
    "Overhemden", "Broeken & Shorts", "Joggingbroeken & Trainingskleding",
    "Zwemkleding", "Pyjama & Ondergoed", "Schoenen & Laarzen",
    "Sokken", "Sportkleding", "Feestkleding",
  ]},
  "Speelgoed": { icon: "🧸", sub: [
    "Houten Speelgoed", "Educatief Speelgoed", "Knuffels & Poppen",
    "Buitenspeelgoed", "Puzzels & Gezelschapsspellen", "Constructie & Lego",
    "Rollenspel & Verkleedkleding", "Muziek & Creativiteit",
    "Baby & Peuter Speelgoed", "Voertuigen & RC-speelgoed",
    "Treinen & Banen", "Waterspeelgoed",
  ]},
  "Kinderwagens, buggy's & autostoeltjes": { icon: "🛒", sub: [
    "Combinatiewagens", "Buggy's & Wandelwagens", "Tweelingwagens",
    "Autostoeltjes Groep 0-0+", "Autostoeltjes Groep 1-2-3",
    "Maxi-Cosi Accessoires", "Draagdoeken & Draagzakken",
    "Fietsstoeltjes & Fietskarren", "Reisbassins & Reiswiegjes",
    "Regenhoes & Muggennet",
  ]},
  "Meubilair & decoratie": { icon: "🛏️", sub: [
    "Bedjes & Wiegjes", "Matrassen", "Kasten & Commodes",
    "Kinderstoelen & Hoge Stoelen", "Bureaus & Kindertafels",
    "Decoratie & Wanddecoratie", "Verlichting",
    "Opbergers & Dozen", "Babykamerset", "Boxen & Boxkleden",
  ]},
  "Badderen & verschonen": { icon: "🛁", sub: [
    "Babybadjes", "Verschoontafels & -matten", "Luiers & Doekjes",
    "Babyverzorging", "Badcapes & Washandjes", "Luierzakken & Etuis",
  ]},
  "Veiligheid in en om het huis": { icon: "🔒", sub: [
    "Babyhekjes & Afzettingen", "Stopcontact- & Meubelbeveiliging",
    "Babyfoons & Slaapmonitors", "Gordijnen & Raamdecoratie",
    "Helmen & Bescherming", "Anti-valmatten",
  ]},
  "Gezondheid & zwangerschap": { icon: "🤰", sub: [
    "Zwangerschapskleding", "Zwangerschapskussens",
    "Borstvoeding Accessoires", "Kolfapparaten & Flesjes",
    "Thermometers & Monitoren", "Vitaminen & Supplementen",
  ]},
  "Voeden": { icon: "🍼", sub: [
    "Zuigflessen & Tepels", "Borstkolven", "Eetservies & Slabbetjes",
    "Kinderstoelen (eten)", "Potjes & Knijpzakjes",
    "Sterilisatoren & Warmers", "Diepvriesbewaarzakjes",
  ]},
  "Slapen & beddengoed": { icon: "😴", sub: [
    "Slaapzakken", "Wiegjes & Reiswiegjes", "Kussens & Dekbedden",
    "Hoeslakens & Beddengoed", "Nachtlampjes & Schemerlicht",
    "Speendoekjes & Troostobjecten",
  ]},
  "Schoolbenodigdheden": { icon: "🎒", sub: [
    "Schooltassen & Rugzakken", "Pennenetuis & Schrijfgerei",
    "Lunchboxen & Drinkflessen", "Gymtassen & Sportspullen",
    "Leesboeken & Lesmateriaal", "Knutsel- & Tekenmateriaal",
  ]},
  "Overige kinderartikelen": { icon: "📦", sub: [
    "Speelmatten & Activiteitencentra", "Wipstoelen & Schommels",
    "Looprekjes & Loopwagens", "Zwemspeelgoed & Waterspelen",
    "Baby Monitors & Tech", "Cadeaus & Feestartikelen",
    "Boeken & Films",
  ]},
};

const SIZES = ["50","56","62","68","74","80","86","92","98","104","110","116","122","128","134","140","146","152","158/164"];
const CONDITIONS = ["Nieuw met prijskaartje", "Zo goed als nieuw", "Goed", "Gebruikt"];
const KLEUREN = [
  { naam: "Wit", hex: "#ffffff", border: true },
  { naam: "Zwart", hex: "#1a1a1a" },
  { naam: "Grijs", hex: "#9ca3af" },
  { naam: "Rood", hex: "#ef4444" },
  { naam: "Roze", hex: "#ffb8c4" },
  { naam: "Oranje", hex: "#f97316" },
  { naam: "Geel", hex: "#fbbf24" },
  { naam: "Groen", hex: "#22c55e" },
  { naam: "Blauw", hex: "#3b82f6" },
  { naam: "Paars", hex: "#a855f7" },
  { naam: "Bruin", hex: "#92400e" },
  { naam: "Beige", hex: "#d4b896" },
];
const FILTER_BRANDS = [
  "H&M","Zara Kids","Next","Hema","Name It","Molo","Petit Bateau",
  "Noppies","Prenatal","Boden","Tommy Hilfiger","Nike","Adidas",
  "Scotch & Soda","Gap","Stokke","Bugaboo","Chicco","Maxi-Cosi",
];
const POPULAR_BRANDS = ["Zara","H&M","Petit Bateau","GAP","Nike","Adidas","Stokke","Bugaboo"];
const MATERIALEN = ["Katoen","Polyester","Wol","Denim","Fleece","Linnen","Katoen-mix","Synthetisch"];

// ── Types ──────────────────────────────────────────────────────────────────

type SorteerOptie = "relevantie" | "nieuwste" | "prijs_laag" | "prijs_hoog";

type Listing = {
  id: string;
  titel: string;
  prijs: number;
  maat: string;
  conditie: string;
  merk: string | null;
  kleur: string | null;
  foto_urls: string[];
  user_id?: string;
  moderatie_status?: string;
  actief?: boolean;
  verkocht?: boolean;
  profiles?: { naam: string | null; stad: string | null };
};

type Filters = {
  sizeMinIdx: number;
  sizeMaxIdx: number;
  conditions: string[];
  colors: string[];
  merken: string[];
  materialen: string[];
  minPrijs: string;
  maxPrijs: string;
};

const INIT_FILTERS: Filters = {
  sizeMinIdx: 0,
  sizeMaxIdx: SIZES.length - 1,
  conditions: [],
  colors: [],
  merken: [],
  materialen: [],
  minPrijs: "",
  maxPrijs: "",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router = useRouter();
  const [zoekterm, setZoekterm] = useState("");
  const [activeMainCat, setActiveMainCat] = useState<string | null>(null);
  const [resultaten, setResultaten] = useState<Listing[]>([]);
  const [ladenResultaten, setLadenResultaten] = useState(false);
  const [heeftGezocht, setHeeftGezocht] = useState(false);
  const [sortering, setSortering] = useState<SorteerOptie>("nieuwste");
  const [toonSorteer, setToonSorteer] = useState(false);
  const [waarschuwingActief, setWaarschuwingActief] = useState(false);
  const [waarschuwingBezig, setWaarschuwingBezig] = useState(false);
  const [filters, setFilters] = useState<Filters>(INIT_FILTERS);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [premiumActiveren, setPremiumActiveren] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsPremium(false); return; }
      const { data } = await supabase.from("profiles").select("is_premium, premium_verloopdatum").eq("id", user.id).single();
      const premium = data?.is_premium && (!data.premium_verloopdatum || new Date(data.premium_verloopdatum) > new Date());
      setIsPremium(premium || false);
    })();
  }, []);

  const activeerPremium = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    setPremiumActiveren(true);
    try {
      const res = await fetch("/api/betalen/premium", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Betaling starten mislukt");
      window.location.href = data.checkoutUrl;
    } catch {
      setPremiumActiveren(false);
    }
  };

  const zoek = useCallback(async (
    term: string,
    f: Filters = filters,
    sort: SorteerOptie = sortering
  ) => {
    const sizeActive = !(f.sizeMinIdx === 0 && f.sizeMaxIdx === SIZES.length - 1);
    const hasFilter = sizeActive || f.conditions.length > 0 || f.colors.length > 0 ||
      f.merken.length > 0 || f.materialen.length > 0 || !!f.minPrijs || !!f.maxPrijs;

    if (!term && !hasFilter) { setResultaten([]); setHeeftGezocht(false); return; }

    setLadenResultaten(true);
    setHeeftGezocht(true);

    // Geen actief-filter in de query: verkochte items tonen we mét badge.
    // Handmatig verborgen items filteren we hieronder alsnog weg.
    let query = supabase
      .from("listings")
      .select("*, profiles(naam, stad)")
      .limit(60);

    if (sort === "prijs_laag") query = query.order("prijs", { ascending: true });
    else if (sort === "prijs_hoog") query = query.order("prijs", { ascending: false });
    else if (sort === "relevantie") query = query.order("likes", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    if (term) query = query.or(`titel.ilike.%${term}%,beschrijving.ilike.%${term}%,merk.ilike.%${term}%,categorie.ilike.%${term}%`);
    if (sizeActive) query = query.in("maat", SIZES.slice(f.sizeMinIdx, f.sizeMaxIdx + 1));
    if (f.conditions.length > 0) query = query.in("conditie", f.conditions);
    if (f.colors.length > 0) query = query.in("kleur", f.colors);
    if (f.merken.length > 0) query = query.in("merk", f.merken);
    if (f.materialen.length > 0) query = query.in("materiaal", f.materialen);
    if (f.minPrijs) query = query.gte("prijs", parseFloat(f.minPrijs));
    if (f.maxPrijs) query = query.lte("prijs", parseFloat(f.maxPrijs));

    const [{ data }, geblokkeerd, { data: { user } }] = await Promise.all([
      query,
      haalGeblokkeerdeIds(),
      supabase.auth.getUser(),
    ]);
    const zichtbaar = filterZichtbaar((data as Listing[]) || [], geblokkeerd, user?.id)
      // Beschikbare items tonen, plus verkochte items (met badge); handmatig verborgen items niet
      .filter(l => l.actief !== false || l.verkocht === true)
      // Verkochte items achteraan
      .sort((a, b) => Number(a.verkocht === true) - Number(b.verkocht === true));
    setResultaten(zichtbaar);
    setLadenResultaten(false);
  }, [filters, sortering]);

  useEffect(() => {
    const t = setTimeout(() => zoek(zoekterm), 300);
    return () => clearTimeout(t);
  }, [zoekterm]);

  useEffect(() => {
    if (!zoekterm) { setWaarschuwingActief(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("zoekwaarschuwingen").select("id")
        .eq("user_id", user.id).eq("zoekterm", zoekterm).maybeSingle();
      setWaarschuwingActief(!!data);
    })();
  }, [zoekterm]);

  const toggleZoekwaarschuwing = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setWaarschuwingBezig(true);
    if (waarschuwingActief) {
      await supabase.from("zoekwaarschuwingen").delete().eq("user_id", user.id).eq("zoekterm", zoekterm);
      setWaarschuwingActief(false);
    } else {
      await supabase.from("zoekwaarschuwingen").insert({
        user_id: user.id, zoekterm,
        max_prijs: filters.maxPrijs ? parseFloat(filters.maxPrijs) : null,
      });
      setWaarschuwingActief(true);
    }
    setWaarschuwingBezig(false);
  };

  const toggleFilter = (key: "conditions" | "colors" | "merken" | "materialen", value: string) => {
    setFilters(prev => {
      const list = prev[key] as string[];
      const next = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
      const updated = { ...prev, [key]: next };
      zoek(zoekterm, updated);
      return updated;
    });
  };

  const updateSizeMin = (idx: number) => {
    const updated = { ...filters, sizeMinIdx: Math.min(idx, filters.sizeMaxIdx - 1) };
    setFilters(updated); zoek(zoekterm, updated);
  };
  const updateSizeMax = (idx: number) => {
    const updated = { ...filters, sizeMaxIdx: Math.max(idx, filters.sizeMinIdx + 1) };
    setFilters(updated); zoek(zoekterm, updated);
  };

  const veranderSortering = (s: SorteerOptie) => {
    setSortering(s); setToonSorteer(false); zoek(zoekterm, filters, s);
  };

  const sizeFilterActive = !(filters.sizeMinIdx === 0 && filters.sizeMaxIdx === SIZES.length - 1);
  const totaalActieveFilters = (sizeFilterActive ? 1 : 0) + filters.conditions.length +
    filters.colors.length + filters.merken.length + filters.materialen.length +
    (filters.minPrijs ? 1 : 0) + (filters.maxPrijs ? 1 : 0);

  const sorteerLabels: Record<SorteerOptie, string> = {
    relevantie: "Relevantie",
    nieuwste: "Nieuwste eerst",
    prijs_laag: "Prijs: laag → hoog",
    prijs_hoog: "Prijs: hoog → laag",
  };

  const minPct = (filters.sizeMinIdx / (SIZES.length - 1)) * 100;
  const maxPct = (filters.sizeMaxIdx / (SIZES.length - 1)) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32 relative">
      <style>{`
        .rng { -webkit-appearance:none; appearance:none; background:transparent; pointer-events:none; position:absolute; inset:0; width:100%; height:100%; }
        .rng::-webkit-slider-thumb { -webkit-appearance:none; height:22px; width:22px; border-radius:50%; background:white; border:2.5px solid #ffb8c4; box-shadow:0 1px 4px rgba(0,0,0,.15); cursor:pointer; pointer-events:all; }
        .rng::-moz-range-thumb { height:22px; width:22px; border-radius:50%; background:white; border:2.5px solid #ffb8c4; box-shadow:0 1px 4px rgba(0,0,0,.15); cursor:pointer; pointer-events:all; border-style:solid; }
      `}</style>

      {/* ── Header ── */}
      <header className="px-5 pt-14 pb-4 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {(heeftGezocht || activeMainCat) && (
            <button onClick={() => { setZoekterm(""); setActiveMainCat(null); setHeeftGezocht(false); setResultaten([]); }}>
              <ChevronLeft className="w-6 h-6 text-slate-500" />
            </button>
          )}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={zoekterm}
              onChange={e => setZoekterm(e.target.value)}
              placeholder="Zoek op naam, merk, maat..."
              className="w-full h-12 pl-12 pr-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-medium text-[15px] outline-none focus:ring-2 focus:ring-primary/30 border border-transparent"
            />
            {zoekterm && (
              <button onClick={() => setZoekterm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter knop */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                {totaalActieveFilters > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">{totaalActieveFilters}</span>
                  </div>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[92vh] rounded-t-3xl flex flex-col max-w-md mx-auto">
              <SheetHeader className="px-6 pt-2 pb-4 shrink-0">
                <SheetTitle className="text-xl font-black">Filters</SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="px-6 space-y-8 pb-4">

                  {/* Maat slider */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Maat</h3>
                    {/* Dual range */}
                    <div className="relative h-10 flex items-center mx-1">
                      <div className="absolute inset-x-0 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div
                        className="absolute h-1.5 bg-primary rounded-full pointer-events-none"
                        style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                      />
                      <input type="range" min={0} max={SIZES.length - 1} value={filters.sizeMinIdx}
                        onChange={e => updateSizeMin(Number(e.target.value))} className="rng" />
                      <input type="range" min={0} max={SIZES.length - 1} value={filters.sizeMaxIdx}
                        onChange={e => updateSizeMax(Number(e.target.value))} className="rng" />
                    </div>
                    {/* Text inputs */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Min</p>
                        <input
                          list="sizes-datalist"
                          value={SIZES[filters.sizeMinIdx]}
                          onChange={e => { const i = SIZES.indexOf(e.target.value); if (i !== -1) updateSizeMin(i); }}
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-primary"
                        />
                      </div>
                      <div className="w-5 h-px bg-slate-200 mb-4" />
                      <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Max</p>
                        <input
                          list="sizes-datalist"
                          value={SIZES[filters.sizeMaxIdx]}
                          onChange={e => { const i = SIZES.indexOf(e.target.value); if (i !== -1) updateSizeMax(i); }}
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <datalist id="sizes-datalist">
                      {SIZES.map(s => <option key={s} value={s} />)}
                    </datalist>
                    {sizeFilterActive && (
                      <p className="text-xs text-primary font-bold">
                        Maten {SIZES[filters.sizeMinIdx]} t/m {SIZES[filters.sizeMaxIdx]}
                      </p>
                    )}
                  </div>

                  {/* Prijs */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Prijs</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
                        <input type="number" value={filters.minPrijs} placeholder="Min"
                          onChange={e => { const u = { ...filters, minPrijs: e.target.value }; setFilters(u); zoek(zoekterm, u); }}
                          className="w-full h-11 pl-7 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-medium outline-none focus:border-primary text-sm" />
                      </div>
                      <div className="w-4 h-px bg-slate-200 dark:bg-slate-700" />
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
                        <input type="number" value={filters.maxPrijs} placeholder="Max"
                          onChange={e => { const u = { ...filters, maxPrijs: e.target.value }; setFilters(u); zoek(zoekterm, u); }}
                          className="w-full h-11 pl-7 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-medium outline-none focus:border-primary text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Conditie */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Conditie</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {CONDITIONS.map(cond => (
                        <button key={cond} onClick={() => toggleFilter("conditions", cond)}
                          className={cn("py-3 px-3 rounded-xl text-xs font-bold transition-all border flex items-start justify-between gap-2",
                            filters.conditions.includes(cond)
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700")}>
                          <span className="leading-tight text-left">{cond}</span>
                          {filters.conditions.includes(cond) && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kleur */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Kleur</h3>
                    <div className="grid grid-cols-6 gap-3">
                      {KLEUREN.map(k => (
                        <button key={k.naam} onClick={() => toggleFilter("colors", k.naam)}
                          className="flex flex-col items-center gap-1.5" title={k.naam}>
                          <div className={cn("w-10 h-10 rounded-full transition-all",
                            k.border ? "border-2 border-slate-200" : "",
                            filters.colors.includes(k.naam) ? "ring-2 ring-offset-2 ring-primary scale-110" : "")}
                            style={{ backgroundColor: k.hex }} />
                          <span className="text-[9px] font-bold text-slate-500 text-center leading-none">{k.naam}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Merk */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Merk</h3>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_BRANDS.map(m => (
                        <button key={m} onClick={() => toggleFilter("merken", m)}
                          className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                            filters.merken.includes(m)
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700")}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Materiaal */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Materiaal</h3>
                    <div className="flex flex-wrap gap-2">
                      {MATERIALEN.map(mat => (
                        <button key={mat} onClick={() => toggleFilter("materialen", mat)}
                          className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                            filters.materialen.includes(mat)
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700")}>
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="px-6 py-4 border-t bg-white dark:bg-slate-900 shrink-0">
                <div className="flex gap-3">
                  {totaalActieveFilters > 0 && (
                    <button onClick={() => { setFilters(INIT_FILTERS); zoek(zoekterm, INIT_FILTERS); }}
                      className="flex-1 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 text-sm">
                      Wis filters
                    </button>
                  )}
                  <SheetClose asChild>
                    <Button className="flex-1 h-12 bg-primary text-white font-bold rounded-2xl border-none">
                      {resultaten.length > 0 ? `${resultaten.length} ${resultaten.length === 1 ? "resultaat" : "resultaten"}` : "Zoeken"}
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Sorteer + waarschuwing balk */}
        {heeftGezocht && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setToonSorteer(!toonSorteer)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sorteerLabels[sortering]}
              </button>
              {toonSorteer && (
                <div className="absolute top-9 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 min-w-[210px] overflow-hidden">
                  {(["relevantie","nieuwste","prijs_laag","prijs_hoog"] as SorteerOptie[]).map(s => (
                    <button key={s} onClick={() => veranderSortering(s)}
                      className={cn("w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between",
                        sortering === s ? "text-primary font-bold bg-primary/5" : "text-slate-600 dark:text-slate-300")}>
                      {sorteerLabels[s]}
                      {sortering === s && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1" />
            {zoekterm && (
              <button onClick={toggleZoekwaarschuwing} disabled={waarschuwingBezig}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                  waarschuwingActief ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                {waarschuwingActief ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                {waarschuwingActief ? "Alert uit" : "Alert aan"}
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main className="px-5 pt-5 space-y-6">
        {heeftGezocht ? (
          ladenResultaten ? (
            <div className="flex justify-center py-12">
              <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
            </div>
          ) : resultaten.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-4 text-center">
              <span className="text-5xl">🔍</span>
              <h3 className="font-bold text-slate-700 dark:text-slate-200">Geen resultaten</h3>
              <p className="text-sm text-slate-400">Probeer een andere zoekopdracht of pas je filters aan.</p>
              {zoekterm && (
                <button onClick={toggleZoekwaarschuwing}
                  className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all mt-2",
                    waarschuwingActief ? "bg-primary/10 text-primary border-primary/30" : "border-slate-200 text-slate-600")}>
                  <Bell className="w-4 h-4" />
                  {waarschuwingActief ? "Alert staat aan" : `Waarschuw mij als "${zoekterm}" beschikbaar komt`}
                </button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{resultaten.length} {resultaten.length === 1 ? "resultaat" : "resultaten"}</p>
              <div className="grid grid-cols-2 gap-3">
                {resultaten.map(item => (
                  <Link key={item.id} href={`/product/${item.id}`}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.97] transition-transform">
                      <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                        {item.foto_urls?.[0] ? (
                          <Image src={item.foto_urls[0]} alt={item.titel} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-icons-round text-slate-300 text-4xl">image</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-600">
                          {item.conditie}
                        </span>
                        {item.verkocht === true && (
                          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center">
                            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">Verkocht</span>
                          </div>
                        )}
                        {item.kleur && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: KLEUREN.find(k => k.naam === item.kleur)?.hex || "#ccc" }} />
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="font-bold text-sm text-slate-800 dark:text-white leading-tight line-clamp-2">{item.titel}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-primary">€{item.prijs.toFixed(2).replace(".", ",")}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                            Maat {item.maat}
                          </span>
                        </div>
                        {item.profiles?.stad && <p className="text-[11px] text-slate-400">{item.profiles.stad}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        ) : (
          <>
            {/* Categorie browse */}
            <section className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {activeMainCat ?? "Categorieën"}
                </h3>
                {activeMainCat && (
                  <button onClick={() => setActiveMainCat(null)} className="text-xs font-bold text-primary">
                    ← Alle categorieën
                  </button>
                )}
              </div>

              {!activeMainCat ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
                  {Object.keys(CATEGORY_HIERARCHY).map(cat => (
                    <button key={cat} onClick={() => setActiveMainCat(cat)}
                      className="w-full flex items-center gap-4 px-1 py-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors text-left">
                      <span className="text-2xl w-8 text-center">{CATEGORY_HIERARCHY[cat].icon}</span>
                      <span className="font-semibold text-[16px] text-slate-800 dark:text-white flex-1 leading-tight">{cat}</span>
                      <span className="material-icons-round text-slate-300 text-xl">chevron_right</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
                  {CATEGORY_HIERARCHY[activeMainCat].sub.map(sub => (
                    <button key={sub}
                      onClick={() => { setZoekterm(sub); setActiveMainCat(null); zoek(sub); }}
                      className="w-full flex items-center justify-between px-1 py-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors text-left">
                      <span className="font-medium text-[15px] text-slate-700 dark:text-slate-200">{sub}</span>
                      <span className="material-icons-round text-slate-300 text-xl">chevron_right</span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {!activeMainCat && (
              <section className="space-y-3 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Populaire merken</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_BRANDS.map(brand => (
                    <button key={brand} onClick={() => { setZoekterm(brand); zoek(brand); }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:bg-primary/5 transition-colors">
                      {brand}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Premium lock overlay */}
      {isPremium === false && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-20 px-6"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.97) 60%)" }}>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 py-6 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-black text-white">Zoeken is Premium</h2>
              <p className="text-amber-100 text-sm mt-1">Upgrade voor volledige zoektoegang</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2.5">
                {[
                  { icon: "search", tekst: "Zoeken op naam, merk & categorie" },
                  { icon: "tune", tekst: "Alle filters: maat, kleur, prijs" },
                  { icon: "all_inclusive", tekst: "Onbeperkt swipen in Ontdekken" },
                  { icon: "notifications_active", tekst: "Zoekwaarschuwingen instellen" },
                ].map(v => (
                  <div key={v.icon} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <span className="material-icons-round text-amber-600 text-[15px]">{v.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{v.tekst}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900">€5,00</span>
                <span className="text-xs text-slate-400 font-medium"> / maand</span>
              </div>
              <button
                onClick={activeerPremium}
                disabled={premiumActiveren}
                className="w-full h-13 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-base shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {premiumActiveren ? (
                  <span className="material-icons-round animate-spin text-sm">progress_activity</span>
                ) : (
                  <><Crown className="w-5 h-5" /> Premium activeren</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
