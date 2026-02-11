// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add rotation animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// Infinite Scroll Functionality
let page = 1;
let isLoading = false;
const newsGrid = document.getElementById('newsGrid');
const loadingIndicator = document.getElementById('loadingIndicator');

// Sample news data for infinite scroll
const newsCategories = ['Technology', 'Sports', 'Business', 'Health', 'Science', 'Environment', 'Entertainment', 'World'];
const newsImages = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
];

const newsTitles = [
    'Breaking: Major Economic Reform Announced',
    'Innovation Summit Attracts Global Leaders',
    'Championship Finals Set Record Viewership',
    'New Research Reveals Groundbreaking Findings',
    'International Cooperation on Climate Action',
    'Tech Giants Unveil Next-Generation Products',
    'Healthcare System Receives Major Upgrade',
    'Cultural Festival Celebrates Diversity',
    'Education Initiative Transforms Learning',
    'Infrastructure Project Nears Completion',
    'Diplomatic Talks Yield Positive Results',
    'Entertainment Industry Breaks New Ground',
    'Scientific Discovery Opens New Possibilities',
    'Environmental Protection Measures Announced',
    'Financial Markets Show Strong Growth'
];

const newsDescriptions = [
    'Government officials outline comprehensive plans for economic development and growth in the coming fiscal year...',
    'Industry leaders and innovators gather to discuss emerging technologies and their impact on society...',
    'Record-breaking attendance and viewership numbers demonstrate growing interest in competitive sports...',
    'Scientists publish peer-reviewed findings that could revolutionize our understanding of fundamental concepts...',
    'Nations commit to collaborative efforts in addressing pressing environmental challenges and sustainability...',
    'Latest technological innovations promise to enhance user experience and productivity across sectors...',
    'Significant investments in healthcare infrastructure aim to improve accessibility and quality of care...',
    'Annual celebration brings together diverse communities to share traditions and promote cultural understanding...',
    'New educational programs leverage technology to create engaging and effective learning experiences...',
    'Major construction milestone reached as project enters final phase of development and implementation...',
    'High-level discussions result in agreements on key international issues and cooperative frameworks...',
    'Creative professionals push boundaries with innovative content and immersive storytelling techniques...',
    'Breakthrough research findings published in prestigious journal attract international scientific community...',
    'Comprehensive environmental policies introduced to protect natural resources and biodiversity...',
    'Economic indicators point to sustained growth and stability across multiple market sectors...'
];

function generateNewsCard(index) {
    const category = newsCategories[Math.floor(Math.random() * newsCategories.length)];
    const image = newsImages[Math.floor(Math.random() * newsImages.length)];
    const title = newsTitles[Math.floor(Math.random() * newsTitles.length)];
    const description = newsDescriptions[Math.floor(Math.random() * newsDescriptions.length)];
    const hoursAgo = Math.floor(Math.random() * 12) + 1;
    const readTime = Math.floor(Math.random() * 5) + 3;
    
    return `
        <article class="news-card">
            <div class="card-image">
                <img src="${image}" alt="News">
            </div>
            <div class="card-content">
                <span class="card-category">${category}</span>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="card-meta">
                    <span>${hoursAgo} hours ago</span>
                    <span>•</span>
                    <span>${readTime} min read</span>
                </div>
            </div>
        </article>
    `;
}

function loadMoreNews() {
    if (isLoading) return;
    
    isLoading = true;
    loadingIndicator.classList.add('show');
    
    // Simulate API call delay
    setTimeout(() => {
        const newsArticles = document.querySelector('.news-articles');
        
        // Add 6 new cards
        for (let i = 0; i < 6; i++) {
            const cardHTML = generateNewsCard(page * 6 + i);
            newsArticles.insertAdjacentHTML('beforeend', cardHTML);
        }
        
        page++;
        isLoading = false;
        loadingIndicator.classList.remove('show');
    }, 1000);
}

// Intersection Observer for infinite scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
            loadMoreNews();
        }
    });
}, {
    rootMargin: '200px'
});

observer.observe(loadingIndicator);

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        // Highlight search functionality (placeholder for future implementation)
        console.log('Searching for:', searchTerm);
    }
});

// Smooth scroll for category links
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Scroll to news grid
        const newsGrid = document.getElementById('newsGrid');
        newsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Add click handlers for cards with smooth transition
document.addEventListener('click', (e) => {
    const card = e.target.closest('.news-card, .secondary-card, .trending-item');
    if (card) {
        // Add a ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(196, 30, 58, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        const rect = card.getBoundingClientRect();
        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.news-card, .hero-section, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        observer.observe(el);
    });
};

// Initialize animations
window.addEventListener('load', () => {
    animateOnScroll();
});

// Breaking news ticker interaction - pause on hover
const newsTicker = document.querySelector('.news-ticker');
if (newsTicker) {
    newsTicker.addEventListener('mouseenter', () => {
        newsTicker.style.animationPlayState = 'paused';
    });
    
    newsTicker.addEventListener('mouseleave', () => {
        newsTicker.style.animationPlayState = 'running';
    });
}

// Add active state to login/signup buttons
const loginBtn = document.querySelector('.btn-secondary');
const signupBtn = document.querySelector('.btn-primary');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        alert('Login functionality will be implemented here');
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        alert('Sign up functionality will be implemented here');
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            alert('Thank you for subscribing! You will receive our latest updates.');
            emailInput.value = '';
        }
    });
    
    // Prevent form submission on button click
    const subscribeBtn = newsletterForm.querySelector('button');
    subscribeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            alert('Thank you for subscribing! You will receive our latest updates.');
            emailInput.value = '';
        }
    });
}

// Add scroll-to-top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
`;
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    z-index: 999;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
});

console.log('Nexus News Hub initialized successfully!');