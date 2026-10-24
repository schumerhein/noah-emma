"use client";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Rocket, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * De swipestapel van Ontdekken.
 *
 * Waarom een eigen component met directe DOM-updates: tijdens het slepen
 * verandert de positie tot 120 keer per seconde. Liep dat via React-state,
 * dan werd bij elke beweging het hele beginscherm opnieuw getekend en
 * haperde de kaart op telefoons. Nu verschuiven we alleen de kaart zelf
 * (transform, op de GPU) en blijft React buiten de sleepbeweging.
 *
 * Verder:
 * - een snelle "flick" telt ook, niet alleen een lange veeg;
 * - de volgende kaart ligt al klaar (met foto) en groeit mee tijdens het slepen;
 * - een weggeswipete kaart vliegt uit als losse laag, zodat je meteen door
 *   kunt swipen zonder op de animatie te wachten;
 * - tikken op de kaart opent het product;
 * - als de telefoon het gebaar afbreekt (pointercancel), veert de kaart terug.
 */

export type SwipeRichting = "left" | "right";

export type SwipeListing = {
  id: string;
  titel: string;
  prijs: number;
  maat: string;
  conditie: string;
  categorie: string;
  subcategorie?: string | null;
  merk: string | null;
  foto_urls: string[];
  likes: number;
  user_id: string;
  gepromoot?: boolean;
  promotie_verloopdatum?: string | null;
  profiles?: {
    naam: string | null;
    stad: string | null;
    gemiddelde_beoordeling: number | null;
    totaal_beoordelingen: number | null;
    avatar_url: string | null;
    vakantiestand: boolean | null;
    privacy_instellingen?: { verberg_locatie?: boolean } | null;
  };
};

export interface SwipeStapelHandle {
  /** Swipe de bovenste kaart weg, bv. via de knoppen onder de stapel. */
  swipe: (richting: SwipeRichting) => void;
}

interface SwipeStapelProps {
  listings: SwipeListing[];
  /** Mag deze swipe doorgaan? Bij false veert de kaart terug (bv. daglimiet bereikt). */
  magSwipen: () => boolean;
  /** De kaart is weggeswipet; haal 'm direct uit de lijst. */
  onSwipe: (richting: SwipeRichting, listing: SwipeListing) => void;
  onOpen: (listing: SwipeListing) => void;
  ref?: React.Ref<SwipeStapelHandle>;
}

type Sleep = {
  id: string;
  pointerId: number;
  x0: number;
  y0: number;
  t0: number;
  dx: number;
  dy: number;
  punten: { x: number; y: number; t: number }[];
};

type Vlucht = { x: number; y: number; rot: number; duur: number; richting: SwipeRichting };

// Hoeveel kaarten er tegelijk in de stapel liggen. De derde is onzichtbaar
// maar laadt de foto alvast, zodat er nooit een lege kaart bovenkomt.
const STAPEL = 3;
const TERUGVEREN = "transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.2)";
const OPSCHUIVEN = "transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)";

const onderPositie = (diepte: number, voortgang = 0) => {
  // diepte 1 = direct onder de bovenste kaart; voortgang 0..1 = hoe ver de
  // bovenste kaart al weggesleept is (dan schuift deze alvast naar voren).
  const d = Math.max(0, diepte - voortgang);
  return `translate3d(0, ${d * 16}px, 0) scale(${1 - d * 0.03})`;
};

