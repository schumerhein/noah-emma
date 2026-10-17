# Noah & Emma — bronbestand

*Stand van zaken: 17 oktober 2026. Bevat geen wachtwoorden of API-sleutels.*

Dit bestand beschrijft alles wat een (AI-)assistent moet weten om met Hein aan Noah & Emma te werken: wat het is, waar alles draait, hoe de belangrijkste functies werken en welke afspraken gelden.

---

## 1. Wat is Noah & Emma?

- Nederlandse **C2C-marktplaats voor tweedehands kinderspullen** (0–12 jaar), vergelijkbaar met Vinted. Vooral kleding, maar ook speelgoed, kinderwagens, meubels enz.
- **USP:** privacy by design. Er staan geen echte kinderfoto's in de app; AI-kindermodellen **Noah** (jongen) en **Emma** (meisje) tonen de kleding.
- **Doelgroep:** ouders van 25–40 jaar. De toon is warm, toegankelijk en vertrouwenwekkend. Spreek de ouder aan, niet het kind.
- **Betalen:** kopers en verkopers regelen dat onderling bij het ophalen (cash of Tikkie). Het platform verdient alleen aan **Premium** en **Boost** (via Mollie).
- **Eigenaar:** Hein Schumer (ondernemer, geen programmeur). Hij beschrijft wat hij wil in gewoon Nederlands; de assistent bouwt het.
- **Fase:** 1, een Next.js-webapp (PWA). Later volgen een React Native/Expo-app (fase 2) en Fashn.ai virtual try-on (fase 3). Bouw nu niet vooruit op die fases.

## 2. Waar draait alles?

| Onderdeel | Dienst | Details |
|---|---|---|
| Code | **GitHub** | `schumerhein/noah-emma`, hoofdbranch `main` |
| Hosting website | **Vercel** | Team "Hein's projects" (`heins-projects-4ae49a3b`), project `noah-emma`. Elke merge naar `main` gaat automatisch live; andere branches krijgen een preview-URL. |
| Domein | **www.noah-emma.nl** (hoofdadres) | `noah-emma.nl` doet een 301-redirect naar `www`. Het domein en de DNS staan bij **Vimexx** (nameservers ns.zxcs.nl/.be/.eu). |
| Database, inloggen, opslag | **Supabase** | Project "Noah & Emma", ref `buzshsoygmlvcrrzagki`, regio eu-west-1 (Ierland), Postgres 17 |
| AI | **Google Gemini** (`gemini-3.6-flash`) via `@google/genai` | Voor AI-moderatie en AI-zoeken |
| E-mail versturen (app) | **SendGrid** | Afzender `noreply@noah-emma.nl`; het domein is geauthenticeerd (DKIM s1/s2, em7733) |
| E-mail ontvangen | **ImprovMX** (gratis) | Alle mail aan `*@noah-emma.nl` gaat door naar schumerhein@gmail.com |
| E-mail versturen als info@ | **Gmail "Verzenden als"** via SendGrid-SMTP | `smtp.sendgrid.net:587`, gebruikersnaam `apikey` |
| Betalingen | **Mollie** | Premium-abonnement en Boost |

### DNS bij Vimexx (noah-emma.nl)

| Naam | Type | Waarde | Doel |
|---|---|---|---|
| `@` | A | 216.198.79.1 | Vercel (website) |
| `www` | CNAME | `…vercel-dns-017.com.` | Vercel (website) |
| `@` | MX 10 / 20 | `mx1.improvmx.com` / `mx2.improvmx.com` | Mail ontvangen |
| `@` | TXT | `v=spf1 include:sendgrid.net include:spf.improvmx.com -all` | SPF (er mag er maar één zijn!) |
| `_dmarc` | TXT | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` | Streng: alleen SendGrid-mail is geldig |
| `s1._domainkey`, `s2._domainkey`, `em7733` | CNAME | sendgrid.net | SendGrid-authenticatie |

**Let op:** door de strenge DMARC (reject) wordt mail "van @noah-emma.nl" die niet via SendGrid gaat, geweigerd. Er is geen hostingpakket bij Vimexx; de records `mail`/`ftp` A verwijzen naar een server van Vimexx zonder mailbox en worden niet gebruikt.

### Omgevingsvariabelen (Vercel → Settings → Environment Variables)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL` (= `https://www.noah-emma.nl`), `GEMINI_API_KEY`, `SENDGRID_API_KEY`, `MOLLIE_API_KEY` (live in Production, test in Preview). Een voorbeeld staat in `.env.example`.

## 3. Techniek

- **Next.js 15** (App Router), React 19, TypeScript, Tailwind CSS. Lokaal: `npm run dev` op poort **9002**.
- **Huisstijl:** primair roze `#ffb8c4`, tekst slate-900, wit. Headings in **Manrope**, body in **Inter**, iconen uit **Material Icons Round** en lucide-react. Dark mode via `dark:`-classes.
- **Iconen-afspraak:** Premium en Boost gebruiken een **raket** (geen kroontje). Gebruik het woord "advertentieruimte" niet, maar "**Artikel boosten**".
- **Supabase-client:** `src/lib/supabase.ts` (browser) en `src/lib/supabaseAdmin.ts` (server, service role).
- **Database-wijzigingen:** losse `.sql`-bestanden in de projectroot, met een beschrijvende naam. Maak altijd een nieuw bestand in plaats van een oud te wijzigen. Nieuwe tabellen krijgen altijd RLS. De bestanden staan ook al in productie.
- **Firebase** is een overblijfsel van de oorspronkelijke opzet en wordt niet gebruikt.

