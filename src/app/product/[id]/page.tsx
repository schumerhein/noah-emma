"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Heart, ShieldCheck, Check, Flag, X, ChevronRight, TrendingDown, UserPlus, UserCheck, Pencil, Crown, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { AIModelDisplay } from "@/components/ai-models/NoahEmmaModel";
import Link from "next/link";

type Review = {
  id: string;
  reviewer_id: string;
  beoordeling: number;
  tekst: string | null;
  created_at: string;
  reviewer: { naam: string | null } | null;
};

type Listing = {
  id: string;
  titel: string;
  beschrijving: string | null;
  prijs: number;
  maat: string;
  conditie: string;
  categorie: string;
  subcategorie: string | null;
  merk: string | null;
  foto_urls: string[];
  likes: number;
  created_at: string;
  user_id: string;
  ai_model: "noah" | "emma" | null;
  gepromoot?: boolean;
  verzending_mogelijk?: boolean;
  verzendkosten?: number | null;
  profiles: {
    naam: string | null;
    stad: string | null;
    avatar_url: string | null;
    gemiddelde_beoordeling?: number | null;
    totaal_beoordelingen?: number | null;
    totaal_verkopen?: number | null;
    aantalvolgers?: number | null;
    lid_sinds?: string | null;
  } | null;
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  // Bieden
  const [toonBodModal, setToonBodModal] = useState(false);
  const [bodBedrag, setBodBedrag] = useState("");
  const [bodBezig, setBodBezig] = useState(false);
  const [bodVerstuurd, setBodVerstuurd] = useState(false);
  // Volgen
  const [volgt, setVolgt] = useState(false);
  // Melden
  const [toonMeldModal, setToonMeldModal] = useState(false);
  const [meldReden, setMeldReden] = useState("");
  const [meldBezig, setMeldBezig] = useState(false);
  const [gemeld, setGemeld] = useState(false);
  // Tabs
  const [actieveTab, setActieveTab] = useState<"verkoper" | "vergelijkbaar">("verkoper");
  const [meerVanVerkoper, setMeerVanVerkoper] = useState<{id:string;titel:string;prijs:number;foto_urls:string[];maat:string}[]>([]);
  const [vergelijkbaar, setVergelijkbaar] = useState<{id:string;titel:string;prijs:number;foto_urls:string[];maat:string}[]>([]);
  // Foto touch-swipe
  const fotoStartX = useRef(0);
  const fotoIsDragging = useRef(false);

  useEffect(() => {
    laadListing();
    checkIngelogd();
    laadReviews();
  }, [id]);

  const laadTabData = async (listing: Listing) => {
    const [{ data: verkoper }, { data: gelijk }] = await Promise.all([
      supabase.from("listings").select("id, titel, prijs, foto_urls, maat")
        .eq("user_id", listing.user_id).eq("actief", true).neq("id", listing.id).limit(6),
      supabase.from("listings").select("id, titel, prijs, foto_urls, maat")
        .eq("categorie", listing.categorie).eq("actief", true).neq("id", listing.id).limit(6),
    ]);
    if (verkoper) setMeerVanVerkoper(verkoper as typeof meerVanVerkoper);
    if (gelijk) setVergelijkbaar(gelijk as typeof vergelijkbaar);
  };

  const deelListing = async () => {
    if (!listing) return;
    const url = `${window.location.origin}/product/${listing.id}`;
    if (navigator.share) {
      await navigator.share({ title: listing.titel, text: `€${listing.prijs.toFixed(2).replace(".", ",")} — ${listing.titel}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link gekopieerd!" });
    }
  };

  const relatieveTijd = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    const uur = Math.floor(diff / 3600000);
    const dag = Math.floor(diff / 86400000);
    if (min < 60) return `${min} min. geleden`;
    if (uur < 24) return `${uur} uur geleden`;
    if (dag < 7) return `${dag} dag${dag !== 1 ? "en" : ""} geleden`;
    return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  };

  const laadReviews = async () => {
    // We laden reviews nadat we de listing hebben, dus eerst listing ophalen voor user_id
    const { data: listingData } = await supabase
      .from("listings")
      .select("user_id")
      .eq("id", id)
      .single();
    if (!listingData) return;

    const { data } = await supabase
      .from("reviews")
      .select("id, reviewer_id, beoordeling, tekst, created_at, reviewer:profiles!reviews_reviewer_id_fkey(naam)")
      .eq("reviewed_id", listingData.user_id)
      .order("created_at", { ascending: false })
      .limit(3);
    if (data) setReviews(data as unknown as Review[]);
  };

  const laadListing = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, profiles(naam, stad, avatar_url, gemiddelde_beoordeling, totaal_beoordelingen, totaal_verkopen, aantalvolgers, lid_sinds)")
      .eq("id", id)
      .single();

    if (!error && data) {
      const l = data as Listing;
      setListing(l);
      laadTabData(l);
    }
    setLoading(false);
  };

  const checkIngelogd = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const [{ data: fav }, listingRes] = await Promise.all([
        supabase.from("favorites").select("id").eq("user_id", user.id).eq("listing_id", id).maybeSingle(),
        supabase.from("listings").select("user_id").eq("id", id).single(),
      ]);
      if (fav) setIsLiked(true);
      // Check of volgt
      if (listingRes.data) {
        const { data: volgData } = await supabase.from("followers").select("id")
          .eq("follower_id", user.id).eq("following_id", listingRes.data.user_id).maybeSingle();
        if (volgData) setVolgt(true);
      }
    }
  };

  const toggleVolg = async () => {
    if (!currentUserId || !listing) return;
    if (volgt) {
      await supabase.from("followers").delete().eq("follower_id", currentUserId).eq("following_id", listing.user_id);
      setVolgt(false);
    } else {
      await supabase.from("followers").insert({ follower_id: currentUserId, following_id: listing.user_id });
      setVolgt(true);
    }
  };

  const toggleLike = async () => {
    if (!currentUserId) {
      toast({ title: "Log in om te liken", description: "Maak een account aan om producten op te slaan." });
      router.push("/login");
      return;
    }

    if (isLiked) {
      await supabase.from("favorites").delete().eq("user_id", currentUserId).eq("listing_id", id);
      setIsLiked(false);
    } else {
      await supabase.from("favorites").insert({ user_id: currentUserId, listing_id: id });
      setIsLiked(true);
      toast({
        title: "Toegevoegd aan favorieten",
        description: `${listing?.titel} is opgeslagen.`,
        action: <div className="bg-emerald-500 p-1 rounded-full"><Check className="w-4 h-4 text-white" /></div>,
      });
    }
  };

  const handleContact = async () => {
    if (!currentUserId) {
      toast({ title: "Log in om contact op te nemen" });
      router.push("/login");
      return;
    }
    if (!listing) return;
    if (currentUserId === listing.user_id) {
      toast({ title: "Dit is jouw eigen advertentie" });
      return;
    }
    // Stuur door naar berichtenpagina met verkoper info
    router.push(`/messages?verkoper=${listing.user_id}&listing=${listing.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 px-8 text-center">
        <span className="material-icons-round text-slate-300 text-6xl">search_off</span>
        <h2 className="text-xl font-bold text-slate-700">Product niet gevonden</h2>
        <button onClick={() => router.push("/")} className="text-primary font-bold">Terug naar home</button>
      </div>
    );
  }

  const verkoperNaam = listing.profiles?.naam || "Verkoper";
  const initials = verkoperNaam.charAt(0).toUpperCase();
  const datumGepost = new Date(listing.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  const eigenProduct = currentUserId === listing.user_id;

  const verstuurBod = async () => {
    const bedrag = parseFloat(bodBedrag.replace(",", "."));
    if (!bedrag || bedrag <= 0 || !currentUserId) return;
    setBodBezig(true);

    // Sla bod op in DB
    await supabase.from("biedingen").insert({
      listing_id: listing.id,
      bieder_id: currentUserId,
      bedrag,
    });

    // Stuur ook meteen een bericht naar de verkoper
    const { data: convData } = await supabase.from("conversations")
      .select("id")
      .or(`and(buyer_id.eq.${currentUserId},seller_id.eq.${listing.user_id}),and(buyer_id.eq.${listing.user_id},seller_id.eq.${currentUserId})`)
      .eq("listing_id", listing.id)
      .maybeSingle();

    let convId = convData?.id;
    if (!convId) {
      const { data: nieuw } = await supabase.from("conversations").insert({
        buyer_id: currentUserId,
        seller_id: listing.user_id,
        listing_id: listing.id,
      }).select("id").single();
      convId = nieuw?.id;
    }

    if (convId) {
      await supabase.from("messages").insert({
        conversation_id: convId,
        sender_id: currentUserId,
        tekst: `💸 Ik doe een bod van €${bedrag.toFixed(2).replace(".", ",")} voor "${listing.titel}". Is dit akkoord?`,
      });
      await supabase.from("conversations").update({
        last_message: `Bod: €${bedrag.toFixed(2).replace(".", ",")}`,
        last_message_at: new Date().toISOString(),
      }).eq("id", convId);
    }

    setBodBezig(false);
    setBodVerstuurd(true);
    setToonBodModal(false);
    toast({ title: `Bod van €${bedrag.toFixed(2).replace(".", ",")} verstuurd!`, description: "De verkoper ontvangt je bod via de chat." });
    if (convId) router.push(`/messages/${convId}`);
  };

  const verstuurMelding = async () => {
    if (!meldReden || !currentUserId) return;
    setMeldBezig(true);
    await supabase.from("reports").insert({ reporter_id: currentUserId, listing_id: listing.id, reden: meldReden });
    setMeldBezig(false);
    setGemeld(true);
    setToonMeldModal(false);
    toast({ title: "Melding ontvangen", description: "We bekijken deze advertentie zo snel mogelijk." });
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-48">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-40 px-4 h-16 flex justify-between items-center pointer-events-none pt-safe-top">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 shadow-sm pointer-events-auto backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button
          onClick={deelListing}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 shadow-sm pointer-events-auto backdrop-blur-sm"
        >
          <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
      </header>

      <main>
        {/* Foto's */}
        <div
          className="relative w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 overflow-hidden"
          onPointerDown={e => { fotoStartX.current = e.clientX; fotoIsDragging.current = true; }}
          onPointerUp={e => {
            if (!fotoIsDragging.current) return;
            fotoIsDragging.current = false;
            const diff = e.clientX - fotoStartX.current;
            if (diff < -50 && currentImageIndex < listing.foto_urls.length - 1) setCurrentImageIndex(i => i + 1);
            if (diff > 50 && currentImageIndex > 0) setCurrentImageIndex(i => i - 1);
          }}
        >
          {listing.ai_model ? (
            <AIModelDisplay
              naam={listing.ai_model}
              maat={listing.maat}
              kledingUrl={listing.foto_urls?.[0]}
            />
          ) : listing.foto_urls?.[currentImageIndex] ? (
            <Image src={listing.foto_urls[currentImageIndex]} alt={listing.titel} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-icons-round text-slate-300 text-6xl">image</span>
            </div>
          )}

          {/* Gepromoot badge */}
          {listing.gepromoot && (
            <div className="absolute top-16 left-4 z-10 flex items-center gap-1.5 bg-amber-500 px-3 py-1.5 rounded-full shadow-md">
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-black text-white uppercase tracking-wide">Gepromoot</span>
            </div>
          )}

          {listing.foto_urls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {listing.foto_urls.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={cn("w-2 h-2 rounded-full transition-all", currentImageIndex === idx ? "bg-white w-4" : "bg-white/40")} />
              ))}
            </div>
          )}

          <button
            onClick={toggleLike}
            className="absolute bottom-4 right-4 w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-10"
          >
            <Heart className={cn("w-7 h-7 transition-colors", isLiked ? "fill-primary text-primary" : "text-slate-300")} />
          </button>
        </div>

        <div className="px-5 pt-6 space-y-6">
          {/* Titel, prijs, maat, conditie */}
          <section className="space-y-4">
            {/* Populair badge */}
            {listing.likes > 2 && (
              <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl px-3 py-2">
                <span className="text-base">🔥</span>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Populair! {listing.likes} mensen liketen dit
                </p>
              </div>
            )}

            {/* Prijs — hero */}
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-primary leading-none">€{listing.prijs.toFixed(2).replace(".", ",")}</span>
            </div>

            {/* Titel */}
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">{listing.titel}</h1>

            {/* Maat + Conditie + Merk — prominente kaartjes */}
            <div className="flex gap-2">
              <Link href={`/search?maat=${listing.maat}`} className="flex-1">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700 active:bg-slate-100 transition-colors">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maat</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{listing.maat}</p>
                </div>
              </Link>
              <Link href={`/search?conditie=${encodeURIComponent(listing.conditie)}`} className="flex-1">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700 active:bg-slate-100 transition-colors">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staat</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 leading-tight">{listing.conditie}</p>
                </div>
              </Link>
              {listing.merk && (
                <Link href={`/search?merk=${encodeURIComponent(listing.merk)}`} className="flex-1">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700 active:bg-slate-100 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merk</p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 leading-tight">{listing.merk}</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Categorie + locatie + tijd */}
            <div className="flex flex-wrap items-center gap-2">
              {listing.categorie && (
                <Link href={`/search?categorie=${encodeURIComponent(listing.categorie)}`}>
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-primary active:bg-primary/20">
                    {listing.categorie}
                  </span>
                </Link>
              )}
              {listing.profiles?.stad && (
                <span className="text-xs text-slate-400">📍 {listing.profiles.stad}</span>
              )}
              <span className="text-xs text-slate-400">{relatieveTijd(listing.created_at)}</span>
            </div>
          </section>

          {/* Verkoper + Reviews */}
          <section className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">

            {/* Verkoper header */}
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Link href={`/seller/${listing.user_id}`} className="shrink-0">
                  {listing.profiles?.avatar_url ? (
                    <Image src={listing.profiles.avatar_url} alt={verkoperNaam} width={56} height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-black text-primary">
                      {initials}
                    </div>
                  )}
                </Link>

                {/* Naam + stats */}
                <div className="flex-1 min-w-0">
                  <Link href={`/seller/${listing.user_id}`}>
                    <h4 className="font-bold text-[16px] text-slate-900 dark:text-white leading-tight">{verkoperNaam}</h4>
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    {listing.profiles?.stad && (
                      <span className="text-xs text-slate-400">📍 {listing.profiles.stad}</span>
                    )}
                    {listing.profiles?.lid_sinds && (
                      <span className="text-xs text-slate-400">
                        Lid sinds {new Date(listing.profiles.lid_sinds).toLocaleDateString("nl-NL", { month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>

                  {/* Statistieken rij */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {listing.profiles?.gemiddelde_beoordeling ? (
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="font-black text-amber-700 dark:text-amber-400 text-sm">
                          {Number(listing.profiles.gemiddelde_beoordeling).toFixed(1)}
                        </span>
                        {listing.profiles.totaal_beoordelingen != null && (
                          <span className="text-[10px] text-amber-600/60">({listing.profiles.totaal_beoordelingen})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">Nieuw lid</span>
                    )}
                    {(listing.profiles?.totaal_verkopen ?? 0) > 0 && (
                      <span className="text-xs text-slate-500">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{listing.profiles!.totaal_verkopen}</span> verkopen
                      </span>
                    )}
                    {(listing.profiles?.aantalvolgers ?? 0) > 0 && (
                      <span className="text-xs text-slate-500">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{listing.profiles!.aantalvolgers}</span> volgers
                      </span>
                    )}
                  </div>
                </div>

                {/* Follow + chevron */}
                <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                  {!eigenProduct && (
                    <button
                      onClick={toggleVolg}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all",
                        volgt
                          ? "border-primary/30 text-primary bg-primary/10"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      )}
                    >
                      {volgt ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      {volgt ? "Volgend" : "Volgen"}
                    </button>
                  )}
                  <Link href={`/seller/${listing.user_id}`}>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Beoordelingen</p>
                  <Link href={`/seller/${listing.user_id}`}>
                    <span className="text-xs text-primary font-bold">Alle bekijken →</span>
                  </Link>
                </div>
                {reviews.map(review => (
                  <div key={review.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {(review.reviewer?.naam || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {review.reviewer?.naam || "Anoniem"}
                        </span>
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={s <= review.beoordeling ? "text-amber-400 text-xs" : "text-slate-200 dark:text-slate-600 text-xs"}>★</span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(review.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      {review.tekst && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{review.tekst}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Omschrijving */}
          {listing.beschrijving && (
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Omschrijving</h3>
              <p className={cn("text-[15px] leading-relaxed text-slate-700 dark:text-slate-300", !showFullDesc && "line-clamp-4")}>
                {listing.beschrijving}
              </p>
              {!showFullDesc && listing.beschrijving.length > 200 && (
                <button onClick={() => setShowFullDesc(true)} className="text-primary font-bold text-sm">Lees meer</button>
              )}
            </section>
          )}

          {/* Likes */}
          <div className="flex items-center gap-3 p-4 bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-2xl">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <p className="text-sm font-bold text-slate-700 dark:text-rose-100">
              Geliefd bij {isLiked ? listing.likes + 1 : listing.likes} ouders
            </p>
          </div>

          {/* Hoe werkt het */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/50 overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100">Hoe werkt kopen?</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Eenvoudig en veilig ophalen</p>
              </div>
            </div>
            <div className="px-5 pb-5 space-y-3">
              {[
                { nr: "1", tekst: "Stuur de verkoper een bericht via de chatknop" },
                { nr: "2", tekst: "Spreek samen een tijd en locatie af" },
                { nr: "3", tekst: "Betaal bij ophalen — cash of tikkie" },
              ].map(stap => (
                <div key={stap.nr} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-black text-white">{stap.nr}</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium leading-snug">{stap.tekst}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tabs: Meer van verkoper + Vergelijkbare artikelen */}
          <section className="space-y-4">
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              {(["verkoper", "vergelijkbaar"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActieveTab(tab)}
                  className={cn(
                    "flex-1 pb-3 text-sm font-bold transition-all border-b-2 -mb-px",
                    actieveTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-400"
                  )}
                >
                  {tab === "verkoper" ? "Meer van verkoper" : "Vergelijkbare artikelen"}
                </button>
              ))}
            </div>

            {actieveTab === "verkoper" && (
              meerVanVerkoper.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="material-icons-round text-slate-200 text-4xl">inventory_2</span>
                  <p className="text-slate-400 text-sm mt-2">Geen andere artikelen van deze verkoper</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {meerVanVerkoper.map(item => (
                    <Link key={item.id} href={`/product/${item.id}`}>
                      <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                          {item.foto_urls?.[0] ? (
                            <Image src={item.foto_urls[0]} alt={item.titel} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-icons-round text-slate-300 text-2xl">image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-1.5">
                          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{item.titel}</p>
                          <p className="text-[11px] font-black text-primary">€{item.prijs.toFixed(2).replace(".", ",")}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

            {actieveTab === "vergelijkbaar" && (
              vergelijkbaar.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="material-icons-round text-slate-200 text-4xl">search_off</span>
                  <p className="text-slate-400 text-sm mt-2">Geen vergelijkbare artikelen gevonden</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {vergelijkbaar.map(item => (
                    <Link key={item.id} href={`/product/${item.id}`}>
                      <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                          {item.foto_urls?.[0] ? (
                            <Image src={item.foto_urls[0]} alt={item.titel} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-icons-round text-slate-300 text-2xl">image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-1.5">
                          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{item.titel}</p>
                          <p className="text-[11px] font-black text-primary">€{item.prijs.toFixed(2).replace(".", ",")}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
          </section>

          {/* Meldknop */}
          {!eigenProduct && (
            <button
              onClick={() => setToonMeldModal(true)}
              className="flex items-center gap-2 text-slate-400 text-xs font-medium mx-auto"
            >
              <Flag className="w-3.5 h-3.5" />
              {gemeld ? "Advertentie gemeld" : "Advertentie rapporteren"}
            </button>
          )}
        </div>
      </main>

      {/* Actieknoppen */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-40">
        {eigenProduct ? (
          <div className="flex gap-3">
            <Link href={`/product/${listing.id}/edit`} className="flex-1">
              <button className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                <Pencil className="w-4 h-4" />
                Artikel aanpassen
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setToonBodModal(true)}
              className="flex items-center justify-center gap-2 h-14 px-4 rounded-2xl border-2 border-primary/30 text-primary font-bold text-sm bg-primary/5 active:scale-95 transition-transform shrink-0"
            >
              <TrendingDown className="w-4 h-4" />
              Bod
            </button>
            <Button
              onClick={handleContact}
              className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-icons-round">chat</span>
              <span>Stuur bericht</span>
            </Button>
          </div>
        )}
      </div>

      {/* Bod Modal */}
      {toonBodModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Doe een bod</h2>
                <p className="text-sm text-slate-400 mt-1">Vraagprijs: <strong className="text-primary">€{listing.prijs.toFixed(2).replace(".", ",")}</strong></p>
              </div>
              <button onClick={() => setToonBodModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">€</span>
              <input
                type="number"
                value={bodBedrag}
                onChange={e => setBodBedrag(e.target.value)}
                placeholder="0,00"
                className="w-full h-16 pl-10 pr-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-2xl font-black text-slate-900 dark:text-white focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Snelle bodopties */}
            <div className="flex gap-2">
              {[0.9, 0.8, 0.7].map(factor => (
                <button
                  key={factor}
                  onClick={() => setBodBedrag((listing.prijs * factor).toFixed(2))}
                  className="flex-1 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  -{Math.round((1 - factor) * 100)}%<br />
                  <span className="text-primary">€{(listing.prijs * factor).toFixed(2).replace(".", ",")}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setToonBodModal(false)} className="flex-1 h-13 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm">
                Annuleren
              </button>
              <button
                onClick={verstuurBod}
                disabled={!bodBedrag || bodBezig}
                className="flex-1 h-13 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {bodBezig ? <span className="material-icons-round animate-spin text-sm">progress_activity</span> : "Bod versturen"}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400">Je bod wordt als chatbericht verstuurd naar de verkoper</p>
          </div>
        </div>
      )}

      {/* Meld Modal */}
      {toonMeldModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Advertentie rapporteren</h2>
              <button onClick={() => setToonMeldModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-400">Waarom wil je deze advertentie melden?</p>

            <div className="space-y-2">
              {["Onjuiste of misleidende informatie", "Verboden artikel", "Gesponsord of spam", "Niet voor kinderen geschikt", "Oplichting of fraude", "Andere reden"].map(reden => (
                <button
                  key={reden}
                  onClick={() => setMeldReden(reden)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all",
                    meldReden === reden
                      ? "border-primary bg-primary/5 text-primary font-bold"
                      : "border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  )}
                >
                  {reden}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setToonMeldModal(false)} className="flex-1 h-12 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm">
                Annuleren
              </button>
              <button
                onClick={verstuurMelding}
                disabled={!meldReden || meldBezig}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {meldBezig ? "Bezig..." : "Melden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
