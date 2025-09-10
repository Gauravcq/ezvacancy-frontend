// FRONTEND -> js/search.js (FINAL, CORRECTED VERSION)

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    
    // --- ELEMENT SELECTORS ---
    const postsContainer = document.getElementById('posts-container');
    const searchTitleElement = document.getElementById('search-title');

    if (!postsContainer || !searchTitleElement) {
        console.error('Required elements (posts-container or search-title) not found.');
        return;
    }

    // --- LOGIC ---
    // 1. Get the search query from the URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    // 2. Update the page title and fetch posts
    if (query && query.trim() !== '') {
        const searchTerm = query.trim();
        searchTitleElement.textContent = `Search Results for: "${searchTerm}"`;
        document.title = `Search for "${searchTerm}" - EZGOVTJOB`;
        searchPosts(searchTerm);
    } else {
        searchTitleElement.textContent = 'Please enter a search term';
        postsContainer.innerHTML = '<p class="col-span-full text-center">You can search for jobs using the search bar in the header.</p>';
    }

    // --- FUNCTIONS ---

    /**
     * Fetches posts from the backend based on the search term.
     * @param {string} searchTerm - The user's search query.
     */
    async function searchPosts(searchTerm) {
        postsContainer.innerHTML = '<p class="col-span-full text-center text-slate-500">Searching...</p>';
        try {
            // Encode the search term to handle special characters like spaces
            const encodedTerm = encodeURIComponent(searchTerm);
            const response = await fetch(`${BACKEND_URL}/api/search?q=${encodedTerm}`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const posts = await response.json();

            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = `<p class="col-span-full text-center text-slate-500">No results found for "${searchTerm}".</p>`;
                return;
            }
            // If results are found, render them
            postsContainer.innerHTML = posts.map(createPostCard).join('');

        } catch (error) {
            console.error('Search failed:', error);
            postsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Something went wrong while searching. Please try again.</p>';
        }
    }
});

/**
 * Creates the HTML for a single post card.
 * @param {object} post - The post data from the API.
 * @returns {string} - The HTML string for the card.
 */
function createPostCard(post) {
    const postDate = new Date(post.postDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    return `
        <a href="post.html?slug=${post.slug}" class="card-hover-effect block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 class="font-bold text-lg mb-2">${post.title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                Category: ${post.SubCategory?.Category?.name || 'N/A'}
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Posted on: ${postDate}
            </p>
            <span class="font-semibold text-blue-600 mt-4 inline-block">Read More →</span>
        </a>
    `;
}