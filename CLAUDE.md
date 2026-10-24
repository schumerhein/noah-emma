# Noah & Emma (kids-market)

C2C recommerce app voor tweedehands kinderkleding (0–12 jaar), vergelijkbaar met Vinted.
Nederlandse markt. USP: AI-kindermodellen "Noah" en "Emma" tonen de kleding in plaats van
echte kinderfoto's — privacy by design.

Zie ook de `noah-emma-app` plugin/skill voor huisstijl, productvisie en werkafspraken.
Dit bestand beschrijft de daadwerkelijke stand van de code.

## Tech stack (huidige staat)

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Dev server:** `npm run dev` → draait op poort **9002** (niet 3000), met Turbopack
- **Backend:** Supabase (Postgres + Auth + Storage), client in `src/lib/supabase.ts`
- **AI-flows:** Genkit (`genkit`, `@genkit-ai/google-genai`) — flows in `src/ai/flows/`
- **Styling:** Tailwind CSS, fonts Manrope (headings) + Inter (body), Material Icons Round /
  lucide-react. De app volgt de huisstijl van de marketingwebsite: `slate` is in
  `tailwind.config.ts` omgezet naar warme aubergine-tinten (900 = #241A2E), merkkleuren
  `roze-*` / `blauw-*` / `inkt`, schaduwen `shadow-zacht` / `shadow-kaart`, verloop
  `.verloop-merk`. Koppen (h1–h4) binnen `.app-frame` krijgen automatisch Manrope
  (`globals.css`). `primary` is Emma-roze #D63D74, bij een jongen Noah-blauw #1C7FA8.
- **Legacy:** project is ooit gescaffold vanuit Firebase Studio/IDX (`apphosting.yaml`,
  `.idx/`, `metadata.json`, `firebase` dependency). **Niet actief gebruikt** — auth,
  database en storage lopen via Supabase, niet Firebase. Kan opgeruimd worden maar is
  bewust nog niet aangeraakt.

## AI-pipeline (zoals nu geïmplementeerd)

Dit is een eigen, lokale implementatie — geen Fashn.ai (dat is een toekomstige fase 3-optie):

1. **Gezichtsdetectie** (`src/lib/kledingDetectie.ts`) — face-api.js (TinyFaceDetector)
   draait clientside in de browser, detecteert het gezicht van het kind op de foto.
2. **Kledingzone uitsnijden** — vanaf net onder de kin (~4,4x gezichtsbreedte breed) tot
   heuphoogte. Geen gezicht gevonden (bv. platgelegde productfoto) → valt terug op een
   vaste middenband.
3. **Compositie op avatar** (`src/lib/avatarComposite.ts`, `avatarFullBodySvg.ts`,
   `avatarHeadSvg.ts`, `avatarSvgStrings.ts`, `faceReplace.ts`) — de uitgesneden kledingfoto
   wordt op het lijfje van de Noah/Emma SVG-avatar geplaatst. Avatars groeien mee met de
   opgegeven maat van het kind.
4. **Veiligheidsgarantie:** de uitsnede begint altijd ónder de kin — het echte gezicht van
   het kind komt dus nooit in een advertentie terecht.
5. **Genkit-flows** (`src/ai/flows/`):
   - `privacy-blurring-for-product-photos.ts` — blurt gezichten op productfoto's (losse
     laag bovenop bovenstaande pipeline)
   - `product-description-generation-flow.ts` — genereert productomschrijvingen
   - `assistant-flow.ts` — AI-chat/support assistent
6. **AI-moderatie** (`src/lib/aiModeratie.ts`, `src/app/api/webhooks/ai-moderatie/`) — elke
   advertentie die op 'wachtend' komt, wordt via een Supabase-webhook door Gemini beoordeeld:
   goedkeuren → live, afkeuren → verkoper ziet reden, twijfel → handmatige wachtrij
   (`/admin/moderatie`). Zie `ai-moderatie.sql`.

## Reviews (kernfunctie)

- Biedingen: de verkoper accepteert of wijst een bod af in de chat (`biedingen.status`
  openstaand → geaccepteerd/afgewezen, alleen die overgang; `biedingen-accepteren.sql`).
  Zolang een bod openstaat ziet de koper géén "Ik heb dit gekocht"; die knop verschijnt pas
  na acceptatie (of als de verkoper in de chat heeft gereageerd) en vraagt eerst bevestiging.
