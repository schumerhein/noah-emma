"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";

const SECTIES = [
  {
    titel: "1. Wees eerlijk en respectvol",
    tekst: `Noah & Emma is een community van ouders. Behandel andere gebruikers zoals je zelf behandeld wilt worden.

• Communiceer vriendelijk en respectvol in de chat.
• Kom afspraken na die je maakt over ophalen en betalen.
• Reageer binnen een redelijke tijd op berichten.
• Beledigingen, intimidatie of discriminatie worden niet getolereerd.`,
  },
  {
    titel: "2. Bescherm kinderen — geen kinderfoto's",
    tekst: `De veiligheid van kinderen staat bij ons op nummer één.

• Plaats nooit foto's waarop kinderen herkenbaar in beeld zijn.
• Gebruik productfoto's van alleen het artikel, of laat Noah en Emma (onze AI-modellen) de kleding tonen.
• Deel geen persoonlijke gegevens van je kinderen in advertenties of chats.
• Advertenties met herkenbare kindergezichten worden automatisch verwijderd.`,
  },
  {
    titel: "3. Verkoop eerlijk",
    tekst: `Kopers moeten kunnen vertrouwen op wat ze zien.

• Beschrijf de werkelijke staat van het artikel, inclusief gebreken.
• Gebruik eigen foto's van het daadwerkelijke product.
• Verkoop alleen artikelen die je zelf bezit.
• Verkoop geen teruggeroepen, nagemaakte of onveilige producten.
• Het platform is uitsluitend voor kinderartikelen (0–12 jaar).`,
  },
  {
    titel: "4. Veilig afspreken en betalen",
    tekst: `Betaling en overdracht regelen koper en verkoper onderling.

• Spreek af op een openbare, veilige plek.
• Controleer het artikel bij het ophalen, vóór je betaalt.
• Betaal bij voorkeur bij overdracht — cash of Tikkie.
• Maak nooit geld over aan verkopers die je niet vertrouwt of die druk uitoefenen.
• Deel nooit je wachtwoord, pincodes of betaalgegevens via de chat.`,
  },
  {
    titel: "5. Meld wat niet klopt",
    tekst: `Help ons de marktplaats veilig te houden.

• Zie je een verdachte advertentie? Gebruik de meldknop op de productpagina.
• Gedraagt een gebruiker zich ongepast? Meld het profiel via de knop op de verkoperspagina.
• Wil je iemand niet meer tegenkomen? Blokkeer de gebruiker — die kan je dan geen berichten meer sturen.
• Bij vermoedens van oplichting kun je ook aangifte doen bij de politie via politie.nl.`,
  },
  {
    titel: "6. Wat gebeurt er bij overtredingen?",
    tekst: `Afhankelijk van de ernst van de overtreding kan Noah & Emma:

• Een waarschuwing geven.
• Advertenties verwijderen.
• Een account tijdelijk of permanent blokkeren.

Bij strafbare feiten doen wij melding bij de bevoegde autoriteiten. Vragen over deze richtlijnen? Mail naar support@noahemma.nl.`,
  },
];

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Richtlijnen voor de community</h1>
        </div>
      </header>

      <main className="px-5 pt-6 pb-10 max-w-2xl mx-auto space-y-8">
        {/* Intro */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-blue-800 dark:text-blue-200">Samen houden we het veilig</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Deze gedragsregels zorgen ervoor dat Noah &amp; Emma een veilige en fijne marktplaats blijft voor alle ouders — en vooral voor hun kinderen.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400">Laatste wijziging: 1 juni 2025</p>

        {SECTIES.map(sectie => (
          <section key={sectie.titel} className="space-y-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white">{sectie.titel}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {sectie.tekst}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
}
