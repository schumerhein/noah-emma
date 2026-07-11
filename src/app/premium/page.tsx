
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, MessageCircle, Crown, Search, BellRing, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Status = { premiumActief: boolean; heeftAbonnement: boolean; verloopdatum: string | null };

export default function PremiumPage() {
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

  useEffect(() => { laadStatus(); }, []);

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

  const verloopdatumTekst = status?.verloopdatum
    ? new Date(status.verloopdatum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="bg-background dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-primary/10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-extrabold tracking-tight">Premium</h1>
        <button className="p-2 -mr-2 text-primary">
          <MessageCircle className="w-5 h-5" />
        </button>
      </nav>

      <main className="px-6 pb-48 pt-20">
        <section className="text-center mb-10 pt-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Crown className="w-10 h-10 text-primary fill-primary" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Vind sneller. Mis niets.</h2>
          {status?.premiumActief && status.heeftAbonnement ? (
            <p className="text-slate-500 dark:text-slate-400 font-bold">
              Actief · wordt automatisch verlengd{verloopdatumTekst ? ` op ${verloopdatumTekst}` : ""}
            </p>
          ) : status?.premiumActief ? (
            <p className="text-slate-500 dark:text-slate-400 font-bold">
              Actief tot {verloopdatumTekst} · niet verlengd
            </p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 font-bold">
              <span className="text-primary">€5 per maand</span> · elke maand automatisch verlengd, altijd direct op te zeggen
            </p>
          )}
        </section>

        <div className="relative w-full h-48 mb-10 rounded-2xl overflow-hidden shadow-xl shadow-primary/10">
          <Image
            alt="Premium kinderkleding"
            fill
            className="object-cover"
            src="https://images.unsplash.com/photo-1560506840-ec148e82a604?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxiYWJ5JTIwY2xvdGhlc3xlbnwwfHx8fDE3NzIyNzcwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <span className="text-white font-extrabold text-xl leading-tight">Mis nooit meer het perfecte setje</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: Sparkles,
              title: "Onbeperkt Swipen",
              desc: "Zonder Premium: 10 swipes per dag. Met Premium: swipe zoveel je wilt, zo vaak je wilt.",
              highlight: true
            },
            {
              icon: Search,
              title: "Volledig Zoeken & Filteren",
              desc: "Zoek direct op merk, maat, kleur en prijs. Zonder Premium is zoeken niet beschikbaar — met Premium vind je het juiste item in seconden."
            },
            {
              icon: BellRing,
              title: "Zoekwaarschuwingen",
              desc: "Sla op waar je naar zoekt en krijg een melding zodra precies dat item in de juiste maat verschijnt."
            }
          ].map((benefit, i) => (
            <div
              key={i}
              className={cn(
                "p-5 rounded-2xl border flex items-start gap-4 transition-all relative overflow-hidden shadow-sm",
                benefit.highlight
                  ? "bg-primary/5 dark:bg-primary/10 border-primary/20"
                  : "bg-white dark:bg-zinc-800/40 border-primary/5"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white">{benefit.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-24 left-0 right-0 px-6 py-4 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 z-40">
        <div className="max-w-md mx-auto">
          {status?.premiumActief && status.heeftAbonnement ? (
            <Button
              onClick={opzeggen}
              disabled={bezig}
              variant="outline"
              className="w-full h-14 text-slate-600 dark:text-slate-300 font-extrabold text-lg rounded-xl disabled:opacity-60"
            >
              {bezig ? "Even geduld…" : "Abonnement opzeggen"}
            </Button>
          ) : (
            <Button
              onClick={upgraden}
              disabled={bezig || status?.premiumActief}
              className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-extrabold text-lg rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform border-none disabled:opacity-60"
            >
              {bezig ? "Even geduld…" : status?.premiumActief ? "Al actief" : "Upgrade Nu"}
            </Button>
          )}
          <button onClick={() => router.back()} className="w-full mt-3 text-slate-400 dark:text-slate-500 text-sm font-bold hover:text-primary transition-colors">
            {status?.premiumActief ? "Terug" : "Misschien later"}
          </button>
        </div>
      </div>
    </div>
  );
}
