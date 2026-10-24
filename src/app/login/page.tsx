"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NoahEmmaLogo } from "@/components/Header";
import { MailCheck } from "lucide-react";
import { leesbareDeviceLabel } from "@/lib/deviceLabel";

// Na inloggen terug naar de pagina waar je vandaan kwam (bv. een review-link
// uit een e-mail: /login?next=/reviews/schrijf?...). Alleen paden binnen de
// eigen site, nooit een extern adres.
function volgendePagina(): string | null {
  if (typeof window === "undefined") return null;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

// Supabase geeft Engelse foutmeldingen terug; vertaal de gebruikelijke.
function registratieFout(bericht: string): string {
  const m = bericht.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) return "Er bestaat al een account met dit e-mailadres. Log in, of kies 'Vergeten?' als je je wachtwoord niet meer weet.";
  if (m.includes("password") && (m.includes("at least") || m.includes("short"))) return "Kies een wachtwoord van minimaal 6 tekens.";
  if (m.includes("weak") || m.includes("pwned") || m.includes("leaked")) return "Dit wachtwoord is te makkelijk te raden. Kies een sterker wachtwoord.";
  if (m.includes("invalid") && m.includes("email")) return "Dit e-mailadres lijkt niet te kloppen. Controleer het even.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes")) return "Even te veel pogingen achter elkaar. Probeer het over een minuutje opnieuw.";
  return "Account aanmaken lukte niet. Probeer het opnieuw.";
}

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
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

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
    // Sluit het mobiele toetsenbord vóór de navigatie — anders blijft de
    // pagina na het inloggen soms omhoog geschoven staan (de viewport was
    // nog aangepast voor het toetsenbord toen de nieuwe pagina laadde).
    (document.activeElement as HTMLElement | null)?.blur();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Je e-mailadres is nog niet bevestigd. Check je inbox voor de bevestigingslink (ook je spamfolder).");
      } else {
        setError("Onjuist e-mailadres of wachtwoord. Probeer het opnieuw.");
      }
      setLoading(false);
      return;
    }

    // Vastleggen voor het inlog-activiteitenoverzicht — mag het inloggen
    // zelf nooit blokkeren of vertragen, dus bewust niet awaited.
    if (data.session) {
      fetch("/api/account/log-in-sessie", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_label: leesbareDeviceLabel(navigator.userAgent) }),
      }).catch(() => {});
    }

    // Bij registratie met verplichte e-mailbevestiging komt een gebruiker
    // hier voor het eerst terecht via inloggen in plaats van via de
    // registratieflow (die meteen naar /onboarding/kind stuurt). Zonder
    // deze check sloeg zo'n eerste keer de hele onboarding over: geen naam
    // op het profiel, geen kindprofiel. profiles.naam is leeg totdat de
    // onboarding-stap 'm zet, dus dat is hier het betrouwbare signaal.
    const { data: profiel } = await supabase.from("profiles").select("naam").eq("id", data.user.id).single();
    window.scrollTo(0, 0);
    if (!profiel?.naam) {
      router.push("/onboarding/kind");
    } else {
      router.push(volgendePagina() ?? "/");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { naam },
        // Als e-mailbevestiging verplicht is, stuurt de link de gebruiker
        // direct terug naar de kind-onboarding — precies waar ze gebleven waren.
        emailRedirectTo: `${window.location.origin}/onboarding/kind`,
      },
    });
    if (error) {
      setError(registratieFout(error.message));
    } else if (data.session) {
      // E-mailbevestiging staat uit (of het account was al bevestigd) — meteen door.
      window.scrollTo(0, 0);
      router.push("/onboarding/kind");
    } else {
      // Geen sessie: e-mailbevestiging is vereist voordat de onboarding kan starten.
      setAwaitingConfirmation(true);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden verloop-merk dark:bg-none dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
      {/* Zelfde logo als in de websiteheader: Noah blauw, Emma roze. */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6 text-center">
        <div className="mb-4">
          <NoahEmmaLogo size={60} />
        </div>
        <h2 className="font-headline text-[30px] font-extrabold tracking-tight">
          <span className="text-blauw-600">Noah</span>{" "}
          <span className="text-slate-900 dark:text-white">&amp;</span>{" "}
          <span className="text-roze-600">Emma</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] mt-1.5 font-medium">Tweedehands voor je kind, altijd in de juiste maat</p>
      </div>

      <div className="flex-1 px-4 max-w-[480px] mx-auto w-full pb-10">
        <div className="rounded-[32px] bg-white dark:bg-slate-800 shadow-zacht px-5 py-7">
        {awaitingConfirmation ? (
          <div className="flex flex-col items-center text-center gap-4 pt-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Check je e-mail</h1>
            <p className="text-slate-500 dark:text-slate-400">
              We hebben een bevestigingslink gestuurd naar{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>.
              Klik op de link om je account te activeren — je gaat dan direct verder waar je gebleven was.
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Niets ontvangen? Check ook je spamfolder.</p>
            <button
              onClick={() => { setAwaitingConfirmation(false); setMode("login"); setError(null); }}
              className="mt-2 text-primary font-bold underline underline-offset-2 text-sm"
            >
              Terug naar inloggen
            </button>
          </div>
        ) : (
        <>
        <div className="mb-6">
          <h1 className="text-slate-900 dark:text-slate-100 text-[28px] font-extrabold leading-tight">
            {mode === "login" ? "Welkom terug" : "Account aanmaken"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {mode === "login" ? "Log in om verder te gaan." : "Gratis account, gratis kopen en gratis verkopen."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-5">
          {mode === "register" && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Naam</label>
              <input
                className="w-full h-14 px-4 rounded-2xl border border-slate-900/15 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none"
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
              className="w-full h-14 px-4 rounded-2xl border border-slate-900/15 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none"
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
                  className="text-primary text-sm font-semibold hover:underline disabled:opacity-50"
                >
                  {resetBezig ? "Bezig..." : "Vergeten?"}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                className="w-full h-14 px-4 rounded-2xl border border-slate-900/15 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none"
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
            className="w-full min-h-[56px] bg-slate-900 text-white rounded-full font-bold text-base shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
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
              <button onClick={() => { setMode("register"); setError(null); }} className="text-primary font-bold underline underline-offset-2">
                Registreer hier
              </button>
            </p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Al een account?{" "}
              <button onClick={() => { setMode("login"); setError(null); }} className="text-primary font-bold underline underline-offset-2">
                Log in
              </button>
            </p>
          )}
        </div>
        </>
        )}
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">
          <li>✓ Gratis</li>
          <li>✓ Groeit mee met je kind</li>
          <li>✓ Nooit kindergezichten</li>
        </ul>
      </div>
    </div>
  );
}
