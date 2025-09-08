// js/post.js (NEW VERSION for the new Backend)

document.addEventListener('DOMContentLoaded', () => {
    // APNA LIVE RENDER URL YAHAN DAALEIN
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';

    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('slug');
    const container = document.getElementById('post-container'); // Assuming your main container has id="post-container"

    if (!container) {
        console.error('Main container with id="post-container" not found.');
        return;
    }

    if (!postSlug) {
        container.innerHTML = `
            <h1 class="text-2xl font-bold text-center">Post Not Found</h1>
            <p class="text-center mt-4">The link seems to be broken.</p>
            <div class="text-center mt-6"><a href="/" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Go to Homepage</a></div>
        `;
        return;
    }
    
    fetchPostDetails(postSlug, container, BACKEND_URL);
});


async function fetchPostDetails(slug, container, baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/api/posts/${slug}`);
        if (!response.ok) {
            throw new Error('Post not found on the server');
        }
        const post = await response.json();

        // Update page title
        document.title = `${post.title} - EZGOVTJOB`;

        // Render all the details
        container.innerHTML = `
            <h1 class="text-center text-3xl font-extrabold text-blue-600">${post.SubCategory?.Category?.name || ''}</h1>
            <h2 class="text-center text-xl font-bold mt-2">${post.title}</h2>
            <p class="text-center text-sm text-slate-500 mt-2"><strong>Post Date:</strong> ${new Date(post.postDate).toLocaleDateString()}</p>
            
            <p class="mt-8 text-slate-600 dark:text-slate-300">${post.shortInformation || ''}</p>
            
            ${createTableSection('Important Dates', post.importantDates)}
            ${createTableSection('Application Fee', post.applicationFee)}
            ${createTableSection('Vacancy Details', post.vacancyDetails)}
            ${createListSection('How to Fill Form', post.howToApply)}
            ${createLinksSection('Important Links', post.usefulLinks)}
        `;

    } catch (error) {
        console.error("Failed to fetch post details:", error);
        container.innerHTML = `
            <h1 class="text-2xl font-bold text-center">Error 404</h1>
            <p class="text-center mt-4">This post could not be found. It may have been moved or deleted.</p>
            <div class="text-center mt-6"><a href="/" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Go to Homepage</a></div>
        `;
    }
}

/**
 * Helper to create a table-like section from a JSON object.
 * @param {string} title - The title of the section.
 * @param {object} data - The JSON object with key-value pairs.
 * @returns {string} The HTML for the section.
 */
function createTableSection(title, data) {
    if (!data || Object.keys(data).length === 0) return '';
    
    const rows = Object.entries(data).map(([key, value]) => `
        <div class="flex border-b dark:border-slate-700">
            <div class="w-1/3 md:w-1/4 font-semibold p-3 bg-slate-50 dark:bg-slate-800">${key}</div>
            <div class="w-2/3 md:w-3/4 p-3">${value}</div>
        </div>
    `).join('');

    return `
        <div class="mt-6 border dark:border-slate-700 rounded-lg overflow-hidden">
            <h3 class="text-xl font-bold p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">${title}</h3>
            <div>${rows}</div>
        </div>
    `;
}

/**
 * Helper to create a section for simple text content (like How to Apply).
 * @param {string} title - The title of the section.
 * @param {string} content - The text content.
 * @returns {string} The HTML for the section.
 */
function createListSection(title, content) {
    if (!content) return '';
    return `
        <div class="mt-6 border dark:border-slate-700 rounded-lg">
            <h3 class="text-xl font-bold p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">${title}</h3>
            <div class="p-4 prose dark:prose-invert max-w-none">
                ${content.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
}


/**
 * Helper to create a section with styled link buttons.
 * @param {string} title - The title of the section.
 *- The JSON object with link titles and URLs.
 * @returns {string} The HTML for the section.
 */
function createLinksSection(title, links) {
    if (!links || Object.keys(links).length === 0) return '';

    const linkButtons = Object.entries(links).map(([text, url]) => `
        <a href="${url}" target="_blank" class="block bg-blue-600 text-white text-center font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-colors">
            ${text}
        </a>
    `).join('');

    return `
        <div class="mt-8 bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
            <h3 class="text-xl font-bold text-center mb-4">${title}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${linkButtons}
            </div>
        </div>
    `;
}