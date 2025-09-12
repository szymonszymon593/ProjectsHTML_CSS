// === WSPÓLNY KONTROLER MENU + SEARCH + OVERLAY ===
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  requestAnimationFrame(() => nav && nav.classList.add("visible"));

  const menuToggle = document.querySelector(".menu-small");
  const menuPanel  = document.querySelector(".menu-small-panel");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector('.search-form input[type="search"]');
  const searchWrap  = document.querySelector(".search-wrapper");
  const overlay     = document.querySelector(".overlay");

  if (!menuToggle || !menuPanel || !searchForm || !searchWrap || !overlay) return;

  if (!menuPanel.id) menuPanel.id = "menu-small-panel";
  menuToggle.setAttribute("aria-controls", menuPanel.id);
  menuToggle.setAttribute("aria-expanded", "false");
  menuPanel.setAttribute("aria-hidden", "true");
  searchInput?.setAttribute("aria-expanded", "false");

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

    // 🔥 hamburger kreski = X
    menuToggle.classList.toggle("open", menuOpen);
  };

  const openMenu   = () => { searchOpen = false; searchInput?.blur(); menuOpen = true;  syncClasses(); };
  const closeMenu  = () => { menuOpen = false; syncClasses(); };
  const toggleMenu = () => { menuOpen = !menuOpen; syncClasses(); };

  const openSearch  = () => { menuOpen = false; searchOpen = true;  syncClasses(); };
  const closeSearch = () => { searchOpen = false; searchInput?.blur(); syncClasses(); };
  const toggleSearch = () => { searchOpen = !searchOpen; if (!searchOpen) searchInput?.blur(); syncClasses(); };

  const within = (root, target) => !!root && (root === target || root.contains(target));

  menuToggle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchOpen) {
      openMenu();
    } else {
      toggleMenu();
    }
  }, { passive: false });

  menuPanel.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  }, { passive: true });

  searchInput?.addEventListener("focus", () => openSearch());
  searchInput?.addEventListener("click", (e) => {
    e.stopPropagation();
    openSearch();
  });

  searchWrap.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  }, { passive: true });

  overlay.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menuOpen = false;
    searchOpen = false;
    searchInput?.blur();
    syncClasses();
  }, { passive: false });

  document.addEventListener("pointerdown", (e) => {
    const t = e.target;
    const inMenuArea   = within(menuPanel, t) || within(menuToggle, t);
    const inSearchArea = within(searchWrap, t) || within(searchForm, t);

    if (!inMenuArea && !inSearchArea) {
      if (menuOpen || searchOpen) {
        menuOpen = false;
        searchOpen = false;
        searchInput?.blur();
        syncClasses();
      }
    }
  }, { capture: true });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (menuOpen || searchOpen)) {
      menuOpen = false;
      searchOpen = false;
      searchInput?.blur();
      syncClasses();
      menuToggle.focus?.();
    }
  }, { passive: true });

  let resizeRAF = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(() => {
      if (window.innerWidth > 1110) {
        if (menuOpen || searchOpen) {
          menuOpen = false;
          searchOpen = false;
          searchInput?.blur();
          syncClasses();
        }
      }
    });
  };
  window.addEventListener("resize", onResize, { passive: true });

  const mq = window.matchMedia("(min-width: 1111px)");
  mq.addEventListener?.("change", (e) => {
    if (e.matches && (menuOpen || searchOpen)) {
      menuOpen = false;
      searchOpen = false;
      searchInput?.blur();
      syncClasses();
    }
  });

  syncClasses();
  if (window.innerWidth > 1110) {
    menuOpen = false;
    searchOpen = false;
    searchInput?.blur();
    syncClasses();
  }
});

// lazy load search.js
const searchInput = document.querySelector(".search-form input[type='search']");
if (searchInput) {
  searchInput.addEventListener("focus", () => {
    import("./search.js")
      .then(module => {
        console.log("✅ search.js załadowany");
        module.initSearch();
      })
      .catch(err => console.error("Błąd ładowania search.js:", err));
  });
}
