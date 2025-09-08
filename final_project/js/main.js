// === WSPÓLNY KONTROLER MENU + SEARCH + OVERLAY ===
window.addEventListener("DOMContentLoaded", () => {
  // elementy
  const nav = document.querySelector("nav");
  requestAnimationFrame(() => nav && nav.classList.add("visible"));

  const menuToggle = document.querySelector(".menu-small");
  const menuPanel  = document.querySelector(".menu-small-panel");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector('.search-form input[type="search"]');
  const searchWrap  = document.querySelector(".search-wrapper");
  const overlay     = document.querySelector(".overlay");

  // Jeżeli czegokolwiek kluczowego brakuje — wychodzimy bez błędów
  if (!menuToggle || !menuPanel || !searchForm || !searchWrap || !overlay) return;

  // A11y (bezpiecznie, jeśli brak id)
  if (!menuPanel.id) menuPanel.id = "menu-small-panel";
  menuToggle.setAttribute("aria-controls", menuPanel.id);
  menuToggle.setAttribute("aria-expanded", "false");
  menuPanel.setAttribute("aria-hidden", "true");
  searchInput?.setAttribute("aria-expanded", "false");

  // --- STAN ---
  let menuOpen = false;
  let searchOpen = false;

  const syncClasses = () => {
    menuPanel.classList.toggle("active", menuOpen);
    menuToggle.setAttribute("aria-expanded", String(menuOpen));
    menuPanel.setAttribute("aria-hidden", String(!menuOpen));

    searchWrap.classList.toggle("active", searchOpen);
    searchInput?.setAttribute("aria-expanded", String(searchOpen));

    const showOverlay = menuOpen || searchOpen;
    overlay.classList.toggle("active", showOverlay);
  };

  // --- FUNKCJE (mutual exclusive openers) ---
  const openMenu   = () => { searchOpen = false; searchInput?.blur(); menuOpen = true;  syncClasses(); };
  const closeMenu  = () => { menuOpen = false; syncClasses(); };
  const toggleMenu = () => { menuOpen = !menuOpen; syncClasses(); };

  const openSearch  = () => { menuOpen = false; searchOpen = true;  syncClasses(); };
  const closeSearch = () => { searchOpen = false; searchInput?.blur(); syncClasses(); };
  const toggleSearch = () => { searchOpen = !searchOpen; if (!searchOpen) searchInput?.blur(); syncClasses(); };

  // pomocnicze: sprawdzanie, czy klik wewnątrz danego obszaru
  const within = (root, target) => !!root && (root === target || root.contains(target));

  // --- ZDARZENIA ---

  // 1) Menu toggle: jeśli search otwarty → przełącz na menu
  menuToggle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchOpen) {
      openMenu(); // switch: search -> menu (overlay zostaje)
    } else {
      toggleMenu();
    }
  }, { passive: false });

  // 2) Klik w menuPanel nie „przecieka”
  menuPanel.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  }, { passive: true });

  // 3) Search input otwiera search (zamyka menu)
  searchInput?.addEventListener("focus", () => openSearch());
  searchInput?.addEventListener("click", (e) => {
    e.stopPropagation();
    openSearch();
  });

  // 4) Klik w search wrapper nie zamyka nic
  searchWrap.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  }, { passive: true });

  // 5) Klik w overlay — zamyka wszystko
  overlay.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menuOpen = false;
    searchOpen = false;
    searchInput?.blur(); // <<< tutaj dodane
    syncClasses();
  }, { passive: false });

  // 6) Globalny klik poza — zamyka oba
  document.addEventListener("pointerdown", (e) => {
    const t = e.target;
    const inMenuArea   = within(menuPanel, t) || within(menuToggle, t);
    const inSearchArea = within(searchWrap, t) || within(searchForm, t);

    if (!inMenuArea && !inSearchArea) {
      if (menuOpen || searchOpen) {
        menuOpen = false;
        searchOpen = false;
        searchInput?.blur(); // <<< tutaj dodane
        syncClasses();
      }
    }
  }, { capture: true });

  // 7) ESC zamyka wszystko
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (menuOpen || searchOpen)) {
      menuOpen = false;
      searchOpen = false;
      searchInput?.blur(); // <<< tutaj dodane
      syncClasses();
      menuToggle.focus?.();
    }
  }, { passive: true });

  // 8) Resize: powyżej 1110px zamykamy results i menu → overlay też znika
  let resizeRAF = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(() => {
      if (window.innerWidth > 1110) {
        if (menuOpen || searchOpen) {
          menuOpen = false;
          searchOpen = false;
          searchInput?.blur(); // <<< tutaj dodane
          syncClasses();
        }
      }
    });
  };
  window.addEventListener("resize", onResize, { passive: true });

  // Media query fallback (np. zoom/devtools)
  const mq = window.matchMedia("(min-width: 1111px)");
  mq.addEventListener?.("change", (e) => {
    if (e.matches && (menuOpen || searchOpen)) {
      menuOpen = false;
      searchOpen = false;
      searchInput?.blur(); // <<< tutaj dodane
      syncClasses();
    }
  });

  // startowy sync + ewentualne domknięcie, jeśli start szeroko
  syncClasses();
  if (window.innerWidth > 1110) {
    menuOpen = false;
    searchOpen = false;
    searchInput?.blur();
    syncClasses();
  }
});

const searchInput = document.querySelector(".search-form input[type='search']");

if (searchInput) {
  searchInput.addEventListener("focus", () => {
    import("./search.js")
      .then(module => {
        console.log("✅ search.js załadowany");
        module.initSearch(); // wywoła funkcję z search.js
      })
      .catch(err => console.error("Błąd ładowania search.js:", err));
  });
}