export function SwipeStapel({ listings, magSwipen, onSwipe, onOpen, ref }: SwipeStapelProps) {
  const [vliegers, setVliegers] = useState<SwipeListing[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const kaarten = useRef(new Map<string, HTMLDivElement>());
  const sleep = useRef<Sleep | null>(null);
  const frame = useRef<number | null>(null);
  const vluchten = useRef(new Map<string, Vlucht>());
  const gelanceerd = useRef(new Set<string>());

  const vliegendeIds = new Set(vliegers.map((v) => v.id));
  const zichtbaar = listings.filter((l) => !vliegendeIds.has(l.id)).slice(0, STAPEL);
  const boven = zichtbaar[0];
  const zichtbaarKey = zichtbaar.map((l) => l.id).join(",");

  // Laatste versie van de callbacks, zodat de event-handlers niet elke
  // render opnieuw hoeven te worden aangemaakt.
  const props = useRef({ magSwipen, onSwipe, onOpen, zichtbaar });
  props.current = { magSwipen, onSwipe, onOpen, zichtbaar };

  const stempels = (el: HTMLElement | undefined, like: number, nee: number, transition = "none") => {
    if (!el) return;
    const l = el.querySelector<HTMLElement>("[data-stempel=like]");
    const n = el.querySelector<HTMLElement>("[data-stempel=nee]");
    if (l) { l.style.transition = transition; l.style.opacity = String(like); }
    if (n) { n.style.transition = transition; n.style.opacity = String(nee); }
  };

  // Zet de stapel op z'n plek zodra er een kaart bij komt of af gaat. De
  // bovenste kaart tijdens het slepen niet aanraken.
  useLayoutEffect(() => {
    zichtbaar.forEach((l, diepte) => {
      const el = kaarten.current.get(l.id);
      if (!el || sleep.current?.id === l.id) return;
      el.style.transition = OPSCHUIVEN;
      el.style.transform = diepte === 0 ? "translate3d(0, 0, 0)" : onderPositie(diepte);
      el.style.opacity = diepte < 2 ? "1" : "0";
      el.style.pointerEvents = diepte === 0 ? "auto" : "none";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zichtbaarKey]);

  // Laat net weggeswipete kaarten uitvliegen; daarna verdwijnen ze uit de DOM.
  useLayoutEffect(() => {
    vliegers.forEach((v) => {
      if (gelanceerd.current.has(v.id)) return;
      const el = kaarten.current.get(v.id);
      const vlucht = vluchten.current.get(v.id);
      if (!el || !vlucht) return;
      gelanceerd.current.add(v.id);
      el.style.pointerEvents = "none";
      stempels(el, vlucht.richting === "right" ? 1 : 0, vlucht.richting === "left" ? 1 : 0, "opacity 120ms linear");
      el.style.transition = `transform ${vlucht.duur}ms cubic-bezier(0.3, 0.6, 0.4, 1)`;
      el.style.transform = `translate3d(${vlucht.x}px, ${vlucht.y}px, 0) rotate(${vlucht.rot}deg)`;
      window.setTimeout(() => {
        vluchten.current.delete(v.id);
        gelanceerd.current.delete(v.id);
        setVliegers((prev) => prev.filter((p) => p.id !== v.id));
      }, vlucht.duur + 40);
    });
  }, [vliegers]);

  const tekenSleep = () => {
    frame.current = null;
    const s = sleep.current;
    if (!s) return;
    const el = kaarten.current.get(s.id);
    if (!el) return;
    el.style.transform = `translate3d(${s.dx}px, ${s.dy * 0.35}px, 0) rotate(${s.dx / 18}deg)`;
    stempels(el, Math.min(Math.max(s.dx / 90, 0), 1), Math.min(Math.max(-s.dx / 90, 0), 1));
    const volgende = props.current.zichtbaar[1];
    const breedte = containerRef.current?.clientWidth || 360;
    const voortgang = Math.min(Math.abs(s.dx) / (breedte * 0.35), 1);
    const volgEl = volgende && kaarten.current.get(volgende.id);
    if (volgEl) {
      volgEl.style.transition = "none";
      volgEl.style.transform = onderPositie(1, voortgang);
    }
  };

  const terugveren = (id: string) => {
    const el = kaarten.current.get(id);
    if (el) {
      el.style.transition = TERUGVEREN;
      el.style.transform = "translate3d(0, 0, 0)";
      stempels(el, 0, 0, "opacity 200ms ease-out");
    }
    const volgende = props.current.zichtbaar[1];
    const volgEl = volgende && kaarten.current.get(volgende.id);
    if (volgEl) {
      volgEl.style.transition = OPSCHUIVEN;
      volgEl.style.transform = onderPositie(1);
    }
  };

  const lanceer = (listing: SwipeListing, richting: SwipeRichting, dx: number, dy: number, vx: number, vy: number) => {
    if (!props.current.magSwipen()) {
      terugveren(listing.id);
      return;
    }
    const breedte = containerRef.current?.clientWidth || 360;
    const teken = richting === "right" ? 1 : -1;
    const x = teken * Math.max(breedte * 1.5, Math.abs(dx) + breedte);
    // Hoe harder de flick, hoe sneller de kaart wegvliegt (180–340 ms).
    const snelheid = Math.max(Math.abs(vx), 1.4);
    const duur = Math.round(Math.min(340, Math.max(180, (Math.abs(x) - Math.abs(dx)) / snelheid)));
    vluchten.current.set(listing.id, {
      x,
      y: dy * 0.35 + vy * duur * 0.5,
      rot: teken * 24 + dx / 30,
      duur,
      richting,
    });
    setVliegers((prev) => [listing, ...prev]);
    props.current.onSwipe(richting, listing);
  };

  useImperativeHandle(ref, () => ({
    swipe: (richting) => {
      const top = props.current.zichtbaar[0];
      if (!top || sleep.current) return;
      lanceer(top, richting, 0, 0, 0, 0);
    },
  }));

  // Pijltjestoetsen op de computer.
  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const doel = e.target as HTMLElement | null;
      if (doel && (doel.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(doel.tagName))) return;
      const top = props.current.zichtbaar[0];
      if (!top || sleep.current) return;
      e.preventDefault();
      lanceer(top, e.key === "ArrowRight" ? "right" : "left", 0, 0, 0, 0);
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!boven || sleep.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    const el = kaarten.current.get(boven.id);
    if (!el) return;
    el.style.transition = "none";
    e.currentTarget.setPointerCapture(e.pointerId);
    const t = performance.now();
    sleep.current = { id: boven.id, pointerId: e.pointerId, x0: e.clientX, y0: e.clientY, t0: t, dx: 0, dy: 0, punten: [{ x: e.clientX, y: e.clientY, t }] };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sleep.current;
    if (!s || e.pointerId !== s.pointerId) return;
    s.dx = e.clientX - s.x0;
    s.dy = e.clientY - s.y0;
    s.punten.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (s.punten.length > 6) s.punten.shift();
    if (frame.current == null) frame.current = requestAnimationFrame(tekenSleep);
  };

  const eindigSleep = (e: React.PointerEvent<HTMLDivElement>, afgebroken: boolean) => {
    const s = sleep.current;
    if (!s || e.pointerId !== s.pointerId) return;
    sleep.current = null;
    if (frame.current != null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);

    const listing = props.current.zichtbaar.find((l) => l.id === s.id);
    if (!listing) return;
    if (afgebroken) {
      terugveren(s.id);
      return;
    }

    // Snelheid over de laatste ~100 ms, in px per ms.
    const nu = performance.now();
    const recent = s.punten.filter((p) => nu - p.t < 100);
    const eerste = recent[0] ?? s.punten[0];
    const laatste = s.punten[s.punten.length - 1];
    const dt = Math.max(laatste.t - eerste.t, 1);
    const vx = recent.length > 1 ? (laatste.x - eerste.x) / dt : 0;
    const vy = recent.length > 1 ? (laatste.y - eerste.y) / dt : 0;

    const breedte = containerRef.current?.clientWidth || 360;
    const drempel = Math.min(110, breedte * 0.3);
    const flick = Math.abs(vx) > 0.45 && Math.abs(s.dx) > 24 && Math.sign(vx) === Math.sign(s.dx);

    if (s.dx > drempel || (flick && s.dx > 0)) {
      lanceer(listing, "right", s.dx, s.dy, vx, vy);
    } else if (s.dx < -drempel || (flick && s.dx < 0)) {
      lanceer(listing, "left", s.dx, s.dy, vx, vy);
    } else {
      terugveren(s.id);
      const getikt = Math.abs(s.dx) < 8 && Math.abs(s.dy) < 8 && nu - s.t0 < 350;
      if (getikt) props.current.onOpen(listing);
    }
  };

  const zetKaartRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) kaarten.current.set(id, el);
    else kaarten.current.delete(id);
  };

  // Volgorde in de DOM: onderste kaart eerst, uitvliegers (nieuwste eerst)
  // als laatste. Zo verschuift een kaart nooit in de DOM als hij van
  // "bovenop" naar "uitvliegend" gaat — dan zou de animatie niet starten.
  const volgorde = [...zichtbaar].reverse();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => eindigSleep(e, false)}
      onPointerCancel={(e) => eindigSleep(e, true)}
      onLostPointerCapture={(e) => eindigSleep(e, true)}
    >
      {volgorde.map((l) => (
        <SwipeKaart key={l.id} listing={l} kaartRef={zetKaartRef(l.id)} prioriteit={l.id === boven?.id} />
      ))}
      {vliegers.map((l) => (
        <SwipeKaart key={l.id} listing={l} kaartRef={zetKaartRef(l.id)} prioriteit />
      ))}
    </div>
  );
}

