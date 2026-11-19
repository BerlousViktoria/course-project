let projectsData = [];
let filteredProjects = [];
let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";
let currentPage = 1;
const itemsPerPage = 4;

const container = document.getElementById("projectsContainer");
const noResults = document.getElementById("noResults");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const paginationNav = document.querySelector(".navigation");

// | -- фільтрація, сортування, пошук -- |

function filterByCategory(list, category) {
  if (category === "all") return list;
  return list.filter(project => project.category_slug === category);
}

function searchByTitle(list, text) {
  const query = text.toLowerCase().trim();
  return list.filter(project => project.title.toLowerCase().includes(query));
}

function sortProjects(list, sortType) {
  const sortedList = list.slice();

  if (sortType === "title-asc") {
    sortedList.sort((a, b) => a.title.localeCompare(b.title, "uk"));
  } else if (sortType === "title-desc") {
    sortedList.sort((a, b) => b.title.localeCompare(a.title, "uk"));
  } else if (sortType === "date-desc") {
    sortedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortType === "date-asc") {
    sortedList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else {
    sortedList.sort((a, b) => Number(a.id) - Number(b.id));
  }
  return sortedList;
}

// | --- рендер категорій, карток та пагінації --- |

function renderCategoryButtons(categories) {
  if (!categoryFilters) return;

  let buttonsHtml = `<button type="button" class="filter-item active" data-category="all">Усі</button>`;
  categories.forEach(cat => {
    buttonsHtml += `<button type="button" class="filter-item" data-category="${cat.slug}">${cat.name}</button>`;
  });

  categoryFilters.innerHTML = buttonsHtml;

  const filterButtons = categoryFilters.querySelectorAll(".filter-item");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      currentFilter = button.dataset.category;
      currentPage = 1;
      updatePage();
    });
  });
}

function createCard(project) {
  const subtitle = project.category_name || project.description || "";
  return `
    <article class="project-item" data-id="${project.id}">
      <img src="${project.image_url}" alt="${project.title}">
      <div class="project-item-info">
        <div class="project-item-desc">
          <h3 class="title">${project.title}</h3>
          <p class="subtitle">${subtitle}</p>
        </div>
        <a href="404.html" class="icon-link project-link d-flex item-center"
           aria-label="Переглянути проєкт ${project.title}">
          <svg width="10" height="20" class="arrow-right-btn"><use href="assets/images/icons/sprite.svg#arrow-right-icon"></use></svg>
        </a>
      </div>
    </article>
  `;
}

function showProjects(list) {
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = "";
    if (noResults) noResults.classList.remove("d-none");
    return;
  }

  if (noResults) noResults.classList.add("d-none");

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedList = list.slice(startIndex, endIndex);

  let leftColumn = "";
  let rightColumn = "";

  for (let i = 0; i < paginatedList.length; i++) {
    const card = createCard(paginatedList[i]);
    if (i % 2 === 0) {
      leftColumn += card;
    } else {
      rightColumn += card;
    }
  }

  let html = `<div class="projects-column d-flex">${leftColumn}</div>`;
  if (rightColumn !== "") {
    html += `<div class="projects-column d-flex">${rightColumn}</div>`;
  }

  container.innerHTML = html;
}

function renderPagination(totalItems) {
  if (!paginationNav) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) {
    paginationNav.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    const label = String(i).padStart(2, "0");
    const activeClass = i === currentPage ? "active" : "";
    html += `<a href="#" class="navigation-item ${activeClass}" data-page="${i}">${label}</a>`;
  }

  if (currentPage < totalPages) {
    html += `
      <a href="#" class="navigation-item icon-link" id="nextBtn" aria-label="Наступна сторінка">
        <svg width="10" height="18"><use href="assets/images/icons/sprite.svg#arrow-right-icon"></use></svg>
      </a>
    `;
  }

  paginationNav.innerHTML = html;

  paginationNav.querySelectorAll(".navigation-item[data-page]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = parseInt(btn.getAttribute("data-page"));
      updatePage();
      window.scrollTo({ top: 300, behavior: "smooth" });
    });
  });

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        updatePage();
        window.scrollTo({ top: 300, behavior: "smooth" });
      }
    });
  }
}

// | --- головна функція --- |

function updatePage() {
  let result = projectsData;

  result = filterByCategory(result, currentFilter);
  result = searchByTitle(result, currentSearch);
  result = sortProjects(result, currentSort);

  filteredProjects = result;
  showProjects(filteredProjects);
  renderPagination(filteredProjects.length);
}

// | --- асинхронне завантаження з бекенду --- |

async function loadProjectsData() {
  if (!container) return;

  container.innerHTML = `<p class="loading-message" style="text-align: center; width: 100%;">Завантаження проєктів...</p>`;

  try {
    const [projectsRes, categoriesRes] = await Promise.all([
      fetch("/api/projects"),
      fetch("/api/projects/categories")
    ]);

    if (!projectsRes.ok || !categoriesRes.ok) {
      throw new Error(`Помилка мережі: ${projectsRes.status}`);
    }

    projectsData = await projectsRes.json();
    const categories = await categoriesRes.json();

    renderCategoryButtons(categories);
    updatePage();
  } catch (error) {
    console.error("Не вдалося завантажити дані:", error);
    container.innerHTML = `
      <p class="error-message" style="color: red; text-align: center; width: 100%;">
        Виникла помилка під час завантаження даних. Будь ласка, спробуйте пізніше.
      </p>
    `;
  }
}

// | --- слухачі подій --- |

if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value;
    currentPage = 1;
    updatePage();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    updatePage();
  });
}

// --- запуск ---

loadProjectsData();