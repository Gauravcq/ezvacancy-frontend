// js/page-loader.js (NEW & DYNAMIC VERSION)

document.addEventListener('DOMContentLoaded', () => {
    // APNA LIVE RENDER URL YAHAN DAALEIN
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const postsContainer = document.getElementById('posts-container');
    const pageTitleElement = document.querySelector('h1');

    if (!postsContainer || !pageTitleElement) {
        console.error('Required elements (posts-container or h1) not found.');
        return;
    }

    // Pata lagao ki hum kis page par hain (e.g., notifications.html)
    const currentPage = window.location.pathname.split('/').pop();
    let postType = '';

    // Page ke hisaab se postType set karo
    switch (currentPage) {
        case 'notifications.html':
            postType = 'notification';
            break;
        case 'admit-cards.html':
            postType = 'admit-card';
            break;
        case 'results.html':
            postType = 'result';
            break;
        case 'answer-keys.html':
            postType = 'answer-key';
            break;
        case 'syllabus.html':
            postType = 'syllabus';
            break;
        default:
            // Agar koi page match nahi hota, to kuch mat karo
            return; 
    }

    // Loading indicator
    postsContainer.innerHTML = '<p class="text-slate-500">Loading posts...</p>';

    // --- Helper function to create a single post card ---
    function createPostCard(post) {
        const postDate = new Date(post.postDate).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        return `
            <a href="post.html?slug=${post.slug}" class="card-hover-effect block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <div class="flex-grow">
                    <h3 class="font-bold text-lg mb-2">${post.title}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Category: ${post.SubCategory?.Category?.name || 'N/A'} > ${post.SubCategory?.name || 'N/A'}
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Posted on: ${postDate}
                    </p>
                </div>
                <span class="font-semibold text-blue-600 mt-4 inline-block">Read More →</span>
            </a>
        `;
    }
    
    // BACKEND API BANANA BAAKI HAI! Yeh API abhi chalega nahi.
    // Hum ek aisa API banayenge jo postType se filter karega.
    fetch(`${BACKEND_URL}/api/posts/type/${postType}`)
        .then(response => response.json())
        .then(posts => {
            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = '<p class="text-slate-500">No posts found for this category.</p>';
                return;
            }
            // Saare cards ko container me daalo
            postsContainer.innerHTML = posts.map(createPostCard).join('');
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p class="text-red-500">Failed to load posts. Please try again.</p>';
        });
});