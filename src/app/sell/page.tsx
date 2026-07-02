"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Camera, ArrowRight, Loader2, Plus, Sparkles, ChevronRight, ChevronLeft, Check, Crown, Zap, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { NoahEmmaModel } from "@/components/ai-models/NoahEmmaModel";
import { compositeClothingOnAvatar, compositeAllAngles, dataUrlToFile } from "@/lib/avatarComposite";
import { AvatarViewer3D } from "@/components/avatar/AvatarViewer3D";

const CATEGORY_HIERARCHY: Record<string, { icon: string; sub: string[] }> = {
  "Meisjeskleding": { icon: "👧", sub: ["Jurken & Rokken", "Jassen & Vesten", "Truien & Sweaters", "T-shirts & Tops", "Broeken & Leggings", "Zwemkleding & Badpakken", "Pyjama & Ondergoed", "Schoenen & Laarzen", "Sokken & Kousen", "Feest & Galakleding", "Sportkleding", "Mutsen & Sjaals"] },
  "Jongenskleding": { icon: "👦", sub: ["Jassen & Vesten", "Truien & Sweaters", "T-shirts & Poloshirts", "Broeken & Shorts", "Zwemkleding", "Pyjama & Ondergoed", "Schoenen & Laarzen", "Sokken", "Sportkleding", "Mutsen & Sjaals"] },
  "Speelgoed": { icon: "🧸", sub: ["Houten Speelgoed", "Educatief Speelgoed", "Knuffels & Poppen", "Buitenspeelgoed", "Puzzels & Spellen", "Constructie & Lego", "Rijdend Speelgoed", "Muziekinstrumenten"] },
  "Kinderwagens, buggy's & autostoeltjes": { icon: "🛒", sub: ["Combinatiewagens", "Buggy's & Wandelwagens", "Autostoeltjes", "Draagdoeken & Carriers", "Wagen-accessoires"] },
  "Meubilair & decoratie": { icon: "🛏️", sub: ["Bedjes & Wiegjes", "Kasten & Opbergers", "Kinderstoelen", "Bureaus & Tafels", "Babyfoons", "Wanddecoratie", "Gordijnen & Raamdecoratie"] },
  "Badderen & verschonen": { icon: "🛁", sub: ["Badje & Accessoires", "Luiers & Doekjes", "Luierzakken & -tassen", "Verzorgingsproducten", "Commode-accessoires"] },
  "Veiligheid in en om het huis": { icon: "🔒", sub: ["Babyfoons", "Bedhekjes & Traplekken", "Hoekbeschermers", "Stopcontactbeveiliging"] },
  "Gezondheid & zwangerschap": { icon: "🤰", sub: ["Zwangerschapskleding", "Borstvoeding", "Kolfapparaten", "Vitamines & Supplementen", "Zwangerschapskussens"] },
  "Voeden": { icon: "🍼", sub: ["Flesjes & Spenen", "Borstkolven", "Eetservies & Bekers", "Kinderstoelen", "Sterilisatoren", "Babyvoeding"] },
  "Slapen & beddengoed": { icon: "😴", sub: ["Slaapzakken", "Kussens & Dekbedden", "Beddengoed & Hoeslakens", "Bedbumpers", "Nachtlampjes"] },
  "Schoolbenodigdheden": { icon: "🎒", sub: ["Rugzakken & Tassen", "Brooddozen & Drinkflessen", "Pennen & Schrijfgerei", "Tekenmaterialen"] },
  "Overige kinderartikelen": { icon: "📦", sub: ["Speelmatten & Boxen", "Wipstoelen & Schommels", "Zwembaden & Waterspeelgoed", "Feestartikelen", "Overig"] },
};

