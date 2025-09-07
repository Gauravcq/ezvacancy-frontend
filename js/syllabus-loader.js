// js/syllabus-loader.js (Nayi File)

document.addEventListener('DOMContentLoaded', () => {
    loadAllSyllabuses();
});

async function loadAllSyllabuses() {
    const container = document.getElementById('syllabus-list-container');
    if (!container) return;
    container.innerHTML = `<p>Loading syllabuses...</p>`;

    try {
        const response = await fetch(`${API_BASE_URL}/api/syllabuses`);
        if (!response.ok) throw new Error('API request failed');
        const { data } = await response.json();
        
        container.innerHTML = '';
        if (data.length === 0) { container.innerHTML = `<p>No syllabus found.</p>`; return; }

        data.forEach(item => {
            const card = document.createElement('a');
            card.href = `syllabus-detail.html?slug=${item.slug}`;
            card.className = "block bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow";
            card.innerHTML = `
                <h3 class="font-bold text-lg text-blue-600">${item.examName}</h3>
                <p class="text-sm text-slate-500">${item.organization}</p>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading syllabuses:', error);
        container.innerHTML = `<p class="text-red-500">Could not load syllabuses.</p>`;
    }
}