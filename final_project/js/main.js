// Wyłącz automatyczne przywracanie scrolla przez przeglądarkę
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  // Scroll resetowany z małym opóźnieniem – działa niezawodnie w Chrome/Firefox
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);
});
// Dla pewności przed odświeżeniem
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
/*   const deco2 = document.querySelectorAll(".deco2"); */

  requestAnimationFrame(() => {
    nav?.classList.add("visible");
/*     deco2.forEach(el => el.classList.add("visible")); */
  });
});
const toggle = document.querySelector('.menu-small');
const panel = document.querySelector('.menu-small-panel');

toggle.addEventListener('click', () => {
  panel.classList.toggle('active');
});

// Reset przy przejściu na duży ekran
window.addEventListener('resize', () => {
  if (window.innerWidth > 1110) {
    panel.classList.remove('active');
  }
});
