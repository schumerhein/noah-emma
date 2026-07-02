"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ChevronRight, Baby, Edit2, LogOut, Bell, Package, Star, Plus, X, Check, Settings, Umbrella,
  HelpCircle, Headphones, Gift, Sliders, FileText, Cookie, CheckCircle2
} from "lucide-react";
import { slaActiefKindOp, leesActiefKind } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
  naam: string | null;
  stad: string | null;
  bio: string | null;
  avatar_url: string | null;
  totaal_verkopen: number | null;
  gemiddelde_beoordeling: number | null;
  lid_sinds: string | null;
  vakantiestand: boolean | null;
};

type Kind = {
  id: string;
  naam: string | null;
  geboortedatum: string;
  lengte: number | null;
  maat: string | null;
  geslacht: string | null;
};

type Listing = {
  id: string;
  titel: string;
  prijs: number;
  foto_urls: string[];
  conditie: string;
  actief: boolean;
  likes: number;
};

type Favoriet = {
  id: string;
  listing_id: string;
  listings: Listing | null;
};

type Review = {
  id: string;
  reviewer_id: string;
  beoordeling: number;
  tekst: string | null;
  created_at: string;
  reviewer: { naam: string | null } | null;
  listings: { titel: string | null } | null;
};

function berekenLeeftijd(geboortedatum: string): string {
  const geb = new Date(geboortedatum);
  const nu = new Date();
  const maanden = (nu.getFullYear() - geb.getFullYear()) * 12 + (nu.getMonth() - geb.getMonth());
  if (maanden < 24) return `${maanden} mnd`;
  return `${Math.floor(maanden / 12)} jaar`;
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [kinderen, setKinderen] = useState<Kind[]>([]);
  const [mijneItems, setMijneItems] = useState<Listing[]>([]);
  const [favorieten, setFavorieten] = useState<Favoriet[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [maatBewerken, setMaatBewerken] = useState<string | null>(null); // id van kind dat bewerkt wordt
  const [nieuweMaat, setNieuweMaat] = useState("");
  const [actieveTab, setActieveTab] = useState<"items" | "favorieten" | "reviews">("favorieten");
  const [vakantiestand, setVakantiestand] = useState(false);
  const [actiefKindId, setActiefKindId] = useState<string | null>(null);
  const [bewerken, setBewerken] = useState(false);
  const [bewerktNaam, setBewerktNaam] = useState("");
  const [bewerktStad, setBewerktStad] = useState("");
  const [bewerktBio, setBewerktBio] = useState("");
  const [opslaan, setOpslaan] = useState(false);
  const [avatarUploaden, setAvatarUploaden] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    laadProfiel();
    // Lees actief kind uit localStorage
    const actief = leesActiefKind();
    if (actief) setActiefKindId(actief.id);

    // Herlaad favorieten bij kindwissel
    const onWissel = (e: Event) => {
      const nieuwKind = (e as CustomEvent<{ id: string }>).detail;
      setActiefKindId(nieuwKind.id);
      laadFavorieten(nieuwKind.id);
    };
    window.addEventListener("kind-gewisseld", onWissel);
    return () => window.removeEventListener("kind-gewisseld", onWissel);
  }, []);

  const laadFavorieten = async (kindId: string | null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let query = supabase
      .from("favorites")
      .select("id, listing_id, listings(id, titel, prijs, foto_urls, conditie, actief, likes)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (kindId) query = query.eq("kind_id", kindId);
    const { data } = await query;
    if (data) setFavorieten(data as unknown as Favoriet[]);
  };

  const laadProfiel = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Bepaal actief kind voor favorieten filter
    const actief = leesActiefKind();
    const actiefId = actief?.id ?? null;

    const [profileRes, kinderenRes, itemsRes, favorietenRes, reviewsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("children").select("id, naam, geboortedatum, lengte, maat, geslacht").eq("user_id", user.id).order("created_at"),
      supabase.from("listings").select("id, titel, prijs, foto_urls, conditie, actief, likes")
        .eq("user_id", user.id).order("created_at", { ascending: false }),
      (() => {
        let q = supabase
          .from("favorites")
          .select("id, listing_id, listings(id, titel, prijs, foto_urls, conditie, actief, likes)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (actiefId) q = q.eq("kind_id", actiefId);
        return q;
      })(),
      supabase.from("reviews")
        .select("id, reviewer_id, beoordeling, tekst, created_at, reviewer:profiles!reviews_reviewer_id_fkey(naam), listings(titel)")
        .eq("reviewed_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setBewerktNaam(profileRes.data.naam || "");
      setBewerktStad(profileRes.data.stad || "");
      setBewerktBio(profileRes.data.bio || "");
      setVakantiestand(profileRes.data.vakantiestand === true);
    }
    if (kinderenRes.data) {
      setKinderen(kinderenRes.data);
      // Stel actief kind in als er nog geen is
      const opgeslagen = leesActiefKind();
      if (!opgeslagen && kinderenRes.data.length > 0) {
        const eerste = kinderenRes.data[0];
        slaActiefKindOp({ id: eerste.id, naam: eerste.naam, maat: eerste.maat || "86", geslacht: eerste.geslacht });
        setActiefKindId(eerste.id);
      } else if (opgeslagen) {
        setActiefKindId(opgeslagen.id);
      }
    }
    if (itemsRes.data) setMijneItems(itemsRes.data);
    if (favorietenRes.data) setFavorieten(favorietenRes.data as unknown as Favoriet[]);
    if (reviewsRes.data) setReviews(reviewsRes.data as unknown as Review[]);
    setLoading(false);
  };

  const slaProfielOp = async () => {
    if (!profile) return;
    setOpslaan(true);
    await supabase.from("profiles").update({
      naam: bewerktNaam,
      stad: bewerktStad,
      bio: bewerktBio,
    }).eq("id", profile.id);
    setProfile(prev => prev ? { ...prev, naam: bewerktNaam, stad: bewerktStad, bio: bewerktBio } : prev);
    setBewerken(false);
    setOpslaan(false);
    toast({ title: "Profiel opgeslagen ✓" });
  };

  const verwijderFavoriet = async (favorietId: string) => {
    await supabase.from("favorites").delete().eq("id", favorietId);
    setFavorieten(prev => prev.filter(f => f.id !== favorietId));
  };

  const toggleVakantiestand = async (aan: boolean) => {
    if (!profile) return;
    setVakantiestand(aan);
    await supabase.from("profiles").update({ vakantiestand: aan }).eq("id", profile.id);
    toast({ title: aan ? "🌴 Vakantiestand ingeschakeld" : "Vakantiestand uitgeschakeld" });
  };

  const uitloggen = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const selecteerKind = (kind: Kind) => {
    const actiefKind = { id: kind.id, naam: kind.naam, maat: kind.maat || "86", geslacht: kind.geslacht };
    slaActiefKindOp(actiefKind);
    setActiefKindId(kind.id);
    laadFavorieten(kind.id);
    toast({ title: `${kind.naam || "Kind"} geselecteerd ✓` });
  };

  const slaKindMaatOp = async (kindId: string, maat: string) => {
    await supabase.from("children").update({ maat }).eq("id", kindId);
    const bijgewerkt = kinderen.map(k => k.id === kindId ? { ...k, maat } : k);
    setKinderen(bijgewerkt);
    setMaatBewerken(null);
    // Als dit het actieve kind is, update ook localStorage
    if (kindId === actiefKindId) {
      const kind = bijgewerkt.find(k => k.id === kindId);
      if (kind) slaActiefKindOp({ id: kind.id, naam: kind.naam, maat, geslacht: kind.geslacht });
    }
    toast({ title: `Maat bijgewerkt naar ${maat} ✓` });
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setAvatarUploaden(true);

    const ext = file.name.split(".").pop();
    const pad = `${profile.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(pad, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast({ title: "Upload mislukt", description: uploadError.message });
      setAvatarUploaden(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(pad);
    const url = `${publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
    setProfile(prev => prev ? { ...prev, avatar_url: url } : prev);
    toast({ title: "Profielfoto bijgewerkt ✓" });
    setAvatarUploaden(false);
  };

  const toggleListingActief = async (listing: Listing) => {
    await supabase.from("listings").update({ actief: !listing.actief }).eq("id", listing.id);
    setMijneItems(prev => prev.map(l => l.id === listing.id ? { ...l, actief: !l.actief } : l));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center bg-white dark:bg-slate-900">
        <span className="text-5xl">👤</span>
        <h2 className="text-xl font-bold">Niet ingelogd</h2>
        <Link href="/login" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Inloggen</Link>
      </div>
    );
  }

  const initialen = (profile.naam || "U").charAt(0).toUpperCase();
  const actieveItems = mijneItems.filter(i => i.actief);
  const lidSinds = profile.lid_sinds ? new Date(profile.lid_sinds).getFullYear() : new Date().getFullYear();

  return (
    <div className="bg-background min-h-screen pb-36">
      {/* Header */}
      <header className="px-6 pt-14 pb-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full shrink-0 group"
            >
              <Avatar className="w-20 h-20 border-4 border-primary/20 shadow-md">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.naam || ""} fill className="object-cover rounded-full" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">{initialen}</AvatarFallback>
                )}
              </Avatar>
              {/* Camera overlay */}
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {avatarUploaden
                  ? <span className="material-icons-round text-white text-xl animate-spin">progress_activity</span>
                  : <span className="material-icons-round text-white text-xl">photo_camera</span>
                }
              </div>
              {/* Camera badge */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="material-icons-round text-white text-[12px]">photo_camera</span>
              </div>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
            />
            <div>
              {bewerken ? (
                <input
                  value={bewerktNaam}
                  onChange={e => setBewerktNaam(e.target.value)}
                  className="font-black text-xl text-slate-900 dark:text-white bg-transparent border-b-2 border-primary outline-none w-full"
                  placeholder="Jouw naam"
                />
              ) : (
                <h1 className="font-black text-xl text-slate-900 dark:text-white">{profile.naam || "Gebruiker"}</h1>
              )}
              <div className="flex items-center gap-2 mt-1">
                {profile.gemiddelde_beoordeling && profile.gemiddelde_beoordeling > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{profile.gemiddelde_beoordeling.toFixed(1)}</span>
                  </div>
                ) : null}
                <span className="text-xs text-slate-400">Lid sinds {lidSinds}</span>
              </div>
              {bewerken ? (
                <input
                  value={bewerktStad}
                  onChange={e => setBewerktStad(e.target.value)}
                  className="text-xs text-slate-400 bg-transparent border-b border-slate-200 outline-none mt-1"
                  placeholder="Stad"
                />
              ) : profile.stad ? (
                <p className="text-xs text-slate-400 mt-1">📍 {profile.stad}</p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-2">
            {bewerken ? (
              <>
                <button onClick={() => setBewerken(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
                <button onClick={slaProfielOp} disabled={opslaan} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </button>
              </>
            ) : (
              <button onClick={() => setBewerken(true)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Edit2 className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {bewerken ? (
          <textarea
            value={bewerktBio}
            onChange={e => setBewerktBio(e.target.value)}
            className="w-full text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 outline-none resize-none"
            placeholder="Schrijf iets over jezelf..."
            rows={2}
          />
        ) : profile.bio ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{profile.bio}</p>
        ) : null}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{actieveItems.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actief</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{profile.totaal_verkopen || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verkopen</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{favorieten.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opgeslagen</p>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {/* Kinderen */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Mijn kinderen</h2>
            <Link href="/onboarding/kind" className="flex items-center gap-1 text-xs font-bold text-primary">
              <Plus className="w-3.5 h-3.5" /> Kind toevoegen
            </Link>
          </div>

          {kinderen.length === 0 ? (
            <Link href="/onboarding/kind">
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-5 flex items-center gap-4 bg-primary/5 active:scale-[0.98] transition-transform">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">Voeg je kind toe</p>
                  <p className="text-xs text-slate-400">Voor automatisch filteren op de juiste maat</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="space-y-3">
              {kinderen.map(kind => {
                const isActief = kind.id === actiefKindId || (!actiefKindId && kinderen[0]?.id === kind.id);
                const geslachtEmoji = kind.geslacht === "meisje" ? "👧" : kind.geslacht === "jongen" ? "👦" : "🧒";
                return (
                  <div key={kind.id} className={cn(
                    "bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 transition-all",
                    isActief ? "border-primary shadow-md shadow-primary/10" : "border-slate-100 dark:border-slate-700"
                  )}>
                    <div className="p-4 flex items-center gap-3">
                      {/* Geslacht avatar */}
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0",
                        isActief ? "bg-primary/15" : "bg-slate-100 dark:bg-slate-700"
                      )}>
                        {geslachtEmoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-white">{kind.naam || "Kind"}</p>
                          {isActief && (
                            <span className="text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Actief
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {berekenLeeftijd(kind.geboortedatum)} · {kind.geslacht === "meisje" ? "Meisje" : kind.geslacht === "jongen" ? "Jongen" : "Onbekend"}
                        </p>
                      </div>

                      {/* Maat + acties */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("text-xl font-black", isActief ? "text-primary" : "text-slate-400")}>{kind.maat}</span>
                        <Link href={`/kind/${kind.id}/edit`}>
                          <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="material-icons-round text-slate-500 text-sm">edit</span>
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Selecteer knop (als niet actief) */}
                    {!isActief && (
                      <div className="px-4 pb-3">
                        <button
                          onClick={() => selecteerKind(kind)}
                          className="w-full h-9 rounded-xl border-2 border-primary/30 text-primary font-bold text-sm flex items-center justify-center gap-1.5 active:bg-primary/5 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Schakel naar {kind.naam || "dit kind"}
                        </button>
                      </div>
                    )}

                    {/* Inline maatpicker */}
                    {maatBewerken === kind.id && (
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kies de juiste maat</p>
                        <div className="grid grid-cols-5 gap-1.5">
                          {["50","56","62","68","74","80","86","92","98","104","110","116","122","128","134"].map(m => (
                            <button
                              key={m}
                              onClick={() => setNieuweMaat(m)}
                              className={cn(
                                "py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                                nieuweMaat === m
                                  ? "bg-primary text-white border-primary shadow-sm"
                                  : "bg-slate-50 dark:bg-slate-700 text-slate-500 border-transparent"
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setMaatBewerken(null)} className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm">
                            Annuleren
                          </button>
                          <button
                            onClick={() => slaKindMaatOp(kind.id, nieuweMaat)}
                            disabled={!nieuweMaat || nieuweMaat === kind.maat}
                            className="flex-1 h-10 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40"
                          >
                            Opslaan — Maat {nieuweMaat}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Mijn items / Favorieten / Reviews tabs */}
        <section className="space-y-4">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button onClick={() => setActieveTab("favorieten")}
              className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                actieveTab === "favorieten" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400")}>
              <Heart className={cn("w-3.5 h-3.5", actieveTab === "favorieten" ? "fill-primary text-primary" : "")} />
              <span>Opgeslagen</span>
              {favorieten.length > 0 && (
                <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-full", actieveTab === "favorieten" ? "bg-primary text-white" : "bg-slate-300 text-slate-600")}>
                  {favorieten.length}
                </span>
              )}
            </button>
            <button onClick={() => setActieveTab("items")}
              className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                actieveTab === "items" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400")}>
              <Package className={cn("w-3.5 h-3.5", actieveTab === "items" ? "text-primary" : "")} />
              <span>Mijn items</span>
              {mijneItems.length > 0 && (
                <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-full", actieveTab === "items" ? "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white" : "bg-slate-300 text-slate-600")}>
                  {mijneItems.length}
                </span>
              )}
            </button>
            <button onClick={() => setActieveTab("reviews")}
              className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                actieveTab === "reviews" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400")}>
              <Star className={cn("w-3.5 h-3.5", actieveTab === "reviews" ? "fill-amber-400 text-amber-400" : "")} />
              <span>Reviews</span>
              {reviews.length > 0 && (
                <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-full", actieveTab === "reviews" ? "bg-amber-400 text-white" : "bg-slate-300 text-slate-600")}>
                  {reviews.length}
                </span>
              )}
            </button>
          </div>

          {actieveTab === "items" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{actieveItems.length} actief</p>
                <Link href="/sell" className="text-xs font-bold text-primary flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Nieuw item
                </Link>
              </div>

              {mijneItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="text-5xl">📦</span>
                  <p className="font-bold text-slate-600 dark:text-slate-300">Nog geen items geplaatst</p>
                  <Link href="/sell" className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                    Eerste item plaatsen
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {mijneItems.map(item => (
                    <div key={item.id} className={cn("bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border shadow-sm relative",
                      item.actief ? "border-slate-100 dark:border-slate-700" : "border-slate-200 dark:border-slate-600 opacity-60")}>
                      <Link href={`/product/${item.id}/edit`}>
                        <div className="relative aspect-square bg-slate-100">
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
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-black text-sm text-primary">€{item.prijs.toFixed(2).replace(".", ",")}</span>
                            <div className="flex items-center gap-1 text-slate-400">
                              <Heart className="w-3 h-3" />
                              <span className="text-[10px]">{item.likes}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <button onClick={() => toggleListingActief(item)}
                        className={cn("absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full",
                          item.actief ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                        {item.actief ? "Actief" : "Verborgen"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {actieveTab === "reviews" && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-amber-200" />
                  </div>
                  <p className="font-bold text-slate-600 dark:text-slate-300">Nog geen beoordelingen</p>
                  <p className="text-sm text-slate-400">Na een transactie kunnen kopers en verkopers<br />elkaar een beoordeling geven.</p>
                </div>
              ) : (
                <>
                  {/* Overzicht sterren */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-black text-amber-600">
                        {profile.gemiddelde_beoordeling ? Number(profile.gemiddelde_beoordeling).toFixed(1) : "—"}
                      </p>
                      <div className="flex justify-center mt-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={s <= Math.round(profile.gemiddelde_beoordeling || 0) ? "text-amber-400" : "text-slate-200"}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">{reviews.length} {reviews.length === 1 ? "beoordeling" : "beoordelingen"}</p>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">Gemiddelde van alle reviews</p>
                    </div>
                  </div>

                  {/* Individuele reviews */}
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0">
                            {(review.reviewer?.naam || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                              {review.reviewer?.naam || "Anoniem"}
                            </p>
                            {review.listings?.titel && (
                              <p className="text-[10px] text-slate-400 truncate">Over: {review.listings.titel}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={cn("text-sm", s <= review.beoordeling ? "text-amber-400" : "text-slate-200")}>★</span>
                          ))}
                        </div>
                      </div>
                      {review.tekst && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-12">
                          "{review.tekst}"
                        </p>
                      )}
                      <p className="text-[10px] text-slate-300 pl-12">
                        {new Date(review.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {actieveTab === "favorieten" && (
            <div>
              {favorieten.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 text-primary/40" />
                  </div>
                  <p className="font-bold text-slate-600 dark:text-slate-300">Nog niets opgeslagen</p>
                  <div className="space-y-2 text-sm text-slate-400 max-w-xs mx-auto">
                    <p>💛 Swipe rechts op de homepage om producten op te slaan</p>
                    <p>🤍 Of tik op het hartje op een productpagina</p>
                  </div>
                  <Link href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm mt-2">
                    Producten ontdekken
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {favorieten.map(fav => {
                    const item = fav.listings;
                    if (!item) return null;
                    return (
                      <div key={fav.id} className="relative">
                        <Link href={`/product/${fav.listing_id}`}>
                          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="relative aspect-square bg-slate-100">
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
                              <span className="font-black text-sm text-primary">€{item.prijs.toFixed(2).replace(".", ",")}</span>
                            </div>
                          </div>
                        </Link>
                        <button onClick={() => verwijderFavoriet(fav.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm">
                          <X className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Account menu */}
        <section className="space-y-2 pb-4">
          {/* Primaire acties */}
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 pb-1">Mijn account</h2>
          {[
            { icon: <Bell className="w-5 h-5" />, label: "Notificaties", href: "/notificaties" },
            { icon: <Package className="w-5 h-5" />, label: "Bestellingen", href: "/orders" },
            { icon: <Settings className="w-5 h-5" />, label: "Instellingen", href: "/instellingen" },
          ].map(({ icon, label, href }) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  {icon}
                </div>
                <span className="flex-1 font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ))}

          {/* Ontdekken & personaliseren */}
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 pt-4 pb-1">Ontdekken</h2>
          {[
            { icon: <Sliders className="w-5 h-5" />, label: "Personaliseer je feed", href: "/feed-voorkeuren", sub: "Categorieën, merken en leden" },
            { icon: <Gift className="w-5 h-5" />, label: "Doneer aan een goed doel", href: "/donaties", sub: "Een deel van je opbrengst doneren" },
          ].map(({ icon, label, href, sub }) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">{label}</span>
                  <span className="text-xs text-slate-400">{sub}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ))}

          {/* Help */}
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 pt-4 pb-1">Hulp</h2>
          {[
            { icon: <HelpCircle className="w-5 h-5" />, label: "Veelgestelde vragen", href: "/faq", sub: "Antwoorden op je vragen" },
            { icon: <Headphones className="w-5 h-5" />, label: "Helpdesk", href: "/helpdesk", sub: "Neem contact op met ons" },
          ].map(({ icon, label, href, sub }) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">{label}</span>
                  <span className="text-xs text-slate-400">{sub}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ))}

          {/* Juridisch & info */}
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 pt-4 pb-1">Info</h2>
          {[
            { icon: <FileText className="w-5 h-5" />, label: "Wettelijke gegevens", href: "/wettelijk", sub: "Voorwaarden en privacy" },
            { icon: <Cookie className="w-5 h-5" />, label: "Mijn voorkeuren", href: "/voorkeuren", sub: "Cookievoorkeuren beheren" },
          ].map(({ icon, label, href, sub }) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">{label}</span>
                  <span className="text-xs text-slate-400">{sub}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ))}

          {/* Vakantiestand */}
          <div className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border transition-all",
            vakantiestand
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              vakantiestand ? "bg-amber-100 dark:bg-amber-800" : "bg-slate-100 dark:bg-slate-700"
            )}>
              <Umbrella className={cn("w-5 h-5", vakantiestand ? "text-amber-600" : "text-slate-500")} />
            </div>
            <div className="flex-1">
              <p className={cn("font-semibold text-sm", vakantiestand ? "text-amber-800 dark:text-amber-200" : "text-slate-700 dark:text-slate-200")}>
                Vakantiestand
              </p>
              <p className="text-xs text-slate-400">Jouw advertenties zijn tijdelijk niet zichtbaar</p>
            </div>
            <Switch
              checked={vakantiestand}
              onCheckedChange={toggleVakantiestand}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          <button onClick={uitloggen} className="w-full flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 active:scale-[0.98] transition-transform mt-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold text-red-600 dark:text-red-400">Uitloggen</span>
          </button>
        </section>
      </main>
    </div>
  );
}
