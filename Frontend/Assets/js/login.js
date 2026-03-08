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
// PASSWORD VISIBILITY TOGGLE
// ===============================
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector("i");
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// ===============================
// DOM ELEMENTS
// ===============================
const loginBox     = document.getElementById('loginBox');
const signupBox    = document.getElementById('signupBox');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn  = document.getElementById('showLogin');
const loginForm    = document.getElementById('loginForm');
const signupForm   = document.getElementById('signupForm');

// ===============================
// TOGGLE BETWEEN FORMS
// ===============================
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    signupBox.classList.remove('hidden');
    signupBox.style.animation = 'fadeInUp 0.35s ease';
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
    loginBox.style.animation = 'fadeInUp 0.35s ease';
});

// ===============================
// VALIDATION HELPERS
// ===============================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
}

function showMessage(message, type, formElement) {
    const existing = formElement.querySelector('.message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `message ${type} show`;
    div.textContent = message;
    formElement.insertBefore(div, formElement.firstChild);

    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 300);
    }, 5000);
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function createErrorDiv(input) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    input.closest('.form-group').appendChild(errorDiv);
    return errorDiv;
}

function validateEmailInput(input) {
    const email = input.value.trim();
    const errorDiv = input.closest('.form-group').querySelector('.error-message') || createErrorDiv(input);

    if (email && !isValidEmail(email)) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorDiv.textContent = 'Please enter a valid email address';
        errorDiv.classList.add('show');
    } else if (email) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorDiv.classList.remove('show');
    } else {
        input.classList.remove('invalid', 'valid');
        errorDiv.classList.remove('show');
    }
}

function validatePasswordInput(input, isSignup = false) {
    const password = input.value;
    const errorDiv = input.closest('.form-group').querySelector('.error-message') || createErrorDiv(input);

    if (isSignup && password && !isValidPassword(password)) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorDiv.textContent = 'Password must be at least 8 characters with letters and numbers';
        errorDiv.classList.add('show');
    } else if (password) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorDiv.classList.remove('show');
    } else {
        input.classList.remove('invalid', 'valid');
        errorDiv.classList.remove('show');
    }
}

// ===============================
// REAL-TIME VALIDATION
// ===============================
document.getElementById('loginEmail').addEventListener('blur', function () {
    validateEmailInput(this);
});

document.getElementById('signupEmail').addEventListener('blur', function () {
    validateEmailInput(this);
});

document.getElementById('signupPassword').addEventListener('input', function () {
    validatePasswordInput(this, true);
});

document.getElementById('confirmPassword').addEventListener('input', function () {
    const password = document.getElementById('signupPassword').value;
    const errorDiv = this.closest('.form-group').querySelector('.error-message') || createErrorDiv(this);

    if (this.value && password !== this.value) {
        this.classList.add('invalid');
        this.classList.remove('valid');
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
    } else if (this.value) {
        this.classList.remove('invalid');
        this.classList.add('valid');
        errorDiv.classList.remove('show');
    }
});

// ===============================
// LOGIN FORM SUBMISSION
// ===============================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = loginForm.querySelector('.btn-primary');

    if (!email || !password) {
        showMessage('Please fill in all fields', 'error', loginForm);
        return;
    }
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error', loginForm);
        return;
    }

    setButtonLoading(submitBtn, true);

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            showMessage('Login successful! Redirecting...', 'success', loginForm);
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        } else {
            showMessage('Invalid email or password', 'error', loginForm);
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error', loginForm);
    } finally {
        setButtonLoading(submitBtn, false);
    }
});

// ===============================
// SIGNUP FORM SUBMISSION
// ===============================
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name            = document.getElementById('signupName').value.trim();
    const email           = document.getElementById('signupEmail').value.trim();
    const password        = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms      = document.getElementById('agreeTerms').checked;
    const newsletter      = document.getElementById('newsletter').checked;
    const submitBtn       = signupForm.querySelector('.btn-primary');

    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all required fields', 'error', signupForm);
        return;
    }
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error', signupForm);
        return;
    }
    if (!isValidPassword(password)) {
        showMessage('Password must be at least 8 characters with letters and numbers', 'error', signupForm);
        return;
    }
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error', signupForm);
        return;
    }
    if (!agreeTerms) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error', signupForm);
        return;
    }

    setButtonLoading(submitBtn, true);

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.some(u => u.email === email)) {
            showMessage('An account with this email already exists', 'error', signupForm);
            setButtonLoading(submitBtn, false);
            return;
        }

        users.push({ id: Date.now(), name, email, password, newsletter, createdAt: new Date().toISOString() });
        localStorage.setItem('users', JSON.stringify(users));

        showMessage('Account created successfully! Redirecting to login...', 'success', signupForm);

        setTimeout(() => {
            signupBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            signupForm.reset();
            document.getElementById('loginEmail').value = email;
            showMessage('Please login with your new account', 'success', loginForm);
        }, 2000);

    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error', signupForm);
    } finally {
        setButtonLoading(submitBtn, false);
    }
});

// ===============================
// SOCIAL LOGIN BUTTONS
// ===============================
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function () {
        const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
        alert(`${provider} authentication would be handled here.\n\nThis is a demo - in production, this would redirect to ${provider}'s OAuth flow.`);
    });
});

// ===============================
// FORGOT PASSWORD
// ===============================
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();

    if (!email) {
        showMessage('Please enter your email address first', 'error', loginForm);
        return;
    }
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error', loginForm);
        return;
    }
    showMessage(`Password reset instructions sent to ${email}`, 'success', loginForm);
});

// ===============================
// CLEAR INVALID STATE ON INPUT
// ===============================
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('input', function () {
        if (this.value.trim() === '') {
            this.classList.remove('invalid', 'valid');
            const errorDiv = this.closest('.form-group').querySelector('.error-message');
            if (errorDiv) errorDiv.classList.remove('show');
        }
    });
});

// ===============================
// CHECK IF ALREADY LOGGED IN
// ===============================
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (currentUser) {
        console.log('User already logged in:', JSON.parse(currentUser));
    }
});