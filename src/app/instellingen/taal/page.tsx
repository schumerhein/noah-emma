"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Geen keuze-UI: er is nog geen vertaallaag in de app, dus elke andere taal
// dan Nederlands zou een lege belofte zijn. Zodra er echt meertaligheid komt,
// hoort hier ook opslag (profiel of localStorage) bij.
const TALEN = [
  { code: "nl", naam: "Nederlands", vlag: "🇳🇱", regio: "Nederland", beschikbaar: true },
  { code: "en", naam: "English", vlag: "🇬🇧", regio: "United Kingdom", beschikbaar: false },
  { code: "de", naam: "Deutsch", vlag: "🇩🇪", regio: "Deutschland", beschikbaar: false },
  { code: "fr", naam: "Français", vlag: "🇫🇷", regio: "France", beschikbaar: false },
];

export default function TaalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Taal & regio</h1>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {TALEN.map((taal, idx) => (
            <div
              key={taal.code}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 text-left",
                idx < TALEN.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : "",
                taal.beschikbaar ? "" : "opacity-40"
              )}
            >
              <span className="text-3xl">{taal.vlag}</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-800 dark:text-white">{taal.naam}</p>
                <p className="text-xs text-slate-400">{taal.regio}</p>
              </div>
              <div className="flex items-center gap-2">
                {!taal.beschikbaar && (
                  <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                    Binnenkort
                  </span>
                )}
                {taal.beschikbaar && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Noah & Emma is momenteel alleen beschikbaar in het Nederlands.<br />
          Meer talen volgen wanneer de app internationaal uitbreidt.
        </p>
      </main>
    </div>
  );
}
