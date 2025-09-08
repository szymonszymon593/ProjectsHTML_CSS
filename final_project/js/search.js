export async function initSearch() {
    const res = await fetch("./data/words.en.json");
    const data = await res.json();
    console.log("JSON loaded:", data);
  }