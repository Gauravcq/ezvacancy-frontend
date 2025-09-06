// js/app.js (Naya Code)

// Aapke live backend API ka address
const API_BASE_URL = 'https://ezvacancy-backend.onrender.com';

// Jab poora page load ho jaaye, toh yeh function chalao
document.addEventListener('DOMContentLoaded', () => {
    // Teeno sections ke liye data fetch karna shuru karo
    fetchAndDisplayJobs();
    fetchAndDisplayAdmitCards();
    fetchAndDisplayResults();

    // Baaki ke initializations (jaise Swiper, AOS) yahan daalein
    AOS.init({ once: true });
    // etc.
});

// === JOBS FETCH KARNE KA FUNCTION ===
async function fetchAndDisplayJobs() {
    // 1. Jobs waale container ko uski ID se pakdo
    const container = document.getElementById('list-latest');
    container.innerHTML = '<li><p class="p-4 text-sm text-slate-500">Loading jobs...</p></li>';

    try {
        // 2. API se jobs ka data mangwao
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        if (!response.ok) throw new Error('Jobs fetch nahi ho payi');
        
        const { data: jobs } = await response.json();

        // 3. Container ko khali karo
        container.innerHTML = '';

        if (jobs.length === 0) {
            container.innerHTML = '<li><p class="p-4 text-sm">No new jobs found.</p></li>';
            return;
        }

        // 4. Har job ke liye HTML bana kar container mein daalo
        jobs.forEach(job => {
            const listItem = document.createElement('li');
            listItem.className = 'p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50';
            
            listItem.innerHTML = `
                <div class="font-semibold text-slate-800 dark:text-slate-100">${job.title}</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">${job.organization}</div>
                <div class="text-xs text-slate-500 mt-2">Last Date: ${new Date(job.lastDate).toLocaleDateString()}</div>
                <div class="mt-3 flex gap-2">
                    <a href="${job.noticeUrl}" target="_blank" class="inline-block bg-slate-100 dark:bg-slate-800 text-xs px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">Notice</a>
                    <a href="${job.applyUrl}" target="_blank" class="inline-block bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs px-2 py-1 rounded font-semibold hover:bg-brand-200 dark:hover:bg-brand-900">Apply Link</a>
                </div>
            `;
            container.appendChild(listItem);
        });

    } catch (error) {
        console.error('Jobs fetch error:', error);
        container.innerHTML = '<li><p class="p-4 text-sm text-red-500">Could not load jobs.</p></li>';
    }
}


// === ADMIT CARDS FETCH KARNE KA FUNCTION ===
async function fetchAndDisplayAdmitCards() {
    const container = document.getElementById('list-admit');
    container.innerHTML = '<li><p class="p-4 text-sm text-slate-500">Loading admit cards...</p></li>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/admit-cards`);
        if (!response.ok) throw new Error('Admit cards fetch nahi ho paye');
        
        const { data: admitCards } = await response.json();
        container.innerHTML = '';

        if (admitCards.length === 0) {
            container.innerHTML = '<li><p class="p-4 text-sm">No new admit cards found.</p></li>';
            return;
        }

        admitCards.forEach(card => {
            const listItem = document.createElement('li');
            listItem.className = 'p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50';
            
            listItem.innerHTML = `
                <div class="font-semibold text-slate-800 dark:text-slate-100">${card.examName}</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">${card.organization || ''}</div>
                <div class="mt-3">
                    <a href="${card.downloadUrl}" target="_blank" class="inline-block bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs px-2 py-1 rounded font-semibold hover:bg-brand-200 dark:hover:bg-brand-900">Download</a>
                </div>
            `;
            container.appendChild(listItem);
        });

    } catch (error) {
        console.error('Admit card fetch error:', error);
        container.innerHTML = '<li><p class="p-4 text-sm text-red-500">Could not load admit cards.</p></li>';
    }
}


// === RESULTS FETCH KARNE KA FUNCTION ===
async function fetchAndDisplayResults() {
    const container = document.getElementById('list-results');
    container.innerHTML = '<li><p class="p-4 text-sm text-slate-500">Loading results...</p></li>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/results`);
        if (!response.ok) throw new Error('Results fetch nahi ho paye');
        
        const { data: results } = await response.json();
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<li><p class="p-4 text-sm">No new results found.</p></li>';
            return;
        }

        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.className = 'p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50';
            
            listItem.innerHTML = `
                <div class="font-semibold text-slate-800 dark:text-slate-100">${result.examName}</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">${result.organization || ''}</div>
                <div class="mt-3">
                    <a href="${result.resultUrl}" target="_blank" class="inline-block bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs px-2 py-1 rounded font-semibold hover:bg-brand-200 dark:hover:bg-brand-900">Check Result</a>
                </div>
            `;
            container.appendChild(listItem);
        });

    } catch (error) {
        console.error('Result fetch error:', error);
        container.innerHTML = '<li><p class="p-4 text-sm text-red-500">Could not load results.</p></li>';
    }
}