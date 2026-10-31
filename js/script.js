const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
if (menuToggle && navMenu) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  const applyTheme = light => {
    document.body.classList.toggle("light-theme", light);
    themeToggle.textContent = light ? "Dark mode" : "Light mode";
    themeToggle.setAttribute("aria-pressed", String(light));
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (_) {}
  applyTheme(savedTheme === "light");
  themeToggle.addEventListener("click", () => {
    const light = !document.body.classList.contains("light-theme");
    applyTheme(light);
    try { localStorage.setItem("portfolio-theme", light ? "light" : "dark"); } catch (_) {}
  });
}
