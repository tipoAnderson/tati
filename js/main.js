// ================================================================
// TATI STUDIO - Лендинг
// Вся интерактивность сайта
// ================================================================

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
    
    // ---------- МОДАЛЬНОЕ ОКНО ЗАПИСИ ----------
    const modal = document.getElementById('bookingModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const bookingBtns = document.querySelectorAll('#bookingBtn, #heroBookingBtn, .master-card__btn');
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Открытие модалки по кнопкам
    bookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
            
            // Если нажали на кнопку мастера — передаём имя
            const masterName = btn.getAttribute('data-master');
            if (masterName) {
                console.log(`Запись к мастеру: ${masterName}`);
                // Здесь можно динамически подставить выбор мастера в виджет Dikidi
                // Например, через URL-параметр или вызов API
            }
        });
    });
    
    // Закрытие модалки
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
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
            card.style.flex = `0 0 calc(${cardWidth}% - ${(slidesPerView - 1) * 12 / slidesPerView}px)`;
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
        const offset = -index * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Обновляем активные точки
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
    
    // ---------- ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // ---------- ЗАПИСЬ ЧЕРЕЗ DIKIDI (ИНТЕГРАЦИЯ) ----------
    // Функция для открытия виджета Dikidi с конкретным мастером
    window.openDikidiBooking = function(masterName = null) {
        // Базовый URL для виджета Dikidi
        // Замените YOUR_DIKIDI_ID на ваш ID из личного кабинета Dikidi
        const companyId = 'YOUR_DIKIDI_ID';
        let widgetUrl = `https://dikidi.ru/#/online/${companyId}`;
        
        // Если передан мастер, добавляем параметр
        if (masterName) {
            // Способ 1: через параметр запроса (если поддерживается Dikidi)
            // widgetUrl += `?master=${encodeURIComponent(masterName)}`;
            
            // Способ 2: запись в localStorage для последующего использования виджетом
            localStorage.setItem('dikidi_selected_master', masterName);
            console.log(`Выбран мастер: ${masterName}`);
        }
        
        // Открываем в новом окне (или можно использовать iframe внутри модалки)
        window.open(widgetUrl, '_blank');
    };
    
    // Обработчики кнопок мастеров с интеграцией Dikidi
    document.querySelectorAll('.master-card__btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const masterName = this.getAttribute('data-master');
            // Если не хотим открывать модалку, а сразу переходить к записи
            // openDikidiBooking(masterName);
            
            // А пока открываем модалку с уведомлением
            // (в реальной интеграции здесь будет вызов виджета Dikidi)
            openModal();
            
            // Показываем сообщение о выборе мастера
            const message = document.getElementById('modalMessage');
            const widget = document.getElementById('dikidiWidget');
            if (message) {
                message.style.display = 'block';
                message.innerHTML = `
                    <p style="font-size: 18px; color: #2d2d2d;">
                        🎯 Запись к <strong>${masterName}</strong>
                    </p>
                    <p style="color: #777; margin: 10px 0 20px;">
                        Виджет Dikidi будет загружен здесь.<br />
                        Пока позвоните нам: <strong>+375 29 123-45-67</strong>
                    </p>
                    <button class="btn btn--primary" onclick="document.getElementById('bookingModal').classList.remove('active')" style="margin-top: 10px;">
                        Закрыть
                    </button>
                `;
                if (widget) widget.style.display = 'none';
            }
        });
    });
    
    // Восстанавливаем стандартное поведение для кнопок "Записаться"
    document.querySelectorAll('#bookingBtn, #heroBookingBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Сброс сообщения, показываем виджет
            const message = document.getElementById('modalMessage');
            const widget = document.getElementById('dikidiWidget');
            if (message) {
                message.style.display = 'none';
                message.innerHTML = `
                    <p style="font-size: 18px; color: #2d2d2d;">Запись в разработке...</p>
                    <p style="color: #777; margin-top: 10px;">Скоро здесь появится виджет Dikidi.<br />А пока позвоните нам по телефону <strong>+375 29 123-45-67</strong></p>
                    <button class="btn btn--primary" onclick="document.getElementById('bookingModal').classList.remove('active')" style="margin-top: 20px;">Закрыть</button>
                `;
            }
            if (widget) widget.style.display = 'block';
        });
    });
    
    console.log('Tati Studio — лендинг загружен! 🚀');
});