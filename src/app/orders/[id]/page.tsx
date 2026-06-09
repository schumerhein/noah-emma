
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Truck, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderDetailsPage() {
  const router = useRouter();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="pt-12 pb-6 px-6 flex items-center justify-between z-10 border-b border-slate-50 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-earthy-cream dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Verzendgegevens</h1>
        </div>
        <button className="text-primary-dark font-bold text-sm">Hulp</button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8 no-scrollbar pb-32">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
            <Truck className="w-8 h-8 text-primary-dark" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">Tijd om te verzenden!</h2>
          <p className="text-slate-500 text-sm px-4">Je hebt een deal gesloten. Print het label en breng het pakketje binnen 3 dagen naar een afgiftepunt.</p>
        </div>

        <div className="p-6 rounded-xl flex flex-col items-center gap-4 bg-primary/5 relative">
          <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-xl pointer-events-none"></div>
          
          <Button className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-14 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-primary/20 border-none">
            <Download className="w-5 h-5" />
            Download Verzendlabel
          </Button>
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">PDF • 142 KB</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Verzendadres</h3>
          <div className="bg-earthy-cream/50 dark:bg-zinc-800/50 p-5 rounded-xl border border-earthy-cream dark:border-zinc-800">
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-slate-400 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Sanne de Vries</span>
                <span className="text-slate-600 dark:text-slate-400">Utrechtseweg 12</span>
                <span className="text-slate-600 dark:text-slate-400">3512 AZ Utrecht</span>
                <span className="text-slate-600 dark:text-slate-400">Nederland</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Verkocht Item</h3>
          <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-100 dark:border-zinc-800">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              <Image 
                alt="Gebreide Kindertrui" 
                fill 
                className="object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGGjHyTEbkis-GYLPiBOWAAa9DGpKITHDnKZQzm7Lb2yKljhXt42JYawWkW39Sbo_O17P5lwQelV8Yn-551qC6E6IZWHA_RH1cxa2LlrfecbfAJ3S2Jgr5oGfmGk9THyG8G8EnDZrZ6DOIV5p_hpp2Wn2kWZpARZQVohKp-JErztQ3cDc8WPGOtUnOIVHHKdcxzSqvqOTfnB3bBY1i4RqUIpv39jYM1woyB2jx_V7qSzSPoMqBNDSZJ_I8-MTeA3P1XK8I5PMw7gY" 
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Gebreide Kindertrui</h4>
              <div className="flex gap-2 mt-1">
                <span className="text-xs font-medium text-slate-500">Maat 92</span>
                <span className="text-xs font-medium text-slate-500">•</span>
                <span className="text-xs font-medium text-slate-500">Beige</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary-dark font-extrabold">€18,50</span>
                <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase">Betaald</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
