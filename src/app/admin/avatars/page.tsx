"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Baby, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoahEmmaFullBody, MAATLIJST_AVATAR, leeftijdBijMaat } from "@/components/ai-models/NoahEmmaFullBody";

/**
 * Previewpagina voor de meegroeiende Noah & Emma avatars.
 * Schuif door de maten en zie de verhoudingen veranderen —
 * dezelfde groeilogica als de kindprofielen.
 */
export default function AvatarPreviewPage() {
  const router = useRouter();
  const [maatIdx, setMaatIdx] = useState(4); // start bij maat 74

  const maat = MAATLIJST_AVATAR[maatIdx];
  const leeftijd = leeftijdBijMaat(maat);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5f7] via-white to-[#f0f6ff] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 font-display pb-16">
      <header className="pt-14 pb-4 px-6 flex items-center gap-4 sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Noah &amp; Emma</h1>
          <p className="text-xs text-slate-400">De meegroeiende modellen van het platform</p>
        </div>
      </header>

      <main className="px-5 pt-6 max-w-md mx-auto space-y-6">
        {/* Leeftijd + maat indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
            <Baby className="w-4 h-4 text-primary" />
            <span className="text-sm font-black text-slate-800 dark:text-white">{leeftijd}</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
            <Ruler className="w-4 h-4 text-primary" />
            <span className="text-sm font-black text-slate-800 dark:text-white">Maat {maat}</span>
          </div>
        </div>

        {/* De avatars */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl px-4 pt-8 pb-6">
          <div className="flex items-end justify-center gap-2 min-h-[360px]">
            <div className="flex flex-col items-center">
              <NoahEmmaFullBody naam="noah" maat={maat} height={Number(320)} />
              <p className="mt-2 font-black text-slate-800 dark:text-white">Noah</p>
            </div>
            <div className="flex flex-col items-center">
              <NoahEmmaFullBody naam="emma" maat={maat} height={Number(320)} />
              <p className="mt-2 font-black text-slate-800 dark:text-white">Emma</p>
            </div>
          </div>
        </div>

        {/* Maat-schuif */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Groei-simulatie</p>
            <span className="text-xs font-bold text-primary">{maatIdx + 1}/{MAATLIJST_AVATAR.length}</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAATLIJST_AVATAR.length - 1}
            step={1}
            value={maatIdx}
            onChange={e => setMaatIdx(Number(e.target.value))}
            className="w-full accent-[#ffb8c4] h-2"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>50 · pasgeboren</span>
            <span>104 · peuter</span>
            <span>158/164 · 12+</span>
          </div>

          {/* Snelkeuze */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {MAATLIJST_AVATAR.map((m, i) => (
              <button
                key={m}
                onClick={() => setMaatIdx(i)}
                className={cn(
                  "py-1.5 rounded-lg text-[10px] font-bold transition-all",
                  i === maatIdx
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 leading-relaxed px-4">
          Dit zijn de verhoudingen die de app gebruikt zodra een kledingstuk
          &ldquo;op Noah of Emma&rdquo; getoond wordt — altijd in de maat van het artikel.
        </p>
      </main>
    </div>
  );
}
