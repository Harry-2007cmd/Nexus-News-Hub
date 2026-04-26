// ===============================
// CONFIG (newsdata.io)
// ===============================
const API_KEY = "pub_bff503765abd457d8f914d1be47d9207";
const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;

// ===============================
// STATE
// ===============================
let allArticles = [];
let filteredArticles = [];
let displayedCount = 0;
const PAGE_SIZE = 10;
let activeCategory = "Home";

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
  sessionStorage.setItem("allArticles", JSON.stringify(allArticles));
  window.location.href = "article.html";
}

// ===============================
// FETCH NEWS
// ===============================
async function fetchNews(categoryParam = "") {
  showSkeletons();
  try {
    let url = BASE_URL;
    if (categoryParam && categoryParam !== "home") {
      url += `&category=${categoryParam}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || !data.results.length) throw new Error("No results");
    allArticles = data.results;
    filteredArticles = [...allArticles];
    sessionStorage.setItem("allArticles", JSON.stringify(allArticles));
    displayBreakingNews(allArticles);
    displayTrending(allArticles);
    displayHero(allArticles);
    displayedCount = 0;
    displayLatest(filteredArticles, false);
  } catch (error) {
    console.error("Fetch error:", error);
    if (ticker) ticker.textContent = "Failed to load news. Please try again later.";
    if (newsGrid) newsGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
        <i class="fa-solid fa-circle-exclamation" style="font-size:3rem;margin-bottom:16px;opacity:0.4;display:block;"></i>
        <p style="font-size:1.1rem;font-weight:600;margin-bottom:8px;">Could not load news</p>
        <p style="font-size:0.9rem;">Please check your connection and try again.</p>
        <button onclick="fetchNews()" style="margin-top:16px;padding:10px 24px;background:var(--primary);color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;">Retry</button>
      </div>`;
  }
}

// ===============================
// SKELETON LOADERS
// ===============================
function showSkeletons() {
  if (!newsGrid) return;
  newsGrid.innerHTML = Array(6).fill(0).map(() => `
    <div class="news-card skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="news-card-content">
        <div class="skeleton skeleton-badge"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-title" style="width:75%"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width:60%"></div>
      </div>
    </div>
  `).join("");
}

// ===============================
// BREAKING NEWS TICKER
// ===============================
function displayBreakingNews(articles) {
  const headlines = articles.slice(0, 8).map(a => a.title).join("   ⚡   ");
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
          <div style="font-size:0.75rem;color:var(--text-muted);font-family:Arial,sans-serif;"><i class="fa-solid fa-fire" style="color:var(--primary);margin-right:4px;"></i>${views} views</div>
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
  heroLink.onclick = (e) => { e.preventDefault(); openArticle(main); };

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
function displayLatest(articles, append = false) {
  if (!append) {
    newsGrid.innerHTML = "";
    displayedCount = 0;
  }

  const startOffset = (!append && displayedCount === 0 && articles === filteredArticles && !document.querySelector(".search-input")?.value.trim()) ? 4 : 0;
  const slice = articles.slice(displayedCount + startOffset, displayedCount + startOffset + PAGE_SIZE);
  displayedCount += slice.length + (append ? 0 : startOffset);

  if (slice.length === 0 && !append) {
    newsGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
        <i class="fa-solid fa-newspaper" style="font-size:3rem;margin-bottom:16px;opacity:0.3;display:block;"></i>
        <p style="font-size:1.1rem;font-weight:600;">No articles found</p>
      </div>`;
    updateLoadMoreBtn(articles, 0);
    return;
  }

  slice.forEach(article => {
    const category = capitalize(article.category?.[0] || article.source_id || "News");
    const desc = article.description || "";
    const ago = timeAgo(article.pubDate);
    const readTime = Math.ceil((desc.split(" ").length || 50) / 200) + Math.floor(Math.random() * 3 + 2);
    const source = capitalize(article.source_id || "");

    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <div class="news-card-img-wrap">
        <img src="${safeImg(article.image_url)}" alt="${article.title || ''}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
        <span class="news-category">${category}</span>
      </div>
      <div class="news-card-content">
        <h3>${article.title || ""}</h3>
        <p>${desc}</p>
        <div class="news-card-meta">
          <span class="meta-source"><i class="fa-solid fa-newspaper"></i> ${source}</span>
          <span class="dot"></span>
          <span><i class="fa-regular fa-clock"></i> ${ago}</span>
          <span class="dot"></span>
          <span>${readTime} min read</span>
        </div>
      </div>
    `;
    card.style.cursor = "pointer";
    card.addEventListener("click", () => openArticle(article));

    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    newsGrid.appendChild(card);
    requestAnimationFrame(() => {
      card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  });

  updateLoadMoreBtn(articles, displayedCount);
}

// ===============================
// LOAD MORE BUTTON
// ===============================
function updateLoadMoreBtn(articles, shown) {
  let btn = document.getElementById("loadMoreBtn");
  const total = (articles || filteredArticles).length;
  const hasMore = shown < total - 4;

  if (hasMore) {
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "loadMoreBtn";
      btn.className = "load-more-btn";
      document.querySelector(".news-grid")?.appendChild(btn);
    }
    btn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Load More Stories`;
    btn.disabled = false;
    btn.style.display = "";
    btn.onclick = () => {
      btn.innerHTML = `<span class="btn-spinner"></span> Loading...`;
      btn.disabled = true;
      setTimeout(() => displayLatest(filteredArticles, true), 400);
    };
  } else if (btn) {
    btn.style.display = "none";
  }
}

// ===============================
// CATEGORY FILTERING
// ===============================
const CATEGORY_MAP = {
  "Home":          "",
  "Politics":      "politics",
  "Business":      "business",
  "Technology":    "technology",
  "Sports":        "sports",
  "Entertainment": "entertainment",
  "World":         "world",
  "Health":        "health",
};

document.querySelectorAll(".category-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const label = link.textContent.trim();
    if (label === activeCategory) return;
    activeCategory = label;

    document.querySelectorAll(".category-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const si = document.querySelector(".search-input");
    if (si) si.value = "";

    const catParam = CATEGORY_MAP[label] || "";
    fetchNews(catParam);
  });
});

// ===============================
// SEARCH
// ===============================
const searchInput = document.querySelector(".search-input");
if (searchInput) {
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const q = searchInput.value.toLowerCase().trim();

      if (!q) {
        filteredArticles = [...allArticles];
        displayHero(allArticles);
        displayLatest(filteredArticles, false);
        return;
      }

      filteredArticles = allArticles.filter(a =>
        (a.title || "").toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.category || []).join(" ").toLowerCase().includes(q) ||
        (a.source_id || "").toLowerCase().includes(q)
      );

      if (filteredArticles.length > 0) displayHero(filteredArticles);

      newsGrid.innerHTML = "";
      displayedCount = 0;

      if (filteredArticles.length === 0) {
        newsGrid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
            <i class="fa-solid fa-newspaper" style="font-size:3rem;margin-bottom:16px;opacity:0.3;display:block;"></i>
            <p style="font-size:1.1rem;font-weight:600;margin-bottom:8px;">No results for "${searchInput.value}"</p>
            <p style="font-size:0.9rem;">Try different keywords or browse a category above.</p>
          </div>`;
        return;
      }

      const slice = filteredArticles.slice(0, PAGE_SIZE);
      displayedCount = slice.length;
      slice.forEach(article => {
        const category = capitalize(article.category?.[0] || article.source_id || "News");
        const desc = article.description || "";
        const ago = timeAgo(article.pubDate);
        const readTime = Math.ceil((desc.split(" ").length || 50) / 200) + Math.floor(Math.random() * 3 + 2);
        const source = capitalize(article.source_id || "");
        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
          <div class="news-card-img-wrap">
            <img src="${safeImg(article.image_url)}" alt="" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
            <span class="news-category">${category}</span>
          </div>
          <div class="news-card-content">
            <h3>${article.title || ""}</h3>
            <p>${desc}</p>
            <div class="news-card-meta">
              <span class="meta-source"><i class="fa-solid fa-newspaper"></i> ${source}</span>
              <span class="dot"></span>
              <span><i class="fa-regular fa-clock"></i> ${ago}</span>
              <span class="dot"></span>
              <span>${readTime} min read</span>
            </div>
          </div>
        `;
        card.style.cursor = "pointer";
        card.addEventListener("click", () => openArticle(article));
        newsGrid.appendChild(card);
      });
      updateLoadMoreBtn(filteredArticles, displayedCount);
    }, 300);
  });
}

// ===============================
// USER PROFILE NAV
// ===============================
function updateNavForUser() {
  const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  const navRight = document.querySelector(".nav-right");
  if (!navRight) return;

  if (userRaw) {
    const user = JSON.parse(userRaw);
    const initials = user.name
      ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";

    // Remove login/signup buttons
    navRight.querySelector(".btn-secondary")?.remove();
    navRight.querySelector(".btn-primary")?.remove();

    // Subscribe button
    const subBtn = document.createElement("button");
    subBtn.className = "btn-primary";
    subBtn.innerHTML = '<i class="fa-solid fa-crown" style="margin-right:5px;"></i> Subscribe';
    subBtn.onclick = () => window.location.href = "subscription.html";
    navRight.appendChild(subBtn);

    // Avatar dropdown
    const avatar = document.createElement("div");
    avatar.className = "user-avatar";
    avatar.innerHTML = `
      <span class="avatar-initials">${initials}</span>
      <div class="avatar-dropdown">
        <div class="avatar-name">${user.name || "User"}</div>
        <div class="avatar-email">${user.email || ""}</div>
        <hr style="margin:8px 0;border-color:var(--border);">
        <a href="profile.html" class="dropdown-item"><i class="fa-solid fa-user"></i> My Profile</a>
        <a href="subscription.html" class="dropdown-item"><i class="fa-solid fa-crown"></i> Subscription</a>
        <a href="#" class="dropdown-item" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
      </div>
    `;
    navRight.appendChild(avatar);

    avatar.addEventListener("click", (e) => {
      e.stopPropagation();
      avatar.classList.toggle("open");
    });
    document.addEventListener("click", () => avatar.classList.remove("open"));

    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
      window.location.reload();
    });
  }
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
updateNavForUser();
fetchNews();