### Pagina's (src/app)

Ontdekken `/` (swipe-feed), `/landing` (marketingpagina op noah-emma.nl), `/search` (alleen Premium), `/sell` (artikel plaatsen), `/product/[id]` (+ `/edit`), `/promote/[id]` (Boost), `/seller/[id]`, `/profile`, `/messages` (+ `/[id]` chat), `/reviews/schrijf`, `/onboarding/kind`, `/kind/[id]/edit`, `/premium`, `/orders`, `/notificaties`, `/instellingen/*`, `/admin/moderatie`, `/admin/avatars`, plus de informatiepagina's (faq, helpdesk, support, voorwaarden, privacy, cookies, wettelijk, community, over).

### API-routes (src/app/api)

- `webhooks/ai-moderatie`: AI-keuring van advertenties
- `webhooks/reviews`: alle e-mails rond reviews en herinneringen
- `webhooks/nieuw-bericht`, `webhooks/nieuw-bod`: e-mail bij een nieuw bericht of bod
- `betalen/*`: Mollie (Premium, Boost, webhook, status, opzeggen)
- `admin/modereren`: handmatig goed- of afkeuren
- `ai-zoeken`: "Vraag het Noah of Emma" (Premium)
- `account/*`: account verwijderen, inlogsessies, wachtwoord gewijzigd

De webhooks controleren de header `x-webhook-secret` (= `SUPABASE_WEBHOOK_SECRET`). Database-webhooks wijzen altijd naar **https://www.noah-emma.nl** (met www; zonder www gaat de POST verloren door de redirect).

## 4. Database (Supabase, schema public)

| Tabel | Belangrijkste kolommen |
|---|---|
| `profiles` | naam, stad, bio, avatar_url, gemiddelde_beoordeling, totaal_beoordelingen, totaal_verkopen, is_premium, premium_verloopdatum, is_admin, vakantiestand, privacy_instellingen, feed_voorkeuren, notificatie-instellingen, mollie-velden |
| `children` | naam, geboortedatum, maat, lengte, geslacht, maat_gegroeid_op |
| `listings` | titel, beschrijving, prijs, maat, conditie, categorie, subcategorie, merk, kleur, foto_urls, actief, verkocht, bieden_toegestaan, gepromoot + promotie_verloopdatum, moderatie_status (`wachtend`/`goedgekeurd`/`afgekeurd`), moderatie_reden, ai_oordeel, ai_toelichting, ai_beoordeeld_op |
| `conversations` | buyer_id, seller_id, listing_id, afgerond, afgerond_at, afgerond_door, koper_bevestigd_op, review_verzoek_op, review_herinnering_op, bevestig_herinnering_op |
| `messages` | conversation_id, sender_id, tekst, gelezen |
| `reviews` | reviewer_id, reviewed_id, listing_id, beoordeling (1–5), tekst. Uniek per (reviewer, listing). |
| `biedingen` | listing_id, bieder_id, bedrag, status |
| `favorites` | user_id, listing_id, kind_id |
| `followers`, `blocks`, `reports` | volgen, blokkeren, melden |
| `zoekwaarschuwingen` | alleen Premium |
| `swipe_tellers` | dagelijkse swipe-limiet (10 per dag voor niet-Premium) |
| `betalingen`, `login_sessions` | Mollie-betalingen en inloglog |

### Geplande taken (pg_cron)

- `kindmaten-meegroeien`, dagelijks 03:17 UTC → `werk_kindmaten_bij()`
- `review-herinneringen`, dagelijks 16:47 UTC → `stuur_review_herinneringen()` (het geheim staat in de Supabase Vault als `webhook_secret`)

## 5. Belangrijkste functies en hoe ze werken

### Reviews (de belangrijkste functie)
- Een review kan **alleen na een afgeronde deal** tussen jou en de ander voor dat product. De database dwingt dat af via RLS (`mag_review_geven()`). Eén review per persoon per deal.
- **De deal afronden:** de verkoper drukt in de chat op "Verkocht". De koper kan ook **"Ik heb dit gekocht"** melden; de verkoper krijgt dan een mail en een balk in de chat om dat te bevestigen.
- Gesprekken zijn beveiligd (trigger `bewaak_gesprek_wijziging`): alleen de verkoper rondt af, alleen de koper meldt "gekocht", een afgeronde deal kan niet worden teruggedraaid, en koper, verkoper en product liggen vast.
- **Automatische mails:** als de deal rond is, krijgen koper én verkoper een review-verzoek. Na 3 dagen volgt één herinnering. Wie een review krijgt, krijgt een mail met een knop "Beoordeel terug". Een verkoper die een gemelde koop 2 dagen niet bevestigt, krijgt een herinnering. Gebruikers kunnen dit uitzetten via de notificatie-instelling "Beoordelingen".
- **Zichtbaar:** sterren + cijfer + aantal staan altijd bij de verkoper in Ontdekken (zonder reviews: lege sterren met "Nog geen beoordelingen"), bij zoekresultaten, bovenaan de productpagina, in de chat en op het verkopersprofiel. "Nog te beoordelen" staat op het beginscherm en in het profiel.

