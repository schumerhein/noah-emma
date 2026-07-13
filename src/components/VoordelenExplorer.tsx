"use client";

import { useEffect, useState } from "react";
import { EyeOff, Ruler, Users, Heart, Leaf } from "lucide-react";

const VOORDELEN = [
  {
    icon: EyeOff,
    kleur: "blue" as const,
    titel: "Geen kinderhoofden zichtbaar",
    tekst: "Noah of Emma draagt automatisch elk kledingstuk in de advertentie. Het gezicht van jouw kind komt nooit online — bij geen enkele advertentie.",
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

const AUTO_ADVANCE_MS = 4500;

export function VoordelenExplorer() {
  const items = VOORDELEN;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  const kiesActief = (i: number) => {
    setActive(i);
    setPaused(true);
  };

  const huidige = items[active];
  const isBlue = huidige.kleur === "blue";

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible scrollbar-none">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.titel}
              onClick={() => kiesActief(i)}
              className={`relative shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold transition-all overflow-hidden ${
                isActive
                  ? "border-transparent text-[#241A2E] bg-white"
                  : "border-white/15 text-white/60 hover:text-white/90 hover:border-white/30"
              }`}
            >
              {isActive && !paused && (
                <span
                  key={active}
                  className={`absolute inset-0 origin-left ${item.kleur === "blue" ? "bg-[#E4F4FB]" : "bg-[#FFEAF1]"}`}
                  style={{ animation: `voordeel-progress ${AUTO_ADVANCE_MS}ms linear forwards` }}
                />
              )}
              <item.icon className="relative w-4 h-4 shrink-0" strokeWidth={2} />
              <span className="relative whitespace-nowrap">{item.titel}</span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="mt-8 bg-white/[0.06] border border-white/[0.12] rounded-3xl p-8 sm:p-10 min-h-[176px] flex items-center">
        <div key={active} className="flex flex-col sm:flex-row sm:items-center gap-6 animate-voordeel-fade">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${isBlue ? "bg-[#3FA9DB]/20 text-[#7ECBEE]" : "bg-[#FF6F9C]/20 text-[#FF9EB8]"}`}>
            <huidige.icon className="w-8 h-8" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-xl sm:text-2xl mb-2">{huidige.titel}</h3>
            <p className="text-white/65 leading-relaxed max-w-[52ch]">{huidige.tekst}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes voordeel-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes voordeel-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-voordeel-fade { animation: voordeel-fade 0.4s ease-out; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          .animate-voordeel-fade { animation: none; }
        }
      `}</style>
    </div>
  );
}
