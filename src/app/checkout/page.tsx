
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Home, Store, Lock, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [shipping, setShipping] = useState<'home' | 'point'>('home');

  return (
    <div className="bg-slate-100/40 dark:bg-background-dark font-display min-h-screen overflow-hidden flex flex-col justify-end">
      {/* Background Overlay */}
      <div className="fixed inset-0 z-0 flex flex-col items-center justify-center p-6 opacity-40 grayscale pointer-events-none">
        <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col relative">
          <Image 
            alt="Achtergrond mode" 
            fill
            className="object-cover blur-[2px]" 
            src="https://picsum.photos/seed/fashion/600/800"
          />
        </div>
      </div>

      <div className="fixed inset-0 z-10 bg-black/40 flex flex-col justify-end">
        <div className="bg-white dark:bg-zinc-900 w-full max-w-md mx-auto rounded-t-3xl shadow-2xl relative animate-in slide-in-from-bottom duration-300 pb-32">
          <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-9 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          
          <div className="px-6 pt-4 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Direct Kopen</h2>
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-primary/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-4 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  alt="Item afbeelding" 
                  fill
                  className="object-cover blur-[2px]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3wCvq_a1woAWD_WaIBNYHkfaS2TSjWf2TV7L8HMetK-MrFBVQOpPMFAgYr4-ng-AiCB7lEBr-5Yd9fIZiv5bF9YV5BXx37qXjo5cWXRMfCr7qSN6joDiMCdnwiByXu-CBAJEgaUqR50NFXO_D8h86Ob4LzWetRF53A0ukXyetYrQ0K-EK7yop3nbZlUvYcEC0tKIEyVuZ-couAWtYwRDzMfARecjxmx9Uqc5pHMuRTmpaUSY98Pab2X03oiAEw69o2PM0H3-vpWg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Tweedehands</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Vintage Zomerjurk</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Maat M • Uitstekende staat</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Verzending</label>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  onClick={() => setShipping('home')}
                  className={cn(
                    "border-2 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all",
                    shipping === 'home' ? "border-primary bg-primary/5" : "border-slate-100 dark:border-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Home className={cn("w-5 h-5", shipping === 'home' ? "text-primary" : "text-gray-400")} />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Thuisbezorgd</p>
                      <p className="text-xs text-gray-500">2-3 werkdagen • PostNL</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">€3,95</span>
                </div>
                
                <div 
                  onClick={() => setShipping('point')}
                  className={cn(
                    "border-2 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all",
                    shipping === 'point' ? "border-primary bg-primary/5" : "border-slate-100 dark:border-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Store className={cn("w-5 h-5", shipping === 'point' ? "text-primary" : "text-gray-400")} />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Afhaalpunt</p>
                      <p className="text-xs text-gray-500">3-4 werkdagen • DHL</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">€2,95</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Betaalmethode</label>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center overflow-hidden shrink-0">
                    <span className="text-[8px] font-black text-white">iDEAL</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">ABN AMRO **** 4291</p>
                    <p className="text-xs text-gray-500">Opgeslagen via abonnement</p>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotaal</span>
                <span className="text-gray-900 dark:text-white">€45,00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Verzendkosten</span>
                <span className="text-gray-900 dark:text-white">€{shipping === 'home' ? '3,95' : '2,95'}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-extrabold text-gray-900 dark:text-white">Totaal</span>
                <span className="text-2xl font-black text-primary">€{(45 + (shipping === 'home' ? 3.95 : 2.95)).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => router.push('/request-sent')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold h-14 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none"
              >
                <span>Betaal Nu</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed px-4">
                Door op 'Betaal Nu' te tikken, ga je akkoord met onze Algemene Voorwaarden. Uw aankoop is beschermd via de Kopersbescherming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
