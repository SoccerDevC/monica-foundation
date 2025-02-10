class PageAnimations {
    constructor() {
        this.initializeObserver();
        this.initializeHeroAnimation();
        this.initializeStatCounter();
        this.initializeParallax();
    }

    initializeObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: "0px 0px -100px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateStats(entry.target);
                    }
                }
            });
        }, options);

        // Observe elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    initializeHeroAnimation() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');

        setTimeout(() => {
            heroContent.classList.add('animate-in');
            heroImage.classList.add('animate-in');
        }, 500);
    }

    initializeStatCounter() {
        const stats = document.querySelectorAll('.stat-item h3');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            stat.textContent = '0';
            stat.dataset.target = target;
        });
    }

    animateStats(statItem) {
        const stat = statItem.querySelector('h3');
        const target = parseInt(stat.dataset.target);
        const duration = 2000; // 2 seconds
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            stat.textContent = Math.round(current);
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
                if (target > 100) stat.textContent = '100+';
                if (target > 50) stat.textContent = '50+';
            }
        }, duration / steps);
    }

    initializeParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
} 