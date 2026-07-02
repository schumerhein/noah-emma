"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

export default function EmailNotificatiesPage() {
  const router = useRouter();
  const [emailAan, setEmailAan] = useState(false);
  const [laden, setLaden] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("notificatie_instellingen").eq("id", user.id).single();
      if (data?.notificatie_instellingen?.email_aan !== undefined) {
        setEmailAan(data.notificatie_instellingen.email_aan);
      }
      setLaden(false);
    })();
  }, []);

  const toggle = async (val: boolean) => {
    setEmailAan(val);
    if (!userId) return;
    const { data } = await supabase.from("profiles").select("notificatie_instellingen").eq("id", userId).single();
    const huidig = data?.notificatie_instellingen || {};
    await supabase.from("profiles").update({ notificatie_instellingen: { ...huidig, email_aan: val } }).eq("id", userId);
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
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Notificaties per e-mail</h1>
        </div>
      </header>

      <main className="pt-4">
        {!emailAan && (
          <div className="bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800 px-6 py-4 mb-0">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Alle notificaties zijn uitgeschakeld. Gebruik de schakelaar om ze in te schakelen.
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-5">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-[17px] text-slate-900 dark:text-white">Notificaties per e-mail inschakelen</span>
            <Switch
              checked={emailAan}
              onCheckedChange={toggle}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <p className="text-sm text-slate-400 px-6 py-4 leading-relaxed">
          Mogelijk ontvang je nog steeds verplichte updates over belangrijke wettelijke wijzigingen, of berichten over verkopen en aankopen.
        </p>
      </main>
    </div>
  );
}
