// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBRI0SEntu6TdM7kB9oW7IntlvjC3_gjHU",
    authDomain: "monique-foundation.firebaseapp.com",
    projectId: "monique-foundation",
    storageBucket: "monique-foundation.firebasestorage.app",
    messagingSenderId: "626870543066",
    appId: "1:626870543066:web:eb48effdfd3dd58828fbe3",
    measurementId: "G-JKZC4Y8G4X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Debug logs
console.log('Firebase initialized');

// Configure Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Google Sign In
async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // Add new user to Firestore
            await db.collection('users').doc(user.uid).set({
                fullName: user.displayName,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        showNotification('Successfully signed in with Google!', 'success');
        
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            fullName: user.displayName
        }));

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        console.error('Google sign in error:', error);
        if (error.code === 'auth/operation-not-supported-in-this-environment') {
            showNotification('Please use HTTPS or localhost for Google sign-in', 'error');
        } else {
            showNotification(error.message, 'error');
        }
    }
}

// Password Reset
async function sendPasswordReset(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showNotification('Password reset email sent! Please check your inbox.', 'success');
        document.getElementById('resetPasswordModal').style.display = 'none';
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    const signupBtn = document.querySelector('.signup-btn');
    const loginBtn = document.querySelector('.login-btn');
    const closeBtns = document.querySelectorAll('.close');

    console.log('Modal elements:', { signupModal, loginModal, signupBtn, loginBtn });

    // Show modals
    signupBtn.addEventListener('click', () => {
        console.log('Signup button clicked');
        signupModal.style.display = 'block';
    });

    loginBtn.addEventListener('click', () => {
        console.log('Login button clicked');
        loginModal.style.display = 'block';
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            signupModal.style.display = 'none';
            loginModal.style.display = 'none';
        });
    });

    // Handle signup
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Signup form submitted');

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        try {
            console.log('Creating user:', email);
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            console.log('User created:', userCredential.user.uid);
            await db.collection('users').doc(userCredential.user.uid).set({
                fullName: fullName,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            showNotification('Account created successfully!', 'success');
            
            localStorage.setItem('user', JSON.stringify({
                uid: userCredential.user.uid,
                email: email,
                fullName: fullName
            }));

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message, 'error');
        }
    });

    // Handle login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            console.log('Signing in user:', email);
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            console.log('User signed in:', userCredential.user.uid);
            const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
            const userData = userDoc.data();

            localStorage.setItem('user', JSON.stringify({
                uid: userCredential.user.uid,
                email: email,
                fullName: userData.fullName
            }));

            showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message, 'error');
        }
    });

    // Switch between modals
    document.querySelector('.switch-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    document.querySelector('.switch-to-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });

    // Event Listeners
    document.getElementById('googleSignup').addEventListener('click', signInWithGoogle);
    document.getElementById('googleLogin').addEventListener('click', signInWithGoogle);

    document.getElementById('forgotPassword').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('resetPasswordModal').style.display = 'block';
    });

    document.querySelector('.back-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('resetPasswordModal').style.display = 'none';
        document.getElementById('loginModal').style.display = 'block';
    });

    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        await sendPasswordReset(email);
    });

    // Add Font Awesome to the head
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(link);
    }
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    console.log('Showing notification:', message, type);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Simple password toggle function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

// Add to your existing error handling
switch (error.code) {
    // ... existing cases ...
    case 'auth/popup-closed-by-user':
        errorMessage = 'Google sign-in was cancelled. Please try again.';
        break;
    case 'auth/popup-blocked':
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site.';
        break;
} 