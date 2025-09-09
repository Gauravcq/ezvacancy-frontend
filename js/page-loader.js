// js/page-loader.js (NEW & MORE POWERFUL VERSION)

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) return;

    // Pata lagao ki hum kis page par hain
    const currentPage = window.location.pathname.split('/').pop();
    
    let apiUrl = '';
    let pageTitle = '';

    // Check karo ki yeh category.html page hai ya koi aur
    if (currentPage === 'category.html') {
        const params = new URLSearchParams(window.location.search);
        const categorySlug = params.get('type'); // URL se 'type' nikalo (e.g., 'ssc')
        
        if (categorySlug) {
            apiUrl = `${BACKEND_URL}/api/category/${categorySlug}`;
            // Title ko sundar banao (e.g., 'ssc' -> 'SSC Posts')
            pageTitle = `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Posts`;
        }
    } else {
        // Puraana logic, baaki pages ke liye
        let postType = '';
        switch (currentPage) {
            case 'notifications.html': postType = 'notification'; pageTitle = 'All Notifications'; break;
            case 'admit-cards.html': postType = 'admit-card'; pageTitle = 'All Admit Cards'; break;
            case 'results.html': postType = 'result'; pageTitle = 'All Results'; break;
            case 'answer-keys.html': postType = 'answer-key'; pageTitle = 'All Answer Keys'; break;
            case 'syllabus.html': postType = 'syllabus'; pageTitle = 'All Syllabus'; break;
        }
        if (postType) {
            apiUrl = `${BACKEND_URL}/api/posts/type/${postType}`;
        }
    }

    // Update the page title
    const titleElement = document.getElementById('category-title') || document.querySelector('h1');
    if (titleElement && pageTitle) {
        titleElement.textContent = pageTitle;
        document.title = `${pageTitle} - EZGOVTJOB`;
    }

    if (!apiUrl) {
        postsContainer.innerHTML = '<p class="text-red-500">Could not determine the category.</p>';
        return;
    }

    postsContainer.innerHTML = '<p class="text-slate-500">Loading posts...</p>';

    // Ab API se data fetch karo
    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = '<p class="text-slate-500">No posts found for this category.</p>';
                return;
            }
            postsContainer.innerHTML = posts.map(createPostCard).join('');
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p class="text-red-500">Failed to load posts.</p>';
        });
});


// Helper function to create a single post card
function createPostCard(post) {
    const postDate = new Date(post.postDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    return `
        <a href="post.html?slug=${post.slug}" class="card-hover-effect block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 class="font-bold text-lg mb-2">${post.title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                Posted on: ${postDate}
            </p>
            <span class="font-semibold text-blue-600 mt-4 inline-block">Read More →</span>
        </a>
    `;
}