### AI-moderatie van advertenties
- Elke nieuwe advertentie begint als `wachtend`. Een webhook stuurt hem naar Gemini, die foto's en tekst bekijkt:
  - **goedkeuren** → meteen live
  - **afkeuren** → verborgen, de verkoper ziet de reden
  - **twijfel** of een fout → handmatige wachtrij `/admin/moderatie`
- Afkeurredenen: een herkenbaar gezicht; een kind in ondergoed of badkleding; ongepaste inhoud; geen kinderartikel; verboden of onveilige producten; contactgegevens of links; spam, nep of een onrealistische prijs.
- Een echt kind zonder herkenbaar gezicht levert "twijfel" op, zodat een mens beslist.
- Opnieuw gekeurd wordt bij nieuwe foto's, bij een tekstwijziging (niet bij alleen een prijswijziging) en wanneer je een afgekeurde advertentie aanpast.
- Clientside detecteert face-api.js ook al gezichten bij het uploaden.

### Kindprofiel en meegroeiende maat
- Ouders maken een kindprofiel aan met geboortedatum, maat en geslacht. Ontdekken filtert automatisch op de maat en het geslacht van het actieve kind.
- Elke nacht gaat de maat automatisch **omhoog** als de leeftijd dat aangeeft (nooit omlaag). Het beginscherm toont dan eenmalig "X is gegroeid! We laten nu maat Y zien".
- De maattabel staat in `src/lib/groei.ts` (`schatMaatOpLeeftijd`) en in `kindmaat-meegroeien.sql`; die twee moeten gelijk blijven.
- Wijkt de gekozen maat 2 of meer maten af van de leeftijd, dan volgt een waarschuwing.

### Premium (€2,99 per maand, via Mollie)
- Onbeperkt swipen (anders 10 per dag), **zoeken & filteren (alleen Premium)**, AI-zoeken "Vraag het Noah of Emma" en zoekwaarschuwingen.
- **Admins zijn altijd Premium** (trigger `admin_altijd_premium`).

### Boost ("Artikel boosten")
- 3 dagen €0,99, 7 dagen €2,99 of 14 dagen €4,99. Geboostte artikelen komen vaker en eerder in Ontdekken.
- De prijzen staan in `src/lib/prijzen.ts`.

### Moderatie en veiligheid
- Melden en blokkeren van gebruikers en advertenties.
- Wachtende advertenties zijn alleen zichtbaar voor de eigenaar en voor admins.
- Gebruikers kunnen geen gevoelige kolommen zelf wijzigen (is_admin, is_premium, moderatie_status, enz.).

## 6. Beheer

- **Admin:** Hein (hein0307@hotmail.com). Een tweede testaccount is Merle.
- **Moderatiewachtrij:** www.noah-emma.nl/admin/moderatie (ook via het profiel → "Moderatie (beheer)").
- **Live zetten:** een wijziging op een branch → pull request op GitHub → Vercel bouwt een preview → merge naar `main` → binnen ±2 minuten live.
- **Testen:** `TESTPLAN.md` bevat een handmatig testscript voor de volledige cyclus (registratie → advertentie → moderatie → chat/bod → deal → review → melden/blokkeren).

## 7. Werkafspraken met Hein

- Alle teksten in de app zijn **Nederlands**. Communiceer met Hein in gewone taal, zonder jargon.
- Hein beschrijft wat hij wil; de assistent maakt zelf de technische keuzes en bouwt door. Bij grotere functies: eerst een kort plan (max. 5 punten), daarna bouwen na "ga door".
- Hein heeft toestemming gegeven om wijzigingen **direct live** te zetten (mergen naar `main` zodra de Vercel-build groen is).
- Vraag Hein alleen om input bij productkeuzes, prijzen, privacy of bij echte afwegingen.
- Zet nooit wachtwoorden of API-sleutels in de code, in e-mails of in documenten.

## 8. Openstaande punten (17 oktober 2026)

- **Testdeal tussen Hein en Merle**, om de reviewmails en de AI-keuring end-to-end te controleren.
- De advertentie **"Suitssupply"** (maat 50, met de borst van een volwassene op de foto) staat online, terwijl die met de hand is goedgekeurd; het is geen kinderartikel.
- Kindprofiel **Olivier** (van Hein) staat op maat 86 met geboortedatum 9-10-2026; dat is waarschijnlijk een vergissing.
- De database-adviseur van Supabase meldt ontbrekende indexen en RLS-optimalisaties. Dat is nu niet urgent (weinig data), maar wel vóór de groei.
