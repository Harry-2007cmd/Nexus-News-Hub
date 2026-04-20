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

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("rememberMe").checked;
  const btn = form.querySelector(".btn-primary");

  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1000));

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    (remember ? localStorage : sessionStorage).setItem("currentUser", JSON.stringify(user));
    showMessage("Login successful! Redirecting...", "success", form);
    setTimeout(() => window.location.href = "index.html", 1500);
  } else {
    showMessage("Invalid email or password.", "error", form);
    btn.disabled = false;
  }
});

// Signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const name     = document.getElementById("signupName").value.trim();
  const email    = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm  = document.getElementById("confirmPassword").value;
  const agreed   = document.getElementById("agreeTerms").checked;
  const btn      = form.querySelector(".btn-primary");

  if (password !== confirm) return showMessage("Passwords do not match.", "error", form);
  if (!agreed) return showMessage("Please agree to the Terms of Service.", "error", form);

  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1000));

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === email)) {
    showMessage("An account with this email already exists.", "error", form);
    return (btn.disabled = false);
  }

  users.push({ id: Date.now(), name, email, password, createdAt: new Date().toISOString() });
  localStorage.setItem("users", JSON.stringify(users));
  showMessage("Account created! Please log in.", "success", form);

  setTimeout(() => {
    document.getElementById("signupBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
    document.getElementById("loginEmail").value = email;
    form.reset();
  }, 1500);
  btn.disabled = false;
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
  const form = document.getElementById("loginForm");
  showMessage(
    email ? `Reset link sent to ${email}` : "Enter your email first.",
    email ? "success" : "error",
    form
  );
});