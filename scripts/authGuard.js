// Check if user is authenticated
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPath = window.location.pathname;
    
    // Pages that don't require authentication
    const publicPages = [
        '/pages/landing.html',
        '/landing.html',
        '/pages/login.html',
        '/pages/signup.html',
        '/index.html',
        '/'
    ];
    
    // Check if current page is public
    const isPublicPage = publicPages.some(page => currentPath.includes(page));
    
    if (!user && !isPublicPage) {
        // If user is not authenticated and trying to access a protected page
        window.location.href = '/pages/landing.html';
        return false;
    }
    
    if (user && isPublicPage && !currentPath.includes('index.html') && currentPath !== '/') {
        // Only redirect to index if user is authenticated and on a public page
        // that isn't index itself
        window.location.href = '/index.html';
        return false;
    }
    
    return true;
}

// Run check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Export for use in other files
window.checkAuth = checkAuth;

// Option 2: Add a check for the current page
if (!window.location.pathname.includes('landing.html')) {
    // Only redirect if not already on landing page
    // Your existing redirect logic here
} 