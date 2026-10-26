

// ---- page BLOG ----
// 

const blogGrid = document.getElementById('blogGrid');
const paginationBtn = document.querySelectorAll('.navigation-item[data-page]');
const nextBtn = document.getElementById('nextBtn');
const itemPerPage = 6;

let currentPage = 1;
const totalPages = 3;

const blogPosts = [
    { title: "Сучасні рішення для проєктування та ремонту затишної кухні", category: "Дизайн кухні", date: "26 грудня, 2022", image: "assets/images/news-photo-1.png", link: "#" },
    { title: "Бюджетні та актуальні дизайнерські ідеї для оновлення вітальні", category: "Житловий простір", date: "22 грудня, 2022", image: "assets/images/news-photo-2.png", link: "#" },
    { title: "Найкращі практичні рішення для створення сучасних бізнес-просторів", category: "Дизайн інтер'єру", date: "25 грудня, 2022", image: "assets/images/news-photo-3.png", link: "#" },
    { title: "Як ергономічно спланувати кухонну зону та підібрати освітлення", category: "Дизайн кухні", date: "26 грудня, 2022", image: "assets/images/news-photo-4.png", link: "#" },
    { title: "Поєднання текстилю та пастельних відтінків для максимального затишку", category: "Житловий простір", date: "22 грудня, 2022", image: "assets/images/news-photo-5.png", link: "#" },
    { title: "Стильні тенденції вибору натуральних матеріалів для вашого дому", category: "Дизайн інтер'єру", date: "25 грудня, 2022", image: "assets/images/news-photo-6.png", link: "#" },
    
    { title: "Мінімалізм у спальні: правила організації простору", category: "Спальня", date: "15 грудня, 2022", image: "assets/images/news-photo-1.png", link: "#" },
    { title: "Сучасне освітлення: як правильно зонувати світлом", category: "Дизайн інтер'єру", date: "10 грудня, 2022", image: "assets/images/news-photo-2.png", link: "#" },
    { title: "Екологічні матеріали в сучасному інтер'єрі", category: "Житловий простір", date: "05 грудня, 2022", image: "assets/images/news-photo-3.png", link: "#" },
    { title: "Оформлення обідньої зони: поради експертів", category: "Дизайн кухні", date: "01 грудня, 2022", image: "assets/images/news-photo-4.png", link: "#" },
    { title: "Тренди кольорової гами наступного року", category: "Дизайн інтер'єру", date: "28 листопада, 2022", image: "assets/images/news-photo-5.png", link: "#" },
    { title: "Як візуально розширити простір невеликої кімнати", category: "Житловий простір", date: "20 листопада, 2022", image: "assets/images/news-photo-6.png", link: "#" },

    { title: "Секрети затишного освітлення для вечірнього відпочинку", category: "Спальня", date: "15 листопада, 2022", image: "assets/images/news-photo-1.png", link: "#" },
    { title: "Як правильно обрати килим для вітальні", category: "Житловий простір", date: "10 листопада, 2022", image: "assets/images/news-photo-2.png", link: "#" },
];

function renderBlog(pageNumber) {
    if (!blogGrid) return;

    currentPage = pageNumber;
    blogGrid.innerHTML = '';
    const startIndex = (pageNumber - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;

    const pagePosts = blogPosts.slice(startIndex, endIndex);

    pagePosts.forEach(post => {
        const cardHTML = `
            <article class="blog-card">
                <div class="blog-card-image-wrap">
                    <img src="${post.image}" alt="${post.title}" class="blog-card-image">
                    <span class="blog-card-badge">${post.category}</span>
                </div>
                <h3 class="blog-card-title">
                    <a href="${post.link}">${post.title}</a>
                </h3>
                <div class="blog-card-footer d-flex item-center">
                    <time datetime="${post.date}" class="subtitle">${post.date}</time>
                    <a href="${post.link}" class="icon-link d-flex item-center" aria-label="Читати детальніше">
                        <svg width="10" height="18"><use href="assets/images/icons/sprite.svg#arrow-right-icon"></use></svg>
                    </a>
                </div>
            </article>
        `;
        blogGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    updateActiveButton();
}

function updateActiveButton() {
    paginationBtn.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-page')) === currentPage) {
            btn.classList.add('active');
        }
    });
}

if (paginationBtn.length > 0) {
    paginationBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedPage = parseInt(btn.getAttribute('data-page'));
            renderBlog(selectedPage);
        });
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderBlog(currentPage);
        }
    });
}

renderBlog(1);