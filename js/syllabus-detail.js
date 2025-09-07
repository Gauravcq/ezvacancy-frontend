// js/syllabus-detail.js (Nayi File)

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) fetchSyllabusDetails(slug);
});

async function fetchSyllabusDetails(slug) {
    const container = document.getElementById('syllabus-detail-container');
    container.innerHTML = `<p>Loading syllabus...</p>`;

    try {
        const response = await fetch(`${API_BASE_URL}/api/syllabuses/${slug}`);
        if (!response.ok) throw new Error('Syllabus not found');
        const syllabus = await response.json();
        
        document.title = `${syllabus.examName} Syllabus - EZGOVTJOB`;
        container.innerHTML = `
            <h1 class="text-center text-3xl font-extrabold text-blue-600">${syllabus.examName}</h1>
            <h2 class="text-center text-xl font-bold mt-2">${syllabus.organization}</h2>
            <div class="mt-8 prose prose-lg dark:prose-invert max-w-none">
                ${syllabus.details}
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<h1 class="text-2xl font-bold">Error 404</h1><p>This syllabus could not be found.</p>`;
    }
}