const iconBlock = document.getElementById('iconBlock');
const iconOpen = document.getElementById('iconOpen');
const iconClose = document.getElementById('iconClose');
const mainMenu = document.getElementById('mainMenu');

if (iconBlock && mainMenu) {
    iconBlock.addEventListener('click', () => {
        mainMenu.classList.toggle('menu-open');
        
        if (iconOpen && iconClose) {
            iconOpen.classList.toggle('d-none');
            iconClose.classList.toggle('d-none');
        }
    });
}

const loginBtn = document.getElementById('loginBtn');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

if (loginBtn && modal) {
    loginBtn.addEventListener('click', () => {
        modal.classList.remove('d-none');
    });
}

if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.classList.add('d-none');
    });
}

if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('d-none');
        }
    });
}


const animatedItems = document.querySelectorAll('.fade');

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15});

animatedItems.forEach(item => {
    scrollObserver.observe(item);
});


// ---- page PROJECTS: ----
// -- filtering and searching projects --

const projectsData = [
    {
        id: 1,
        title: "Сучасна затишна спальня",
        category: "bedroom",
        categoryName: "Спальня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-1.png",
        date: "2024-03-15"
    },
    {
        id: 2,
        title: "Мінімалістична спальня",
        category: "bedroom",
        categoryName: "Спальня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-2.png",
        date: "2024-02-10"
    },
    {
        id: 3,
        title: "Класична ванна кімната",
        category: "bathroom",
        categoryName: "Ванна кімната",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-3.png",
        date: "2024-01-20"
    },
    {
        id: 4,
        title: "Світла спальна зона",
        category: "bedroom",
        categoryName: "Спальня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-4.png",
        date: "2023-11-05"
    },
    {
        id: 5,
        title: "Сучасна кухня-їдальня",
        category: "kitchen",
        categoryName: "Кухня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-5.png",
        date: "2024-04-01"
    },
    {
        id: 6,
        title: "Ергономічна кухня",
        category: "kitchen",
        categoryName: "Кухня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-6.png",
        date: "2023-12-18"
    },
    {
        id: 7,
        title: "Простора вітальня",
        category: "living-room",
        categoryName: "Вітальня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-7.png",
        date: "2024-02-28"
    },
    {
        id: 8,
        title: "Затишна зона відпочинку",
        category: "living-room",
        categoryName: "Вітальня",
        subtitle: "Декор / Архітектура",
        image: "assets/images/projects-photo-8.png",
        date: "2023-10-12"
    }
];

// 1. Поточний стан (Single Source of Truth)
const state = {
    projects: projectsData, // Початковий масив проєктів
    filter: 'all',
    search: '',
    sort: 'default'
};

// 2. Чиста функція фільтрації та сортування
function filterProjects(list, { filter, search, sort }) {
    if (!list) return [];

    return list
        .filter(item => filter === 'all' || item.category === filter)
        .filter(item => {
            const query = (search || '').toLowerCase().trim();
            return item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query);
        })
        .sort((a, b) => {
            if (sort === 'title-asc') return a.title.localeCompare(b.title, 'uk');
            if (sort === 'title-desc') return b.title.localeCompare(a.title, 'uk');
            if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
            return a.id - b.id;
        });
}

// Допоміжна функція генерації HTML колонок
function createColumnHTML(columnProjects) {
    if (!columnProjects || columnProjects.length === 0) return '';

    const cardsHTML = columnProjects.map(project => `
        <article class="project-item" data-id="${project.id}">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-item-info">
                <div class="project-item-desc">
                    <h3 class="title">${project.title}</h3>
                    <p class="subtitle">${project.subtitle}</p>
                </div>
                <a href="#" class="icon-link project-link d-flex item-center" aria-label="Переглянути проєкт ${project.title}">
                    <img src="assets/images/icons/arrow-right-icon.svg" alt="Стрілка переходу" class="arrow-right-btn">
                </a>
            </div> 
        </article>
    `).join('');

    return `<div class="projects-column d-flex">${cardsHTML}</div>`;
}

function renderUI() {
    const container = document.getElementById('projectsContainer');
    const noResults = document.getElementById('noResults');

    if (!container) return; 

    const visibleProjects = filterProjects(state.projects, state);

    if (visibleProjects.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.classList.remove('d-none');
        return;
    }

    if (noResults) noResults.classList.add('d-none');

    const leftColumn = visibleProjects.filter((_, index) => index % 2 === 0);
    const rightColumn = visibleProjects.filter((_, index) => index % 2 !== 0);

    container.innerHTML = createColumnHTML(leftColumn) + createColumnHTML(rightColumn);
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryFilters = document.getElementById('categoryFilters');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-item');
            if (!btn) return;

            categoryFilters.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            state.filter = btn.dataset.category || 'all';
            renderUI();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.search = e.target.value;
            renderUI();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sort = e.target.value;
            renderUI();
        });
    }
    renderUI();
});