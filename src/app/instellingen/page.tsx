"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, X, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Item = {
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
};

type Sectie = {
  header?: string;
  items: Item[];
};

export default function InstellingenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [toonVerwijderModal, setToonVerwijderModal] = useState(false);
  const [verwijderTekst, setVerwijderTekst] = useState("");
  const [verwijderBezig, setVerwijderBezig] = useState(false);

  const uitloggen = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const verwijderAccount = async () => {
    if (verwijderTekst !== "VERWIJDER") return;
    setVerwijderBezig(true);
    await supabase.auth.signOut();
    toast({ title: "Account verwijderd" });
    router.push("/login");
  };

  const secties: Sectie[] = [
    {
      items: [
        { label: "Profielgegevens", href: "/instellingen/profiel" },
        { label: "Accountinstellingen", href: "/instellingen/account" },
        { label: "Beveiliging", href: "/instellingen/beveiliging" },
      ],
    },
    {
      header: "Notificaties",
      items: [
        { label: "Pushmeldingen", href: "/notificaties" },
        { label: "Notificaties per e-mail", href: "/notificaties/email" },
      ],
    },
    {
      header: "Privacy-instellingen",
      items: [
        { label: "Privacy-instellingen", href: "/instellingen/privacy-instelling" },
      ],
    },
    {
      header: "Juridisch",
      items: [
        { label: "Privacyverklaring", href: "/privacy" },
        { label: "Algemene voorwaarden", href: "/voorwaarden" },
        { label: "Cookiebeleid", href: "/cookies" },
        { label: "Over Noah & Emma", href: "/over" },
      ],
    },
    {
      items: [
        { label: "Uitloggen", onClick: uitloggen, danger: false },
        { label: "Account verwijderen", onClick: () => setToonVerwijderModal(true), danger: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Instellingen</h1>
        </div>
      </header>

      <main className="pt-4">
        {secties.map((sectie, sIdx) => (
          <div key={sIdx}>
            {sectie.header && (
              <p className="text-sm text-slate-400 px-6 pt-6 pb-2">{sectie.header}</p>
            )}
            <div className={cn("bg-white dark:bg-slate-900", sectie.header ? "" : "mt-6 border-t border-slate-100 dark:border-slate-800 first:mt-0 first:border-t-0")}>
              {sectie.items.map((item, iIdx) => {
                const inner = (
                  <div className={cn(
                    "flex items-center justify-between px-6 py-4",
                    iIdx < sectie.items.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : "",
                    item.danger ? "active:bg-red-50 dark:active:bg-red-900/10" : "active:bg-slate-50 dark:active:bg-slate-800"
                  )}>
                    <span className={cn(
                      "text-[17px] font-normal",
                      item.danger ? "text-red-500" : "text-slate-900 dark:text-white"
                    )}>
                      {item.label}
                    </span>
                    {item.href && <ChevronRight className="w-5 h-5 text-slate-300" />}
                  </div>
                );

                if (item.onClick) return (
                  <button key={item.label} onClick={item.onClick} className="w-full text-left">{inner}</button>
                );
                if (item.href) return (
                  <Link key={item.label} href={item.href}>{inner}</Link>
                );
                return <div key={item.label}>{inner}</div>;
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-sm text-slate-400 py-8">Noah & Emma 1.0.0</p>
      </main>

      {/* Account verwijderen modal */}
      {toonVerwijderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <button onClick={() => { setToonVerwijderModal(false); setVerwijderTekst(""); }}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Account verwijderen</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Verwijdert je account, advertenties en berichten. <strong>Niet terugdraaibaar.</strong>
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typ VERWIJDER om te bevestigen</label>
              <input
                value={verwijderTekst}
                onChange={e => setVerwijderTekst(e.target.value.toUpperCase())}
                placeholder="VERWIJDER"
                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 outline-none focus:border-red-400"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setToonVerwijderModal(false); setVerwijderTekst(""); }} className="flex-1 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 text-sm">
                Annuleren
              </button>
              <button
                onClick={verwijderAccount}
                disabled={verwijderTekst !== "VERWIJDER" || verwijderBezig}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {verwijderBezig ? <span className="material-icons-round text-sm animate-spin">progress_activity</span> : <><Trash2 className="w-4 h-4" /> Verwijder</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
