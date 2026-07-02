"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function ReviewForm() {
  const router = useRouter();
  const params = useSearchParams();
  const beoordeeldId = params.get("user"); // de te beoordelen gebruiker
  const listingId = params.get("listing");
  const conversationId = params.get("conv");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [beoordeeldNaam, setBeoordeeldNaam] = useState("");
  const [listingTitel, setListingTitel] = useState("");
  const [al_beoordeeld, setAlBeoordeeld] = useState(false);
  const [dealAfgerond, setDealAfgerond] = useState<boolean | null>(null);

  useEffect(() => {
    laadInfo();
  }, []);

  const laadInfo = async () => {
    if (beoordeeldId) {
      const { data } = await supabase.from("profiles").select("naam").eq("id", beoordeeldId).single();
      if (data) setBeoordeeldNaam(data.naam || "Deze persoon");
    }
    if (listingId) {
      const { data } = await supabase.from("listings").select("titel").eq("id", listingId).single();
      if (data) setListingTitel(data.titel);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check of de deal daadwerkelijk afgerond is
    if (conversationId) {
      const { data: conv } = await supabase
        .from("conversations")
        .select("afgerond")
        .eq("id", conversationId)
        .single();
      setDealAfgerond(conv?.afgerond === true);
    } else {
      setDealAfgerond(false);
    }

    // Check of al beoordeeld
    if (beoordeeldId) {
      const { data: bestaand } = await supabase
        .from("reviews")
        .select("id")
        .eq("reviewer_id", user.id)
        .eq("reviewed_id", beoordeeldId)
        .eq("listing_id", listingId)
        .maybeSingle();
      if (bestaand) setAlBeoordeeld(true);
    }
  };

  const verstuurReview = async () => {
    if (rating === 0) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    await supabase.from("reviews").insert({
      reviewer_id: user.id,
      reviewed_id: beoordeeldId,
      listing_id: listingId,
      beoordeling: rating,
      tekst: comment.trim() || null,
    });

    setLoading(false);
    // Ga terug naar het gesprek
    if (conversationId) {
      router.push(`/messages/${conversationId}`);
    } else {
      router.push("/profile");
    }
  };

  const sterLabels = ["", "Erg slecht", "Niet goed", "Oké", "Goed", "Uitstekend"];

  // Nog aan het laden
  if (dealAfgerond === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-icons-round text-primary text-3xl animate-spin">progress_activity</span>
      </div>
    );
  }

  // Deal is nog niet afgerond
  if (!dealAfgerond) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 font-display flex flex-col">
        <header className="pt-14 pb-4 px-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Beoordeling</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="material-icons-round text-amber-500 text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nog niet mogelijk</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Je kunt pas een beoordeling geven nadat de verkoper de deal heeft afgerond. De verkoper markeert het product als verkocht in het gesprek.
          </p>
          <button onClick={() => router.back()} className="mt-4 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">
            Terug naar gesprek
          </button>
        </div>
      </div>
    );
  }

  if (al_beoordeeld) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 font-display flex flex-col">
        <header className="pt-14 pb-4 px-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Beoordeling</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="material-icons-round text-emerald-500 text-3xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Al beoordeeld</h2>
          <p className="text-slate-400 text-sm">Je hebt {beoordeeldNaam} al een beoordeling gegeven voor deze transactie.</p>
          <button onClick={() => router.back()} className="mt-4 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">
            Terug
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-display flex flex-col">
      <header className="pt-14 pb-4 px-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Beoordeling geven</h1>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 space-y-8">
        {/* Wie beoordeel je */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-2xl font-black text-primary">
            {beoordeeldNaam.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Hoe was jouw ervaring met {beoordeeldNaam}?
          </h2>
          {listingTitel && (
            <p className="text-sm text-slate-400 font-medium">Over: {listingTitel}</p>
          )}
        </div>

        {/* Sterren */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map(ster => (
              <button
                key={ster}
                onMouseEnter={() => setHoverRating(ster)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(ster)}
                className="transition-transform active:scale-90"
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-all",
                    (hoverRating || rating) >= ster
                      ? "fill-amber-400 text-amber-400 scale-110"
                      : "text-slate-200 fill-slate-200"
                  )}
                />
              </button>
            ))}
          </div>
          {(hoverRating || rating) > 0 && (
            <p className="text-sm font-bold text-amber-500">
              {sterLabels[hoverRating || rating]}
            </p>
          )}
        </div>

        {/* Snelle opties */}
        {rating > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
              Wat wil je kwijt?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {(rating >= 4
                ? ["Snel geleverd", "Goede communicatie", "Klopt precies met foto", "Aanrader!", "Vriendelijk"]
                : ["Communicatie beter", "Foto klopte niet", "Trage reactie", "Artikel anders dan verwacht"]
              ).map(tag => (
                <button
                  key={tag}
                  onClick={() => setComment(prev => prev.includes(tag) ? prev.replace(tag + ". ", "").replace(tag, "") : prev + (prev ? " " : "") + tag + ".")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                    comment.includes(tag)
                      ? "bg-primary text-white border-primary"
                      : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Vrije tekst */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Toelichting (optioneel)
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={`Vertel meer over je ervaring met ${beoordeeldNaam}...`}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-medium focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </main>

      {/* Verstuur knop */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={verstuurReview}
          disabled={rating === 0 || loading}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
            rating > 0
              ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          )}
        >
          {loading ? (
            <span className="material-icons-round animate-spin">progress_activity</span>
          ) : (
            <>
              <Star className="w-5 h-5 fill-white" />
              <span>Beoordeling versturen</span>
            </>
          )}
        </button>
        {rating === 0 && (
          <p className="text-center text-xs text-slate-400 mt-2">Kies eerst een aantal sterren</p>
        )}
      </div>
    </div>
  );
}

export default function ReviewsSchrijfPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-icons-round text-primary text-3xl animate-spin">progress_activity</span>
      </div>
    }>
      <ReviewForm />
    </Suspense>
  );
}
