const track = document.getElementById('reviewsTrack');
const dotsContainer = document.getElementById('reviewsDots');
const prevBtn = document.getElementById('prevReview');
const nextBtn = document.getElementById('nextReview');

let currentSlide = 0;
let slidesPerView = 2;
let totalSlides = 0;
let autoPlayInterval = null;

function initSlider() {

    if (window.innerWidth < 900) {
        slidesPerView = 1;
    } else {
        slidesPerView = 2;
    }

    const cards = track.querySelectorAll('.review-card');
    totalSlides = cards.length;

    cards.forEach(card => {
        card.style.flex = `0 0 calc(${100 / slidesPerView}% - 24px)`;
    });

    const dotsCount = Math.ceil(totalSlides / slidesPerView);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('reviews__dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    goToSlide(0);
}

function goToSlide(index) {
    const dots = dotsContainer.querySelectorAll('.reviews__dot');
    const maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;

    if (index < 0) index = maxSlide;
    if (index > maxSlide) index = 0;

    currentSlide = index;

    // ширина одной карточки + gap
    const card = track.querySelector('.review-card');
    const cardWidth = card.offsetWidth;
    const gap = 24; // как в CSS

    const step = (cardWidth + gap) * slidesPerView;

    const offset = -(step * index);

    track.style.transform = `translateX(${offset}px)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}


function nextSlide() {
    const maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;
    goToSlide(currentSlide + 1 > maxSlide ? 0 : currentSlide + 1);
}

function prevSlide() {
    const maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;
    goToSlide(currentSlide - 1 < 0 ? maxSlide : currentSlide - 1);
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    startAutoPlay();
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initSlider();
        startAutoPlay();
    }, 300);
});

initSlider();
startAutoPlay();