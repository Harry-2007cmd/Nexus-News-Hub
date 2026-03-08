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
  document.getElementById("darkModeToggle").checked = newTheme === "dark";
});

// ===============================
// LOAD USER
// ===============================
const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");

if (!userRaw) {
  window.location.href = "login.html";
}

const user = JSON.parse(userRaw || "{}");

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatJoinDate(iso) {
  if (!iso) return "Recently";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Populate header
document.getElementById("profileAvatarLarge").textContent = getInitials(user.name);
document.getElementById("profileName").textContent = user.name || "User";
document.getElementById("profileEmail").textContent = user.email || "";
document.getElementById("profileJoined").textContent = user.createdAt
  ? `Member since ${formatJoinDate(user.createdAt)}`
  : "Member";

// Populate account info
document.getElementById("infoName").textContent = user.name || "—";
document.getElementById("infoEmail").textContent = user.email || "—";
document.getElementById("infoSince").textContent = formatJoinDate(user.createdAt);
document.getElementById("infoNewsletter").textContent = user.newsletter ? "✅ Subscribed" : "❌ Not subscribed";

// Preferences
document.getElementById("darkModeToggle").checked = savedTheme === "dark";
document.getElementById("newsletterToggle").checked = !!user.newsletter;

document.getElementById("darkModeToggle").addEventListener("change", function () {
  const newTheme = this.checked ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

document.getElementById("newsletterToggle").addEventListener("change", function () {
  user.newsletter = this.checked;
  saveUser();
});

// ===============================
// STATS (simulated / from localStorage)
// ===============================
const stats = JSON.parse(localStorage.getItem("userStats") || "{}");
document.getElementById("statArticles").textContent = stats.articles || 0;
document.getElementById("statBookmarks").textContent = stats.bookmarks || 0;
document.getElementById("statShared").textContent = stats.shared || 0;
document.getElementById("statStreak").textContent = stats.streak || 1;

// Track article reads
const currentArticle = sessionStorage.getItem("currentArticle");
if (currentArticle) {
  stats.articles = (stats.articles || 0) + 1;
  localStorage.setItem("userStats", JSON.stringify(stats));
}

// ===============================
// INTERESTS
// ===============================
const CATEGORIES = [
  { label: "Politics", icon: "fa-landmark" },
  { label: "Business", icon: "fa-briefcase" },
  { label: "Technology", icon: "fa-microchip" },
  { label: "Sports", icon: "fa-futbol" },
  { label: "Entertainment", icon: "fa-film" },
  { label: "World", icon: "fa-globe" },
  { label: "Health", icon: "fa-heart-pulse" },
  { label: "Science", icon: "fa-flask" },
  { label: "Environment", icon: "fa-leaf" },
  { label: "Education", icon: "fa-graduation-cap" },
];

let selectedInterests = JSON.parse(localStorage.getItem("userInterests") || "[]");

const interestsGrid = document.getElementById("interestsGrid");
CATEGORIES.forEach(cat => {
  const chip = document.createElement("button");
  chip.className = "interest-chip" + (selectedInterests.includes(cat.label) ? " selected" : "");
  chip.innerHTML = `<i class="fa-solid ${cat.icon}"></i> ${cat.label}`;
  chip.addEventListener("click", () => {
    chip.classList.toggle("selected");
    if (chip.classList.contains("selected")) {
      if (!selectedInterests.includes(cat.label)) selectedInterests.push(cat.label);
    } else {
      selectedInterests = selectedInterests.filter(i => i !== cat.label);
    }
  });
  interestsGrid.appendChild(chip);
});

document.getElementById("saveInterestsBtn").addEventListener("click", () => {
  localStorage.setItem("userInterests", JSON.stringify(selectedInterests));
  const btn = document.getElementById("saveInterestsBtn");
  btn.innerHTML = `<i class="fa-solid fa-check"></i> Saved!`;
  btn.style.background = "#22c55e";
  setTimeout(() => {
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Save Interests`;
    btn.style.background = "";
  }, 2000);
});

// ===============================
// RECENTLY VIEWED
// ===============================
const recentlyViewedEl = document.getElementById("recentlyViewed");
const recentArticles = JSON.parse(localStorage.getItem("recentArticles") || "[]");

if (recentArticles.length > 0) {
  recentlyViewedEl.innerHTML = "";
  recentArticles.slice(0, 5).forEach(article => {
    const imgSrc = (article.image_url && article.image_url.startsWith("http"))
      ? article.image_url
      : "https://placehold.co/64x50/e5e5e5/aaa?text=News";
    const cat = article.category?.[0]
      ? article.category[0].charAt(0).toUpperCase() + article.category[0].slice(1)
      : "News";

    const div = document.createElement("div");
    div.className = "recent-item";
    div.innerHTML = `
      <img src="${imgSrc}" alt="" onerror="this.src='https://placehold.co/64x50/e5e5e5/aaa?text=News'">
      <div class="recent-item-text">
        <div class="recent-item-cat">${cat}</div>
        <div class="recent-item-title">${article.title || ""}</div>
      </div>
      <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);font-size:0.75rem;flex-shrink:0;"></i>
    `;
    div.addEventListener("click", () => {
      sessionStorage.setItem("currentArticle", JSON.stringify(article));
      window.location.href = "article.html";
    });
    recentlyViewedEl.appendChild(div);
  });
}

// ===============================
// EDIT PROFILE
// ===============================
const editFormCard = document.getElementById("editFormCard");
const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const editMessage = document.getElementById("editMessage");

editProfileBtn.addEventListener("click", () => {
  editFormCard.style.display = "block";
  document.getElementById("editName").value = user.name || "";
  document.getElementById("editEmail").value = user.email || "";
  editFormCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

cancelEditBtn.addEventListener("click", () => {
  editFormCard.style.display = "none";
});

saveProfileBtn.addEventListener("click", () => {
  const newName = document.getElementById("editName").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();
  const newPassword = document.getElementById("editPassword").value;

  if (!newName || !newEmail) {
    showEditMsg("Name and email are required.", "error");
    return;
  }

  user.name = newName;
  user.email = newEmail;
  if (newPassword) user.password = newPassword;
  saveUser();

  // Update all users list too
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const idx = users.findIndex(u => u.id === user.id);
  if (idx > -1) {
    users[idx] = { ...users[idx], ...user };
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Refresh displayed values
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profileAvatarLarge").textContent = getInitials(user.name);
  document.getElementById("infoName").textContent = user.name;
  document.getElementById("infoEmail").textContent = user.email;

  showEditMsg("Profile updated successfully!", "success");
  setTimeout(() => { editFormCard.style.display = "none"; }, 2000);
});

function showEditMsg(msg, type) {
  editMessage.textContent = msg;
  editMessage.className = `edit-message ${type}`;
  editMessage.style.display = "block";
  setTimeout(() => { editMessage.style.display = "none"; }, 3500);
}

function saveUser() {
  if (localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }
}

// ===============================
// LOGOUT
// ===============================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
  window.location.href = "index.html";
});