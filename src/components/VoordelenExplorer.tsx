"use client";

import { useEffect, useRef, useState } from "react";
import { EyeOff, Ruler, Users, Heart, Leaf } from "lucide-react";

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

export function VoordelenExplorer() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let ticking = false;
    const updateActive = () => {
      ticking = false;
      const scrollerRect = scroller.getBoundingClientRect();
      const center = scrollerRect.left + scrollerRect.width / 2;
      let closest = 0;
      let closestDist = Infinity;
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    };

    updateActive();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = panelRefs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 pb-3 -mx-5 px-5 sm:-mx-8 sm:px-8 scrollbar-none"
      >
        {VOORDELEN.map((v, i) => {
          const isBlue = v.kleur === "blue";
          return (
            <div
              key={v.titel}
              ref={(el) => { panelRefs.current[i] = el; }}
              className={`snap-center shrink-0 w-[82%] sm:w-[420px] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between min-h-[280px] transition-transform duration-300 ${
                isBlue ? "bg-gradient-to-br from-[#E4F4FB] to-white" : "bg-gradient-to-br from-[#FFEAF1] to-white"
              } ${active === i ? "scale-100" : "scale-[0.96] opacity-80"}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white shadow-[0_10px_24px_-12px_rgba(36,26,46,0.25)] flex items-center justify-center ${isBlue ? "text-[#1C7FA8]" : "text-[#D63D74]"}`}>
                <v.icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <div className="mt-8">
                <h3 className="font-headline font-extrabold text-xl sm:text-2xl mb-2.5 text-[#241A2E]">{v.titel}</h3>
                <p className="text-[#5B4F63] leading-relaxed">{v.tekst}</p>
              </div>
            </div>
          );
        })}
        <div className="shrink-0 w-px sm:hidden" aria-hidden />
      </div>

      <div className="flex items-center justify-center gap-2 mt-7">
        {VOORDELEN.map((v, i) => (
          <button
            key={v.titel}
            onClick={() => scrollTo(i)}
            aria-label={v.titel}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "w-7 bg-[#241A2E]" : "w-1.5 bg-[#241A2E]/20 hover:bg-[#241A2E]/40"
            }`}
          />
        ))}
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
