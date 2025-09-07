// js/main.js (Nayi "Master" File)

// =================================================================
// GLOBAL CONFIGURATION & FUNCTIONS (Yeh har page par kaam karenge)
// =================================================================

// Backend API ka address (ab yeh ek hi jagah par hai)
const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

/**
 * Dark mode toggle button ke liye function
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    
    const applyTheme = (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (lightIcon && darkIcon) {
            lightIcon.classList.toggle('hidden', theme === 'dark');
            darkIcon.classList.toggle('hidden', theme !== 'dark');
        }
    };

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

/**
 * "Back to Top" button ke liye function
 */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('hidden', window.scrollY <= 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/**
 * Saare common features ko chalu karne wala function
 */
function initializeCommonFeatures() {
    initTheme(); 
    initBackToTop();
    AOS.init({ once: true, duration: 800, offset: 50 });
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// Page load hote hi common features ko chalu karo
document.addEventListener('DOMContentLoaded', initializeCommonFeatures);