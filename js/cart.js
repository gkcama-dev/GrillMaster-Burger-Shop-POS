// Handles cart management (add, remove, qty update, totals)

let cart = [];  // POS cart stored in memory only

// Utility to create a unique cart item id
function createCartId() {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// Add product to cart (merge if same product)
function addToCart(product) {

    // Check if the product already exists in cart
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
        // If already exists → increase quantity
        existingItem.qty++;
    } else {
        // Else → add as new cart line
        cart.push({
            cartId: createCartId(),
            productId: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    updateCartUI();
}


// Increase quantity for a specific cart line (by cartId)
function incrementItem(cartId) {
    const item = cart.find(i => i.cartId === cartId);
    if (item) item.qty++;
    updateCartUI();
}

// Decrease quantity for a specific cart line (by cartId)
function decrementItem(cartId) {
    const item = cart.find(i => i.cartId === cartId);
    if (!item) return;

    if (item.qty > 1) {
        item.qty--;
    } else {
        cart = cart.filter(i => i.cartId !== cartId);
    }

    updateCartUI();
}

// Completely remove item (by cartId)
function removeItem(cartId) {
    cart = cart.filter(i => i.cartId !== cartId);
    updateCartUI();
}

// Clear full cart after checkout
function clearCart() {
    cart = [];
    updateCartUI();
}

// cart-close button to clear the cart
const cartCloseBtn = document.getElementById("cart-close");
if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", () => {
        clearCart();
      
        if (typeof closeCart === "function") closeCart();
    });
}


// Calculate subtotal, tax, total
function calculateTotals() {
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const tax = subtotal * 0.08;         // 8%
    const total = subtotal + tax;

    return {
        subtotal,
        tax,
        total
    };
}

// Update cart display in POS UI
function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const subtitle = document.getElementById("cart-subtitle");

    const totals = calculateTotals();

    // Guard elements
    if (document.getElementById("subtotal")) document.getElementById("subtotal").textContent = "Rs. " + totals.subtotal.toFixed(2);
    if (document.getElementById("tax")) document.getElementById("tax").textContent = "Rs. " + totals.tax.toFixed(2);
    if (document.getElementById("total")) document.getElementById("total").textContent = "Rs. " + totals.total.toFixed(2);

    // Mobile bar update (guard)
    const mobileCountEl = document.getElementById("mobile-item-count");
    const mobileTotalEl = document.getElementById("mobile-cart-total");
    if (mobileCountEl) mobileCountEl.textContent = cart.length + " items";
    if (mobileTotalEl) mobileTotalEl.textContent = "Rs. " + totals.total.toFixed(2);

    if (!cartItems) return;

    if (cart.length === 0) {
        if (subtitle) subtitle.textContent = "No items yet";
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
        return;
    }

    if (subtitle) subtitle.textContent = cart.length + " items";

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-row">
                <span>${item.name}</span>
                <strong>Rs. ${(item.price * item.qty).toFixed(2)}</strong>
            </div>

            <div class="cart-row">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="decrementItem('${item.cartId}')">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="incrementItem('${item.cartId}')">+</button>
                </div>

                <button class="qty-btn" onclick="removeItem('${item.cartId}')" title="Remove">×</button>
            </div>
        </div>
    `).join("");
}