function Sterren({ waarde }: { waarde: number }) {
  const vol = Math.round(waarde);
  return (
    <span className="flex items-center gap-[1px]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-3 h-3", i < vol ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
      ))}
    </span>
  );
}

function SwipeKaart({ listing, kaartRef, prioriteit }: { listing: SwipeListing; kaartRef: (el: HTMLDivElement | null) => void; prioriteit: boolean }) {
  const p = listing.profiles;
  const gepromoot = listing.gepromoot && listing.promotie_verloopdatum && new Date(listing.promotie_verloopdatum) > new Date();
  const beoordeling = Number(p?.gemiddelde_beoordeling ?? 0);

  return (
    <div
      ref={kaartRef}
      style={{ willChange: "transform", WebkitUserSelect: "none" }}
      className="absolute inset-0 flex flex-col rounded-[30px] bg-white dark:bg-slate-800 p-2 shadow-[0_30px_60px_-28px_rgba(36,26,46,0.5)] cursor-grab active:cursor-grabbing"
    >
      {/* Foto */}
      <div className="relative flex-1 min-h-0 rounded-[23px] overflow-hidden bg-slate-100 dark:bg-slate-700 pointer-events-none">
        {listing.foto_urls?.[0] ? (
          <Image
            src={listing.foto_urls[0]}
            alt={listing.titel}
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-cover"
            draggable={false}
            priority={prioriteit}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons-round text-slate-300 text-6xl">image</span>
          </div>
        )}

        {/* Stempels tijdens het slepen */}
        <div data-stempel="like" style={{ opacity: 0 }} className="absolute top-8 left-5 z-20 -rotate-12 flex items-center gap-1.5 rounded-2xl border-[3px] border-[#D63D74] bg-white/85 px-4 py-1.5">
          <Heart className="w-6 h-6 fill-[#D63D74] text-[#D63D74]" />
          <span className="font-headline text-2xl font-extrabold tracking-wide text-[#D63D74]">LIKE</span>
        </div>
        <div data-stempel="nee" style={{ opacity: 0 }} className="absolute top-8 right-5 z-20 rotate-12 flex items-center gap-1.5 rounded-2xl border-[3px] border-slate-600 bg-white/85 px-4 py-1.5">
          <X className="w-6 h-6 text-slate-600" strokeWidth={3} />
          <span className="font-headline text-2xl font-extrabold tracking-wide text-slate-600">NEE</span>
        </div>

        {gepromoot && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 shadow-md">
            <Rocket className="w-3 h-3 text-white" />
            <span className="text-[10px] font-black uppercase tracking-wide text-white">Gepromoot</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {listing.likes > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span className="text-xs font-bold text-white">{listing.likes}</span>
            </span>
          ) : <span />}
          <span className="rounded-full bg-white px-4 py-1.5 font-headline text-xl font-extrabold text-slate-900 shadow-md">
            €{Number(listing.prijs).toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="shrink-0 px-2 pt-2.5 pb-1 pointer-events-none">
        <h3 className="font-headline text-[19px] font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white truncate">{listing.titel}</h3>
        {/* Kenmerken altijd op één regel. Past het laatste label niet, dan
            loopt het door naar een tweede regel die buiten beeld valt: er
            staan er dan twee, en de foto wordt nooit kleiner door een extra regel. */}
        <div className="mt-1 flex flex-wrap gap-1.5 h-[22px] overflow-hidden">
          <span className="inline-flex items-center h-[22px] max-w-full truncate rounded-full bg-blauw-100 px-2.5 text-xs font-bold text-blauw-600">
            Maat {listing.maat}
          </span>
          {listing.conditie && (
            <span className="inline-flex items-center h-[22px] max-w-full truncate rounded-full bg-roze-100 px-2.5 text-xs font-bold text-roze-600">
              {listing.conditie}
            </span>
          )}
          {listing.merk && (
            <span className="inline-flex items-center h-[22px] max-w-full truncate rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
              {listing.merk}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          {p?.avatar_url ? (
            <Image src={p.avatar_url} alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover shrink-0" draggable={false} />
          ) : (
            <span className="w-7 h-7 rounded-full bg-[#FFEAF1] flex items-center justify-center text-xs font-extrabold text-[#D63D74] shrink-0">
              {(p?.naam || "?").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">{p?.naam || "Gebruiker"}</span>
            <span className="flex items-center gap-1 min-w-0">
              <Sterren waarde={beoordeling} />
              <span className="text-[11px] font-semibold text-slate-500 truncate">
                {beoordeling > 0 ? `${beoordeling.toFixed(1).replace(".", ",")} (${p?.totaal_beoordelingen ?? 0})` : "Nog geen reviews"}
              </span>
            </span>
          </div>
          {p?.stad && !p.privacy_instellingen?.verberg_locatie && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-slate-500 shrink-0 max-w-[40%] truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{p.stad}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
