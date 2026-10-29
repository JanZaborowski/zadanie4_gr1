from django.contrib import admin
from .models import Manhwa


@admin.register(Manhwa)
class ManhwaAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre', 'chapters_count', 'rating', 'is_completed', 'release_date')
    list_filter = ('is_completed', 'genre', 'rating')
    search_fields = ('title', 'author', 'genre', 'description')
    ordering = ('-rating', 'title')
