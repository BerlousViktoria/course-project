const blogGrid = document.getElementById('blogGrid');
const paginationNav = document.querySelector('.navigation');
const itemsPerPage = 6;

let blogPosts = [];
let currentPage = 1;

function renderBlog(page) {
  if (!blogGrid) return;
  currentPage = page;

  if (!blogPosts.length) {
    blogGrid.innerHTML = '<p>Статей поки немає.</p>';
    paginationNav.innerHTML = '';
    return;
  }

  const start = (page - 1) * itemsPerPage;
  const pagePosts = blogPosts.slice(start, start + itemsPerPage);

  blogGrid.innerHTML = pagePosts.map(post => {
    const d = new Date(post.created_at);
    const date = `${d.toLocaleString('uk-UA', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`;
    return `
      <article class="blog-card" data-id="${post.id}">
        <div class="blog-card-image-wrap">
          <img src="${post.image_url}" alt="${post.title}" class="blog-card-image">
          <span class="blog-card-badge">${post.tag || ''}</span>
        </div>
        <h3 class="blog-card-title">
          <a href="404.html">${post.title}</a>
        </h3>
        <div class="blog-card-footer d-flex item-center">
          <time datetime="${post.created_at}" class="subtitle">${date}</time>
          <a href="404.html" class="icon-link d-flex item-center" aria-label="Перейти до Статті">
            <svg width="10" height="18"><use href="assets/images/icons/sprite.svg#arrow-right-icon"></use></svg>
          </a>
        </div>
      </article>
    `;
  }).join('');

  renderPagination();
}

function renderPagination() {
  if (!paginationNav) return;
  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);

  if (totalPages <= 1) {
    paginationNav.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<a href="#" class="navigation-item ${i === currentPage ? 'active' : ''}" data-page="${i}">0${i}</a>`;
  }

  paginationNav.innerHTML = html;

  paginationNav.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderBlog(Number(btn.dataset.page));
    });
  });
}

async function initBlog() {
  try {
    const res = await fetch('/api/posts');
    blogPosts = await res.json();
    renderBlog(1);
  } catch (err) {
    blogGrid.innerHTML = '<p>Помилка завантаження статей.</p>';
  }
}

initBlog();