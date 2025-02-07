document.addEventListener('DOMContentLoaded', function() {
    // Animated Number Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        let startTime = null;
        
        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const current = Math.round(progress * target);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // Enhance the intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observerNumbers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in animation class
                entry.target.classList.add('fade-in');
                // Start number animation
                animateNumber(entry.target);
                observerNumbers.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(number => observerNumbers.observe(number));

    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerTimeline = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerTimeline.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => observerTimeline.observe(item));

    // Testimonials Slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentSlide = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.style.display = 'none');
        
        if (index >= testimonials.length) currentSlide = 0;
        if (index < 0) currentSlide = testimonials.length - 1;
        
        testimonials[currentSlide].style.display = 'block';
    }

    prevBtn.addEventListener('click', () => {
        currentSlide--;
        showTestimonial(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide++;
        showTestimonial(currentSlide);
    });

    // Initialize first testimonial
    showTestimonial(currentSlide);

    // Google Maps Integration
    function initMap() {
        const mapOptions = {
            zoom: 12,
            center: { lat: -1.2921, lng: 36.8219 }, // Example coordinates for Nairobi
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#2C5282" }]
                }
                // Add more custom styles as needed
            ]
        };

        const map = new google.maps.Map(document.getElementById('map'), mapOptions);

        // Example locations data
        const locations = [
            {
                position: { lat: -1.2921, lng: 36.8219 },
                type: 'education',
                title: 'Education Center 1'
            },
            {
                position: { lat: -1.2980, lng: 36.8250 },
                type: 'crafts',
                title: 'Craft Center 1'
            },
            {
                position: { lat: -1.2890, lng: 36.8180 },
                type: 'community',
                title: 'Community Project 1'
            }
        ];

        // Custom markers for different types
        const icons = {
            education: {
                url: '../assets/images/markers/education-marker.png',
                scaledSize: new google.maps.Size(30, 30)
            },
            crafts: {
                url: '../assets/images/markers/crafts-marker.png',
                scaledSize: new google.maps.Size(30, 30)
            },
            community: {
                url: '../assets/images/markers/community-marker.png',
                scaledSize: new google.maps.Size(30, 30)
            }
        };

        // Add markers to map
        locations.forEach(location => {
            const marker = new google.maps.Marker({
                position: location.position,
                icon: icons[location.type],
                map: map,
                title: location.title
            });

            // Add click listener for info windows
            const infoWindow = new google.maps.InfoWindow({
                content: `<div class="info-window">
                            <h3>${location.title}</h3>
                            <p>Type: ${location.type}</p>
                         </div>`
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        });
    }

    // Initialize map if Google Maps API is loaded
    if (typeof google !== 'undefined') {
        initMap();
    }

    // Story Card Modal
    const storyButtons = document.querySelectorAll('.read-more');
    
    storyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const storyId = button.getAttribute('data-story');
            // Here you would typically fetch the full story content
            // and display it in a modal
            console.log(`Fetch story content for ID: ${storyId}`);
        });
    });

    // Download Report Tracking
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Track download event
            console.log('Report downloaded:', e.target.closest('.report-card').querySelector('h3').textContent);
        });
    });

    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 