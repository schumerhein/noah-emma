
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Clock, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RequestSentPage() {
  const router = useRouter();

  return (
    <div className="bg-background dark:bg-[#1a0d11] min-h-screen flex flex-col items-center justify-center font-display">
      <div className="w-full max-w-md h-screen max-h-[850px] bg-white dark:bg-zinc-900 relative overflow-hidden flex flex-col shadow-2xl md:rounded-xl">
        {/* Status Bar Replacement */}
        <div className="h-12 w-full flex justify-between items-center px-8 pt-4">
          <span className="text-sm font-bold">9:41</span>
          <div className="flex gap-1.5 items-center">
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 pt-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white stroke-[3px]" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold mb-4 text-slate-900 dark:text-white">
            Verzoek verstuurd!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 px-4">
            Je aankoopverzoek is succesvol verzonden. We hebben de verkoper op de hoogte gebracht.
          </p>

          <div className="w-full bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-primary/5 shadow-sm mb-10 text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                <Image 
                  alt="Verkoper avatar" 
                  fill
                  className="object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWxJUpwFiUnMKmbAky39btRnCVOlls1TJsXCrgHoxk8OL_6doNWcendLAm4wp27YJBKH2cueRC9C9NvlTEYXvJsA1z0H_2e9DdDWNbocrfM8fi_HABoDsDxG9X_-Ke9X3LEICyOrPjeZYzRhb0XOQ49O_tJmYQYNwZJK6tWwIqR0fYu_r25PFTwf5FT5LM4TbGmOG8l8G-t8Jbn8-mbuaHIYZOi3dxYqfKVmKPmdWJVdelcSzdDdl9JnpGxWN1ZxRPwHihIjEP1GQ"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight truncate">Sophie de Vries</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">4.9</span>
                  <span className="text-xs text-slate-400">(128 reviews)</span>
                </div>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-primary/10">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Zodra <span className="font-bold text-primary">Sophie</span> accepteert, ontvang je een bericht om de betaling te voltooien.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm mb-8">
            <Clock className="w-4 h-4" />
            <span>Verkopers reageren doorgaans binnen 24 uur</span>
          </div>

          <Button 
            onClick={() => router.push('/messages/1')}
            className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold h-14 rounded-xl shadow-lg shadow-primary/25 border-none"
          >
            Naar Berichten
          </Button>
          <button className="mt-4 text-primary font-bold text-sm hover:underline">
            Bekijk details van verzoek
          </button>
        </div>

        <div className="h-20 w-full flex items-center justify-center pb-4">
          <div className="w-32 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
