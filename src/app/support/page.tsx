
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Search, ChevronDown, ChevronUp, Bot, MessageCircle, Mic, Mail, HelpCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PREVIEW_FAQS = [
  {
    id: 1,
    question: "Wat is Noah & Emma?",
    answer: "Noah & Emma is een Nederlandse app waar ouders tweedehands kinderkleding en accessoires kunnen kopen en verkopen.",
    category: "Algemeen"
  },
  {
    id: 2,
    question: "Wat is een groeiprofiel?",
    answer: "Een groeiprofiel is een profiel voor je kind dat de app gebruikt om alleen relevante items in de juiste maat te tonen.",
    category: "Account"
  },
  {
    id: 3,
    question: "Hoef ik foto's van mijn kind te maken?",
    answer: "Nee. De app plaatst jouw foto van het kledingstuk automatisch op Noah of Emma, onze AI-modellen, om de privacy te beschermen.",
    category: "Privacy"
  }
];

export default function SupportPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen relative overflow-hidden flex flex-col">
        <header className="px-6 pt-12 pb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-primary/10 transition-colors">
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Klantenservice</h1>
            <div className="w-10"></div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              onClick={() => router.push('/support/faq')}
              className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800/50 border-none rounded-xl shadow-sm ring-1 ring-primary/10 focus:ring-2 focus:ring-primary transition-all text-sm font-medium cursor-pointer" 
              placeholder="Zoek in de FAQ..." 
              readOnly
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
          <section className="mt-4">
            <div 
              onClick={() => router.push('/support/faq')}
              className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-5 rounded-2xl flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white">Volledige FAQ</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Vind elk antwoord</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-primary -rotate-90" />
            </div>

            <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-4 px-1">Populaire vragen</h2>
            
            <div className="space-y-3">
              {PREVIEW_FAQS.map((faq) => (
                <div 
                  key={faq.id}
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className={cn(
                    "p-5 rounded-xl shadow-sm transition-all duration-300 border border-transparent cursor-pointer",
                    openFaq === faq.id 
                      ? "bg-white dark:bg-slate-800/80 border-primary/20" 
                      : "bg-white/70 dark:bg-slate-800/40 backdrop-blur-md"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px]">{faq.question}</h3>
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary/40" />
                    )}
                  </div>
                  {openFaq === faq.id && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center gap-2 mb-6 px-1">
              <Bot className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Chat met onze AI</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div 
                onClick={() => router.push('/support/ai-chat')}
                className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary to-[#ff7eb3] text-white shadow-xl shadow-primary/20 cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                  <MessageCircle className="w-[120px] h-[120px]" />
                </div>
                <div className="relative z-10 flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">Beschikbaar 24/7</span>
                  <h3 className="text-2xl font-black mb-1">Chat nu</h3>
                  <p className="text-sm font-medium opacity-90 max-w-[200px]">Onmiddellijk antwoord op al je vragen via onze slimme AI.</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full w-fit transition-all">
                    <span className="text-xs font-bold uppercase">Start gesprek</span>
                    <Bot className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-primary/10 shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Bel Noah</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Spreek direct met onze stem-assistent.</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-primary/10 shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Mail Emma</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Stuur ons een bericht per e-mail.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-12 text-center pb-8">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Noah & Emma v3.0.0</p>
          </div>
        </main>
      </div>
    </div>
  );
}
