"use client";

import { cn } from "@/lib/utils";
import { NoahFace, EmmaFace } from "./NoahEmmaFaces";

interface NoahEmmaModelProps {
  naam: "noah" | "emma";
  maat: string;
  kledingUrl?: string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NoahEmmaModel({ naam, maat, kledingUrl, size = "md", selected, onClick, className }: NoahEmmaModelProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-36 h-36",
    lg: "w-48 h-48",
  };

  const naamLabel = naam === "noah" ? "Noah" : "Emma";
  const kleur = naam === "noah" ? "#b6e3f4" : "#ffb8c4";
  const FaceComponent = naam === "noah" ? NoahFace : EmmaFace;
  const faceSize = size === "sm" ? 96 : size === "md" ? 144 : 192;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-3xl p-4 transition-all border-2",
        selected ? "border-primary bg-primary/5 shadow-md shadow-primary/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800",
        onClick && "active:scale-[0.97] cursor-pointer",
        !onClick && "cursor-default",
        className
      )}
    >
      <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size])} style={{ backgroundColor: kleur + "30" }}>
        {/* Geïllustreerd gezicht */}
        <FaceComponent size={faceSize} />
        {/* Kleding overlay */}
        {kledingUrl && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden opacity-80">
            <img src={kledingUrl} alt="kleding" className="w-full h-full object-cover object-top" />
          </div>
        )}
        {selected && (
          <div className="absolute inset-0 ring-4 ring-primary rounded-full" />
        )}
      </div>

      <div className="text-center">
        <p className="font-black text-sm text-slate-800 dark:text-white">{naamLabel}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maat {maat}</p>
      </div>
    </button>
  );
}

// Standalone display voor in listing cards/detail
export function AIModelDisplay({ naam, maat, kledingUrl, className }: {
  naam: "noah" | "emma";
  maat: string;
  kledingUrl?: string;
  className?: string;
}) {
  const kleur = naam === "noah" ? "#b6e3f4" : "#ffb8c4";
  const naamLabel = naam === "noah" ? "Noah" : "Emma";
  const FaceComponent = naam === "noah" ? NoahFace : EmmaFace;

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)} style={{ backgroundColor: kleur + "20" }}>
      {/* Kleding op de achtergrond */}
      {kledingUrl && (
        <div className="absolute inset-0">
          <img src={kledingUrl} alt="kleding" className="w-full h-full object-cover opacity-30" />
        </div>
      )}

      {/* Gezicht op de voorgrond */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/60">
          <FaceComponent size={192} />
        </div>

        {/* Badge */}
        <div className="mt-3 flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Gemodelleerd door {naamLabel} · Maat {maat}
          </span>
        </div>
      </div>
    </div>
  );
}
