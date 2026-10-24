import type { Metadata } from "next";
import { JuridischePagina } from "@/components/marketing/JuridischePagina";
import { SITE_URL } from "@/components/marketing/links";

export const metadata: Metadata = {
  title: "Communityrichtlijnen | Noah & Emma",
  description: "De gedragsregels van Noah & Emma: eerlijk handelen, respectvol contact, nooit kindergezichten en wat je doet als iets niet klopt.",
  alternates: { canonical: `${SITE_URL}/community` },
};
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

Bij strafbare feiten doen wij melding bij de bevoegde autoriteiten. Vragen over deze richtlijnen? Mail naar info@noah-emma.nl.`,
  },
];

export default function CommunityPagina() {
  return (
    <JuridischePagina
      naam="Communityrichtlijnen"
      pad="/community"
      titel="Richtlijnen voor de community"
      intro="Deze gedragsregels zorgen ervoor dat Noah & Emma een veilige en fijne plek blijft voor alle ouders, en vooral voor hun kinderen."
      datum="Laatste wijziging: 1 juni 2025"
      secties={SECTIES}
    />
  );
}
