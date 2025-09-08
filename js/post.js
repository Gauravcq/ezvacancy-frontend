// FILE: ezvacancy-frontend/js/post.js

// This helper function will convert the text from the database into a usable object
function parseKeyValueString(str) {
    if (!str || typeof str !== 'string' || str.trim() === '') { return {}; }
    const obj = {};
    str.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            if (key && value) { obj[key] = value; }
        }
    });
    return obj;
}

document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('slug');
    const container = document.getElementById('post-container');

    if (!container || !postSlug) {
        if (container) container.innerHTML = `<h1 class="text-center">Error: Post Not Found</h1>`;
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

        // Parse the text fields from the post object into new objects
        const importantDatesObj = parseKeyValueString(post.importantDates);
        const applicationFeeObj = parseKeyValueString(post.applicationFee);
        const ageLimitObj = parseKeyValueString(post.ageLimit);
        const vacancyDetailsObj = parseKeyValueString(post.vacancyDetails);
        const usefulLinksObj = parseKeyValueString(post.usefulLinks);

        container.innerHTML = `
            <h1 class="text-center text-3xl font-extrabold text-blue-600 dark:text-blue-400">${post.title}</h1>
            <h2 class="text-center text-xl font-bold mt-2 text-slate-700 dark:text-slate-200">${post.shortInformation || ''}</h2>
            <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-2"><strong>Post Date:</strong> ${new Date(post.postDate).toLocaleDateString()}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                ${createListSection('Important Dates', importantDatesObj)}
                ${createListSection('Application Fee', applicationFeeObj)}
            </div>

            ${createListSection('Age Limit (as on 01/08/2025)', ageLimitObj, true)}
            ${createVacancyTable('Vacancy Details', vacancyDetailsObj)}
            ${createHowToApplySection('How to Fill Form', post.howToApply)}
            ${createLinksSection('Important Links', usefulLinksObj)}
        `;

    } catch (error) {
        console.error("Failed to fetch post details:", error);
        container.innerHTML = `<h1 class="text-center">Error 404: Post not found.</h1>`;
    }
}

// Helper functions to create HTML sections
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

function createVacancyTable(title, data) {
    if (!data || Object.keys(data).length === 0) return '';
    const rows = Object.entries(data).map(([postName, details]) => {
        const [totalPost, eligibility] = details.split(';').map(s => s.trim());
        return `
            <tr class="border-b border-slate-200 dark:border-slate-700">
                <td class="p-3">${postName}</td>
                <td class="p-3 text-center">${totalPost || ''}</td>
                <td class="p-3">${eligibility || ''}</td>
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

function createHowToApplySection(title, content) {
    if (!content) return '';
    return `<div class="mt-6 border border-slate-200 dark:border-slate-700 rounded-lg"> ... </div>`; // Keep your existing code here
}

function createLinksSection(title, links) {
    if (!links || Object.keys(links).length === 0) return '';
    const linkButtons = Object.entries(links).map(([text, url]) => `
        <a href="${url}" target="_blank" class="block bg-blue-600 text-white text-center font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-colors">
            ${text}
        </a>
    `).join('');
    return `<div class="mt-8 bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg"> ... </div>`; // Keep your existing code here
}