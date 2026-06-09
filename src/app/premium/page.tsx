
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, MessageCircle, Crown, Clock, Headset, ShieldOff, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PremiumPage() {
  const router = useRouter();

  return (
    <div className="bg-background dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-primary/10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-extrabold tracking-tight">Premium</h1>
        <button className="p-2 -mr-2 text-primary">
          <MessageCircle className="w-5 h-5" />
        </button>
      </nav>

      <main className="px-6 pb-48 pt-20">
        <section className="text-center mb-10 pt-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Crown className="w-10 h-10 text-primary fill-primary" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Ontgrendel Alles</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            Slechts <span className="text-primary">€5 per maand</span> voor de beste ervaring.
          </p>
        </section>

        <div className="relative w-full h-48 mb-10 rounded-2xl overflow-hidden shadow-xl shadow-primary/10">
          <Image 
            alt="Premium kinderkleding" 
            fill
            className="object-cover" 
            src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxiYWJ5JTIwY2xvdGhlc3xlbnwwfHx8fDE3NzIyNzc0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <span className="text-white font-extrabold text-xl leading-tight">Krijg de beste deals als eerste</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { 
              icon: Sparkles, 
              title: "Onbeperkt Swipen", 
              desc: "Geen dagelijkse limieten. Swipe zoveel je wilt door de leukste items." 
            },
            { 
              icon: Clock, 
              title: "Vroege Toegang", 
              desc: "Bekijk en koop nieuwe advertenties 24 uur voordat de rest ze ziet." 
            },
            { 
              icon: Headset, 
              title: "Prioriteit Support", 
              desc: "Onze klantenservice staat altijd vooraan voor Premium leden." 
            },
            { 
              icon: ShieldOff, 
              title: "Geen Servicekosten", 
              desc: "Betaal 0% servicekosten op al je aankopen. Het verdient zichzelf terug.",
              highlight: true
            },
            { 
              icon: Sparkles, 
              title: "Smart Growth Alerts", 
              desc: "Ontvang meldingen wanneer items in de volgende maat van je kind beschikbaar komen." 
            }
          ].map((benefit, i) => (
            <div 
              key={i} 
              className={cn(
                "p-5 rounded-2xl border flex items-start gap-4 transition-all relative overflow-hidden shadow-sm",
                benefit.highlight 
                  ? "bg-primary/5 dark:bg-primary/10 border-primary/20" 
                  : "bg-white dark:bg-zinc-800/40 border-primary/5"
              )}
            >
              {benefit.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-3 py-1 font-extrabold uppercase tracking-wider rounded-bl-lg">
                  Bespaar direct
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white">{benefit.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-24 left-0 right-0 px-6 py-4 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 z-40">
        <div className="max-w-md mx-auto">
          <Button className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-extrabold text-lg rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform border-none">
            Upgrade Nu
          </Button>
          <button onClick={() => router.back()} className="w-full mt-3 text-slate-400 dark:text-slate-500 text-sm font-bold hover:text-primary transition-colors">
            Misschien later
          </button>
        </div>
      </div>
    </div>
  );
}
