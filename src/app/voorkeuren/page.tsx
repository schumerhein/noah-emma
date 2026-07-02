"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CookieKeuze = "alle" | "essentieel" | null;

export default function VoorkeurenPage() {
  const router = useRouter();
  const [keuze, setKeuze] = useState<CookieKeuze>(null);
  const [opgeslagen, setOpgeslagen] = useState(false);

  const slaOp = (k: CookieKeuze) => {
    setKeuze(k);
    setOpgeslagen(true);
    setTimeout(() => setOpgeslagen(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Mijn voorkeuren</h1>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cookievoorkeuren</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We gebruiken cookies om de app goed te laten werken. Je kunt kiezen welke cookies je toestaat.
          </p>
        </div>

        {opgeslagen && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
            <Check className="w-4 h-4" />
            Voorkeuren opgeslagen
          </div>
        )}

        {/* Altijd aan */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Altijd ingeschakeld</p>
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm text-slate-900 dark:text-white">Essentiële cookies</p>
              <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">Altijd aan</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Noodzakelijk voor het functioneren van de app: inloggen, winkelwagen, veiligheid. Kunnen niet worden uitgeschakeld.
            </p>
          </div>
        </div>

        {/* Optioneel */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Optioneel</p>

          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white">Analytische cookies</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Helpen ons begrijpen hoe de app gebruikt wordt zodat we hem kunnen verbeteren. Gegevens zijn geanonimiseerd.
            </p>
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white">Gepersonaliseerde inhoud</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maken het mogelijk om je een gepersonaliseerde feed en relevante aanbevelingen te tonen.
            </p>
          </div>
        </div>

        {/* Meer info */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Meer informatie? Lees ons{" "}
          <a href="/cookies" className="text-primary font-bold">cookiebeleid</a>.
        </p>
      </main>

      {/* Knoppen */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={() => slaOp("alle")}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all",
            keuze === "alle"
              ? "bg-emerald-500 text-white"
              : "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
          )}
        >
          {keuze === "alle" ? "✓ Alle cookies toegestaan" : "Alle cookies toestaan"}
        </button>
        <button
          onClick={() => slaOp("essentieel")}
          className={cn(
            "w-full h-12 rounded-2xl font-bold text-sm border-2 transition-all",
            keuze === "essentieel"
              ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          )}
        >
          {keuze === "essentieel" ? "✓ Alleen essentiële cookies" : "Alleen essentiële cookies"}
        </button>
      </div>
    </div>
  );
}
