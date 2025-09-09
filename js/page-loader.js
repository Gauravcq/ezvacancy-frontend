// js/page-loader.js (FINAL VERSION with Sub-category Filtering)

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const postsContainer = document.getElementById('posts-container');
    const filterBar = document.getElementById('filter-bar');
    const titleElement = document.getElementById('category-title') || document.querySelector('h1');
    
    if (!postsContainer) return;

    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get('type'); // URL se main category (e.g., 'ssc')
    
    if (!categorySlug) {
        postsContainer.innerHTML = '<p>Category not specified.</p>';
        return;
    }

    // Pehle filter buttons load karo
    loadFilters(categorySlug);

    // Fir saare posts load karo (by default)
    loadPosts(`/api/category/${categorySlug}`);
    
    // --- Helper Functions ---

    // Function to load and create filter buttons
    async function loadFilters(catSlug) {
        if (!filterBar) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/subcategories/${catSlug}`);
            const subCategories = await res.json();
            
            filterBar.innerHTML = ''; // Clear skeleton
            
            // "All" button
            const allButton = createFilterButton('All', catSlug, true); // Active by default
            allButton.onclick = () => {
                setActiveButton(allButton);
                loadPosts(`/api/category/${catSlug}`);
            };
            filterBar.appendChild(allButton);

            // Har sub-category ke liye button
            subCategories.forEach(sub => {
                const subCatButton = createFilterButton(sub.name, sub.slug);
                subCatButton.onclick = () => {
                    setActiveButton(subCatButton);
                    loadPosts(`/api/posts/subcategory/${sub.slug}`);
                };
                filterBar.appendChild(subCatButton);
            });
        } catch (error) {
            console.error('Failed to load filters:', error);
            filterBar.innerHTML = ''; // Hide on error
        }
    }

    // Main function to load posts
    async function loadPosts(apiEndpoint) {
        postsContainer.innerHTML = '<p class="col-span-full text-center">Loading posts...</p>';
        try {
            const res = await fetch(`${BACKEND_URL}${apiEndpoint}`);
            const posts = await res.json();

            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = '<p class="col-span-full text-center">No posts found.</p>';
                return;
            }
            postsContainer.innerHTML = posts.map(createPostCard).join('');
        } catch (error) {
            console.error('Failed to load posts:', error);
            postsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Error loading posts.</p>';
        }
    }

    function createFilterButton(name, slug, isActive = false) {
        const button = document.createElement('button');
        button.textContent = name;
        button.dataset.slug = slug;
        button.className = `px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            isActive 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
        }`;
        return button;
    }

    function setActiveButton(activeBtn) {
        // Remove active state from all buttons
        filterBar.querySelectorAll('button').forEach(btn => {
            btn.className = btn.className.replace('bg-blue-600 text-white', 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600');
        });
        // Add active state to the clicked button
        activeBtn.className = activeBtn.className.replace('bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600', 'bg-blue-600 text-white');
    }

    // Puraana logic (baaki pages ke liye)
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'category.html') {
        if (filterBar) filterBar.style.display = 'none'; // Hide filter bar on other pages
        // ... (puraana switch case wala logic yahan daal sakte hain agar zaroorat pade)
    } else {
        const pageTitle = `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Posts`;
        titleElement.textContent = pageTitle;
        document.title = pageTitle + ' - EZGOVTJOB';
    }
});

function createPostCard(post) { /* ... iska code wahi rahega, koi change nahi ... */ }