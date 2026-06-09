
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  ShieldCheck,
  PiggyBank,
  Leaf,
  Heart,
  ChevronRight,
  Baby,
  Edit2,
  TrendingUp,
  Bell,
  CreditCard,
  LogOut,
  CircleHelp as HelpCircle,
  Users,
  Gift,
  Plus,
  Save,
  Check,
  Wallet,
  Smartphone,
  Mail,
  Zap,
  Rocket,
  Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Child {
  id: string;
  name: string;
  size: string;
  age: string;
}

const AVAILABLE_SIZES = ["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128"];

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();

  const [children, setChildren] = useState<Child[]>([
    { id: "1", name: "Lotte", size: "98", age: "3 jaar" }
  ]);

  const [isChildSheetOpen, setIsChildSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [childFormData, setChildFormData] = useState({ name: "", size: "", age: "" });
  const [iban, setIban] = useState("NL91 ABNA 0412 3456 78");
  const [notifs, setNotifs] = useState({
    orders: true,
    likes: true,
    growth: true,
    marketing: false
  });

  const handleAction = (label: string) => {
    if (label === "Vrienden Uitnodigen") {
      toast({
        title: "Deel de liefde!",
        description: "Je unieke uitnodigingslink is gekopieerd. Deel deze met je vrienden!",
      });
      return;
    }
    if (label === "Meldingen") {
      setIsNotificationsOpen(true);
      return;
    }
    if (label === "Betalingen & Bankrekening") {
      setIsPaymentsOpen(true);
      return;
    }
    toast({
      title: label,
      description: "Deze functie is binnenkort beschikbaar.",
    });
  };

  const openAddChild = () => {
    setEditingChild(null);
    setChildFormData({ name: "", size: "98", age: "" });
    setIsChildSheetOpen(true);
  };

  const openEditChild = (child: Child) => {
    setEditingChild(child);
    setChildFormData({ name: child.name, size: child.size, age: child.age });
    setIsChildSheetOpen(true);
  };

  const saveChild = () => {
    if (!childFormData.name || !childFormData.size) {
      toast({ variant: "destructive", title: "Oeps!", description: "Vul een naam en maat in." });
      return;
    }
    if (editingChild) {
      setChildren(prev => prev.map(c => c.id === editingChild.id ? { ...c, ...childFormData } : c));
      toast({ title: "Profiel bijgewerkt" });
    } else {
      setChildren(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), ...childFormData }]);
      toast({ title: "Kind toegevoegd" });
    }
    setIsChildSheetOpen(false);
  };

  const savePayments = () => {
    toast({ title: "Bankgegevens opgeslagen", description: "Je uitbetalingen worden nu gestort op dit rekeningnummer." });
    setIsPaymentsOpen(false);
  };

  const saveNotifications = () => {
    toast({ title: "Voorkeuren opgeslagen", description: "Je ontvangt nu meldingen op basis van je nieuwe instellingen." });
    setIsNotificationsOpen(false);
  };

  const mainChild = children[0];
  const nextSize = mainChild ? AVAILABLE_SIZES[AVAILABLE_SIZES.indexOf(mainChild.size) + 1] || "Max" : "104";

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32 font-display text-slate-900 dark:text-slate-100 antialiased">
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-[800] tracking-tight text-slate-800 dark:text-slate-100">Mijn Profiel</h1>
          <button onClick={() => handleAction("Instellingen")} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <Link href="/profile/seller-view" className="flex items-center gap-4 mb-8 group active:scale-[0.98] transition-all">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/20 p-1 group-hover:bg-primary/30 transition-colors">
              <Avatar className="w-full h-full border-none shadow-sm">
                <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLV8vvhTMT8FHaBKBnLhUdlPDNc12HmE36JHGEuRotXUV_qsHcKmWE07Ft1TaxgxKxqP8zEupEGiArP8m-qjw7ycI6QLUaKFnJoIExI0x7_isFT22ZAldZRdZoKwluRiAR8AVLFxrv5YARCXsPoTQ0ISsHwWtAGsKDa7ThJJCpOTD19Ua6WnUH4SOiDU0tyWIoAPZ5OTPKBDZsdN68Q0SAta01yiWKN4jR-1jyY_5E2L6WjeW3scM8Mu5GfIQAzp9W29k7SdJgRVU" className="object-cover" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors">Sanne de Vries</h2>
            <p className="text-sm text-slate-500">Bekijk je winkel & reviews <ChevronRight className="inline-block w-3 h-3 ml-1" /></p>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl shadow-sm">
            <PiggyBank className="w-6 h-6 text-primary-dark mb-2" />
            <p className="text-2xl font-extrabold text-primary-dark">€420</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Bespaard</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl shadow-sm">
            <Leaf className="w-6 h-6 text-primary-dark mb-2" />
            <p className="text-2xl font-extrabold text-primary-dark">12</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Hergebruikt</p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        <Link href="/profile/favorites">
          <button className="w-full bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center group active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="font-bold">Mijn Favorieten (24)</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </Link>

        {/* Boost Section */}
        <div className="bg-gradient-to-r from-accent to-primary p-5 rounded-2xl shadow-lg shadow-accent/20 text-white space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Boost je Verkoop</h4>
              <p className="text-sm opacity-90 leading-tight mt-1">Verschijn vaker in de swipe-functie en verkoop je items sneller.</p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Advertentie Budget</span>
              <span className="text-xl font-black">€12,50</span>
            </div>
            <Link href="/promote/p1">
              <Button size="sm" className="bg-white text-accent hover:bg-white/90 font-bold rounded-lg border-none">
                Boost Nu <Zap className="w-3.5 h-3.5 ml-1 fill-current" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Mijn Kinderen</h3>
            <button onClick={openAddChild} className="text-xs font-bold text-primary uppercase flex items-center gap-1">
              <Plus className="w-3 h-3" /> Toevoegen
            </button>
          </div>
          {children.map((child) => (
            <div key={child.id} className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-400"><Baby className="w-6 h-6" /></div>
              <div className="flex-1">
                <h4 className="font-bold">{child.name}</h4>
                <p className="text-sm text-slate-500">Maat {child.size} • {child.age}</p>
              </div>
              <button onClick={() => openEditChild(child)} className="text-slate-300 hover:text-primary p-2"><Edit2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>

        {mainChild && (
          <div className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-dark" /><h3 className="font-bold">Groei Alert</h3></div>
            <div className="space-y-2">
              <div className="flex justify-between items-end"><span className="text-sm font-bold">{mainChild.name} groeit bijna naar maat {nextSize}</span><span className="text-[10px] font-bold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full">85%</span></div>
              <Progress value={85} className="h-2.5" />
            </div>
            <Button onClick={() => openEditChild(mainChild)} className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-12 rounded-xl border-none">Nu Aanpassen</Button>
          </div>
        )}

        <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-5 rounded-2xl border border-primary/20 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0"><Gift className="w-6 h-6 text-primary" /></div>
            <div>
              <h4 className="font-bold">Gratis Premium</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Nodig vrienden uit voor <span className="font-extrabold text-primary-dark">3 maanden gratis Premium</span>!</p>
            </div>
          </div>
          <Button onClick={() => handleAction("Vrienden Uitnodigen")} className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold h-12 rounded-xl border-none">Vrienden Uitnodigen</Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold ml-1">Instellingen</h3>
          <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800 shadow-sm overflow-hidden">
            {[
              { icon: Rocket, label: "Mijn Advertenties", href: "/profile/seller-view" },
              { icon: Bell, label: "Meldingen" },
              { icon: CreditCard, label: "Betalingen & Bankrekening" },
              { icon: HelpCircle, label: "Klantenservice", href: "/support" },
              { icon: Info, label: "Over Noah & Emma", href: "/about" }
            ].map((item, i) => (
              <div key={i} onClick={() => item.href ? router.push(item.href) : handleAction(item.label)} className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><item.icon className="w-5 h-5 text-slate-400" /><span className="text-sm font-medium">{item.label}</span></div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Kind Sheet */}
      <Sheet open={isChildSheetOpen} onOpenChange={setIsChildSheetOpen}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl border-none font-display">
          <SheetHeader><SheetTitle>{editingChild ? "Kind Bewerken" : "Kind Toevoegen"}</SheetTitle></SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2"><Label>Naam</Label><Input value={childFormData.name} onChange={e => setChildFormData(prev => ({ ...prev, name: e.target.value }))} className="rounded-xl h-12" /></div>
            <div className="space-y-2"><Label>Huidige Kledingmaat</Label><Select value={childFormData.size} onValueChange={val => setChildFormData(prev => ({ ...prev, size: val }))}><SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger><SelectContent>{AVAILABLE_SIZES.map(s => (<SelectItem key={s} value={s}>Maat {s}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Leeftijd</Label><Input value={childFormData.age} onChange={e => setChildFormData(prev => ({ ...prev, age: e.target.value }))} className="rounded-xl h-12" /></div>
          </div>
          <SheetFooter><Button onClick={saveChild} className="w-full bg-primary text-white font-extrabold h-14 rounded-xl border-none"><Save className="w-5 h-5 mr-2" /> Opslaan</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Meldingen Sheet */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl border-none font-display">
          <SheetHeader><SheetTitle>Meldingen</SheetTitle><SheetDescription>Bepaal welke updates je wilt ontvangen.</SheetDescription></SheetHeader>
          <div className="space-y-6 py-8">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-slate-400" /><div><p className="font-bold text-sm">Bestellingen</p><p className="text-xs text-slate-500">Updates over je aan- en verkopen</p></div></div><Switch checked={notifs.orders} onCheckedChange={v => setNotifs(p => ({...p, orders: v}))} /></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Heart className="w-5 h-5 text-slate-400" /><div><p className="font-bold text-sm">Nieuwe Likes</p><p className="text-xs text-slate-500">Wanneer iemand je item leuk vindt</p></div></div><Switch checked={notifs.likes} onCheckedChange={v => setNotifs(p => ({...p, likes: v}))} /></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-slate-400" /><div><p className="font-bold text-sm">Groei Alerts</p><p className="text-xs text-slate-500">Meldingen over de maat van je kind</p></div></div><Switch checked={notifs.growth} onCheckedChange={v => setNotifs(p => ({...p, growth: v}))} /></div>
          </div>
          <SheetFooter><Button onClick={saveNotifications} className="w-full bg-primary text-white font-extrabold h-14 rounded-xl border-none">Instellingen Opslaan</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Betalingen Sheet */}
      <Sheet open={isPaymentsOpen} onOpenChange={setIsPaymentsOpen}>
        <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl border-none font-display">
          <SheetHeader><SheetTitle>Betalingen & Uitbetaling</SheetTitle><SheetDescription>Beheer je bankrekening voor uitbetalingen.</SheetDescription></SheetHeader>
          <div className="space-y-8 py-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-3 text-primary"><Wallet className="w-6 h-6" /><h4 className="font-bold">Uitbetalingsrekening</h4></div>
              <div className="space-y-2"><Label>IBAN Rekeningnummer</Label><Input value={iban} onChange={e => setIban(e.target.value)} className="rounded-xl h-12 font-mono" /></div>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-wider">Het geld van je verkopen wordt binnen 2 werkdagen na bevestiging op deze rekening gestort.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Gekoppelde Betaalmethodes</h4>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border rounded-xl shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] font-black text-white">iDEAL</div><p className="text-sm font-bold">ABN AMRO **** 4291</p></div><Check className="w-4 h-4 text-primary" /></div>
            </div>
          </div>
          <SheetFooter><Button onClick={savePayments} className="w-full bg-primary text-white font-extrabold h-14 rounded-xl border-none">Bankgegevens Opslaan</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
