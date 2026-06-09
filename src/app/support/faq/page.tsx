
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, HelpCircle, BookOpen, ShoppingBag, Tag, ShieldCheck, Settings, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const FAQ_DATA = [
  {
    category: "Algemeen",
    icon: BookOpen,
    items: [
      { id: "A01", q: "Wat is Noah & Emma?", a: "Noah & Emma is een Nederlandse app waar ouders tweedehands kinderkleding en accessoires kunnen kopen en verkopen. Het platform is speciaal gemaakt voor kinderen van 0 tot en met 12 jaar en combineert een slimme zoekfunctie met een leuke swipe-interface." },
      { id: "A02", q: "Voor wie is Noah & Emma bedoeld?", a: "De app is bedoeld voor ouders van kinderen van 0 tot en met 12 jaar in Nederland. Zowel kopers die slim willen shoppen als verkopers die kwalitatieve kleding een tweede leven willen geven, zijn welkom." },
      { id: "A03", q: "Is Noah & Emma beschikbaar in heel Nederland?", a: "Ja, de app is beschikbaar voor iedereen in Nederland. Voorlopig zijn we nog niet actief in België of andere landen, maar dat staat wel op de planning." },
      { id: "A04", q: "Is Noah & Emma gratis te gebruiken?", a: "Downloaden en een account aanmaken is gratis. Verkopen is ook gratis. Als koper kun je 10 keer per dag gratis swipen. Wil je onbeperkt swipen en gebruikmaken van extra functies? Dan neem je een abonnement voor €4,99 per maand." },
      { id: "A05", q: "Hoe verdient Noah & Emma geld?", a: "Noah & Emma heeft twee inkomstenbronnen: het koperabonnement van €4,99 per maand en betaalde boosts waarmee verkopers hun items meer zichtbaarheid kunnen geven." },
      { id: "A06", q: "Hoe verschilt Noah & Emma van Vinted of Marktplaats?", a: "Noah & Emma is volledig gericht op kinderkleding en accessoires, waardoor het aanbod veel relevanter is dan op grote generieke platforms. Dankzij het groeiprofiel zie je altijd items die passen bij de maat en leeftijd van jouw kind, zonder eindeloos te hoeven filteren." },
      { id: "A07", q: "Staan er echte kinderen op de productfoto's?", a: "Nee. Kleding wordt getoond op Noah en Emma, twee AI-gegenereerde kindermodellen. Zo beschermen we de privacy van kinderen en zorg jij er als verkoper voor dat je geen foto's van je eigen kind hoeft te plaatsen." },
      { id: "A08", q: "Is Noah & Emma duurzaam?", a: "Ja. Door kleding een tweede leven te geven, draag je bij aan minder verspilling en een meer circulaire economie. Elk item dat via Noah & Emma wordt verkocht, hoeft niet nieuw geproduceerd te worden." },
    ]
  },
  {
    category: "Account",
    icon: Settings,
    items: [
      { id: "A09", q: "Hoe maak ik een account aan?", a: "Download de app, klik op 'Account aanmaken' en vul je e-mailadres en wachtwoord in. Je kunt ook inloggen via je Google- of Apple-account." },
      { id: "A10", q: "Wat is een groeiprofiel?", a: "Een groeiprofiel is een profiel dat je aanmaakt voor jouw kind, met daarin de leeftijd, het geslacht en de huidige maat. De app gebruikt dit profiel om je alleen relevante items te tonen die nu passen." },
      { id: "A11", q: "Kan ik een groeiprofiel aanmaken voor meerdere kinderen?", a: "Ja, je kunt meerdere groeiprofielen aanmaken binnen één account. Zo shop je eenvoudig voor al je kinderen zonder telkens opnieuw te hoeven filteren." },
      { id: "A12", q: "Groeit het profiel automatisch mee met mijn kind?", a: "Ja. Op basis van de geboortedatum en het ingevoerde maatprofiel past de app het aanbod automatisch aan naarmate jouw kind groeit. Je krijgt ook een melding wanneer het tijd is om het profiel bij te werken." },
      { id: "A13", q: "Hoe wijzig ik mijn accountgegevens?", a: "Ga naar 'Mijn account' in de app en kies 'Gegevens bewerken'. Hier kun je je naam, e-mailadres, wachtwoord en adresgegevens aanpassen." },
      { id: "A14", q: "Hoe verwijder ik mijn account?", a: "Ga naar 'Mijn account', kies 'Instellingen' en vervolgens 'Account verwijderen'. Let op: na verwijdering zijn je gegevens en aankoophistorie niet meer beschikbaar." },
      { id: "A15", q: "Kan ik inloggen met Google of Apple?", a: "Ja, je kunt snel inloggen via je Google- of Apple-account. Je hoeft dan geen apart wachtwoord aan te maken." },
    ]
  },
  {
    category: "Kopen",
    icon: ShoppingBag,
    items: [
      { id: "K01", q: "Hoe werkt het swipen?", a: "Op de ontdekpagina zie je items die passen bij het groeiprofiel van jouw kind. Swipe naar rechts als je een item leuk vindt, naar links als je het overslaat. Items waar je rechts op swipt, worden bewaard in je verlanglijst." },
      { id: "K02", q: "Hoeveel keer kan ik gratis swipen per dag?", a: "Zonder abonnement kun je 10 keer per dag gratis swipen. De teller wordt elke dag om middernacht opnieuw ingesteld. Met een abonnement swipe je onbeperkt." },
      { id: "K03", q: "Wat kost het abonnement?", a: "Het abonnement kost €4,99 per maand. Je kunt het op elk moment opzeggen, zonder verdere verplichtingen." },
      { id: "K04", q: "Wat krijg ik met een abonnement?", a: "Met een abonnement swipe je onbeperkt, heb je toegang tot geavanceerde filters, krijg je als eerste meldingen van nieuw aanbod dat past bij jouw groeiprofiel en profiteer je van exclusieve kortingsacties." },
      { id: "K05", q: "Hoe zeg ik mijn abonnement op?", a: "Ga naar 'Mijn account', kies 'Abonnement' en klik op 'Opzeggen'. Je abonnement blijft actief tot het einde van de lopende betaalperiode." },
      { id: "K06", q: "Hoe betaal ik voor een aankoop?", a: "Betalen gaat via iDEAL, creditcard of PayPal. De betaling verloopt veilig via de app, je betaalt nooit rechtstreeks aan de verkoper." },
      { id: "K07", q: "Wanneer wordt mijn bestelling verstuurd?", a: "De verkoper verstuurt het item binnen 3 werkdagen na jouw betaling. Je ontvangt een melding zodra het pakket onderweg is." },
      { id: "K08", q: "Hoe wordt mijn aankoop bezorgd?", a: "De verkoper kiest zelf een verzendmethode. In de productpagina zie je welke verzenddienst wordt gebruikt en wat de verzendkosten zijn." },
    ]
  },
  {
    category: "Verkopen",
    icon: Tag,
    items: [
      { id: "V01", q: "Hoe bied ik een item aan?", a: "Ga naar 'Verkopen' in de app, upload foto's van het item, vul de beschrijving in en stel een prijs in. Na controle door ons systeem wordt jouw advertentie zichtbaar voor kopers." },
      { id: "V02", q: "Wat kost het om te verkopen?", a: "Verkopen is gratis. Je betaalt alleen als je je item wilt boosten voor meer zichtbaarheid." },
      { id: "V06", q: "Wat is een boost en hoe werkt het?", a: "Met een boost geef je jouw item meer zichtbaarheid in de ontdekfeed van kopers. Je kiest voor 3 dagen (€2,99) of 7 dagen (€4,99). Een geboost item wordt vaker getoond aan relevante kopers." },
      { id: "V08", q: "Hoe en wanneer word ik uitbetaald?", a: "Na bevestiging van ontvangst door de koper wordt het verkoopbedrag binnen 3 werkdagen overgemaakt naar jouw opgegeven bankrekening. Je voegt je IBAN toe via 'Mijn account'." },
      { id: "V09", q: "Wat zijn de verkoopkosten of commissies?", a: "Noah & Emma rekent geen verkoopcommissie. Het volledige verkoopbedrag (minus eventuele verzendkosten) wordt aan jou uitbetaald." },
    ]
  },
  {
    category: "Veiligheid",
    icon: ShieldCheck,
    items: [
      { id: "S01", q: "Hoe weet ik of een verkoper betrouwbaar is?", a: "Elke verkoper heeft een profiel met beoordelingen van eerdere kopers. Hoe meer positieve reviews, hoe betrouwbaarder de verkoper. Je kunt het profiel bekijken voordat je een aankoop doet." },
      { id: "S04", q: "Hoe beschermt Noah & Emma mijn persoonsgegevens?", a: "Noah & Emma verwerkt je gegevens conform de AVG. Je gegevens worden nooit verkocht aan derden. Lees ons volledige privacybeleid via 'Instellingen' in de app." },
      { id: "S05", q: "Waarom staan er geen echte kinderen op het platform?", a: "We vinden de privacy en veiligheid van kinderen het allerbelangrijkst. Daarom tonen we kleding uitsluitend op onze AI-modellen Noah en Emma, zodat er nooit herleidbare beelden van kinderen op het platform verschijnen." },
    ]
  }
];

export default function FAQPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Algemeen");

  const filteredData = FAQ_DATA.filter(cat => 
    activeCategory === "Alle" || cat.category === activeCategory
  ).map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(search.toLowerCase()) || 
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="bg-background min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-4 border-b border-primary/10 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight">Veelgestelde vragen</h1>
          <div className="w-10"></div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
            placeholder="Zoek een vraag..."
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 pb-32 no-scrollbar">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
          {["Alle", ...FAQ_DATA.map(d => d.category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white dark:bg-slate-800 text-slate-500 border-primary/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredData.length > 0 ? filteredData.map((section) => (
            <section key={section.category} className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <section.icon className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">{section.category}</h2>
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-3">
                {section.items.map((item) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id}
                    className="bg-white dark:bg-slate-800/40 rounded-2xl border border-primary/5 shadow-sm px-4 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left py-4 hover:no-underline font-bold text-[14px] text-slate-800 dark:text-slate-100">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <HelpCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">Geen resultaten gevonden</p>
              <p className="text-xs mt-1">Probeer een andere zoekterm.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