export default function SellPage() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);           // verwerkte bestanden (voor upload)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);     // verwerkte previews
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);       // originele bestanden
  const [originalPreviews, setOriginalPreviews] = useState<string[]>([]); // originele previews
  const [processingIndices, setProcessingIndices] = useState<Set<number>>(new Set());
  const [backComposites, setBackComposites] = useState<(string | null)[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [size, setSize] = useState("68");
  const [condition, setCondition] = useState("Nieuw met prijskaartje");
  const [price, setPrice] = useState("");
  const [merk, setMerk] = useState("");
  const [allowBidding, setAllowBidding] = useState(false);
  const [kleur, setKleur] = useState("");
  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const [catStap, setCatStap] = useState<"hoofd" | "sub">("hoofd");
  const [loading, setLoading] = useState(false);
  const [gepromoot, setGepromoot] = useState(false);
  const [promotieDuur, setPromotieDuur] = useState<3 | 7 | null>(null);
  const [aiModel, setAiModel] = useState<"none" | "noah" | "emma">("none");
  const [kindMaat, setKindMaat] = useState("86");
  const aiModelRef = useRef<"none" | "noah" | "emma">("none");
  const imageCountRef = useRef(0); // bijhouden hoeveel afbeeldingen er al zijn
  const { toast } = useToast();

  // Laad het kindprofiel van de ingelogde gebruiker
  useEffect(() => {
    const laadKind = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("children").select("maat").eq("user_id", user.id).order("created_at").limit(1).single();
      if (data?.maat) setKindMaat(data.maat);
    };
    laadKind();
  }, []);

  // Verwerk een afbeelding: vervang gezicht met Noah/Emma als model geselecteerd
  const processImage = useCallback(async (
    dataUrl: string,
    file: File,
    index: number,
    model: "none" | "noah" | "emma",
  ) => {
    if (model === "none") {
      setImagePreviews(prev => { const n = [...prev]; n[index] = dataUrl; return n; });
      setImageFiles(prev => { const n = [...prev]; n[index] = file; return n; });
      return;
    }

    setProcessingIndices(prev => new Set(prev).add(index));
    try {
      const { front, back } = await compositeAllAngles(dataUrl, model);
      const processedFile = dataUrlToFile(front, file.name);
      setImagePreviews(prev => { const n = [...prev]; n[index] = front; return n; });
      setImageFiles(prev => { const n = [...prev]; n[index] = processedFile; return n; });
      setBackComposites(prev => { const n = [...prev]; n[index] = back; return n; });
      toast({ title: `✨ ${model === 'noah' ? 'Noah' : 'Emma'} presenteert jouw item!`, description: "Draai om voor- én achterkant te zien." });
    } catch {
      // Fallback: gebruik origineel
      setImagePreviews(prev => { const n = [...prev]; n[index] = dataUrl; return n; });
      setImageFiles(prev => { const n = [...prev]; n[index] = file; return n; });
    } finally {
      setProcessingIndices(prev => { const n = new Set(prev); n.delete(index); return n; });
    }
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files);
    const currentModel = aiModelRef.current;

    // Laad alle bestanden parallel als dataUrls
    const loaded = await Promise.all(fileList.map((file) =>
      new Promise<{ file: File; dataUrl: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ file, dataUrl: reader.result as string });
        reader.readAsDataURL(file);
      })
    ));

    // Sla startIndex op vóór state-update (via ref, niet stale closure)
    const startIndex = imageCountRef.current;
    imageCountRef.current += loaded.length;

    // Voeg toe aan state
    setOriginalPreviews(prev => [...prev, ...loaded.map(i => i.dataUrl)]);
    setOriginalFiles(prev => [...prev, ...loaded.map(i => i.file)]);
    setImagePreviews(prev => [...prev, ...loaded.map(i => i.dataUrl)]);
    setImageFiles(prev => [...prev, ...loaded.map(i => i.file)]);

    // Verwerk elk bestand asynchroon (gezicht vervangen)
    loaded.forEach(({ file, dataUrl }, i) => {
      processImage(dataUrl, file, startIndex + i, currentModel);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setOriginalPreviews(prev => prev.filter((_, i) => i !== index));
    setOriginalFiles(prev => prev.filter((_, i) => i !== index));
    setBackComposites(prev => prev.filter((_, i) => i !== index));
    imageCountRef.current = Math.max(0, imageCountRef.current - 1);
    if (selectedImageIndex >= index && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Wissel AI model: herverwerk alle bestaande afbeeldingen
  const handleAiModelChange = async (newModel: "none" | "noah" | "emma") => {
    setAiModel(newModel);
    aiModelRef.current = newModel;

    if (originalPreviews.length === 0) return;

    if (newModel === "none") {
      // Herstel originelen
      setImagePreviews([...originalPreviews]);
      setImageFiles([...originalFiles]);
      setBackComposites(new Array(originalPreviews.length).fill(null));
      return;
    }

    // Herverwerk alle afbeeldingen met het nieuwe model
    for (let i = 0; i < originalPreviews.length; i++) {
      processImage(originalPreviews[i], originalFiles[i], i, newModel);
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
      const { error: insertError } = await supabase.from("listings").insert({
        user_id: user.id,
        titel: title,
        beschrijving: description,
        prijs: parseFloat(price),
        maat: size,
        conditie: condition,
        categorie: mainCategory || "Overig",
        subcategorie: subCategory || null,
        merk: merk || null,
        kleur: kleur || null,
        foto_urls: fotoUrls,
        ai_model: aiModel === "none" ? null : aiModel,
        bieden_toegestaan: allowBidding,
        gepromoot: gepromoot && promotieDuur !== null,
        promotie_verloopdatum: gepromoot && promotieDuur ? (() => {
          const d = new Date(); d.setDate(d.getDate() + promotieDuur); return d.toISOString();
        })() : null,
        actief: true,
      });

      if (insertError) throw insertError;

      toast({ title: "Product geplaatst! 🎉", description: "Je advertentie staat nu live." });
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
                {/* 3D viewer wanneer model actief, anders gewone foto */}
                {aiModel !== 'none' ? (
                  <AvatarViewer3D
                    frontComposite={imagePreviews[selectedImageIndex] !== originalPreviews[selectedImageIndex]
                      ? imagePreviews[selectedImageIndex]
                      : null}
                    backComposite={backComposites[selectedImageIndex] ?? null}
                    isGenerating={processingIndices.has(selectedImageIndex)}
                    avatarName={aiModel === 'noah' ? 'Noah' : 'Emma'}
                    className="absolute inset-0"
                  />
                ) : (
                  <Image src={imagePreviews[selectedImageIndex]} alt="Product" fill className="object-cover" />
                )}

                {/* Verwijder-knop */}
                <button
                  onClick={() => removeImage(selectedImageIndex)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Badge eigen foto modus */}
                {aiModel === 'none' && (
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    Eigen foto
                  </div>
                )}
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
              </div>
            ))}
            <label className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer border-2 border-dashed border-slate-200">
              <Plus className="w-6 h-6 text-slate-400" />
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </section>

        {/* Info: gezicht wordt automatisch vervangen */}
        {aiModel !== 'none' && originalPreviews.length > 0 && (
          <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 flex gap-3">
            <Wand2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-primary">Gezicht automatisch vervangen</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                {aiModel === 'noah' ? 'Noah' : 'Emma'} presenteert jouw kledingstuk. Geen echte kinderfotos zichtbaar ✓
              </p>
            </div>
          </div>
        )}

        {/* AI Model sectie */}
        <section className="bg-gradient-to-br from-[#fff0f3] to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-5 border border-pink-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Toon op AI-model</h3>
              <p className="text-xs text-slate-500">Laat Noah of Emma het kledingstuk modelleren</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleAiModelChange("none")}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                aiModel === "none" ? "border-slate-400 bg-slate-50 dark:bg-slate-800" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900"
              )}
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Camera className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Eigen foto</p>
            </button>

            <NoahEmmaModel
              naam="noah"
              maat={size || kindMaat}
              size="sm"
              selected={aiModel === "noah"}
              onClick={() => handleAiModelChange("noah")}
            />

            <NoahEmmaModel
              naam="emma"
              maat={size || kindMaat}
              size="sm"
              selected={aiModel === "emma"}
              onClick={() => handleAiModelChange("emma")}
            />
          </div>

          {aiModel !== "none" && (
            <div className="bg-primary/10 rounded-xl p-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs font-bold text-primary-dark">
                {aiModel === "noah" ? "Noah" : "Emma"} presenteert jouw item · Maat {size || kindMaat}
              </p>
            </div>
          )}
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
            <label className="text-sm font-bold text-slate-500">Categorie</label>
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

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Maat</label>
            <div className="grid grid-cols-4 gap-2">
              {["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"].map(s => (
                <button key={s} onClick={() => setSize(s)} className={cn(
                  "py-2.5 rounded-xl text-xs font-bold transition-all",
                  size === s ? "bg-pink-50 text-primary-dark border-2 border-primary" : "bg-slate-50 dark:bg-slate-800 text-slate-500"
                )}>{s}</button>
              ))}
            </div>
          </div>

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
              <Input type="number" placeholder="0,00" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-7 pl-10 pr-4 font-bold text-lg" />
            </div>
          </div>
        </section>

        {/* Advertentieruimte */}
        <div className={cn(
          "rounded-2xl border-2 overflow-hidden transition-all",
          gepromoot && promotieDuur ? "border-amber-400 bg-amber-50 dark:bg-amber-900/10" : "border-slate-100 dark:border-slate-800"
        )}>
          <div className="p-4 flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              gepromoot && promotieDuur ? "bg-amber-400" : "bg-slate-100 dark:bg-slate-800"
            )}>
              <Crown className={cn("w-5 h-5", gepromoot && promotieDuur ? "text-white" : "text-slate-400")} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Advertentieruimte inkopen</p>
              <p className="text-xs text-slate-400">Direct bovenaan in Ontdekken</p>
            </div>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {([
              { dagen: 3, prijs: "€2,99", label: "3 dagen" },
              { dagen: 7, prijs: "€4,99", label: "7 dagen" },
            ] as const).map(optie => {
              const isActief = gepromoot && promotieDuur === optie.dagen;
              return (
                <button
                  key={optie.dagen}
                  type="button"
                  onClick={() => {
                    if (isActief) { setGepromoot(false); setPromotieDuur(null); }
                    else { setGepromoot(true); setPromotieDuur(optie.dagen); }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all",
                    isActief ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      isActief ? "border-amber-500 bg-amber-500" : "border-slate-300"
                    )}>
                      {isActief && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-left">
                      <p className={cn("text-sm font-bold", isActief ? "text-amber-800 dark:text-amber-300" : "text-slate-700 dark:text-slate-200")}>
                        {optie.label} zichtbaarheid
                      </p>
                      <p className="text-xs text-slate-400">Gouden badge · Altijd bovenaan</p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-black shrink-0", isActief ? "text-amber-700" : "text-slate-900 dark:text-white")}>
                    {optie.prijs}
                  </span>
                </button>
              );
            })}
            {gepromoot && promotieDuur && (
              <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 rounded-xl px-3 py-2">
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Promotie actief voor {promotieDuur} dagen. Betaling via Mollie (binnenkort).
                </p>
              </div>
            )}
          </div>
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
              <span className="text-lg">Product Plaatsen</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </main>
    </div>
  );
}
