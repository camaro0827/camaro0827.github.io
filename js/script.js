// script.js — one small job: open/close the mobile nav menu.
// Everything else on this site is plain HTML/CSS on purpose,
// so there isn't much JavaScript here yet. Feel free to add more!

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
