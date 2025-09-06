// js/app.js (Pura Naya aur Final Code)

// =================================================================
// CONFIGURATION
// =================================================================

// Aapke live backend API ka address (ise kabhi na badlein)
const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';


// =================================================================
// HELPER FUNCTIONS (Kaam aasan karne ke liye)
// =================================================================

/**
 * Yeh function ek post (job, admit card, ya result) ke liye HTML list item banata hai.
 * @param {object} item - Job, Admit Card, ya Result ka data object
 * @param {string} type - 'notification', 'admit-card', ya 'result'
 * @returns {HTMLElement} - Ek 'a' tag wala HTML element
 */
function createListItem(item, type) {
    const element = document.createElement('a');
    let url = '#'; // Default URL agar koi link na ho

    // Type ke hisaab se sahi link set karo
    if (type === 'admit-card' && item.downloadUrl) url = item.downloadUrl;
    if (type === 'result' && item.resultUrl) url = item.resultUrl;
    if (type === 'notification' && (item.noticeUrl || item.applyUrl)) url = item.noticeUrl || item.applyUrl;

    element.href = url;
    element.target = "_blank"; // Link hamesha naye tab mein khulega
    element.className = "block p-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50";
    
    // Title ke liye check karo, kyunki Job mein 'title' hota hai aur baaki mein 'examName'
    const title = item.title || item.examName;
    const organization = item.organization || '';

    element.innerHTML = `
        <p class="font-semibold text-slate-800 dark:text-slate-100">${title}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">${organization}</p>
    `;
    return element;
}

// =================================================================
// DATA FETCHING FUNCTIONS (Backend se data laane waale)
// =================================================================

/**
 * Yeh general function backend se data laakar ek specific container mein bharta hai.
 * @param {string} endpoint - API ka raasta, jaise 'jobs' ya 'admit-cards'
 * @param {string} containerId - HTML element ki ID jahan data dikhana hai
 * @param {string} itemType - 'notification', 'admit-card', ya 'result'
 * @param {number} limit - Kitne items dikhane hain
 */
async function populateSection(endpoint, containerId, itemType, limit = 5) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error: Container with ID '${containerId}' not found.`);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}?limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}. Status: ${response.status}`);
        }
        const { data } = await response.json();
        
        container.innerHTML = ''; // Loading... message hatao

        if (data.length === 0) {
            container.innerHTML = `<p class="p-4 text-center text-slate-500">No new updates found.</p>`;
            return;
        }
        data.forEach(item => {
            const listItem = createListItem(item, itemType);
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error fetching data for ${containerId}:`, error);
        container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load data.</p>`;
    }
}

/**
 * Yeh function category waale cards ke liye data laata hai.
 * Yeh sirf jobs se data laayega jo specific category ke honge.
 * @param {string} category - Jaise 'SSC', 'Banking', 'Railway'
 * @param {string} containerId - HTML element ki ID
 */
async function populateCategoryCard(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error: Container with ID '${containerId}' not found.`);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs?category=${category}&limit=2`);
        if (!response.ok) throw new Error(`Failed to fetch for category ${category}`);
        const { data } = await response.json();

        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `<p class="p-4 text-center text-slate-500">No new posts in this category.</p>`;
            return;
        }
        data.forEach(item => {
            const listItem = createListItem(item, 'notification');
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error fetching for category container ${containerId}:`, error);
        container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load posts.</p>`;
    }
}

// =================================================================
// UI FUNCTIONS (Website ke features chalu karne waale)
// =================================================================

/**
 * Dark mode toggle button ke liye function
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    if (!themeToggle || !lightIcon || !darkIcon) return;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// =================================================================
// INITIALIZATION (Jab page load ho, toh sab kuch shuru karo)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Top "Latest Updates" section ke liye data load karo
    populateSection('jobs', 'notifications-list', 'notification');
    populateSection('admit-cards', 'admit-cards-list', 'admit-card');
    populateSection('results', 'results-list', 'result');

    // "Browse by Category" section ke liye data load karo
    populateCategoryCard('SSC', 'ssc-posts-list');
    populateCategoryCard('Banking', 'bank-posts-list');
    populateCategoryCard('Railway', 'railway-posts-list');

    // Website ke baaki features chalu karo
    initTheme();
    AOS.init({ once: true, duration: 600 });
    
    // Footer mein saal (year) ko automatic update karo
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});