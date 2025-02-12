// Update public pages array
const publicPages = [
    '/pages/landing.html',
    '/landing.html',
    '/',
    '/index.html'
];

// Update redirect paths
if (!user && !isPublicPage) {
    window.location.href = '/pages/landing.html';
    return false;
}

if (user && isPublicPage) {
    window.location.href = '/pages/home.html'; // or '/pages/dashboard.html'
    return false;
} 