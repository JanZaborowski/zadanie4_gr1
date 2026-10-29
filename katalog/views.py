from django.shortcuts import render
from django.http import JsonResponse
from .models import Manhwa


def index(request):
    """
    Laboratorium A - Krok 3:
    Widok strony głównej renderujący szablon HTML.
    """
    total_manhwa = Manhwa.objects.count()
    return render(request, 'katalog/index.html', {
        'total_manhwa': total_manhwa
    })


def api_manhwa_list(request):
    """
    Laboratorium B - Krok 4 & Krok 8:
    Endpoint API zwracający dane w formacie JSON pobrane z modelu przez Django ORM.
    Obsługuje filtrowanie po parametrze URL (is_completed oraz genre/search).
    """
    queryset = Manhwa.objects.all()

    # Filtrowanie po parametrze URL: status / is_completed
    status_param = request.GET.get('status')
    is_completed_param = request.GET.get('is_completed')

    if status_param == 'completed' or is_completed_param == 'true':
        queryset = queryset.filter(is_completed=True)
    elif status_param == 'ongoing' or is_completed_param == 'false':
        queryset = queryset.filter(is_completed=False)

    # Opcjonalne dodatkowe filtrowanie po gatunku
    genre_param = request.GET.get('genre')
    if genre_param and genre_param != 'all':
        queryset = queryset.filter(genre__icontains=genre_param)

    # Opcjonalne wyszukiwanie po tytule/autorze
    query_param = request.GET.get('q')
    if query_param:
        queryset = queryset.filter(title__icontains=query_param)

    # Sortowanie domyślne: wg oceny malejąco, potem tytułu
    queryset = queryset.order_by('-rating', 'title')

    # Przygotowanie listy słowników (przekazujemy co najmniej 3 pola, a tu kompletne szczegóły)
    items = []
    for item in queryset:
        items.append({
            'id': item.id,
            'title': item.title,
            'author': item.author,
            'genre': item.genre,
            'chapters_count': item.chapters_count,
            'rating': item.rating,
            'is_completed': item.is_completed,
            'release_date': item.release_date.strftime('%Y-%m-%d') if item.release_date else None,
            'description': item.description,
        })

    # Zwrot poprawnej odpowiedzi JSON przez JsonResponse
    return JsonResponse({
        'items': items,
        'count': len(items)
    })
