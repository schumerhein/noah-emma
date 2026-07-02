"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package, ShoppingBag, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type ConversationWithListing = {
  id: string;
  created_at: string;
  listing_id: string | null;
  koper_id: string;
  verkoper_id: string;
  listings: {
    id: string;
    titel: string;
    prijs: number;
    maat: string;
    foto_urls: string[];
  } | null;
  koper: { naam: string | null } | null;
  verkoper: { naam: string | null } | null;
};

export default function OrdersPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<"kopen" | "verkopen">("kopen");

  useEffect(() => {
    laadOrders();
  }, []);

  const laadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setCurrentUserId(user.id);

    const { data } = await supabase
      .from("conversations")
      .select(`
        id, created_at, listing_id, koper_id, verkoper_id,
        listings(id, titel, prijs, maat, foto_urls),
        koper:profiles!conversations_koper_id_fkey(naam),
        verkoper:profiles!conversations_verkoper_id_fkey(naam)
      `)
      .or(`koper_id.eq.${user.id},verkoper_id.eq.${user.id}`)
      .not("listing_id", "is", null)
      .order("created_at", { ascending: false });

    if (data) setConversations(data as unknown as ConversationWithListing[]);
    setLoading(false);
  };

  const alsKoper = conversations.filter(c => c.koper_id === currentUserId);
  const alsVerkoper = conversations.filter(c => c.verkoper_id === currentUserId);
  const getoond = tab === "kopen" ? alsKoper : alsVerkoper;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display">
      <header className="pt-14 pb-4 px-6 flex items-center gap-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Transacties</h1>
      </header>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 gap-6">
        {(["kopen", "verkopen"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "py-3 text-sm font-bold border-b-2 transition-all capitalize",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-slate-400"
            )}
          >
            {t === "kopen" ? `Gekocht (${alsKoper.length})` : `Verkocht (${alsVerkoper.length})`}
          </button>
        ))}
      </div>

      <main className="px-4 py-4 space-y-3 pb-32">
        {loading && (
          <div className="flex justify-center py-16">
            <span className="material-icons-round text-primary text-3xl animate-spin">progress_activity</span>
          </div>
        )}

        {!loading && getoond.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {tab === "kopen" ? <ShoppingBag className="w-8 h-8 text-slate-300" /> : <Package className="w-8 h-8 text-slate-300" />}
            </div>
            <h2 className="text-lg font-bold text-slate-600 dark:text-slate-300">
              {tab === "kopen" ? "Nog niets gekocht" : "Nog niets verkocht"}
            </h2>
            <p className="text-sm text-slate-400">
              {tab === "kopen"
                ? "Als je contact opneemt met een verkoper, verschijnt dat hier."
                : "Als iemand contact opneemt over jouw advertentie, verschijnt dat hier."}
            </p>
          </div>
        )}

        {!loading && getoond.map(conv => {
          const listing = conv.listings;
          const anderePartij = tab === "kopen"
            ? (conv.verkoper as { naam: string | null } | null)?.naam || "Verkoper"
            : (conv.koper as { naam: string | null } | null)?.naam || "Koper";

          return (
            <div
              key={conv.id}
              onClick={() => router.push(`/messages/${conv.id}`)}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 flex gap-4 items-center shadow-sm active:scale-[0.99] transition-all cursor-pointer"
            >
              {/* Foto */}
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 relative">
                {listing?.foto_urls?.[0] ? (
                  <img src={listing.foto_urls[0]} alt={listing.titel || ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {tab === "kopen"
                    ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    : <ArrowUpRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  }
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {tab === "kopen" ? "Gekocht van" : "Verkocht aan"} {anderePartij}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                  {listing?.titel || "Product"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary font-extrabold text-sm">
                    €{listing?.prijs?.toFixed(2).replace(".", ",") || "—"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Maat {listing?.maat}</span>
                </div>
              </div>

              <span className="material-icons-round text-slate-300 text-lg">chevron_right</span>
            </div>
          );
        })}
      </main>
    </div>
  );
}
