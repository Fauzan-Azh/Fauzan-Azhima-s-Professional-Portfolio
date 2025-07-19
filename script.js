// Fungsi untuk animasi elemen saat di-scroll
const revealSection = function() {
    const sections = document.querySelectorAll('.home__container, .about__container');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    }, {
        root: null,
        threshold: 0.1,
    });

    sections.forEach(section => {
        section.classList.remove('visible'); 
        sectionObserver.observe(section);
    });
};

// Efek bayangan pada header saat scroll
const handleHeaderScroll = function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
};

// Fungsi untuk menangani active link di navbar
const changeActiveLink = function() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section[id]');
    
    let index = sections.length;
    while(--index && window.scrollY + 50 < sections[index].offsetTop) {}
    
    navLinks.forEach((link) => link.classList.remove('active-link'));
    
    const activeLink = document.querySelector(`.nav__link[href*="${sections[index].id}"]`);
    if(activeLink) {
        activeLink.classList.add('active-link');
    }
};

// Menjalankan fungsi saat scroll
window.addEventListener('scroll', () => {
    handleHeaderScroll();
    changeActiveLink();
});


/* ===== SLIDER LOGIC FOR ABOUT SECTION ===== */
const initSlider = function () {
    const slidesContainer = document.querySelector('.about__slides');
    if (!slidesContainer) return;

    const slides = document.querySelectorAll('.about__slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.slider__dots');

    if (slides.length === 0) return;

    let curSlide = 0;
    const maxSlide = slides.length;
    let autoplayInterval;

    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };

    const activateDot = function (slide) {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
        const targetDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);
        if (targetDot) {
            targetDot.classList.add('dots__dot--active');
        }
    };

    const goToSlide = function (slide) {
        slides.forEach(s => s.classList.remove('slide--active'));
        const targetSlide = slidesContainer.querySelector(`.about__slide:nth-child(${slide + 1})`);
        if (targetSlide) {
            targetSlide.classList.add('slide--active');
        }
    };  

    const nextSlide = function () {
        curSlide = (curSlide === maxSlide - 1) ? 0 : curSlide + 1;
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const prevSlide = function () {
        curSlide = (curSlide === 0) ? maxSlide - 1 : curSlide - 1;
        goToSlide(curSlide);
        activateDot(curSlide);
    };
    
    const startAutoplay = function() {
        clearInterval(autoplayInterval); 
        autoplayInterval = setInterval(nextSlide, 5000); 
    };

    const init = function () {
        createDots();
        goToSlide(0);
        activateDot(0);
        startAutoplay();
    };
    init();

    btnRight.addEventListener('click', function() {
        nextSlide();
        startAutoplay();
    });

    btnLeft.addEventListener('click', function() {
        prevSlide();
        startAutoplay();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        startAutoplay();
    });
    
    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            curSlide = parseInt(e.target.dataset.slide);
            goToSlide(curSlide);
            activateDot(curSlide);
            startAutoplay();
        }
    });
};

/* ===== TIMELINE ANIMATION ON SCROLL (OBSOLETE, but kept in case) ===== */
const initTimelineAnimation = function() {
    const timelineItems = document.querySelectorAll('.timeline__item');

    if (timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.2 });
        timelineItems.forEach(item => observer.observe(item));
    }
};

/* ===== UNIVERSAL SEE MORE / SEE LESS TOGGLE LOGIC (REVISED) ===== */
function setupToggle(buttonId, hiddenItemSelector) {
    const toggleBtn = document.getElementById(buttonId);
    if (!toggleBtn) return;
    
    const container = toggleBtn.closest('.section').querySelector('.grid');
    if (!container) return;

    // This gets a static list of items that are initially hidden.
    const hiddenItems = container.querySelectorAll(hiddenItemSelector);
    if (hiddenItems.length === 0) {
        toggleBtn.style.display = 'none';
        return;
    }

    // Set initial state for the button
    toggleBtn.dataset.showing = 'false';

    toggleBtn.addEventListener('click', function() {
        const isShowingMore = this.dataset.showing === 'true';

        // Toggle the class to trigger CSS transition
        hiddenItems.forEach(item => {
            if (isShowingMore) {
                // If it's showing, hide it
                item.classList.add('project--hidden');
            } else {
                // If it's hidden, show it
                item.classList.remove('project--hidden');
            }
        });
        
        // Update button text and state
        this.textContent = isShowingMore ? 'See More' : 'See Less';
        this.dataset.showing = isShowingMore ? 'false' : 'true';
    });
}

// FUNGSI UNTUK MEMBUKA/TUTUP DESKRIPSI PENGALAMAN
const initExperienceToggle = function() {
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        const toggleButton = card.querySelector('.experience-card__toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', function() {
                card.classList.toggle('details-open');
            });
        }
    });
};

// Menjalankan semua fungsi setelah halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    revealSection();
    initSlider();
    initTimelineAnimation();
    setupToggle('see-more-projects', '.project--hidden');
    initExperienceToggle();
    changeActiveLink(); // Initial check
});