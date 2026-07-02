-- Reviews tabel aanmaken
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  -- Maximaal 1 review per reviewer per listing
  UNIQUE(reviewer_id, listing_id)
);

-- RLS inschakelen
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Iedereen mag reviews lezen
CREATE POLICY "reviews leesbaar voor iedereen"
  ON reviews FOR SELECT USING (true);

-- Alleen ingelogde gebruikers mogen een review schrijven (niet over zichzelf)
CREATE POLICY "ingelogde gebruiker mag review schrijven"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id AND auth.uid() != reviewed_user_id);

-- Reviewer mag eigen review verwijderen
CREATE POLICY "reviewer mag eigen review verwijderen"
  ON reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- Automatisch gemiddelde_beoordeling bijwerken in profiles na elke review
CREATE OR REPLACE FUNCTION update_gemiddelde_beoordeling()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET gemiddelde_beoordeling = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE reviewed_user_id = COALESCE(NEW.reviewed_user_id, OLD.reviewed_user_id)
  )
  WHERE id = COALESCE(NEW.reviewed_user_id, OLD.reviewed_user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger voor INSERT en DELETE
DROP TRIGGER IF EXISTS trigger_update_beoordeling ON reviews;
CREATE TRIGGER trigger_update_beoordeling
  AFTER INSERT OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_gemiddelde_beoordeling();

-- Kolom gemiddelde_beoordeling toevoegen aan profiles als die er nog niet is
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gemiddelde_beoordeling NUMERIC(3,1);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS totaal_verkopen INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lid_sinds TIMESTAMPTZ DEFAULT now();
