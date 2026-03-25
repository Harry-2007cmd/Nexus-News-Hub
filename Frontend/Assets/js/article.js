// ===============================
// ARTICLE PAGE - article.js
// Reads article data passed via sessionStorage from main page
// ===============================

const PLACEHOLDER = "https://placehold.co/900x500/e5e5e5/aaa?text=No+Image";

function capitalize(str) {
  if (!str) return "News";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  if (!dateStr) return "Recently";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1)    return "Just now";
  if (diff < 60)   return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function estimateReadTime(text) {
  if (!text) return "3 min read";
  const words = text.split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// ===============================
// LOAD ARTICLE FROM SESSION
// ===============================
function loadArticle() {
  const raw = sessionStorage.getItem("currentArticle");

  if (!raw) {
    document.querySelector(".article-container").innerHTML = `
      <div class="article-loading">
        <p style="font-size:1.1rem; margin-bottom:12px;">Article not found.</p>
        <button class="back-btn" onclick="window.location.href='index.html'">
          <i class="fa-solid fa-arrow-left"></i> Back to Home
        </button>
      </div>`;
    return;
  }

  const article = JSON.parse(raw);

  // Page title
  document.title = `${article.title || "Article"} - Nexus News Hub`;

  // Category
  const category = capitalize(article.category?.[0] || article.source_id || "News");
  document.getElementById("articleCategory").textContent = category;
  document.getElementById("articleCategoryBreadcrumb").textContent = category;

  // Title
  document.getElementById("articleTitle").textContent = article.title || "Untitled";

  // Meta
  document.getElementById("articleSource").textContent = capitalize(article.source_id || "Unknown Source");
  document.getElementById("articleDate").textContent = `${formatDate(article.pubDate)} · ${timeAgo(article.pubDate)}`;
  document.getElementById("articleReadTime").textContent = estimateReadTime(article.description);

  // Image
  const img = document.getElementById("articleImage");
  img.src = (article.image_url && article.image_url.startsWith("http"))
    ? article.image_url : PLACEHOLDER;
  img.onerror = () => { img.src = PLACEHOLDER; };
  img.alt = article.title || "Article image";

  const caption = document.getElementById("articleImageCaption");
  if (article.image_url) {
    caption.textContent = `Image: ${capitalize(article.source_id || "News Source")}`;
  } else {
    caption.style.display = "none";
  }

  // Description / Lead
  document.getElementById("articleDescription").textContent = article.description || "";

  // Full content (content field from API, or fallback)
  const contentEl = document.getElementById("articleContent");
  if (article.content && article.content !== article.description) {
    const paragraphs = article.content
      .split(/\n+/)
      .filter(p => p.trim().length > 0)
      .map(p => `<p>${p.trim()}</p>`)
      .join("");
    contentEl.innerHTML = paragraphs || "";
  } else {
    contentEl.innerHTML = `<p>For the complete story, please visit the original source below.</p>`;
  }

  // Source link
  const sourceLink = document.getElementById("articleSourceLink");
  sourceLink.href = article.link || "#";

  // Keywords / Tags
  const tagsEl = document.getElementById("articleTags");
  const keywords = article.keywords || article.category || [];
  if (keywords.length) {
    tagsEl.innerHTML = keywords
      .slice(0, 8)
      .map(k => `<span class="article-tag">${capitalize(k)}</span>`)
      .join("");
  }

  // Share buttons
  const pageUrl = encodeURIComponent(article.link || window.location.href);
  const pageTitle = encodeURIComponent(article.title || "");
  document.querySelector(".share-btn.facebook").href =
    `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  document.querySelector(".share-btn.twitter").href =
    `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
  document.querySelector(".share-btn.whatsapp").href =
    `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;

  document.getElementById("copyLinkBtn").addEventListener("click", () => {
    navigator.clipboard.writeText(article.link || window.location.href).then(() => {
      const btn = document.getElementById("copyLinkBtn");
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.background = "#22c55e";
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-link"></i>';
        btn.style.background = "";
      }, 2000);
    });
  });
}

// ===============================
// LOAD RELATED NEWS FROM SESSION
// ===============================
function loadRelated() {
  const raw = sessionStorage.getItem("allArticles");
  const currentRaw = sessionStorage.getItem("currentArticle");
  if (!raw || !currentRaw) return;

  const all = JSON.parse(raw);
  const current = JSON.parse(currentRaw);
  const currentCategory = current.category?.[0] || "";

  // Filter related: same category or different articles, exclude current
  const related = all
    .filter(a => a.link !== current.link)
    .sort((a, b) => {
      const aMatch = a.category?.includes(currentCategory) ? -1 : 0;
      const bMatch = b.category?.includes(currentCategory) ? -1 : 0;
      return aMatch - bMatch;
    })
    .slice(0, 5);

  const container = document.getElementById("relatedNews");
  container.innerHTML = "";

  related.forEach(article => {
    const category = capitalize(article.category?.[0] || article.source_id || "News");
    const imgSrc = (article.image_url && article.image_url.startsWith("http"))
      ? article.image_url : "https://placehold.co/70x55/e5e5e5/aaa?text=News";

    const div = document.createElement("div");
    div.className = "related-item";
    div.innerHTML = `
      <img src="${imgSrc}" alt="" onerror="this.src='https://placehold.co/70x55/e5e5e5/aaa?text=News'">
      <div class="related-item-content">
        <div class="related-item-category">${category}</div>
        <h4>${article.title || ""}</h4>
      </div>
    `;
    div.addEventListener("click", () => {
      sessionStorage.setItem("currentArticle", JSON.stringify(article));
      window.scrollTo(0, 0);
      loadArticle();
      loadRelated();
    });
    container.appendChild(div);
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
loadArticle();
loadRelated();