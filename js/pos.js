// Handles:
//    - Rendering product grid
//    - Category filtering
//    - Search filtering
//    - Adding products to cart (uses cart.js)

// DOM elements
const productGrid = document.getElementById("product-grid");
const categoryChips = document.querySelectorAll(".category-chip");
const searchInput = document.getElementById("search-input");

// Active filter states
let activeCategory = "all";
let searchKeyword = "";

// Render Products
function renderProducts() {
    productGrid.innerHTML = "";

    // Filter by category
    let filtered = products.filter(p => {
        if (activeCategory === "all") return true;
        return p.category === activeCategory;
    });

    // Filter by search
    if (searchKeyword.trim() !== "") {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // Build UI
    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="price">Rs ${product.price}.00</p>
                <button class="add-btn" data-id="${product.id}">
                    Add to Order
                </button>
            </div>
        `;

        productGrid.appendChild(card);

    });
}

// Category Filtering
categoryChips.forEach(chip => {
    chip.addEventListener("click", () => {
        categoryChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        activeCategory = chip.dataset.category;
        renderProducts();
    });
});

//Search Filtering
searchInput.addEventListener("input", (e) => {
    searchKeyword = e.target.value;
    renderProducts();
});

// Add to Cart Handler
productGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        const productId = e.target.dataset.id;
        const product = products.find(p => p.id == productId);

        if (product) {
            addToCart(product);
        }
    }
});

// Admin Navigation
const adminLink = document.getElementById("admin-link");
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const loginCancel = document.getElementById("login-cancel");
const loginError = document.getElementById("login-error");

// Default credential fallback (change as needed)
const DEFAULT_ADMIN = { username: "admin", password: "123" };

function openLogin() {
  if (loginModal) {
    loginModal.setAttribute("aria-hidden", "false");
    document.getElementById("login-username").focus();
  }
}

function closeLogin() {
  if (loginModal) {
    loginModal.setAttribute("aria-hidden", "true");
    loginError.textContent = "";
    loginForm.reset();
  }
}

if (adminLink) {
  adminLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLogin();
  });
}

if (loginCancel) {
  loginCancel.addEventListener("click", (e) => {
    e.preventDefault();
    closeLogin();
  });
}

// Login submit: check localStorage gm_admins first, otherwise use DEFAULT_ADMIN
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const uname = document.getElementById("login-username").value.trim();
    const pwd = document.getElementById("login-password").value;

    let allowed = false;

    try {
      const stored = JSON.parse(localStorage.getItem("gm_admins") || "[]");
      if (Array.isArray(stored) && stored.length) {
        allowed = stored.some(u => u.username === uname && u.password === pwd);
      }
    } catch (err) {
      console.warn("gm_admins parse failed", err);
    }

    if (!allowed) {
      // fallback default
      allowed = (uname === DEFAULT_ADMIN.username && pwd === DEFAULT_ADMIN.password);
    }

    if (allowed) {
      // set short-lived session and redirect to admin page
      sessionStorage.setItem("gm_user", JSON.stringify({ username: uname, loggedAt: Date.now() }));
      closeLogin();
      window.location.href = "admin.html";
    } else {
      loginError.textContent = "Invalid username or password";
    }
  });
}

// close modal on overlay click (but ignore clicks inside panel)
if (loginModal) {
  loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) closeLogin();
  });
}

// Initial pos
function initPOS() {
    renderProducts();
}

initPOS();