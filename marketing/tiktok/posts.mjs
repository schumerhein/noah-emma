/**
 * Alle TikTok-posts. Pas teksten hier aan en draai `node marketing/tiktok/scripts/maak.mjs`.
 *
 * Tekst-opmaak: *woord* = roze accent, | = nieuwe regel.
 * Scènetypes: hook, kleding, duo, solo, groei, schild, tip, teller, eind.
 * bg: roze (standaard) | wit | felroze | donker.   duur in seconden.
 * soort: "video" (MP4) of "carrousel" (losse foto's voor TikTok-fotomodus).
 * Bijschrift, hashtags en geluidstip per post staan in POSTS.md.
 */
export const POSTS = [
  {
    id: "01-pov-weer-gegroeid",
    soort: "video",
    scenes: [
      { type: "hook", bg: "donker", kicker: "POV", tekst: "Je kind is|*wéér* een maat|gegroeid", duur: 2.6 },
      { type: "kleding", tekst: "Een kast vol kleding|die nog *prima* is", duur: 3 },
      { type: "duo", tekst: "Verkoop het —|*Noah & Emma*|showen het voor je", duur: 3.2 },
      { type: "schild", bg: "wit", tekst: "Zonder één foto van|*je eigen kind*", duur: 2.6 },
      { type: "eind", duur: 3 },
    ],
  },
  {
    id: "02-waarom-geen-kinderfotos",
    soort: "video",
    scenes: [
      { type: "hook", bg: "felroze", kicker: "Eerlijk verhaal", tekst: "Waarom wij *nooit*|foto's van|kinderen online|zetten", duur: 3 },
      { type: "hook", bg: "donker", tekst: "Een foto online|krijg je *nooit*|meer helemaal|terug", duur: 2.8 },
      { type: "hook", bg: "wit", tekst: "Ook niet als het|'maar' om een|*T-shirtje* gaat", duur: 2.6 },
      { type: "duo", tekst: "Daarom dragen|*Noah & Emma* de kleding", duur: 2.8 },
      { type: "schild", bg: "wit", tekst: "*Privacy by design*", sub: "Echte kindergezichten komen|nooit in een advertentie", duur: 3 },
      { type: "eind", duur: 3 },
    ],
  },
  {
    id: "03-maak-kennis",
    soort: "video",
    scenes: [
      { type: "hook", kicker: "Even voorstellen", tekst: "Dit zijn de *modellen*|van onze app", duur: 2.4 },
      { type: "solo", wie: "noah", ballon: "Hoi! Ik ben Noah", label: "maat 104 · 3–4 jaar", duur: 2.4 },
      { type: "solo", wie: "emma", ballon: "En ik ben Emma!", label: "maat 104 · 3–4 jaar", duur: 2.4 },
      { type: "groei", wie: "noah", tekst: "We *groeien mee*|met jouw kind", duur: 3 },
      { type: "duo", tekst: "Wij dragen *jouw*|kleding — zodat je|kind dat niet hoeft", duur: 3 },
      { type: "eind", duur: 3 },
    ],
  },
  {
    id: "04-3-tips-verkopen",
    soort: "video",
    scenes: [
      { type: "hook", bg: "donker", kicker: "Bewaar deze", tekst: "3 tips om|kinderkleding|*sneller* te|verkopen", duur: 2.8 },
      { type: "tip", nr: 1, tekst: "Was en vouw|het netjes", sub: "Fris en strak = vertrouwen", duur: 2.6 },
      { type: "tip", nr: 2, tekst: "Fotografeer plat|op een *lichte*|ondergrond", sub: "Daglicht, geen flits", duur: 2.8 },
      { type: "tip", nr: 3, tekst: "Wees *eerlijk*|over de staat", sub: "Vlekje? Zet het erbij.", duur: 2.6 },
      { type: "eind", tekst: "Zet het op Noah & Emma", duur: 3 },
    ],
  },
  {
    id: "05-8-maten-in-2-jaar",
    soort: "video",
    scenes: [
      { type: "hook", bg: "felroze", tekst: "Hoeveel maten|groeit een baby|in *2 jaar*?", duur: 2.6 },
      { type: "teller", getal: 8, eenheid: "maten", sub: "Van maat 50 tot maat 92", duur: 3 },
      { type: "kleding", tekst: "Vaak *nauwelijks*|gedragen", duur: 2.4 },
      { type: "duo", tekst: "Geef het door.|*Noah & Emma*|laten het zien", duur: 2.8 },
      { type: "eind", duur: 3 },
    ],
  },
  {
    id: "06-redenen-tweedehands",
    soort: "carrousel",
    scenes: [
      { type: "hook", kicker: "Swipe →", tekst: "5 redenen om|*tweedehands*|kinderkleding|te kopen" },
      { type: "tip", nr: 1, tekst: "Ze groeien er|toch *zó* uit", sub: "Waarom nieuw kopen|voor een paar maanden?" },
      { type: "tip", nr: 2, bg: "felroze", tekst: "Goed voor je|*portemonnee*", sub: "Een fractie van de nieuwprijs" },
      { type: "tip", nr: 3, tekst: "Beter voor|de *planeet*", sub: "Elk kledingstuk dat langer|meegaat, telt" },
      { type: "tip", nr: 4, bg: "donker", tekst: "Vaak *nauwelijks*|gedragen", sub: "Sommige stukjes zijn|nooit aan geweest" },
      { type: "duo", tekst: "Veilig via|*Noah & Emma*", sub: "Geen kinderfoto's — onze|AI-modellen showen alles" },
      { type: "eind" },
    ],
  },
];
