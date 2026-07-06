"use client";

/**
 * Noah & Emma — volledige, meegroeiende avatars.
 * Rendert de SVG uit lib/avatarFullBodySvg (één bron voor app én kleding-compositie).
 */

import { useMemo } from "react";
import { getFullBodySvg, MAATLIJST_AVATAR, leeftijdBijMaat } from "@/lib/avatarFullBodySvg";

export { MAATLIJST_AVATAR, leeftijdBijMaat };

interface FullBodyProps {
  naam: "noah" | "emma";
  maat: string;
  /** 'voor' toont het gezicht, 'achter' de achterkant */
  aanzicht?: "voor" | "achter";
  /** Hoogte in pixels; breedte schaalt mee (viewBox 300×460) */
  height?: number;
  className?: string;
}

export function NoahEmmaFullBody({ naam, maat, aanzicht = "voor", height = 340, className }: FullBodyProps) {
  const svg = useMemo(
    () => getFullBodySvg(naam, maat, { aanzicht, uid: `${naam}-${maat.replace("/", "-")}-${aanzicht}` }),
    [naam, maat, aanzicht]
  );

  const width = (height * 300) / 460;

  return (
    <div
      className={className}
      style={{ width, height, lineHeight: 0 }}
      role="img"
      aria-label={`${naam === "noah" ? "Noah" : "Emma"} — maat ${maat}`}
      // SVG komt uit eigen code (lib/avatarFullBodySvg), geen extern risico
      dangerouslySetInnerHTML={{ __html: svg.replace(`width="300" height="460"`, `width="${width}" height="${height}"`) }}
    />
  );
}
