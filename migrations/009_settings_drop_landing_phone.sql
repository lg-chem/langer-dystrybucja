-- Jeden numer telefonu na całej stronie. Podstrona /dla-punktow/ bierze
-- telefon zawsze z karty „Dane kontaktowe" (contact_phone) — osobne pole
-- telefonu w karcie „Oferta dla punktów handlowych" zniknęło z panelu, bo
-- wpisany tam numer nadpisywał ten z ustawień i podstrona pokazywała inny
-- numer niż strona główna (kontakt, stopka, przycisk „Zadzwoń").
--
-- Migracja jest OPCJONALNA — tylko sprząta. Kod klucza landing_phone już nie
-- czyta, więc bez niej wszystko działa tak samo.
--
-- Uruchom w konsoli SQL bazy Neon (Neon → SQL Editor). Idempotentne.

DELETE FROM settings WHERE key = 'landing_phone';
