const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const $ = (id) => document.getElementById(id);
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
        $(`tab-${btn.dataset.tab}`)?.classList.add('active');
    };
});

async function loadAll() {
    const [categories, projects, posts, contacts] = await Promise.all([
        api('/api/projects/categories'),
        api('/api/projects'),
        api('/api/posts'),
        api('/api/contact')
    ]);

    if (categories && $('project-category')) {
        $('project-category').innerHTML =
            '<option value="">Без категорії</option>' +
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    if (projects && $('projects-table-body')) {
        data.projects = projects;
        $('projects-table-body').innerHTML = projects.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image_url}" class="table-thumb"></td>
                <td>${p.title}</td>
                <td>${p.category_name || 'Без категорії'}</td>
                <td class="actions-cell">
                    <button type="button" class="btn-edit" onclick="fillForm('project', '${p.id}')">Редагувати</button>
                    <button type="button" class="btn-delete" onclick="removeItem('/api/projects/${p.id}')">Видалити</button>
                </td>
            </tr>`).join('');
    }

    if (posts && $('posts-table-body')) {
        data.posts = posts;
        $('posts-table-body').innerHTML = posts.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>${p.tag || '—'}</td>
                <td>${new Date(p.created_at).toLocaleDateString('uk-UA')}</td>
                <td class="actions-cell">
                    <button type="button" class="btn-edit" onclick="fillForm('post', '${p.id}')">Редагувати</button>
                    <button type="button" class="btn-delete" onclick="removeItem('/api/posts/${p.id}')">Видалити</button>
                </td>
            </tr>`).join('');
    }

    if (contacts && $('contacts-table-body')) {
        $('contacts-table-body').innerHTML = contacts.map(c => `
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

    $(`${type}-id`).value = item.id;
    $(`${type}-title`).value = item.title;
    $(`${type}-image`).value = item.image_url || '';

    if (type === 'project') {
        $('project-category').value = item.category_id || '';
    } else {
        $('post-tag').value = item.tag || '';
        $('post-content').value = item.content || '';
    }

    $(`${type}-form-title`).textContent = `Редагувати #${id}`;
    $(`${type}-cancel-btn`).classList.remove('hidden');
    $(`${type}-form`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm(type) {
    $(`${type}-form`).reset();
    $(`${type}-id`).value = '';
    $(`${type}-form-title`).textContent = type === 'project' ? 'Додати новий проєкт' : 'Додати статтю';
    $(`${type}-cancel-btn`).classList.add('hidden');
}

async function removeItem(url) {
    if (confirm('Видалити запис?') && await api(url, 'DELETE')) loadAll();
}

$('project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('project-id').value;
    const categoryVal = $('project-category').value;
    const body = {
        title: $('project-title').value.trim(),
        category_id: categoryVal ? Number(categoryVal) : null,
        image_url: $('project-image').value.trim()
    };
    if (await api(id ? `/api/projects/${id}` : '/api/projects', id ? 'PUT' : 'POST', body)) {
        resetForm('project');
        loadAll();
    }
});

$('post-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('post-id').value;
    const body = {
        title: $('post-title').value.trim(),
        tag: $('post-tag').value.trim(),
        image_url: $('post-image').value.trim(),
        content: $('post-content').value.trim()
    };
    if (await api(id ? `/api/posts/${id}` : '/api/posts', id ? 'PUT' : 'POST', body)) {
        resetForm('post');
        loadAll();
    }
});

$('project-cancel-btn')?.addEventListener('click', () => resetForm('project'));
$('post-cancel-btn')?.addEventListener('click', () => resetForm('post'));

document.addEventListener('DOMContentLoaded', loadAll);