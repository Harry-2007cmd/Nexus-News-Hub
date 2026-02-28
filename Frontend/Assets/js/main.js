// ===============================
// CONFIG (newsdata.io)
// ===============================
const API_KEY = "pub_85f5b9939ead4fbe89849263f29b69e7";
const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;

// ===============================
// DOM ELEMENTS
// ===============================
const ticker        = document.getElementById("ticker");
const trendingList  = document.getElementById("trendingList");
const heroImage     = document.getElementById("heroImage");
const heroTitle     = document.getElementById("heroTitle");
const heroExcerpt   = document.getElementById("heroExcerpt");
const heroCategory  = document.getElementById("heroCategory");
const heroLink      = document.getElementById("heroLink");
const secondaryNews = document.getElementById("secondaryNews");
const newsGrid      = document.getElementById("newsGrid");

// Fallback placeholder
const PLACEHOLDER = "https://placehold.co/600x400/e5e5e5/aaa?text=No+Image";

function safeImg(url) {
  return url && url.startsWith("http") ? url : PLACEHOLDER;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1)  return "Just now";
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function capitalize(str) {
  if (!str) return "News";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===============================
// FETCH NEWS
// ===============================
async function fetchNews() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (!data.results || !data.results.length) throw new Error("No results");
    displayBreakingNews(data.results);
    displayTrending(data.results);
    displayHero(data.results);
    displayLatest(data.results);
  } catch (error) {
    console.error("Fetch error:", error);
    if (ticker) ticker.textContent = "Failed to load news. Please try again later.";
  }
}

// ===============================
// BREAKING NEWS TICKER
// ===============================
function displayBreakingNews(articles) {
  const headlines = articles
    .slice(0, 8)
    .map(a => a.title)
    .join("   ⚡   ");
  ticker.textContent = headlines || "No breaking news available.";
}

// ===============================
// TRENDING SIDEBAR
// ===============================
function displayTrending(articles) {
  trendingList.innerHTML = "";
  articles.slice(0, 5).forEach((article, i) => {
    const views = Math.floor(Math.random() * 10000 + 5000).toLocaleString();
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${article.link}" target="_blank" rel="noopener">
        <div>
          <div style="font-weight:700; font-family:Arial,sans-serif; font-size:0.88rem; color:var(--text-primary); line-height:1.4; margin-bottom:3px;">${article.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); font-family:Arial,sans-serif;">${views} views</div>
        </div>
      </a>
    `;
    trendingList.appendChild(li);
  });
}

// ===============================
// HERO SECTION
// ===============================
function displayHero(articles) {
  const main = articles[0];
  if (!main) return;

  heroImage.src = safeImg(main.image_url);
  heroImage.onerror = () => { heroImage.src = PLACEHOLDER; };
  heroTitle.textContent = main.title || "";
  heroExcerpt.textContent = main.description || "";
  heroCategory.textContent = capitalize(main.category?.[0] || "Top News");
  heroLink.href = main.link || "#";

  secondaryNews.innerHTML = "";
  articles.slice(1, 4).forEach(article => {
    const category = capitalize(article.category?.[0] || article.source_id || "News");
    const desc = article.description || "";
    const div = document.createElement("div");
    div.className = "secondary-card";
    div.innerHTML = `
      <img src="${safeImg(article.image_url)}" alt="" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
      <span class="card-badge">${category}</span>
      <h4>${article.title || ""}</h4>
      ${desc ? `<p>${desc.slice(0, 80)}${desc.length > 80 ? "..." : ""}</p>` : ""}
    `;
    div.addEventListener("click", () => window.open(article.link, "_blank", "noopener"));
    secondaryNews.appendChild(div);
  });
}

// ===============================
// LATEST NEWS GRID
// ===============================
function displayLatest(articles) {
  newsGrid.innerHTML = "";
  articles.slice(4, 14).forEach(article => {
    const category = capitalize(article.category?.[0] || article.source_id || "News");
    const desc = article.description || "";
    const ago = timeAgo(article.pubDate);
    const readTime = Math.ceil((desc.split(" ").length || 50) / 200) + Math.floor(Math.random() * 3 + 2);

    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${safeImg(article.image_url)}" alt="" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
      <div class="news-card-content">
        <span class="news-category">${category}</span>
        <h3>${article.title || ""}</h3>
        <p>${desc || ""}</p>
        <div class="news-card-meta">
          <span>${ago}</span>
          <span class="dot"></span>
          <span>${readTime} min read</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => window.open(article.link, "_blank", "noopener"));
    newsGrid.appendChild(card);
  });
}

// ===============================
// THEME TOGGLE
// ===============================
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// ===============================
// CATEGORY NAV ACTIVE STATE
// ===============================
document.querySelectorAll(".category-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".category-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// ===============================
// SEARCH (filter loaded articles)
// ===============================
const searchInput = document.querySelector(".search-input");
let allArticles = [];

const _origFetch = fetchNews;
async function fetchNews() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (!data.results || !data.results.length) throw new Error("No results");
    allArticles = data.results;
    displayBreakingNews(allArticles);
    displayTrending(allArticles);
    displayHero(allArticles);
    displayLatest(allArticles);
  } catch (error) {
    console.error("Fetch error:", error);
    if (ticker) ticker.textContent = "Failed to load news. Please try again later.";
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q || !allArticles.length) {
      if (allArticles.length) displayLatest(allArticles);
      return;
    }
    const filtered = allArticles.filter(a =>
      (a.title || "").toLowerCase().includes(q) ||
      (a.description || "").toLowerCase().includes(q)
    );
    displayLatest(filtered);
  });
}

// ===============================
// INIT
// ===============================
fetchNews();