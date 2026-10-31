// Small, dependency-free interactions. Respect reduced-motion preferences.
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
if (menuToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(".page-heading, .prose > *, .card, .contact-list li, .home-hero > div, .embed");
  targets.forEach(target => target.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        if (!entry.target.closest(".skills-grid")) observer.unobserve(entry.target);
      } else if (entry.target.closest(".skills-grid")) {
        entry.target.classList.remove("in-view");
      }
    });
  }, { threshold: .08, rootMargin: "0px 0px -30px 0px" });
  targets.forEach(target => observer.observe(target));
  document.body.classList.add("motion-ready");
}
if (!reduceMotion) {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  let scheduled = false;
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (total > 0 ? Math.min(1,window.scrollY / total) : 0) + ")";
    scheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

/* Switch between existing published Google Docs, without cloning their content. */
const documentViewer = document.querySelector("[data-document-viewer]");
if (documentViewer) {
  const tabs = Array.from(documentViewer.querySelectorAll("[role=tab]"));
  const frame = documentViewer.querySelector("[data-doc-frame]");
  const panel = documentViewer.querySelector("[role=tabpanel]");
  const label = documentViewer.querySelector("[data-doc-label]");
  const open = documentViewer.querySelector("[data-doc-open]");
  const expand = documentViewer.querySelector("[data-doc-expand]");
  function chooseDoc(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tab.id);
    const title = tab.dataset.docTitle;
    const url = tab.dataset.docUrl;
    frame.src = url + "?embedded=true";
    frame.title = title + " Google Doc";
    label.textContent = "Showing: " + title;
    open.href = url;
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => chooseDoc(tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      chooseDoc(tabs[next], true);
    });
  });
  expand.addEventListener("click", () => {
    const expanded = documentViewer.classList.toggle("is-expanded");
    expand.textContent = expanded ? "Collapse preview" : "Expand preview";
    expand.setAttribute("aria-pressed", String(expanded));
  });
}
