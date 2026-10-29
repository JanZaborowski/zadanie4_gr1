# Zadanie 4 (gr 1) — Samodzielna aplikacja Django API + JavaScript fetch()

**Przedmiot:** Programowanie internetowe  
**Uczelnia:** Akademia im. Jakuba z Paradyża w Gorzowie Wielkopolskim — Wydział Techniczny  
**Autor:** Jan Zaborowski  
**Nr albumu:** 31401  
**Grupa:** gr 1  
**Temat projektu:** Kolekcja / Katalog Manhw i Komiksów  

---

## 1. Opis projektu
Aplikacja internetowa zrealizowana w frameworku **Django** z frontendem wykorzystującym asynchroniczny **JavaScript `fetch()`** do dynamicznego pobierania i prezentowania danych w formacie **JSON** bez konieczności przeładowywania strony.

- **Laboratorium A:** Architektura Django, model ORM (minimum 5 pól, 3 typy pól), panel administracyjny, migracje, wstępne dane i strona główna z HTML5 i CSS3.
- **Laboratorium B:** Endpoint REST API (`/api/manhwa/`), filtrowanie po parametrach URL (`?status=completed` / `?status=ongoing`), asynchroniczna komunikacja `fetch()`, obsługa stanów (ładowanie, brak danych, błędy) oraz bezpieczna aktualizacja struktury DOM.

---

## 2. Model danych (`Manhwa`)
Model zdefiniowany w `katalog/models.py` zawiera 8 sensownych pól (5 różnych typów pól Django):
- `title` (*CharField*) – Pełny tytuł komiksu / manhwy
- `author` (*CharField*) – Autor scenariusza / rysownik
- `genre` (*CharField*) – Gatunek (np. Akcja, Fantasy, System, Murim, Sport)
- `description` (*TextField*) – Szczegółowy opis fabuły
- `chapters_count` (*IntegerField*) – Liczba opublikowanych rozdziałów
- `rating` (*IntegerField*) – Ocena w skali 1-10
- `is_completed` (*BooleanField*) – Flaga określająca, czy seria jest zakończona, czy w trakcie wydawania
- `release_date` (*DateField*) – Data oficjalnej premiery
- `created_at` (*DateTimeField*) – Data dodania rekordu do bazy

---

## 3. Instrukcja uruchomienia projektu od zera

### Krok 1: Klonowanie repozytorium
```bash
git clone https://github.com/JanZaborowski/zadanie4_gr1.git
cd zadanie4_gr1
```

### Krok 2: Przygotowanie środowiska wirtualnego (zalecany Python 3.10 - 3.14)
```bash
python -m venv .venv

# Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Windows (CMD):
.venv\Scripts\activate.bat

# Linux / macOS:
source .venv/bin/activate
```

### Krok 3: Instalacja zależności
```bash
pip install -r requirements.txt
```

### Krok 4: Migracje bazy danych
```bash
python manage.py makemigrations
python manage.py migrate
```

### Krok 5: Wypełnienie bazy danymi testowymi oraz utworzenie konta administratora
W projekcie przygotowano skrypt `seed_db.py`, który automatycznie tworzy superużytkownika oraz dodaje 7 pełnych rekordów manhw:
```bash
python seed_db.py
```
*Dane konta administratora:*
- **Login:** `admin`
- **Hasło:** `admin12345`

### Krok 6: Uruchomienie serwera deweloperskiego
```bash
python manage.py runserver
```

---

## 4. Dostępne adresy URL
- **Strona główna (Frontend HTML + JS):** `http://127.0.0.1:8000/`
- **Endpoint API (Wszystkie rekordy JSON):** `http://127.0.0.1:8000/api/manhwa/`
- **Endpoint API z filtrem (Zakończone):** `http://127.0.0.1:8000/api/manhwa/?status=completed`
- **Endpoint API z filtrem (W trakcie):** `http://127.0.0.1:8000/api/manhwa/?status=ongoing`
- **Panel administracyjny Django:** `http://127.0.0.1:8000/admin/`
