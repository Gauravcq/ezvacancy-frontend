// FRONTEND -> js/post.js (FINAL VERSION with ALL SECTIONS)

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('slug');
    const container = document.getElementById('post-container');

    if (!container || !postSlug) {
        container.innerHTML = `<h1 class="text-center">Error: Post Not Found</h1>`;
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
            <h1 class="text-center text-3xl font-extrabold text-blue-600 dark:text-blue-400">${post.title}</h1>
            <h2 class="text-center text-xl font-bold mt-2 text-slate-700 dark:text-slate-200">${post.shortInformation || ''}</h2>
            <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-2"><strong>Post Date:</strong> ${new Date(post.postDate).toLocaleDateString()}</p>
            
            <!-- 2-COLUMN LAYOUT -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                ${createListSection('Important Dates', post.importantDates)}
                ${createListSection('Application Fee', post.applicationFee)}
            </div>

            <!-- Full-width sections -->
            ${createListSection('Age Limit (as on 01/08/2025)', post.ageLimit, true)}
            ${createVacancyTable('Vacancy Details', post.vacancyDetails)}
            ${createHowToApplySection('How to Fill Form', post.howToApply)}
            ${createLinksSection('Important Links', post.usefulLinks)}
        `;

    } catch (error) {
        console.error("Failed to fetch post details:", error);
        container.innerHTML = `<h1 class="text-center">Error 404: Post not found.</h1>`;
    }
}

// Function for bullet-point lists (Dates, Fee, Age Limit)
function createListSection(title, data, isFullWidth = false) {
    if (!data || Object.keys(data).length === 0) return '';
    
    const listItems = Object.entries(data).map(([key, value]) => `
        <li class="relative pl-6 before:content-['»'] before:absolute before:left-0 before:font-bold before:text-blue-500"><strong>${key} :</strong> ${value}</li>
    `).join('');

    const containerClass = isFullWidth ? 'mt-6' : '';

    return `
        <div class="${containerClass}">
            <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <h3 class="text-lg font-bold p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-center">${title}</h3>
                <ul class="p-4 text-slate-600 dark:text-slate-300 space-y-2">
                    ${listItems}
                </ul>
            </div>
        </div>
    `;
}

// Naya Function: Vacancy Details ke liye proper table banane ke liye
function createVacancyTable(title, data) {
    if (!data || Object.keys(data).length === 0) return '';
    
    const rows = Object.entries(data).map(([postName, details]) => {
        const [totalPost, eligibility] = details.split(';').map(s => s.trim());
        return `
            <tr class="border-b border-slate-200 dark:border-slate-700">
                <td class="p-3">${postName}</td>
                <td class="p-3 text-center">${totalPost}</td>
                <td class="p-3">${eligibility}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="mt-6 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <h3 class="text-lg font-bold p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-center">${title}</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-slate-50 dark:bg-slate-700/50 font-semibold">
                        <tr>
                            <th class="p-3 text-left">Post Name</th>
                            <th class="p-3 text-center">Total Post</th>
                            <th class="p-3 text-left">Eligibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Function for "How to Apply"
function createHowToApplySection(title, content) { /* ... iska code wahi rahega ... */ }

// Function for links
function createLinksSection(title, links) { /* ... iska code wahi rahega ... */ }