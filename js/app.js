// js/app.js (NEW VERSION for 3-Column Homepage)

document.addEventListener('DOMContentLoaded', () => {
    // Sirf homepage par chalne wale functions
    if (document.getElementById('ssc-updates-list')) {
        initHomepageSections();
    }
});

/**
 * Yeh main function hai jo homepage ke teeno sections ko data se bharta hai.
 */
async function initHomepageSections() {
    const sscList = document.getElementById('ssc-updates-list');
    const railwayList = document.getElementById('railway-updates-list');
    const bankingList = document.getElementById('banking-updates-list');
    
    if (!sscList || !railwayList || !bankingList) return;

    const BACKEND_URL = 'https://ezvacancy-backend.onrender.com';

    try {
        const response = await fetch(`${BACKEND_URL}/api/homepage-sections`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();

        // Har section ke liye data ko render karein
        renderSection(sscList, data.ssc);
        renderSection(railwayList, data.railway);
        renderSection(bankingList, data.banking);

    } catch (error) {
        console.error("Error initializing homepage sections:", error);
        sscList.innerHTML = `<li class="text-center text-red-500">Failed to load.</li>`;
        railwayList.innerHTML = `<li class="text-center text-red-500">Failed to load.</li>`;
        bankingList.innerHTML = `<li class="text-center text-red-500">Failed to load.</li>`;
    }
}

/**
 * Helper function jo ek section ki list ko posts se bharta hai.
 * @param {HTMLElement} listElement - The <ul> element.
 * @param {Array} posts - The array of post objects.
 */
function renderSection(listElement, posts) {
    if (!posts || posts.length === 0) {
        listElement.innerHTML = `<li class="text-center text-slate-500">No recent updates.</li>`;
        return;
    }

    listElement.innerHTML = ''; // Loading text hatayein
    
    // Sirf latest 5-6 posts dikhayein
    const limitedPosts = posts.slice(0, 6);

    limitedPosts.forEach(post => {
        const isNew = (new Date() - new Date(post.postDate)) / (1000 * 60 * 60 * 24) < 3; // 3 din se purana to nahi
        
        listElement.innerHTML += `
            <li class="border-b border-slate-200 dark:border-slate-700 last:border-b-0 py-2">
                <a href="post.html?slug=${post.slug}" class="hover:text-blue-500">
                    › ${post.title}
                    ${isNew ? '<span class="text-xs text-red-500 font-bold animate-pulse ml-1">New</span>' : ''}
                </a>
            </li>
        `;
    });
}