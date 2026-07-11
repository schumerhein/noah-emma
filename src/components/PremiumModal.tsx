"use client";

import { useEffect, useState } from "react";
import { X, Crown, Check, Search, BellRing, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Status = { premiumActief: boolean; heeftAbonnement: boolean; verloopdatum: string | null };

const VOORDELEN = [
  { icon: Sparkles, tekst: "Onbeperkt swipen in Ontdekken" },
  { icon: Search, tekst: "Volledig zoeken & filteren (merk, maat, kleur, prijs)" },
  { icon: BellRing, tekst: "Zoekwaarschuwingen instellen" },
];

export function PremiumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [bezig, setBezig] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  const laadStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setStatus(null); return; }
    const res = await fetch("/api/betalen/premium/status", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) setStatus(await res.json());
  };

  useEffect(() => { if (open) laadStatus(); }, [open]);

  const upgraden = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    setBezig(true);
    try {
      const res = await fetch("/api/betalen/premium", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Betaling starten mislukt");
      window.location.href = data.checkoutUrl;
    } catch (err) {
      toast({ variant: "destructive", title: "Er ging iets mis", description: err instanceof Error ? err.message : "Probeer het zo nog eens." });
      setBezig(false);
    }
  };

  const opzeggen = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setBezig(true);
    try {
      const res = await fetch("/api/betalen/premium/opzeggen", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error();
      toast({ title: "Abonnement opgezegd", description: "Je Premium blijft actief tot de huidige periode afloopt." });
      await laadStatus();
    } catch {
      toast({ variant: "destructive", title: "Opzeggen mislukt", description: "Probeer het zo nog eens." });
    } finally {
      setBezig(false);
    }
  };

  if (!open) return null;

  const verloopdatumTekst = status?.verloopdatum
    ? new Date(status.verloopdatum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const actiefMetAbonnement = status?.premiumActief && status.heeftAbonnement;
  const actiefZonderAbonnement = status?.premiumActief && !status.heeftAbonnement;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={
          actiefMetAbonnement || actiefZonderAbonnement
            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 py-8 px-6 text-center"
            : "bg-gradient-to-br from-amber-400 to-amber-600 py-8 px-6 text-center"
        }>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            {actiefMetAbonnement || actiefZonderAbonnement ? (
              <Check className="w-7 h-7 text-white" />
            ) : (
              <Crown className="w-7 h-7 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-black text-white">Premium</h1>
          <p className="text-white/80 text-sm mt-1">
            {actiefMetAbonnement
              ? "Je abonnement is actief"
              : actiefZonderAbonnement
              ? "Actief tot het einde van de periode"
              : "Ontgrendel alles voor €4,99/maand"}
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2.5">
            {VOORDELEN.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <v.icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{v.tekst}</span>
              </div>
            ))}
          </div>

          {actiefMetAbonnement ? (
            <>
              <div className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                Wordt automatisch verlengd{verloopdatumTekst ? ` op ${verloopdatumTekst}` : ""}
              </div>
              <button
                onClick={opzeggen}
                disabled={bezig}
                className="w-full h-13 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-base transition-all disabled:opacity-60"
              >
                {bezig ? "Even geduld…" : "Abonnement opzeggen"}
              </button>
            </>
          ) : actiefZonderAbonnement ? (
            <div className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              Actief tot {verloopdatumTekst} · wordt niet verlengd
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">€4,99</span>
                <span className="text-xs text-slate-400 font-medium"> / maand</span>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Geen kosten per item — onbeperkt gebruik. Maandelijks opzegbaar.</p>
              </div>
              <button
                onClick={upgraden}
                disabled={bezig}
                className="w-full h-13 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-base shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {bezig ? "Even geduld…" : (<><Crown className="w-5 h-5" /> Premium activeren</>)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
