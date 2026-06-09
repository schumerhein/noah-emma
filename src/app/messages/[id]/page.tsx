
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Star, MoreHorizontal, PlusCircle, Send, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ChatDetailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <div className="bg-slate-50 dark:bg-background-dark font-display min-h-screen flex flex-col max-w-md mx-auto relative h-screen">
      {/* iOS Status Bar Spacer */}
      <div className="h-11 px-8 flex justify-between items-center bg-white dark:bg-zinc-900 shrink-0">
        <div className="text-[15px] font-bold">9:41</div>
      </div>

      <nav className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => router.back()} className="p-1 -ml-1 text-primary">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 dark:border-zinc-700 shrink-0">
              <Image 
                alt="Sarah Avatar" 
                fill
                className="object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKxD9EHZ8Gwpmv1QrrUW31lPBARCZK9Zi9kl69xyKH_zcvdBnQlsN7xchcat9RlQne5QgiNx594n7r5kI7S0chmVUACQA2mqS6vDcDw1-bS3NwxFPIcCY60ZBw-PtFb6hBRDaNAVbowZoAXqzJE9kYPBXSw8JxNsuVtBF-Z9vrlmEV2z1KiLgqUR827r43oo7PkwlZY5KjuTP4622foKWP9z4f8SeCslpwWvw0Ztm4o4xUkvjbniQmC8B-mnfRv_lSWiL5L0MlLdI"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-[15px] leading-tight truncate">Sarah de Vries</h1>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-primary fill-primary" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">4.9 (124 reviews)</span>
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400 shrink-0">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <div className="flex justify-center">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">Vandaag</span>
        </div>

        <div className="flex flex-col gap-1 items-start max-w-[90%]">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-zinc-700 w-full">
            <p className="text-[14px] mb-4 text-slate-700 dark:text-slate-200">
              Je verzoek is geaccepteerd! Je kunt nu veilig de betaling afronden.
            </p>
            
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-xl flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded bg-white dark:bg-zinc-700 overflow-hidden border border-slate-100 dark:border-zinc-600 shrink-0">
                  <Image 
                    alt="Product" 
                    fill
                    className="object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjd9YgLZIgSRarb8eR2_xs9oF0D2poKqJubyiXIJNOSg6JQFPu4y_0Ct6pWTdTfRAq2PsIhE-O1RH-FP9RyEyLkZR1Ud5sCESpSTufKcjP-F-r1ZKO7tEOf8a6yVn4ZLzizXLP23pR5MOlR6PKb-1MYpMc0nA7LM5lGqav02DKhPYesHHIDCaTGhy0Z3fNlBoIw5rNehpAbIYNeYdkh-fmkR2-CKzxCPP_fz-EPVpyBov3VvSt--0JaD4fo3qEES1TBFP_GzjjM8k"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[13px] truncate">Biologisch Katoenen Babypakje</h3>
                  <p className="text-primary font-bold text-lg">€18,50</p>
                </div>
              </div>
              
              <Button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold h-12 rounded-xl transition-all shadow-md active:scale-[0.98] border-none"
              >
                Nu Betalen
              </Button>
              
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold">Kopersbescherming actief</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 ml-1">14:02</span>
        </div>

        <div className="flex justify-center px-6">
          <div className="flex items-start gap-2 bg-slate-200/40 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
            <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-left">
              Gebruik altijd de betaalknop voor kopersbescherming. Wij houden je geld veilig vast tot het pakketje binnen is.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 shrink-0 pb-32">
        <div className="flex items-center gap-3">
          <button className="text-primary/80">
            <PlusCircle className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-full px-4 py-2.5 flex items-center">
            <Input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-[15px] w-full p-0 h-auto placeholder-slate-400" 
              placeholder="Stuur een bericht..." 
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
