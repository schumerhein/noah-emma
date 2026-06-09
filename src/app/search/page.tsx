
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, SlidersHorizontal, ArrowRight, X, Check, Lock, Sparkles, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const CATEGORY_HIERARCHY: Record<string, { icon: string; sub: string[] }> = {
  "Jongens": {
    icon: "👦",
    sub: ["Jassen", "Truien & Vesten", "T-shirts", "Broeken", "Schoenen", "Ondergoed", "Sportkleding"]
  },
  "Meisjes": {
    icon: "👧",
    sub: ["Jurken & Rokken", "Jassen", "Truien & Vesten", "T-shirts", "Broeken", "Schoenen", "Accessoires"]
  },
  "Babyuitzet": {
    icon: "👶",
    sub: ["Wiegjes & Wiegje", "Ledikantjes", "Commodes", "Babytextiel", "Babyfoons", "Nachtlampjes"]
  },
  "Speelgoed": {
    icon: "🧸",
    sub: ["Houten speelgoed", "Educatief", "LEGO & Constructie", "Knuffels", "Buitenspeelgoed", "Puzzels"]
  },
  "Wandelwagens": {
    icon: "🛒",
    sub: ["Wandelwagens", "Autostoeltjes", "Luiertassen", "Draagzakken", "Accessoires"]
  },
  "Voeding": {
    icon: "🍼",
    sub: ["Flesjes & Spenen", "Borstvoeding", "Kinderservies", "Kinderstoelen", "Flessenwarmers"]
  },
  "Hygiëne": {
    icon: "🧼",
    sub: ["Badjes & Verzorging", "Luiers", "Zindelijkheid", "EHBO-sets"]
  },
  "School": {
    icon: "📚",
    sub: ["Rugzakken", "Etuis & Pennen", "Schriften", "Educatieve boeken", "Agenda's"]
  }
};

