
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  const handleBypass = () => {
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      {/* Header Logo Section */}
      <div className="flex flex-col items-center pt-16 pb-10">
        <h2 className="text-accent text-2xl font-bold tracking-[0.2em] uppercase">NOAH & EMMA</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">De premium marketplace voor kinderen</p>
      </div>

      <div className="flex-1 px-6 max-w-[480px] mx-auto w-full pb-10">
        {/* Welcome Text */}
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">Welkom terug</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Log in om verder te gaan met groeien.</p>
        </div>

        {/* Social Logins */}
        <div className="flex gap-3 mb-8">
          <div className="flex gap-3 w-full">
            <button className="flex-1 flex items-center justify-center gap-2 h-14 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-red-500">google</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 h-14 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
              <span className="material-symbols-outlined">ios</span>
              <span className="font-semibold text-sm">Apple</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">of</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">E-mailadres</label>
            <input 
              className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none" 
              placeholder="naam@voorbeeld.nl" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold">Wachtwoord</label>
              <a className="text-accent text-sm font-semibold hover:underline" href="#">Wachtwoord vergeten?</a>
            </div>
            <div className="relative">
              <input 
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" type="button">
                <span className="material-symbols-outlined text-xl">visibility</span>
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center py-2">
            <input className="w-5 h-5 rounded border-slate-300 text-accent focus:ring-accent" id="remember" type="checkbox"/>
            <label className="ml-3 text-slate-600 dark:text-slate-400 text-sm font-medium" htmlFor="remember">Houd mij ingelogd</label>
          </div>

          {/* Main Login Button */}
          <button 
            className="w-full h-14 bg-accent text-white rounded-xl font-bold text-lg premium-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4" 
            type="submit"
          >
            <span>Inloggen</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        {/* Bypass/Skip Option */}
        <button 
          onClick={handleBypass}
          className="w-full h-14 mt-4 border-2 border-accent/20 text-accent rounded-xl font-bold text-lg hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
        >
          <span>Doorgaan als gast</span>
          <span className="material-symbols-outlined text-xl">person_search</span>
        </button>

        {/* Footer Links */}
        <div className="mt-12 text-center flex flex-col gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Nog geen account? <a className="text-accent font-bold hover:underline" href="#">Registreer hier</a>
          </p>
          <div className="flex justify-center gap-6 mt-4 opacity-60">
            <a className="text-slate-500 text-xs font-medium hover:text-accent transition-colors underline decoration-slate-300 underline-offset-4" href="#">Privacy Policy</a>
            <a className="text-slate-500 text-xs font-medium hover:text-accent transition-colors underline decoration-slate-300 underline-offset-4" href="#">Algemene Voorwaarden</a>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-[-100px] right-[-50px] w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-accent/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}
