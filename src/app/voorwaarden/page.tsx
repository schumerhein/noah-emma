import { JuridischePagina } from "@/components/marketing/JuridischePagina";
import { PREMIUM_PRIJS } from "@/lib/prijzen";

const PREMIUM_PRIJS_TEKST = `€${PREMIUM_PRIJS.toFixed(2).replace(".", ",")}`;

const SECTIES = [
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

export default function VoorwaardenPagina() {
  return (
    <JuridischePagina
      naam="Algemene voorwaarden"
      pad="/voorwaarden"
      titel="Algemene voorwaarden"
      intro="Door Noah & Emma te gebruiken ga je akkoord met deze voorwaarden. Lees ze rustig door; bij vragen helpen we je graag."
      datum="Versie 1.1 · Ingangsdatum: 4 september 2026"
      secties={SECTIES}
    />
  );
}
