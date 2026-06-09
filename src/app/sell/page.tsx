
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  X, 
  Sparkles, 
  Camera, 
  ArrowRight, 
  User, 
  Loader2,
  Plus,
  ChevronRight,
  Check
} from "lucide-react";
import { blurFacesInPhoto } from "@/ai/flows/privacy-blurring-for-product-photos";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CATEGORIES = {
  "Kleding": ["Jassen", "Truien & Vesten", "T-shirts", "Broeken", "Jurken & Rokken", "Baby-outfits"],
  "Speelgoed": ["Houten speelgoed", "Knuffels", "Educatief", "Puzzels & Spellen", "Buitenspeelgoed"],
  "Meubels": ["Bedjes & Wiegjes", "Kasten", "Stoelen", "Decoratie", "Boxen"],
  "Accessoires": ["Slaapzakken", "Luiertassen", "Voeding", "Verzorging"]
};

export default function SellPage() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBlurActive, setIsBlurActive] = useState(true);
  const [facesDetectedMap, setFacesDetectedMap] = useState<Record<number, boolean>>({});
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [size, setSize] = useState("68");
  const [condition, setCondition] = useState("Nieuw");
  const [price, setPrice] = useState("");
  const [allowBidding, setAllowBidding] = useState(false);
  
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUri = reader.result as string;
          // Eerst de afbeelding toevoegen aan de staat
          setImages(prev => {
            const newIndex = prev.length;
            const newImages = [...prev, dataUri];
            // Start verwerking buiten de updater om render errors te voorkomen
            setTimeout(() => processPrivacy(dataUri, newIndex), 0);
            return newImages;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const processPrivacy = async (dataUri: string, index: number) => {
    setIsProcessing(true);
    try {
      const result = await blurFacesInPhoto({ photoDataUri: dataUri });
      setImages(prev => {
        const updated = [...prev];
        updated[index] = result.blurredPhotoDataUri;
        return updated;
      });
      setFacesDetectedMap(prev => ({ ...prev, [index]: result.facesDetected }));
      
      if (result.facesDetected) {
        toast({
          title: "Privacy Beschermd!",
          description: "Gezichten zijn automatisch vervaagd door onze AI.",
        });
      }
    } catch (error) {
      console.error("Privacy verwerking mislukt", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex >= index && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handlePost = () => {
    if (images.length === 0) {
      toast({ variant: "destructive", title: "Oeps!", description: "Voeg eerst minstens één foto toe." });
      return;
    }
    if (!title.trim()) {
      toast({ variant: "destructive", title: "Oeps!", description: "Vul een titel in voor je product." });
      return;
    }
    toast({
      title: "Product geplaatst!",
      description: "Je advertentie staat nu live op Kids Market.",
    });
  };

  const currentImage = images[selectedImageIndex];
  const currentFacesDetected = facesDetectedMap[selectedImageIndex];

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
        <div className="flex items-center justify-between px-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center space-y-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors",
                  step <= 2 ? "bg-primary text-white shadow-primary/40" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                )}>
                  {step}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  step <= 2 ? "text-primary-dark" : "text-slate-400"
                )}>
                  {step === 1 ? "Fotos" : step === 2 ? "Privacy" : "Details"}
                </span>
              </div>
              {step < 3 && <div className={cn("h-[2px] flex-1 mx-2 -mt-6", step === 1 ? "bg-primary/40" : "bg-slate-200 dark:bg-slate-700")} />}
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Foto's & Privacy</h2>
            <span className="inline-flex items-center px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-primary-dark text-[10px] font-bold rounded-full">
              <Sparkles className="w-3 h-3 mr-1" /> AI ACTIEF
            </span>
          </div>

          <div className="relative group aspect-[4/5] rounded-2xl overflow-hidden soft-shadow border-4 border-white dark:border-slate-800 bg-white">
            {images.length > 0 ? (
              <>
                <Image 
                  src={currentImage} 
                  alt="Product" 
                  fill 
                  className={cn("object-cover transition-all", isBlurActive && currentFacesDetected && "blur-sm")} 
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">AI Beschermt Privacy...</span>
                  </div>
                )}
                <button 
                  onClick={() => removeImage(selectedImageIndex)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-800">
                <Camera className="w-12 h-12 text-primary mb-2" />
                <span className="text-sm font-bold text-slate-500">Klik om foto's toe te voegen</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}

            {images.length > 0 && !isProcessing && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl p-3 border border-pink-100 dark:border-slate-700 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", isBlurActive && currentFacesDetected ? "bg-primary animate-pulse" : "bg-slate-300")} />
                  <p className="text-slate-600 dark:text-slate-200 text-xs font-semibold">
                    {currentFacesDetected ? (isBlurActive ? "Privacy-vervaging aan" : "Privacy-vervaging uit") : "Geen gezichten gevonden"}
                  </p>
                </div>
                {currentFacesDetected && (
                  <Switch 
                    checked={isBlurActive} 
                    onCheckedChange={setIsBlurActive}
                    className="data-[state=checked]:bg-primary"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {images.map((img, idx) => (
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
            <label className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700">
              <Plus className="w-6 h-6 text-slate-400" />
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-pink-50 dark:border-slate-800 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Titel</label>
            <Input 
              placeholder="Bijv. Vintage Zomerjurk" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-6"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Omschrijving</label>
            <Textarea 
              placeholder="Vertel meer over het item, de stof, pasvorm etc." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Categorie</label>
              <Select onValueChange={(val) => { setMainCategory(val); setSubCategory(""); }}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12">
                  <SelectValue placeholder="Selecteer" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORIES).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Subcategorie</label>
              <Select 
                disabled={!mainCategory} 
                onValueChange={setSubCategory}
                value={subCategory}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12">
                  <SelectValue placeholder="Selecteer" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategory && (CATEGORIES[mainCategory as keyof typeof CATEGORIES]).map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Maat</label>
            <div className="grid grid-cols-4 gap-2">
              {["56", "62", "68", "74", "80", "86", "92", "98"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "py-2.5 rounded-xl text-xs font-bold transition-all",
                    size === s 
                      ? "bg-pink-50 dark:bg-pink-900/20 text-primary-dark border-2 border-primary" 
                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Conditie</label>
            <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {["Nieuw", "Zgan", "Goed", "Gebruikt"].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-bold rounded-lg uppercase transition-all",
                    condition === cond 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-white" 
                      : "text-slate-400"
                  )}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-pink-50 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Vraagprijs</label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="bidding" 
                  checked={allowBidding} 
                  onCheckedChange={setAllowBidding}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="bidding" className="text-xs font-bold text-slate-400">BIEDEN TOEGESTAAN</Label>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark font-bold text-lg">€</span>
              <Input 
                type="number" 
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-7 pl-10 pr-4 focus:ring-2 focus:ring-primary font-bold text-lg text-slate-700 dark:text-white"
              />
            </div>
          </div>
        </section>

        <Button 
          onClick={handlePost}
          className="w-full h-16 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl soft-shadow flex items-center justify-center gap-3 transition-all active:scale-95 group border-none"
        >
          <span className="text-lg">Product Plaatsen</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </main>
    </div>
  );
}
