// js/post.js (Nayi File, Final Version)

const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

function initTheme() {
    const themeToggle = document.getElementById('themeToggle'), lightIcon = document.getElementById('theme-icon-light'), darkIcon = document.getElementById('theme-icon-dark');
    if (!themeToggle || !lightIcon || !darkIcon) return;
    const applyTheme = (theme) => { document.documentElement.classList.toggle('dark', theme === 'dark'); lightIcon.classList.toggle('hidden', theme === 'dark'); darkIcon.classList.toggle('hidden', theme !== 'dark'); };
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    themeToggle.addEventListener('click', () => { const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'; localStorage.setItem('theme', newTheme); applyTheme(newTheme); });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme(); // Dark mode chalu karo
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (slug) {
        fetchPostDetails(slug);
    } else {
        const container = document.getElementById('post-container');
        container.innerHTML = `<h1 class="text-2xl font-bold">Post Not Found</h1><p>The link seems to be broken. Please go back to the homepage.</p>`;
    }
});

async function fetchPostDetails(slug) {
    const container = document.getElementById('post-container');
    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${slug}`);
        if (!response.ok) throw new Error('Post not found');
        const job = await response.json();
        
        document.title = `${job.title} - EZGOVTJOB`;

        container.innerHTML = `
            <h1 class="text-center text-3xl font-extrabold text-blue-600">${job.organization}</h1>
            <h2 class="text-center text-xl font-bold mt-2">${job.title}</h2>
            <p class="text-center text-sm text-slate-500 mt-2"><strong>Post Update:</strong> ${new Date(job.postUpdateDate).toLocaleDateString()}</p>
            <p class="mt-6 text-slate-600 dark:text-slate-300">${job.shortDescription}</p>
            ${createSection('Important Dates', job.importantDates)}
            ${createSection('Application Fee', job.applicationFee)}
            ${createSection('Age Limit (as on 01/01/2025)', job.ageLimit)}
            ${createSection('Vacancy Details', job.vacancyDetails)}
            <div class="mt-8 bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
                <h3 class="text-xl font-bold text-center mb-4">Important Links</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                    ${createLink('Apply Online', job.applyUrl)}
                    ${createLink('Download Notification', job.noticeUrl)}
                    ${createLink('Official Website', job.officialWebsiteUrl)}
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<h1 class="text-2xl font-bold text-center">Error 404</h1><p class="text-center">This post could not be found. It may have been moved or deleted.</p>`;
    }
}

function createSection(title, content) {
    if (!content) return '';
    return `<div class="mt-6 border-t dark:border-slate-700 pt-6"><h3 class="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">${title}</h3><div class="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">${content.replace(/\n/g, '<br>')}</div></div>`;
}

function createLink(title, url) {
    if (!url) return '';
    return `<a href="${url}" target="_blank" class="block bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-colors">${title}</a>`;
}