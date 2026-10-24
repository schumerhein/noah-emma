import { JuridischePagina } from "@/components/marketing/JuridischePagina";
const SECTIES = [
  {
    titel: "1. Wie zijn wij?",
    tekst: `Noah & Emma is een online platform voor de verkoop en aankoop van tweedehands kinderkleding en speelgoed, gericht op ouders van kinderen van 0 tot 12 jaar. Wij hechten veel waarde aan de privacy van onze gebruikers en verwerken persoonsgegevens zorgvuldig en in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).

Contactgegevens: Noah & Emma, Nederland — info@noah-emma.nl`,
  },
  {
    titel: "2. Welke gegevens verzamelen wij?",
    tekst: `Wij verzamelen de volgende persoonsgegevens:

• Accountgegevens: e-mailadres, naam, stad en optioneel een profielfoto.
• Kindgegevens: naam en geboortedatum van kinderen (voor maatfilters). Deze gegevens worden uitsluitend lokaal aan jouw account gekoppeld.
• Advertentiegegevens: productfoto's, beschrijvingen, prijzen en maten.
• Berichtgegevens: chats tussen kopers en verkopers.
• Beoordelingen: reviews na afgeronde transacties.
• Betaalgegevens: als je een Premium-abonnement of Boost afneemt, verwerkt onze betaaldienstverlener Mollie de betaling. Wij zien en bewaren zelf nooit je volledige kaart- of rekeninggegevens — enkel het transactiebedrag, de datum en een betalingsstatus, nodig voor onze boekhouding.
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
• Elke advertentie wordt vóór publicatie beoordeeld (handmatig en/of automatisch). Foto's met herkenbare kindergezichten worden geweigerd of verwijderd.`,
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

Stuur een e-mail naar info@noah-emma.nl om een van deze rechten uit te oefenen. Wij reageren binnen 30 dagen.`,
  },
  {
    titel: "7. Cookies en tracking",
    tekst: `Noah & Emma gebruikt functionele cookies die strikt noodzakelijk zijn voor het werken van de applicatie (ingelogd blijven, sessies bijhouden). Alleen als je daar toestemming voor geeft, gebruiken we Google Analytics om te meten hoe de website en app gebruikt worden. De grondslag is jouw toestemming; je kunt die altijd intrekken via "Cookie-instellingen". Google slaat daarbij geen IP-adressen op, gebruikt de gegevens niet voor advertenties en bewaart ze maximaal 14 maanden. Wij gebruiken geen tracking cookies van derden voor advertentiedoeleinden. Alle cookies staan in ons cookiebeleid op noah-emma.nl/cookies.`,
  },
  {
    titel: "8. Beveiliging en derde partijen",
    tekst: `Wij nemen passende technische en organisatorische maatregelen om jouw gegevens te beschermen:

• Alle gegevens worden versleuteld opgeslagen en verstuurd (TLS/SSL).
• Wij maken gebruik van Supabase (ISO 27001 gecertificeerd) als database-provider.
• Voor het verwerken van betalingen (Premium en Boost) maken wij gebruik van Mollie B.V., een in Nederland gevestigde, vergunninghoudende betaaldienstverlener. Mollie verwerkt jouw betaalgegevens voor eigen rekening als zelfstandig verwerkingsverantwoordelijke — zie het privacybeleid van Mollie op mollie.com/privacy.
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

E-mail: info@noah-emma.nl
Adres: Noah & Emma, Nederland

Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl.`,
  },
];

export default function PrivacyPagina() {
  return (
    <JuridischePagina
      naam="Privacyverklaring"
      pad="/privacy"
      titel="Privacyverklaring"
      intro="We verkopen nooit jouw gegevens aan derden en er komen nooit kindergezichten in de app. Hier lees je precies welke gegevens we verwerken, waarom en wat jouw rechten zijn."
      datum="Laatste wijziging: 4 september 2026"
      secties={SECTIES}
    />
  );
}
