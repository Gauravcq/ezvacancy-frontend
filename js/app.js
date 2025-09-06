// js/app.js (Corrected Code)

document.addEventListener('DOMContentLoaded', () => {

    // Your live backend API address
    const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';
    const POST_LIMIT = 15; // How many items to show initially in each list

    // === HELPER FUNCTIONS ===

    // Formats date string into a readable format like "15 Aug 2024"
    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Using dayjs library which is already included in your HTML
        return dayjs(dateString).format('DD MMM YYYY');
    };

    // Creates a single list item (<li>) to be inserted into the lists
    function createListItem(item) {
        // Find the correct URL from the item's data
        const url = item.link || item.downloadUrl || item.resultUrl || item.noticeUrl || item.applyUrl || '#';

        const li = document.createElement('li');
        li.className = "relative"; // For potential future styling like badges

        li.innerHTML = `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                <p class="font-semibold text-sm leading-tight text-slate-800 dark:text-slate-100">${item.title || item.examName}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 mt-1.5">
                    <span>${formatDate(item.date)}</span>
                    ${item.isNew ? '<span class="px-1.5 py-0.5 bg-accent/10 text-accent rounded-full font-semibold">New</span>' : ''}
                </div>
            </a>
        `;
        return li;
    }

    // Fetches data from a specific API endpoint and populates the correct HTML list
    async function populateSection(endpoint, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Error: Element with ID '${containerId}' not found.`);
            return;
        }

        container.innerHTML = `<li class="p-4 text-center text-slate-500">Loading...</li>`;

        try {
            const response = await fetch(`${API_BASE_URL}/api/${endpoint}?limit=${POST_LIMIT}`);
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
            
            // The backend might wrap data differently, so we check for both `posts` and `data` properties.
            const responseData = await response.json();
            const items = responseData.posts || responseData.data || [];

            container.innerHTML = ''; // Clear "Loading..." message

            if (items.length === 0) {
                container.innerHTML = `<li class="p-4 text-center text-slate-500 text-sm">No new updates found.</li>`;
                return;
            }
            items.forEach(item => {
                const listItem = createListItem(item);
                container.appendChild(listItem);
            });
        } catch (error) {
            console.error(`Error fetching for ${containerId}:`, error);
            container.innerHTML = `<li class="p-4 text-center text-red-500">Could not load data.</li>`;
        }
    }


    // === DARK MODE TOGGLE ===
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        // On page load, set the theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }

        // Add click event listener to the toggle button
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // === INITIALIZE EVERYTHING ON PAGE LOAD ===

    // Load data for all four main sections
    // Note: The endpoint name ('jobs', 'admit-cards') must match your backend API routes.
    // The containerId ('list-latest', 'list-admit') must match your HTML IDs.
    populateSection('posts?type=notification', 'list-latest');
    populateSection('posts?type=admit', 'list-admit');
    populateSection('posts?type=result', 'list-results');
    populateSection('posts?type=answer', 'list-answer');

    // Initialize features
    initTheme();
    AOS.init({ once: true, duration: 600 });
    
    // Update the year in the footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});