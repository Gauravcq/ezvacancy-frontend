// FILE: ezvacancy-frontend/js/app.js (Simplified Version)

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('updates-swiper-wrapper')) {
        initUpdatesSwiper();
    }
});

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

async function initUpdatesSwiper() {
    const wrapper = document.getElementById('updates-swiper-wrapper');
    if (!wrapper) return;
    
    wrapper.innerHTML = createSkeletonLoader();

    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';

    try {
        const response = await fetch(`${BACKEND_URL}/api/homepage-sections`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        
        const allPosts = [...(data.ssc || []), ...(data.railway || []), ...(data.banking || [])];
        allPosts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

        wrapper.innerHTML = '';

        if (allPosts.length === 0) {
            wrapper.innerHTML = `<p class="p-4 text-center text-slate-500">No new updates found.</p>`;
            return;
        }

        // The data is already in the correct format, no parsing needed here!
        allPosts.forEach(post => {
            wrapper.innerHTML += createUpdateCard(post);
        });

        new Swiper('#updates-swiper', { 
            slidesPerView: 1, 
            spaceBetween: 16, 
            pagination: { el: '.swiper-pagination', clickable: true }, 
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3, spaceBetween: 32 } }, 
            autoplay: { delay: 4000, disableOnInteraction: false } 
        });

    } catch (error) {
        console.error("Error initializing updates swiper:", error);
        wrapper.innerHTML = `<p class="p-4 text-center text-red-500">Could not load updates. Please check the backend.</p>`;
    }
}

function createUpdateCard(post) {
    let tagBg = 'bg-blue-500/10 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
    let tagText = 'Notification';

    switch (post.postType) {
        case 'admit-card':
            tagText = 'Admit Card';
            tagBg = 'bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
            break;
        case 'result':
            tagText = 'Result';
            tagBg = 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
            break;
        case 'answer-key':
            tagText = 'Answer Key';
            tagBg = 'bg-rose-500/10 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
            break;
    }

    const postDate = new Date(post.postDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return `
        <div class="swiper-slide">
            <a href="post.html?slug=${post.slug}" class="card-hover-effect flex flex-col bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full">
                <div class="flex items-start justify-between mb-4">
                    <span class="text-xs font-medium px-2 py-1 rounded-full ${tagBg}">${tagText}</span>
                    <p class="text-xs text-slate-500 dark:text-slate-400">${postDate}</p>
                </div>
                <h3 class="font-bold text-lg flex-grow">${post.title}</h3>
                <span class="font-semibold text-blue-600 mt-4 inline-block">View Details →</span>
            </a>
        </div>
    `;
}