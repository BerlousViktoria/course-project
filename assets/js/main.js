const iconBlock = document.getElementById("iconBlock");
const iconOpen = document.getElementById("iconOpen");
const iconClose = document.getElementById("iconClose");
const mainMenu = document.getElementById("mainMenu");

if (iconBlock && mainMenu) {
  iconBlock.addEventListener("click", () => {
    mainMenu.classList.toggle("menu-open");

    if (iconOpen && iconClose) {
      iconOpen.classList.toggle("d-none");
      iconClose.classList.toggle("d-none");
    }
  });
}

const loginBtn = document.getElementById("loginBtn");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");

if (loginBtn && modal) {
  loginBtn.addEventListener("click", () => {
    modal.classList.remove("d-none");
  });
}

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.classList.add("d-none");
  });
}

if (modal) {
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("d-none");
    }
  });
}

const animatedItems = document.querySelectorAll(".fade");

const scrollObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

animatedItems.forEach((item) => {
  scrollObserver.observe(item);
});

// ---- page PROJECTS: ----
// -- filtering and searching projects --

const projectsData = [
    {
        id: 1,
        title: "Сучасна затишна спальня",
        category: "bedroom",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-1.png",
        date: "2024-03-15",
    },
    {
        id: 2,
        title: "Мінімалістична спальня",
        category: "bedroom",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-2.png",
        date: "2024-02-10",
    },
    {
        id: 3,
        title: "Класична ванна кімната",
        category: "bathroom",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-3.png",
        date: "2024-01-20",
    },
    {
        id: 4,
        title: "Світла спальна зона",
        category: "bedroom",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-4.png",
        date: "2023-11-05",
    },
    {
        id: 5,
        title: "Сучасна кухня-їдальня",
        category: "kitchen",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-5.png",
        date: "2024-04-01",
    },
    {
        id: 6,
        title: "Ергономічна кухня",
        category: "kitchen",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-6.png",
        date: "2023-12-18",
    },
    {
        id: 7,
        title: "Простора вітальня",
        category: "living-room",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-7.png",
        date: "2024-02-28",
    },
    {
        id: 8,
        title: "Затишна зона відпочинку",
        category: "living-room",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-8.png",
        date: "2023-10-12",
    },
];


let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";

const container = document.getElementById("projectsContainer");
const noResults = document.getElementById("noResults");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");


function filterByCategory(list, category) {
  if (category === "all") {
    return list;
  }
  
  return list.filter(function (project) {
    return project.category === category;
  });
}

function searchByTitle(list, text) {
  const query = text.toLowerCase().trim();
  return list.filter(function (project) {
    return project.title.toLowerCase().includes(query);
  });
}

function sortProjects(list, sortType) {
  if (sortType === "title-asc") {
    list.sort(function (a, b) {
      return a.title.localeCompare(b.title, "uk");
    });
  } else if (sortType === "title-desc") {
    list.sort(function (a, b) {
      return b.title.localeCompare(a.title, "uk");
    });
  } else if (sortType === "date-desc") {
    list.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  } else if (sortType === "date-asc") {
    list.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
  } else {
    list.sort(function (a, b) {
      return a.id - b.id;
    });
  }
  return list;
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
          <img src="assets/images/icons/arrow-right-icon.svg" alt="" class="arrow-right-btn">
        </a>
      </div>
    </article>
  `;
}

function showProjects(list) {
  if (list.length === 0) {
    container.innerHTML = "";
    noResults.classList.remove("d-none");
    return;
  }

  noResults.classList.add("d-none");

  let leftColumn = "";
  let rightColumn = "";

  for (let i = 0; i < list.length; i++) {
    const card = createCard(list[i]);

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

function updatePage() {
  let result = projectsData;

  result = filterByCategory(result, currentFilter);
  result = searchByTitle(result, currentSearch);
  result = sortProjects(result, currentSort);

  showProjects(result);
}

const filterButtons = categoryFilters.querySelectorAll(".filter-item");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    button.classList.add("active");

    currentFilter = button.dataset.category;
    updatePage();
  });
});

searchInput.addEventListener("input", function () {
  currentSearch = searchInput.value;
  updatePage();
});

sortSelect.addEventListener("change", function () {
  currentSort = sortSelect.value;
  updatePage();
});

updatePage();