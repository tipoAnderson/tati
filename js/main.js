document.addEventListener('DOMContentLoaded', () => {

    // ---------- БУРГЕР-МЕНЮ ----------
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---------- МОДАЛЬНЫЕ ОКНА ----------
    const modals = {
        booking: document.getElementById('bookingModal'),
        master: document.getElementById('bookingMasterModal')
    };

    // Функция открытия модалки
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Функция закрытия модалки
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Закрытие по крестику и overlay
    document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
        el.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    // ---------- ОБЩАЯ ЗАПИСЬ ----------
    document.querySelectorAll('#bookingBtn, #heroBookingBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('bookingModal');
        });
    });

    // ---------- ЗАПИСЬ К МАСТЕРУ ----------
    document.querySelectorAll('.master-card__btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const masterName = this.closest('.master-card').getAttribute('data-master-name') || 'мастеру';
            console.log(`Запись к ${masterName}`);
            openModal('bookingMasterModal');
        });
    });

    // ---------- СЛАЙДЕР ОТЗЫВОВ ----------
    const track = document.getElementById('reviewsTrack');
    const dotsContainer = document.getElementById('reviewsDots');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    let currentSlide = 0;
    let slidesPerView = 2;
    let totalSlides = 0;
    let autoPlayInterval = null;

    function initSlider() {
        // Определяем количество слайдов на экране
        if (window.innerWidth < 900) {
            slidesPerView = 1;
        } else {
            slidesPerView = 2;
        }

        const cards = track.querySelectorAll('.review-card');
        totalSlides = cards.length;

        // Обновляем ширину карточек
        const cardWidth = 100 / slidesPerView;
        cards.forEach(card => {
            card.style.flex = `0 0 calc(${100 / slidesPerView}% - 24px)`;
        });

        // Создаем точки
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

    // Автопрокрутка слайдера
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        startAutoPlay();
    }

    // Перезапуск при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initSlider();
            startAutoPlay();
        }, 300);
    });

    // Инициализация слайдера
    initSlider();
    startAutoPlay();

    // ---------- СЛАЙДЕР УСЛУГ ----------
    const servicesTrack = document.getElementById('servicesTrack');
    const servicesDots = document.getElementById('servicesDots');
    const prevService = document.getElementById('prevService');
    const nextService = document.getElementById('nextService');

    let servicesCurrent = 0;
    let servicesPerView = 3;
    let servicesTotal = 0;

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

    prevService.addEventListener('click', () => {
        goServiceSlide(servicesCurrent - 1);
    });

    nextService.addEventListener('click', () => {
        goServiceSlide(servicesCurrent + 1);
    });

    window.addEventListener('resize', () => {
        initServicesSlider();
    });

    initServicesSlider();


    // ---------- ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ----------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками услуг, мастерами и отзывами
    document.querySelectorAll('.service-card, .master-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Немного задерживаем появление для эффекта
    document.querySelectorAll('.service-card, .master-card, .review-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
    });

    console.log('Tati Studio — лендинг загружен! 🚀');
});