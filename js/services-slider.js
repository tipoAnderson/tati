const servicesTrack = document.getElementById('servicesTrack');
const servicesDots = document.getElementById('servicesDots');
const prevService = document.getElementById('prevService');
const nextService = document.getElementById('nextService');
const servicesSlider = document.getElementById('servicesSlider');

let servicesCurrent = 0;
let servicesPerView = 3;
let servicesTotal = 0;
let servicesAutoPlayInterval = null;
let servicesSwipeStartX = 0;
let servicesSwipeStartY = 0;
let isServicesDragging = false;

function initServicesSlider() {
    if (window.innerWidth < 600) {
        servicesPerView = 1;
    } else if (window.innerWidth < 1024) {
        servicesPerView = 2;
    } else {
        servicesPerView = 3;
    }

    const cards = servicesTrack.querySelectorAll('.service-card');
    servicesTotal = cards.length;

    const dotsCount = Math.ceil(servicesTotal / servicesPerView);
    servicesDots.innerHTML = '';

    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('services_dot');
        if (i === 0) dot.classList.add('services_dot-active');
        dot.addEventListener('click', () => goServiceSlide(i));
        servicesDots.appendChild(dot);
    }

    goServiceSlide(0);
}

function goServiceSlide(index) {
    const dots = servicesDots.querySelectorAll('.services_dot');
    const maxSlide = Math.ceil(servicesTotal / servicesPerView) - 1;

    if (index < 0) index = maxSlide;
    if (index > maxSlide) index = 0;

    servicesCurrent = index;

    const card = servicesTrack.querySelector('.service-card');
    const cardWidth = card.offsetWidth;
    const gap = 24;

    const step = (cardWidth + gap) * servicesPerView;
    const offset = -(step * index);

    servicesTrack.style.transform = `translateX(${offset}px)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('services_dot-active', i === index);
    });
}

function startServicesAutoPlay() {
    if (servicesAutoPlayInterval) clearInterval(servicesAutoPlayInterval);
    servicesAutoPlayInterval = setInterval(() => {
        goServiceSlide(servicesCurrent + 1);
    }, 5000);
}

function resetServicesAutoPlay() {
    startServicesAutoPlay();
}

prevService.addEventListener('click', () => {
    goServiceSlide(servicesCurrent - 1);
    resetServicesAutoPlay();
});

nextService.addEventListener('click', () => {
    goServiceSlide(servicesCurrent + 1);
    resetServicesAutoPlay();
});

servicesSlider.addEventListener('pointerdown', (event) => {
    servicesSwipeStartX = event.clientX;
    servicesSwipeStartY = event.clientY;
    isServicesDragging = true;
    servicesSlider.classList.add('is-dragging');
});

servicesSlider.addEventListener('pointerup', (event) => {
    if (!isServicesDragging) return;
    isServicesDragging = false;
    servicesSlider.classList.remove('is-dragging');

    const deltaX = event.clientX - servicesSwipeStartX;
    const deltaY = event.clientY - servicesSwipeStartY;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
        goServiceSlide(servicesCurrent + 1);
    } else {
        goServiceSlide(servicesCurrent - 1);
    }

    resetServicesAutoPlay();
});

servicesSlider.addEventListener('pointercancel', () => {
    isServicesDragging = false;
    servicesSlider.classList.remove('is-dragging');
});

servicesSlider.addEventListener('pointerleave', () => {
    isServicesDragging = false;
    servicesSlider.classList.remove('is-dragging');
});

window.addEventListener('resize', () => {
    initServicesSlider();
    startServicesAutoPlay();
});

initServicesSlider();
startServicesAutoPlay();