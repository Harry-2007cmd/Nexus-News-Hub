// ===============================
// CONFIG
// ===============================
const API_KEY  = "pub_e72aad5422f042a18fcbdc993f98e277";
const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;
const PLACEHOLDER = "https://placehold.co/600x400/e5e5e5/aaa?text=No+Image";

// ===============================
// CATEGORY META
// ===============================
const CAT_META = {
  politics:      { label: "Politics",      icon: "fa-landmark",     desc: "Government, elections & policy updates" },
  business:      { label: "Business",      icon: "fa-briefcase",    desc: "Markets, economy & corporate news" },
  technology:    { label: "Technology",    icon: "fa-microchip",    desc: "Tech, innovation & digital world" },
  sports:        { label: "Sports",        icon: "fa-futbol",       desc: "Scores, fixtures & sports highlights" },
  entertainment: { label: "Entertainment", icon: "fa-film",         desc: "Movies, music & celebrity news" },
  world:         { label: "World",         icon: "fa-globe",        desc: "International news from around the globe" },
  health:        { label: "Health",        icon: "fa-heart-pulse",  desc: "Wellness, medicine & public health" },
};

// ===============================
// STATE
// ===============================
let allArticles    = [];
let visibleArticles = [];
let displayedCount = 0;
const PAGE_SIZE    = 9;
let currentSort    = "latest";

// ===============================
// URL PARAM
// ===============================
const params   = new URLSearchParams(window.location.search);
const catKey   = (params.get("cat") || "technology").toLowerCase();
const meta     = CAT_META[catKey] || { label: capitalize(catKey), icon: "fa-newspaper", desc: "Latest news" };

// ===============================
// HELPERS
// ===============================
function capitalize(str) {
  if (!str) return "News";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function safeImg(url) {
  return url && url.startsWith("http") ? url : PLACEHOLDER;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1)    return "Just now";
  if (diff < 60)   return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function readTime(text) {
  const words = (text || "").split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

function openArticle(article) {
  sessionStorage.setItem("currentArticle", JSON.stringify(article));
  sessionStorage.setItem("allArticles",    JSON.stringify(allArticles));

  // Track recently viewed
  const recent = JSON.parse(localStorage.getItem("recentArticles") || "[]");
  if (!recent.some(r => r.link === article.link)) {
    recent.unshift(article);
    localStorage.setItem("recentArticles", JSON.stringify(recent.slice(0, 10)));
  }
  const stats = JSON.parse(localStorage.getItem("userStats") || "{}");
  stats.articles = (stats.articles || 0) + 1;
  localStorage.setItem("userStats", JSON.stringify(stats));

  window.location.href = "article.html";
}

// ===============================
// INIT PAGE META
// ===============================
function initPageMeta() {
  document.title = `${meta.label} News - Nexus News Hub`;

  document.getElementById("catIcon").innerHTML       = `<i class="fa-solid ${meta.icon}"></i>`;
  document.getElementById("catHeroTitle").textContent = meta.label + " News";
  document.getElementById("catHeroSub").textContent   = meta.desc;

  // Mark active category link in nav
  document.querySelectorAll(".category-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href.includes(`cat=${catKey}`)) link.classList.add("active");
  });
}

// ===============================
// FETCH
// ===============================
async function fetchCategory() {
  showSkeletons();
  try {
    const url = `${BASE_URL}&category=${catKey}`;
    const res  = await fetch(url);
    const data = await res.json();

    if (!data.results || !data.results.length) throw new Error("No results");

    allArticles     = data.results;
    visibleArticles = [...allArticles];
    displayedCount  = 0;

    document.getElementById("catArticleCount").textContent = allArticles.length + "+";
    document.getElementById("resultsCount").textContent    = `${allArticles.length} articles found`;

    renderTopStory(allArticles[0]);
    renderGrid(false);

  } catch (err) {
    console.error(err);
    document.getElementById("catGrid").innerHTML = `
      <div class="cat-empty">
        <i class="fa-solid fa-circle-exclamation"></i>
        <h3>Could not load articles</h3>
        <p>Check your connection and <a href="" style="color:var(--primary);">try again</a>.</p>
      </div>`;
  }
}

// ===============================
// SKELETONS
// ===============================
function showSkeletons() {
  const grid = document.getElementById("catGrid");
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="cat-card">
      <div class="skeleton sk-img"></div>
      <div class="skeleton sk-badge"></div>
      <div class="skeleton sk-title"></div>
      <div class="skeleton sk-title2"></div>
      <div class="skeleton sk-text"></div>
      <div class="skeleton sk-text2"></div>
    </div>`).join("");
}

// ===============================
// TOP STORY
// ===============================
function renderTopStory(article) {
  if (!article) return;
  const wrap = document.getElementById("topStoryWrap");
  const box  = document.getElementById("topStory");
  wrap.style.display = "block";

  const src  = capitalize(article.source_id || "Source");
  const ago  = timeAgo(article.pubDate);
  const rt   = readTime(article.description);

  box.innerHTML = `
    <div class="top-story-img">
      <img src="${safeImg(article.image_url)}" alt="${article.title || ''}"
           onerror="this.src='${PLACEHOLDER}'">
      <span class="top-story-badge">${meta.label}</span>
      <span class="top-story-featured-label"><i class="fa-solid fa-star"></i> Featured</span>
    </div>
    <div class="top-story-body">
      <div class="top-story-source">
        <i class="fa-solid fa-newspaper"></i> ${src}
      </div>
      <h2 class="top-story-title">${article.title || ""}</h2>
      <p class="top-story-desc">${article.description || ""}</p>
      <div class="top-story-meta">
        <i class="fa-regular fa-clock"></i> ${ago}
        <span class="dot"></span>
        <i class="fa-solid fa-book-open"></i> ${rt} min read
      </div>
      <a class="read-more-link">Read Full Story <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  `;

  box.style.cursor = "pointer";
  box.addEventListener("click", () => openArticle(article));
}

// ===============================
// GRID RENDER
// ===============================
function renderGrid(append = false) {
  const grid = document.getElementById("catGrid");
  if (!append) {
    grid.innerHTML = "";
    displayedCount = 0;
  }

  // Skip first article (used as top story) when not searching/sorting differently
  const startOffset = (!append && displayedCount === 0 && currentSort === "latest") ? 1 : 0;
  const slice = visibleArticles.slice(displayedCount + startOffset, displayedCount + startOffset + PAGE_SIZE);
  displayedCount += slice.length + (append ? 0 : startOffset);

  if (slice.length === 0 && !append) {
    grid.innerHTML = `
      <div class="cat-empty">
        <i class="fa-solid fa-newspaper"></i>
        <h3>No articles found</h3>
        <p>Try adjusting your search or check back later.</p>
      </div>`;
    updateLoadMore(0, 0);
    return;
  }

  slice.forEach((article, idx) => {
    const src  = capitalize(article.source_id || "");
    const ago  = timeAgo(article.pubDate);
    const rt   = readTime(article.description);
    const cat  = capitalize(article.category?.[0] || catKey);

    const card = document.createElement("div");
    card.className = "cat-card";
    card.style.animationDelay = `${(idx % PAGE_SIZE) * 0.05}s`;
    card.innerHTML = `
      <div class="cat-card-img">
        <img src="${safeImg(article.image_url)}" alt="${article.title || ''}"
             loading="lazy" onerror="this.src='${PLACEHOLDER}'">
        <span class="cat-card-badge">${cat}</span>
        <span class="cat-card-time">${ago}</span>
      </div>
      <div class="cat-card-body">
        <div class="cat-card-source"><i class="fa-solid fa-newspaper"></i> ${src}</div>
        <h3 class="cat-card-title">${article.title || ""}</h3>
        <p class="cat-card-desc">${article.description || ""}</p>
        <div class="cat-card-footer">
          <div class="cat-card-footer-left">
            <i class="fa-regular fa-clock"></i> ${ago}
            <span class="cat-card-dot"></span>
            <span>${rt} min read</span>
          </div>
          <button class="cat-card-read-btn">Read <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openArticle(article));
    grid.appendChild(card);
  });

  updateLoadMore(visibleArticles.length, displayedCount);
}

