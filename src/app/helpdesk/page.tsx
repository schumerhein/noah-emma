"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type RecenteTransactie = {
  id: string;
  listing_id: string;
  listings: { titel: string; prijs: number; foto_urls: string[] } | null;
  koper_id: string;
  verkoper_id: string;
};

export default function HelpdeskPage() {
  const router = useRouter();
  const [vraag, setVraag] = useState("");
  const [transacties, setTransacties] = useState<RecenteTransactie[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [verstuurd, setVerstuurd] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("conversations")
        .select("id, listing_id, koper_id, verkoper_id, listings(titel, prijs, foto_urls)")
        .or(`koper_id.eq.${user.id},verkoper_id.eq.${user.id}`)
        .eq("afgerond", true)
        .order("updated_at", { ascending: false })
        .limit(3);

      setTransacties((data as unknown as RecenteTransactie[]) || []);
    })();
  }, []);

  const verstuurVraag = () => {
    if (!vraag.trim()) return;
    setVerstuurd(true);
    // In productie: verstuur naar support systeem
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Helpdesk</h1>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-8">
        {!verstuurd ? (
          <>
            {/* Algemene vraag */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hoe kunnen we je helpen?</h2>

              <div>
                <p className="text-sm text-slate-400 mb-2">Ik heb een algemene vraag</p>
                <div className="relative">
                  <input
                    value={vraag}
                    onChange={e => setVraag(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && verstuurVraag()}
                    placeholder="✦ Stel je vraag..."
                    className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={verstuurVraag}
                    disabled={!vraag.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:text-slate-300"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Specifieke transactie */}
            {transacties.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Ik heb hulp nodig met een specifieke transactie</p>
                <div className="space-y-2">
                  {transacties.map(t => {
                    const listing = t.listings;
                    if (!listing) return null;
                    return (
                      <Link key={t.id} href={`/messages/${t.id}`}>
                        <div className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-2xl active:bg-slate-50 dark:active:bg-slate-800 transition-colors">
                          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                            {listing.foto_urls?.[0] ? (
                              <Image src={listing.foto_urls[0]} alt={listing.titel} width={56} height={56} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-icons-round text-slate-300 text-xl">image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{listing.titel}</p>
                            <p className="text-xs text-slate-400 mt-0.5">€{listing.prijs.toFixed(2).replace(".", ",")} · Transactie voltooid</p>
                            <p className="text-xs text-slate-300 mt-0.5">De koper heeft de bestelling goed ontvangen.</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link href="/orders" className="flex items-center justify-between py-3 text-sm font-bold text-primary">
                  Meer bestellingen bekijken <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Veelgestelde vragen */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Of bekijk onze veelgestelde vragen</p>
              <button
                onClick={() => router.push("/faq")}
                className="w-full flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl active:bg-slate-50 dark:active:bg-slate-800"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Noah & Emma FAQ</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Contact */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 space-y-2">
              <p className="font-bold text-sm text-slate-800 dark:text-white">Direct contact</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Niet gevonden wat je zocht? Mail ons op{" "}
                <a href="mailto:support@noahemma.nl" className="text-primary font-bold">support@noahemma.nl</a>.
                Wij reageren binnen 1 werkdag.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-icons-round text-emerald-500 text-3xl">check_circle</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vraag verstuurd!</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              We hebben je vraag ontvangen en nemen zo snel mogelijk contact met je op via e-mail.
            </p>
            <button onClick={() => { setVerstuurd(false); setVraag(""); }} className="text-sm font-bold text-primary mt-2">
              Nog een vraag stellen
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
