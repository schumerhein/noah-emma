import { PREMIUM_PRIJS } from "@/lib/prijzen";

// De teksten van de juridische pagina's, op één plek. De website toont ze
// via JuridischePagina (/voorwaarden, /privacy, ...), de app in zijn eigen
// opmaak onder /instellingen/juridisch, zodat je in de app blijft.

export interface JuridischeSectie {
  titel: string;
  tekst: string;
}

export interface JuridischDocument {
  slug: "voorwaarden" | "privacy" | "cookies" | "community";
  /** Pad van de websiteversie */
  pad: string;
  naam: string;
  titel: string;
  /** Korte omschrijving voor in overzichten */
  kort: string;
  intro: string;
  datum: string;
  secties: JuridischeSectie[];
}

const PREMIUM_PRIJS_TEKST = `€${PREMIUM_PRIJS.toFixed(2).replace(".", ",")}`;

const VOORWAARDEN_SECTIES: JuridischeSectie[] = [
  {
    titel: "1. Definities",
    tekst: `In deze algemene voorwaarden wordt verstaan onder:

• Platform: de website en applicatie Noah & Emma (noah-emma.nl).
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
    titel: "6. Transacties tussen gebruikers",
    tekst: `• Kopers en verkopers spreken betaling en levering van tweedehands artikelen onderling af.
• Voor deze onderlinge transacties verwerkt Noah & Emma zelf geen betaling en biedt het platform geen kopersbescherming — zie artikel 7 voor de betaalde functies die Noah & Emma wél zelf afhandelt.
• De verkoper is verantwoordelijk voor de juiste levering van het product.
• Bij geschillen tussen koper en verkoper kan Noah & Emma bemiddelen, maar is hiertoe niet verplicht.
• Verkoper dient de deal af te sluiten via het platform zodra de transactie is voltooid.`,
  },
  {
    titel: "7. Premium-abonnement en Boost",
    tekst: `Naast de gratis marktplaats biedt Noah & Emma twee betaalde functies aan die rechtstreeks door Noah & Emma worden geleverd en afgerekend, via onze betaalverwerker Mollie:

• Premium: een doorlopend maandabonnement (momenteel ${PREMIUM_PRIJS_TEKST} per maand) voor onbeperkt swipen, volledig zoeken en filteren, en zoekwaarschuwingen. Het abonnement wordt maandelijks automatisch verlengd totdat je opzegt, en is op elk moment opzegbaar via de app — je Premium blijft dan actief tot het einde van de lopende, al betaalde periode.
• Boost: een eenmalige betaling om een advertentie voor een gekozen periode meer zichtbaarheid te geven.

Prijzen kunnen wijzigen; een wijziging geldt nooit met terugwerkende kracht voor een periode die je al hebt betaald.

Herroepingsrecht: als consument heb je normaal gesproken 14 dagen bedenktijd bij een aankoop op afstand. Omdat Premium en Boost direct na betaling worden geactiveerd en je de dienst dus meteen gebruikt, ga je door de betaling akkoord met onmiddellijke levering en doe je uitdrukkelijk afstand van dit herroepingsrecht zodra de dienst is geleverd, conform artikel 6:230p sub d BW. Is er iets misgegaan met een betaling of activatie, neem dan contact op — zie artikel 13.`,
  },
  {
    titel: "8. Beoordelingen",
    tekst: `• Na het afronden van een transactie kunnen koper en verkoper elkaar beoordelen.
• Beoordelingen dienen eerlijk, oprecht en gebaseerd op de werkelijke ervaring te zijn.
• Het is verboden beoordelingen te manipuleren of nep-reviews te plaatsen.
• Noah & Emma behoudt het recht onjuiste of beledigende beoordelingen te verwijderen.`,
  },
  {
    titel: "9. Verboden gedrag",
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
    titel: "10. Aansprakelijkheid",
    tekst: `Noah & Emma is niet aansprakelijk voor:

• Schade als gevolg van transacties tussen gebruikers.
• Het niet nakomen van afspraken door koper of verkoper.
• Technische storingen, onderhoud of tijdelijke onbeschikbaarheid van het platform.
• Verlies van gegevens door omstandigheden buiten onze macht.
• Overmacht: omstandigheden buiten redelijke controle van Noah & Emma, waaronder storingen bij Mollie, Supabase of andere leveranciers waar het platform van afhankelijk is.
• Indirecte schade, gevolgschade of gederfde winst, ook niet wanneer Noah & Emma op de mogelijkheid daarvan is gewezen.

Niets in deze voorwaarden beperkt aansprakelijkheid voor schade die het gevolg is van opzet of bewuste roekeloosheid van Noah & Emma zelf, of voor zover dwingend consumentenrecht een verdergaande beperking niet toestaat. Voor het overige is de aansprakelijkheid van Noah & Emma in alle gevallen beperkt tot het bedrag dat in de voorgaande 12 maanden door de gebruiker aan Noah & Emma is betaald.

Gebruikers vrijwaren Noah & Emma voor aanspraken van derden die verband houden met hun advertenties, transacties of ander gebruik van het platform in strijd met deze voorwaarden.`,
  },
  {
    titel: "11. Intellectueel eigendom",
    tekst: `• Alle rechten op de Noah & Emma naam, logo's en software berusten bij Noah & Emma.
• Door het plaatsen van foto's en teksten geef je Noah & Emma het recht deze te tonen op het platform.
• Je behoudt het eigendom van je eigen content.
• Het is verboden content van andere gebruikers te kopiëren of te gebruiken zonder toestemming.`,
  },
  {
    titel: "12. Toepasselijk recht",
    tekst: `Op deze voorwaarden is uitsluitend Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland. Consumenten kunnen ook een klacht indienen via het Europees platform voor onlinegeschillenbeslechting (ec.europa.eu/consumers/odr).`,
  },
  {
    titel: "13. Contact",
    tekst: `Voor vragen over deze algemene voorwaarden kun je contact opnemen via:

E-mail: info@noah-emma.nl
Adres: Noah & Emma, Nederland`,
  },
];

export const VOORWAARDEN: JuridischDocument = {
  slug: "voorwaarden",
  pad: "/voorwaarden",
  naam: "Algemene voorwaarden",
  titel: "Algemene voorwaarden",
  kort: "De regels voor kopen en verkopen via Noah & Emma.",
  intro: "Door Noah & Emma te gebruiken ga je akkoord met deze voorwaarden. Lees ze rustig door; bij vragen helpen we je graag.",
  datum: "Versie 1.1 · Ingangsdatum: 4 september 2026",
  secties: VOORWAARDEN_SECTIES,
};

const PRIVACY_SECTIES: JuridischeSectie[] = [
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

export const PRIVACY: JuridischDocument = {
  slug: "privacy",
  pad: "/privacy",
  naam: "Privacyverklaring",
  titel: "Privacyverklaring",
  kort: "Hoe we jouw gegevens verwerken en beschermen.",
  intro: "We verkopen nooit jouw gegevens aan derden en er komen nooit kindergezichten in de app. Hier lees je precies welke gegevens we verwerken, waarom en wat jouw rechten zijn.",
  datum: "Laatste wijziging: 4 september 2026",
  secties: PRIVACY_SECTIES,
};

const COOKIES_SECTIES: JuridischeSectie[] = [
  {
    titel: "Wat zijn cookies?",
    tekst: `Cookies zijn kleine tekstbestanden die een website op je apparaat plaatst. Vergelijkbare technieken, zoals lokale opslag in je browser (localStorage), vallen onder dezelfde regels. In dit beleid noemen we ze allemaal cookies.`,
  },
  {
    titel: "Noodzakelijke cookies (altijd aan)",
    tekst: `Deze zijn nodig om de website en app te laten werken. Hiervoor hoeven we geen toestemming te vragen.

• ne_ingelogd (cookie, 30 dagen): onthoudt dat je ingelogd bent, zodat je direct in de app terechtkomt.
• ne_gast (cookie, tot je de browser sluit): onthoudt dat je als gast het aanbod bekijkt.
• Inlogsessie van Supabase (lokale opslag): houdt je ingelogd. Verdwijnt als je uitlogt.
• noah-emma-cookievoorkeur (lokale opslag, 12 maanden): onthoudt je cookiekeuze, met datum.
• App-instellingen zoals donkere modus, filters en meldingen (lokale opslag): blijven tot je ze wist.`,
  },
  {
    titel: "Analytische cookies (alleen met jouw toestemming)",
    tekst: `Met Google Analytics zien we welke pagina's goed werken en waar het beter kan. Deze cookies plaatsen we pas nadat je op "Akkoord" hebt geklikt.

• _ga (cookie van Google, 2 jaar): onderscheidt bezoekers.
• _ga_N04N5JQH0R (cookie van Google, 2 jaar): onthoudt je bezoek.

We meten daarbij ook een paar acties, zonder te zien wie je bent: dat je een account hebt aangemaakt en dat je op een e-mailadres klikt. Wat je in een e-mail of formulier invult, sturen we nooit naar Google.

Zo hebben we Google Analytics ingesteld:
• Google Signals en advertentiepersonalisatie staan uit. Je gegevens worden niet gebruikt voor advertenties.
• Google Analytics slaat geen IP-adressen op.
• Gegevens worden maximaal 14 maanden bewaard.

Google is de verwerker van deze gegevens. Meer informatie vind je op policies.google.com/privacy.`,
  },
  {
    titel: "Wat we niet doen",
    tekst: `We plaatsen geen advertentie- of trackingcookies, zoals die van Google Ads of de Facebook Pixel. We verkopen nooit gegevens aan derden.`,
  },
  {
    titel: "Je keuze wijzigen of intrekken",
    tekst: `Bij je eerste bezoek vragen we of je analytische cookies toestaat. Weigeren is net zo makkelijk als accepteren. Je keuze geldt 12 maanden, daarna vragen we het opnieuw.

Je kunt je keuze altijd wijzigen met de knop bovenaan deze pagina, via "Cookie-instellingen" onderaan de website, of in de app via Profiel → Mijn voorkeuren. Trek je je toestemming in, dan stopt het meten direct en verwijderen we de Google Analytics-cookies.

Je kunt cookies ook zelf wissen via de instellingen van je browser. Wis je de noodzakelijke cookies, dan word je uitgelogd.`,
  },
  {
    titel: "Wijzigingen",
    tekst: `Komt er een nieuw soort cookie bij, dan passen we dit beleid aan en vragen we opnieuw om je toestemming.`,
  },
  {
    titel: "Contact",
    tekst: `Vragen over ons cookiebeleid? Stuur een e-mail naar info@noah-emma.nl. Lees ook onze privacyverklaring op noah-emma.nl/privacy.`,
  },
];

export const COOKIES: JuridischDocument = {
  slug: "cookies",
  pad: "/cookies",
  naam: "Cookiebeleid",
  titel: "Cookiebeleid",
  kort: "Welke cookies we gebruiken en waarom.",
  intro: "Noah & Emma gebruikt standaard alleen noodzakelijke cookies. Analytische cookies staan uit tot jij ze aanzet. Geen advertenties, geen dataverkoop.",
  datum: "Laatste wijziging: 24 oktober 2026",
  secties: COOKIES_SECTIES,
};

const COMMUNITY_SECTIES: JuridischeSectie[] = [
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

export const COMMUNITY: JuridischDocument = {
  slug: "community",
  pad: "/community",
  naam: "Communityrichtlijnen",
  titel: "Richtlijnen voor de community",
  kort: "Gedragsregels voor een veilige plek voor ouders.",
  intro: "Deze gedragsregels zorgen ervoor dat Noah & Emma een veilige en fijne plek blijft voor alle ouders, en vooral voor hun kinderen.",
  datum: "Laatste wijziging: 1 juni 2025",
  secties: COMMUNITY_SECTIES,
};

export const JURIDISCHE_DOCUMENTEN = [VOORWAARDEN, PRIVACY, COOKIES, COMMUNITY];
