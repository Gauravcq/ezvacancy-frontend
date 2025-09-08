// js/data-loader.js

document.addEventListener('DOMContentLoaded', () => {
    // APNA LIVE RENDER URL YAHAN DAALEIN
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';

    const swiperWrapper = document.getElementById('updates-swiper-wrapper');

    if (!swiperWrapper) {
        console.error('Swiper wrapper element not found!');
        return;
    }

    // Helper function to create a single swiper slide
    function createUpdateCard(post) {
        // Post type ke hisaab se color aur icon set karein
        let bgColor = 'bg-blue-100 dark:bg-blue-900/50';
        let textColor = 'text-blue-600 dark:text-blue-300';
        let tagText = 'Notification';
        let tagBg = 'bg-blue-500/10 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';

        if (post.postType === 'admit-card') {
            bgColor = 'bg-emerald-100 dark:bg-emerald-900/50';
            textColor = 'text-emerald-600 dark:text-emerald-300';
            tagText = 'Admit Card';
            tagBg = 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
        } else if (post.postType === 'result') {
            bgColor = 'bg-amber-100 dark:bg-amber-900/50';
            textColor = 'text-amber-600 dark:text-amber-300';
            tagText = 'Result';
            tagBg = 'bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
        }

        const postDate = new Date(post.postDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        return `
            <div class="swiper-slide">
                <a href="post.html?slug=${post.slug}" class="card-hover-effect flex flex-col bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="${bgColor} ${textColor} h-12 w-12 rounded-full grid place-items-center flex-shrink-0">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-xs font-medium px-2 py-1 rounded-full ${tagBg}">${tagText}</span>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${postDate}</p>
                        </div>
                    </div>
                    <h3 class="font-bold text-lg flex-grow">${post.title}</h3>
                    <span class="font-semibold text-blue-600 mt-4 inline-block">View Details →</span>
                </a>
            </div>
        `;
    }

    // API se saare sections ka data fetch karein
    fetch(`${BACKEND_URL}/api/homepage-sections`)
        .then(response => response.json())
        .then(data => {
            // Teeno arrays (ssc, railway, banking) ko ek hi array me mila dein
            const allPosts = [...(data.ssc || []), ...(data.railway || []), ...(data.banking || [])];
            
            // Posts ko date ke hisaab se sort karein, sabse naya post pehle
            allPosts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

            if (allPosts.length === 0) {
                swiperWrapper.innerHTML = '<p class="text-center">No recent updates found.</p>';
                return;
            }

            // Har post ke liye ek slide banakar wrapper me daalein
            swiperWrapper.innerHTML = allPosts.map(post => createUpdateCard(post)).join('');
            
            // IMPORTANT: Data load hone ke baad Swiper ko initialize karein
            new Swiper('#updates-swiper', {
                loop: false,
                slidesPerView: 1,
                spaceBetween: 30,
                pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
                },
                breakpoints: {
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }
            });

        })
        .catch(error => {
            console.error('Error fetching latest updates:', error);
            swiperWrapper.innerHTML = '<p class="text-center text-red-500">Failed to load latest updates. Please try again later.</p>';
        });
});