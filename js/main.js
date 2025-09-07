// js/main.js ("Detective" Version)

console.log('Hello from main.js! File is loading.'); // Detective Note 1

// =================================================================
// GLOBAL CONFIGURATION & FUNCTIONS
// =================================================================

// js/main.js (Yeh bilkul theek hai, ismein koi change nahi)
const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';
// ... baaki ka code ...

/**
 * Mobile navigation (hamburger menu) ke liye function
 */
function initMobileNav() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    console.log('Searching for buttons...', { hamburgerBtn, mobileNav }); // Detective Note 2

    if (hamburgerBtn && mobileNav) {
        console.log('Buttons FOUND! Adding click listener.'); // Detective Note 3
        hamburgerBtn.addEventListener('click', () => {
            // ULTIMATE TEST: Agar yeh alert dikhta hai, toh sabkuch aacha hai
            alert('Hamburger button clicked!'); 
            
            mobileNav.classList.toggle('hidden');
        });
    } else {
        console.error('Hamburger button or mobile nav not found!'); // Detective Note 4
    }
}

/**
 * Dark mode toggle button ke liye function
 */
function initTheme() {
    // ... (yeh function jaisa tha waisa hi rakhein) ...
}

/**
 * "Back to Top" button ke liye function
 */
function initBackToTop() {
    // ... (yeh function jaisa tha waisa hi rakhein) ...
}

/**
 * Saare common features ko chalu karne wala function
 */
function initializeCommonFeatures() {
    console.log('Initializing all common features...'); // Detective Note 5
    initMobileNav();
    initTheme(); 
    initBackToTop();
    AOS.init({ once: true, duration: 800, offset: 50 });
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// Page load hote hi common features ko chalu karo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is ready! Running initializers.'); // Detective Note 6
    initializeCommonFeatures();
});