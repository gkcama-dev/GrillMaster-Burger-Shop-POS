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
if (adminLink) {
    adminLink.addEventListener("click", () => {
        window.location.href = "admin.html";
    });
}

// Initial pos
function initPOS() {
    renderProducts();
}

initPOS();