// ===============================
// LOAD MORE
// ===============================
function updateLoadMore(total, shown) {
  const btn = document.getElementById("loadMoreBtn");
  const hasMore = shown < total - 1; // -1 for top story offset
  btn.style.display = hasMore ? "flex" : "none";
}

document.getElementById("loadMoreBtn").addEventListener("click", function () {
  this.innerHTML = `<span class="btn-spinner"></span> Loading...`;
  this.disabled = true;
  setTimeout(() => {
    renderGrid(true);
    this.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Load More`;
    this.disabled = false;
  }, 500);
});

// ===============================
// SORT BUTTONS
// ===============================
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentSort = btn.dataset.sort;

    if (currentSort === "popular") {
      visibleArticles = [...allArticles].sort(() => Math.random() - 0.5);
    } else {
      visibleArticles = [...allArticles];
    }
    renderGrid(false);
  });
});

// ===============================
// SEARCH (within category)
// ===============================
let searchTimeout;
document.getElementById("categorySearch").addEventListener("input", function () {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const q = this.value.toLowerCase().trim();
    if (!q) {
      visibleArticles = [...allArticles];
    } else {
      visibleArticles = allArticles.filter(a =>
        (a.title || "").toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.source_id || "").toLowerCase().includes(q)
      );
    }
    document.getElementById("resultsCount").textContent =
      q ? `${visibleArticles.length} results for "${this.value}"` : `${allArticles.length} articles found`;

    displayedCount = 0;
    renderGrid(false);
  }, 300);
});

// ===============================
// THEME TOGGLE
// ===============================
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
themeToggle.addEventListener("click", () => {
  const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// ===============================
// USER NAV
// ===============================
function updateNavForUser() {
  const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  const navRight = document.querySelector(".nav-right");
  if (!navRight || !userRaw) return;
  const user = JSON.parse(userRaw);
  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "U";
  navRight.querySelector(".btn-secondary")?.remove();
  navRight.querySelector(".btn-primary")?.remove();
  const avatar = document.createElement("div");
  avatar.className = "user-avatar";
  avatar.innerHTML = `
    <span class="avatar-initials">${initials}</span>
    <div class="avatar-dropdown">
      <div class="avatar-name">${user.name || "User"}</div>
      <div class="avatar-email">${user.email || ""}</div>
      <hr style="margin:8px 0;border-color:var(--border);">
      <a href="profile.html" class="dropdown-item"><i class="fa-solid fa-user"></i> My Profile</a>
      <a href="#" class="dropdown-item" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
    </div>`;
  navRight.appendChild(avatar);
  avatar.addEventListener("click", e => { e.stopPropagation(); avatar.classList.toggle("open"); });
  document.addEventListener("click", () => avatar.classList.remove("open"));
  document.getElementById("logoutBtn")?.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.reload();
  });
}

// ===============================
// INIT
// ===============================
initPageMeta();
updateNavForUser();
fetchCategory();