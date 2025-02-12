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

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });

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
        
        // Store basic user info even if offline
        const userData = {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName
        };

        try {
            // Try to save to Firestore, but don't block on it
            await db.collection('users').doc(user.uid).set({
                fullName: user.displayName,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (firestoreError) {
            console.log('Firestore update failed, but login successful:', firestoreError);
        }

        // Save to localStorage and proceed with navigation
        localStorage.setItem('user', JSON.stringify(userData));
        showNotification('Successfully signed in with Google!', 'success');
        
        setTimeout(() => {
            window.location.href = '/pages/index.html';
        }, 1500);

    } catch (error) {
        console.error('Google sign in error:', error);
        showNotification(error.message, 'error');
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
                window.location.href = '/pages/index.html';
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message, 'error');
        }
    });

    // Handle login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            // Store basic user info
            const userData = {
                uid: userCredential.user.uid,
                email: email
            };

            try {
                const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
                if (userDoc.exists) {
                    userData.fullName = userDoc.data().fullName;
                }
            } catch (firestoreError) {
                console.log('Firestore fetch failed, but login successful:', firestoreError);
            }

            // Save to localStorage and proceed
            localStorage.setItem('user', JSON.stringify(userData));
            showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = '/pages/index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'An error occurred during login';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showNotification(errorMessage, 'error');
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

// Add this to your existing auth.js
function logout() {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem('user');
        window.location.href = '/pages/landing.html';
    }).catch((error) => {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    });
}

// Export for use in other files
window.logout = logout; 