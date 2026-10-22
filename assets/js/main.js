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