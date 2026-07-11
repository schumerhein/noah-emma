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
- **Styling:** Tailwind CSS, fonts Manrope (headings) + Inter (body), Material Icons Round
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

## Database (Supabase)

Types staan in `src/lib/supabase.ts` (`Database` type): `profiles`, `listings`, `children`,
`favorites`. RLS-policies en schema-wijzigingen staan als losse `.sql`-bestanden in de
projectroot (geen migratietool, handmatig in Supabase SQL editor uitvoeren):

- `alle-updates-in-een.sql` — verzamelbestand
- `moderatie.sql`, `meld-en-blokkeer.sql`, `rls-reparatie.sql` — moderatie & veiligheid
- `reviews-table.sql`, `verkocht-kolom.sql`, `add-geslacht-column.sql`,
  `profiel-geboortedatum.sql` — feature-specifieke schema-uitbreidingen

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
  (verwachte maat uit geboortedatum) zijn gebouwd en werkend.
- `TESTPLAN.md` bevat een handmatig testscript voor de volledige cyclus (registratie →
  advertentie → moderatie → chat/bod → deal → review → melden/blokkeren).
- Fase: Next.js web-prototype (fase 1 uit de productvisie). React Native/Expo-versie en
  Fashn.ai virtual try-on zijn latere fases — bouw daar nu niet op vooruit.

## Werkafspraken

- UI-teksten in het Nederlands.
- Nieuwe Supabase-tabellen: altijd RLS aanzetten.
- Dark mode: gebruik `dark:` classes consistent met bestaande componenten.
- Geen betalingsintegratie in de huidige fase — kopers/verkopers regelen dit onderling.
