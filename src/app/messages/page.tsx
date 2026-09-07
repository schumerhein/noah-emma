"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageCircle, Heart, TrendingUp, UserPlus, Bell, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  last_message: string | null;
  last_message_at: string;
  created_at: string;
  other_user?: { naam: string | null; avatar_url: string | null };
  listing?: { titel: string; foto_urls: string[] } | null;
  unread?: boolean;
};

type Notificatie = {
  id: string;
  type: "favoriet" | "bod" | "volger" | "nieuwe_listing" | "zoekwaarschuwing";
  created_at: string;
  naam: string;
  avatar_url: string | null;
  titel?: string;
  foto_url?: string;
  bedrag?: number;
  listing_id?: string;
  zoekterm?: string;
};

type Tab = "berichten" | "notificaties";

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("berichten");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notificaties, setNotificaties] = useState<Notificatie[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [zoekterm, setZoekterm] = useState("");
  const [ongelezen, setOngelezen] = useState(0);
  const [nieuweNotifs, setNieuweNotifs] = useState(0);
  const [gezienTot, setGezienTot] = useState<string | null>(null);

  useEffect(() => { init(); }, []);

  // Live updates op de lijst: zonder dit verscheen een net binnengekomen
  // bericht pas na een handmatige herlaad-actie, terwijl de chatpagina zelf
  // wel realtime is.
  useEffect(() => {
    if (!currentUserId) return;

    const ververs = async (updated: { id: string; last_message: string | null; last_message_at: string; buyer_id: string; seller_id: string }) => {
      const { count } = await supabase.from("messages").select("*", { count: "exact", head: true })
        .eq("conversation_id", updated.id).eq("gelezen", false).neq("sender_id", currentUserId);
      setConversations(prev => {
        const bestaand = prev.find(c => c.id === updated.id);
        if (!bestaand) return prev; // nieuw gesprek: volgende volledige laadConversations() pakt 'm mee
        const merged: Conversation = { ...bestaand, last_message: updated.last_message, last_message_at: updated.last_message_at, unread: (count || 0) > 0 };
        const nieuweLijst = [merged, ...prev.filter(c => c.id !== updated.id)];
        setOngelezen(nieuweLijst.filter(c => c.unread).length);
        return nieuweLijst;
      });
    };

    const channel = supabase
      .channel(`inbox:${currentUserId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations", filter: `buyer_id=eq.${currentUserId}` }, (p) => ververs(p.new as never))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations", filter: `seller_id=eq.${currentUserId}` }, (p) => ververs(p.new as never))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations", filter: `buyer_id=eq.${currentUserId}` }, () => laadConversations(currentUserId))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations", filter: `seller_id=eq.${currentUserId}` }, () => laadConversations(currentUserId))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUserId]);

  const init = async () => {
    const verkoperId = searchParams.get("verkoper");
    const listingId = searchParams.get("listing");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setCurrentUserId(user.id);

    const { data: eigenProfiel } = await supabase.from("profiles").select("notificaties_gezien_tot").eq("id", user.id).single();
    const gezienTotWaarde = eigenProfiel?.notificaties_gezien_tot ?? null;
    setGezienTot(gezienTotWaarde);

    if (verkoperId && listingId && verkoperId !== user.id) {
      const { data: bestaand } = await supabase
        .from("conversations").select("id")
        .eq("buyer_id", user.id).eq("seller_id", verkoperId).eq("listing_id", listingId).single();

      if (bestaand) { router.replace(`/messages/${bestaand.id}`); return; }

      const { data: nieuw, error: insertError } = await supabase
        .from("conversations")
        .insert({ buyer_id: user.id, seller_id: verkoperId, listing_id: listingId })
        .select("id").single();

      if (nieuw) { router.replace(`/messages/${nieuw.id}`); return; }

      // Iemand anders (dubbele tap, ander tabblad) won de race en maakte
      // ondertussen al hetzelfde gesprek aan — pak dat gesprek dan alsnog.
      if (insertError?.code === "23505") {
        const { data: race } = await supabase
          .from("conversations").select("id")
          .eq("buyer_id", user.id).eq("seller_id", verkoperId).eq("listing_id", listingId).single();
        if (race) { router.replace(`/messages/${race.id}`); return; }
      }
    }

    laadConversations(user.id);
    laadNotificaties(user.id, gezienTotWaarde);
  };

  const laadConversations = async (userId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*, listing:listing_id(titel, foto_urls)")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (!error && data) {
      const otherIds = Array.from(new Set(data.map(c => c.buyer_id === userId ? c.seller_id : c.buyer_id)));
      const convIds = data.map(c => c.id);

      const [{ data: profielen }, { data: ongelezenBerichten }] = await Promise.all([
        otherIds.length > 0
          ? supabase.from("profiles").select("id, naam, avatar_url").in("id", otherIds)
          : Promise.resolve({ data: [] as { id: string; naam: string | null; avatar_url: string | null }[] }),
        convIds.length > 0
          ? supabase.from("messages").select("conversation_id").eq("gelezen", false).neq("sender_id", userId).in("conversation_id", convIds)
          : Promise.resolve({ data: [] as { conversation_id: string }[] }),
      ]);

      const profielMap = new Map((profielen || []).map(p => [p.id, p]));
      const ongelezenIds = new Set((ongelezenBerichten || []).map(m => m.conversation_id));

      const enriched = data.map((conv) => {
        const otherUserId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;
        return { ...conv, other_user: profielMap.get(otherUserId), unread: ongelezenIds.has(conv.id) };
      });
      setConversations(enriched as Conversation[]);
      setOngelezen(enriched.filter(c => c.unread).length);
    }
    setLoadingConvs(false);
  };

  const laadNotificaties = async (userId: string, gezienTotWaarde: string | null) => {
    // 1. Mijn listings ophalen
    const { data: myListings } = await supabase.from("listings").select("id").eq("user_id", userId);
    const myIds = myListings?.map((l: { id: string }) => l.id) || [];

    // Eigen privacyvoorkeur: wil ik weten wanneer iemand mijn artikel favoriet maakt?
    const { data: eigenProfiel } = await supabase.from("profiles").select("privacy_instellingen").eq("id", userId).single();
    const toonFavorietNotificaties = eigenProfiel?.privacy_instellingen?.favoriet_notificatie_verkoper !== false;

    // 2. Favorieten op mijn listings
    const favsPromise = (myIds.length > 0 && toonFavorietNotificaties)
      ? supabase.from("favorites").select("id, created_at, listing_id, listings(titel, foto_urls), user_id")
          .in("listing_id", myIds).neq("user_id", userId).order("created_at", { ascending: false }).limit(30)
      : Promise.resolve({ data: null });

    // 3. Biedingen op mijn listings
    const bidsPromise = myIds.length > 0
      ? supabase.from("biedingen").select("id, created_at, listing_id, bedrag, bieder_id, listings(titel, foto_urls)")
          .in("listing_id", myIds).neq("bieder_id", userId).order("created_at", { ascending: false }).limit(20)
      : Promise.resolve({ data: null });

    // 4. Nieuwe volgers (mensen die mij volgen)
    const volgersPromise = supabase.from("followers").select("id, created_at, follower_id")
      .eq("following_id", userId).order("created_at", { ascending: false }).limit(20);

    // 5. Verkopers die ik volg, en hun nieuwe listings van de laatste 30 dagen
    const volgendPromise = supabase.from("followers").select("following_id").eq("follower_id", userId);

    const [{ data: favs }, { data: bids }, { data: volgers }, { data: volgend }] = await Promise.all([
      favsPromise, bidsPromise, volgersPromise, volgendPromise,
    ]);

    const volgendeIds = volgend?.map((v: { following_id: string }) => v.following_id) || [];
    const dertigDagenGeleden = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: nieuweLijsten } = volgendeIds.length > 0
      ? await supabase.from("listings").select("id, created_at, titel, foto_urls, user_id")
          .in("user_id", volgendeIds).eq("actief", true).gte("created_at", dertigDagenGeleden)
          .order("created_at", { ascending: false }).limit(25)
      : { data: null };

    // Alle benodigde profiel-ids in één keer ophalen i.p.v. per notificatie
    // een aparte round-trip (dat liep bij veel activiteit flink op).
    const profielIds = new Set<string>();
    (favs || []).forEach(f => profielIds.add(f.user_id));
    (bids || []).forEach(b => profielIds.add(b.bieder_id));
    (volgers || []).forEach(v => profielIds.add(v.follower_id));
    (nieuweLijsten || []).forEach(l => profielIds.add(l.user_id));

    const { data: profielen } = profielIds.size > 0
      ? await supabase.from("profiles").select("id, naam, avatar_url").in("id", Array.from(profielIds))
      : { data: [] as { id: string; naam: string | null; avatar_url: string | null }[] };
    const profielMap = new Map((profielen || []).map(p => [p.id, p]));

    const alleNotifs: Notificatie[] = [];

    for (const fav of favs || []) {
      const profiel = profielMap.get(fav.user_id);
      const listing = fav.listings as unknown as { titel: string; foto_urls: string[] } | null;
      alleNotifs.push({
        id: `fav_${fav.id}`,
        type: "favoriet",
        created_at: fav.created_at,
        naam: profiel?.naam || "Iemand",
        avatar_url: profiel?.avatar_url || null,
        titel: listing?.titel,
        foto_url: listing?.foto_urls?.[0],
        listing_id: fav.listing_id,
      });
    }

    for (const bid of bids || []) {
      const profiel = profielMap.get(bid.bieder_id);
      const listing = bid.listings as unknown as { titel: string; foto_urls: string[] } | null;
      alleNotifs.push({
        id: `bid_${bid.id}`,
        type: "bod",
        created_at: bid.created_at,
        naam: profiel?.naam || "Iemand",
        avatar_url: profiel?.avatar_url || null,
        titel: listing?.titel,
        foto_url: listing?.foto_urls?.[0],
        bedrag: bid.bedrag,
        listing_id: bid.listing_id,
      });
    }

    for (const v of volgers || []) {
      const profiel = profielMap.get(v.follower_id);
      alleNotifs.push({
        id: `volg_${v.id}`,
        type: "volger",
        created_at: v.created_at,
        naam: profiel?.naam || "Iemand",
        avatar_url: profiel?.avatar_url || null,
      });
    }

    for (const listing of nieuweLijsten || []) {
      const profiel = profielMap.get(listing.user_id);
      alleNotifs.push({
        id: `listing_${listing.id}`,
        type: "nieuwe_listing",
        created_at: listing.created_at,
        naam: profiel?.naam || "Iemand",
        avatar_url: profiel?.avatar_url || null,
        titel: listing.titel,
        foto_url: listing.foto_urls?.[0],
        listing_id: listing.id,
      });
    }

    // 6. Nieuwe artikelen die passen bij mijn zoekwaarschuwingen
    const { data: waarschuwingen } = await supabase
      .from("zoekwaarschuwingen")
      .select("id, zoekterm, max_prijs, created_at")
      .eq("user_id", userId);

    if (waarschuwingen) {
      for (const w of waarschuwingen) {
        let matchQuery = supabase
          .from("listings")
          .select("id, created_at, titel, foto_urls, user_id")
          .eq("actief", true)
          .neq("user_id", userId)
          .gt("created_at", w.created_at)
          .or(`titel.ilike.%${w.zoekterm}%,beschrijving.ilike.%${w.zoekterm}%,merk.ilike.%${w.zoekterm}%,categorie.ilike.%${w.zoekterm}%`)
          .order("created_at", { ascending: false })
          .limit(10);
        if (w.max_prijs) matchQuery = matchQuery.lte("prijs", w.max_prijs);

        const { data: matches } = await matchQuery;
        if (matches) {
          for (const listing of matches) {
            alleNotifs.push({
              id: `zoek_${w.id}_${listing.id}`,
              type: "zoekwaarschuwing",
              created_at: listing.created_at,
              naam: "Zoekwaarschuwing",
              avatar_url: null,
              titel: listing.titel,
              zoekterm: w.zoekterm,
              foto_url: listing.foto_urls?.[0],
              listing_id: listing.id,
            });
          }
        }
      }
    }

    // Sorteer op datum
    alleNotifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setNotificaties(alleNotifs);
    // Alleen meldingen na het laatste bezoek aan deze tab tellen als "nieuw" —
    // anders bleef het badge-cijfer voor altijd op het totale aantal staan.
    const gezienTotTijd = gezienTotWaarde ? new Date(gezienTotWaarde).getTime() : 0;
    const nieuw = alleNotifs.filter(n => new Date(n.created_at).getTime() > gezienTotTijd).length;
    setNieuweNotifs(Math.min(nieuw, 99));
    setLoadingNotifs(false);
  };

  const markeerNotificatiesGezien = async () => {
    if (!currentUserId || nieuweNotifs === 0) return;
    const nu = new Date().toISOString();
    setGezienTot(nu);
    setNieuweNotifs(0);
    await supabase.from("profiles").update({ notificaties_gezien_tot: nu }).eq("id", currentUserId);
  };

  const gefilterd = conversations.filter(c =>
    !zoekterm ||
    (c.other_user?.naam || "").toLowerCase().includes(zoekterm.toLowerCase()) ||
    (c.listing?.titel || "").toLowerCase().includes(zoekterm.toLowerCase())
  );

  const formatTijd = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m`;
    if (hrs < 24) return `${hrs}u`;
    if (days === 1) return "Gister";
    if (days < 7) return d.toLocaleDateString("nl-NL", { weekday: "short" });
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  };

  const notifIconColor: Record<Notificatie["type"], string> = {
    favoriet: "bg-red-100 text-red-500",
    bod: "bg-emerald-100 text-emerald-600",
    volger: "bg-blue-100 text-blue-500",
    nieuwe_listing: "bg-amber-100 text-amber-600",
    zoekwaarschuwing: "bg-violet-100 text-violet-600",
  };

  const notifTekst = (n: Notificatie) => {
    if (n.type === "favoriet") return `heeft "${n.titel}" aan favorieten toegevoegd`;
    if (n.type === "bod") return `heeft een bod van €${n.bedrag?.toFixed(2).replace(".", ",")} gedaan op "${n.titel}"`;
    if (n.type === "nieuwe_listing") return `heeft een nieuw artikel geplaatst: "${n.titel}"`;
    if (n.type === "zoekwaarschuwing") return `nieuw artikel voor "${n.zoekterm}": "${n.titel}"`;
    return "volgt je nu";
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="px-6 pt-14 pb-2 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-[800] tracking-tight text-slate-800 dark:text-slate-100">Inbox</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setTab("berichten")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
              tab === "berichten"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            Berichten
            {ongelezen > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                {ongelezen}
              </span>
            )}
          </button>
          <button
            onClick={() => { setTab("notificaties"); markeerNotificatiesGezien(); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
              tab === "notificaties"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400"
            )}
          >
            <Bell className="w-4 h-4" />
            Notificaties
            {nieuweNotifs > 0 && tab !== "notificaties" && (
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                {nieuweNotifs > 9 ? "9+" : nieuweNotifs}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── TAB: Berichten ── */}
      {tab === "berichten" && (
        <main className="px-6 pt-3 space-y-3">
          <div className="relative mb-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={zoekterm}
              onChange={e => setZoekterm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-primary transition-all"
              placeholder="Zoek in gesprekken..."
            />
          </div>

          {loadingConvs && (
            <div className="flex justify-center py-16">
              <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
            </div>
          )}

          {!loadingConvs && gefilterd.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Geen berichten</h2>
              <p className="text-slate-400 text-sm max-w-xs">Contacteer een verkoper via een productpagina om een gesprek te starten.</p>
              <Link href="/" className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">
                Producten ontdekken
              </Link>
            </div>
          )}

          {!loadingConvs && gefilterd.map(conv => {
            const naam = conv.other_user?.naam || "Gebruiker";
            return (
              <div
                key={conv.id}
                onClick={() => router.push(`/messages/${conv.id}`)}
                className={cn(
                  "bg-white dark:bg-slate-800/40 p-4 rounded-2xl flex gap-4 items-center border shadow-sm cursor-pointer active:scale-[0.98] transition-transform",
                  conv.unread ? "border-primary/20 bg-primary/5 dark:bg-primary/10" : "border-slate-100 dark:border-slate-800"
                )}
              >
                <div className="relative shrink-0">
                  {conv.other_user?.avatar_url ? (
                    <Image src={conv.other_user.avatar_url} alt={naam} width={56} height={56} className="w-14 h-14 rounded-full object-cover border-2 border-primary/10" />
                  ) : (
                    <Avatar className="w-14 h-14 border-2 border-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{naam.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  {conv.unread && (
                    <div className="absolute top-0 -right-1 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={cn("text-[15px] truncate", conv.unread ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300")}>
                      {naam}
                    </h3>
                    <span className={cn("text-[11px] shrink-0 ml-2", conv.unread ? "text-primary font-bold" : "text-slate-400 font-medium")}>
                      {formatTijd(conv.last_message_at)}
                    </span>
                  </div>
                  <p className={cn("text-[13px] truncate mb-1.5", conv.unread ? "font-bold text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400")}>
                    {conv.last_message || "Gesprek gestart"}
                  </p>
                  {conv.listing?.titel && (
                    <span className="text-[11px] font-medium text-slate-400 truncate tracking-tight">
                      📦 {conv.listing.titel}
                    </span>
                  )}
                </div>

                {conv.listing?.foto_urls?.[0] && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={conv.listing.foto_urls[0]} alt={conv.listing.titel} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            );
          })}
        </main>
      )}

      {/* ── TAB: Notificaties ── */}
      {tab === "notificaties" && (
        <main className="pt-3">
          {loadingNotifs && (
            <div className="flex justify-center py-16">
              <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
            </div>
          )}

          {!loadingNotifs && notificaties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bell className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Geen notificaties</h2>
              <p className="text-slate-400 text-sm max-w-xs">
                Je ziet hier meldingen zodra iemand jouw artikel als favoriet markeert, een bod doet, jou volgt, een verkoper die jij volgt iets nieuws plaatst, of er een artikel verschijnt dat past bij een zoekwaarschuwing.
              </p>
            </div>
          )}

          {!loadingNotifs && notificaties.map(notif => (
            <div
              key={notif.id}
              onClick={() => notif.listing_id ? router.push(`/product/${notif.listing_id}`) : undefined}
              className={cn(
                "flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors",
                notif.listing_id ? "cursor-pointer" : ""
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {notif.avatar_url ? (
                  <Image src={notif.avatar_url} alt={notif.naam} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                    {notif.naam.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Type icoon */}
                <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900", notifIconColor[notif.type])}>
                  {notif.type === "favoriet" && <Heart className="w-2.5 h-2.5 fill-current" />}
                  {notif.type === "bod" && <TrendingUp className="w-2.5 h-2.5" />}
                  {notif.type === "volger" && <UserPlus className="w-2.5 h-2.5" />}
                  {notif.type === "nieuwe_listing" && <Package className="w-2.5 h-2.5" />}
                  {notif.type === "zoekwaarschuwing" && <Bell className="w-2.5 h-2.5" />}
                </div>
              </div>

              {/* Tekst */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-slate-800 dark:text-white leading-snug">
                  <span className="font-bold">{notif.naam}</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">{notifTekst(notif)}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{formatTijd(notif.created_at)}</p>
              </div>

              {/* Foto van artikel */}
              {notif.foto_url && (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                  <Image src={notif.foto_url} alt={notif.titel || ""} width={48} height={48} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </main>
      )}
    </div>
  );
}
