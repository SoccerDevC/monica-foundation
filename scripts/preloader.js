class SitePreloader {
    constructor() {
        this.createPreloader();
        this.sequenceImages();
    }

    createPreloader() {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="foundation-image">
                    <img src="assets/images/founder.jpg" alt="Foundation" class="foundation-logo">
                </div>
                <div class="loading-text">
                    <span>M</span><span>O</span><span>N</span><span>I</span><span>Q</span><span>U</span><span>E</span>
                    <span>&nbsp;</span>
                    <span>F</span><span>O</span><span>U</span><span>N</span><span>D</span><span>A</span><span>T</span><span>I</span><span>O</span><span>N</span>
                </div>
                <div id="sequence-container" class="sequence-container">
                    <div class="sequence-wrapper"></div>
                </div>
            </div>
        `;
        document.body.appendChild(preloader);

        // Animate letters sequentially
        const letters = preloader.querySelectorAll('.loading-text span');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add('animate');
            }, index * 100);
        });
    }

    sequenceImages() {
        const sequences = [
            { image: 'assets/images/education.jpg', text: 'Empowering Communities' },
            { image: 'assets/images/economic.jpg', text: 'Connecting Lives' },
            { image: 'assets/images/community.jpg', text: 'Building Futures' }
        ];

        setTimeout(() => {
            const wrapper = document.querySelector('.sequence-wrapper');
            let currentIndex = 0;

            const showNextSequence = () => {
                if (currentIndex < sequences.length) {
                    const seq = sequences[currentIndex];
                    const sequenceDiv = document.createElement('div');
                    sequenceDiv.className = 'sequence-item';
                    sequenceDiv.innerHTML = `
                        <div class="sequence-image">
                            <img src="${seq.image}" alt="Impact Image">
                        </div>
                        <div class="sequence-text">${seq.text}</div>
                    `;
                    
                    wrapper.innerHTML = '';
                    wrapper.appendChild(sequenceDiv);
                    
                    setTimeout(() => {
                        sequenceDiv.classList.add('visible');
                        currentIndex++;
                        if (currentIndex < sequences.length) {
                            setTimeout(showNextSequence, 2000);
                        } else {
                            // Final delay before hiding preloader
                            setTimeout(() => {
                                const preloader = document.getElementById('preloader');
                                preloader.style.opacity = '0';
                                setTimeout(() => {
                                    preloader.style.display = 'none';
                                }, 1000);
                            }, 0);
                        }
                    }, 100);
                }
            };

            showNextSequence();
        }, 0); // Reduced initial delay to 2 seconds
    }
}