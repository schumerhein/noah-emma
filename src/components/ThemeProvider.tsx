"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const LS_KEY = "actief_kind";

export type ActiefKind = {
  id: string;
  naam: string | null;
  maat: string;
  geslacht: string | null;
};

export function pasThemaToe(geslacht: string | null) {
  if (geslacht === "jongen") {
    document.documentElement.setAttribute("data-gender", "jongen");
  } else if (geslacht === "meisje") {
    document.documentElement.setAttribute("data-gender", "meisje");
  } else {
    document.documentElement.removeAttribute("data-gender");
  }
}

export function slaActiefKindOp(kind: ActiefKind) {
  localStorage.setItem(LS_KEY, JSON.stringify(kind));
  pasThemaToe(kind.geslacht);
  window.dispatchEvent(new CustomEvent("kind-gewisseld", { detail: kind }));
}

export function leesActiefKind(): ActiefKind | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const laadThema = async () => {
      // Gebruik eerst het opgeslagen actieve kind
      const opgeslagen = leesActiefKind();
      if (opgeslagen) {
        pasThemaToe(opgeslagen.geslacht);
        return;
      }

      // Fallback: laad eerste kind uit Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("children")
        .select("id, naam, maat, geslacht")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (data) {
        slaActiefKindOp(data as ActiefKind);
      }
    };

    laadThema();

    // Luister naar kind-wissels
    const onWissel = (e: Event) => {
      const kind = (e as CustomEvent<ActiefKind>).detail;
      pasThemaToe(kind.geslacht);
    };
    window.addEventListener("kind-gewisseld", onWissel);

    // Auth-wijzigingen
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem(LS_KEY);
        document.documentElement.removeAttribute("data-gender");
      } else {
        laadThema();
      }
    });

    return () => {
      window.removeEventListener("kind-gewisseld", onWissel);
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
