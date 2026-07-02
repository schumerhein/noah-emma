"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, SquarePen, MessageCircle, Heart, TrendingUp, UserPlus, Bell, Package } from "lucide-react";
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
  type: "favoriet" | "bod" | "volger" | "nieuwe_listing";
  created_at: string;
  naam: string;
  avatar_url: string | null;
  titel?: string;
  foto_url?: string;
  bedrag?: number;
  listing_id?: string;
};

type Tab = "berichten" | "notificaties";

export default function MessagesPage() {
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

  useEffect(() => { init(); }, []);

  const init = async () => {
    const verkoperId = searchParams.get("verkoper");
    const listingId = searchParams.get("listing");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setCurrentUserId(user.id);

    if (verkoperId && listingId && verkoperId !== user.id) {
      const { data: bestaand } = await supabase
        .from("conversations").select("id")
        .eq("buyer_id", user.id).eq("seller_id", verkoperId).eq("listing_id", listingId).single();

      if (bestaand) { router.replace(`/messages/${bestaand.id}`); return; }
      else {
        const { data: nieuw } = await supabase
          .from("conversations")
          .insert({ buyer_id: user.id, seller_id: verkoperId, listing_id: listingId })
          .select("id").single();
        if (nieuw) { router.replace(`/messages/${nieuw.id}`); return; }
      }
    }

    laadConversations(user.id);
    laadNotificaties(user.id);
  };

  const laadConversations = async (userId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*, listing:listing_id(titel, foto_urls)")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (!error && data) {
      let totalUnread = 0;
      const enriched = await Promise.all(data.map(async (conv) => {
        const otherUserId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;
        const { data: profile } = await supabase.from("profiles").select("naam, avatar_url").eq("id", otherUserId).single();
        const { count } = await supabase.from("messages").select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id).eq("gelezen", false).neq("sender_id", userId);
        if ((count || 0) > 0) totalUnread++;
        return { ...conv, other_user: profile, unread: (count || 0) > 0 };
      }));
      setConversations(enriched as Conversation[]);
      setOngelezen(totalUnread);
    }
    setLoadingConvs(false);
  };

  const laadNotificaties = async (userId: string) => {
    const alleNotifs: Notificatie[] = [];

    // 1. Mijn listings ophalen
    const { data: myListings } = await supabase.from("listings").select("id").eq("user_id", userId);
    const myIds = myListings?.map((l: { id: string }) => l.id) || [];

    // 2. Favorieten op mijn listings
    if (myIds.length > 0) {
      const { data: favs } = await supabase
        .from("favorites")
        .select("id, created_at, listing_id, listings(titel, foto_urls), user_id")
        .in("listing_id", myIds)
        .neq("user_id", userId) // eigen likes niet als notificatie tonen
        .order("created_at", { ascending: false })
        .limit(30);

      if (favs) {
        for (const fav of favs) {
          const { data: profiel } = await supabase.from("profiles").select("naam, avatar_url").eq("id", fav.user_id).single();
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
      }

      // 3. Biedingen op mijn listings
      const { data: bids } = await supabase
        .from("biedingen")
        .select("id, created_at, listing_id, bedrag, bieder_id, listings(titel, foto_urls)")
        .in("listing_id", myIds)
        .neq("bieder_id", userId) // eigen biedingen niet als notificatie tonen
        .order("created_at", { ascending: false })
        .limit(20);

      if (bids) {
        for (const bid of bids) {
          const { data: profiel } = await supabase.from("profiles").select("naam, avatar_url").eq("id", bid.bieder_id).single();
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
      }
    }

    // 4. Nieuwe volgers (mensen die mij volgen)
    const { data: volgers } = await supabase
      .from("followers")
      .select("id, created_at, follower_id")
      .eq("following_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (volgers) {
      for (const v of volgers) {
        const { data: profiel } = await supabase.from("profiles").select("naam, avatar_url").eq("id", v.follower_id).single();
        alleNotifs.push({
          id: `volg_${v.id}`,
          type: "volger",
          created_at: v.created_at,
          naam: profiel?.naam || "Iemand",
          avatar_url: profiel?.avatar_url || null,
        });
      }
    }

    // 5. Nieuwe listings van verkopers die ik volg
    const { data: volgend } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", userId);

    const volgendeIds = volgend?.map((v: { following_id: string }) => v.following_id) || [];

    if (volgendeIds.length > 0) {
      const dertigDagenGeleden = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: nieuweLijsten } = await supabase
        .from("listings")
        .select("id, created_at, titel, foto_urls, user_id")
        .in("user_id", volgendeIds)
        .eq("actief", true)
        .gte("created_at", dertigDagenGeleden)
        .order("created_at", { ascending: false })
        .limit(25);

      if (nieuweLijsten) {
        for (const listing of nieuweLijsten) {
          const { data: profiel } = await supabase.from("profiles").select("naam, avatar_url").eq("id", listing.user_id).single();
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
      }
    }

    // Sorteer op datum
    alleNotifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setNotificaties(alleNotifs);
    setNieuweNotifs(Math.min(alleNotifs.length, 99));
    setLoadingNotifs(false);
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
  };

  const notifTekst = (n: Notificatie) => {
    if (n.type === "favoriet") return `heeft "${n.titel}" aan favorieten toegevoegd`;
    if (n.type === "bod") return `heeft een bod van €${n.bedrag?.toFixed(2).replace(".", ",")} gedaan op "${n.titel}"`;
    if (n.type === "nieuwe_listing") return `heeft een nieuw artikel geplaatst: "${n.titel}"`;
    return "volgt je nu";
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="px-6 pt-14 pb-2 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-[800] tracking-tight text-slate-800 dark:text-slate-100">Inbox</h1>
          <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark active:scale-95 transition-transform">
            <SquarePen className="w-5 h-5" />
          </button>
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
            onClick={() => setTab("notificaties")}
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
                Je ziet hier meldingen zodra iemand jouw artikel als favoriet markeert, een bod doet, jou volgt, of een verkoper die jij volgt iets nieuws plaatst.
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
