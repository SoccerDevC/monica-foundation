// Check if user is authenticated
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPath = window.location.pathname;
    
    // Pages that don't require authentication
    const publicPages = [
        '/pages/landing.html',
        '/landing.html',
        '/pages/login.html',
        '/pages/signup.html'
    ];
    
    // Check if current page is public
    const isPublicPage = publicPages.some(page => currentPath.includes(page));
    
    if (!user && !isPublicPage) {
        // If user is not authenticated and trying to access a protected page
        window.location.href = '/pages/landing.html';
        return false;
    }
    
    if (user && isPublicPage) {
        // If user is authenticated and trying to access login/signup pages
        window.location.href = '/index.html';
        return false;
    }
    
    return true;
}

// Run check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Export for use in other files
window.checkAuth = checkAuth; 