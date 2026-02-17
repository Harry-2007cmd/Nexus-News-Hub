// DOM Elements
const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Toggle between login and signup forms
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    signupBox.classList.remove('hidden');
    // Add smooth transition effect
    signupBox.style.animation = 'fadeIn 0.3s ease';
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
    // Add smooth transition effect
    loginBox.style.animation = 'fadeIn 0.3s ease';
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function isValidPassword(password) {
    // At least 8 characters, contains letters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

// Show message
function showMessage(message, type, formElement) {
    // Remove existing messages
    const existingMessage = formElement.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} show`;
    messageDiv.textContent = message;
    
    // Insert at the top of the form
    formElement.insertBefore(messageDiv, formElement.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Add loading state to button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Real-time email validation
function validateEmailInput(input) {
    const email = input.value.trim();
    const errorDiv = input.parentElement.querySelector('.error-message') || createErrorDiv(input);
    
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

// Real-time password validation
function validatePasswordInput(input, isSignup = false) {
    const password = input.value;
    const errorDiv = input.parentElement.querySelector('.error-message') || createErrorDiv(input);
    
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

// Create error message div
function createErrorDiv(input) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    input.parentElement.appendChild(errorDiv);
    return errorDiv;
}

// Add real-time validation to email inputs
document.getElementById('loginEmail').addEventListener('blur', function() {
    validateEmailInput(this);
});

document.getElementById('signupEmail').addEventListener('blur', function() {
    validateEmailInput(this);
});

// Add real-time validation to password inputs
document.getElementById('signupPassword').addEventListener('input', function() {
    validatePasswordInput(this, true);
});

// Validate confirm password
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = this.value;
    const errorDiv = this.parentElement.querySelector('.error-message') || createErrorDiv(this);
    
    if (confirmPassword && password !== confirmPassword) {
        this.classList.add('invalid');
        this.classList.remove('valid');
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
    } else if (confirmPassword) {
        this.classList.remove('invalid');
        this.classList.add('valid');
        errorDiv.classList.remove('show');
    }
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = loginForm.querySelector('.btn-primary');
    
    // Validate inputs
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error', loginForm);
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error', loginForm);
        return;
    }
    
    // Simulate API call
    setButtonLoading(submitBtn, true);
    
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Here you would normally make an API call
        // const response = await fetch('/api/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password, rememberMe })
        // });
        
        // For demo purposes, check if email exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            showMessage('Login successful! Redirecting...', 'success', loginForm);
            
            // Store session
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage('Invalid email or password', 'error', loginForm);
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error', loginForm);
    } finally {
        setButtonLoading(submitBtn, false);
    }
});

// Signup Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const newsletter = document.getElementById('newsletter').checked;
    const submitBtn = signupForm.querySelector('.btn-primary');
    
    // Validate inputs
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
    
    // Simulate API call
    setButtonLoading(submitBtn, true);
    
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Here you would normally make an API call
        // const response = await fetch('/api/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, password, newsletter })
        // });
        
        // For demo purposes, store in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            showMessage('An account with this email already exists', 'error', signupForm);
            setButtonLoading(submitBtn, false);
            return;
        }
        
        // Add new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            newsletter,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showMessage('Account created successfully! Redirecting to login...', 'success', signupForm);
        
        // Switch to login form after 2 seconds
        setTimeout(() => {
            signupBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            signupForm.reset();
            
            // Pre-fill email in login form
            document.getElementById('loginEmail').value = email;
            
            showMessage('Please login with your new account', 'success', loginForm);
        }, 2000);
        
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error', signupForm);
    } finally {
        setButtonLoading(submitBtn, false);
    }
});

// Social login buttons
const socialButtons = document.querySelectorAll('.btn-social');
socialButtons.forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
        alert(`${provider} authentication would be handled here.\n\nThis is a demo - in production, this would redirect to ${provider}'s OAuth flow.`);
    });
});

// Forgot password
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
    
    // In production, this would send a password reset email
    showMessage(`Password reset instructions have been sent to ${email}`, 'success', loginForm);
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Check if user is already logged in
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (currentUser) {
        // User is already logged in, could redirect to homepage
        // window.location.href = 'index.html';
        console.log('User already logged in:', JSON.parse(currentUser));
    }
});

// Clear invalid states on input
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim() === '') {
            this.classList.remove('invalid', 'valid');
            const errorDiv = this.parentElement.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        }
    });
});