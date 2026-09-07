-- Fix 2: persistente "gelezen tot"-tijdstip voor de Notificaties-tab, zodat
-- het rode badge-cijfer niet voor altijd blijft staan op meldingen die je al
-- gezien hebt (favorieten, biedingen, volgers, nieuwe listings, zoekwaarschuwingen
-- worden namelijk elke keer opnieuw uit hun eigen tabellen samengesteld, er was
-- nergens een "gelezen"-status voor bijgehouden).
alter table profiles
  add column if not exists notificaties_gezien_tot timestamptz;

-- Fix 5: race condition bij het starten van een gesprek. De app deed eerst een
-- select om te kijken of er al een gesprek bestond tussen koper/verkoper/product,
-- en pas daarna een insert — twee snelle taps (of twee tabbladen) konden zo twee
-- aparte gesprekken over hetzelfde product aanmaken. Deze unique constraint
-- verhindert dat op database-niveau; de app vangt de resulterende foutcode op
-- en haalt in dat geval het al bestaande gesprek op.
create unique index if not exists conversations_koper_verkoper_listing_uniek
  on conversations (buyer_id, seller_id, listing_id);
