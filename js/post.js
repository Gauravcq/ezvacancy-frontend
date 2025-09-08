// js/post.js (Final and Complete Version)

// Note: API_BASE_URL is not needed here because it's already in main.js
// Note: initTheme is also not needed here because it's already in main.js

document.addEventListener('DOMContentLoaded', () => {
    // Get the 'slug' from the URL (e.g., from ?slug=ssc-cgl-2024)
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug'); 

    if (slug) {
        fetchPostDetails(slug);
    } else {
        const container = document.getElementById('post-container');
        if(container) {
            container.innerHTML = `
                <h1 class="text-2xl font-bold text-center">Post Not Found</h1>
                <p class="text-center mt-4">The link you followed seems to be broken or the post has been removed.</p>
                <div class="text-center mt-6">
                    <a href="/" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Go to Homepage</a>
                </div>
            `;
        }
    }
});

/**
 * Fetches the details of a single post from the backend using its slug.
 * @param {string} slug - The URL-friendly identifier for the post.
 */
async function fetchPostDetails(slug) {
    const container = document.getElementById('post-container');
    if(!container) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${slug}`);
        if (!response.ok) {
            // If the server returns 404 or any other error
            throw new Error('Post not found');
        }
        const job = await response.json();
        
        // Update the page title with the job title
        document.title = `${job.title} - EZGOVTJOB`;

        // Render the job details into the container
        container.innerHTML = `
            <h1 class="text-center text-3xl font-extrabold text-blue-600">${job.organization}</h1>
            <h2 class="text-center text-xl font-bold mt-2">${job.title}</h2>
            <p class="text-center text-sm text-slate-500 mt-2"><strong>Post Update:</strong> ${new Date(job.postUpdateDate).toLocaleDateString()}</p>
            
            <p class="mt-8 text-slate-600 dark:text-slate-300">${job.shortDescription}</p>
            
            ${createSection('Important Dates', job.importantDates)}
            ${createSection('Application Fee', job.applicationFee)}
            ${createSection('Age Limit', job.ageLimit)}
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
        console.error("Failed to fetch post details:", error);
        container.innerHTML = `
            <h1 class="text-2xl font-bold text-center">Error 404</h1>
            <p class="text-center mt-4">This post could not be found. It may have been moved or deleted.</p>
            <div class="text-center mt-6">
                <a href="/" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Go to Homepage</a>
            </div>
        `;
    }
}

/**
 * A helper function to create a styled section if the content exists.
 * @param {string} title - The title of the section.
 * @param {string} content - The content for the section (can be multiline).
 * @returns {string} - The HTML for the section, or an empty string.
 */
function createSection(title, content) {
    if (!content) return ''; // If there's no content, don't create the section
    // The 'prose' class from Tailwind Typography helps style the content nicely
    return `
        <div class="mt-6 border-t dark:border-slate-700 pt-6">
            <h3 class="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">${title}</h3>
            <div class="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                ${content.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
}

/**
 * A helper function to create a styled link button if the URL exists.
 * @param {string} title - The text for the button.
 * @param {string} url - The URL for the link.
 * @returns {string} - The HTML for the link, or an empty string.
 */
function createLink(title, url) {
    if (!url) return ''; // If there's no URL, don't create the link
    return `
        <a href="${url}" target="_blank" class="block bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-colors">
            ${title}
        </a>
    `;
}