const POPULAR_BRANDS = ["ZARA Kids", "H&M", "Petit Bateau", "GAP", "Nike", "Adidas", "Stokke", "Bugaboo"];
const SIZES = ["Newborn", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128"];
const CONDITIONS = ["Nieuw", "Zgan", "Goed", "Gebruikt"];
const COLORS = [
  { name: "Roze", hex: "#FFB7C5" },
  { name: "Blauw", hex: "#AEC6CF" },
  { name: "Groen", hex: "#77DD77" },
  { name: "Geel", hex: "#FDFD96" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Wit", hex: "#FFFFFF" },
  { name: "Zwart", hex: "#000000" },
];

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [activeMainCat, setActiveMainCat] = useState<string | null>(null);
  
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    conditions: [] as string[],
    colors: [] as string[],
  });

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search/results?q=${encodeURIComponent(categoryName)}`);
  };

  const toggleFilter = (type: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[type];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      conditions: [],
      colors: [],
    });
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen relative overflow-hidden">
      <header className="pt-8 pb-2 px-6 flex flex-col gap-4 z-10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeMainCat ? activeMainCat : "Zoeken"}
            </h1>
          </div>
          {activeMainCat && (
            <button 
              onClick={() => setActiveMainCat(null)}
              className="flex items-center gap-1 text-xs font-bold text-primary-dark uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" /> Terug
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden pb-32">
        <div className={cn(
          "px-6 py-2 space-y-8 transition-all duration-500",
          !isPremium && "opacity-40 blur-md pointer-events-none select-none"
        )}>
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-dark transition-colors" />
            <Input 
              placeholder="Zoek op merk, maat of item..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-14 rounded-2xl bg-white dark:bg-slate-800/50 border-none shadow-sm focus:ring-2 focus:ring-primary/30 transition-all text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCategoryClick(searchQuery);
                }
              }}
            />
            
            <Sheet>
              <SheetTrigger asChild>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary/10 rounded-xl text-primary-dark hover:bg-primary/20 transition-colors">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 flex flex-col border-none bg-background">
                <SheetHeader className="p-6 border-b shrink-0">
                  <div className="flex justify-between items-center">
                    <SheetTitle className="text-xl font-extrabold">Filters</SheetTitle>
                    <button onClick={clearFilters} className="text-xs font-bold text-primary-dark uppercase tracking-wider">
                      Wis alles
                    </button>
                  </div>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-6 py-4">
                  <div className="space-y-8 pb-10">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Categorieën</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(CATEGORY_HIERARCHY).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => toggleFilter('categories', cat)}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                              selectedFilters.categories.includes(cat)
                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700"
                            )}
                          >
                            {CATEGORY_HIERARCHY[cat].icon} {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Maten</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {SIZES.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleFilter('sizes', size)}
                            className={cn(
                              "py-2.5 rounded-xl text-xs font-bold transition-all border",
                              selectedFilters.sizes.includes(size)
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Conditie</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {CONDITIONS.map((cond) => (
                          <button
                            key={cond}
                            onClick={() => toggleFilter('conditions', cond)}
                            className={cn(
                              "py-3 rounded-xl text-sm font-bold transition-all border flex items-center justify-between px-4",
                              selectedFilters.conditions.includes(cond)
                                ? "bg-primary/10 text-primary-dark border-primary/30"
                                : "bg-white dark:bg-slate-800 text-slate-600 border-slate-100 dark:border-slate-700"
                            )}
                          >
                            {cond}
                            {selectedFilters.conditions.includes(cond) && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Kleuren</h3>
                      <div className="flex flex-wrap gap-3">
                        {COLORS.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => toggleFilter('colors', color.name)}
                            className={cn(
                              "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative",
                              selectedFilters.colors.includes(color.name)
                                ? "border-primary-dark scale-110 shadow-lg"
                                : "border-slate-100 dark:border-slate-700"
                            )}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {selectedFilters.colors.includes(color.name) && (
                              <Check className={cn(
                                "w-5 h-5",
                                color.hex === "#FFFFFF" ? "text-slate-900" : "text-white drop-shadow-md"
                              )} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-6 border-t bg-white dark:bg-slate-900 pb-10">
                  <SheetClose asChild>
                    <Button 
                      className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 text-lg border-none"
                      onClick={() => handleCategoryClick(searchQuery || 'Gefilterde items')}
                    >
                      Toon resultaten
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {activeMainCat ? `Onderliggend aan ${activeMainCat}` : "Categorieën"}
              </h3>
              {!activeMainCat && (
                <Link href="/categories" className="text-xs font-bold text-primary-dark flex items-center gap-1">
                  Bekijk Alles <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {!activeMainCat ? (
                // Toon hoofdcategorieën
                Object.keys(CATEGORY_HIERARCHY).map((cat) => (
                  <div 
                    key={cat} 
                    onClick={() => setActiveMainCat(cat)}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center gap-3"
                  >
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {CATEGORY_HIERARCHY[cat].icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{cat}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {CATEGORY_HIERARCHY[cat].sub.length} subcategorieën
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Toon subcategorieën van de actieve hoofdcategorie
                CATEGORY_HIERARCHY[activeMainCat].sub.map((sub) => (
                  <div 
                    key={sub} 
                    onClick={() => handleCategoryClick(`${activeMainCat} ${sub}`)}
                    className="p-4 rounded-2xl bg-primary/5 dark:bg-slate-800/60 border border-primary/10 dark:border-slate-700 shadow-sm hover:bg-primary/10 transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{sub}</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))
              )}
            </div>
          </section>

          {!activeMainCat && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Populaire Merken</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_BRANDS.map((brand) => (
                  <Badge 
                    key={brand} 
                    variant="secondary" 
                    onClick={() => handleCategoryClick(brand)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Premium Lock Overlay */}
        {!isPremium && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-12 px-8 text-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-slate-100 dark:border-zinc-700">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
              Ontgrendel Zoeken & Filters met Premium
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              Krijg direct toegang tot al onze categorieën en geavanceerde zoekfilters om de beste koopjes te vinden.
            </p>
            <Button 
              onClick={() => router.push('/premium')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-7 px-6 rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-95 flex flex-col items-center gap-0.5 border-none h-auto"
            >
              <span>Upgrade naar Premium</span>
              <span className="text-[11px] opacity-90 font-bold uppercase tracking-widest">voor €5 p/m</span>
            </Button>
            
            <button 
              onClick={() => setIsPremium(true)}
              className="mt-6 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              Bypass voor testen
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
