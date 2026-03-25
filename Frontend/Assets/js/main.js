// ===============================
// CONFIG (newsdata.io)
// ===============================
const API_KEY = "pub_e72aad5422f042a18fcbdc993f98e277";
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

const PLACEHOLDER = "https://placehold.co/600x400/e5e5e5/aaa?text=No+Image";

function safeImg(url) {
  return url && url.startsWith("http") ? url : PLACEHOLDER;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1)    return "Just now";
  if (diff < 60)   return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function capitalize(str) {
  if (!str) return "News";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===============================
// NAVIGATE TO ARTICLE PAGE
// ===============================
function openArticle(article) {
  sessionStorage.setItem("currentArticle", JSON.stringify(article));
  window.location.href = "article.html";
}

// ===============================
// FETCH NEWS
// ===============================
let allArticles = [];

async function fetchNews() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (!data.results || !data.results.length) throw new Error("No results");
    allArticles = data.results;
    sessionStorage.setItem("allArticles", JSON.stringify(allArticles));
    displayBreakingNews(allArticles);
    displayTrending(allArticles);
    displayHero(allArticles);
    displayLatest(allArticles);
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
  articles.slice(0, 5).forEach(article => {
    const views = Math.floor(Math.random() * 10000 + 5000).toLocaleString();
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="article.html">
        <div>
          <div style="font-weight:700;font-family:Arial,sans-serif;font-size:0.88rem;color:var(--text-primary);line-height:1.4;margin-bottom:3px;">${article.title}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);font-family:Arial,sans-serif;">${views} views</div>
        </div>
      </a>
    `;
    li.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      openArticle(article);
    });
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

  heroLink.href = "article.html";
  heroLink.addEventListener("click", (e) => {
    e.preventDefault();
    openArticle(main);
  });

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
    div.style.cursor = "pointer";
    div.addEventListener("click", () => openArticle(article));
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
    card.style.cursor = "pointer";
    card.addEventListener("click", () => openArticle(article));
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
// INIT
// ===============================
fetchNews();