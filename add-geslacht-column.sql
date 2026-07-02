-- Voeg geslacht kolom toe aan children tabel
ALTER TABLE children ADD COLUMN IF NOT EXISTS geslacht TEXT CHECK (geslacht IN ('meisje', 'jongen'));
