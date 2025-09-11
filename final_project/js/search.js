export async function initSearch() {
  const res = await fetch("./data/words.en.json");
  const data = await res.json();
  console.log("JSON loaded:", data);

  const input = document.querySelector('.search-form input[type="search"]');
  const resultsList = document.querySelector('.search-results');

  let allCities = [];
  for (const letter in data) {
    allCities.push(...data[letter]);
  }

  let debounceTimer;
  let activeIndex = -1;

  // pokaż randomowe wyniki na starcie
  showRandomResults();

  // pokaż randomowe wyniki jeśli input pusty i user klika focus
  input.addEventListener("focus", () => {
    if (!input.value) {
      showRandomResults();
    }
  });

  // input wpisywany przez usera
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim().toLowerCase();
      if (query) {
        showResults(query);
      } else {
        showRandomResults();
      }
    }, 10);
  });

  // obsługa klawiatury
  input.addEventListener("keydown", (e) => {
    const items = resultsList.querySelectorAll(".result-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActive(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActive(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        items[activeIndex].querySelector("a").click();
      }
    }
  });

  function updateActive(items) {
    items.forEach((item, i) => {
      if (i === activeIndex) {
        item.classList.add("active");
        item.setAttribute("aria-selected", "true");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      }
    });
  }

  function renderResults(list) {
    resultsList.innerHTML = "";
    activeIndex = -1;

    for (const { city, country } of list) {
      const li = document.createElement("li");
      li.className = "result-item";
      li.setAttribute("role", "option");

      const span = document.createElement("span");
      const link = document.createElement("a");
      link.href = "#";
      link.target = "_blank";
      link.textContent = `${city}, ${country}`;

      span.appendChild(link);
      li.appendChild(span);

      li.addEventListener("mouseover", () => {
        activeIndex = Array.from(resultsList.children).indexOf(li);
        updateActive(resultsList.querySelectorAll(".result-item"));
      });

      li.addEventListener("click", (e) => {
        e.preventDefault();
        input.value = city;
        resultsList.innerHTML = "";
      });

      resultsList.appendChild(li);
    }

    // 🔥 zawsze ustaw pierwszy wynik jako aktywny z animacją
    const items = resultsList.querySelectorAll(".result-item");
    if (items.length > 0) {
      activeIndex = 0;

      // usuwamy klasę, wymuszamy reflow, dodajemy ponownie → animacja zawsze się odpali
      const firstItem = items[0];
      firstItem.classList.remove("active");
      void firstItem.offsetWidth; // hack na reflow
      updateActive(items);
    }
  }

  function showResults(query) {
    let filtered = allCities.filter(({ city }) =>
      city.toLowerCase().startsWith(query)
    );

    filtered.sort((a, b) => a.city.localeCompare(b.city));

    renderResults(filtered.slice(0, 6));
  }

  function showRandomResults() {
    let shuffled = [...allCities].sort(() => Math.random() - 0.5);
    renderResults(shuffled.slice(0, 10));
  }
}
