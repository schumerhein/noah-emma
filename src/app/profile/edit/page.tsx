
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, Save, MapPin, User, Mail, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "Sanne de Vries",
    location: "Utrecht, NL",
    bio: "Moeder van Lotte (3). Ik houd van duurzame mode en kwalitatieve items een tweede leven geven!",
    email: "sanne.devries@gmail.com"
  });

  const handleSave = () => {
    toast({
      title: "Profiel opgeslagen",
      description: "Je wijzigingen zijn succesvol verwerkt.",
    });
    router.back();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 pb-32">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-primary/10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest">Profiel Bewerken</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Avatar Edit */}
        <section className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-24 rounded-full bg-primary/20 p-1">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-xl">
                <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLV8vvhTMT8FHaBKBnLhUdlPDNc12HmE36JHGEuRotXUV_qsHcKmWE07Ft1TaxgxKxqP8zEupEGiArP8m-qjw7ycI6QLUaKFnJoIExI0x7_isFT22ZAldZRdZoKwluRiAR8AVLFxrv5YARCXsPoTQ0ISsHwWtAGsKDa7ThJJCpOTD19Ua6WnUH4SOiDU0tyWIoAPZ5OTPKBDZsdN68Q0SAta01yiWKN4jR-1jyY_5E2L6WjeW3scM8Mu5GfIQAzp9W29k7SdJgRVU" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 active:scale-90 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest">Tik om foto te wijzigen</p>
        </section>

        {/* Form */}
        <section className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Volledige Naam</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Locatie</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mailadres</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input 
                value={formData.email}
                disabled
                className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold opacity-60"
              />
            </div>
            <p className="text-[9px] text-slate-400 italic ml-1">E-mailadres kan niet worden gewijzigd via de app.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Biografie</Label>
            <Textarea 
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl min-h-[100px] py-4 leading-relaxed text-sm font-medium"
            />
          </div>
        </section>

        <section className="bg-primary/5 rounded-2xl p-4 flex gap-3 border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs text-primary/80 leading-relaxed font-medium">
            Je profielgegevens zijn zichtbaar voor andere gebruikers wanneer zij je winkel bekijken.
          </p>
        </section>

        <Button 
          onClick={handleSave}
          className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-black text-lg rounded-xl shadow-lg shadow-primary/20 border-none"
        >
          <Save className="w-5 h-5 mr-2" />
          Wijzigingen Opslaan
        </Button>
      </main>
    </div>
  );
}
