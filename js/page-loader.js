// js/page-loader.js (Nayi File)

// Helper function to create a list item card for the page
function createPageListItem(item, type) {
    const element = document.createElement('div');
    element.className = 'bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col p-4 card-hover-effect';

    const detailUrl = (type === 'Notification') ? `post.html?slug=${item.slug}` : (item.downloadUrl || item.resultUrl || '#');
    const title = item.title || item.examName;
    const organization = item.organization || '';
    
    let tag = '';
    // Type ke hisaab se tag pehchaano
    if (type === 'Notification') tag = '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Notification</span>';
    if (type === 'Admit Card') tag = '<span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300">Admit Card</span>';
    if (type === 'Result') tag = '<span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-emerald-900 dark:text-emerald-300">Result</span>';
    if (type === 'Answer Key') tag = '<span class="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-rose-900 dark:text-rose-300">Answer Key</span>';

    element.innerHTML = `<div class="flex-grow"><div class="mb-2">${tag}</div><h3 class="font-bold text-slate-800 dark:text-slate-100">${title}</h3><p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${organization}</p></div><a href="${detailUrl}" ${ (type !== 'Notification') ? 'target="_blank"' : '' } class="mt-4 inline-block font-semibold text-blue-600 hover:underline">View Details →</a>`;
    return element;
}

// Yeh "Master" function hai jo data laakar page bharega
async function loadPageData(endpoint, type) {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    // Loading skeleton dikhao
    let skeletonHTML = '';
    for (let i = 0; i < 6; i++) {
        skeletonHTML += `<div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 animate-pulse"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3"></div><div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-4"></div></div>`;
    }
    container.innerHTML = skeletonHTML;

    try {
        // Ek saath 50 items tak laao
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}?limit=50`); 
        if (!response.ok) throw new Error('API request failed');
        const { data } = await response.json();
        
        container.innerHTML = '';
        if (data.length === 0) { 
            container.innerHTML = `<p class="md:col-span-3 text-center">No ${type.toLowerCase()}s found currently.</p>`; 
            return; 
        }
        data.forEach(item => container.appendChild(createPageListItem(item, type)));
    } catch (error) {
        console.error(`Error loading page data for ${endpoint}:`, error);
        container.innerHTML = `<p class="md:col-span-3 text-center text-red-500">Could not load data. Please try again later.</p>`;
    }
}