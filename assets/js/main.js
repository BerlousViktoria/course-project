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