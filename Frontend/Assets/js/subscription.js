// ===============================
// SUBSCRIPTION PAGE - subscription.js
// ===============================

// ── Theme Toggle ────────────────────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
themeToggle.addEventListener("click", () => {
  const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// ── User Nav ─────────────────────────────────────────────────────────────────
function updateNavForUser() {
  const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  const navRight = document.getElementById("navRight");
  if (!navRight || !userRaw) return;

  const user = JSON.parse(userRaw);
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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

// ── Current Plan Banner ───────────────────────────────────────────────────────
function showCurrentPlanBanner() {
  const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (!userRaw) return;

  const user = JSON.parse(userRaw);
  const plan = user.subscription?.plan || "free";
  const banner = document.getElementById("currentPlanBanner");
  const label  = document.getElementById("currentPlanLabel");

  const planLabels = { free: "Free", monthly: "Monthly (₹200/mo)", yearly: "Annual (₹2,000/yr)" };
  label.textContent = planLabels[plan] || "Free";
  banner.classList.add("show");

  // Mark the current plan card / button
  if (plan === "monthly") {
    document.getElementById("ctaMonthly").textContent = "✓ Current Plan";
    document.getElementById("ctaMonthly").className = "plan-cta cta-current";
  } else if (plan === "yearly") {
    document.getElementById("ctaYearly").innerHTML = "✓ Current Plan";
    document.getElementById("ctaYearly").className = "plan-cta cta-current";
  } else {
    document.getElementById("ctaFree").innerHTML = '<i class="fa-solid fa-check"></i> Current Plan';
    document.getElementById("ctaFree").className = "plan-cta cta-current";
  }
}

// ── Billing Toggle ─────────────────────────────────────────────────────────
const billingToggle = document.getElementById("billingToggle");
const labelMonthly  = document.getElementById("labelMonthly");
const labelYearly   = document.getElementById("labelYearly");

billingToggle.addEventListener("change", () => {
  const yearly = billingToggle.checked;

  labelMonthly.classList.toggle("active", !yearly);
  labelYearly.classList.toggle("active", yearly);

  // Update monthly card to show yearly-equivalent price
  const monthlyPriceEl  = document.getElementById("monthlyPrice");
  const monthlyPeriodEl = document.getElementById("monthlyPeriod");
  const monthlySavings  = document.getElementById("monthlySavings");

  if (yearly) {
    monthlyPriceEl.textContent  = "167";
    monthlyPeriodEl.textContent = "per month, billed annually";
    monthlySavings.textContent  = "Billed as ₹2,000/year";
    monthlySavings.classList.remove("hidden");
  } else {
    monthlyPriceEl.textContent  = "200";
    monthlyPeriodEl.textContent = "per month";
    monthlySavings.classList.add("hidden");
  }
});

// ── FAQ Accordion ─────────────────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");

  // Close all
  document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));

  // Toggle clicked
  if (!isOpen) item.classList.add("open");
}

// ── Free Plan CTA ─────────────────────────────────────────────────────────
function handleFree() {
  const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (!userRaw) {
    window.location.href = "login.html";
    return;
  }
  window.location.href = "index.html";
}

// ── Modal ─────────────────────────────────────────────────────────────────
let activePlan = "monthly";

function openModal(plan) {
  // Must be logged in
  const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (!userRaw) {
    window.location.href = "login.html";
    return;
  }

  activePlan = plan;
  const modal   = document.getElementById("paymentModal");
  const badge   = document.getElementById("modalPlanBadge");
  const title   = document.getElementById("modalTitle");
  const sub     = document.getElementById("modalSubtitle");
  const total   = document.getElementById("modalTotalAmount");
  const submitBtn = document.getElementById("modalSubmitBtn");

  // Reset form view
  document.getElementById("modalFormView").style.display  = "block";
  document.getElementById("modalSuccessView").classList.remove("show");
  document.getElementById("cardName").value   = "";
  document.getElementById("cardNumber").value = "";
  document.getElementById("cardExpiry").value = "";
  document.getElementById("cardCvv").value    = "";

  if (plan === "monthly") {
    badge.innerHTML    = '<i class="fa-solid fa-bolt"></i> Monthly Plan';
    title.textContent  = "Complete Your Subscription";
    sub.textContent    = "Unlimited access, billed monthly. Cancel anytime.";
    total.textContent  = "₹200";
    submitBtn.className = "modal-submit";
    submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay ₹200 & Activate';
  } else {
    badge.innerHTML    = '<i class="fa-solid fa-crown"></i> Annual Plan';
    title.textContent  = "Complete Your Annual Subscription";
    sub.textContent    = "Best value — 2 months free. Save ₹400 this year.";
    total.textContent  = "₹2,000";
    submitBtn.className = "modal-submit yearly-submit";
    submitBtn.innerHTML = '<i class="fa-solid fa-crown"></i> Pay ₹2,000 & Activate';
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("paymentModal").classList.remove("open");
  document.body.style.overflow = "";
}

// Close on overlay click
document.getElementById("paymentModal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

// Close on Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// ── Card Input Formatting ─────────────────────────────────────────────────
document.getElementById("cardNumber").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 16);
  this.value = v.replace(/(.{4})/g, "$1 ").trim();
});

