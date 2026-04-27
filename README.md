# 📰 Nexus News Hub

> **Truth Matters** — A modern, responsive news web application delivering real-time news from India and around the world.

---

## 🌟 Overview

Nexus News Hub is a feature-rich, client-side news platform built with vanilla HTML, CSS, and JavaScript. It pulls live news data from the [NewsData.io API](https://newsdata.io/) and presents it through a clean, polished interface with dark mode support, user authentication, category browsing, and personalized profiles.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔴 **Breaking News Ticker** | Scrolling headline ticker with the latest articles |
| 🗂️ **Category Browsing** | Dedicated pages for Politics, Business, Technology, Sports, Entertainment, World, and Health |
| 🔍 **Real-Time Search** | Filter articles instantly as you type |
| 🌙 **Dark / Light Mode** | Theme preference persisted via `localStorage` |
| 👤 **User Authentication** | Sign up, log in, and manage sessions (client-side, localStorage-based) |
| 🙍 **User Profile Page** | View stats, set interests, edit profile details, and see recently read articles |
| 📖 **Article Detail Page** | Full article view with share buttons, related news sidebar, and read-time estimate |
| 📱 **Fully Responsive** | Mobile-first design that adapts from 320px to 1400px+ screens |
| 💀 **Skeleton Loaders** | Smooth loading states while fetching data |
| 🔥 **Trending Sidebar** | Top 5 trending articles with simulated view counts |
| 👑 **Subscription Plans** | Free, Monthly (₹200), and Annual (₹2,000) tiers with payment modal |

---

## 🗂️ Project Structure

```
Nexus-News/
├── Frontend/
│   ├── index.html              # Home page
│   ├── login.html              # Login & Sign Up page
│   ├── article.html            # Article detail page
│   ├── categories.html         # Category listing page
│   ├── profile.html            # User profile page
│   ├── subscription.html       # Subscription / pricing page
│   ├── signup.html             # (Reserved)
│   └── Assets/
│       ├── css/
│       │   ├── main.css        # Global styles, variables, navbar, footer
│       │   ├── login.css       # Auth page styles
│       │   ├── article.css     # Article detail page styles
│       │   ├── categories.css  # Category page styles
│       │   ├── profile.css     # Profile page styles
│       │   └── subscription.css# Subscription / pricing page styles
│       ├── js/
│       │   ├── main.js         # Home page logic, API fetch, search, hero
│       │   ├── login.js        # Auth logic (login, signup, validation)
│       │   ├── article.js      # Article page logic (render, related, share)
│       │   ├── categories.js   # Category page logic (filter, sort, search)
│       │   ├── Profile.js      # Profile page logic (stats, interests, edit)
│       │   └── subscription.js # Subscription page logic (plans, modal, payment)
│       ├── images/
│       │   └── placeholder.jpg
│       └── Data/
│           └── news.json       # (Reserved for offline/mock data)
├── Backend/
│   └── tst.html                # (Reserved for backend integration)
├── .vscode/
│   └── settings.json           # Live Server port config (5502)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- [VS Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension (recommended)
- A free API key from [NewsData.io](https://newsdata.io/)

### Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/your-username/nexus-news.git
cd nexus-news
```

**2. Set your API key**

Open `Frontend/Assets/js/main.js` and `Frontend/Assets/js/categories.js` and replace the placeholder:
```javascript
const API_KEY = "your_newsdata_io_api_key_here";
```

**3. Launch with Live Server**

Open the project in VS Code, right-click `Frontend/index.html`, and select **"Open with Live Server"**. The app runs on port `5502` by default.

**4. Open in browser**
```
http://127.0.0.1:5502/Frontend/index.html
```

---

## 🔌 API Reference

This project uses the **[NewsData.io](https://newsdata.io/)** API.

| Parameter | Value |
|-----------|-------|
| Endpoint  | `https://newsdata.io/api/1/news` |
| Country   | `in` (India) |
| Language  | `en` (English) |
| Free Tier | 200 requests/day |

**Example request:**
```
https://newsdata.io/api/1/news?apikey=YOUR_KEY&country=in&language=en&category=technology
```

> ⚠️ **Security Note:** Keep your API key private. For production, proxy requests through a backend server.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| News Data | [NewsData.io REST API](https://newsdata.io/) |
| Storage | `localStorage` / `sessionStorage` |

---

## 📄 Pages

### 🏠 Home (`index.html`)
- Breaking news ticker
- Hero article with secondary cards
- Trending sidebar
- Paginated latest news grid with "Load More"
- Category navigation and live search
- User avatar dropdown (when logged in)

### 🔐 Login / Sign Up (`login.html`)
- Animated form switching between Login and Sign Up
- Client-side validation and error messages
- "Remember Me" toggle (localStorage vs sessionStorage)
- Social login placeholders (Google, Facebook)
- Forgot password demo flow

### 📖 Article (`article.html`)
- Full article content rendered from `sessionStorage`
- Read-time estimate, publication date, and source attribution
- Social share buttons (Facebook, Twitter, WhatsApp) + copy-link
- Related articles sidebar
- Recently viewed tracking

### 🗂️ Category (`categories.html`)
- Per-category hero banner with article count
- Featured "Top Story" card
- 3-column article grid with skeleton loading
- Sort by Latest / Most Viewed
- In-category search

### 👤 Profile (`profile.html`)
- User header with initials avatar and member badges
- Account info panel
- Dark mode and newsletter preference toggles
- Activity stats (articles read, bookmarks, shared, streak)
- News interest selector (10 categories, saved to localStorage)
- Edit profile form (name, email, password)
- Recently viewed articles list
- Logout

### 👑 Subscription (`subscription.html`)
- Hero banner with monthly/yearly billing toggle
- Three plan tiers: Free, Monthly (₹200), Annual (₹2,000)
- Payment modal with card input formatting
- FAQ accordion
- Current plan detection for logged-in users

---

## 🎨 Theming & CSS Architecture

All colors and design tokens are defined as CSS custom properties in `main.css` and inherited by every page stylesheet:

```css
:root {
  --primary:       #c0001a;   /* Brand red */
  --primary-dark:  #8b0000;
  --bg-primary:    #ffffff;
  --bg-secondary:  #f5f5f5;
  --bg-card:       #ffffff;
  --text-primary:  #1a1a1a;
  --border:        #e5e5e5;
}

[data-theme="dark"] {
  --bg-primary:    #0f0f0f;
  --bg-card:       #1e1e1e;
  /* ... */
}
```

---

## 🔐 Authentication Notes

> ⚠️ Authentication is implemented **client-side only** and is suitable for demo/learning purposes only.

- User accounts are stored in `localStorage` as a JSON array under the key `"users"`
- Sessions are stored under `"currentUser"` in either `localStorage` (Remember Me) or `sessionStorage`
- Passwords are stored in **plain text** — never do this in production
- For production, implement server-side auth with hashed passwords (bcrypt) and JWT tokens

---

## 🛣️ Roadmap

- [ ] Backend integration (Node.js / Express or Firebase)
- [ ] Server-side authentication with hashed passwords and JWT
- [ ] Bookmarking articles
- [ ] Push notifications for breaking news
- [ ] Comment system on articles
- [ ] PWA support (offline reading)
- [ ] Internationalization (multi-language support)
- [ ] Real payment gateway integration (Razorpay / Stripe)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ for learning and practice. Feel free to use this as a reference or starting point for your own news application.

---

*© 2026 Nexus News Hub. Truth Matters.*