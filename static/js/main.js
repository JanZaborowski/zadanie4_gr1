/**
 * Laboratorium: Samodzielna aplikacja Django API + JavaScript fetch()
 * Plik: static/js/main.js
 * Autor: Jan Zaborowski (31401, gr 1)
 * 
 * Funkcjonalności:
 * 1. Asynchroniczne żądanie HTTP fetch() do endpointu /api/manhwa/
 * 2. Obsługa parametrów filtrujących przekazywanych w URL (?status=...&genre=...)
 * 3. Weryfikacja response.ok oraz parsowanie JSON przez response.json()
 * 4. Obsługa stanów: ładowanie (loading), brak danych (empty), błędy (error)
 * 5. Bezpieczna aktualizacja drzewa DOM za pomocą document.createElement() i textContent (brak XSS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencje do elementów DOM
    const loadBtn = document.getElementById('loadDataBtn');
    const clearBtn = document.getElementById('clearBtn');
    const filterStatus = document.getElementById('filterStatus');
    const filterGenre = document.getElementById('filterGenre');
    const manhwaContainer = document.getElementById('manhwaContainer');
    const loadingStatus = document.getElementById('loadingStatus');
    const messageBox = document.getElementById('messageBox');
    const statsBar = document.getElementById('statsBar');
    const resultsCount = document.getElementById('resultsCount');
    const activeApiUrl = document.getElementById('activeApiUrl');
    const rawApiLink = document.getElementById('rawApiLink');

    /**
     * Buduje URL zapytania API na podstawie wybranych filtrów
     */
    function buildApiUrl() {
        const url = new URL('/api/manhwa/', window.location.origin);
        const statusVal = filterStatus.value;
        const genreVal = filterGenre.value;

        if (statusVal !== 'all') {
            url.searchParams.set('status', statusVal);
        }
        if (genreVal !== 'all') {
            url.searchParams.set('genre', genreVal);
        }

        return url;
    }

    /**
     * Aktualizuje etykietę z adresem URL API w nagłówku panelu
     */
    function updateUrlDisplay() {
        const targetUrl = buildApiUrl();
        const displayPath = targetUrl.pathname + targetUrl.search;
        activeApiUrl.textContent = `Endpoint: ${displayPath}`;
        rawApiLink.href = displayPath;
        rawApiLink.textContent = `Surowa odpowiedź JSON (${displayPath})`;
    }

    /**
     * Główna funkcja pobierająca dane przez fetch() i aktualizująca DOM
     */
    async function loadManhwaData() {
        const apiUrl = buildApiUrl();
        updateUrlDisplay();

        // 1. Stan początkowy - włączenie wskaźnika ładowania
        loadingStatus.style.display = 'flex';
        messageBox.style.display = 'none';
        messageBox.className = 'status-box';
        statsBar.style.display = 'none';
        manhwaContainer.replaceChildren(); // czyszczenie kontenera

        try {
            // 2. Wysłanie asynchronicznego zapytania HTTP GET do backendu Django
            console.log(`[API FETCH] Wysyłanie żądania do: ${apiUrl.toString()}`);
            const response = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // 3. Sprawdzenie poprawności odpowiedzi HTTP (response.ok)
            if (!response.ok) {
                throw new Error(`Błąd serwera HTTP: ${response.status} (${response.statusText || 'Brak opisu błędu'})`);
            }

            // 4. Odczytanie i sparsowanie JSON
            const data = await response.json();
            const items = data.items || [];
            console.log(`[API FETCH] Odebrano ${items.length} rekordów:`, items);

            // 5. Obsługa pustej listy rekordów
            if (items.length === 0) {
                showEmptyState();
                return;
            }

            // 6. Prezentacja wyników i aktualizacja DOM
            renderManhwaCards(items);

            // Aktualizacja paska statystyk
            statsBar.style.display = 'flex';
            resultsCount.textContent = `Pobrano ${items.length} ${getPolishPlural(items.length, 'pozycję', 'pozycje', 'pozycji')} z bazy danych ORM`;

        } catch (error) {
            console.error('[API FETCH ERROR]', error);
            showErrorState(error.message);
        } finally {
            // 7. Usunięcie komunikatu o ładowaniu po zakończeniu pobierania
            loadingStatus.style.display = 'none';
        }
    }

    /**
     * Bezpieczne renderowanie kart w drzewie DOM przy użyciu createElement() i textContent
     */
    function renderManhwaCards(items) {
        manhwaContainer.replaceChildren();

        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'manhwa-card';

            // Top section: tagi (gatunek, status)
            const topDiv = document.createElement('div');
            topDiv.className = 'card-top';

            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'card-tags';

            const genreTag = document.createElement('span');
            genreTag.className = 'tag tag-genre';
            genreTag.textContent = item.genre || 'Inny';
            tagsDiv.appendChild(genreTag);

            const statusTag = document.createElement('span');
            if (item.is_completed) {
                statusTag.className = 'tag tag-completed';
                statusTag.textContent = '✓ Zakończona';
            } else {
                statusTag.className = 'tag tag-ongoing';
                statusTag.textContent = '⏳ W trakcie wydawania';
            }
            tagsDiv.appendChild(statusTag);
            topDiv.appendChild(tagsDiv);

            // Tytuł
            const titleEl = document.createElement('h3');
            titleEl.className = 'card-title';
            titleEl.textContent = item.title;
            topDiv.appendChild(titleEl);

            // Autor
            const authorEl = document.createElement('p');
            authorEl.className = 'card-author';
            authorEl.textContent = `Autor: ${item.author || 'Nieznany'}`;
            topDiv.appendChild(authorEl);

            card.appendChild(topDiv);

            // Opis fabuły
            const descEl = document.createElement('p');
            descEl.className = 'card-desc';
            descEl.textContent = item.description || 'Brak opisu fabuły.';
            card.appendChild(descEl);

            // Stopka karty: ocena, liczba rozdziałów, data
            const footerDiv = document.createElement('div');
            footerDiv.className = 'card-footer';

            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'card-rating';
            ratingDiv.textContent = `★ ${item.rating}/10`;
            footerDiv.appendChild(ratingDiv);

            const chaptersDiv = document.createElement('div');
            chaptersDiv.className = 'card-chapters';
            chaptersDiv.textContent = `${item.chapters_count} rozdz.`;
            footerDiv.appendChild(chaptersDiv);

            card.appendChild(footerDiv);

            // Dołączenie gotowej karty do głównego kontenera
            manhwaContainer.appendChild(card);
        });
    }

    /**
     * Obsługa stanu braku danych
     */
    function showEmptyState() {
        messageBox.className = 'status-box empty-box';
        messageBox.style.display = 'flex';
        messageBox.textContent = '';

        const icon = document.createElement('span');
        icon.style.fontSize = '1.8rem';
        icon.textContent = '⚠️';
        messageBox.appendChild(icon);

        const textDiv = document.createElement('div');
        const h4 = document.createElement('strong');
        h4.textContent = 'Brak pasujących rekordów w bazie danych';
        const p = document.createElement('p');
        p.className = 'status-sub';
        p.textContent = 'Dla wybranych kryteriów filtrowania Django ORM zwrócił pusty zbiór wyników. Zmień ustawienia filtrów i spróbuj ponownie.';
        textDiv.appendChild(h4);
        textDiv.appendChild(p);
        messageBox.appendChild(textDiv);
    }

    /**
     * Obsługa stanu błędu połączenia lub odpowiedzi serwera
     */
    function showErrorState(errorMessage) {
        messageBox.className = 'status-box error-box';
        messageBox.style.display = 'flex';
        messageBox.textContent = '';

        const icon = document.createElement('span');
        icon.style.fontSize = '1.8rem';
        icon.textContent = '❌';
        messageBox.appendChild(icon);

        const textDiv = document.createElement('div');
        const h4 = document.createElement('strong');
        h4.textContent = 'Wystąpił błąd podczas komunikacji z serwerem API';
        const p = document.createElement('p');
        p.className = 'status-sub';
        p.textContent = errorMessage || 'Nie udało się nawiązać połączenia z backendem Django.';
        textDiv.appendChild(h4);
        textDiv.appendChild(p);
        messageBox.appendChild(textDiv);
    }

    /**
     * Czyści widok kart do stanu początkowego
     */
    function clearResults() {
        manhwaContainer.replaceChildren();
        messageBox.style.display = 'none';
        statsBar.style.display = 'none';

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-card';
        placeholder.id = 'initialPlaceholder';

        const icon = document.createElement('div');
        icon.className = 'placeholder-icon';
        icon.textContent = '📚';
        placeholder.appendChild(icon);

        const h3 = document.createElement('h3');
        h3.textContent = 'Widok wyczyszczony';
        placeholder.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = 'Kliknij „Wczytaj dane (fetch)”, aby ponownie pobrać dane z backendu Django bez przeładowywania strony.';
        placeholder.appendChild(p);

        manhwaContainer.appendChild(placeholder);
    }

    /**
     * Pomocnicza odmiana słów w języku polskim
     */
    function getPolishPlural(count, single, few, many) {
        if (count === 1) return single;
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
        return many;
    }

    // Nasłuchiwanie zdarzeń
    loadBtn.addEventListener('click', loadManhwaData);
    clearBtn.addEventListener('click', clearResults);
    filterStatus.addEventListener('change', () => {
        updateUrlDisplay();
        loadManhwaData();
    });
    filterGenre.addEventListener('change', () => {
        updateUrlDisplay();
        loadManhwaData();
    });

    // Inicjalizacja URL display
    updateUrlDisplay();
});
