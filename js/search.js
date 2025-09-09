// FRONTEND -> js/search.js

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const postsContainer = document.getElementById('posts-container');
    const searchTitle = document.getElementById('search-title');

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q'); // URL se search query nikalo

    if (query && searchTitle) {
        searchTitle.textContent = `Search Results for: "${query}"`;
        document.title = `Search for "${query}" - EZGOVTJOB`;
        searchPosts(query);
    } else {
        if (searchTitle) searchTitle.textContent = 'Please enter a search term.';
    }

    async function searchPosts(searchTerm) {
        postsContainer.innerHTML = '<p class="col-span-full text-center">Searching...</p>';
        try {
            const res = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(searchTerm)}`);
            const posts = await res.json();

            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = `<p class="col-span-full text-center">No results found for "${searchTerm}".</p>`;
                return;
            }
            postsContainer.innerHTML = posts.map(createPostCard).join('');
        } catch (error) {
            console.error('Search failed:', error);
            postsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Something went wrong.</p>';
        }
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
                Category: ${post.SubCategory?.Category?.name || 'N/A'}
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Posted on: ${postDate}
            </p>
            <span class="font-semibold text-blue-600 mt-4 inline-block">Read More →</span>
        </a>
    `;
}