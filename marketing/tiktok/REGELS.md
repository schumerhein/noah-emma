# TikTok-video's Noah & Emma: werkwijze en regels

Elke twee dagen maakt een geplande taak hier één nieuwe video en plaatst die op TikTok.
Dit bestand is de vaste instructie voor die taak.

## Stappen per video

1. Kies in `onderwerpen.json` het eerste onderwerp met `"status": "open"`. Zijn er minder dan
   5 open, voeg dan eerst 10 nieuwe onderwerpen toe die nog niet in `gemaakt` of
   `onderwerpen` staan (wissel af tussen kleding, kindergoed, groeimodel, privacy, kopen,
   verkopen, seizoen).
2. Maak `posts/<JJJJ-MM-DD>-<slug>/video.html` op basis van `bron/lib.js` en `bron/base.css`
   (verwijs met `../../bron/...`). Kijk in `bron/voorbeelden/` hoe scènes, `words()`,
   `endCard()`, `ICON` en `shirtSVG()` werken. Kies een andere opbouw dan de vorige video.
   - 1080×1920, 10 tot 14 seconden, `window.DUR` en `window.render(t)` zoals de voorbeelden.
   - Opening (eerste 1,5 s): een vraag of herkenbaar probleem, groot en in beeld.
   - Altijd eindigen met `endCard(t, t0)`; tekst `noah-emma.nl` in de knop.
3. Render: `node ../../bron/render.js video.html stil.mp4 <cover-seconde>` vanuit de postmap.
   Bekijk minstens 4 frames als png (de cover en elke scène). Controleer: tekst niet
   afgesneden, niets rechts boven x=940 of onder y=1500 behalve de eindkaart, geen
   overlappende elementen. Herstel en render opnieuw tot het klopt.
4. Geluid: schrijf `events.json` (pop bij woorden, whoosh bij overgangen, ding bij vinkjes,
   eindkaart zoals `end()` in `bron/audio.py`), dan
   `python3 ../../bron/audio.py events.json <duur> geluid.wav` en
   `ffmpeg -i stil.mp4 -i geluid.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart video.mp4`.
5. Schrijf `meta.json`: `{"onderwerp_id", "titel", "caption", "cover_ms", "hashtags"}`.
   `cover_ms` = het moment met de sterkste, goed leesbare kop (dat wordt de thumbnail).
6. Upload: `python3 ../../upload_tiktok.py posts/<map>` (vanuit `marketing/tiktok`).
   Exitcode 2 betekent dat de inloggegevens nog ontbreken: niet als fout behandelen,
   de video staat dan klaar om handmatig te posten.
7. Zet het onderwerp op `"status": "gemaakt"`, voeg het toe aan `gemaakt`, commit en push.

## Caption (titel + omschrijving)

- Eerste regel = zoekwoord + belofte, bijvoorbeeld "Tweedehands kinderwagen verkopen? 🚼".
  Gebruik zoekwoorden die ouders intypen: tweedehands kinderkleding, kinderkleding verkopen,
  kinderwagen tweedehands, babykleding, enz.
- 2 tot 4 korte zinnen met de nieuwe informatie van dit onderwerp.
- Een vraag aan de kijker (levert reacties op).
- Altijd als slot: `👉 Maak gratis een account op noah-emma.nl (link in bio)`
- 4 tot 6 hashtags, altijd `#noahenemma`, plus 1 brede (`#ouders`, `#kinderkleding`) en
  2 tot 4 specifieke voor het onderwerp. Geen #fyp-spam.

## Boodschap: wat wel en niet mag

- Doelgroep: alléén vaders en moeders van kinderen van 0 tot 12 jaar. Niet richten op opa/oma.
- Grootste voordeel: het groeimodel. Je stelt de maat of geboortedatum van je kind in en je
  ziet tijdens het swipen altijd de maat die nú past; die groeit vanzelf mee.
- Onze slimme AI weigert elke foto met een kindergezicht, dus er staan nooit kindergezichten
  in de app. Zeg "kindergezichten" of "gezichten van kinderen", nooit "kinderhoofden".
- NOOIT zeggen of laten zien dat Noah of Emma kleding aantrekt of draagt (bestaat nog niet).
- Niet alleen kleding: kinderwagens, buggy's, autostoeltjes, ledikantjes, speelgoed, enz.
  Minstens één op de drie video's gaat over kindergoed.
- Gratis account, gratis kopen en verkopen. Premium hoeft niet genoemd te worden.
- Je hebt een (gratis) account nodig om producten te bekijken.
- Kopers en verkopers chatten en spreken zelf af (ophalen of de deal sluiten). Je kiest zelf
  van wie je koopt, mede op basis van reviews. Noem nooit Marktplaats, Vinted of andere platforms.
- Geen verzonnen cijfers als feit (aantallen gebruikers, scores) behalve de 4,8 van de site.

## Huisstijl

Kleuren uit `bron/base.css`: inkt #241A2E, tekst #5B4F63, roze #D63D74, blauw #1C7FA8,
achtergrond #FFF9FA, tinten #FFEAF1 en #E4F4FB. Manrope voor koppen, Inter voor tekst.
De Noah- en Emma-gezichten zijn `SVG.noahHead` en `SVG.emmaHead` (het logo van de site).
