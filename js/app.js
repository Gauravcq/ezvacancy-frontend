// js/app.js (The Absolute Final, Bug-Free, and Professional Version)

const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

// =================================================================
// HELPER FUNCTIONS (Kaam aasan karne ke liye)
// =================================================================

/**
 * Yeh function ek post (job, admit card, etc.) ke liye HTML card banata hai.
 * @param {object} item - Backend se aaya hua data object
 * @returns {HTMLElement} - Ek 'div' element jo Swiper slide hai
 */
function createListItem(item) {
    const element = document.createElement('div');
    element.className = 'swiper-slide bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col p-4';
    
    // Slug se job detail page ka link banayein
    const detailUrl = item.type === 'notification' ? `post.html?slug=${item.slug}` : (item.downloadUrl || item.resultUrl || '#');

    const title = item.title || item.examName;
    const organization = item.organization || '';
    
    let tag = '';
    // Naya, smart tareeka: Item ke 'type' sticker se tag pehchaano
    switch (item.type) {
        case 'notification':
            tag = '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Notification</span>';
            break;
        case 'admit-card':
            tag = '<span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300">Admit Card</span>';
            break;
        case 'result':
            tag = '<span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-emerald-900 dark:text-emerald-300">Result</span>';
            break;
        case 'answer-key':
            tag = '<span class="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-rose-900 dark:text-rose-300">Answer Key</span>';
            break;
    }

    element.innerHTML = `
        <div class="flex-grow">
            <div class="mb-2">${tag}</div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100">${title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${organization}</p>
        </div>
        <a href="${detailUrl}" ${ (item.type !== 'notification') ? 'target="_blank"' : '' } class="mt-4 inline-block font-semibold text-blue-600 hover:underline">View Details →</a>
    `;
    return element;
}

/**
 * Yeh function data load hone se pehle dikhne wale placeholders banata hai.
 * @returns {string} - Skeleton loaders ka HTML
 */
function createSkeletonLoader() {
    let skeletonHTML = '';
    for (let i = 0; i < 3; i++) {
        skeletonHTML += `
            <div class="swiper-slide bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 animate-pulse">
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3"></div>
                <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-4"></div>
            </div>
        `;
    }
    return skeletonHTML;
}

// =================================================================
// DATA FETCHING & UI FUNCTIONS
// =================================================================

/**
 * Yeh main function hai jo "Latest Updates" section ko data se bharta hai.
 */
async function initUpdatesSwiper() {
    const wrapper = document.getElementById('updates-swiper-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = createSkeletonLoader();

    try {
        const [jobsRes, admitCardsRes, resultsRes, answerKeysRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/jobs?limit=5`),
            fetch(`${API_BASE_URL}/api/admit-cards?limit=5`),
            fetch(`${API_BASE_URL}/api/results?limit=5`),
            fetch(`${API_BASE_URL}/api/answer-keys?limit=5`)
        ]);

        if (!jobsRes.ok || !admitCardsRes.ok || !resultsRes.ok || !answerKeysRes.ok) {
            throw new Error('One or more API requests failed. Please check backend logs.');
        }

        // Data nikalo aur har ek ko 'type' ka sticker lagao
        let { data: jobs } = await jobsRes.json();
        jobs = jobs.map(item => ({ ...item, type: 'notification' }));
        
        let { data: admitCards } = await admitCardsRes.json();
        admitCards = admitCards.map(item => ({ ...item, type: 'admit-card' }));
        
        let { data: results } = await resultsRes.json();
        results = results.map(item => ({ ...item, type: 'result' }));
        
        let { data: answerKeys } = await answerKeysRes.json();
        answerKeys = answerKeys.map(item => ({ ...item, type: 'answer-key' }));
        
        const allUpdates = [...jobs, ...admitCards, ...results, ...answerKeys];
        allUpdates.sort((a, b) => new Date(b.postUpdateDate || b.postDate) - new Date(a.postUpdateDate || a.postDate));

        wrapper.innerHTML = '';
        if (allUpdates.length === 0) { 
            wrapper.innerHTML = `<p class="p-4 text-center text-slate-500">No new updates found.</p>`; 
            return; 
        }
        
        allUpdates.forEach(item => wrapper.appendChild(createListItem(item)));

        new Swiper('#updates-swiper', { 
            slidesPerView: 1, 
            spaceBetween: 16, 
            pagination: { el: '.swiper-pagination', clickable: true }, 
            breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 32 } }, 
            autoplay: { delay: 4000, disableOnInteraction: false } 
        });
    } catch (error) {
        console.error("Error initializing updates swiper:", error);
        wrapper.innerHTML = `<p class="p-4 text-center text-red-500">Could not load updates. Please check the backend.</p>`;
    }
}

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

// =================================================================
// INITIALIZATION (Jab page load ho, toh sab kuch shuru karo)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Sirf homepage par chalne wale functions
    if (document.getElementById('updates-swiper-wrapper')) {
        initUpdatesSwiper();
    }
    
    // Har page par chalne wale functions
    initTheme(); 
    initBackToTop();
    AOS.init({ once: true, duration: 800, offset: 50 });
    
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});