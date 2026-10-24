import { JuridischePagina } from "@/components/marketing/JuridischePagina";
import { CookieInstellingenKnop } from "@/components/CookieMelding";

const SECTIES = [
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

We meten daarbij ook een paar acties, zonder te zien wie je bent: dat je een account hebt aangemaakt, en dat je klikt op een e-mailadres, een telefoonnummer of een knop om een account aan te maken of in te loggen. Wat je in een e-mail of formulier invult, sturen we nooit naar Google.

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

export default function CookiesPagina() {
  return (
    <JuridischePagina
      naam="Cookiebeleid"
      pad="/cookies"
      titel="Cookiebeleid"
      intro="Noah & Emma gebruikt standaard alleen noodzakelijke cookies. Analytische cookies staan uit tot jij ze aanzet. Geen advertenties, geen dataverkoop."
      datum="Laatste wijziging: 24 oktober 2026"
      secties={SECTIES}
      extra={<CookieInstellingenKnop className="min-h-[44px] px-5 rounded-full bg-[#241A2E] text-white text-sm font-bold" />}
    />
  );
}
