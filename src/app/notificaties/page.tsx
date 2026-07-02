"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type NotificatieKeys = {
  nieuw_bericht: boolean;
  nieuwe_feedback: boolean;
  afgeprijsde_artikelen: boolean;
  favoriet_artikel: boolean;
  favoriet_verkocht: boolean;
  nieuwe_volger: boolean;
  nieuwe_artikelen: boolean;
  zoekwaarschuwing: boolean;
  push_aan: boolean;
};

const DEFAULTS: NotificatieKeys = {
  nieuw_bericht: true,
  nieuwe_feedback: false,
  afgeprijsde_artikelen: false,
  favoriet_artikel: false,
  favoriet_verkocht: false,
  nieuwe_volger: false,
  nieuwe_artikelen: false,
  zoekwaarschuwing: true,
  push_aan: true,
};

const LIMIET_OPTIES = ["Onbeperkt", "Tot 5 notificaties", "Tot 10 notificaties", "Tot 20 notificaties"];

const SECTIES = [
  {
    header: "Belangrijke notificaties",
    items: [
      { key: "nieuw_bericht" as keyof NotificatieKeys, label: "Nieuwe berichten" },
      { key: "nieuwe_feedback" as keyof NotificatieKeys, label: "Nieuwe feedback" },
      { key: "afgeprijsde_artikelen" as keyof NotificatieKeys, label: "Afgeprijsde artikelen" },
    ],
  },
  {
    header: "Minder belangrijke notificaties",
    items: [
      { key: "favoriet_artikel" as keyof NotificatieKeys, label: "Favoriete artikelen" },
      { key: "favoriet_verkocht" as keyof NotificatieKeys, label: "Favoriet artikel is verkocht" },
      { key: "nieuwe_volger" as keyof NotificatieKeys, label: "Nieuwe volgers" },
      { key: "nieuwe_artikelen" as keyof NotificatieKeys, label: "Nieuwe artikelen" },
      { key: "zoekwaarschuwing" as keyof NotificatieKeys, label: "Zoekwaarschuwingen" },
    ],
  },
];

export default function PushmeldingPage() {
  const router = useRouter();
  const [inst, setInst] = useState<NotificatieKeys>(DEFAULTS);
  const [limiet, setLimiet] = useState("Tot 5 notificaties");
  const [laden, setLaden] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("notificatie_instellingen").eq("id", user.id).single();
      if (data?.notificatie_instellingen) {
        setInst({ ...DEFAULTS, ...data.notificatie_instellingen });
        if (data.notificatie_instellingen.limiet) setLimiet(data.notificatie_instellingen.limiet);
      } else {
        const local = localStorage.getItem("notificatie_instellingen");
        if (local) try { setInst({ ...DEFAULTS, ...JSON.parse(local) }); } catch {}
      }
      setLaden(false);
    })();
  }, []);

  const toggle = async (key: keyof NotificatieKeys, val: boolean) => {
    const nieuw = { ...inst, [key]: val };
    setInst(nieuw);
    localStorage.setItem("notificatie_instellingen", JSON.stringify({ ...nieuw, limiet }));
    if (userId) await supabase.from("profiles").update({ notificatie_instellingen: { ...nieuw, limiet } }).eq("id", userId);
  };

  const slaLimietOp = async (val: string) => {
    setLimiet(val);
    const nieuw = { ...inst, limiet: val };
    localStorage.setItem("notificatie_instellingen", JSON.stringify(nieuw));
    if (userId) await supabase.from("profiles").update({ notificatie_instellingen: nieuw }).eq("id", userId);
  };

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Pushmeldingen</h1>
        </div>
      </header>

      <main className="pt-4">
        {SECTIES.map(sectie => (
          <div key={sectie.header}>
            <p className="text-sm text-slate-400 px-6 pt-5 pb-2">{sectie.header}</p>
            <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {sectie.items.map((item, idx) => (
                <div
                  key={item.key}
                  className={cn(
                    "flex items-center justify-between px-6 py-4",
                    idx < sectie.items.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""
                  )}
                >
                  <span className="text-[17px] text-slate-900 dark:text-white">{item.label}</span>
                  <Switch
                    checked={inst[item.key] as boolean}
                    onCheckedChange={val => toggle(item.key, val)}
                    className="data-[state=checked]:bg-primary"
                    disabled={!inst.push_aan}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Dagelijks limiet */}
        <div>
          <p className="text-sm text-slate-400 px-6 pt-5 pb-2">Stel een dagelijks limiet in voor elk type</p>
          <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="px-6 py-4">
              <select
                value={limiet}
                onChange={e => slaLimietOp(e.target.value)}
                className="w-full text-[17px] text-slate-900 dark:text-white bg-transparent outline-none"
              >
                {LIMIET_OPTIES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pushmeldingen aan/uit */}
        <div className="mt-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-[17px] text-slate-900 dark:text-white">Pushmeldingen aanzetten</span>
            <Switch
              checked={inst.push_aan}
              onCheckedChange={val => toggle("push_aan", val)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
