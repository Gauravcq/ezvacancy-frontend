// js/post.js (FINAL VERSION with INLINE TAILWIND CSS)

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('slug');
    const container = document.getElementById('post-container');

    if (!container) {
        console.error('Main container with id="post-container" not found.');
        return;
    }

    if (!postSlug) {
        container.innerHTML = `<h1 class="text-center">Post Not Found</h1>`;
        return;
    }
    
    fetchPostDetails(postSlug, container, BACKEND_URL);
});

async function fetchPostDetails(slug, container, baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/api/posts/${slug}`);
        if (!response.ok) throw new Error('Post not found');
        const post = await response.json();

        document.title = `${post.title} - EZGOVTJOB`;

        container.innerHTML = `
            <h1 class="text-center text-3xl font-extrabold text-blue-600 dark:text-blue-400">${post.SubCategory?.Category?.name || ''}</h1>
            <h2 class="text-center text-xl font-bold mt-2 text-slate-800 dark:text-slate-100">${post.title}</h2>
            <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-2"><strong>Post Date:</strong> ${new Date(post.postDate).toLocaleDateString()}</p>
            
            <p class="mt-8 text-slate-600 dark:text-slate-300">${post.shortInformation || ''}</p>
            
            <!-- 2-COLUMN LAYOUT START -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                ${createListSection('Important Dates', post.importantDates)}
                ${createListSection('Application Fee', post.applicationFee)}
            </div>
            <!-- 2-COLUMN LAYOUT END -->

            ${createTableSection('Vacancy Details', post.vacancyDetails)}
            ${createHowToApplySection('How to Fill Form', post.howToApply)}
            ${createLinksSection('Important Links', post.usefulLinks)}
        `;

    } catch (error) {
        console.error("Failed to fetch post details:", error);
        container.innerHTML = `<h1 class="text-center">Error 404: Post not found.</h1>`;
    }
}

// Function to create a list-based section (Sarkari Result style)
function createListSection(title, data) {
    if (!data || Object.keys(data).length === 0) return '';
    
    const listItems = Object.entries(data).map(([key, value]) => `
        <li class="relative pl-6"><span class="absolute left-0 font-bold text-blue-500">&»</span><strong>${key} :</strong> ${value}</li>
    `).join('');

    return `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <h3 class="text-xl font-bold p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-center">${title}</h3>
            <ul class="p-4 text-slate-600 dark:text-slate-300 space-y-2">
                ${listItems}
            </ul>
        </div>
    `;
}

// Function to create a table-based section
function createTableSection(title, data) {
    if (!data || Object.keys(data).length === 0) return '';
    const rows = Object.entries(data).map(([key, value]) => `
        <div class="flex border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <div class="w-1/2 md:w-1/3 font-semibold p-3 bg-slate-50 dark:bg-slate-700/50">${key}</div>
            <div class="w-1/2 md:w-2/3 p-3">${value}</div>
        </div>
    `).join('');
    return `
        <div class="mt-6 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <h3 class="text-xl font-bold p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-center">${title}</h3>
            <div>${rows}</div>
        </div>
    `;
}

// Function for "How to Apply"
function createHowToApplySection(title, content) {
    if (!content) return '';
    return `
        <div class="mt-6 border border-slate-200 dark:border-slate-700 rounded-lg">
            <h3 class="text-xl font-bold p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-center">${title}</h3>
            <div class="p-4 prose dark:prose-invert max-w-none">
                ${content.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
}

// Function for links (FIXED)
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