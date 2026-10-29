from django.db import models


class Manhwa(models.Model):
    """
    Model reprezentujący komiks / manhwę w katalogu czytelnika.
    Spełnia wymóg co najmniej 5 pól i co najmniej 3 różnych typów pól Django.
    """
    title = models.CharField(max_length=200, verbose_name="Tytuł manhwy")
    author = models.CharField(max_length=150, verbose_name="Autor / Twórca")
    genre = models.CharField(max_length=100, verbose_name="Gatunek")
    description = models.TextField(verbose_name="Opis fabuły")
    chapters_count = models.IntegerField(default=1, verbose_name="Liczba rozdziałów")
    rating = models.IntegerField(default=10, verbose_name="Ocena (1-10)")
    is_completed = models.BooleanField(default=False, verbose_name="Czy zakończona?")
    release_date = models.DateField(null=True, blank=True, verbose_name="Data premiery")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data dodania")

    class Meta:
        verbose_name = "Manhwa / Komiks"
        verbose_name_plural = "Manhwy / Komiksy"
        ordering = ['-rating', 'title']

    def __str__(self):
        status = "Zakończona" if self.is_completed else "W trakcie"
        return f"{self.title} [{self.genre}] — {self.author} ({status})"
