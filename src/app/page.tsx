"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { haalGeblokkeerdeIds, filterZichtbaar } from "@/lib/zichtbaarheid";
import { leesActiefKind, type ActiefKind } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { X, Zap, Crown } from "lucide-react";

type Listing = {
  id: string;
  titel: string;
  prijs: number;
  maat: string;
  conditie: string;
  categorie: string;
  merk: string | null;
  foto_urls: string[];
  likes: number;
  user_id: string;
  gepromoot?: boolean;
  profiles?: {
    naam: string | null;
    stad: string | null;
    gemiddelde_beoordeling: number | null;
    totaal_beoordelingen: number | null;
    avatar_url: string | null;
  };
};

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<ActiefKind | null>(null);
  // Onthoud de filterkeuze van de gebruiker tussen sessies
  const [filterOpKind, setFilterOpKindState] = useState(true);
  const setFilterOpKind = (updater: boolean | ((prev: boolean) => boolean)) => {
    setFilterOpKindState(prev => {
      const nieuw = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("filter_op_kind", nieuw ? "1" : "0"); } catch {}
      return nieuw;
    });
  };
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const swipeThreshold = 100;

  // Verdienmodel
  const [isPremium, setIsPremium] = useState(false);
  const [swipesVandaag, setSwipesVandaag] = useState(0);
  const SWIPE_LIMIET = 10;
  const [toonPremiumModal, setToonPremiumModal] = useState(false);
  const [premiumActiveren, setPremiumActiveren] = useState(false);

  useEffect(() => {
    const actief = leesActiefKind();
    if (actief) setKind(actief);
    else laadKindFallback();
    checkPremiumEnSwipes();

    // Herstel de bewaarde filterkeuze
    try {
      const bewaard = localStorage.getItem("filter_op_kind");
      if (bewaard !== null) setFilterOpKindState(bewaard === "1");
    } catch {}

    const onWissel = (e: Event) => {
      const nieuwKind = (e as CustomEvent<ActiefKind>).detail;
      setKind(nieuwKind);
    };
    window.addEventListener("kind-gewisseld", onWissel);
    return () => window.removeEventListener("kind-gewisseld", onWissel);
  }, []);

  useEffect(() => { laadListings(); }, [kind, filterOpKind]);

  const checkPremiumEnSwipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, premium_verloopdatum")
      .eq("id", user.id)
      .single();

    const premium = profile?.is_premium &&
      (!profile.premium_verloopdatum || new Date(profile.premium_verloopdatum) > new Date());
    setIsPremium(premium || false);

    if (!premium) {
      const vandaag = new Date().toISOString().split("T")[0];
      const { data: teller } = await supabase
        .from("swipe_tellers")
        .select("aantal")
        .eq("user_id", user.id)
        .eq("datum", vandaag)
        .maybeSingle();
      setSwipesVandaag(teller?.aantal || 0);
    }
  };

  const laadKindFallback = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("children")
      .select("id, naam, maat, geslacht")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    if (data) setKind(data as ActiefKind);
  };

  const laadListings = async () => {
    setLoading(true);

    // Laad gepromote listings eerst
    let queryPromoted = supabase
      .from("listings")
      .select("*, profiles(naam, stad, gemiddelde_beoordeling, totaal_beoordelingen, avatar_url)")
      .eq("actief", true)
      .eq("gepromoot", true)
      .limit(5);

    let queryNormaal = supabase
      .from("listings")
      .select("*, profiles(naam, stad, gemiddelde_beoordeling, totaal_beoordelingen, avatar_url)")
      .eq("actief", true)
      .eq("gepromoot", false)
      .order("created_at", { ascending: false })
      .limit(50);

    if (kind && filterOpKind) {
      queryPromoted = queryPromoted.eq("maat", kind.maat);
      queryNormaal = queryNormaal.eq("maat", kind.maat);
    }
    if (kind?.geslacht === "jongen") {
      queryPromoted = queryPromoted.neq("categorie", "Meisjeskleding");
      queryNormaal = queryNormaal.neq("categorie", "Meisjeskleding");
    } else if (kind?.geslacht === "meisje") {
      queryPromoted = queryPromoted.neq("categorie", "Jongenskleding");
      queryNormaal = queryNormaal.neq("categorie", "Jongenskleding");
    }

    const [{ data: promoted }, { data: normaal }, geblokkeerd, { data: { user } }] = await Promise.all([
      queryPromoted,
      queryNormaal,
      haalGeblokkeerdeIds(),
      supabase.auth.getUser(),
    ]);
    const combined = filterZichtbaar([...(promoted || []), ...(normaal || [])], geblokkeerd, user?.id);
    setListings(combined as Listing[]);
    setLoading(false);
  };

  const registreerSwipe = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || isPremium) return;

    const vandaag = new Date().toISOString().split("T")[0];
    await supabase.from("swipe_tellers").upsert(
      { user_id: user.id, datum: vandaag, aantal: swipesVandaag + 1 },
      { onConflict: "user_id,datum" }
    );
    setSwipesVandaag(prev => prev + 1);
  };

  const handleSwipeAction = async (direction: "left" | "right") => {
    // Check swipe limiet
    if (!isPremium && swipesVandaag >= SWIPE_LIMIET) {
      setToonPremiumModal(true);
      return;
    }

    setSwiping(direction);
    setDragX(direction === "right" ? 250 : -250);

    if (direction === "right" && current) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const actiefKind = leesActiefKind();
        await supabase.from("favorites")
          .upsert(
            { user_id: user.id, listing_id: current.id, kind_id: actiefKind?.id ?? null },
            { onConflict: "user_id,listing_id" }
          );
      } else {
        // Gast: like wordt niet bewaard — verwijs één keer naar inloggen
        toast({
          title: "Log in om favorieten te bewaren",
          description: "Als gast worden je likes niet opgeslagen.",
        });
      }
    }

    await registreerSwipe();

    setTimeout(() => {
      setListings(prev => prev.length > 1 ? prev.slice(1) : []);
      setSwiping(null);
      setDragX(0);
    }, 400);
  };

  const activeerPremium = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    setPremiumActiveren(true);
    try {
      const res = await fetch("/api/betalen/premium", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Betaling starten mislukt");
      window.location.href = data.checkoutUrl;
    } catch {
      setPremiumActiveren(false);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (swiping) return;
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - startX.current);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (dragX > swipeThreshold) handleSwipeAction("right");
    else if (dragX < -swipeThreshold) handleSwipeAction("left");
    else setDragX(0);
  };

  const likeOpacity = Math.min(Math.max(dragX / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 80, 0), 1);
  const rotation = dragX / 15;
  const current = listings[0];

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const vol = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={cn(
            "material-icons-round text-[12px]",
            i < vol ? "text-amber-400" : (i === vol && half ? "text-amber-300" : "text-slate-200 dark:text-slate-600")
          )}>
            {i < vol ? "star" : (i === vol && half ? "star_half" : "star_border")}
          </span>
        ))}
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-0.5">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-background-light dark:bg-background-dark relative font-display overflow-hidden" style={{ height: 'calc(100dvh - 5rem - env(safe-area-inset-bottom))' }}>

      {/* Header */}
      <header className="pt-12 pb-2 px-6 flex items-center justify-between z-10 shrink-0">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">Ontdekken</h1>
        <div className="flex items-center gap-2">
          {/* Swipe teller */}
          {!isPremium && (
            <button
              onClick={() => setToonPremiumModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {Math.max(0, SWIPE_LIMIET - swipesVandaag)}/{SWIPE_LIMIET}
              </span>
            </button>
          )}
          {isPremium && (
            <Link href="/premium">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 active:scale-95 transition-transform">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-amber-700">Premium</span>
              </div>
            </Link>
          )}
          {kind && (
            <button
              onClick={() => setFilterOpKind(f => !f)}
              className={cn(
                "flex items-center px-3 py-1.5 rounded-full border text-xs font-extrabold tracking-tight transition-all",
                filterOpKind
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                  : "bg-primary/10 text-primary-dark border-primary/20"
              )}
            >
              <span className="mr-1.5 text-sm leading-none">
                {kind.geslacht === "meisje" ? "👧" : kind.geslacht === "jongen" ? "👦" : "🧒"}
              </span>
              <span>{kind.naam || "Kind"} · Maat {kind.maat}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 min-h-0 px-5 flex flex-col pt-2 touch-none overflow-hidden">

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
              <p className="text-slate-400 text-sm font-medium">Laden...</p>
            </div>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <span className="material-icons-round text-slate-300 text-6xl">inventory_2</span>
              {kind && filterOpKind ? (
                <>
                  <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Geen producten in maat {kind.maat}</h2>
                  <p className="text-slate-400 text-sm">Er zijn nog geen items in de huidige maat van {kind.naam || "je kind"}.</p>
                  <button onClick={() => setFilterOpKind(false)} className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">
                    Toon alle maten
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Nog geen producten</h2>
                  <p className="text-slate-400 text-sm">Wees de eerste om iets te plaatsen!</p>
                  <Link href="/sell">
                    <button className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">Product plaatsen</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {!loading && current && (
          <>
            <div className="card-stack w-full relative flex-1 min-h-0">
              {listings.length > 1 && (
                <div className="absolute inset-x-2 bottom-0 top-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl opacity-60 scale-[0.97]" />
              )}

              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                  transform: (isDragging || swiping)
                    ? `translateX(${dragX}px) rotate(${rotation}deg)`
                    : undefined,
                  transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                className={cn(
                  "absolute inset-0 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-700 select-none",
                  !swiping && "cursor-grab active:cursor-grabbing"
                )}
              >
                {/* Foto */}
                <div className="relative flex-1 bg-slate-50 dark:bg-zinc-700 overflow-hidden pointer-events-none min-h-0">
                  {current.foto_urls?.[0] ? (
                    <Image src={current.foto_urls[0]} alt={current.titel} fill className="object-cover" priority />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-icons-round text-slate-300 text-6xl">image</span>
                    </div>
                  )}

                  {/* LIKE / NEE badges */}
                  <div style={{ opacity: likeOpacity }} className="absolute top-10 left-5 z-20 border-4 border-emerald-500 rounded-xl px-5 py-2 -rotate-12 bg-emerald-500/10 backdrop-blur-sm">
                    <span className="text-2xl font-black text-emerald-500 uppercase tracking-widest">LIKE</span>
                  </div>
                  <div style={{ opacity: nopeOpacity }} className="absolute top-10 right-5 z-20 border-4 border-rose-500 rounded-xl px-5 py-2 rotate-12 bg-rose-500/10 backdrop-blur-sm">
                    <span className="text-2xl font-black text-rose-500 uppercase tracking-widest">NEE</span>
                  </div>

                  {/* Gepromoot badge */}
                  {current.gepromoot && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-amber-500 px-2.5 py-1 rounded-full shadow-md">
                      <Crown className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wide">Gepromoot</span>
                    </div>
                  )}

                  {/* Prijs + likes badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    {current.likes > 0 ? (
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <span className="text-base">❤️</span>
                        <span className="text-sm font-bold text-white">{current.likes}</span>
                      </div>
                    ) : <div />}
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md">
                      <span className="text-xl font-black text-primary">€{current.prijs.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                </div>

                {/* Info sectie */}
                <div className="p-4 flex flex-col gap-3 pointer-events-none shrink-0">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">{current.titel}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-slate-100 dark:bg-zinc-700 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">Maat {current.maat}</span>
                      <span className="bg-slate-100 dark:bg-zinc-700 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">{current.conditie}</span>
                      {current.merk && (
                        <span className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-bold text-primary">{current.merk}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                    {current.profiles?.avatar_url ? (
                      <Image src={current.profiles.avatar_url} alt={current.profiles.naam || ""} width={36} height={36}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-black text-primary shrink-0">
                        {(current.profiles?.naam || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                      {current.profiles?.naam || "Gebruiker"}
                    </span>
                    {current.profiles?.gemiddelde_beoordeling ? (
                      <div className="flex items-center gap-0.5 shrink-0">
                        {renderStars(current.profiles.gemiddelde_beoordeling)}
                        {current.profiles.totaal_beoordelingen != null && (
                          <span className="text-[10px] text-slate-400 ml-0.5">({current.profiles.totaal_beoordelingen})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md shrink-0">Nieuw</span>
                    )}
                    {current.profiles?.stad && (
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate ml-auto shrink-0">
                        📍 {current.profiles.stad}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actieknoppen */}
            <div className="flex items-center justify-center gap-8 py-7 shrink-0">
              <button
                onClick={() => handleSwipeAction("left")}
                className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-lg flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
              >
                <span className="material-icons-round text-3xl">close</span>
              </button>

              <Link href={`/product/${current.id}`}>
                <button className="w-[4.5rem] h-[4.5rem] rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-white active:scale-95 transition-transform">
                  <span className="material-icons-round text-4xl">shopping_bag</span>
                </button>
              </Link>

              <button
                onClick={() => handleSwipeAction("right")}
                className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 border-2 border-primary/40 shadow-lg flex items-center justify-center text-primary-dark active:scale-90 transition-transform"
              >
                <span className="material-icons-round text-3xl">favorite_border</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Premium Modal */}
      {toonPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm px-4 pb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Gradient header */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-8 text-center">
              <Crown className="w-12 h-12 text-white mx-auto mb-3" />
              <h2 className="text-2xl font-black text-white">Noah & Emma Premium</h2>
              <p className="text-amber-100 text-sm mt-1 font-medium">Onbeperkt ontdekken, overal zoeken</p>
            </div>

            <div className="p-6 space-y-4">
              {swipesVandaag >= SWIPE_LIMIET && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 text-center">
                  <p className="text-amber-800 dark:text-amber-300 font-bold text-sm">
                    Je hebt je {SWIPE_LIMIET} gratis swipes voor vandaag gebruikt
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">Upgrade voor onbeperkt swipen</p>
                </div>
              )}

              <div className="space-y-3">
                {[
                  { icon: "all_inclusive", tekst: "Onbeperkt swipen elke dag" },
                  { icon: "search", tekst: "Zoekpagina volledig ontgrendeld" },
                  { icon: "notifications_active", tekst: "Zoekwaarschuwingen & alerts" },
                  { icon: "bolt", tekst: "Prioriteit in klantenservice" },
                ].map(v => (
                  <div key={v.icon} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <span className="material-icons-round text-amber-600 text-[18px]">{v.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{v.tekst}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <p className="text-3xl font-black text-slate-900 dark:text-white">€4,99</p>
                <p className="text-xs text-slate-400 font-medium">per maand · elk moment opzegbaar</p>
              </div>

              <button
                onClick={activeerPremium}
                disabled={premiumActiveren}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-base shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {premiumActiveren ? (
                  <span className="material-icons-round animate-spin text-sm">progress_activity</span>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Premium activeren
                  </>
                )}
              </button>

              <button
                onClick={() => setToonPremiumModal(false)}
                className="w-full text-center text-sm text-slate-400 font-medium py-2"
              >
                Misschien later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
