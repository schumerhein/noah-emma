"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    vraag: "Hoe kan ik een artikel plaatsen?",
    antwoord: "Tik op de + knop onderaan het scherm. Voeg minimaal één foto toe, vul de titel, prijs, maat en conditie in en tik op 'Product plaatsen'. Je advertentie is direct zichtbaar voor andere gebruikers.",
  },
  {
    vraag: "Hoe werkt kopen en verkopen op Noah & Emma?",
    antwoord: "Noah & Emma werkt zoals Marktplaats: koper en verkoper spreken zelf een prijs en afhaalmethode af via het chatgesprek. Je betaalt direct aan de verkoper — via iDEAL, Tikkie of contant bij ophalen. Wij verwerken geen betalingen.",
  },
  {
    vraag: "Kan ik een bod doen op een artikel?",
    antwoord: "Ja! Op de productpagina zie je een 'Bod'-knop. Vul een bedrag in — of gebruik de snelknoppen (-10%, -20%, -30%) — en de verkoper ontvangt jouw bod als chatbericht. De verkoper kan accepteren, afwijzen of een tegenbod doen.",
  },
  {
    vraag: "Hoe geef ik een beoordeling?",
    antwoord: "Zodra de verkoper de deal afsluit via het gesprek, verschijnt er een 'Geef beoordeling'-knop voor beide partijen. Je kunt 1–5 sterren geven en een korte tekst toevoegen. Beoordelingen zijn direct zichtbaar op het profiel van de andere gebruiker.",
  },
  {
    vraag: "Waarom zijn foto's van kinderen niet toegestaan?",
    antwoord: "Noah & Emma beschermt de privacy van kinderen. Foto's met herkenbare kindergezichten zijn niet toegestaan. Gebruik in plaats daarvan productvideo's of ons AI-model Noah of Emma om de kleding te presenteren.",
  },
  {
    vraag: "Hoe kan ik mijn advertentie tijdelijk verbergen?",
    antwoord: "Ga naar je profiel → schakel 'Vakantiestand' in. Al je advertenties worden tijdelijk onzichtbaar voor andere gebruikers. Zet je vakantiestand uit om ze weer actief te maken.",
  },
  {
    vraag: "Hoe blokkeer ik een gebruiker?",
    antwoord: "Ga naar het profiel van de gebruiker en tik op de drie puntjes (⋯) rechtsboven. Kies 'Blokkeren'. De gebruiker kan je dan geen berichten meer sturen en jouw advertenties niet meer zien. Je kunt blokkades beheren via Instellingen → Geblokkeerde gebruikers.",
  },
  {
    vraag: "Hoe meld ik een verdachte advertentie?",
    antwoord: "Op elke productpagina staat onderaan een meldknop (vlag-icoon). Kies een reden en bevestig. Onze moderators bekijken de melding zo snel mogelijk. Bij dringende gevallen kun je ook contact opnemen via de Helpdesk.",
  },
  {
    vraag: "Kan ik een verkoper volgen?",
    antwoord: "Ja! Ga naar het openbare profiel van een verkoper en tik op 'Volgen'. Je ziet hun nieuwe advertenties dan eerder in jouw feed. Je kunt gevolgde verkopers beheren via je profielpagina.",
  },
  {
    vraag: "Hoe stel ik een zoekwaarschuwing in?",
    antwoord: "Zoek op een zoekterm in de zoekpagina en tik op 'Alert aan' rechtsboven. Als er een nieuw artikel beschikbaar komt dat matcht, ontvang je een melding. Je kunt je actieve zoekwaarschuwingen beheren via Notificaties → Zoekwaarschuwingen.",
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Noah & Emma FAQ</h1>
        </div>
      </header>

      <main className="pt-2">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left active:bg-slate-50 dark:active:bg-slate-800"
            >
              <span className="text-[16px] text-slate-900 dark:text-white pr-4 leading-snug">{item.vraag}</span>
              <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform", open === idx ? "rotate-180" : "")} />
            </button>
            {open === idx && (
              <div className="px-6 pb-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.antwoord}</p>
              </div>
            )}
          </div>
        ))}

        <div className="px-6 py-8 text-center space-y-3">
          <p className="text-sm text-slate-400">Staat jouw vraag er niet bij?</p>
          <button
            onClick={() => router.push("/helpdesk")}
            className="bg-primary text-white font-bold px-6 py-3 rounded-xl text-sm"
          >
            Neem contact op met de Helpdesk
          </button>
        </div>
      </main>
    </div>
  );
}
