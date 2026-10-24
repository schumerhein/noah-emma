"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Scissors, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { alsBestand, analyseerKleding, knipUit, standaardDeel, type KledingAnalyse, type Kledingdeel } from "@/lib/kledingUitknippen";
import { telGezichten } from "@/lib/kledingDetectie";

interface KledingUitknipperProps {
  /** De originele foto (blijft op het toestel). */
  bron: string;
  /** Gekozen subcategorie, om boven/onder/alles voor te selecteren. */
  subcategorie: string;
  onGebruik: (resultaat: { file: File; dataUrl: string }) => void;
  onAnnuleer: () => void;
}

const DELEN: { deel: Kledingdeel; label: string }[] = [
  { deel: "boven", label: "Bovenkant" },
  { deel: "onder", label: "Onderkant" },
  { deel: "geheel", label: "Alles" },
];

/**
 * Venster dat verschijnt als er een kind op de verkoopfoto staat: knipt het
 * kledingstuk uit (op het toestel) en laat de verkoper het resultaat zien
 * voordat het de advertentie in gaat. Alleen de uitsnede wordt geüpload.
 */
export function KledingUitknipper({ bron, subcategorie, onGebruik, onAnnuleer }: KledingUitknipperProps) {
  const [analyse, setAnalyse] = useState<KledingAnalyse | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [deel, setDeel] = useState<Kledingdeel>("geheel");
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    let geannuleerd = false;
    analyseerKleding(bron)
      .then((a) => {
        if (geannuleerd) return;
        setAnalyse(a);
      })
      .catch(() => {
        if (!geannuleerd) setFout("We konden geen kledingstuk vinden op deze foto. Probeer een foto waarop het kledingstuk goed zichtbaar is, of leg het plat neer.");
      });
    return () => { geannuleerd = true; };
  }, [bron]);

  // Alle drie de varianten vooraf uitknippen, zodat wisselen direct gaat.
  const varianten = useMemo(() => {
    if (!analyse) return null;
    const uit = {} as Record<Kledingdeel, HTMLCanvasElement | null>;
    for (const { deel: d } of DELEN) uit[d] = knipUit(analyse, d);
    return uit;
  }, [analyse]);

  const voorbeelden = useMemo(() => {
    if (!varianten) return null;
    const uit = {} as Record<Kledingdeel, string | null>;
    for (const { deel: d } of DELEN) uit[d] = varianten[d]?.toDataURL("image/jpeg", 0.8) ?? null;
    return uit;
  }, [varianten]);

  // Startkeuze: uit de categorie, anders wat er beschikbaar is.
  useEffect(() => {
    if (!varianten || !analyse) return;
    const voorkeur = standaardDeel(subcategorie, analyse);
    const beschikbaar = DELEN.map((d) => d.deel).filter((d) => varianten[d]);
    if (beschikbaar.length === 0) {
      setFout("We konden geen kledingstuk vinden op deze foto. Probeer een foto waarop het kledingstuk goed zichtbaar is, of leg het plat neer.");
      return;
    }
    setDeel(beschikbaar.includes(voorkeur) ? voorkeur : beschikbaar[beschikbaar.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [varianten]);

  const gebruik = async () => {
    const canvas = varianten?.[deel];
    if (!canvas) return;
    setBezig(true);
    try {
      const resultaat = await alsBestand(canvas);
      // Vangnet: op de uitsnede mag geen gezicht meer staan.
      const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = resultaat.dataUrl; });
      if ((await telGezichten(img)) > 0) {
        setFout("Op de uitsnede is nog een gezicht te zien. Kies een andere foto, of leg het kledingstuk plat neer.");
        setBezig(false);
        return;
      }
      onGebruik(resultaat);
    } catch {
      setFout("We konden de uitsnede niet controleren. Check je internetverbinding en probeer het opnieuw.");
      setBezig(false);
    }
  };

  const laden = !analyse && !fout;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]" role="dialog" aria-modal="true" aria-labelledby="uitknipper-titel">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-5 space-y-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-[14px] bg-secondary flex items-center justify-center text-primary shrink-0">
              <Scissors className="w-5 h-5" />
            </span>
            <div>
              <h2 id="uitknipper-titel" className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">We knippen het kledingstuk uit</h2>
              <p className="text-xs text-slate-500 mt-0.5">Je kind staat op de foto, dus die plaatsen we niet.</p>
            </div>
          </div>
          <button onClick={onAnnuleer} aria-label="Sluiten" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Zo hoog dat het hele venster (met knoppen) zonder scrollen op een telefoon past. */}
        <div className="relative aspect-[4/5] h-[min(44dvh,440px)] mx-auto rounded-3xl overflow-hidden bg-[#F6F2EF]">
          {laden && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-bold text-slate-700">Kledingstuk zoeken…</p>
              <p className="text-xs text-slate-500">De eerste keer duurt dit iets langer: we laden het herkenningsmodel op je telefoon.</p>
            </div>
          )}
          {fout && (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              <p className="text-sm font-bold text-slate-700">{fout}</p>
            </div>
          )}
          {!fout && voorbeelden?.[deel] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={voorbeelden[deel]!} alt="Uitgeknipt kledingstuk" className="absolute inset-0 w-full h-full object-cover" />
          )}
          {/* Origineel klein in de hoek: alleen hier te zien, niet in de advertentie. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bron} alt="Originele foto" className="absolute top-3 left-3 w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md" />
        </div>

        {!fout && varianten && (
          <div className="grid grid-cols-3 gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 p-1" role="radiogroup" aria-label="Welk kledingstuk verkoop je?">
            {DELEN.map(({ deel: d, label }) => (
              <button
                key={d}
                role="radio"
                aria-checked={deel === d}
                disabled={!varianten[d]}
                onClick={() => setDeel(d)}
                className={cn(
                  "h-9 rounded-full text-sm font-bold transition-colors disabled:opacity-35",
                  deel === d ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <p className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-px" />
          Dit gebeurt op je eigen telefoon. De foto van je kind wordt niet verstuurd; alleen het uitgeknipte kledingstuk komt in je advertentie.
        </p>

        <div className="flex gap-3">
          <button onClick={onAnnuleer} className="flex-1 h-12 rounded-full border border-slate-900/15 text-slate-700 dark:text-slate-200 font-bold text-sm">
            Andere foto
          </button>
          <button
            onClick={gebruik}
            disabled={!varianten?.[deel] || !!fout || bezig}
            className="flex-1 h-12 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {bezig ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gebruik deze foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
