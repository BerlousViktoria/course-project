document.addEventListener('DOMContentLoaded', async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return (window.location.href = 'projects.html');

    try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
            document.getElementById('projectTitle').textContent = 'Проєкт не знайдено';
            return;
        }

        const p = await res.json();
        document.title = `${p.title} — Interno`;

        document.getElementById('projectTitle').textContent = p.title;
        document.getElementById('projectClient').textContent = p.client || 'Приватний клієнт';
        document.getElementById('projectCategory').textContent = p.category_name || 'Інтерʼєр';
        document.getElementById('projectTags').textContent = p.tags || 'Інтерʼєр, Дизайн';
        document.getElementById('projectDate').textContent = new Date(p.created_at).toLocaleDateString('uk-UA');

        const linkEl = document.getElementById('projectLink');
        linkEl.textContent = p.project_link || 'interno-studio.ua';
        if (p.project_link) {
            linkEl.href = p.project_link.startsWith('http') ? p.project_link : `https://${p.project_link}`;
        }

        const text = p.description || 'Детальний опис проєкту уточнюється.';
        document.getElementById('projectDescription').innerHTML = text
            .split('\n')
            .filter(Boolean)
            .map(line => `<p>${line}</p>`)
            .join('');

        const imgEl = document.getElementById('projectImage');
        imgEl.src = p.image_url;
        imgEl.alt = p.title;

        const overlay = document.getElementById('lightboxOverlay');
        document.getElementById('zoomBtn').onclick = () => {
            document.getElementById('lightboxImg').src = p.image_url;
            overlay.classList.remove('d-none');
        };
        overlay.onclick = () => overlay.classList.add('d-none');
    } catch {
        document.getElementById('projectTitle').textContent = 'Помилка завантаження проєкту';
    }
});