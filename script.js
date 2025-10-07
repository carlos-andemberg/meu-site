document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const cards = document.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    let currentCard = 0;
    let cardsPerView = 1;

    // Variáveis para o touch
    let startX = 0;
    let startY = 0; // Adicionado para detectar a direção do deslize
    let endX = 0;
    let isDragging = false;

    const updateCardsPerView = () => {
        if (window.innerWidth >= 1024) {
            cardsPerView = 4;
        } else if (window.innerWidth >= 768) {
            cardsPerView = 2;
        } else {
            cardsPerView = 1;
        }
        currentCard = 0;
    };

    const updateCarousel = () => {
        const cardWidth = track.offsetWidth / cardsPerView;
        const offset = -currentCard * cardWidth;
        // Garante que a transição seja suave ao soltar o dedo
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
    };

    const moveCarousel = (direction) => {
        const numVisibleCards = Math.max(0, totalCards - cardsPerView + 1);
        if (direction === 'next') {
            currentCard = (currentCard + 1) % numVisibleCards;
        } else if (direction === 'prev') {
            currentCard = (currentCard - 1 + numVisibleCards) % numVisibleCards;
        }
        updateCarousel();
    };

    const goToCard = (index) => {
        currentCard = index;
        updateCarousel();
    };

    const generateDots = () => {
        dotsContainer.innerHTML = '';
        const numDots = Math.max(0, totalCards - cardsPerView + 1);
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'bg-gray-400', 'rounded-full', 'mx-1', 'transition-colors', 'duration-300');
            dot.addEventListener('click', () => goToCard(i));
            dotsContainer.appendChild(dot);
        }
        updateDots();
    };

    const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            dot.classList.remove('bg-blue-600');
            dot.classList.add('bg-gray-400');
            if (index === currentCard) {
                dot.classList.add('bg-blue-600');
            }
        });
    };

    window.moveCarousel = moveCarousel;

    // --- Lógica de deslize aprimorada ---
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY; // Captura a posição Y inicial
        isDragging = true;
        // Remove a transição durante o arraste para um movimento mais fluido
        track.style.transition = 'none';
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // Verifica se o movimento é predominantemente horizontal
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Se for horizontal, previne o scroll vertical da página
            e.preventDefault();
            const cardWidth = track.offsetWidth / cardsPerView;
            const offset = -currentCard * cardWidth + diffX;
            track.style.transform = `translateX(${offset}px)`;
        }
        // Se o movimento for mais vertical, não fazemos nada,
        // permitindo que o navegador controle a rolagem da página.
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        // Detecta um deslize significativo para mudar de card
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                moveCarousel('prev');
            } else {
                moveCarousel('next');
            }
        } else {
            // Se o deslize for muito curto, volta para a posição original
            updateCarousel();
        }
    });

    // Re-initialize on window resize
    window.addEventListener('resize', () => {
        updateCardsPerView();
        generateDots();
        updateCarousel();
    });

    // Initialize carousel on load
    updateCardsPerView();
    generateDots();
});