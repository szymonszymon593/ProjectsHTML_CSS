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

// helper to load a script only once
function loadScriptOnce(src, id, callback) {
  if (document.getElementById(id)) {
    callback && callback();
    return;
  }
  const script = document.createElement("script");
  script.src = src;
  script.id = id;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

// APPLE LOGIN
function initApple() {
  if (window.AppleID && AppleID.auth) {
    AppleID.auth.init({
      clientId: "#",           // TODO: replace with your Apple Service ID
      scope: "name email",
      redirectURI: "#",        // TODO: your backend endpoint
      usePopup: true           // open in a popup rather than redirecting
    });
  }
}

// GOOGLE LOGIN → switched to classic OAuth2 popup
function initGoogle() {
  // nothing to initialise here, kept as an empty function
}

function openGoogleOAuth() {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    client_id: "#", // TODO: replace with your Google client_id
    redirect_uri: "#", // TODO: replace with your backend endpoint
    response_type: "token", // use "code" when you add backend support
    scope: "openid email profile",
    include_granted_scopes: "true",
    prompt: "select_account" // 👈 always forces the account selection screen
  });

  // 🔥 unikalna nazwa popupu za każdym kliknięciem
  const popupName = "googleLogin_" + Date.now();

  window.open(
    `${oauth2Endpoint}?${params.toString()}`,
    popupName,
    "width=500,height=600"
  );
}

// attach events once the DOM has fully loaded
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("google-login");
  const appleBtn = document.getElementById("apple-login");

  if (googleBtn) {
    // on hover → load the Google script (kept for consistency, not essential here)
    googleBtn.addEventListener("mouseenter", () => {
      loadScriptOnce(
        "https://accounts.google.com/gsi/client",
        "google-login-script",
        initGoogle
      );
    });

    // on click → open the classic Google OAuth2 popup
    googleBtn.addEventListener("click", () => {
      openGoogleOAuth();
    });
  }

  if (appleBtn) {
    // on hover → load the Apple script
    appleBtn.addEventListener("mouseenter", () => {
      loadScriptOnce(
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
        "apple-login-script",
        initApple
      );
    });

    // on click → trigger Apple sign-in
    appleBtn.addEventListener("click", () => {
      if (window.AppleID && AppleID.auth) {
        try {
          AppleID.auth.signIn();
        } catch (err) {
          console.error("Apple sign-in error:", err);
        }
      } else {
        console.warn("Apple script is not yet ready.");
      }
    });
  }
});


// scroll reset
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  const signup = document.querySelector(".signup");
  let animated = false; // żeby animacja była tylko raz

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            signup.classList.add("show");
            observer.unobserve(signup);
            animated = true;
          }
        });
      },
      { threshold: 0.4 } 
    );
    observer.observe(signup);
  } else {
    // fallback dla starych Safari
    const onScroll = () => {
      if (animated) return;
      const rect = signup.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // sprawdzamy czy co najmniej 40% elementu jest widoczne
      if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4) {
        signup.classList.add("show");
        animated = true;
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const continents = document.querySelectorAll(".continent");
  const footer = document.querySelector("footer");
  const lastContinent = continents[continents.length - 1];

  const observer = new IntersectionObserver((entries) => {
    // Sortujemy od lewej do prawej wg pozycji X
    const visible = entries
      .filter(entry => entry.isIntersecting && entry.intersectionRatio >= 0.4)
      .sort((a, b) => a.target.getBoundingClientRect().left - b.target.getBoundingClientRect().left);

    visible.forEach((entry, i) => {
      setTimeout(() => {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // tylko raz

        // sprawdzamy, czy to ostatni kontynent
        if (entry.target === lastContinent) {
          footer.classList.add("show");
        }
      }, i * 200); // opóźnienie pomiędzy kolejnymi
    });
  }, { threshold: [0, 0.4] });

  continents.forEach(continent => observer.observe(continent));
});

