from django.urls import path
from . import views

app_name = 'katalog'

urlpatterns = [
    # Strona główna HTML
    path('', views.index, name='index'),
    # Endpoint API zwracający JSON
    path('api/manhwa/', views.api_manhwa_list, name='api_manhwa_list'),
    path('api/obiekty/', views.api_manhwa_list, name='api_obiekty'),
]
