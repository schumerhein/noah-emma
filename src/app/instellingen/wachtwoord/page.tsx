"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Eis = { label: string; ok: boolean };

export default function WachtwoordInstellingenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [huidig, setHuidig] = useState("");
  const [nieuw, setNieuw] = useState("");
  const [bevestig, setBevestig] = useState("");
  const [toonHuidig, setToonHuidig] = useState(false);
  const [toonNieuw, setToonNieuw] = useState(false);
  const [toonBevestig, setToonBevestig] = useState(false);
  const [bezig, setBezig] = useState(false);

  const eisen: Eis[] = [
    { label: "Minimaal 8 tekens", ok: nieuw.length >= 8 },
    { label: "Minimaal 1 hoofdletter", ok: /[A-Z]/.test(nieuw) },
    { label: "Minimaal 1 cijfer", ok: /[0-9]/.test(nieuw) },
    { label: "Wachtwoorden komen overeen", ok: nieuw === bevestig && nieuw.length > 0 },
  ];

  const kanOpslaan = huidig.length >= 6 && eisen.every(e => e.ok);

  const wijzigWachtwoord = async () => {
    if (!kanOpslaan) return;
    setBezig(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { router.push("/login"); return; }

    // Verifieer huidig wachtwoord
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: huidig,
    });

    if (signInError) {
      toast({ variant: "destructive", title: "Huidig wachtwoord klopt niet" });
      setBezig(false);
      return;
    }

    // Wachtwoord bijwerken
    const { error } = await supabase.auth.updateUser({ password: nieuw });

    if (error) {
      toast({ variant: "destructive", title: "Mislukt", description: error.message });
    } else {
      toast({ title: "Wachtwoord gewijzigd ✓", description: "Je nieuwe wachtwoord is actief." });
      setHuidig(""); setNieuw(""); setBevestig("");
      router.back();
    }
    setBezig(false);
  };

  const sterkte = eisen.filter(e => e.ok).length;
  const sterkteKleur = sterkte <= 1 ? "bg-red-400" : sterkte <= 2 ? "bg-amber-400" : sterkte <= 3 ? "bg-blue-400" : "bg-emerald-500";
  const sterkteLabel = sterkte <= 1 ? "Zwak" : sterkte <= 2 ? "Matig" : sterkte <= 3 ? "Goed" : "Sterk";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Wachtwoord wijzigen</h1>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-6 max-w-lg mx-auto">

        {/* Huidig wachtwoord */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Huidig wachtwoord</label>
          <div className="relative">
            <input
              type={toonHuidig ? "text" : "password"}
              value={huidig}
              onChange={e => setHuidig(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors pr-12"
            />
            <button type="button" onClick={() => setToonHuidig(!toonHuidig)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {toonHuidig ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Nieuw wachtwoord */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nieuw wachtwoord</label>
          <div className="relative">
            <input
              type={toonNieuw ? "text" : "password"}
              value={nieuw}
              onChange={e => setNieuw(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors pr-12"
            />
            <button type="button" onClick={() => setToonNieuw(!toonNieuw)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {toonNieuw ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* Sterkte indicator */}
          {nieuw.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= sterkte ? sterkteKleur : "bg-slate-100 dark:bg-slate-700")} />
                ))}
              </div>
              <p className={cn("text-xs font-bold", sterkte <= 1 ? "text-red-400" : sterkte <= 2 ? "text-amber-400" : sterkte <= 3 ? "text-blue-400" : "text-emerald-500")}>
                {sterkteLabel}
              </p>
            </div>
          )}
        </div>

        {/* Bevestig wachtwoord */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nieuw wachtwoord bevestigen</label>
          <div className="relative">
            <input
              type={toonBevestig ? "text" : "password"}
              value={bevestig}
              onChange={e => setBevestig(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors pr-12"
            />
            <button type="button" onClick={() => setToonBevestig(!toonBevestig)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {toonBevestig ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Eisen lijst */}
        {nieuw.length > 0 && (
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vereisten</p>
            {eisen.map(eis => (
              <div key={eis.label} className="flex items-center gap-2.5">
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", eis.ok ? "bg-emerald-100" : "bg-slate-200 dark:bg-slate-700")}>
                  {eis.ok ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                </div>
                <p className={cn("text-xs font-medium", eis.ok ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400")}>{eis.label}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={wijzigWachtwoord}
          disabled={bezig || !kanOpslaan}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
            kanOpslaan ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          )}
        >
          {bezig ? <span className="material-icons-round animate-spin">progress_activity</span> : "Wachtwoord wijzigen"}
        </button>
      </div>
    </div>
  );
}
