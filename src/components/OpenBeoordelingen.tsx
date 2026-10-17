"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

type OpenBeoordeling = {
  conversationId: string;
  listingId: string;
  titel: string;
  foto: string | null;
  anderId: string;
  anderNaam: string;
};

// Afgeronde deals waarvoor jij de ander nog niet beoordeelde.
async function haalOpenBeoordelingen(): Promise<OpenBeoordeling[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];

  const { data: deals } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id, listing_id, afgerond_at, listing:listing_id(titel, foto_urls)")
    .eq("afgerond", true)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("afgerond_at", { ascending: false })
    .limit(20);
  const metProduct = (deals || []).filter(d => d.listing_id);
  if (metProduct.length === 0) return [];

  const { data: gegeven } = await supabase
    .from("reviews")
    .select("listing_id")
    .eq("reviewer_id", user.id)
    .in("listing_id", metProduct.map(d => d.listing_id as string));
  const alBeoordeeld = new Set((gegeven || []).map(r => r.listing_id));

  const open = metProduct.filter(d => !alBeoordeeld.has(d.listing_id));
  if (open.length === 0) return [];

  const anderIds = open.map(d => (d.buyer_id === user.id ? d.seller_id : d.buyer_id));
  const { data: profielen } = await supabase.from("profiles").select("id, naam").in("id", anderIds);
  const naamPerId = new Map((profielen || []).map(p => [p.id, p.naam as string | null]));

  return open.map(d => {
    const listing = d.listing as unknown as { titel: string; foto_urls: string[] | null } | null;
    const anderId = d.buyer_id === user.id ? d.seller_id : d.buyer_id;
    return {
      conversationId: d.id,
      listingId: d.listing_id as string,
      titel: listing?.titel ?? "Product",
      foto: listing?.foto_urls?.[0] ?? null,
      anderId,
      anderNaam: naamPerId.get(anderId) || "je koper of verkoper",
    };
  });
}

const reviewHref = (o: OpenBeoordeling) =>
  `/reviews/schrijf?user=${o.anderId}&listing=${o.listingId}&conv=${o.conversationId}`;

/**
 * "Nog te beoordelen" — herinnert je overal in de app aan reviews die je nog
 * kunt geven. `compact` = één regel voor het beginscherm.
 */
export function OpenBeoordelingen({ compact = false, className }: { compact?: boolean; className?: string }) {
  const [open, setOpen] = useState<OpenBeoordeling[]>([]);

  useEffect(() => {
    haalOpenBeoordelingen().then(setOpen).catch(() => setOpen([]));
  }, []);

  if (open.length === 0) return null;

  if (compact) {
    const eerste = open[0];
    return (
      <Link
        href={reviewHref(eerste)}
        className={`flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 px-4 py-3 ${className ?? ""}`}
      >
        <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
        <p className="flex-1 min-w-0 text-sm font-bold text-amber-900 dark:text-amber-200 truncate">
          {open.length === 1
            ? `Beoordeel ${eerste.anderNaam} voor "${eerste.titel}"`
            : `Je hebt nog ${open.length} beoordelingen te geven`}
        </p>
        <span className="text-xs font-black text-amber-600 shrink-0">Nu →</span>
      </Link>
    );
  }

  return (
    <div className={`rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-4 space-y-3 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <h3 className="font-extrabold text-amber-900 dark:text-amber-200">
          Nog te beoordelen ({open.length})
        </h3>
      </div>
      <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
        Jouw beoordeling helpt andere ouders om veilig te kopen en verkopen.
      </p>
      <div className="space-y-2">
        {open.slice(0, 5).map(o => (
          <Link
            key={o.conversationId}
            href={reviewHref(o)}
            className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 p-2 pr-3 active:scale-[0.99] transition-transform"
          >
            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
              {o.foto ? (
                <Image src={o.foto} alt={o.titel} fill sizes="44px" className="object-cover" />
              ) : (
                <span className="material-icons-round text-slate-300 absolute inset-0 flex items-center justify-center">image</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{o.titel}</p>
              <p className="text-xs text-slate-400 truncate">met {o.anderNaam}</p>
            </div>
            <span className="text-xs font-black text-amber-600 shrink-0">Beoordeel</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
