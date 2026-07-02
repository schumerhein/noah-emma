"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function EmailInstellingenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [huidigEmail, setHuidigEmail] = useState("");
  const [nieuwEmail, setNieuwEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [toonWachtwoord, setToonWachtwoord] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setHuidigEmail(user.email || "");
      setLaden(false);
    })();
  }, []);

  const wijzigEmail = async () => {
    if (!nieuwEmail || !wachtwoord) return;
    if (nieuwEmail === huidigEmail) {
      toast({ variant: "destructive", title: "Dat is al je huidige e-mailadres" });
      return;
    }
    setBezig(true);

    // Eerst opnieuw inloggen om sessie te verifiëren
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: huidigEmail,
      password: wachtwoord,
    });

    if (signInError) {
      toast({ variant: "destructive", title: "Onjuist wachtwoord", description: "Controleer je wachtwoord en probeer opnieuw." });
      setBezig(false);
      return;
    }

    // E-mail bijwerken
    const { error } = await supabase.auth.updateUser({ email: nieuwEmail });

    if (error) {
      toast({ variant: "destructive", title: "Mislukt", description: error.message });
    } else {
      toast({
        title: "Bevestigingsmail verstuurd",
        description: `Controleer ${nieuwEmail} en klik op de link om het nieuwe e-mailadres te bevestigen.`,
      });
      setNieuwEmail("");
      setWachtwoord("");
    }
    setBezig(false);
  };

  const emailGeldig = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nieuwEmail);
  const kanOpslaan = emailGeldig && wachtwoord.length >= 6 && nieuwEmail !== huidigEmail;

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">E-mailadres wijzigen</h1>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-6 max-w-lg mx-auto">
        {/* Huidig e-mail */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <Mail className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Huidig e-mailadres</p>
            <p className="font-bold text-sm text-slate-800 dark:text-white">{huidigEmail}</p>
          </div>
        </div>

        {/* Nieuw e-mail */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nieuw e-mailadres</label>
          <div className="relative">
            <input
              type="email"
              value={nieuwEmail}
              onChange={e => setNieuwEmail(e.target.value)}
              placeholder="nieuw@voorbeeld.nl"
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors pr-10"
            />
            {emailGeldig && nieuwEmail !== huidigEmail && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Wachtwoord bevestigen */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Huidig wachtwoord ter bevestiging</label>
          <div className="relative">
            <input
              type={toonWachtwoord ? "text" : "password"}
              value={wachtwoord}
              onChange={e => setWachtwoord(e.target.value)}
              placeholder="Jouw wachtwoord"
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setToonWachtwoord(!toonWachtwoord)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {toonWachtwoord ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            Na het wijzigen ontvang je een bevestigingsmail op het nieuwe adres. Je moet op de link klikken voordat de wijziging actief wordt.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={wijzigEmail}
          disabled={bezig || !kanOpslaan}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
            kanOpslaan ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          )}
        >
          {bezig ? <span className="material-icons-round animate-spin">progress_activity</span> : "E-mailadres wijzigen"}
        </button>
      </div>
    </div>
  );
}
