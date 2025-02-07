document.addEventListener('DOMContentLoaded', function() {
    // Progress Bar Animation
    const progressBar = document.querySelector('.progress');
    const targetWidth = progressBar.style.width;
    progressBar.style.width = '0';
    
    setTimeout(() => {
        progressBar.style.width = targetWidth;
    }, 500);

    // FAQ Toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const icon = item.querySelector('i');
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            });

            // Open clicked FAQ item
            if (!isActive) {
                faqItem.classList.add('active');
                const icon = question.querySelector('i');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });

    // Success Stories Slider
    const storiesSlider = document.querySelector('.stories-slider');
    const prevBtn = document.querySelector('.prev-story');
    const nextBtn = document.querySelector('.next-story');
    let slideIndex = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.story-card');
        if (index >= slides.length) slideIndex = 0;
        if (index < 0) slideIndex = slides.length - 1;

        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        slides[slideIndex].style.display = 'grid';
    }

    prevBtn.addEventListener('click', () => {
        slideIndex--;
        showSlide(slideIndex);
    });

    nextBtn.addEventListener('click', () => {
        slideIndex++;
        showSlide(slideIndex);
    });

    // Initialize first slide
    showSlide(slideIndex);

    // Donation Amount Selection
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountBtn = document.querySelector('.amount-btn.custom');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn === customAmountBtn) {
                const amount = prompt('Enter custom amount:');
                if (amount) {
                    btn.textContent = `$${amount}`;
                }
            }
        });
    });
}); 