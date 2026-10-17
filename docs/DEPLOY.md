# Deploy: GitHub → Vercel → noah-emma.nl, met Supabase

Stappenplan om de app te koppelen. De code is hier al op voorbereid
(`src/middleware.ts` kent `noah-emma.nl`, webhooks en Mollie gebruiken
`NEXT_PUBLIC_SITE_URL`). Alle variabelen staan in `.env.example`.

## 1. GitHub → Vercel

1. Ga naar <https://vercel.com/new> en log in met GitHub.
2. **Import Git Repository** → `schumerhein/noah-emma`. Geef de Vercel GitHub-app
   toegang tot deze repo als dat gevraagd wordt.
3. Framework: **Next.js** (automatisch). Build command en output niet aanpassen
   (`npm run build`). Root directory: `./`.
4. Production branch: `main`. Elke PR/branch krijgt dan automatisch een
   Preview-URL; merge naar `main` = live.

## 2. Environment variables in Vercel

Project → **Settings → Environment Variables**. Zet elke variabele uit
`.env.example`:

| Variabele | Production | Preview | Opmerking |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | ✓ | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | ✓ | idem (anon / publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✓ | idem (service_role) — geheim |
| `SUPABASE_WEBHOOK_SECRET` | ✓ | ✓ | zelf verzinnen, zie stap 5 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.noah-emma.nl` | leeg laten | |
| `GEMINI_API_KEY` | ✓ | ✓ | Google AI Studio |
| `SENDGRID_API_KEY` | ✓ | optioneel | |
| `MOLLIE_API_KEY` | `live_…` | `test_…` | |

Tip: in plaats van de Supabase-variabelen met de hand te kopiëren kun je in Vercel
de **Supabase-integratie** (Marketplace → Supabase → *Connect existing project*)
gebruiken; die zet `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` en
`SUPABASE_SERVICE_ROLE_KEY` automatisch. De overige variabelen blijven handwerk.

Na het wijzigen van variabelen: **Deployments → … → Redeploy**
(`NEXT_PUBLIC_*` worden tijdens de build ingebakken).

## 3. Domein noah-emma.nl

1. Vercel → Project → **Settings → Domains** → voeg `noah-emma.nl` én
   `www.noah-emma.nl` toe. `www.noah-emma.nl` is primair; `noah-emma.nl` doet een
   301-redirect daarheen.
2. Zet bij je domeinregistrar de DNS-records die Vercel toont, normaal:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`

   Gebruik de exacte waarden die Vercel bij het domein laat zien — die kunnen afwijken.
3. Wacht tot Vercel "Valid Configuration" toont; SSL gaat automatisch.

Let op: e-mail (`info@`, `noreply@noah-emma.nl`) draait via MX/SPF/DKIM-records.
Laat die staan; pas alleen de `@`- en `www`-records aan.

## 4. Supabase Auth koppelen aan het domein

Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://www.noah-emma.nl`
- **Redirect URLs** (de login gebruikt `window.location.origin`):
  - `https://noah-emma.nl/**`
  - `https://www.noah-emma.nl/**`
  - `https://*-schumerhein.vercel.app/**` (Preview-deploys; check je Vercel-teamnaam)
  - `http://localhost:9002/**` (lokaal)

Zonder deze regels werken de bevestigingsmail (`/onboarding/kind`) en
wachtwoord-reset (`/wachtwoord-reset`) niet op het live domein.

## 5. Supabase Database Webhooks

Supabase → **Database → Webhooks** → *Create a new hook*, twee keer:

| Naam | Tabel | Event | URL |
|---|---|---|---|
| nieuw-bericht | `messages` | Insert | `https://www.noah-emma.nl/api/webhooks/nieuw-bericht` |
| nieuw-bod | `biedingen` | Insert | `https://www.noah-emma.nl/api/webhooks/nieuw-bod` |

Gebruik altijd het `www`-adres: `noah-emma.nl` redirect (301) en daarbij gaat de
POST verloren → Vercel antwoordt 405 en er gaat geen e-mail uit.

Type: HTTP Request, methode POST, en voeg een HTTP header toe:
`x-webhook-secret` = dezelfde waarde als `SUPABASE_WEBHOOK_SECRET` in Vercel.

## 6. Mollie

De webhook-URL wordt automatisch meegestuurd (`https://<domein>/api/betalen/webhook`),
dus in Mollie hoeft niets ingesteld te worden behalve het **website-profiel**
op `https://www.noah-emma.nl` en de live API-key in Vercel.

## 7. Controle

- [ ] `https://noah-emma.nl` toont de marketingpagina, `/?gast=1` de feed
- [ ] Registreren → bevestigingsmail → link opent `noah-emma.nl/onboarding/kind`
- [ ] Wachtwoord vergeten → link opent `noah-emma.nl/wachtwoord-reset`
- [ ] Advertentie met foto plaatsen → afbeelding laadt (Supabase Storage)
- [ ] Bericht sturen → ontvanger krijgt e-mail (webhook + SendGrid)
- [ ] Premium testbetaling op een Preview-deploy met `test_`-key

Daarna het volledige `TESTPLAN.md` doorlopen.
