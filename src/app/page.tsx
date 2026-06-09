
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AssistantChat } from "@/components/AssistantChat";
import { useRouter } from "next/navigation";
import { ALL_PRODUCTS } from "@/app/lib/products";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipesLeft, setSwipesLeft] = useState(10);
  const startX = useRef(0);
  const swipeThreshold = 100;

  const handleSwipeAction = (direction: "left" | "right") => {
    if (swipesLeft <= 0) return;

    setSwiping(direction);
    setDragX(direction === "right" ? 250 : -250);
    
    setTimeout(() => {
      setProducts((prev) => (prev.length > 1 ? prev.slice(1) : prev));
      setSwiping(null);
      setDragX(0);
      setSwipesLeft((prev) => Math.max(0, prev - 1));
    }, 400);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (swiping || swipesLeft <= 0) return;
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const deltaX = currentX - startX.current;
    setDragX(deltaX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (dragX > swipeThreshold) {
      handleSwipeAction("right");
    } else if (dragX < -swipeThreshold) {
      handleSwipeAction("left");
    } else {
      setDragX(0);
    }
  };

  const currentProduct = products[0];
  const isLimitReached = swipesLeft <= 0;
  const rotation = dragX / 15;

  const likeOpacity = Math.min(Math.max(dragX / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 80, 0), 1);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden font-display">
      <header className="pt-12 pb-2 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">Ontdekken</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="material-icons-round text-primary-dark text-[14px] mr-1.5">bolt</span>
            <span className="text-xs font-extrabold text-primary-dark tracking-tight">{swipesLeft}/10</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 relative flex flex-col items-center justify-start pt-2 gap-4 touch-none pb-48 overflow-hidden">
        <div className="card-stack w-full relative h-[400px] shrink-0">
          {!isLimitReached && products.length > 1 && (
            <div className="absolute inset-x-2 top-4 h-full bg-slate-100 dark:bg-zinc-800 rounded-xl opacity-60 scale-95 translate-y-4"></div>
          )}

          <div 
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ 
              transform: (isDragging || swiping) 
                ? `translateX(${dragX}px) rotate(${rotation}deg)` 
                : undefined,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            className={cn(
              "absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-xl overflow-hidden flex flex-col ios-shadow select-none border border-slate-100 dark:border-slate-700",
              !isLimitReached && "cursor-grab active:cursor-grabbing",
              swiping === "right" && "animate-swipe-right",
              swiping === "left" && "animate-swipe-left"
            )}
          >
            <div className="relative flex-1 bg-slate-50 dark:bg-zinc-700 overflow-hidden pointer-events-none">
              <Image
                src={currentProduct.images[0]}
                alt={currentProduct.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Swipe Indicatoren */}
              <div 
                style={{ opacity: likeOpacity }}
                className="absolute top-10 left-6 z-20 border-4 border-emerald-500 rounded-lg px-6 py-2 -rotate-12 pointer-events-none bg-emerald-500/10 backdrop-blur-sm"
              >
                <span className="text-3xl font-black text-emerald-500 uppercase tracking-widest">LIKE</span>
              </div>
              <div 
                style={{ opacity: nopeOpacity }}
                className="absolute top-10 right-6 z-20 border-4 border-rose-500 rounded-lg px-6 py-2 rotate-12 pointer-events-none bg-rose-500/10 backdrop-blur-sm"
              >
                <span className="text-3xl font-black text-rose-500 uppercase tracking-widest">NEE</span>
              </div>
              
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-slate-100">
                  <span className="material-icons-round text-primary-dark text-[10px]">verified</span>
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider">GEVERIFIEERDE VERKOPER</span>
                </div>
              </div>

              {currentProduct.isAd && (
                <div className="absolute top-3 right-3 bg-primary/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-primary/20">
                  <span className="material-icons-round text-primary-dark text-[14px]">campaign</span>
                  <span className="text-[9px] font-bold text-primary-dark uppercase tracking-widest">Ads</span>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-1 pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {currentProduct.title}
                  </h3>
                  <p className="text-muted font-medium text-[12px] truncate">
                    {currentProduct.brand} • {currentProduct.location}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex items-center">
                      <span className="material-icons-round text-primary text-[14px]">star</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 ml-0.5">4.9</span>
                    </div>
                    <span className="text-muted text-[10px] font-medium">(42 reviews)</span>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-primary shrink-0">
                  €{currentProduct.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-secondary dark:bg-zinc-700 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  Maat {currentProduct.size}
                </span>
                <span className="bg-secondary dark:bg-zinc-700 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {currentProduct.condition}
                </span>
                <span className="bg-primary/10 px-2 py-1 rounded-lg text-[10px] font-bold text-primary-dark flex items-center gap-1">
                  <span className="material-icons-round text-[12px]">favorite</span>
                  {currentProduct.likes} likes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actieknoppen - Extra marge onderaan om boven nav te blijven */}
        <div className={cn(
          "flex items-center gap-8 mt-4 mb-10 z-30 transition-all shrink-0",
          isLimitReached && "opacity-30 grayscale pointer-events-none"
        )}>
          <button 
            onClick={() => handleSwipeAction("left")}
            disabled={isLimitReached}
            className="w-14 h-14 rounded-full bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-lg flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-2xl">close</span>
          </button>
          
          <Link href={`/product/${currentProduct.id}`}>
            <button className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-white active:scale-95 transition-transform">
              <span className="material-icons-round text-3xl">shopping_bag</span>
            </button>
          </Link>

          <button 
            onClick={() => handleSwipeAction("right")}
            disabled={isLimitReached}
            className="w-14 h-14 rounded-full bg-white dark:bg-zinc-800 border-2 border-primary/40 shadow-lg flex items-center justify-center text-primary-dark active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-2xl">favorite_border</span>
          </button>
        </div>
      </main>
      
      <AssistantChat />
    </div>
  );
}
