"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Persoon = { naam: string | null; avatar_url: string | null } | null;

export type Beoordeling = {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  listing_id: string | null;
  beoordeling: number;
  tekst: string | null;
  created_at: string;
  /** Wie de review gaf (bij ontvangen reviews) */
  reviewer?: Persoon;
  /** Wie je beoordeelde (bij gegeven reviews) */
  reviewed?: Persoon;
  listings: { titel: string | null; user_id: string | null } | null;
};

export const gemiddelde = (lijst: Beoordeling[]) =>
  lijst.length ? lijst.reduce((som, r) => som + r.beoordeling, 0) / lijst.length : 0;

export const cijfer = (n: number) => n.toFixed(1).replace(".", ",");

export function Sterren({ aantal, className }: { aantal: number; className?: string }) {
  return (
    <span className={cn("flex shrink-0", className)} aria-label={`${aantal} van 5 sterren`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= Math.round(aantal) ? "text-amber-400" : "text-slate-200 dark:text-slate-600"}>★</span>
      ))}
    </span>
  );
}

/** Kleine ronde profielfoto, of de eerste letter van de naam. */
export function PersoonAvatar({ persoon, grootte = 36 }: { persoon: Persoon; grootte?: number }) {
  const naam = persoon?.naam || "?";
  return persoon?.avatar_url ? (
    <Image src={persoon.avatar_url} alt={naam} width={grootte} height={grootte} className="rounded-full object-cover shrink-0" style={{ width: grootte, height: grootte }} />
  ) : (
    <div className="rounded-full bg-primary/10 flex items-center justify-center font-black text-primary shrink-0" style={{ width: grootte, height: grootte, fontSize: grootte * 0.4 }}>
      {naam.charAt(0).toUpperCase()}
    </div>
  );
}

// Alle beoordelingen op je eigen profiel: wat anderen over jou zeiden
// (met wie, waarvoor en als koper of verkoper) en wat jij anderen gaf.
export function BeoordelingenOverzicht({ ontvangen, gegeven, eigenId }: { ontvangen: Beoordeling[]; gegeven: Beoordeling[]; eigenId: string }) {
  const [weergave, setWeergave] = useState<"ontvangen" | "gegeven">("ontvangen");
  const lijst = weergave === "ontvangen" ? ontvangen : gegeven;
  const gem = gemiddelde(ontvangen);

  return (
    <div className="space-y-3">
      {/* Samenvatting: gemiddelde en verdeling over de sterren */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 flex items-center gap-5">
        <div className="text-center shrink-0">
          <p className="text-4xl font-black text-amber-600">{ontvangen.length ? cijfer(gem) : "—"}</p>
          <Sterren aantal={gem} className="justify-center mt-1" />
          <p className="text-[11px] font-semibold text-amber-700/80 dark:text-amber-300/80 mt-1">
            {ontvangen.length} {ontvangen.length === 1 ? "beoordeling" : "beoordelingen"}
          </p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map(s => {
            const aantal = ontvangen.filter(r => r.beoordeling === s).length;
            return (
              <div key={s} className="flex items-center gap-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                <span className="w-3 text-right">{s}</span>
                <div className="flex-1 h-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${ontvangen.length ? (aantal / ontvangen.length) * 100 : 0}%` }} />
                </div>
                <span className="w-5 text-amber-700/70 dark:text-amber-300/70">{aantal}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ontvangen / gegeven */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {(["ontvangen", "gegeven"] as const).map(w => (
          <button key={w} onClick={() => setWeergave(w)}
            className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all",
              weergave === w ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400")}>
            {w === "ontvangen" ? `Over mij (${ontvangen.length})` : `Door mij gegeven (${gegeven.length})`}
          </button>
        ))}
      </div>

      {lijst.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 text-amber-200" />
          </div>
          <p className="font-bold text-slate-600 dark:text-slate-300">
            {weergave === "ontvangen" ? "Nog geen beoordelingen" : "Je gaf nog geen beoordelingen"}
          </p>
          <p className="text-sm text-slate-400">
            Na een afgeronde deal kunnen koper en verkoper<br />elkaar een beoordeling geven.
          </p>
        </div>
      ) : (
        lijst.map(review => {
          const anderId = weergave === "ontvangen" ? review.reviewer_id : review.reviewed_id;
          const ander = weergave === "ontvangen" ? review.reviewer : review.reviewed;
          // Was het mijn advertentie, dan was de ander de koper.
          const rol = review.listings?.user_id ? (review.listings.user_id === eigenId ? "Koper" : "Verkoper") : null;
          return (
            <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/seller/${anderId}`} className="flex items-center gap-3 min-w-0">
                  <PersoonAvatar persoon={ander ?? null} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                      {weergave === "gegeven" && <span className="font-semibold text-slate-400">Aan </span>}
                      {ander?.naam || "Verwijderde gebruiker"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {rol && <span className="font-semibold">{rol}</span>}
                      {rol && review.listings?.titel && " · "}
                      {review.listings?.titel}
                    </p>
                  </div>
                </Link>
                <Sterren aantal={review.beoordeling} className="text-sm" />
              </div>
              {review.tekst && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-12">&ldquo;{review.tekst}&rdquo;</p>
              )}
              <p className="text-[10px] text-slate-400 pl-12">
                {new Date(review.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
