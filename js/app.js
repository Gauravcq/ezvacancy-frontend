// js/app.js (Pura Naya aur Final Code)

// =================================================================
// CONFIGURATION
// =================================================================
const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

// =================================================================
// HELPER FUNCTIONS
// =================================================================

function createListItem(item) {
    const element = document.createElement('a');
    let url = '#';
    if (item.downloadUrl) url = item.downloadUrl;
    if (item.resultUrl) url = item.resultUrl;
    if (item.noticeUrl || item.applyUrl) url = item.noticeUrl || item.applyUrl;

    element.href = url;
    element.target = "_blank";
    element.className = "block p-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50";
    
    const title = item.title || item.examName;
    const organization = item.organization || '';

    element.innerHTML = `
        <p class="font-semibold text-slate-800 dark:text-slate-100">${title}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">${organization}</p>
    `;
    return element;
}

// =================================================================
// DATA FETCHING FUNCTIONS
// =================================================================

async function populateSection(endpoint, containerId, limit = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}?limit=${limit}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const { data } = await response.json();
        
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `<p class="p-4 text-center text-slate-500">No new updates found.</p>`;
            return;
        }
        data.forEach(item => {
            const listItem = createListItem(item);
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error for ${containerId}:`, error);
        container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load data.</p>`;
    }
}

async function populateCategoryCard(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs?category=${category}&limit=2`);
        if (!response.ok) throw new Error(`Failed for ${category}`);
        const { data } = await response.json();

        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `<p class="p-4 text-center text-slate-500">No new posts in this category.</p>`;
            return;
        }
        data.forEach(item => {
            const listItem = createListItem(item);
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error for ${containerId}:`, error);
        container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load posts.</p>`;
    }
}

// =================================================================
// UI FUNCTIONS
// =================================================================

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

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// =================================================================
// INITIALIZATION
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    populateSection('jobs', 'notifications-list');
    populateSection('admit-cards', 'admit-cards-list');
    populateSection('results', 'results-list');

    populateCategoryCard('SSC', 'ssc-posts-list');
    populateCategoryCard('Banking', 'bank-posts-list');
    populateCategoryCard('Railway', 'railway-posts-list');

    initTheme();
    AOS.init({ once: true, duration: 600 });
    
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});