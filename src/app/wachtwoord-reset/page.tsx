"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NoahEmmaLogo } from "@/components/Header";

export default function WachtwoordResetPage() {
  const router = useRouter();
  const [wachtwoord, setWachtwoord] = useState("");
  const [bevestiging, setBevestiging] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessieGeldig, setSessieGeldig] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [klaar, setKlaar] = useState(false);

  // De herstellink van Supabase logt de gebruiker tijdelijk in (recovery-sessie).
  // Zonder geldige sessie kan het wachtwoord niet gewijzigd worden.
  useEffect(() => {
    const checkSessie = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessieGeldig(!!session);
    };
    checkSessie();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessieGeldig(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (wachtwoord.length < 6) {
      setError("Je wachtwoord moet minimaal 6 tekens lang zijn.");
      return;
    }
    if (wachtwoord !== bevestiging) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: wachtwoord });
    if (error) {
      setError("Het wijzigen van je wachtwoord is niet gelukt. Vraag eventueel een nieuwe herstellink aan.");
      setLoading(false);
      return;
    }
    setKlaar(true);
    setLoading(false);
    setTimeout(() => router.push("/"), 2500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <div className="flex flex-col items-center pt-16 pb-10">
        <div className="mb-4">
          <NoahEmmaLogo size={56} />
        </div>
        <h2 className="text-accent text-2xl font-bold tracking-[0.2em] uppercase">NOAH &amp; EMMA</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">De marketplace voor kinderkleding</p>
      </div>

      <div className="flex-1 px-6 max-w-[480px] mx-auto w-full pb-10">
        {/* Wachtwoord gewijzigd */}
        {klaar ? (
          <div className="flex flex-col items-center text-center gap-4 pt-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-icons-round text-green-600 text-3xl">check</span>
            </div>
            <h1 className="text-2xl font-bold">Wachtwoord gewijzigd</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Je kunt nu inloggen met je nieuwe wachtwoord.<br />We sturen je door naar de app...
            </p>
          </div>
        ) : sessieGeldig === false ? (
          /* Geen geldige herstellink */
          <div className="flex flex-col items-center text-center gap-4 pt-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <span className="material-icons-round text-red-400 text-3xl">link_off</span>
            </div>
            <h1 className="text-2xl font-bold">Link verlopen</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Deze herstellink is ongeldig of verlopen.<br />Vraag een nieuwe aan via het inlogscherm.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-2 h-12 px-8 bg-accent text-white rounded-xl font-bold active:scale-[0.98] transition-all"
            >
              Naar inloggen
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">Nieuw wachtwoord</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Kies een nieuw wachtwoord voor je account.</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Nieuw wachtwoord</label>
                <div className="relative">
                  <input
                    className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={wachtwoord}
                    onChange={(e) => setWachtwoord(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Herhaal wachtwoord</label>
                <input
                  className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={bevestiging}
                  onChange={(e) => setBevestiging(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                className="w-full h-14 bg-accent text-white rounded-xl font-bold text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Bezig..." : "Wachtwoord opslaan"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
