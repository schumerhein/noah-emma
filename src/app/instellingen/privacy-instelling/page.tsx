"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

type PrivacyKeys = {
  marketing_campagnes: boolean;
  favoriet_notificatie_verkoper: boolean;
  gepersonaliseerde_inhoud: boolean;
  recent_bekeken_tonen: boolean;
};

const DEFAULTS: PrivacyKeys = {
  marketing_campagnes: true,
  favoriet_notificatie_verkoper: true,
  gepersonaliseerde_inhoud: true,
  recent_bekeken_tonen: true,
};

const ITEMS: { key: keyof PrivacyKeys; label: string; sub: string }[] = [
  {
    key: "marketing_campagnes",
    label: "Toon mijn artikelen in marketingcampagnes om hopelijk nog sneller te verkopen",
    sub: "Hiermee kan Noah & Emma jouw artikelen op social media en andere kanalen laten zien. Meer zichtbaarheid kan ervoor zorgen dat je sneller verkoopt.",
  },
  {
    key: "favoriet_notificatie_verkoper",
    label: "Laat verkopers weten wanneer je een artikel aan jouw favorieten toevoegt",
    sub: "",
  },
  {
    key: "gepersonaliseerde_inhoud",
    label: "Gepersonaliseerde inhoud",
    sub: "Noah & Emma toestaan om mijn feed en zoekresultaten te personaliseren op basis van mijn voorkeuren, instellingen en eerdere aankopen.",
  },
  {
    key: "recent_bekeken_tonen",
    label: "Laat mijn onlangs bekeken artikelen op de Homepagina weergeven",
    sub: "Als je deze optie uitzet maar wel toestemming hebt gegeven voor gepersonaliseerde inhoud, worden deze artikelen nog wel gebruikt om je feed te personaliseren.",
  },
];

export default function PrivacyInstellingPage() {
  const router = useRouter();
  const [inst, setInst] = useState<PrivacyKeys>(DEFAULTS);
  const [laden, setLaden] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("privacy_instellingen").eq("id", user.id).single();
      if (data?.privacy_instellingen) setInst({ ...DEFAULTS, ...data.privacy_instellingen });
      setLaden(false);
    })();
  }, []);

  const toggle = async (key: keyof PrivacyKeys, val: boolean) => {
    const nieuw = { ...inst, [key]: val };
    setInst(nieuw);
    if (userId) await supabase.from("profiles").update({ privacy_instellingen: nieuw }).eq("id", userId);
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
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Privacy-instellingen</h1>
        </div>
      </header>

      <main className="pt-4">
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {ITEMS.map((item, idx) => (
            <div
              key={item.key}
              className={`flex items-start justify-between gap-4 px-6 py-5 ${idx < ITEMS.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white leading-snug">{item.label}</p>
                {item.sub && <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{item.sub}</p>}
              </div>
              <Switch
                checked={inst[item.key]}
                onCheckedChange={val => toggle(item.key, val)}
                className="data-[state=checked]:bg-primary shrink-0 mt-0.5"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
