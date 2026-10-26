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

const loginBtn = document.querySelectorAll(".loginBtn");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");

loginBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    modal.classList.remove("d-none");
  });
});

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


// modal check

const form = document.getElementById("modal-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

const incorrectUsername = document.getElementById("incorrectUsername");
const incorrectEmail = document.getElementById("incorrectEmail");
const incorrectPassword = document.getElementById("incorrectPassword");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  if (!username.checkValidity()) {
    incorrectUsername.classList.remove("d-none");
    isValid = false;
  } else {
    incorrectUsername.classList.add("d-none");
  }

  if (!email.checkValidity()) {
    incorrectEmail.classList.remove("d-none");
    isValid = false;
  } else {
    incorrectEmail.classList.add("d-none");
  }

  const specialCharRegex = /[-=\/?]/;
  if (!specialCharRegex.test(password.value)) {
    incorrectPassword.classList.remove("d-none");
    isValid = false;
  } else {
    incorrectPassword.classList.add("d-none");
  }

  if (isValid) {
    console.log("Форма успішно пройшла перевірку!");
  }
});