"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Shield } from "lucide-react";

const SECTIES = [
  {
    titel: "1. Wie zijn wij?",
    tekst: `Noah & Emma is een online platform voor de verkoop en aankoop van tweedehands kinderkleding en speelgoed, gericht op ouders van kinderen van 0 tot 12 jaar. Wij hechten veel waarde aan de privacy van onze gebruikers en verwerken persoonsgegevens zorgvuldig en in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).

Contactgegevens: Noah & Emma, Nederland — support@noahemma.nl`,
  },
  {
    titel: "2. Welke gegevens verzamelen wij?",
    tekst: `Wij verzamelen de volgende persoonsgegevens:

• Accountgegevens: e-mailadres, naam, stad en optioneel een profielfoto.
• Kindgegevens: naam en geboortedatum van kinderen (voor maatfilters). Deze gegevens worden uitsluitend lokaal aan jouw account gekoppeld.
• Advertentiegegevens: productfoto's, beschrijvingen, prijzen en maten.
• Berichtgegevens: chats tussen kopers en verkopers.
• Beoordelingen: reviews na afgeronde transacties.
• Technische gegevens: apparaattype, browser, IP-adres (verwerkt via Supabase).`,
  },
  {
    titel: "3. Waarvoor gebruiken wij jouw gegevens?",
    tekst: `Wij gebruiken jouw gegevens uitsluitend voor:

• Het aanbieden en verbeteren van ons platform.
• Het mogelijk maken van contact tussen koper en verkoper.
• Het tonen van relevante advertenties op basis van kindprofielen en zoekgeschiedenis.
• Het sturen van notificaties (indien ingeschakeld door jou).
• Het naleven van wettelijke verplichtingen.

Wij verkopen jouw gegevens nooit aan derden.`,
  },
  {
    titel: "4. Kindgegevens en fotobescherming",
    tekst: `Noah & Emma neemt de bescherming van kinderen bijzonder serieus.

• Wij verbieden het plaatsen van herkenbare foto's van kinderen.
• Advertenties mogen uitsluitend productfoto's bevatten (zonder gezichten van kinderen).
• Kindgegevens (naam, geboortedatum) worden uitsluitend gebruikt voor maatadviezen en zijn niet zichtbaar voor andere gebruikers.
• AI-moderatie detecteert en verwijdert foto's met kindgezichten automatisch.`,
  },
  {
    titel: "5. Hoe lang bewaren wij jouw gegevens?",
    tekst: `• Accountgegevens worden bewaard zolang je account actief is.
• Na verwijdering van je account worden gegevens binnen 30 dagen permanent verwijderd.
• Berichtgeschiedenis wordt na 2 jaar automatisch geanonimiseerd.
• Wettelijk verplichte gegevens (bijv. boekhoudkundige gegevens) worden maximaal 7 jaar bewaard.`,
  },
  {
    titel: "6. Jouw rechten",
    tekst: `Op grond van de AVG heb je de volgende rechten:

• Inzagerecht: je kunt opvragen welke gegevens wij van je hebben.
• Correctierecht: je kunt onjuiste gegevens laten corrigeren.
• Verwijderingsrecht: je kunt verzoeken om verwijdering van jouw gegevens.
• Bezwaarrecht: je kunt bezwaar maken tegen bepaalde verwerkingen.
• Overdraagbaarheidsrecht: je kunt jouw gegevens in een standaardformaat opvragen.

Stuur een e-mail naar privacy@noahemma.nl om een van deze rechten uit te oefenen. Wij reageren binnen 30 dagen.`,
  },
  {
    titel: "7. Cookies en tracking",
    tekst: `Noah & Emma gebruikt functionele cookies die strikt noodzakelijk zijn voor het werken van de applicatie (ingelogd blijven, sessies bijhouden). Wij gebruiken geen tracking cookies van derden voor advertentiedoeleinden.`,
  },
  {
    titel: "8. Beveiliging",
    tekst: `Wij nemen passende technische en organisatorische maatregelen om jouw gegevens te beschermen:

• Alle gegevens worden versleuteld opgeslagen en verstuurd (TLS/SSL).
• Wij maken gebruik van Supabase (ISO 27001 gecertificeerd) als database-provider.
• Toegang tot persoonsgegevens is beperkt tot geautoriseerde medewerkers.
• Bij een datalek informeren wij jou en de Autoriteit Persoonsgegevens binnen 72 uur.`,
  },
  {
    titel: "9. Wijzigingen",
    tekst: `Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen. Bij ingrijpende wijzigingen ontvang je een melding in de app. De datum van de laatste wijziging staat onderaan deze pagina.`,
  },
  {
    titel: "10. Contact",
    tekst: `Heb je vragen over deze privacyverklaring of over de verwerking van jouw gegevens? Neem dan contact op:

E-mail: privacy@noahemma.nl
Adres: Noah & Emma, Nederland

Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl.`,
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Privacyverklaring</h1>
        </div>
      </header>

      <main className="px-5 pt-6 pb-10 max-w-2xl mx-auto space-y-8">
        {/* Intro banner */}
        <div className="bg-primary/10 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm text-primary-dark dark:text-primary">Jouw privacy is onze prioriteit</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Noah & Emma verwerkt geen persoonsgegevens van kinderen en verkoopt nooit jouw gegevens aan derden. Hier lees je precies wat we doen en waarom.
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
