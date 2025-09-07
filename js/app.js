// js/app.js (Final Creative & Bug-Free Version)

const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

// === HELPER FUNCTIONS ===

function createListItem(item, type = 'card') {
    const element = document.createElement('div');
    // Swiper.js ke liye 'swiper-slide' class zaroori hai
    element.className = 'swiper-slide bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col p-4';
    
    let url = '#';
    if (item.downloadUrl) url = item.downloadUrl;
    if (item.resultUrl) url = item.resultUrl;
    if (item.noticeUrl || item.applyUrl) url = item.noticeUrl || item.applyUrl;

    const title = item.title || item.examName;
    const organization = item.organization || '';
    
    let tag = '';
    if(item.title) tag = '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Notification</span>';
    if(item.downloadUrl) tag = '<span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300">Admit Card</span>';
    if(item.resultUrl) tag = '<span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-emerald-900 dark:text-emerald-300">Result</span>';

    element.innerHTML = `
        <div class="flex-grow">
            <div class="mb-2">${tag}</div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100">${title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${organization}</p>
        </div>
        <a href="${url}" target="_blank" class="mt-4 inline-block font-semibold text-blue-600 hover:underline">View Details →</a>
    `;
    return element;
}

function createSkeletonLoader() {
    let skeletonHTML = '';
    // Swiper ke liye 3 skeleton slides banayenge
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

// === DATA FETCHING & UI FUNCTIONS ===

async function initUpdatesSwiper() {
    const wrapper = document.getElementById('updates-swiper-wrapper');
    if (!wrapper) return;
    
    wrapper.innerHTML = createSkeletonLoader(); // Loading skeleton dikhao

    try {
        // Ek saath jobs, admit cards, aur results ka data mangwao
        const [jobsRes, admitCardsRes, resultsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/jobs?limit=5`),
            fetch(`${API_BASE_URL}/api/admit-cards?limit=5`),
            fetch(`${API_BASE_URL}/api/results?limit=5`)
        ]);

        if (!jobsRes.ok || !admitCardsRes.ok || !resultsRes.ok) {
            throw new Error('One or more API requests failed');
        }

        const { data: jobs } = await jobsRes.json();
        const { data: admitCards } = await admitCardsRes.json();
        const { data: results } = await resultsRes.json();
        
        const allUpdates = [...jobs, ...admitCards, ...results];
        
        // Sabko date ke hisaab se sort karo, taaki sabse naya update pehle aaye
        allUpdates.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

        wrapper.innerHTML = ''; // Skeletons hatao

        if (allUpdates.length === 0) {
            wrapper.innerHTML = `<p class="p-4 text-center text-slate-500">No new updates found.</p>`;
            return;
        }
        allUpdates.forEach(item => {
            const slide = createListItem(item);
            wrapper.appendChild(slide);
        });

        // Ab jab saare slides HTML mein aa gaye hain, tab Swiper ko chalu karo
        new Swiper('#updates-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 32 },
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });

    } catch (error) {
        console.error("Error initializing updates swiper:", error);
        wrapper.innerHTML = `<p class="p-4 text-center text-red-500">Could not load updates. Please try again later.</p>`;
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    if (!themeToggle || !lightIcon || !darkIcon) return;

    const applyTheme = (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        lightIcon.classList.toggle('hidden', theme === 'dark');
        darkIcon.classList.toggle('hidden', theme !== 'dark');
    };
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('hidden', window.scrollY <= 300);
    });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', () => {
    initUpdatesSwiper();
    initTheme();
    initBackToTop();
    AOS.init({ once: true, duration: 800, offset: 50 });
    
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});