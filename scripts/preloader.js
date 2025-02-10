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
                    <span>R</span><span>I</span><span>C</span><span>H</span><span>A</span><span>R</span><span>D</span><span>S</span>
                </div>
                <div id="sequence-container" class="sequence-container"></div>
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
            const container = document.getElementById('sequence-container');
            
            sequences.forEach((seq, index) => {
                setTimeout(() => {
                    const sequenceDiv = document.createElement('div');
                    sequenceDiv.className = 'sequence-item';
                    sequenceDiv.innerHTML = `
                        <div class="sequence-image">
                            <img src="${seq.image}" alt="Impact Image">
                        </div>
                        <div class="sequence-text">${seq.text}</div>
                    `;
                    container.appendChild(sequenceDiv);

                    // Add animation class after a brief delay
                    setTimeout(() => {
                        sequenceDiv.classList.add('visible');
                    }, 100);
                }, index * 2000); // Show each sequence 2 seconds apart
            });

            // Hide preloader after all sequences
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }, (sequences.length * 2000) + 5000); // Additional 5 seconds after sequences
        }, 5000); // Initial 5-second delay with founder image
    }
} 