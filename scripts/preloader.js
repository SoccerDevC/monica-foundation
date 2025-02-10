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
                <div id="founder-section" class="founder-section">
                    <div class="foundation-image">
                        <img src="assets/images/founder.jpg" alt="Foundation" class="foundation-logo">
                    </div>
                    <div class="loading-text">
                        <span>M</span><span>O</span><span>N</span><span>I</span><span>Q</span><span>U</span><span>E</span>
                        <span>&nbsp;</span>
                        <span>R</span><span>I</span><span>C</span><span>H</span><span>A</span><span>R</span><span>D</span><span>S</span>
                        <br>
                        <span>F</span><span>O</span><span>U</span><span>N</span><span>D</span><span>A</span><span>T</span><span>I</span><span>O</span><span>N</span>
                    </div>
                </div>
                <div id="sequence-container" class="sequence-container"></div>
            </div>
        `;
        document.body.appendChild(preloader);

        // Hide main content initially
        document.querySelector('main').style.opacity = '0';
        document.querySelector('header').style.opacity = '0';
        document.querySelector('footer').style.opacity = '0';

        // Animate letters
        const letters = preloader.querySelectorAll('.loading-text span');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add('animate');
            }, index * 50);
        });
    }

    sequenceImages() {
        const sequences = [
            { image: 'assets/images/education.jpg', text: 'Empowering Communities' },
            { image: 'assets/images/economic.jpg', text: 'Connecting Lives' },
            { image: 'assets/images/community.jpg', text: 'Building Futures' }
        ];

        setTimeout(() => {
            const founderSection = document.getElementById('founder-section');
            founderSection.style.opacity = '0';
            
            setTimeout(() => {
                founderSection.style.display = 'none';
                const container = document.getElementById('sequence-container');
                container.style.display = 'flex';
                
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
                        
                        requestAnimationFrame(() => {
                            sequenceDiv.classList.add('visible');
                        });
                    }, index * 500);
                });

                // End preloader and show content
                setTimeout(() => {
                    const preloader = document.getElementById('preloader');
                    preloader.style.opacity = '0';
                    
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.querySelector('main').style.opacity = '1';
                        document.querySelector('header').style.opacity = '1';
                        document.querySelector('footer').style.opacity = '1';
                    }, 500);
                }, sequences.length * 500 + 1000);
            }, 300);
        }, 2000);
    }
}