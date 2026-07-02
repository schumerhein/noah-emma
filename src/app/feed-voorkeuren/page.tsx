"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIEEN = [
  { id: "tops", label: "Tops & T-shirts", emoji: "👕" },
  { id: "broeken", label: "Broeken & Shorts", emoji: "👖" },
  { id: "jurken", label: "Jurken & Rokken", emoji: "👗" },
  { id: "jassen", label: "Jassen & Vesten", emoji: "🧥" },
  { id: "schoenen", label: "Schoenen & Laarzen", emoji: "👟" },
  { id: "accessoires", label: "Accessoires", emoji: "🧢" },
  { id: "pyama", label: "Pyjama & Ondergoed", emoji: "🌙" },
  { id: "kinderwagens", label: "Kinderwagens & Buggy's", emoji: "🛒" },
  { id: "sportkleding", label: "Sportkleding", emoji: "⚽" },
  { id: "feest", label: "Feest & Gala", emoji: "🎀" },
];

const MATEN = [
  "50/56", "62/68", "74/80", "86/92", "98/104",
  "110/116", "122/128", "134/140", "146/152", "158/164",
];

const MERKEN = [
  "H&M", "Zara Kids", "Next", "Hema", "Name It",
  "Molo", "Petit Bateau", "Noppies", "Prenatal", "Boden",
  "Tommy Hilfiger Kids", "Nike Kids", "Adidas Kids", "Scotch & Soda",
];

type Tab = "categorien" | "maten" | "merken";

export default function FeedVoorkeurenPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("categorien");
  const [catSel, setCatSel] = useState<string[]>([]);
  const [maatSel, setMaatSel] = useState<string[]>([]);
  const [merkSel, setMerkSel] = useState<string[]>([]);
  const [opgeslagen, setOpgeslagen] = useState(false);

  const toggle = (id: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  const slaOp = () => {
    setOpgeslagen(true);
    setTimeout(() => { setOpgeslagen(false); router.back(); }, 1200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <header className="px-5 pt-14 pb-0 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 pb-4">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex-1">Personaliseer je feed</h1>
          {opgeslagen && <Check className="w-5 h-5 text-emerald-500" />}
        </div>

        {/* Tabs */}
        <div className="flex">
          {(["categorien", "maten", "merken"] as Tab[]).map(t => {
            const labels: Record<Tab, string> = { categorien: "Categorieën", maten: "Maten", merken: "Merken" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-3 text-sm font-bold border-b-2 transition-colors",
                  tab === t
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400"
                )}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-32 overflow-y-auto">
        {tab === "categorien" && (
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIEEN.map(cat => {
              const sel = catSel.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggle(cat.id, catSel, setCatSel)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                    sel ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className={cn("text-sm font-semibold leading-tight", sel ? "text-primary" : "text-slate-700 dark:text-slate-200")}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {tab === "maten" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Selecteer de maten die je zoekt. Je feed toont dan vaker artikelen in deze maten.</p>
            <div className="grid grid-cols-3 gap-2">
              {MATEN.map(maat => {
                const sel = maatSel.includes(maat);
                return (
                  <button
                    key={maat}
                    onClick={() => toggle(maat, maatSel, setMaatSel)}
                    className={cn(
                      "py-3 rounded-xl border-2 text-sm font-bold transition-all",
                      sel ? "border-primary bg-primary text-white" : "border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {maat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "merken" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Volg merken om hun artikelen eerder te zien in je feed.</p>
            <div className="space-y-1">
              {MERKEN.map(merk => {
                const sel = merkSel.includes(merk);
                return (
                  <button
                    key={merk}
                    onClick={() => toggle(merk, merkSel, setMerkSel)}
                    className="w-full flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800 transition-colors text-left"
                  >
                    <span className={cn("text-[16px]", sel ? "font-bold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                      {merk}
                    </span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      sel ? "border-primary bg-primary" : "border-slate-200 dark:border-slate-600"
                    )}>
                      {sel && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={slaOp}
          className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Voorkeuren opslaan
        </button>
      </div>
    </div>
  );
}
