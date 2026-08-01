const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const year = document.querySelector("#year");

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll("video").forEach((video) => {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
});

const parallaxPieces = document.querySelectorAll(".parallax-piece");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let parallaxFrameRequested = false;

function updateParallax() {
  const viewportHeight = window.innerHeight;
  parallaxPieces.forEach((piece) => {
    const speed = Number.parseFloat(piece.dataset.speed) || 0;
    const rect = piece.getBoundingClientRect();
    const rawOffset = (rect.top + rect.height / 2 - viewportHeight / 2) * speed;
    const limitedOffset = Math.max(-36, Math.min(36, rawOffset));
    piece.style.setProperty("--parallax-offset", `${limitedOffset}px`);
  });
  parallaxFrameRequested = false;
}

function requestParallaxUpdate() {
  if (reduceMotion.matches || window.innerWidth <= 760 || parallaxFrameRequested || parallaxPieces.length === 0) return;
  parallaxFrameRequested = true;
  window.requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
requestParallaxUpdate();
