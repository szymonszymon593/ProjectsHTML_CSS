// === Scroll na górę (jak u Ciebie) ===
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.addEventListener("load", () => {
  setTimeout(() => window.scrollTo(0, 0), 10);
});
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// === Główna inicjalizacja ===
window.addEventListener("DOMContentLoaded", () => {
  // 1) Wejście animacji nav
  const nav = document.querySelector("nav");
  requestAnimationFrame(() => nav && nav.classList.add("visible"));

  // 2) Menu mobilne
  const toggle = document.querySelector(".menu-small");
  const panel  = document.querySelector(".menu-small-panel");

  // Jeżeli nie ma elementów, nic nie rób (bez błędów w konsoli)
  if (!toggle || !panel) return;

  // ID panelu do aria (jeśli brak)
  if (!panel.id) panel.id = "menu-small-panel";
  // A11y
  toggle.setAttribute("aria-controls", panel.id);
  toggle.setAttribute("aria-expanded", "false");
  panel.setAttribute("aria-hidden", "true");

  const supportsPointer = "PointerEvent" in window;

  // Fallback na openMenu/closeMenu (gdy masz swoje gdzieś indziej — to je wywoła)
  const externalOpenMenu  = typeof window.openMenu  === "function" ? window.openMenu  : null;
  const externalCloseMenu = typeof window.closeMenu === "function" ? window.closeMenu : null;
  const overlay = document.querySelector(".overlay");

  const isOpen = () => panel.classList.contains("active");

  const setOpen = (open) => {
    panel.classList.toggle("active", open);
    overlay?.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    // zewnętrzne hooki, jeśli masz
    if (open) externalOpenMenu?.();
    else externalCloseMenu?.();
  };

  const getTarget = (e) => (e.composedPath ? e.composedPath()[0] : e.target);
  const isOutside = (el) => {
    if (!el) return true;
    // gdyby zniknęły elementy w locie
    if (!panel || !toggle) return true;
    return !panel.contains(el) && !toggle.contains(el);
  };

  function openClose(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setOpen(!isOpen());
  }

  function closeIfOutside(e) {
    const t = getTarget(e);
    if (isOpen() && isOutside(t)) setOpen(false);
  }

  function onEsc(e) {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus?.();
    }
  }

  // --- Listenery na przełączniku ---
  if (supportsPointer) {
    // UWAGA: nie dajemy passive:true, bo używamy preventDefault
    toggle.addEventListener("pointerdown", openClose, { passive: false });
    // klik w panelu nie zamyka
    panel.addEventListener("pointerdown", (e) => e.stopPropagation(), { passive: true });
  } else {
    toggle.addEventListener("touchstart", openClose, { passive: false });
    panel.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
    // rezerwa dla bardzo starych przeglądarek
    toggle.addEventListener("click", (e) => { e.preventDefault(); openClose(e); }, { passive: false });
  }

  // --- Zamknięcie na klik poza (capture, jak u Ciebie) + ESC ---
  if (supportsPointer) {
    document.addEventListener("pointerdown", closeIfOutside, { capture: true, passive: true });
    document.addEventListener("click", (e) => closeIfOutside(e), { capture: true });
  } else {
    document.addEventListener("touchstart", closeIfOutside, { capture: true, passive: true });
    document.addEventListener("click", (e) => closeIfOutside(e), { capture: true });
  }
  document.addEventListener("keydown", onEsc, { passive: true });

  // --- Reset na szerokim ekranie (lekko bezpieczniej) ---
  let resizeRAF = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(() => {
      if (window.innerWidth > 1110 && isOpen()) setOpen(false);
    });
  };
  window.addEventListener("resize", onResize, { passive: true });
});

// ELEMENTY
const input = document.querySelector('.search-form input[type="search"]');
const wrapper = document.querySelector('.search-wrapper');

if (input && wrapper) {
  const openSearch = () => {
    wrapper.classList.add('active');
    input.setAttribute('aria-expanded', 'true');
  };

  const closeSearch = () => {
    wrapper.classList.remove('active');
    input.setAttribute('aria-expanded', 'false');
  };

  // Otwórz po kliknięciu/fokusie w input
  input.addEventListener('focus', openSearch);
  input.addEventListener('click', openSearch);

  // Zamknij kliknięciem poza inputem i wrapperem
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !wrapper.contains(e.target)) {
      closeSearch();
    }
  });

  // Esc zamyka
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  // --- NOWE: zamykaj po zmianie rozmiaru okna (debounce) ---
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      closeSearch();
    }, 150); // lekki debounce, żeby nie spamować podczas przeciągania
  });

  // Dodatkowo: zmiana orientacji (mobile/tablety)
  window.addEventListener('orientationchange', closeSearch);

  // Opcjonalnie: jeśli masz breakpoint w CSS (np. max-width: 1110px), to też nasłuchuj:
  const mql = window.matchMedia('(max-width: 1110px)');
  if (mql.addEventListener) {
    mql.addEventListener('change', () => closeSearch());
  } else if (mql.addListener) {
    // starsze przeglądarki
    mql.addListener(() => closeSearch());
  }
}

