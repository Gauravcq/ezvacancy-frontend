// js/page-loader.js (FINAL CORRECTED VERSION - Handles ALL pages)

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const postsContainer = document.getElementById('posts-container');
    const filterBar = document.getElementById('filter-bar');
    const titleElement = document.getElementById('category-title') || document.querySelector('h1');
    
    if (!postsContainer) return;

    const currentPage = window.location.pathname.split('/').pop();
    
    // --- Page ke hisaab se logic chalao ---
    
    if (currentPage === 'category.html') {
        // YEH 'category.html' KA LOGIC HAI
        const params = new URLSearchParams(window.location.search);
        const categorySlug = params.get('type');
        
        if (categorySlug) {
            const pageTitle = `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Posts`;
            updateTitle(pageTitle);
            loadFiltersAndPosts(categorySlug);
        } else {
            postsContainer.innerHTML = '<p>Category not specified.</p>';
        }

    } else {
        // YEH BAAKI SAARE PAGES KA PURAANA LOGIC HAI (notifications.html, etc.)
        if (filterBar) filterBar.style.display = 'none'; // Hide filter bar on other pages

        let postType = '';
        let pageTitle = '';

        switch (currentPage) {
            case 'notifications.html': postType = 'notification'; pageTitle = 'All Notifications'; break;
            case 'admit-cards.html': postType = 'admit-card'; pageTitle = 'All Admit Cards'; break;
            case 'results.html': postType = 'result'; pageTitle = 'All Results'; break;
            case 'answer-keys.html': postType = 'answer-key'; pageTitle = 'All Answer Keys'; break;
            case 'syllabus.html': postType = 'syllabus'; pageTitle = 'All Syllabus'; break;
        }

        if (postType) {
            updateTitle(pageTitle);
            loadPosts(`/api/posts/type/${postType}`);
        }
    }

    
    // --- Helper Functions ---

    function updateTitle(title) {
        if (titleElement && title) {
            titleElement.textContent = title;
            document.title = `${title} - EZGOVTJOB`;
        }
    }

    async function loadFiltersAndPosts(catSlug) {
        loadFilters(catSlug);
        loadPosts(`/api/category/${catSlug}`);
    }

    async function loadFilters(catSlug) {
        if (!filterBar) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/subcategories/${catSlug}`);
            const subCategories = await res.json();
            
            filterBar.innerHTML = '';
            
            const allButton = createFilterButton('All', catSlug, true);
            allButton.onclick = () => { setActiveButton(allButton); loadPosts(`/api/category/${catSlug}`); };
            filterBar.appendChild(allButton);

            subCategories.forEach(sub => {
                const subCatButton = createFilterButton(sub.name, sub.slug);
                subCatButton.onclick = () => { setActiveButton(subCatButton); loadPosts(`/api/posts/subcategory/${sub.slug}`); };
                filterBar.appendChild(subCatButton);
            });
        } catch (error) { console.error('Failed to load filters:', error); filterBar.innerHTML = ''; }
    }

    async function loadPosts(apiEndpoint) {
        postsContainer.innerHTML = '<p class="col-span-full text-center text-slate-500">Loading posts...</p>';
        try {
            const res = await fetch(`${BACKEND_URL}${apiEndpoint}`);
            const posts = await res.json();
            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = '<p class="col-span-full text-center text-slate-500">No posts found.</p>';
                return;
            }
            postsContainer.innerHTML = posts.map(createPostCard).join('');
        } catch (error) { console.error('Failed to load posts:', error); postsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Error loading posts.</p>'; }
    }

    function createFilterButton(name, slug, isActive = false) {
        const button = document.createElement('button');
        button.textContent = name;
        button.dataset.slug = slug;
        button.className = `px-3 py-1 text-sm font-medium rounded-full transition-colors ${ isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600' }`;
        return button;
    }

    function setActiveButton(activeBtn) {
        filterBar.querySelectorAll('button').forEach(btn => {
            btn.className = btn.className.replace('bg-blue-600 text-white', 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600');
        });
        activeBtn.className = activeBtn.className.replace('bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600', 'bg-blue-600 text-white');
    }
});

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