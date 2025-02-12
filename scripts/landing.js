document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.querySelector('.signup-btn');
    const loginBtn = document.querySelector('.login-btn');
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    const closeBtns = document.querySelectorAll('.close');

    // Open modals
    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            signupModal.style.display = 'none';
            loginModal.style.display = 'none';
        });
    });

    // Handle form submissions
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Add signup logic here
        window.location.href = 'index.html';
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Add login logic here
        window.location.href = 'index.html';
    });
}); 