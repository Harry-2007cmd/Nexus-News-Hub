// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
html.setAttribute("data-theme", localStorage.getItem("theme") || "light");
themeToggle.addEventListener("click", () => {
  const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Password Visibility
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.querySelector("i").classList.toggle("fa-eye", !isHidden);
  btn.querySelector("i").classList.toggle("fa-eye-slash", isHidden);
}

// Switch Forms
document.getElementById("showSignup").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("signupBox").classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signupBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
});

// Show message inside a form
function showMessage(msg, type, form) {
  form.querySelector(".message")?.remove();
  const div = Object.assign(document.createElement("div"), {
    className: `message ${type} show`,
    textContent: msg
  });
  form.prepend(div);
  setTimeout(() => div.remove(), 4000);
}

// ── Login ────────────────────────────────────────────────────────────────────
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form     = e.target;
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("rememberMe").checked;
  const btn      = form.querySelector(".btn-primary");

  btn.disabled = true;
  btn.classList.add("loading");
  await new Promise(r => setTimeout(r, 800));

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user  = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Persist session
    (remember ? localStorage : sessionStorage).setItem("currentUser", JSON.stringify(user));
    showMessage("Login successful! Redirecting...", "success", form);
    setTimeout(() => window.location.href = "index.html", 1200);
  } else {
    showMessage("Invalid email or password.", "error", form);
    btn.disabled = false;
    btn.classList.remove("loading");
  }
});

// ── Signup (auto-login after account creation) ───────────────────────────────
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form     = e.target;
  const name     = document.getElementById("signupName").value.trim();
  const email    = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm  = document.getElementById("confirmPassword").value;
  const agreed   = document.getElementById("agreeTerms").checked;
  const newsletter = document.getElementById("newsletter").checked;
  const btn      = form.querySelector(".btn-primary");

  if (password !== confirm) return showMessage("Passwords do not match.", "error", form);
  if (password.length < 8)  return showMessage("Password must be at least 8 characters.", "error", form);
  if (!agreed)              return showMessage("Please agree to the Terms of Service.", "error", form);

  btn.disabled = true;
  btn.classList.add("loading");
  await new Promise(r => setTimeout(r, 800));

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === email)) {
    showMessage("An account with this email already exists.", "error", form);
    btn.disabled = false;
    btn.classList.remove("loading");
    return;
  }

  // Save new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    newsletter,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // ✅ Auto-login: store session and go straight to home
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  showMessage("Account created! Logging you in...", "success", form);
  setTimeout(() => window.location.href = "index.html", 1200);
});

// Social buttons (demo)
document.querySelectorAll(".btn-social").forEach(btn => {
  btn.addEventListener("click", function () {
    alert(`${this.classList.contains("btn-google") ? "Google" : "Facebook"} OAuth would go here.`);
  });
});

// Forgot password
document.querySelector(".forgot-password").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const form  = document.getElementById("loginForm");
  showMessage(
    email ? `Reset link sent to ${email}` : "Enter your email first.",
    email ? "success" : "error",
    form
  );
});