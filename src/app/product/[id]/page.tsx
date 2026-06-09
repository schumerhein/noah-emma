
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Heart, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  Calendar,
  Tag,
  Box,
  Layers,
  Check,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ALL_PRODUCTS, type Product } from "@/app/lib/products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const found = ALL_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setFormattedDate(new Date(found.uploadDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }));
    } else {
      setProduct(ALL_PRODUCTS[0]);
      setFormattedDate(new Date(ALL_PRODUCTS[0].uploadDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }));
    }
  }, [id]);

  const handleBuy = () => {
    router.push('/checkout');
  };

  const handleOffer = () => {
    toast({
      title: "Bod geplaatst",
      description: "Je bod is verzonden naar de verkoper. Je krijgt een melding bij een reactie.",
    });
  };

  const toggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    if (newLikedState) {
      toast({
        title: "Toegevoegd aan favorieten",
        description: `${product?.title} is opgeslagen in je lijst.`,
        action: (
          <div className="bg-emerald-500 p-1 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        ),
      });
    }
  };

  if (!product) return null;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-48">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-40 px-4 h-16 flex justify-between items-center pointer-events-none pt-safe-top">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 shadow-sm pointer-events-auto backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 shadow-sm text-slate-600 dark:text-slate-300 pointer-events-auto backdrop-blur-sm">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      <main>
        <div className="relative w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <Image 
            alt={product.title}
            fill
            className="object-cover" 
            src={product.images[currentImageIndex]}
            priority
          />
          
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentImageIndex === idx ? "bg-white w-4" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          )}

          <button 
            onClick={toggleLike}
            className="absolute bottom-4 right-4 w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-10"
          >
            <Heart className={cn("w-7 h-7 transition-colors", isLiked ? "fill-primary text-primary" : "text-slate-300")} />
          </button>
        </div>

        <div className="px-5 pt-6 space-y-8">
          <section className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-2xl font-headline font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">4.9 (48)</span>
                </div>
              </div>
              <span className="text-2xl font-black text-primary">€{product.price.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest pt-2">
              <span>Maat {product.size}</span>
              <span>•</span>
              <span>{product.condition}</span>
              <span>•</span>
              <span>{product.location}</span>
            </div>
          </section>

          <section className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD5I-du1yX01-H_WGFbV9C4HRXG3OeAm3rJ6yencJhvxRf7PsW10nXJuMn_MHE2aajuFvZWXraI-TU25KBs4BZcSc_vH0ln2ovlJZTNZxkdmmTsHZCLaY0tKGZGV2FYpMsVyAdA61PfQJh3PBTac9V0W9AgGXXqqfDcHHzrOHSrCOrhznAATce7s9ErKqmywbBonBm4YXKS9WyRRMd-5bhivjM7NZEouyaofDjVXe_XGTbOz6_PxF06_pQC_LOam5qGXnX9CHAksA" />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verkoper</p>
                <h4 className="font-bold text-sm">Annelies de V..</h4>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold text-xs">
              Bekijk <ChevronRight className="w-4 h-4" />
            </Button>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Merk</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{product.brand}</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gepost op</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {formattedDate}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Box className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kleur</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{product.color}</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Materiaal</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{product.material}</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Omschrijving</h3>
              <div className="relative">
                <p className={cn(
                  "text-[15px] leading-relaxed text-slate-600 dark:text-slate-400",
                  !showFullDesc && "line-clamp-4"
                )}>
                  {product.description}
                </p>
                {!showFullDesc && (
                  <button 
                    onClick={() => setShowFullDesc(true)}
                    className="text-primary font-bold text-sm mt-1"
                  >
                    Lees meer
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-2xl">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <p className="text-sm font-bold text-slate-700 dark:text-rose-100">
                Gelimited door {isLiked ? product.likes + 1 : product.likes} andere ouders
              </p>
            </div>
          </section>

          <section className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Kopersbescherming</h3>
                <p className="text-xs text-slate-500 font-medium">Veilig betalen & verzenden</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              Je geld wordt veilig vastgehouden. Pas wanneer je het item in goede staat ontvangt, betalen wij de verkoper uit.
            </p>
          </section>

          <section className="pt-2">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Reviews van Annelies</h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl italic text-sm text-slate-600 dark:text-slate-400 font-medium border border-slate-100 dark:border-slate-800">
              "Hele fijne verkoper, snelle verzending en het item was precies zoals beschreven. Aanrader!"
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-40 pb-safe-bottom">
        <div className="flex gap-3">
          <Button 
            onClick={handleOffer}
            variant="outline" 
            className="flex-1 h-14 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary/5"
          >
            Doe een bod
          </Button>
          <Button 
            onClick={handleBuy}
            className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Direct Kopen
          </Button>
        </div>
      </div>
    </div>
  );
}
