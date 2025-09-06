// js/app.js (Pura Naya Code)

// Aapke live backend API ka address
const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

// === HELPER FUNCTIONS (Kaam aasan karne ke liye) ===

// General function to create any list item
function createListItem(item, type) {
    const element = document.createElement('a');
    let url = '#';
    if (type === 'admit-card') url = item.downloadUrl;
    if (type === 'result') url = item.resultUrl;
    if (type === 'notification') url = item.noticeUrl || item.applyUrl;

    element.href = url;
    element.target = "_blank"; // Hamesha naye tab mein kholo
    element.className = "block p-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50";
    
    element.innerHTML = `
        <p class="font-semibold text-slate-800 dark:text-slate-100">${item.title || item.examName}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">${item.organization || ''}</p>
    `;
    return element;
}

// General function to fetch data and fill a container
async function populateSection(endpoint, containerId, itemType, limit = 5) {
    const container = document.getElementById(containerId);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}?limit=${limit}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const { data } = await response.json();
        
        container.innerHTML = ''; // Loading message hatao

        if (data.length === 0) {
            container.innerHTML = `<p class="p-4 text-center text-slate-500">No new updates.</p>`;
            return;
        }
        data.forEach(item => {
            const listItem = createListItem(item, itemType);
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error fetching for ${containerId}:`, error);
        container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load data.</p>`;
    }
}

// Function to fetch data for category cards
async function populateCategoryCard(category, containerId) {
    const container = document.getElementById(containerId);
    try {
        // Hum sirf jobs se data la rahe hain. Aap chahein toh admit cards/results bhi add kar sakte hain.
        const response = await fetch(`${API_BASE_URL}/api/jobs?category=${category}&limit=2`);
        if (!response.ok) throw new Error(`Failed for ${category}`);
        const { data } = await response.json();

        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `<p class="p-4 text-center text-slate-500">No new posts.</p>`;
            return;
        }
        data.forEach(item => {
            const listItem = createListItem(item, 'notification');
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error fetching for ${containerId}:`, error);
        container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load posts.</p>`;
    }
}


// === DARK MODE TOGGLE (Aapka purana code) ===
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

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

    // Page load par theme set karo
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// === INITIALIZE EVERYTHING (Jab page load ho) ===
document.addEventListener('DOMContentLoaded', () => {
    // Top section ke liye data load karo
    populateSection('jobs', 'notifications-list', 'notification');
    populateSection('admit-cards', 'admit-cards-list', 'admit-card');
    populateSection('results', 'results-list', 'result');

    // Category section ke liye data load karo
    populateCategoryCard('SSC', 'ssc-posts-list');
    populateCategoryCard('Banking', 'bank-posts-list');
    populateCategoryCard('Railway', 'railway-posts-list');

    // Dark mode aur doosre features chalu karo
    initTheme();
    AOS.init({ once: true, duration: 600 });
    
    // Saal (Year) ko footer mein update karo
    document.getElementById('year').textContent = new Date().getFullYear();
});