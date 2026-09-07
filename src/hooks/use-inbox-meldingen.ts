"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type ConversatieUpdate = {
  id: string;
  buyer_id: string;
  seller_id: string;
};

// App-brede versie van de ongelezen-teller uit src/app/messages/page.tsx —
// zodat het bolletje op de "Berichten"-tab en de live pop-up ook werken
// terwijl je ergens anders in de app zit. Een nieuw bod en een "Verkocht"-
// bevestiging lopen allebei via een gewoon chatbericht, dus deze ene teller
// dekt gesprekken, biedingen én afgeronde deals.
export function useInboxMeldingen() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const { toast } = useToast();
  const [ongelezen, setOngelezen] = useState(0);
  const unreadMapRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let userId: string | null = null;

    const totaal = () => Array.from(unreadMapRef.current.values()).filter(Boolean).length;

    const laadAlles = async (uid: string) => {
      const { data } = await supabase
        .from("conversations").select("id, buyer_id, seller_id")
        .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`);
      const convIds = (data || []).map((c) => c.id);

      const { data: ongelezenBerichten } = convIds.length > 0
        ? await supabase.from("messages").select("conversation_id")
            .eq("gelezen", false).neq("sender_id", uid).in("conversation_id", convIds)
        : { data: [] as { conversation_id: string }[] };

      const ongelezenIds = new Set((ongelezenBerichten || []).map((m) => m.conversation_id));
      unreadMapRef.current = new Map(convIds.map((id) => [id, ongelezenIds.has(id)]));
      setOngelezen(totaal());
    };

    const ververs = async (conversationId: string) => {
      if (!userId) return;
      const { count } = await supabase.from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId).eq("gelezen", false).neq("sender_id", userId);
      unreadMapRef.current.set(conversationId, (count || 0) > 0);
      setOngelezen(totaal());
    };

    // Niet storen met een pop-up als je dat gesprek zelf al open hebt staan
    // — de chatpagina zelf toont het bericht dan al live.
    const toonMelding = async (conversationId: string) => {
      if (!userId || pathnameRef.current === `/messages/${conversationId}`) return;

      const { data: laatste } = await supabase.from("messages")
        .select("sender_id, tekst")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false }).limit(1).single();
      if (!laatste || laatste.sender_id === userId) return;

      const { data: afzender } = await supabase.from("profiles")
        .select("naam").eq("id", laatste.sender_id).single();
      const naam = afzender?.naam || "Iemand";

      let titel = `Nieuw bericht van ${naam}`;
      if (laatste.tekst?.startsWith("💸 Ik doe een bod van")) titel = `${naam} doet een bod`;
      else if (laatste.tekst?.startsWith("🎉 Deal gesloten")) titel = "Deal gesloten!";

      toast({ title: titel, description: laatste.tekst ?? undefined });
    };

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;
      await laadAlles(user.id);

      channel = supabase
        .channel(`meldingen:${user.id}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations", filter: `buyer_id=eq.${user.id}` },
          (p) => { const u = p.new as never as ConversatieUpdate; ververs(u.id); toonMelding(u.id); })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations", filter: `seller_id=eq.${user.id}` },
          (p) => { const u = p.new as never as ConversatieUpdate; ververs(u.id); toonMelding(u.id); })
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations", filter: `buyer_id=eq.${user.id}` },
          () => laadAlles(user.id))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations", filter: `seller_id=eq.${user.id}` },
          () => laadAlles(user.id))
        .subscribe();
    };

    init();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [toast]);

  return { ongelezen };
}
