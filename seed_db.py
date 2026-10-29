import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Komiksy.settings')
django.setup()

from django.contrib.auth.models import User
from katalog.models import Manhwa

def seed():
    print("Inicjalizacja bazy danych...")

    # 1. Tworzenie konta superużytkownika
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', '31401@student.ajp.edu.pl', 'admin12345')
        print("-> Utworzono superużytkownika: admin (hasło: admin12345)")
    else:
        print("-> Superużytkownik 'admin' już istnieje.")

    # 2. Dodawanie rekordów manhw (wymóg: co najmniej 6 rekordów)
    records = [
        {
            "title": "Solo Leveling",
            "author": "Chugong, DUBU (REDICE Studio)",
            "genre": "Akcja",
            "description": "Historia Sunga Jinwoo, najsłabszego łowcy rangi E na świecie. Po śmiertelnym incydencie w podwójnym lochu zyskuje dostęp do tajemniczego 'Systemu', stając się jedyną osobą zdolną do ciągłego podnoszenia poziomu i władania armią cieni.",
            "chapters_count": 179,
            "rating": 10,
            "is_completed": True,
            "release_date": date(2018, 3, 4)
        },
        {
            "title": "Omniscient Reader's Viewpoint",
            "author": "sing N song, Sleepy-C",
            "genre": "System",
            "description": "Kim Dokja jest przeciętnym pracownikiem biurowym, którego jedynym hobby było czytanie niszowej powieści internetowej przez ponad 10 lat. Gdy świat powieści staje się brutalną rzeczywistością, Dokja wykorzystuje wiedzę o zakończeniu, by uratować świat.",
            "chapters_count": 210,
            "rating": 10,
            "is_completed": False,
            "release_date": date(2020, 5, 26)
        },
        {
            "title": "Tower of God",
            "author": "SIU",
            "genre": "Fantasy",
            "description": "Tajemnicza Wieża spełnia najskrytsze życzenia tych, którzy dotrą na jej szczyt. Chłopiec Twenty-Fifth Bam wkracza do Wieży, ryzykując życie, aby odnaleźć ukochaną przyjaciółkę Rachel, stawiając czoła niebezpiecznym próbom na każdym piętrze.",
            "chapters_count": 615,
            "rating": 9,
            "is_completed": False,
            "release_date": date(2010, 6, 30)
        },
        {
            "title": "The Beginning After The End",
            "author": "TurtleMe, Fuyuki23",
            "genre": "Fantasy",
            "description": "Potężny król Grey zostaje reinkarnowany w magicznym świecie kontynentu Dicathen jako Arthur Leywin. Od dzieciństwa zgłębia tajniki manipulacji maną i miecza, aby chronić swoją nową rodzinę przed nadciągającą wojną bóstw.",
            "chapters_count": 185,
            "rating": 9,
            "is_completed": False,
            "release_date": date(2018, 7, 7)
        },
        {
            "title": "Nano Machine",
            "author": "Hanjung Wolya, Geum Gangbulgoe",
            "genre": "Murim",
            "description": "Bękart z Demon Cult, Cheon Yeo-Woon, staje w obliczu śmierci z rąk zazdrosnych rywali. Niespodziewanie ratuje go potomek z przyszłości, który wszczepia mu nano-maszyny z VII wieku ery kosmicznej, drastycznie przyspieszające naukę sztuk walki.",
            "chapters_count": 205,
            "rating": 9,
            "is_completed": False,
            "release_date": date(2020, 6, 10)
        },
        {
            "title": "Wind Breaker",
            "author": "Jo Yongseok",
            "genre": "Sport",
            "description": "Jay jest wzorowym uczniem i przewodniczącym szkoły, który żyje pod presją rodziców. Wszystko zmienia się, gdy jego pasja do kolarstwa szosowego na ostrym kole (fixed gear) wciąga go w świat ulicznych wyścigów Street Riding League z ekipą Hummingbird.",
            "chapters_count": 495,
            "rating": 10,
            "is_completed": True,
            "release_date": date(2013, 12, 8)
        },
        {
            "title": "Eleceed",
            "author": "Son Jaeho, ZHENA",
            "genre": "Akcja",
            "description": "Seo Jiwoo, skromny licealista o wielkim sercu i niezwykłej prędkości ruchów, ratuje rannego, grubego kota. Okazuje się, że kot to Kayden – legendarny, potężny przebudzony wojownik ukrywający się przed wrogami w ciele dachowca.",
            "chapters_count": 290,
            "rating": 10,
            "is_completed": False,
            "release_date": date(2018, 10, 2)
        }
    ]

    for rec in records:
        obj, created = Manhwa.objects.get_or_create(
            title=rec["title"],
            defaults=rec
        )
        if created:
            print(f"-> Dodano rekord: {obj.title} ({obj.genre})")
        else:
            print(f"-> Rekord już istnieje: {obj.title}")

    print(f"\nSukces! Liczba rekordów w bazie: {Manhwa.objects.count()}")

if __name__ == '__main__':
    seed()
