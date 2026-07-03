"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star, Package, Heart, MapPin, Calendar, UserPlus, UserCheck, Flag, Ban, X, MoreVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { filterZichtbaar } from "@/lib/zichtbaarheid";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type SellerProfile = {
  id: string;
  naam: string | null;
  stad: string | null;
  bio: string | null;
  avatar_url: string | null;
  gemiddelde_beoordeling: number | null;
  totaal_verkopen: number | null;
  aantalvolgers: number | null;
  lid_sinds: string | null;
  vakantiestand: boolean;
};

type Listing = {
  id: string;
  titel: string;
  prijs: number;
  maat: string;
  foto_urls: string[];
  likes: number;
};

type Review = {
  id: string;
  beoordeling: number;
  tekst: string | null;
  created_at: string;
  reviewer: { naam: string | null } | null;
};

export default function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [volgt, setVolgt] = useState(false);
  const [volgBezig, setVolgBezig] = useState(false);
  const [tab, setTab] = useState<"items" | "reviews">("items");
  const { toast } = useToast();

  // Blokkeren & melden
  const [toonActieMenu, setToonActieMenu] = useState(false);
  const [geblokkeerd, setGeblokkeerd] = useState(false);
  const [blokkeerBezig, setBlokkeerBezig] = useState(false);
  const [toonMeldModal, setToonMeldModal] = useState(false);
  const [meldReden, setMeldReden] = useState<string | null>(null);
  const [meldBezig, setMeldBezig] = useState(false);
  const [gemeld, setGemeld] = useState(false);

  useEffect(() => {
    laadAlles();
  }, [id]);

  const laadAlles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const [profileRes, listingsRes, reviewsRes] = await Promise.all([
      supabase.from("profiles").select("id, naam, stad, bio, avatar_url, gemiddelde_beoordeling, totaal_verkopen, aantalvolgers, lid_sinds, vakantiestand").eq("id", id).single(),
      supabase.from("listings").select("*").eq("user_id", id).eq("actief", true).order("created_at", { ascending: false }),
      supabase.from("reviews").select("id, beoordeling, tekst, created_at, reviewer:profiles!reviews_reviewer_id_fkey(naam)").eq("reviewed_id", id).order("created_at", { ascending: false }),
    ]);

    if (profileRes.data) setSeller(profileRes.data as SellerProfile);
    if (listingsRes.data) setListings(filterZichtbaar(listingsRes.data as (Listing & { user_id?: string; moderatie_status?: string })[], new Set(), user?.id));
    if (reviewsRes.data) setReviews(reviewsRes.data as unknown as Review[]);

    // Check of al volgend + of geblokkeerd
    if (user) {
      const [volgRes, blokRes] = await Promise.all([
        supabase.from("followers").select("id").eq("follower_id", user.id).eq("following_id", id).maybeSingle(),
        supabase.from("blocks").select("id").eq("blokkeerder_id", user.id).eq("geblokkeerd_id", id).maybeSingle(),
      ]);
      if (volgRes.data) setVolgt(true);
      if (blokRes.data) setGeblokkeerd(true);
    }

    setLoading(false);
  };

  const toggleVolg = async () => {
    if (!currentUserId) { router.push("/login"); return; }
    setVolgBezig(true);

    if (volgt) {
      await supabase.from("followers").delete().eq("follower_id", currentUserId).eq("following_id", id);
      setSeller(prev => prev ? { ...prev, aantalvolgers: Math.max(0, (prev.aantalvolgers || 1) - 1) } : prev);
      setVolgt(false);
    } else {
      await supabase.from("followers").insert({ follower_id: currentUserId, following_id: id });
      setSeller(prev => prev ? { ...prev, aantalvolgers: (prev.aantalvolgers || 0) + 1 } : prev);
      setVolgt(true);
    }
    setVolgBezig(false);
  };

  // Verkoper blokkeren of deblokkeren
  const toggleBlokkeer = async () => {
    if (!currentUserId) { router.push("/login"); return; }
    setBlokkeerBezig(true);

    if (geblokkeerd) {
      await supabase.from("blocks").delete().eq("blokkeerder_id", currentUserId).eq("geblokkeerd_id", id);
      setGeblokkeerd(false);
      toast({ title: "Gebruiker gedeblokkeerd" });
    } else {
      await supabase.from("blocks").insert({ blokkeerder_id: currentUserId, geblokkeerd_id: id });
      // Bij blokkeren ook ontvolgen
      if (volgt) {
        await supabase.from("followers").delete().eq("follower_id", currentUserId).eq("following_id", id);
        setVolgt(false);
        setSeller(prev => prev ? { ...prev, aantalvolgers: Math.max(0, (prev.aantalvolgers || 1) - 1) } : prev);
      }
      setGeblokkeerd(true);
      toast({ title: "Gebruiker geblokkeerd", description: "Beheer geblokkeerde gebruikers via Instellingen → Geblokkeerd." });
    }
    setBlokkeerBezig(false);
    setToonActieMenu(false);
  };

  // Verkoper melden
  const verstuurMelding = async () => {
    if (!meldReden || !currentUserId) return;
    setMeldBezig(true);
    await supabase.from("reports").insert({ reporter_id: currentUserId, reported_user_id: id, reden: meldReden });
    setMeldBezig(false);
    setGemeld(true);
    setToonMeldModal(false);
    toast({ title: "Melding ontvangen", description: "We bekijken deze gebruiker zo snel mogelijk." });
  };

  const isEigenProfiel = currentUserId === id;
  const initials = (seller?.naam || "?").charAt(0).toUpperCase();
  const lidJaar = seller?.lid_sinds ? new Date(seller.lid_sinds).getFullYear() : new Date().getFullYear();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
        <span className="material-icons-round text-slate-300 text-6xl">person_off</span>
        <h2 className="text-xl font-bold text-slate-700">Gebruiker niet gevonden</h2>
        <button onClick={() => router.back()} className="text-primary font-bold">Terug</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display pb-32">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 pt-14 pb-4 px-5 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="font-extrabold text-slate-900 dark:text-white text-base truncate mx-3 flex-1 text-center">
          {seller.naam || "Verkoper"}
        </h1>
        {!isEigenProfiel ? (
          <button
            onClick={() => setToonActieMenu(true)}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
          >
            <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {/* Geblokkeerd banner */}
      {geblokkeerd && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 px-5 py-3 flex items-center gap-3">
          <Ban className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700 dark:text-red-300 flex-1">Je hebt deze gebruiker geblokkeerd.</p>
          <button onClick={toggleBlokkeer} disabled={blokkeerBezig} className="text-xs font-bold text-red-500 underline shrink-0">
            Deblokkeer
          </button>
        </div>
      )}

      {/* Profiel blok */}
      <div className="bg-white dark:bg-slate-900 px-5 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">

        {/* Vakantiestand banner */}
        {seller.vakantiestand && (
          <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="material-icons-round text-amber-500 text-xl">beach_access</span>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{seller.naam} is tijdelijk op vakantie en reageert mogelijk later.</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary border-4 border-primary/10 shrink-0">
            {seller.avatar_url ? (
              <Image src={seller.avatar_url} alt={seller.naam || ""} width={80} height={80} className="rounded-full object-cover w-20 h-20" />
            ) : (
              initials
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">{seller.naam || "Gebruiker"}</h2>
            {seller.stad && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">{seller.stad}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {seller.gemiddelde_beoordeling ? (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{Number(seller.gemiddelde_beoordeling).toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({reviews.length})</span>
                </div>
              ) : null}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">Lid sinds {lidJaar}</span>
              </div>
            </div>
          </div>
        </div>

        {seller.bio && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{seller.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{listings.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actief</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{seller.totaal_verkopen || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verkopen</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{seller.aantalvolgers || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volgers</p>
          </div>
        </div>

        {/* Acties */}
        {!isEigenProfiel && (
          <button
            onClick={toggleVolg}
            disabled={volgBezig}
            className={cn(
              "w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
              volgt
                ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700"
                : "bg-primary text-white shadow-lg shadow-primary/20"
            )}
          >
            {volgt ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {volgt ? "Volgend" : `Volg ${seller.naam || "verkoper"}`}
          </button>
        )}

        {isEigenProfiel && (
          <Link href="/profile">
            <div className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-sm flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="material-icons-round text-sm">edit</span>
              Profiel bewerken
            </div>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-5">
        <button
          onClick={() => setTab("items")}
          className={cn("flex-1 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2",
            tab === "items" ? "border-primary text-primary" : "border-transparent text-slate-400")}
        >
          <Package className="w-4 h-4" />
          Items ({listings.length})
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={cn("flex-1 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2",
            tab === "reviews" ? "border-amber-400 text-amber-600" : "border-transparent text-slate-400")}
        >
          <Star className="w-4 h-4" />
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Listings tab */}
      {tab === "items" && (
        <div className="px-4 pt-4">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Package className="w-10 h-10 text-slate-200" />
              <p className="font-bold text-slate-500">Geen actieve advertenties</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {listings.map(item => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-transform">
                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                      {item.foto_urls?.[0] ? (
                        <Image src={item.foto_urls[0]} alt={item.titel} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-icons-round text-slate-300 text-3xl">image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-slate-700 dark:text-white line-clamp-1">{item.titel}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-black text-sm text-primary">€{item.prijs.toFixed(2).replace(".", ",")}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Maat {item.maat}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-slate-400">
                        <Heart className="w-3 h-3" />
                        <span className="text-[10px]">{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews tab */}
      {tab === "reviews" && (
        <div className="px-4 pt-4 space-y-3">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Star className="w-10 h-10 text-slate-200" />
              <p className="font-bold text-slate-500">Nog geen beoordelingen</p>
            </div>
          ) : (
            <>
              {/* Gemiddelde */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 flex items-center gap-4 mb-2">
                <div className="text-center">
                  <p className="text-4xl font-black text-amber-600">{Number(seller.gemiddelde_beoordeling || 0).toFixed(1)}</p>
                  <div className="flex justify-center mt-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={s <= Math.round(seller.gemiddelde_beoordeling || 0) ? "text-amber-400" : "text-slate-200"}>★</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">{reviews.length} {reviews.length === 1 ? "beoordeling" : "beoordelingen"}</p>
                  <p className="text-xs text-amber-600/70 mt-0.5">Gemiddelde score</p>
                </div>
              </div>

              {reviews.map(review => (
                <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">
                        {(review.reviewer?.naam || "?").charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{review.reviewer?.naam || "Anoniem"}</p>
                    </div>
                    <div className="flex shrink-0">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={cn("text-sm", s <= review.beoordeling ? "text-amber-400" : "text-slate-200")}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.tekst && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">"{review.tekst}"</p>
                  )}
                  <p className="text-[10px] text-slate-300 pl-11">
                    {new Date(review.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Actiemenu (melden / blokkeren) */}
      {toonActieMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8" onClick={() => setToonActieMenu(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-4 space-y-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { setToonActieMenu(false); setToonMeldModal(true); }}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 active:scale-[0.98] transition-all"
            >
              <Flag className="w-4 h-4 text-slate-400" />
              {gemeld ? "Gebruiker gemeld" : "Gebruiker melden"}
            </button>
            <button
              onClick={toggleBlokkeer}
              disabled={blokkeerBezig}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left font-bold text-sm text-red-500 bg-red-50 dark:bg-red-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Ban className="w-4 h-4" />
              {blokkeerBezig ? "Bezig..." : geblokkeerd ? "Deblokkeer gebruiker" : "Blokkeer gebruiker"}
            </button>
            <button
              onClick={() => setToonActieMenu(false)}
              className="w-full px-4 py-4 rounded-2xl font-bold text-sm text-slate-400 text-center"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Meld Modal */}
      {toonMeldModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Gebruiker melden</h2>
              <button onClick={() => setToonMeldModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-400">Waarom wil je {seller.naam || "deze gebruiker"} melden?</p>

            <div className="space-y-2">
              {["Verdacht of oplichting", "Ongepast gedrag in chat", "Verkoopt verboden artikelen", "Nepaccount of spam", "Plaatst foto's van kinderen", "Andere reden"].map(reden => (
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
