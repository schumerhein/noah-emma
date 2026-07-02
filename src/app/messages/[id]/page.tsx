"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Send, ShieldCheck, Star, CheckCircle, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  tekst: string;
  gelezen: boolean;
  created_at: string;
};

type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  afgerond: boolean;
  afgerond_at: string | null;
  afgerond_door: string | null;
  listing?: {
    id: string;
    titel: string;
    prijs: number;
    foto_urls: string[];
    actief: boolean;
    user_id: string;
  } | null;
  other_user?: { naam: string | null; avatar_url: string | null; gemiddelde_beoordeling?: number };
};

export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [nieuwBericht, setNieuwBericht] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [toonDealModal, setToonDealModal] = useState(false);
  const [dealBezig, setDealBezig] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setCurrentUserId(user.id);

    // Laad conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("*, listing:listing_id(id, titel, prijs, foto_urls, actief, user_id)")
      .eq("id", id)
      .single();

    if (!conv) { router.push("/messages"); return; }

    // Andere gebruiker ophalen
    const other = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
    setOtherUserId(other);

    const { data: profile } = await supabase
      .from("profiles")
      .select("naam, avatar_url, gemiddelde_beoordeling")
      .eq("id", other)
      .single();

    setConversation({ ...conv, other_user: profile });

    // Laad berichten
    await laadBerichten();

    // Markeer berichten als gelezen
    await supabase
      .from("messages")
      .update({ gelezen: true })
      .eq("conversation_id", id)
      .neq("sender_id", user.id);

    setLoading(false);

    // Realtime subscriptie
    const channel = supabase
      .channel(`messages:${id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        if ((payload.new as Message).sender_id !== user.id) {
          supabase.from("messages").update({ gelezen: true }).eq("id", payload.new.id);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const laadBerichten = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (data) setMessages(data as Message[]);
  };

  const verstuurBericht = async () => {
    if (!nieuwBericht.trim() || !currentUserId || sending) return;
    setSending(true);
    const tekst = nieuwBericht.trim();
    setNieuwBericht("");

    const { data: msg } = await supabase
      .from("messages")
      .insert({ conversation_id: id, sender_id: currentUserId, tekst })
      .select()
      .single();

    await supabase
      .from("conversations")
      .update({ last_message: tekst, last_message_at: new Date().toISOString() })
      .eq("id", id);

    if (msg) setMessages(prev => [...prev, msg as Message]);
    setSending(false);
  };

  const ronDealAf = async () => {
    if (!conversation || !currentUserId) return;
    setDealBezig(true);

    const nu = new Date().toISOString();

    // Markeer gesprek als afgerond
    await supabase.from("conversations").update({
      afgerond: true,
      afgerond_at: nu,
      afgerond_door: currentUserId,
    }).eq("id", id);

    // Zet listing op inactief (verkocht)
    if (conversation.listing?.id) {
      await supabase.from("listings").update({ actief: false }).eq("id", conversation.listing.id);
    }

    // Verhoog de verkoopteller van de verkoper
    const { data: profiel } = await supabase.from("profiles").select("totaal_verkopen").eq("id", currentUserId).single();
    await supabase.from("profiles").update({ totaal_verkopen: (profiel?.totaal_verkopen || 0) + 1 }).eq("id", currentUserId);

    // Stuur een systeembericht in het gesprek
    await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: currentUserId,
      tekst: "🎉 Deal gesloten! Het product is als verkocht gemarkeerd. Jullie kunnen elkaar nu een beoordeling geven.",
    });

    setConversation(prev => prev ? { ...prev, afgerond: true, afgerond_at: nu } : prev);
    setDealBezig(false);
    setToonDealModal(false);
    await laadBerichten();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      verstuurBericht();
    }
  };

  const formatTijd = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDatum = (dateStr: string) => {
    const d = new Date(dateStr);
    const nu = new Date();
    if (d.toDateString() === nu.toDateString()) return "Vandaag";
    const gister = new Date(nu); gister.setDate(nu.getDate() - 1);
    if (d.toDateString() === gister.toDateString()) return "Gisteren";
    return d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
  };

  const naam = conversation?.other_user?.naam || "Gebruiker";
  const initials = naam.charAt(0).toUpperCase();
  const isVerkoper = currentUserId === conversation?.listing?.user_id;
  const dealAfgerond = conversation?.afgerond === true;

  // Groepeer berichten per dag
  const berichtenPerDag: { datum: string; berichten: Message[] }[] = [];
  for (const msg of messages) {
    const dag = new Date(msg.created_at).toDateString();
    const laatste = berichtenPerDag[berichtenPerDag.length - 1];
    if (!laatste || laatste.datum !== dag) {
      berichtenPerDag.push({ datum: dag, berichten: [msg] });
    } else {
      laatste.berichten.push(msg);
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-background-dark font-display min-h-screen flex flex-col max-w-md mx-auto h-screen">

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 pt-14 pb-3 border-b border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.back()} className="p-1 -ml-1 text-slate-500 shrink-0">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Avatar className="w-10 h-10 border border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="font-bold text-[16px] leading-tight text-slate-900 dark:text-white truncate">{naam}</h1>
            {conversation?.other_user?.gemiddelde_beoordeling ? (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-[11px] font-bold text-slate-500">{Number(conversation.other_user.gemiddelde_beoordeling).toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">Actief op Noah & Emma</span>
            )}
          </div>
        </div>

        {/* Knop verkopen afronden (alleen zichtbaar voor verkoper, als deal nog niet afgerond) */}
        {isVerkoper && !dealAfgerond && conversation?.listing && (
          <button
            onClick={() => setToonDealModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verkocht</span>
          </button>
        )}
      </nav>

      {/* Product context banner */}
      {conversation?.listing && (
        <Link href={`/product/${conversation.listing.id}`} className="block shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
            {conversation.listing.foto_urls?.[0] && (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                <Image src={conversation.listing.foto_urls[0]} alt={conversation.listing.titel} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{conversation.listing.titel}</p>
              <p className="text-primary font-black text-base">€{conversation.listing.prijs.toFixed(2).replace(".", ",")}</p>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-full shrink-0",
              dealAfgerond
                ? "bg-slate-100 text-slate-500"
                : conversation.listing.actief
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
            )}>
              {dealAfgerond ? "Verkocht" : conversation.listing.actief ? "Beschikbaar" : "Niet beschikbaar"}
            </span>
          </div>
        </Link>
      )}

      {/* Deal afgerond banner + review knop */}
      {dealAfgerond && otherUserId && (
        <div className="shrink-0 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800/30 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Deal gesloten {conversation?.afgerond_at
                ? `op ${new Date(conversation.afgerond_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}`
                : ""}
            </p>
          </div>
          <button
            onClick={() => router.push(`/reviews/schrijf?user=${otherUserId}&listing=${conversation?.listing?.id}&conv=${id}`)}
            className="w-full flex items-center justify-center gap-2 bg-amber-400 text-white font-bold text-sm py-2.5 rounded-xl active:scale-[0.98] transition-transform"
          >
            <Star className="w-4 h-4 fill-white" />
            Geef {naam} een beoordeling
          </button>
        </div>
      )}

      {/* Berichten */}
      <main className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading && (
          <div className="flex justify-center py-10">
            <span className="material-icons-round text-primary animate-spin text-3xl">progress_activity</span>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">👋</span>
            </div>
            <p className="font-bold text-slate-700 dark:text-slate-200">Begin het gesprek!</p>
            <p className="text-sm text-slate-400">Stel je vraag over het product of maak een afspraak.</p>
          </div>
        )}

        {berichtenPerDag.map(({ datum, berichten }) => (
          <div key={datum} className="space-y-2">
            <div className="flex justify-center py-3">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">
                {formatDatum(berichten[0].created_at)}
              </span>
            </div>

            {berichten.map((msg, idx) => {
              const isEigen = msg.sender_id === currentUserId;
              const vorige = idx > 0 ? berichten[idx - 1] : null;
              const zelfdeSturen = vorige?.sender_id === msg.sender_id;
              // Systeemberichten (deal gesloten)
              const isSysteemBericht = msg.tekst.startsWith("🎉 Deal gesloten");

              if (isSysteemBericht) {
                return (
                  <div key={msg.id} className="flex justify-center py-2">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-4 py-2 rounded-full text-center max-w-[85%]">
                      {msg.tekst}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={cn("flex", isEigen ? "justify-end" : "justify-start", zelfdeSturen ? "mt-0.5" : "mt-3")}>
                  {!isEigen && !zelfdeSturen && (
                    <Avatar className="w-7 h-7 mr-2 mt-auto shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                  )}
                  {!isEigen && zelfdeSturen && <div className="w-9" />}

                  <div className={cn(
                    "max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed",
                    isEigen
                      ? "bg-primary text-white rounded-2xl rounded-br-sm"
                      : "bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-zinc-700",
                  )}>
                    <p>{msg.tekst}</p>
                    <p className={cn("text-[10px] mt-1", isEigen ? "text-white/60 text-right" : "text-slate-400")}>
                      {formatTijd(msg.created_at)}
                      {isEigen && <span className="ml-1">{msg.gelezen ? "✓✓" : "✓"}</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </main>

      {/* Veiligheidsmelding */}
      <div className="px-4 py-2 shrink-0 bg-slate-50 dark:bg-zinc-900">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <p className="text-[11px]">Spreek zelf af voor ophalen of verzending. Betaal nooit vooraf via een onbekende link.</p>
        </div>
      </div>

      {/* Input (uitgeschakeld als deal afgerond) */}
      <footer className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 shrink-0 pb-36">
        <div className="flex items-center gap-3">
          <div className={cn("flex-1 rounded-2xl px-4 py-3 flex items-center", dealAfgerond ? "bg-slate-100 dark:bg-zinc-800 opacity-60" : "bg-slate-100 dark:bg-zinc-800")}>
            <input
              value={nieuwBericht}
              onChange={e => setNieuwBericht(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={dealAfgerond}
              className="bg-transparent border-none focus:outline-none text-[15px] w-full placeholder:text-slate-400 text-slate-800 dark:text-white disabled:cursor-not-allowed"
              placeholder={dealAfgerond ? "Deal afgesloten" : "Stuur een bericht..."}
            />
          </div>
          <button
            onClick={verstuurBericht}
            disabled={!nieuwBericht.trim() || sending || dealAfgerond}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0 active:scale-95 transition-transform disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Deal afronden modal */}
      {toonDealModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <button onClick={() => setToonDealModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Verkoop afronden?</h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Bevestig dat je het product hebt verkocht aan <strong>{naam}</strong>. De advertentie wordt automatisch op <em>verkocht</em> gezet en jullie kunnen elkaar daarna een beoordeling geven.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex gap-3 items-center">
              {conversation?.listing?.foto_urls?.[0] && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image src={conversation.listing.foto_urls[0]} alt="" fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">{conversation?.listing?.titel}</p>
                <p className="text-primary font-black">€{conversation?.listing?.prijs.toFixed(2).replace(".", ",")}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setToonDealModal(false)}
                className="flex-1 h-13 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm"
              >
                Annuleren
              </button>
              <button
                onClick={ronDealAf}
                disabled={dealBezig}
                className="flex-1 h-13 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
              >
                {dealBezig ? (
                  <span className="material-icons-round animate-spin text-sm">progress_activity</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Ja, verkocht!
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
