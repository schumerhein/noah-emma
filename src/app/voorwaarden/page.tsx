"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";

const SECTIES = [
  {
    titel: "1. Definities",
    tekst: `In deze algemene voorwaarden wordt verstaan onder:

• Platform: de website en applicatie Noah & Emma (noahemma.nl).
• Gebruiker: iedere persoon die een account aanmaakt op het platform.
• Verkoper: een gebruiker die advertenties plaatst voor de verkoop van producten.
• Koper: een gebruiker die een product aanschaft via het platform.
• Advertentie: een door de verkoper geplaatste aanbieding van een product.
• Transactie: de overeenkomst die tot stand komt tussen koper en verkoper.`,
  },
  {
    titel: "2. Toepasselijkheid",
    tekst: `Deze algemene voorwaarden zijn van toepassing op elk gebruik van het Noah & Emma platform. Door een account aan te maken, ga je akkoord met deze voorwaarden. Noah & Emma behoudt zich het recht voor deze voorwaarden te wijzigen. Bij ingrijpende wijzigingen word je hierover via de app geïnformeerd.`,
  },
  {
    titel: "3. Het platform",
    tekst: `Noah & Emma is een marktplaats waarop particulieren tweedehands kinderartikelen kunnen kopen en verkopen. Noah & Emma treedt uitsluitend op als bemiddelaar en is geen partij bij de overeenkomst tussen koper en verkoper.

Noah & Emma is niet verantwoordelijk voor:
• De kwaliteit, nauwkeurigheid of rechtmatigheid van advertenties.
• Het nakomen van afspraken tussen koper en verkoper.
• Schade die voortvloeit uit transacties tussen gebruikers.`,
  },
  {
    titel: "4. Registratie en account",
    tekst: `• Je moet minimaal 18 jaar oud zijn om een account aan te maken.
• Je bent verantwoordelijk voor de juistheid van jouw accountgegevens.
• Je bent verantwoordelijk voor de beveiliging van jouw account en wachtwoord.
• Noah & Emma mag accounts blokkeren of verwijderen bij overtreding van deze voorwaarden.
• Per persoon is slechts één account toegestaan.`,
  },
  {
    titel: "5. Advertenties plaatsen",
    tekst: `Als verkoper verklaar je dat:

• Je gerechtigd bent het product te verkopen.
• Het product daadwerkelijk in jouw bezit is.
• De beschrijving en foto's het product accuraat weergeven.
• Het product vrij is van verborgen gebreken die niet zijn vermeld.

Verboden producten (niet limitatief):
• Producten die teruggroepen zijn vanwege veiligheidsrisico's.
• Nagemaakte of vervalste producten.
• Producten met schade die niet vermeld is.
• Niet-kinderartikelen (het platform is uitsluitend voor kinderproducten).

Verboden afbeeldingen:
• Foto's met herkenbare gezichten van kinderen zijn strikt verboden. Elke advertentie wordt vóór publicatie beoordeeld (handmatig en/of automatisch); advertenties die deze regel overtreden worden geweigerd of verwijderd.`,
  },
  {
    titel: "6. Transacties",
    tekst: `• Kopers en verkopers spreken betaling en levering onderling af.
• Noah & Emma verwerkt geen betalingen en biedt geen kopersbescherming.
• De verkoper is verantwoordelijk voor de juiste levering van het product.
• Bij geschillen tussen koper en verkoper kan Noah & Emma bemiddelen, maar is hiertoe niet verplicht.
• Verkoper dient de deal af te sluiten via het platform zodra de transactie is voltooid.`,
  },
  {
    titel: "7. Beoordelingen",
    tekst: `• Na het afronden van een transactie kunnen koper en verkoper elkaar beoordelen.
• Beoordelingen dienen eerlijk, oprecht en gebaseerd op de werkelijke ervaring te zijn.
• Het is verboden beoordelingen te manipuleren of nep-reviews te plaatsen.
• Noah & Emma behoudt het recht onjuiste of beledigende beoordelingen te verwijderen.`,
  },
  {
    titel: "8. Verboden gedrag",
    tekst: `Het is verboden om:

• Valse of misleidende informatie te verstrekken.
• Spam, phishing of andere vormen van online fraude te plegen.
• Het platform te gebruiken voor commerciële doeleinden (uitsluitend particuliere verkoop).
• Persoonsgegevens van andere gebruikers te misbruiken.
• Prijsafspraken te maken buiten het platform om na eerste contact via Noah & Emma.
• Accounts te hacken of te manipuleren.

Bij overtreding kan je account zonder waarschuwing worden geblokkeerd.`,
  },
  {
    titel: "9. Aansprakelijkheid",
    tekst: `Noah & Emma is niet aansprakelijk voor:

• Schade als gevolg van transacties tussen gebruikers.
• Het niet nakomen van afspraken door koper of verkoper.
• Technische storingen of tijdelijke onbeschikbaarheid van het platform.
• Verlies van gegevens door omstandigheden buiten onze macht.

De aansprakelijkheid van Noah & Emma is in alle gevallen beperkt tot het bedrag dat in de voorgaande 12 maanden door de gebruiker aan Noah & Emma is betaald.`,
  },
  {
    titel: "10. Intellectueel eigendom",
    tekst: `• Alle rechten op de Noah & Emma naam, logo's en software berusten bij Noah & Emma.
• Door het plaatsen van foto's en teksten geef je Noah & Emma het recht deze te tonen op het platform.
• Je behoudt het eigendom van je eigen content.
• Het is verboden content van andere gebruikers te kopiëren of te gebruiken zonder toestemming.`,
  },
  {
    titel: "11. Toepasselijk recht",
    tekst: `Op deze voorwaarden is uitsluitend Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland. Consumenten kunnen ook een klacht indienen via het Europees platform voor onlinegeschillenbeslechting (ec.europa.eu/consumers/odr).`,
  },
  {
    titel: "12. Contact",
    tekst: `Voor vragen over deze algemene voorwaarden kun je contact opnemen via:

E-mail: info@noahemma.nl
Adres: Noah & Emma, Nederland`,
  },
];

export default function VoorwaardenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Algemene voorwaarden</h1>
        </div>
      </header>

      <main className="px-5 pt-6 pb-10 max-w-2xl mx-auto space-y-8">
        {/* Intro banner */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800 dark:text-white">Algemene voorwaarden Noah & Emma</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Door gebruik te maken van ons platform ga je akkoord met deze voorwaarden. Lees ze zorgvuldig door.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400">Versie 1.0 · Ingangsdatum: 1 juni 2025</p>

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
