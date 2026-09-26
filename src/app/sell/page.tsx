"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Camera, ArrowRight, Loader2, Plus, Sparkles, ChevronRight, ChevronLeft, Check, Crown, Zap, Star, Rocket, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn, normaliseerPrijsInvoer } from "@/lib/utils";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BOOST_TIERS, type BoostTier } from "@/lib/prijzen";
import { CATEGORY_HIERARCHY } from "@/lib/categorieen";
import { verkleinAfbeelding } from "@/lib/afbeelding";
import { controleerFoto } from "@/lib/fotoVeiligheid";

const MAX_FOTOS = 8;
const KLEDING_CATEGORIEEN = ["Meisjeskleding", "Jongenskleding"];
const LEEFTIJDEN = ["0-1 jaar", "1-3 jaar", "3-6 jaar", "6-9 jaar", "9-12 jaar", "Alle leeftijden"];

export default function SellPage() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);           // bestanden (voor upload)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);     // previews
  // Privacycontrole per foto: alleen foto's met status "ok" mogen geüpload worden.
  const [fotoCheck, setFotoCheck] = useState<{ status: "bezig" | "ok" | "geweigerd"; reden: string | null }[]>([]);
  // Per foto een uniek versienummer: schuiven de indexen na het verwijderen
  // van een foto, dan wordt een lopende controle genegeerd in plaats van dat
  // die op de verkeerde foto terechtkomt.
  const verwerkVersie = useRef<number[]>([]);
  const laatsteVersie = useRef(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const isKleding = KLEDING_CATEGORIEEN.includes(mainCategory);
  const [size, setSize] = useState("68");
  const [leeftijd, setLeeftijd] = useState("");
  const [condition, setCondition] = useState("Nieuw met prijskaartje");
  const [price, setPrice] = useState("");
  const [merk, setMerk] = useState("");
  const [allowBidding, setAllowBidding] = useState(false);
  const [kleur, setKleur] = useState("");
  const [boostTier, setBoostTier] = useState<BoostTier | null>(null);
  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const [catStap, setCatStap] = useState<"hoofd" | "sub">("hoofd");
  const [loading, setLoading] = useState(false);
  const imageCountRef = useRef(0); // bijhouden hoeveel afbeeldingen er al zijn
  const maatHandmatigRef = useRef(false); // true zodra de verkoper zelf een maat kiest
  const { toast } = useToast();

  // Laad het kindprofiel van de ingelogde gebruiker en stel de maat daarop in
  // — tenzij de verkoper zelf al een maat gekozen heeft.
  useEffect(() => {
    const laadKind = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("children").select("maat").eq("user_id", user.id).order("created_at").limit(1).single();
      if (data?.maat && !maatHandmatigRef.current) {
        setSize(data.maat);
      }
    };
    laadKind();
  }, []);

  // Privacycontrole per foto: foto's met een gezicht worden geweigerd. Bij
  // elke twijfel of fout wordt de foto ook geweigerd.
  // (Noah/Emma als AI-model is tijdelijk uitgezet — komt later terug.)
  const controleer = useCallback(async (dataUrl: string, index: number) => {
    const versie = ++laatsteVersie.current;
    verwerkVersie.current[index] = versie;
    const isActueel = () => verwerkVersie.current[index] === versie;
    const zetStatus = (status: "bezig" | "ok" | "geweigerd", reden: string | null = null) =>
      setFotoCheck(prev => { const n = [...prev]; n[index] = { status, reden }; return n; });

    zetStatus("bezig");
    const controle = await controleerFoto(dataUrl, "none");
    if (!isActueel()) return;
    if (!controle.ok) {
      zetStatus("geweigerd", controle.reden);
      toast({ variant: "destructive", title: "Foto niet toegestaan", description: controle.reden });
      return;
    }
    zetStatus("ok");
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let fileList = Array.from(files);

    const ruimteOver = MAX_FOTOS - imageCountRef.current;
    if (fileList.length > ruimteOver) {
      fileList = fileList.slice(0, Math.max(0, ruimteOver));
      toast({ variant: "destructive", title: "Maximaal 8 foto's", description: `Alleen de eerste ${fileList.length} foto's zijn toegevoegd.` });
    }
    if (fileList.length === 0) return;

    // Laad + verklein alle bestanden parallel (voorkomt trage uploads en
    // onnodig grote opslag bij foto's rechtstreeks van een telefooncamera)
    const loaded = await Promise.all(fileList.map((file) => verkleinAfbeelding(file)));

    // Sla startIndex op vóór state-update (via ref, niet stale closure)
    const startIndex = imageCountRef.current;
    imageCountRef.current += loaded.length;

    // Voeg toe aan state
    setImagePreviews(prev => [...prev, ...loaded.map(i => i.dataUrl)]);
    setImageFiles(prev => [...prev, ...loaded.map(i => i.file)]);
    setFotoCheck(prev => [...prev, ...loaded.map(() => ({ status: "bezig" as const, reden: null }))]);

    // Controleer elke foto asynchroon op gezichten
    loaded.forEach(({ dataUrl }, i) => {
      controleer(dataUrl, startIndex + i);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFotoCheck(prev => prev.filter((_, i) => i !== index));
    verwerkVersie.current = verwerkVersie.current.filter((_, i) => i !== index);
    imageCountRef.current = Math.max(0, imageCountRef.current - 1);
    if (selectedImageIndex >= index && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handlePost = async () => {
    if (imagePreviews.length === 0) {
      toast({ variant: "destructive", title: "Oeps!", description: "Voeg eerst minstens één foto toe." });
      return;
    }
    if (!title.trim()) {
      toast({ variant: "destructive", title: "Oeps!", description: "Vul een titel in." });
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      toast({ variant: "destructive", title: "Oeps!", description: "Vul een geldige prijs in." });
      return;
    }
    if (!mainCategory) {
      toast({ variant: "destructive", title: "Oeps!", description: "Kies een categorie, anders is je advertentie niet terug te vinden." });
      return;
    }
    if (fotoCheck.some(f => f.status === "bezig")) {
      toast({ variant: "destructive", title: "Even geduld", description: "Je foto's worden nog gecontroleerd." });
      return;
    }
    if (fotoCheck.length !== imageFiles.length || fotoCheck.some(f => f.status !== "ok")) {
      toast({ variant: "destructive", title: "Foto niet toegestaan", description: "Verwijder eerst de foto's die zijn afgekeurd." });
      return;
    }

    setLoading(true);

    try {
      // Controleer of gebruiker ingelogd is
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ variant: "destructive", title: "Niet ingelogd", description: "Log eerst in om een product te plaatsen." });
        router.push("/login");
        return;
      }

      // Foto's uploaden naar Supabase Storage
      const fotoUrls: string[] = [];
      for (const file of imageFiles) {
        const bestandsnaam = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(bestandsnaam, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("listings")
          .getPublicUrl(bestandsnaam);

        fotoUrls.push(publicUrl);
      }

      // Listing opslaan in database
      const { data: nieuwListing, error: insertError } = await supabase.from("listings").insert({
        user_id: user.id,
        titel: title,
        beschrijving: description,
        prijs: parseFloat(price),
        maat: isKleding ? size : (leeftijd || null),
        conditie: condition,
        categorie: mainCategory || "Overige kinderartikelen",
        subcategorie: subCategory || null,
        merk: merk || null,
        kleur: kleur || null,
        foto_urls: fotoUrls,
        ai_model: null,
        bieden_toegestaan: allowBidding,
        actief: true,
      }).select("id").single();

      if (insertError) throw insertError;

      // Boost meteen afrekenen als er bij het plaatsen een pakket is gekozen —
      // zelfde eindpunt als de losse Boost-knop bij "Mijn items", nu automatisch
      // aangeroepen zodat je niet na het plaatsen alsnog terug hoeft.
      if (boostTier && nieuwListing) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const res = await fetch("/api/betalen/boost", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ listingId: nieuwListing.id, tier: boostTier }),
          });
          const data = await res.json();
          if (res.ok && data.checkoutUrl) {
            toast({ title: "Product geplaatst! 🎉", description: "Even afrekenen voor je boost…" });
            window.location.href = data.checkoutUrl;
            return;
          }
          // Boost-betaling starten mislukt — het product staat al online, dus
          // niet de hele plaatsing laten mislukken. Gewoon doorgaan zonder boost.
          toast({ variant: "destructive", title: "Boost starten mislukt", description: "Je product staat online, maar de boost kon niet gestart worden. Probeer het later via je profiel." });
        }
      }

      toast({ title: "Product geplaatst! 🎉", description: "Je advertentie wordt kort beoordeeld en is daarna zichtbaar voor iedereen." });
      router.push("/");

    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Er ging iets mis", description: "Probeer het opnieuw." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen font-body text-slate-800 dark:text-slate-100 pb-28">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-pink-50 dark:border-slate-800">
        <Link href="/">
          <button className="p-2 hover:bg-pink-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </Link>
        <h1 className="text-lg font-bold text-slate-700 dark:text-white">Product Toevoegen</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        {/* Foto sectie */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Foto's</h2>

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shadow-md">
            {imagePreviews.length > 0 ? (
              <>
                <Image src={imagePreviews[selectedImageIndex]} alt="Product" fill className="object-cover" />

                {/* Verwijder-knop */}
                <button
                  onClick={() => removeImage(selectedImageIndex)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Privacycontrole: foto afgekeurd */}
                {fotoCheck[selectedImageIndex]?.status === "geweigerd" && (
                  <div className="absolute inset-0 z-[5] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center px-8 gap-2">
                    <ShieldAlert className="w-10 h-10 text-red-400" />
                    <p className="text-sm font-bold text-white">Foto niet toegestaan</p>
                    <p className="text-xs text-slate-200 leading-relaxed">{fotoCheck[selectedImageIndex]?.reden}</p>
                  </div>
                )}

                {/* Badge eigen foto modus */}
                <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Eigen foto
                </div>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <Camera className="w-12 h-12 text-primary mb-2" />
                <span className="text-sm font-bold text-slate-500">Klik om foto's toe te voegen</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {imagePreviews.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all",
                  selectedImageIndex === idx ? "border-primary scale-105" : "border-transparent opacity-70"
                )}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                {fotoCheck[idx]?.status === "geweigerd" && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  </div>
                )}
                {fotoCheck[idx]?.status === "bezig" && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                )}
              </div>
            ))}
            {imagePreviews.length < MAX_FOTOS && (
              <label className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer border-2 border-dashed border-slate-200">
                <Plus className="w-6 h-6 text-slate-400" />
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </section>


        {/* Details sectie */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-pink-50 dark:border-slate-800 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Titel</label>
            <Input placeholder="Bijv. Blauwe winterjas maat 92" value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-6" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Merk (optioneel)</label>
            <Input placeholder="Bijv. Zara, H&M, Nike..." value={merk} onChange={e => setMerk(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-6" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Omschrijving</label>
            <Textarea placeholder="Vertel meer over het item..." value={description} onChange={e => setDescription(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl min-h-[100px]" />
          </div>

          {/* Categorie kiezer */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Categorie <span className="text-primary">*</span></label>
            <button
              type="button"
              onClick={() => { setCatStap("hoofd"); setCatSheetOpen(true); }}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-left"
            >
              {mainCategory ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CATEGORY_HIERARCHY[mainCategory]?.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{mainCategory}</p>
                    {subCategory && <p className="text-xs text-primary font-semibold">{subCategory}</p>}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Kies een categorie</span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Categorie Sheet */}
          <Sheet open={catSheetOpen} onOpenChange={open => { if (!open) setCatSheetOpen(false); }}>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 overflow-hidden">
              <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  {catStap === "sub" && (
                    <button onClick={() => setCatStap("hoofd")} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                  )}
                  <SheetTitle className="text-lg font-black text-slate-900 dark:text-white">
                    {catStap === "hoofd" ? "Kies een categorie" : mainCategory}
                  </SheetTitle>
                </div>
                {catStap === "sub" && (
                  <p className="text-sm text-slate-400 mt-0.5">Kies een subcategorie</p>
                )}
              </SheetHeader>

              <div className="overflow-y-auto h-full pb-16">
                {/* Stap 1: Hoofdcategorieën */}
                {catStap === "hoofd" && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(CATEGORY_HIERARCHY).map(([cat, { icon }]) => (
                      <button
                        key={cat}
                        onClick={() => { setMainCategory(cat); setSubCategory(""); setCatStap("sub"); }}
                        className="w-full flex items-center gap-4 px-5 py-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors text-left"
                      >
                        <span className="text-2xl w-8 text-center">{icon}</span>
                        <span className={cn("flex-1 text-[15px] font-semibold", mainCategory === cat ? "text-primary font-bold" : "text-slate-800 dark:text-white")}>
                          {cat}
                        </span>
                        {mainCategory === cat && <Check className="w-4 h-4 text-primary shrink-0" />}
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Stap 2: Subcategorieën */}
                {catStap === "sub" && mainCategory && (
                  <div>
                    {/* Optie: alleen hoofdcategorie */}
                    <button
                      onClick={() => { setSubCategory(""); setCatSheetOpen(false); }}
                      className="w-full flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 active:bg-slate-50 transition-colors text-left"
                    >
                      <span className="text-2xl w-8 text-center">{CATEGORY_HIERARCHY[mainCategory]?.icon}</span>
                      <span className="flex-1 text-[15px] font-bold text-slate-800 dark:text-white">Alle {mainCategory}</span>
                      {!subCategory && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {CATEGORY_HIERARCHY[mainCategory].sub.map(sub => (
                        <button
                          key={sub}
                          onClick={() => { setSubCategory(sub); setCatSheetOpen(false); }}
                          className="w-full flex items-center gap-4 px-5 py-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors text-left"
                        >
                          <span className="w-8" />
                          <span className={cn("flex-1 text-[15px]", subCategory === sub ? "font-bold text-primary" : "font-medium text-slate-700 dark:text-slate-300")}>
                            {sub}
                          </span>
                          {subCategory === sub && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {isKleding ? (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500">Maat</label>
              <div className="grid grid-cols-4 gap-2">
                {["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"].map(s => (
                  <button key={s} onClick={() => { maatHandmatigRef.current = true; setSize(s); }} className={cn(
                    "py-2.5 rounded-xl text-xs font-bold transition-all",
                    size === s ? "bg-pink-50 text-primary-dark border-2 border-primary" : "bg-slate-50 dark:bg-slate-800 text-slate-500"
                  )}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500">Leeftijd (optioneel)</label>
              <div className="grid grid-cols-3 gap-2">
                {LEEFTIJDEN.map(l => (
                  <button key={l} type="button" onClick={() => setLeeftijd(leeftijd === l ? "" : l)} className={cn(
                    "py-2.5 rounded-xl text-xs font-bold transition-all",
                    leeftijd === l ? "bg-pink-50 text-primary-dark border-2 border-primary" : "bg-slate-50 dark:bg-slate-800 text-slate-500"
                  )}>{l}</button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Kleur (optioneel)</label>
            <div className="flex flex-wrap gap-2">
              {[
                { naam: "Wit", hex: "#ffffff", border: true },
                { naam: "Zwart", hex: "#1a1a1a" },
                { naam: "Grijs", hex: "#9ca3af" },
                { naam: "Rood", hex: "#ef4444" },
                { naam: "Roze", hex: "#ffb8c4" },
                { naam: "Oranje", hex: "#f97316" },
                { naam: "Geel", hex: "#fbbf24" },
                { naam: "Groen", hex: "#22c55e" },
                { naam: "Blauw", hex: "#3b82f6" },
                { naam: "Paars", hex: "#a855f7" },
                { naam: "Bruin", hex: "#92400e" },
                { naam: "Beige", hex: "#d4b896" },
              ].map(k => (
                <button
                  key={k.naam}
                  type="button"
                  onClick={() => setKleur(kleur === k.naam ? "" : k.naam)}
                  title={k.naam}
                  className={cn(
                    "w-9 h-9 rounded-full transition-all",
                    k.border ? "border-2 border-slate-200" : "",
                    kleur === k.naam ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                  )}
                  style={{ backgroundColor: k.hex }}
                />
              ))}
            </div>
            {kleur && (
              <p className="text-xs font-bold text-primary">Geselecteerd: {kleur}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Conditie</label>
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {["Nieuw met prijskaartje", "Zo goed als nieuw", "Goed", "Gebruikt"].map(cond => (
                <button key={cond} onClick={() => setCondition(cond)} className={cn(
                  "py-2.5 px-2 text-[10px] font-bold rounded-lg uppercase transition-all leading-tight text-center",
                  condition === cond ? "bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-white" : "text-slate-400"
                )}>{cond}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-pink-50 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-500">Vraagprijs</label>
              <div className="flex items-center space-x-2">
                <Switch id="bidding" checked={allowBidding} onCheckedChange={setAllowBidding} className="data-[state=checked]:bg-primary" />
                <Label htmlFor="bidding" className="text-xs font-bold text-slate-400">BIEDEN TOEGESTAAN</Label>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark font-bold text-lg">€</span>
              <Input type="text" inputMode="decimal" placeholder="0,00" value={price} onChange={e => setPrice(normaliseerPrijsInvoer(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-7 pl-10 pr-4 font-bold text-lg" />
            </div>
          </div>
        </section>

        {/* Advertentieruimte */}
        <div className="rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", boostTier ? "bg-amber-400" : "bg-slate-100 dark:bg-slate-800")}>
              <Crown className={cn("w-5 h-5", boostTier ? "text-white" : "text-slate-400")} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Advertentieruimte inkopen</p>
              <p className="text-xs text-slate-400">Optioneel — verschijn meteen vaker in Ontdekken</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(BOOST_TIERS) as [BoostTier, typeof BOOST_TIERS[BoostTier]][]).map(([id, tier]) => {
              const Icon = id === "fast" ? Zap : id === "popular" ? Star : Rocket;
              const actief = boostTier === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setBoostTier(actief ? null : id)}
                  className={cn(
                    "rounded-xl border-2 p-2.5 flex flex-col items-center gap-1 text-center transition-all",
                    actief ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  <Icon className={cn("w-4 h-4", actief ? "text-primary" : "text-slate-400")} />
                  <span className={cn("text-[11px] font-bold", actief ? "text-primary" : "text-slate-600 dark:text-slate-300")}>{tier.dagen}d</span>
                  <span className={cn("text-[10px] font-bold", actief ? "text-primary" : "text-slate-400")}>€{tier.prijs.toFixed(2).replace(".", ",")}</span>
                </button>
              );
            })}
          </div>
          {boostTier && (
            <p className="text-[11px] text-slate-400 text-center">Je rekent de boost direct na het plaatsen af via Mollie.</p>
          )}
        </div>

        <Button
          onClick={handlePost}
          disabled={loading}
          className="w-full h-16 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border-none"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span className="text-lg">{boostTier ? "Plaatsen & boosten" : "Product Plaatsen"}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </main>
    </div>
  );
}
