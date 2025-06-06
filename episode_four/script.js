function smoothScrollTo(targetElement, duration = 800) {
    const start = window.scrollY || window.pageYOffset;
    const distance = targetElement.getBoundingClientRect().top;
    const startTime = performance.now();

    function easeInOutQuad(t) {
      return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
    }

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      window.scrollTo(0, start + distance * ease);
      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }

  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function () {
      const id = this.dataset.target;
      const target = document.getElementById(id);
      if (target) {
        smoothScrollTo(target, 1000); // <- Średnio szybkie przewijanie
      }
    });
  });

  // Scroll-up button logic
const scrollUpBtn = document.querySelector('.scrollup');

// Pokaż przycisk po przescrollowaniu X pikseli
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollUpBtn.style.display = 'block';
  } else {
    scrollUpBtn.style.display = 'none';
  }
});

// Scrollowanie do góry po kliknięciu
scrollUpBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
