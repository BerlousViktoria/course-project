const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

let data = { projects: [], posts: [] };

async function api(url, method = 'GET', body = null) {
    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
    });

    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return null;
    }
    return res.ok ? (method === 'DELETE' ? true : res.json()) : null;
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn, .tab-panel').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    };
});

async function loadAll() {
    const [categories, projects, posts, contacts] = await Promise.all([
        api('/api/projects/categories'),
        api('/api/projects'),
        api('/api/posts'),
        api('/api/contact')
    ]);

    const categorySelect = document.getElementById('project-category');
    if (categories && categorySelect) {
        categorySelect.innerHTML =
            '<option value="">Без категорії</option>' +
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    const projectsBody = document.getElementById('projects-table-body');
    if (projects && projectsBody) {
        data.projects = projects;
        projectsBody.innerHTML = projects.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image_url}" class="table-thumb"></td>
                <td>${p.title}</td>
                <td>${p.category_name || 'Без категорії'}</td>
                <td>${p.client || '—'}</td>
                <td class="actions-cell">
                    <button type="button" class="btn-edit" onclick="fillForm('project', '${p.id}')">Редагувати</button>
                    <button type="button" class="btn-delete" onclick="removeItem('/api/projects/${p.id}')">Видалити</button>
                </td>
            </tr>`).join('');
    }

    const postsBody = document.getElementById('posts-table-body');
    if (posts && postsBody) {
        data.posts = posts;
        postsBody.innerHTML = posts.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image_url}" class="table-thumb"></td>
                <td>${p.title}</td>
                <td>${p.tag || '—'}</td>
                <td>${new Date(p.created_at).toLocaleDateString('uk-UA')}</td>
                <td class="actions-cell">
                    <button type="button" class="btn-edit" onclick="fillForm('post', '${p.id}')">Редагувати</button>
                    <button type="button" class="btn-delete" onclick="removeItem('/api/posts/${p.id}')">Видалити</button>
                </td>
            </tr>`).join('');
    }

    const contactsBody = document.getElementById('contacts-table-body');
    if (contacts && contactsBody) {
        contactsBody.innerHTML = contacts.map(c => `
            <tr>
                <td>${new Date(c.created_at).toLocaleDateString('uk-UA')}</td>
                <td>${c.name}</td>
                <td>${c.email}${c.phone ? `<br><small>${c.phone}</small>` : ''}</td>
                <td>${c.subject || '—'}</td>
                <td>${c.message}</td>
                <td class="actions-cell">
                    <button type="button" class="btn-delete" onclick="removeItem('/api/contact/${c.id}')">Видалити</button>
                </td>
            </tr>`).join('');
    }
}

function fillForm(type, id) {
    const item = data[type + 's'].find(x => String(x.id) === String(id));
    if (!item) return;

    document.getElementById(`${type}-id`).value = item.id;
    document.getElementById(`${type}-title`).value = item.title;
    document.getElementById(`${type}-image`).value = item.image_url || '';

    if (type === 'project') {
        document.getElementById('project-category').value = item.category_id || '';
        document.getElementById('project-client').value = item.client || '';
        document.getElementById('project-tags').value = item.tags || '';
        document.getElementById('project-link').value = item.project_link || '';
        document.getElementById('project-description').value = item.description || '';
    } else {
        document.getElementById('post-tag').value = item.tag || '';
        document.getElementById('post-content').value = item.content || '';
    }

    document.getElementById(`${type}-form-title`).textContent = `Редагувати #${id}`;
    document.getElementById(`${type}-cancel-btn`).classList.remove('hidden');
    document.getElementById(`${type}-form`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm(type) {
    document.getElementById(`${type}-form`).reset();
    document.getElementById(`${type}-id`).value = '';
    document.getElementById(`${type}-form-title`).textContent = type === 'project' ? 'Додати новий проєкт' : 'Додати статтю';
    document.getElementById(`${type}-cancel-btn`).classList.add('hidden');
}

async function removeItem(url) {
    if (confirm('Видалити запис?') && await api(url, 'DELETE')) loadAll();
}

document.getElementById('project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const categoryVal = document.getElementById('project-category').value;
    const body = {
        title: document.getElementById('project-title').value.trim(),
        category_id: categoryVal ? Number(categoryVal) : null,
        client: document.getElementById('project-client').value.trim(),
        tags: document.getElementById('project-tags').value.trim(),
        image_url: document.getElementById('project-image').value.trim(),
        project_link: document.getElementById('project-link').value.trim(),
        description: document.getElementById('project-description').value.trim()
    };
    if (await api(id ? `/api/projects/${id}` : '/api/projects', id ? 'PUT' : 'POST', body)) {
        resetForm('project');
        loadAll();
    }
});

document.getElementById('post-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('post-id').value;
    const body = {
        title: document.getElementById('post-title').value.trim(),
        tag: document.getElementById('post-tag').value.trim(),
        image_url: document.getElementById('post-image').value.trim(),
        content: document.getElementById('post-content').value.trim()
    };
    if (await api(id ? `/api/posts/${id}` : '/api/posts', id ? 'PUT' : 'POST', body)) {
        resetForm('post');
        loadAll();
    }
});

document.getElementById('project-cancel-btn')?.addEventListener('click', () => resetForm('project'));
document.getElementById('post-cancel-btn')?.addEventListener('click', () => resetForm('post'));

document.addEventListener('DOMContentLoaded', loadAll);