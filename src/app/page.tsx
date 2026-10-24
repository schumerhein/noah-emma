"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { haalGeblokkeerdeIds, filterZichtbaar } from "@/lib/zichtbaarheid";
import { leesActiefKind, slaActiefKindOp, zetViewportHoogte, type ActiefKind } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { PremiumModal } from "@/components/PremiumModal";
import { Heart, ShoppingBag, X, Zap } from "lucide-react";
import { LEGE_FEED_VOORKEUREN, scoreVoorkeurMatch, type FeedVoorkeuren } from "@/lib/feedVoorkeuren";
import { OpenBeoordelingen } from "@/components/OpenBeoordelingen";
import { NoahEmmaLogo } from "@/components/Header";
import { SwipeStapel, type SwipeListing, type SwipeRichting, type SwipeStapelHandle } from "@/components/SwipeStapel";

type Listing = SwipeListing;

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const stapelRef = useRef<SwipeStapelHandle>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<ActiefKind | null>(null);
  // "Annabel is gegroeid!" — de database zet de maat 's nachts automatisch
  // omhoog (kindmaat-meegroeien.sql); toon dat één keer per nieuwe maat.
  const [groeiMelding, setGroeiMelding] = useState<{ id: string; naam: string | null; maat: string } | null>(null);
  // Onthoud de filterkeuze van de gebruiker tussen sessies
  const [filterOpKind, setFilterOpKindState] = useState(true);
  const setFilterOpKind = (updater: boolean | ((prev: boolean) => boolean)) => {
    setFilterOpKindState(prev => {
      const nieuw = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("filter_op_kind", nieuw ? "1" : "0"); } catch {}
      return nieuw;
    });
  };
  // Verdienmodel
  const [isPremium, setIsPremium] = useState(false);
  const [swipesVandaag, setSwipesVandaag] = useState(0);
  // Zelfde teller, maar direct bij te werken: bij snel achter elkaar swipen
  // loopt de state één render achter en zou de daglimiet te laat ingaan.
  const swipesRef = useRef(0);
  const premiumRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const gastMeldingGetoond = useRef(false);
  const SWIPE_LIMIET = 10;
  const [toonPremiumModal, setToonPremiumModal] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Paginering van de "normale" (niet-gepromote) feed — zonder dit was de
  // feed hard afgekapt op de eerste 50 resultaten, en liet een herbezoek na
  // het leegswipen exact dezelfde 50 in exact dezelfde volgorde opnieuw zien.
  const PAGINA_GROOTTE = 20;
  const [normaalPagina, setNormaalPagina] = useState(0);
  const [heeftMeerNormaal, setHeeftMeerNormaal] = useState(true);
  const [meerLaden, setMeerLaden] = useState(false);
  const [heeftOoitContent, setHeeftOoitContent] = useState(false);
  const [isGast, setIsGast] = useState(false);

  // Ontdekken is één scherm dat precies past: niets om verticaal te scrollen.
  // Zonder deze vergrendeling schoof de hele pagina (met logo en kindfilter)
  // soms omhoog: de body is minstens 100vh hoog, en dat is op iOS meer dan
  // het zichtbare deel naast de adresbalk. Kwam je van een omlaag gescrolde
  // pagina (bv. je profiel), dan begon Ontdekken ook nog half gescrold.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.classList.add("scroll-vast");
    return () => document.documentElement.classList.remove("scroll-vast");
  }, []);

  useEffect(() => {
    (async () => {
      // Gasten mogen nu gewoon rondkijken en swipen — inloggen is pas nodig
      // zodra ze iets willen dóén (favorieten bewaren, contact opnemen,
      // bieden). Dat wordt per actie al correct afgedwongen; hier alleen
      // onthouden of er iemand is ingelogd, voor de UI (bijv. de
      // swipe-teller, die voor gasten toch niet van toepassing is).
      const { data: { user } } = await supabase.auth.getUser();
      userIdRef.current = user?.id ?? null;
      setIsGast(!user);
      setAuthChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    const actief = leesActiefKind();
    // Toon direct de gecachte waarde (voorkomt een flits van "geen kind"),
    // maar ververs 'm meteen vanuit de database — de cache kan een oudere
    // maat bevatten dan wat er nu voor dit kind is ingesteld (bijv. na een
    // wijziging op een ander apparaat), en die twee moeten altijd overeenkomen.
    if (actief) setKind(actief);
    laadKindFallback(actief?.id);
    checkPremiumEnSwipes();

    // Extra herberekening van de viewporthoogte kort na binnenkomst: na
    // een navigatie vanaf /login (met het toetsenbord nog open/sluitend)
    // kan het sluiten van het toetsenbord te laat of helemaal niet als
    // resize-event doorkomen, waardoor de pagina met de verkeerde (te
    // kleine) hoogte bleef staan totdat je zelf scrolde.
    zetViewportHoogte();
    const t = setTimeout(zetViewportHoogte, 350);

    // Herstel de bewaarde filterkeuze
    try {
      const bewaard = localStorage.getItem("filter_op_kind");
      if (bewaard !== null) setFilterOpKindState(bewaard === "1");
    } catch {}

    const onWissel = (e: Event) => {
      const nieuwKind = (e as CustomEvent<ActiefKind>).detail;
      setKind(nieuwKind);
      setGroeiMelding(null);
    };
    window.addEventListener("kind-gewisseld", onWissel);
    return () => {
      window.removeEventListener("kind-gewisseld", onWissel);
      clearTimeout(t);
    };
  }, [authChecked]);

  useEffect(() => { if (authChecked) laadListings(); }, [authChecked, kind, filterOpKind]);

  const checkPremiumEnSwipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, premium_verloopdatum")
      .eq("id", user.id)
      .single();

    const premium = profile?.is_premium &&
      (!profile.premium_verloopdatum || new Date(profile.premium_verloopdatum) > new Date());
    setIsPremium(premium || false);
    premiumRef.current = !!premium;

    if (!premium) {
      const vandaag = new Date().toISOString().split("T")[0];
      const { data: teller } = await supabase
        .from("swipe_tellers")
        .select("aantal")
        .eq("user_id", user.id)
        .eq("datum", vandaag)
        .maybeSingle();
      swipesRef.current = teller?.aantal || 0;
      setSwipesVandaag(swipesRef.current);
    }
  };

  // Haalt het actieve kind vers uit de database op — bij een bekend id
  // precies dat kind, anders (geen cache, of het kind bestaat niet meer)
  // het eerst aangemaakte kind. Zet het resultaat ook terug in de cache
  // zodat andere pagina's (en een volgend bezoek) meteen de juiste maat zien.
  const laadKindFallback = async (kindId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let query = supabase
      .from("children")
      .select("id, naam, maat, geslacht, maat_gegroeid_op")
      .eq("user_id", user.id);
    query = kindId
      ? query.eq("id", kindId)
      : query.order("created_at", { ascending: true }).limit(1);
    const { data } = await query.maybeSingle();
    if (data) {
      const { maat_gegroeid_op, ...actiefKind } = data;
      setKind(actiefKind as ActiefKind);
      slaActiefKindOp(actiefKind as ActiefKind);
      const recentGegroeid = maat_gegroeid_op && Date.now() - new Date(maat_gegroeid_op).getTime() < 14 * 24 * 60 * 60 * 1000;
      let alGezien = false;
      try { alGezien = localStorage.getItem(`groei_gezien_${data.id}`) === data.maat; } catch {}
      setGroeiMelding(recentGegroeid && !alGezien ? { id: data.id, naam: data.naam, maat: data.maat } : null);
    } else if (kindId) {
      // Het gecachte kind bestaat niet meer (verwijderd) — val terug op het eerste kind.
      laadKindFallback();
    }
  };

  const schud = <T,>(items: T[]): T[] => {
    const kopie = [...items];
    for (let i = kopie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    return kopie;
  };

  const basisQuery = () => {
    // "niet (meer) gepromoot" is niet hetzelfde als gepromoot=false — een
    // item met een verlopen boost heeft gepromoot nog op true staan, en
    // moet dus ook meetellen als "normaal", anders valt het tussen wal en
    // schip in plaats van gewoon terug te vallen in de normale rij.
    let query = supabase
      .from("listings")
      .select("*, profiles(naam, stad, gemiddelde_beoordeling, totaal_beoordelingen, avatar_url, vakantiestand, privacy_instellingen)")
      .eq("actief", true)
      .or(`gepromoot.eq.false,promotie_verloopdatum.lte.${new Date().toISOString()}`);
    if (kind && filterOpKind) query = query.eq("maat", kind.maat);
    if (kind?.geslacht === "jongen") query = query.neq("categorie", "Meisjeskleding");
    else if (kind?.geslacht === "meisje") query = query.neq("categorie", "Jongenskleding");
    return query;
  };

  const haalVoorkeurenOp = async (userId: string | undefined) => {
    if (!userId) return LEGE_FEED_VOORKEUREN;
    const { data: profiel } = await supabase
      .from("profiles")
      .select("feed_voorkeuren, privacy_instellingen")
      .eq("id", userId)
      .single();
    const gepersonaliseerd = profiel?.privacy_instellingen?.gepersonaliseerde_inhoud !== false;
    return gepersonaliseerd && profiel?.feed_voorkeuren
      ? { ...LEGE_FEED_VOORKEUREN, ...profiel.feed_voorkeuren }
      : LEGE_FEED_VOORKEUREN;
  };

  const laadListings = async () => {
    setLoading(true);
    setNormaalPagina(0);
    setHeeftMeerNormaal(true);
    setHeeftOoitContent(false);

    // Laad gepromote listings eerst. Geen limit(5) hier — we halen ALLE nog
    // actieve boosts op en husselen ze zelf dooreen, zodat bij meer dan 5
    // gelijktijdige boosts iedere betalende verkoper over meerdere
    // paginabezoeken een eerlijke kans krijgt vooraan te staan, in plaats
    // van dat de database willekeurig (en steeds dezelfde) 5 kiest.
    let queryPromoted = supabase
      .from("listings")
      .select("*, profiles(naam, stad, gemiddelde_beoordeling, totaal_beoordelingen, avatar_url, vakantiestand, privacy_instellingen)")
      .eq("actief", true)
      .eq("gepromoot", true)
      .gt("promotie_verloopdatum", new Date().toISOString());
    if (kind && filterOpKind) queryPromoted = queryPromoted.eq("maat", kind.maat);
    if (kind?.geslacht === "jongen") queryPromoted = queryPromoted.neq("categorie", "Meisjeskleding");
    else if (kind?.geslacht === "meisje") queryPromoted = queryPromoted.neq("categorie", "Jongenskleding");

    const queryNormaal = basisQuery()
      .order("created_at", { ascending: false })
      .range(0, PAGINA_GROOTTE - 1);

    const [{ data: promoted }, { data: normaal }, geblokkeerd, { data: { user } }] = await Promise.all([
      queryPromoted,
      queryNormaal,
      haalGeblokkeerdeIds(),
      supabase.auth.getUser(),
    ]);

    const geschud = schud((promoted || []) as Listing[]);
    const topPromoted = geschud.slice(0, 5);
    const restPromoted = geschud.slice(5); // niet in de top-5 deze keer, maar telt gewoon mee in de normale rij

    // Zachte personalisatie: advertenties die passen bij de opgeslagen
    // feed-voorkeuren (categorie/maat/merk) worden hoger gerangschikt,
    // maar nooit hard weggefilterd. De top-gepromote advertenties blijven
    // altijd vooraan staan (betaalde plaatsing), personalisatie sorteert
    // alleen binnen de rest.
    const voorkeuren = await haalVoorkeurenOp(user?.id);
    const sorteerOpVoorkeur = (items: Listing[]) =>
      [...items].sort((a, b) => scoreVoorkeurMatch(b, voorkeuren) - scoreVoorkeurMatch(a, voorkeuren));

    const restNormaal = sorteerOpVoorkeur([...restPromoted, ...((normaal || []) as Listing[])]);
    const combined = filterZichtbaar([...topPromoted, ...restNormaal], geblokkeerd, user?.id);

    setHeeftMeerNormaal((normaal || []).length === PAGINA_GROOTTE);
    if (combined.length > 0) setHeeftOoitContent(true);
    setListings(combined as Listing[]);
    setLoading(false);
  };

  // Haalt de volgende pagina normale listings op en plakt die achter de
  // huidige stapel — zonder dit liep de feed hard vast op de eerste 50
  // resultaten en liet een herbezoek exact dezelfde volgorde opnieuw zien.
  const laadMeerListings = async () => {
    if (meerLaden || !heeftMeerNormaal) return;
    setMeerLaden(true);
    const volgendePagina = normaalPagina + 1;
    const van = volgendePagina * PAGINA_GROOTTE;

    const [{ data: normaal }, geblokkeerd, { data: { user } }] = await Promise.all([
      basisQuery().order("created_at", { ascending: false }).range(van, van + PAGINA_GROOTTE - 1),
      haalGeblokkeerdeIds(),
      supabase.auth.getUser(),
    ]);

    const voorkeuren = await haalVoorkeurenOp(user?.id);
    const nieuw = filterZichtbaar(
      [...((normaal || []) as Listing[])].sort((a, b) => scoreVoorkeurMatch(b, voorkeuren) - scoreVoorkeurMatch(a, voorkeuren)),
      geblokkeerd,
      user?.id
    ) as Listing[];

    setNormaalPagina(volgendePagina);
    setHeeftMeerNormaal((normaal || []).length === PAGINA_GROOTTE);
    if (nieuw.length > 0) {
      setHeeftOoitContent(true);
      setListings(prev => [...prev, ...nieuw]);
    }
    setMeerLaden(false);
  };

  // Zodra de stapel bijna leeg is, alvast de volgende pagina ophalen — zo
  // merkt een gebruiker die lekker doorswiped niets van de paginering.
  useEffect(() => {
    if (authChecked && !loading && listings.length <= 3 && heeftMeerNormaal && !meerLaden) {
      laadMeerListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings.length, heeftMeerNormaal, authChecked, loading]);

  const registreerSwipe = async () => {
    const userId = userIdRef.current;
    if (!userId || premiumRef.current) return;

    swipesRef.current += 1;
    setSwipesVandaag(swipesRef.current);
    const vandaag = new Date().toISOString().split("T")[0];
    await supabase.from("swipe_tellers").upsert(
      { user_id: userId, datum: vandaag, aantal: swipesRef.current },
      { onConflict: "user_id,datum" }
    );
  };

  // Daglimiet: voor ingelogde gebruikers zonder Premium. Gasten tellen niet
  // mee (die worden pas bij een concrete actie naar inloggen gestuurd).
  const magSwipen = () => {
    if (userIdRef.current && !premiumRef.current && swipesRef.current >= SWIPE_LIMIET) {
      setToonPremiumModal(true);
      return false;
    }
    return true;
  };

  const handleSwipe = (direction: SwipeRichting, geswipet: Listing) => {
    // Meteen uit de stapel halen: de kaart vliegt als losse laag weg en de
    // volgende is direct te swipen. Like en teller gaan op de achtergrond,
    // zodat de animatie nooit op het netwerk hoeft te wachten.
    setListings(prev => prev.filter(l => l.id !== geswipet.id));

    if (direction === "right") {
      const userId = userIdRef.current;
      if (userId) {
        const actiefKind = leesActiefKind();
        supabase.from("favorites")
          .upsert(
            { user_id: userId, listing_id: geswipet.id, kind_id: actiefKind?.id ?? null },
            { onConflict: "user_id,listing_id" }
          )
          .then(() => {});
      } else if (!gastMeldingGetoond.current) {
        // Gast: like wordt niet bewaard — verwijs één keer naar inloggen
        gastMeldingGetoond.current = true;
        toast({
          title: "Log in om favorieten te bewaren",
          description: "Als gast worden je likes niet opgeslagen.",
        });
      }
    }
    registreerSwipe();
  };

  const current = listings[0];

  return (
    // Hoogte = zichtbaar scherm min de onderbalk (5rem + safe area) en min de
    // safe area bovenin, die AppFrame al als padding boven de pagina zet.
    // touch-none: een sleepbeweging (ook op de kop) scrolt nooit de pagina.
    <>
    <div className="flex flex-col verloop-merk dark:bg-none dark:bg-background-dark relative overflow-hidden touch-none overscroll-none" style={{ height: 'calc(var(--echte-vh, 100dvh) - 5rem - env(safe-area-inset-bottom) - env(safe-area-inset-top))' }}>

      {/* Header — compact gehouden zodat de foto op de kaart zo groot mogelijk
          is. Met een kind ingesteld vervangt het kind-filter de titel (die
          blijft voor schermlezers); "Ontdekken" staat ook al in het menu. */}
      <header className="pt-3.5 pb-2.5 px-5 z-10 shrink-0 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <NoahEmmaLogo size={30} />
          <h1 className={cn("text-[26px] font-extrabold text-slate-900 dark:text-white leading-none truncate", kind && "sr-only")}>Ontdekken</h1>
          {kind && (
            <button
              onClick={() => setFilterOpKind(f => !f)}
              aria-pressed={filterOpKind}
              className={cn(
                "min-w-0 flex items-center min-h-[36px] px-3 rounded-full border text-xs font-extrabold tracking-tight transition-all",
                filterOpKind
                  ? "bg-primary text-white border-primary shadow-[0_10px_20px_-10px_hsl(var(--primary)/0.8)]"
                  : "bg-white text-primary-dark border-primary/30"
              )}
            >
              <span className="mr-1.5 text-sm leading-none shrink-0">
                {kind.geslacht === "meisje" ? "👧" : kind.geslacht === "jongen" ? "👦" : "🧒"}
              </span>
              <span className="truncate">{kind.naam || "Kind"} · {filterOpKind ? `Maat ${kind.maat}` : "alle maten"}</span>
            </button>
          )}
        </div>
        {/* Swipe teller — de dagelijkse limiet geldt niet voor gasten (die
            worden pas bij een concrete actie naar inloggen gestuurd), dus
            toon in plaats daarvan een duidelijke inlog-uitnodiging. */}
        {isGast ? (
          <Link href="/login" className="shrink-0 flex items-center min-h-[36px] px-4 rounded-full bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-zacht">
            Log in
          </Link>
        ) : !isPremium && (
          <button
            onClick={() => setToonPremiumModal(true)}
            aria-label="Swipes over vandaag"
            className="shrink-0 flex items-center gap-1 min-h-[36px] px-3 rounded-full bg-white dark:bg-slate-800 shadow-zacht"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
              {Math.max(0, SWIPE_LIMIET - swipesVandaag)}/{SWIPE_LIMIET}
            </span>
          </button>
        )}
      </header>

      <OpenBeoordelingen compact className="shrink-0 mx-6 mb-2" />

      {groeiMelding && (
        <div className="shrink-0 mx-6 mb-2 flex items-center gap-3 rounded-[20px] bg-white dark:bg-slate-800 shadow-zacht px-4 py-3">
          <span className="text-xl leading-none">🎉</span>
          <p className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            {groeiMelding.naam || "Je kind"} is gegroeid! We laten nu maat {groeiMelding.maat} zien.
          </p>
          <button
            onClick={() => {
              try { localStorage.setItem(`groei_gezien_${groeiMelding.id}`, groeiMelding.maat); } catch {}
              setGroeiMelding(null);
            }}
            aria-label="Melding sluiten"
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-h-0 px-4 flex flex-col pt-1 touch-none overflow-hidden">

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
              <p className="text-slate-400 text-sm font-medium">Laden...</p>
            </div>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full flex flex-col items-center gap-3 rounded-[32px] bg-white dark:bg-slate-800 shadow-kaart px-7 py-10 text-center">
              <span className="w-16 h-16 rounded-[20px] bg-secondary flex items-center justify-center text-3xl" aria-hidden="true">
                {heeftOoitContent ? "🎉" : "🧺"}
              </span>
              {heeftOoitContent ? (
                <>
                  <h2 className="mt-1 text-[22px] font-extrabold text-slate-900 dark:text-slate-100">Je hebt alles gezien!</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                    {kind && filterOpKind
                      ? `Je hebt alle huidige items in maat ${kind.maat} bekeken. Kom later terug voor nieuw aanbod.`
                      : "Je hebt alle huidige items bekeken. Kom later terug voor nieuw aanbod."}
                  </p>
                  <button onClick={() => laadListings()} className="mt-3 min-h-[52px] px-7 rounded-full bg-slate-900 text-white font-bold text-[15px] shadow-zacht">
                    Opnieuw beginnen
                  </button>
                </>
              ) : kind && filterOpKind ? (
                <>
                  <h2 className="mt-1 text-[22px] font-extrabold text-slate-900 dark:text-slate-100">Nog niets in maat {kind.maat}</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">Er zijn nog geen items in de huidige maat van {kind.naam || "je kind"}.</p>
                  <button onClick={() => setFilterOpKind(false)} className="mt-3 min-h-[52px] px-7 rounded-full bg-slate-900 text-white font-bold text-[15px] shadow-zacht">
                    Toon alle maten
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mt-1 text-[22px] font-extrabold text-slate-900 dark:text-slate-100">Nog geen producten</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">Wees de eerste die iets plaatst: wat te klein is, past een ander kind precies.</p>
                  <Link href="/sell" className="mt-3 inline-flex items-center min-h-[52px] px-7 rounded-full bg-slate-900 text-white font-bold text-[15px] shadow-zacht">
                    Product plaatsen
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {!loading && current && (
          <>
            <div className="w-full relative flex-1 min-h-0">
              <SwipeStapel
                ref={stapelRef}
                listings={listings}
                magSwipen={magSwipen}
                onSwipe={handleSwipe}
                onOpen={(l) => router.push(`/product/${l.id}`)}
              />
            </div>

            {/* Actieknoppen */}
            <div className="flex items-center justify-center gap-6 pt-4 pb-3 shrink-0">
              <button
                onClick={() => stapelRef.current?.swipe("left")}
                aria-label="Volgende"
                className="w-[60px] h-[60px] rounded-full bg-white dark:bg-slate-800 border border-slate-900/10 shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                <X className="w-7 h-7" strokeWidth={2.5} />
              </button>

              <Link
                href={`/product/${current.id}`}
                aria-label="Bekijk product"
                className="w-[52px] h-[52px] rounded-full bg-slate-900 shadow-[0_12px_30px_-14px_rgba(36,26,46,0.6)] flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <ShoppingBag className="w-6 h-6" />
              </Link>

              <button
                onClick={() => stapelRef.current?.swipe("right")}
                aria-label="Bewaren"
                className="w-[60px] h-[60px] rounded-full bg-primary shadow-[0_14px_28px_-12px_hsl(var(--primary)/0.8)] flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <Heart className="w-7 h-7 fill-white" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>

    {/* Buiten de touch-none-laag, zodat de modal zelf gewoon aanraakbaar blijft */}
    <PremiumModal open={toonPremiumModal} onClose={() => setToonPremiumModal(false)} />
    </>
  );
}
