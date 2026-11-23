const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
const html = document.documentElement;
const header = $(".site-header");
const progress = $("#scrollProgress");
const backToTop = $("#backToTop");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.dataset.theme = savedTheme;
$("#themeToggle").addEventListener("click", () => {
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("theme", next);
  $("#themeToggle").setAttribute(
    "aria-label",
    next === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
});

const navToggle = $(".nav-toggle"),
  navLinks = $(".nav-links");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
$$(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }),
);

function updateScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  backToTop.classList.toggle("visible", y > 600);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (y / scrollable) * 100 : 0;
  progress.style.width = percentage + "%";
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();
backToTop.addEventListener("click", () =>
  window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  }),
);

const sections = $$("main section[id]");
const navLinksMap = $$(".nav-link");
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinksMap.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      }
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);
sections.forEach((section) => activeObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target,
          target = Number(el.dataset.counter),
          suffix = el.dataset.suffix || "";
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
          el.textContent = target + suffix;
        } else {
          const start = performance.now(),
            duration = 1200;
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        counterObserver.unobserve(el);
      }
    }),
  { threshold: 0.6 },
);
$$("[data-counter]").forEach((el) => counterObserver.observe(el));

$$(".skill-card-header").forEach((button) =>
  button.addEventListener("click", () => {
    const card = button.closest(".skill-card"),
      open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.querySelector("i").textContent = open ? "＋" : "−";
    card.classList.toggle("collapsed", open);
  }),
);
$$(".filter-btn").forEach((button) =>
  button.addEventListener("click", () => {
    $$(".filter-btn").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    $$(".skill-card").forEach((card) =>
      card.classList.toggle(
        "hidden",
        filter !== "all" && card.dataset.category !== filter,
      ),
    );
  }),
);

$$(".experience-header").forEach((button) =>
  button.addEventListener("click", () => {
    const card = button.closest(".experience-card"),
      content = $(".experience-content", card),
      open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    $(".expand-icon", button).textContent = open ? "＋" : "−";
    content.hidden = open;
    if (open) card.closest(".timeline-item").classList.remove("open");
    else card.closest(".timeline-item").classList.add("open");
  }),
);

$$(".flow-node").forEach((node) =>
  node.addEventListener("click", () => {
    $$(".flow-node").forEach((n) => n.classList.remove("active"));
    node.classList.add("active");
    $("#architectureDetail").textContent = node.dataset.detail;
  }),
);

$("#copyEmail").addEventListener("click", async () => {
  const button = $("#copyEmail"),
    email = "rishav.28.kundu@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    button.textContent = "Email copied ✓";
    const toast = $("#toast");
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 2200);
    setTimeout(() => (button.textContent = "Copy email address"), 2200);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});
$("#year").textContent = new Date().getFullYear();
