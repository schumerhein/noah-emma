"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { X, Zap, Star, Rocket, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const tiers = [
  { id: "fast", name: "Snel", title: "3 Dagen Boost", price: "€2,99", desc: "Voor een korte, snelle boost in de swipe-flow.", icon: Zap },
  { id: "popular", name: "Populair", title: "7 Dagen Boost", price: "€4,99", desc: "Een volle week vaker bovenaan — de meest gekozen duur.", icon: Star, badge: "Aanbevolen" },
  { id: "max", name: "Maximaal", title: "14 Dagen Boost", price: "€8,99", desc: "Twee weken maximale zichtbaarheid voor je beste items.", icon: Rocket },
];

type Listing = { id: string; titel: string; foto_urls: string[]; gepromoot: boolean };

export default function PromotePage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState("popular");
  const [listing, setListing] = useState<Listing | null>(null);
  const [laden, setLaden] = useState(true);
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("id, titel, foto_urls, gepromoot")
        .eq("id", listingId)
        .single();
      setListing(data);
      setLaden(false);
    })();
  }, [listingId]);

  const betalen = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    setBezig(true);
    try {
      const res = await fetch("/api/betalen/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ listingId, tier: selectedTier }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Betaling starten mislukt");
      window.location.href = data.checkoutUrl;
    } catch {
      toast({ variant: "destructive", title: "Er ging iets mis", description: "Probeer het zo nog eens." });
      setBezig(false);
    }
  };

  if (laden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-3">
        <p className="text-slate-500">Advertentie niet gevonden.</p>
        <Button onClick={() => router.back()} variant="outline">Terug</Button>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-4 flex items-center justify-between border-b border-primary/10">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100">
          <X className="w-5 h-5 text-slate-400" />
        </button>
        <h1 className="text-lg font-bold">Boost je Product</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-6 pb-48">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-primary/5 shadow-sm">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-slate-100">
            {listing.foto_urls?.[0] && (
              <Image fill alt={listing.titel} className="object-cover" src={listing.foto_urls[0]} />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Uw advertentie</p>
            <h3 className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{listing.titel}</h3>
            <p className="text-xs text-slate-500">
              Huidige status: {listing.gepromoot ? "Al geboost" : "Geen boost"}
            </p>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Verkoop sneller</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Kies een pakket en verschijn vaker in het swipe-algoritme.</p>
        </div>

        <div className="space-y-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={cn(
                "relative p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between cursor-pointer shadow-sm",
                selectedTier === tier.id
                  ? "border-primary bg-white dark:bg-slate-800 ring-4 ring-primary/10"
                  : "border-white dark:border-slate-800 bg-white dark:bg-slate-800"
              )}
            >
              {tier.badge && (
                <div className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                  {tier.badge}
                </div>
              )}
              <div className="flex gap-4 items-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  selectedTier === tier.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <tier.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase">{tier.name}</p>
                  <h4 className="text-lg font-bold">{tier.title}</h4>
                  <p className="text-xs text-slate-500">{tier.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900 dark:text-white">{tier.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-xl p-4 flex gap-3 items-start border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary/80 leading-relaxed font-medium">
            Je product verschijnt vaker in de &apos;Ontdek&apos; swipe-flow en bovenaan de zoekresultaten voor de geselecteerde periode.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-4 pt-4 pb-8 z-50">
        <Button
          onClick={betalen}
          disabled={bezig}
          className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-7 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] border-none text-lg disabled:opacity-60"
        >
          {bezig ? "Even geduld…" : (<>Betaal Nu <span className="opacity-60">•</span> {tiers.find(t => t.id === selectedTier)?.price}</>)}
        </Button>
      </div>
    </div>
  );
}
