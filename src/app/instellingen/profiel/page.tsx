"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const STEDEN = ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen", "Leiden", "Haarlem", "Maastricht", "Arnhem", "Zwolle", "Amersfoort", "Apeldoorn", "Enschede", "Den Bosch", "Delft"];

export default function ProfielInstellingenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBezig, setAvatarBezig] = useState(false);
  const [naam, setNaam] = useState("");
  const [stad, setStad] = useState("");
  const [stadZoek, setStadZoek] = useState("");
  const [toonStadSuggesties, setToonStadSuggesties] = useState(false);
  const [bio, setBio] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [geboortedatumKolomBestaat, setGeboortedatumKolomBestaat] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("naam, stad, bio, avatar_url, geboortedatum").eq("id", user.id).single();
      if (data) {
        setNaam(data.naam || "");
        setStad(data.stad || "");
        setStadZoek(data.stad || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || null);
        setGeboortedatum(data.geboortedatum || "");
        setGeboortedatumKolomBestaat("geboortedatum" in data);
      }
      setLaden(false);
    })();
  }, []);

  const uploadAvatar = async (file: File) => {
    if (!userId) return;
    setAvatarBezig(true);
    const pad = `${userId}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(pad, file, { upsert: true });
    if (error) { toast({ variant: "destructive", title: "Upload mislukt" }); setAvatarBezig(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(pad);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
    setAvatarUrl(publicUrl);
    setAvatarBezig(false);
    toast({ title: "Profielfoto bijgewerkt ✓" });
  };

  const slaOp = async () => {
    if (!userId || !naam.trim()) return;
    setOpslaan(true);
    const updateData: Record<string, string | null> = {
      naam: naam.trim(),
      stad: stad || null,
      bio: bio.trim() || null,
    };
    // Alleen meesturen als de kolom in de database bestaat
    if (geboortedatumKolomBestaat) updateData.geboortedatum = geboortedatum || null;
    await supabase.from("profiles").update(updateData).eq("id", userId);
    setOpslaan(false);
    toast({ title: "Profiel opgeslagen ✓" });
    router.back();
  };

  const stadSuggesties = STEDEN.filter(s => s.toLowerCase().startsWith(stadZoek.toLowerCase()) && stadZoek.length > 0);

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex-1">Profielgegevens</h1>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-8 max-w-lg mx-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-4 border-white dark:border-slate-800 shadow-lg"
          >
            {avatarBezig ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="material-icons-round text-white text-2xl animate-spin">progress_activity</span>
              </div>
            ) : avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-primary">{naam.charAt(0).toUpperCase() || "?"}</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-black/40 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
          <p className="text-xs text-slate-400">Tik om foto te wijzigen</p>
        </div>

        {/* Naam */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Naam *</label>
          <input
            value={naam}
            onChange={e => setNaam(e.target.value)}
            placeholder="Jouw naam"
            maxLength={50}
            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors"
          />
          <p className="text-[10px] text-slate-400 text-right">{naam.length}/50</p>
        </div>

        {/* Stad */}
        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stad</label>
          <input
            value={stadZoek}
            onChange={e => { setStadZoek(e.target.value); setStad(e.target.value); setToonStadSuggesties(true); }}
            onFocus={() => setToonStadSuggesties(true)}
            onBlur={() => setTimeout(() => setToonStadSuggesties(false), 150)}
            placeholder="Bijv. Amsterdam"
            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors"
          />
          {toonStadSuggesties && stadSuggesties.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-10">
              {stadSuggesties.slice(0, 5).map(s => (
                <button key={s} onMouseDown={() => { setStad(s); setStadZoek(s); setToonStadSuggesties(false); }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  📍 {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Vertel iets over jezelf als verkoper. Bijv. welk type kleding je verkoopt, hoe je handelt..."
            maxLength={300}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-medium outline-none focus:border-primary transition-colors resize-none"
          />
          <p className="text-[10px] text-slate-400 text-right">{bio.length}/300</p>
        </div>

        {/* Geboortedatum */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Geboortedatum</label>
          <p className="text-[11px] text-slate-400">Niet zichtbaar voor andere gebruikers — enkel voor leeftijdsverificatie.</p>
          <input
            type="date"
            value={geboortedatum}
            onChange={e => setGeboortedatum(e.target.value)}
            max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium outline-none focus:border-primary transition-colors"
          />
        </div>
      </main>

      {/* Opslaan knop */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={slaOp}
          disabled={opslaan || !naam.trim()}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
            naam.trim() ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {opslaan ? <span className="material-icons-round animate-spin">progress_activity</span> : <><Check className="w-5 h-5" /> Opslaan</>}
        </button>
      </div>
    </div>
  );
}
