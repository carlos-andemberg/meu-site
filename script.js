document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const cards = document.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    let currentCard = 0;
    let cardsPerView = 1;

    // Variáveis para o touch
    let startX = 0;
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
        // Reset to first card if the number of cards per view changes
        currentCard = 0;
    };

    const updateCarousel = () => {
        const cardWidth = track.offsetWidth / cardsPerView;
        const offset = -currentCard * cardWidth;
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
    };

    const moveCarousel = (direction) => {
        const numVisibleCards = totalCards - cardsPerView + 1;
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
        const numDots = totalCards - cardsPerView + 1;
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

    // Lógica para deslizar com o dedo
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
        const diffX = endX - startX;
        const cardWidth = track.offsetWidth / cardsPerView;
        const offset = -currentCard * cardWidth + diffX;
        track.style.transform = `translateX(${offset}px)`;
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        // Detecta um deslize se a diferença for maior que 50 pixels
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                moveCarousel('prev');
            } else {
                moveCarousel('next');
            }
        }
        updateCarousel();
        isDragging = false;
    });

    // Re-initialize on window resize
    window.addEventListener('resize', () => {
        updateCardsPerView();
        generateDots(); // Regenera os pontos para ajustar ao novo tamanho
        updateCarousel();
    });

    // Initialize carousel on load
    updateCardsPerView();
    generateDots();
});