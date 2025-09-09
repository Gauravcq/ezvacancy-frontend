// js/page-loader.js (FINAL VERSION with Dropdown Filter)

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const postsContainer = document.getElementById('posts-container');
    const filterSelect = document.getElementById('subcategory-select');
    
    if (!postsContainer) return;

    const currentPage = window.location.pathname.split('/').pop();
    
    // Page ke hisaab se logic chalao
    if (currentPage === 'category.html') {
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
        if (filterSelect) document.getElementById('filter-container').style.display = 'none';
        let postType = '', pageTitle = '';
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
        const titleElement = document.getElementById('category-title') || document.querySelector('h1');
        if (titleElement && title) {
            titleElement.textContent = title;
            document.title = `${title} - EZGOVTJOB`;
        }
    }

    async function loadFiltersAndPosts(catSlug) {
        loadFilters(catSlug);
        loadPosts(`/api/category/${catSlug}`); // Initially load all posts
    }

    async function loadFilters(catSlug) {
        if (!filterSelect) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/subcategories/${catSlug}`);
            const subCategories = await res.json();
            
            filterSelect.innerHTML = `<option value="${catSlug}">All ${catSlug.toUpperCase()}</option>`;
            
            subCategories.forEach(sub => {
                filterSelect.innerHTML += `<option value="${sub.slug}">${sub.name}</option>`;
            });

            // Add event listener to the dropdown
            filterSelect.addEventListener('change', (event) => {
                const selectedSlug = event.target.value;
                const isMainCategory = selectedSlug === catSlug;
                const apiEndpoint = isMainCategory ? `/api/category/${selectedSlug}` : `/api/posts/subcategory/${selectedSlug}`;
                loadPosts(apiEndpoint);
            });

        } catch (error) { console.error('Failed to load filters:', error); }
    }

    async function loadPosts(apiEndpoint) { /* ... iska code wahi rahega, koi change nahi ... */ }

    function createPostCard(post) { /* ... iska code wahi rahega, koi change nahi ... */ }
});