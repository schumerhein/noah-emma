"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Phone, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TelefoonPage() {
  const router = useRouter();
  const [nummer, setNummer] = useState("");
  const [stap, setStap] = useState<"invoer" | "verificatie">("invoer");
  const [code, setCode] = useState("");

  const formatNummer = (val: string) => {
    const alleen = val.replace(/\D/g, "");
    return alleen;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Telefoonnummer</h1>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-6 max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-4 text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Telefoonnummer toevoegen</h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Een telefoonnummer verhoogt het vertrouwen bij andere gebruikers en is handig voor ophaalafspraken.
            </p>
          </div>
        </div>

        {stap === "invoer" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobiel nummer</label>
              <div className="flex gap-3">
                <div className="flex items-center px-4 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 text-sm shrink-0">
                  🇳🇱 +31
                </div>
                <input
                  type="tel"
                  value={nummer}
                  onChange={e => setNummer(formatNummer(e.target.value))}
                  placeholder="06 12345678"
                  maxLength={10}
                  className="flex-1 h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex gap-3">
              <Shield className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Je telefoonnummer is nooit zichtbaar voor andere gebruikers tenzij je het zelf deelt in een gesprek. We gebruiken het enkel voor accountbeveiliging.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              We stuurden een code naar +31 {nummer}
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verificatiecode</label>
              <input
                type="number"
                value={code}
                onChange={e => setCode(e.target.value.slice(0, 6))}
                placeholder="123456"
                className="w-full h-14 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-2xl text-center outline-none focus:border-primary transition-colors tracking-widest"
              />
            </div>
            <button onClick={() => setStap("invoer")} className="text-xs font-bold text-primary text-center w-full">
              Ander nummer gebruiken
            </button>
          </div>
        )}

        {/* Beschikbaar label */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-bold">📱 Binnenkort beschikbaar</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
            SMS-verificatie wordt geactiveerd zodra de app live gaat in de App Store.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => stap === "invoer" ? setStap("verificatie") : undefined}
          disabled={nummer.length < 9}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all",
            nummer.length >= 9 ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          )}
        >
          {stap === "invoer" ? "Code versturen" : "Bevestigen"}
        </button>
      </div>
    </div>
  );
}
