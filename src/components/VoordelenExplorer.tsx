"use client";

import { useEffect, useRef, useState } from "react";
import { EyeOff, Ruler, Users, Heart, Leaf, X } from "lucide-react";

const VOORDELEN = [
  {
    icon: EyeOff,
    kleur: "blue" as const,
    titel: "Geen kinderhoofden zichtbaar",
    tekst: "Noah of Emma draagt automatisch elk kledingstuk in de advertentie. Het gezicht van jouw kind komt nooit online.",
  },
  {
    icon: Ruler,
    kleur: "pink" as const,
    titel: "Groeit mee met je kind",
    tekst: "Je groeimodel past zich vanzelf aan, dus je ziet altijd aanbod in de maat die nu past.",
  },
  {
    icon: Users,
    kleur: "blue" as const,
    titel: "Moeiteloos wisselen tussen kinderen",
    tekst: "Meerdere kinderen? Switch met één tik — de app verandert direct mee, met een eigen kleur per kind.",
  },
  {
    icon: Heart,
    kleur: "pink" as const,
    titel: "Simpel en leuk swipen",
    tekst: "Geen eindeloos scrollen door foto's. Swipe naar links of rechts, precies zoals je al gewend bent.",
  },
  {
    icon: Leaf,
    kleur: "blue" as const,
    titel: "Duurzaam voor het milieu",
    tekst: "Elk kledingstuk dat wordt doorverkocht, is er één minder dat nieuw geproduceerd hoeft te worden.",
  },
];

const AUTO_ADVANCE_MS = 4200;
const EXIT_MS = 380;
const DRAG_THRESHOLD = 90;

export function VoordelenExplorer() {
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<"left" | "right" | null>(null);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);

  const advance = (dir: "left" | "right", userInitiated: boolean) => {
    if (exit) return;
    setExit(dir);
    if (userInitiated) setPaused(true);
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % VOORDELEN.length);
      setExit(null);
      setDragX(0);
    }, EXIT_MS);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => advance("right", false), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (exit) return;
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragX > DRAG_THRESHOLD) advance("right", true);
    else if (dragX < -DRAG_THRESHOLD) advance("left", true);
    else setDragX(0);
  };

  const jumpTo = (i: number) => {
    if (i === index || exit) return;
    setPaused(true);
    setExit(i > index || (index === VOORDELEN.length - 1 && i === 0) ? "right" : "left");
    window.setTimeout(() => {
      setIndex(i);
      setExit(null);
      setDragX(0);
    }, EXIT_MS);
  };

  const card = VOORDELEN[index];
  const nextCard = VOORDELEN[(index + 1) % VOORDELEN.length];
  const isBlue = card.kleur === "blue";

  const dragRotate = dragX / 18;
  const cardStyle: React.CSSProperties = exit
    ? {
        transform: `translateX(${exit === "right" ? 420 : -420}px) rotate(${exit === "right" ? 18 : -18}deg)`,
        opacity: 0,
        transition: `transform ${EXIT_MS}ms cubic-bezier(0.32,0,0.67,0), opacity ${EXIT_MS}ms ease-out`,
      }
    : {
        transform: `translateX(${dragX}px) rotate(${dragRotate}deg)`,
        transition: dragging.current ? "none" : "transform 0.35s cubic-bezier(0.34,1.4,0.64,1)",
      };

  return (
    <div className="select-none">
      <div className="relative h-[300px] sm:h-[260px]">
        {/* peek card behind */}
        <div
          key={`next-${index}`}
          className={`absolute inset-0 rounded-3xl border ${nextCard.kleur === "blue" ? "bg-[#E4F4FB] border-[#C7E7F5]" : "bg-[#FFEAF1] border-[#FFD3E2]"} scale-[0.93] translate-y-3 opacity-70`}
        />

        {/* front card */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          style={cardStyle}
          className={`absolute inset-0 rounded-3xl bg-white/[0.07] border border-white/[0.16] backdrop-blur-sm p-7 sm:p-9 flex flex-col justify-between cursor-grab active:cursor-grabbing touch-pan-y ${dragging.current ? "" : ""}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isBlue ? "bg-[#3FA9DB]/20 text-[#7ECBEE]" : "bg-[#FF6F9C]/20 text-[#FF9EB8]"}`}>
              <card.icon className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <span className="text-white/40 text-xs font-bold tracking-wider">{index + 1}/{VOORDELEN.length}</span>
          </div>

          <div>
            <h3 className="font-headline font-extrabold text-xl sm:text-2xl mb-2">{card.titel}</h3>
            <p className="text-white/65 leading-relaxed max-w-[46ch]">{card.tekst}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); advance("left", true); }}
              aria-label="Vorige"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); advance("right", true); }}
              aria-label="Volgende"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${isBlue ? "bg-[#3FA9DB]/25 hover:bg-[#3FA9DB]/40 text-[#7ECBEE]" : "bg-[#FF6F9C]/25 hover:bg-[#FF6F9C]/40 text-[#FF9EB8]"}`}
            >
              <Heart className="w-5 h-5" strokeWidth={2} />
            </button>
            <span className="text-white/35 text-xs ml-1 hidden sm:inline">sleep of tik om verder te gaan</span>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {VOORDELEN.map((v, i) => (
          <button
            key={v.titel}
            onClick={() => jumpTo(i)}
            aria-label={v.titel}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-white" : "w-1.5 bg-white/25 hover:bg-white/45"}`}
          />
        ))}
      </div>
    </div>
  );
}
