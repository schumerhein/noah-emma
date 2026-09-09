"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, MonitorSmartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type LoginSessie = {
  id: string;
  device_label: string | null;
  created_at: string;
};

export default function SessiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bezig, setBezig] = useState(false);
  const [sessies, setSessies] = useState<LoginSessie[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase
        .from("login_sessions")
        .select("id, device_label, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setSessies(data || []);
      setLaden(false);
    })();
  }, []);

  const uitloggenOveral = async () => {
    setBezig(true);
    await supabase.auth.signOut({ scope: "global" });
    toast({ title: "Overal uitgelogd" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Login activiteit</h1>
        </div>
      </header>

      <main className="pt-6">
        <p className="px-6 text-xs text-slate-400 leading-relaxed">
          Recente keren dat er is ingelogd op je account. Herken je een moment niet? Log dan hieronder overal uit en wijzig meteen je wachtwoord.
        </p>

        <div className="mt-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {laden ? (
            <div className="px-6 py-8 flex justify-center">
              <span className="material-icons-round text-primary text-2xl animate-spin">progress_activity</span>
            </div>
          ) : sessies.length === 0 ? (
            <p className="px-6 py-6 text-sm text-slate-400">Nog geen activiteit vastgelegd.</p>
          ) : (
            sessies.map((s, idx) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 px-6 py-4 ${idx < sessies.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-5 h-5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 dark:text-white truncate">{s.device_label || "Onbekend apparaat"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(s.created_at).toLocaleString("nl-NL", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={uitloggenOveral}
            disabled={bezig}
            className="w-full flex items-center gap-4 px-6 py-4 active:bg-red-50 dark:active:bg-red-900/10 disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-[17px] text-red-500">Overal uitloggen</span>
          </button>
        </div>
      </main>
    </div>
  );
}
