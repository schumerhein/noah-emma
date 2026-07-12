"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NoahEmmaLogo } from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Vanuit de landingspagina (noah-emma.nl) komen nieuwe bezoekers binnen
  // via /login?mode=register — zij starten dus meteen op het
  // registreren-tabblad in plaats van inloggen.
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "register") {
      setMode("register");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [naam, setNaam] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetBezig, setResetBezig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Stuur een wachtwoord-herstel e-mail via Supabase
  const handleWachtwoordVergeten = async () => {
    setError(null);
    setSuccess(null);
    if (!email) {
      setError("Vul eerst je e-mailadres in, dan sturen we je een herstellink.");
      return;
    }
    setResetBezig(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/wachtwoord-reset`,
    });
    if (error) {
      setError("Het versturen van de herstellink is niet gelukt. Probeer het later opnieuw.");
    } else {
      setSuccess(`We hebben een herstellink gestuurd naar ${email}. Check ook je spamfolder.`);
    }
    setResetBezig(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Onjuist e-mailadres of wachtwoord. Probeer het opnieuw.");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { naam } },
    });
    if (error) {
      setError(error.message);
    } else {
      // Nieuwe gebruiker → kind-profiel onboarding
      router.push("/onboarding/kind");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <div className="flex flex-col items-center pt-16 pb-10">
        <div className="mb-4">
          <NoahEmmaLogo size={56} />
        </div>
        <h2 className="text-accent text-2xl font-bold tracking-[0.2em] uppercase">NOAH & EMMA</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">De marketplace voor kinderkleding</p>
      </div>

      <div className="flex-1 px-6 max-w-[480px] mx-auto w-full pb-10">
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">
            {mode === "login" ? "Welkom terug" : "Account aanmaken"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {mode === "login" ? "Log in om verder te gaan." : "Maak een gratis account aan."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-5">
          {mode === "register" && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Naam</label>
              <input
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                placeholder="Jouw voornaam"
                type="text"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">E-mailadres</label>
            <input
              className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
              placeholder="naam@voorbeeld.nl"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold">Wachtwoord</label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={handleWachtwoordVergeten}
                  disabled={resetBezig}
                  className="text-accent text-sm font-semibold hover:underline disabled:opacity-50"
                >
                  {resetBezig ? "Bezig..." : "Vergeten?"}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            className="w-full h-14 bg-accent text-white rounded-xl font-bold text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span>{mode === "login" ? "Inloggen" : "Account aanmaken"}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          {mode === "login" ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Nog geen account?{" "}
              <button onClick={() => { setMode("register"); setError(null); }} className="text-accent font-bold hover:underline">
                Registreer hier
              </button>
            </p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Al een account?{" "}
              <button onClick={() => { setMode("login"); setError(null); }} className="text-accent font-bold hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="fixed top-[-100px] right-[-50px] w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-accent/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}
