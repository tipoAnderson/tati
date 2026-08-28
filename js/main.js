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