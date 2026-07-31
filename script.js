const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const year = document.querySelector("#year");

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;

  menuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");

    menuButton?.setAttribute(
      "aria-expanded",
      "false"
    );
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle(
    "is-scrolled",
    window.scrollY > 8
  );
});

if (year) {
  year.textContent = new Date().getFullYear();
}
const spectacleBanner = document.querySelector("#spectacle-banner");

if (spectacleBanner) {
  spectacleBanner.addEventListener("timeupdate", () => {
    if (spectacleBanner.currentTime >= 10) {
      spectacleBanner.currentTime = 0;
      spectacleBanner.play();
    }
  });
}