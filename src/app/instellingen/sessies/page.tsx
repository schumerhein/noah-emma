"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Smartphone, Monitor, Laptop, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function SessiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bezig, setBezig] = useState(false);

  const sessies = [
    { apparaat: "iPhone 15", os: "iOS 18", huidig: true, tijd: "Nu actief", icon: <Smartphone className="w-5 h-5" /> },
    { apparaat: "MacBook Pro", os: "macOS 15", huidig: false, tijd: "2 uur geleden", icon: <Laptop className="w-5 h-5" /> },
    { apparaat: "Chrome · Windows", os: "Windows 11", huidig: false, tijd: "Gisteren", icon: <Monitor className="w-5 h-5" /> },
  ];

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
        <p className="text-sm text-slate-400 px-6 pb-3">Apparaten die momenteel toegang hebben tot je account.</p>

        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {sessies.map((s, idx) => (
            <div key={idx} className={`flex items-center gap-4 px-6 py-4 ${idx < sessies.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.huidig ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {s.apparaat}
                  {s.huidig && <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">DIT APPARAAT</span>}
                </p>
                <p className="text-xs text-slate-400">{s.os} · {s.tijd}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={uitloggenOveral}
            disabled={bezig}
            className="w-full flex items-center gap-4 px-6 py-4 active:bg-red-50 dark:active:bg-red-900/10"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-[17px] text-red-500">Overal uitloggen</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 px-6 py-3">Sessies zijn indicatief. Exacte inlogdata is beschikbaar in de volledige app.</p>
      </main>
    </div>
  );
}
