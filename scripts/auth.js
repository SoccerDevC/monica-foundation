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
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Google Sign In Function
async function signInWithGoogle() {
    try {
        // Show loading state
        const googleButtons = document.querySelectorAll('.google-btn');
        googleButtons.forEach(btn => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        });

        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        console.log("Google sign-in successful", user);

        // Store user data in Firestore
        try {
            await db.collection('users').doc(user.uid).set({
                fullName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Store in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                fullName: user.displayName,
                photoURL: user.photoURL
            }));

            showNotification('Successfully signed in with Google!', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/pages/index.html';
            }, 1500);

        } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
            // Even if Firestore fails, still log the user in
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                fullName: user.displayName,
                photoURL: user.photoURL
            }));
            
            showNotification('Signed in! Some data may sync later.', 'success');
            setTimeout(() => {
                window.location.href = '/pages/index.html';
            }, 1500);
        }

    } catch (error) {
        console.error("Google sign in error:", error);
        let errorMessage = 'Google sign-in failed';
        
        switch (error.code) {
            case 'auth/popup-blocked':
                errorMessage = 'Please allow popups for this website and try again';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = 'Sign-in was cancelled. Please try again';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Only one sign-in window allowed at a time';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection';
                break;
            default:
                errorMessage = error.message;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        // Reset buttons
        const googleButtons = document.querySelectorAll('.google-btn');
        googleButtons.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = `
                <img src="../assets/images/google-icon.svg" alt="Google">
                Continue with Google
            `;
        });
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
                window.location.href = '/pages/landing.html';
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
                window.location.href = '/pages/landing.html';
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