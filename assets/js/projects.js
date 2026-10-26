// ---- page PROJECTS (9-12 балів: Асинхронне завантаження з JSON) ----

let projectsData = [];

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
const paginationBtns = document.querySelectorAll(".navigation-item[data-page]");
const nextBtn = document.getElementById("nextBtn");

async function loadProjectsData() {
  if (!container) return;

  container.innerHTML = `<p class="loading-message" style="text-align: center; width: 100%;">Завантаження проєктів...</p>`;

  try {
    const response = await fetch('assets/data/projects.json');

    if (!response.ok) {
      throw new Error(`Помилка мережі: ${response.status}`);
    }

    projectsData = await response.json();

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

function filterByCategory(list, category) {
  if (category === "all") return list;
  return list.filter(project => project.category === category);
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
    sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortType === "date-asc") {
    sortedList.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    sortedList.sort((a, b) => a.id - b.id);
  }
  return sortedList;
}

function createCard(project) {
  return `
    <article class="project-item" data-id="${project.id}">
      <img src="${project.image}" alt="${project.title}">
      <div class="project-item-info">
        <div class="project-item-desc">
          <h3 class="title">${project.title}</h3>
          <p class="subtitle">${project.subtitle}</p>
        </div>
        <a href="#" class="icon-link project-link d-flex item-center"
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

function updateActivePagination() {
  paginationBtns.forEach(btn => {
    btn.classList.remove("active");
    if (parseInt(btn.getAttribute("data-page")) === currentPage) {
      btn.classList.add("active");
    }
  });
}

function updatePage() {
  let result = projectsData;

  result = filterByCategory(result, currentFilter);
  result = searchByTitle(result, currentSearch);
  result = sortProjects(result, currentSort);

  showProjects(result);
  updateActivePagination();
}

if (categoryFilters) {
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

if (paginationBtns.length > 0) {
  paginationBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = parseInt(btn.getAttribute("data-page"));
      updatePage();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const totalPages = Math.ceil(projectsData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updatePage();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  });
}

loadProjectsData();