- Review alleen na een afgeronde deal (`conversations.afgerond`), afgedwongen in RLS via
  `mag_review_geven()`. De verkoper rondt af; de koper kan "Ik heb dit gekocht" melden
  (`koper_bevestigd_op`), waarna de verkoper bevestigt. Zie `reviews-verplicht-na-deal.sql`.
- Alle review-mails lopen via `src/app/api/webhooks/reviews/route.ts`: review-verzoek aan
  beide partijen bij afronden, bevestigverzoek aan de verkoper, mail bij een nieuwe review,
  en een dagelijkse herinnering (pg_cron → `stuur_review_herinneringen()`, geheim in Vault).
- `OpenBeoordelingen` (beginscherm + profiel) toont deals die je nog moet beoordelen.

## Database (Supabase)

Types staan in `src/lib/supabase.ts` (`Database` type): `profiles`, `listings`, `children`,
`favorites`. RLS-policies en schema-wijzigingen staan als losse `.sql`-bestanden in de
projectroot (geen migratietool, handmatig in Supabase SQL editor uitvoeren):

- `alle-updates-in-een.sql` — verzamelbestand
- `moderatie.sql`, `meld-en-blokkeer.sql`, `rls-reparatie.sql` — moderatie & veiligheid
- `reviews-table.sql`, `verkocht-kolom.sql`, `add-geslacht-column.sql`,
  `profiel-geboortedatum.sql` — feature-specifieke schema-uitbreidingen

Rechten op `profiles` werken met kolom-whitelists (laatste stand: `profielrechten-herstellen.sql`):
`email` en `mollie_*` zijn niet leesbaar voor de app, `is_admin`/`is_premium` niet schrijfbaar.
Gebruikt de app een nieuwe profielkolom, zet die dan ook in de `grant select`/`grant update`-lijst.

Bij nieuwe tabellen/kolommen: voeg een nieuw `.sql`-bestand toe met een beschrijvende naam
i.p.v. bestaande bestanden te wijzigen, zodat de historie van wijzigingen leesbaar blijft.

## Belangrijke mappen

```
src/app/            → routes (App Router), NL-namen: instellingen, voorwaarden, kind, etc.
src/app/admin/       → moderatiewachtrij + avatarbeheer (intern, niet publiek)
src/components/      → herbruikbare UI
src/components/ai-models/  → Noah/Emma render-componenten
src/components/avatar/     → 3D avatar viewer
src/ai/flows/        → Genkit AI-flows
src/lib/              → Supabase client, avatar-compositie, groeicurve, utils
```

## Status & lopende zaken

- Moderatiewachtrij, meld/blokkeer-systeem, reviews, verkoopcyclus, groeifunctie
  (verwachte maat uit geboortedatum) zijn gebouwd en werkend. De kindmaat groeit
  automatisch mee: een nachtelijke pg_cron-job (`kindmaat-meegroeien.sql`) zet de maat
  omhoog; de maattabel daar moet gelijk blijven aan `schatMaatOpLeeftijd` in `src/lib/groei.ts`.
- Swipen op Ontdekken zit in `src/components/SwipeStapel.tsx`: de sleepbeweging past de
  kaart direct in de DOM aan (geen React-state per frame), flick-snelheid telt mee, en
  weggeswipete kaarten vliegen als losse laag uit zodat je meteen door kunt.
- `TESTPLAN.md` bevat een handmatig testscript voor de volledige cyclus (registratie →
  advertentie → moderatie → chat/bod → deal → review → melden/blokkeren).
- Fase: Next.js web-prototype (fase 1 uit de productvisie). React Native/Expo-versie en
  Fashn.ai virtual try-on zijn latere fases — bouw daar nu niet op vooruit.

## Werkafspraken

- UI-teksten in het Nederlands.
- Nieuwe Supabase-tabellen: altijd RLS aanzetten.
- Dark mode: gebruik `dark:` classes consistent met bestaande componenten.
- Geen betalingsintegratie in de huidige fase — kopers/verkopers regelen dit onderling.
