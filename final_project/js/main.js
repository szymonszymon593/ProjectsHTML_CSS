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
  const main = document.querySelector("main");
/*   const deco2 = document.querySelectorAll(".deco2"); */

  requestAnimationFrame(() => {
    nav?.classList.add("visible");
    main?.classList.add("visible");

/*     deco2.forEach(el => el.classList.add("visible")); */
  });
});

/* ===================== */
/*  wrapper screen and main 
let faded = false;
let scrolledToTop = false;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const wrapper = document.querySelector('.wrapper');

  if (scrollY > 200 && !faded) {
    faded = true;
    wrapper.style.transition = 'opacity 0.5s ease';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';

    wrapper.addEventListener('transitionend', function handleTransitionEnd(e) {
      if (e.propertyName === 'opacity') {
        wrapper.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Po zniknięciu wrappera, zacznij nasłuch scrolla do samej góry
        const checkScrollToTop = () => {
          if (window.scrollY === 0 && !scrolledToTop) {
            scrolledToTop = true;
            document.querySelector('main').classList.add('visible');
            document.querySelector('nav').classList.add('visible'); 
            window.removeEventListener('scroll', checkScrollToTop);
          }
        };

        window.addEventListener('scroll', checkScrollToTop);
        // Jeśli już jesteśmy na górze, aktywuj od razu
        checkScrollToTop();

        wrapper.removeEventListener('transitionend', handleTransitionEnd);
      }
    });
  }
});



 */