document.getElementById("cardExpiry").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
  this.value = v;
});

document.getElementById("cardCvv").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 4);
});

// ── Process Payment (demo) ─────────────────────────────────────────────────
function processPayment() {
  const name   = document.getElementById("cardName").value.trim();
  const number = document.getElementById("cardNumber").value.replace(/\s/g, "");
  const expiry = document.getElementById("cardExpiry").value.trim();
  const cvv    = document.getElementById("cardCvv").value.trim();

  if (!name)                        return shake("cardName",   "Please enter the cardholder name.");
  if (number.length < 16)           return shake("cardNumber", "Please enter a valid 16-digit card number.");
  if (expiry.replace(/\s/g,"").length < 5) return shake("cardExpiry", "Please enter a valid expiry date.");
  if (cvv.length < 3)               return shake("cardCvv",   "Please enter a valid CVV.");

  const btn = document.getElementById("modalSubmitBtn");
  btn.innerHTML = '<span class="btn-spinner" style="width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.75s linear infinite;display:inline-block;"></span> Processing...';
  btn.disabled = true;

  setTimeout(() => {
    saveSubscription(activePlan);
    showSuccess(activePlan);
  }, 1800);
}

function shake(inputId, msg) {
  const el = document.getElementById(inputId);
  el.style.borderColor = "#ef4444";
  el.style.animation = "none";
  el.focus();
  // Re-trigger animation
  requestAnimationFrame(() => {
    el.style.animation = "shakeInput 0.4s ease";
  });
  el.addEventListener("animationend", () => {
    el.style.animation = "";
    el.style.borderColor = "";
  }, { once: true });
}

// ── Save Subscription to User ─────────────────────────────────────────────
function saveSubscription(plan) {
  const key     = localStorage.getItem("currentUser") ? "localStorage" : "sessionStorage";
  const storage = key === "localStorage" ? localStorage : sessionStorage;
  const user    = JSON.parse(storage.getItem("currentUser") || "{}");

  user.subscription = {
    plan,
    startDate: new Date().toISOString(),
    amount: plan === "monthly" ? 200 : 2000,
    billing: plan === "monthly" ? "monthly" : "yearly"
  };

  storage.setItem("currentUser", JSON.stringify(user));

  // Also update in users array
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const idx   = users.findIndex(u => u.id === user.id);
  if (idx > -1) {
    users[idx] = { ...users[idx], subscription: user.subscription };
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// ── Show Success ──────────────────────────────────────────────────────────
function showSuccess(plan) {
  document.getElementById("modalFormView").style.display = "none";
  const successView = document.getElementById("modalSuccessView");
  const msg         = document.getElementById("successMessage");

  if (plan === "monthly") {
    msg.textContent = "Your Monthly plan is now active (₹200/month). Enjoy unlimited, ad-free news!";
  } else {
    msg.textContent = "Your Annual plan is now active (₹2,000/year). You've saved ₹400 — enjoy 2 months free!";
  }

  successView.classList.add("show");
}

function goHome() {
  closeModal();
  window.location.href = "index.html";
}

// ── Spin keyframe (injected for the spinner inside the button) ────────────
const style = document.createElement("style");
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shakeInput {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-6px); }
    40%,80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);

// ── Init ───────────────────────────────────────────────────────────────────
updateNavForUser();
showCurrentPlanBanner();