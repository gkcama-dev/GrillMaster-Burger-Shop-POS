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

// Render mobile cart items (mirrors updateCartDisplay but targets mobile elements)
function renderMobileCartItems() {
    const cartItems = document.getElementById("mobile-cart-items");
    if (!cartItems) return;

    const totals = calculateTotals();

    // Update mobile totals
    const mobileSubtotal = document.getElementById("mobile-subtotal");
    const mobileTax = document.getElementById("mobile-tax");
    const mobileTotal = document.getElementById("mobile-total");

    if (mobileSubtotal) mobileSubtotal.textContent = "Rs " + totals.subtotal.toFixed(2);
    if (mobileTax) mobileTax.textContent = "Rs " + totals.tax.toFixed(2);
    if (mobileTotal) mobileTotal.textContent = "Rs " + totals.total.toFixed(2);

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-price">Rs ${item.price}</span>
            </div>

            <div class="item-quantity">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="decrementItem(${item.productId})">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="incrementItem(${item.productId})">+</button>
                </div>

                <span class="item-total">Rs ${(item.price * item.qty).toFixed(2)}</span>
            </div>
        </div>
    `).join("");
}

// Checkout / Save order with customer name
const checkoutBtn = document.getElementById("checkout-button");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
}

function handleCheckout() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const customerInput = document.getElementById("customer-name");
    const customerName = customerInput && customerInput.value.trim() ? customerInput.value.trim() : "Walk-in";

    const totals = calculateTotals();

    const order = {
        id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
        date: new Date().toISOString(),
        customer: customerName,
        items: cart.map(i => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total
    };

    // Save to localStorage (gm_orders) — admin panel reads this key
    try {
        const existing = JSON.parse(localStorage.getItem("gm_orders") || "[]");
        existing.push(order);
        localStorage.setItem("gm_orders", JSON.stringify(existing));
    } catch (e) {
        console.error("Failed to save order", e);
    }

    // Optional: populate receipt area and print (light implementation)
    const receiptEl = document.getElementById("receipt");
    if (receiptEl) {
        const receiptDate = document.getElementById("receipt-date");
        const receiptOrderId = document.getElementById("receipt-order-id");
        const receiptItems = document.getElementById("receipt-items");
        const receiptSubtotal = document.getElementById("receipt-subtotal");
        const receiptTax = document.getElementById("receipt-tax");
        const receiptTotal = document.getElementById("receipt-total");

        if (receiptDate) receiptDate.textContent = `Date: ${new Date(order.date).toLocaleString()}`;
        if (receiptOrderId) receiptOrderId.textContent = `Order: ${order.id}`;
        if (receiptItems) receiptItems.innerHTML = order.items.map(it => `<div>${it.qty} x ${it.name} — Rs ${ (it.price * it.qty).toFixed(2)}</div>`).join("");
        if (receiptSubtotal) receiptSubtotal.textContent = `Rs ${order.subtotal.toFixed(2)}`;
        if (receiptTax) receiptTax.textContent = `Rs ${order.tax.toFixed(2)}`;
        if (receiptTotal) receiptTotal.textContent = `Rs ${order.total.toFixed(2)}`;

        receiptEl.setAttribute("aria-hidden", "false");
        // Uncomment to auto-print:
        // window.print();
    }

    // Clear cart and UI
    clearCart();
    if (customerInput) customerInput.value = "";

    // Bootstrap toast success (fallback to alert if toast not available)
    const toastEl = document.getElementById("checkout-toast");
    if (toastEl && window.bootstrap) {
        const bodyEl = toastEl.querySelector(".toast-body");
        if (bodyEl) bodyEl.textContent = `Order saved for: ${customerName}`;
        const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
        bsToast.show();
    } else {
        alert("Order saved for: " + customerName);
    }
}