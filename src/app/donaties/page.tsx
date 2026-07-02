"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const GOEDE_DOELEN = [
  { id: "unicef", naam: "UNICEF Nederland", beschrijving: "Voor kinderen wereldwijd", emoji: "🌍" },
  { id: "cliniclowns", naam: "Cliniclowns", beschrijving: "Lachen voor zieke kinderen", emoji: "🤡" },
  { id: "voedselbank", naam: "Voedselbank Nederland", beschrijving: "Gezond eten voor elk kind", emoji: "🥗" },
  { id: "kinderpostzegels", naam: "Kinderpostzegels", beschrijving: "Kansen voor kwetsbare kinderen", emoji: "✉️" },
];

const PERCENTAGES = [1, 2, 5, 10];

export default function DonatiePage() {
  const router = useRouter();
  const [geselecteerdDoel, setGeselecteerdDoel] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [actief, setActief] = useState(false);
  const [opgeslagen, setOpgeslagen] = useState(false);

  const slaOp = () => {
    if (!geselecteerdDoel || !percentage) return;
    setActief(true);
    setOpgeslagen(true);
    setTimeout(() => setOpgeslagen(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Donaties</h1>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-8 max-w-lg mx-auto">
        {/* Intro */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Doorlopende donaties</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Doneer automatisch een percentage van elke verkoop aan een goed doel naar keuze. Kleine beetjes maken een groot verschil voor kinderen.
          </p>
        </div>

        {/* Status */}
        {actief && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Donaties actief</p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
                {percentage}% van elke verkoop gaat naar {GOEDE_DOELEN.find(d => d.id === geselecteerdDoel)?.naam}
              </p>
            </div>
          </div>
        )}

        {/* Kies goed doel */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Kies een goed doel</h3>
          <div className="space-y-2">
            {GOEDE_DOELEN.map(doel => (
              <button
                key={doel.id}
                onClick={() => setGeselecteerdDoel(doel.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                  geselecteerdDoel === doel.id
                    ? "border-primary bg-primary/5"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800"
                )}
              >
                <span className="text-3xl">{doel.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{doel.naam}</p>
                  <p className="text-xs text-slate-400">{doel.beschrijving}</p>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  geselecteerdDoel === doel.id ? "border-primary bg-primary" : "border-slate-200 dark:border-slate-600"
                )}>
                  {geselecteerdDoel === doel.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Kies percentage */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Percentage per verkoop</h3>
          <div className="grid grid-cols-4 gap-2">
            {PERCENTAGES.map(p => (
              <button
                key={p}
                onClick={() => setPercentage(p)}
                className={cn(
                  "py-3 rounded-xl font-bold text-sm border-2 transition-all",
                  percentage === p
                    ? "border-primary bg-primary text-white"
                    : "border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                )}
              >
                {p}%
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Bij een verkoop van €10 doneer je {percentage ? `€${(10 * (percentage / 100)).toFixed(2).replace(".", ",")}` : "€0,00"}.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        {actief ? (
          <button
            onClick={() => { setActief(false); setGeselecteerdDoel(null); setPercentage(null); }}
            className="w-full h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
          >
            Donaties uitschakelen
          </button>
        ) : (
          <button
            onClick={slaOp}
            disabled={!geselecteerdDoel || !percentage}
            className={cn(
              "w-full h-14 rounded-2xl font-bold text-base transition-all",
              geselecteerdDoel && percentage
                ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            )}
          >
            Doorlopende donaties instellen
          </button>
        )}
      </div>
    </div>
  );
}
