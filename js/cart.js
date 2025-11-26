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

// Wire mobile checkout button to same handler
const mobileCheckoutBtn = document.getElementById("mobile-checkout-button");
if (mobileCheckoutBtn) {
  mobileCheckoutBtn.addEventListener("click", () => {
    const mobileCustomerInput = document.getElementById("mobile-customer-name");
    const customerInput = document.getElementById("customer-name");
    if (mobileCustomerInput && customerInput) {
      customerInput.value = mobileCustomerInput.value;
    }
    handleCheckout();
  });
}

function handleCheckout() {
    if (cart.length === 0) {
        // alert("Cart is empty");
        const orderSuccessModal = document.getElementById("order-success-modal");
        const orderSuccessOk = document.getElementById("order-success-ok");
        const orderSuccessTitle = document.getElementById("order-success-title");
        const orderSuccessText = document.getElementById("order-success-text");
        const orderSuccessId = document.getElementById("order-success-id");
        const orderSuccessTotal = document.getElementById("order-success-total");

        if (orderSuccessTitle) orderSuccessTitle.textContent = "Cannot Checkout";
        if (orderSuccessText) orderSuccessText.textContent = "Your cart is empty.";
        if (orderSuccessId) orderSuccessId.textContent = "";
        if (orderSuccessTotal) orderSuccessTotal.textContent = "";

        if (orderSuccessModal) {
            orderSuccessModal.setAttribute("aria-hidden", "false");

            if (orderSuccessOk && !orderSuccessOk._wiredEmpty) {
                orderSuccessOk.addEventListener("click", () => {
                    orderSuccessModal.setAttribute("aria-hidden", "true");
                    // Restore default text after close (optional)
                    if (orderSuccessTitle) orderSuccessTitle.textContent = "Order Successful";
                    if (orderSuccessText) orderSuccessText.textContent = "Your order has been placed successfully.";
                });
                orderSuccessOk._wiredEmpty = true;
            }

            orderSuccessModal.addEventListener("click", (e) => {
                if (e.target === orderSuccessModal) {
                    orderSuccessModal.setAttribute("aria-hidden", "true");
                    if (orderSuccessTitle) orderSuccessTitle.textContent = "Order Successful";
                    if (orderSuccessText) orderSuccessText.textContent = "Your order has been placed successfully.";
                }
            });
        }
        return;
    }

    const customerInput = document.getElementById("customer-name");
    const customerName = customerInput && customerInput.value.trim() ? customerInput.value.trim() : "Guest";

    const totals = calculateTotals();

    const order = {
        id: getNextOrderId(),                  // GMO-001, GMO-002, ...
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

    // Save to localStorage
    try {
        const existing = JSON.parse(localStorage.getItem("gm_orders") || "[]");
        existing.push(order);
        localStorage.setItem("gm_orders", JSON.stringify(existing));
    } catch (e) {
        console.error("Failed to save order", e);
    }

    // Populate receipt modal and show
    const receiptModal = document.getElementById("receipt-modal");
    if (receiptModal) {
        const dateEl = document.getElementById("modal-receipt-date");
        const idEl = document.getElementById("modal-receipt-order-id");
        const custEl = document.getElementById("modal-receipt-customer");
        const itemsEl = document.getElementById("modal-receipt-items");
        const subEl = document.getElementById("modal-receipt-subtotal");
        const taxEl = document.getElementById("modal-receipt-tax");
        const totalEl = document.getElementById("modal-receipt-total");

        if (dateEl) dateEl.textContent = new Date(order.date).toLocaleString();
        if (idEl) idEl.textContent = order.id;            // show exact same ID as admin
        if (custEl) custEl.textContent = order.customer;
        if (itemsEl) {
            itemsEl.innerHTML = order.items.map(it =>
                `<div>${it.qty} x ${it.name} — Rs ${(it.price * it.qty).toFixed(2)}</div>`
            ).join("");
        }
        if (subEl) subEl.textContent = `Rs ${order.subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `Rs ${order.tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `Rs ${order.total.toFixed(2)}`;

        receiptModal.setAttribute("aria-hidden", "false");

        // Print / Close buttons
        const printBtn = document.getElementById("receipt-print-btn");
        const closeBtn = document.getElementById("receipt-close-btn");
        if (printBtn && !printBtn._wired) {
            printBtn.addEventListener("click", () => {
                // Small delay to ensure modal is visible to printer
                setTimeout(() => window.print(), 50);
            });
            printBtn._wired = true;
        }
        if (closeBtn && !closeBtn._wired) {
            closeBtn.addEventListener("click", () => {
                receiptModal.setAttribute("aria-hidden", "true");
            });
            closeBtn._wired = true;
        }

        // Click outside to close
        receiptModal.addEventListener("click", (e) => {
            if (e.target === receiptModal) {
                receiptModal.setAttribute("aria-hidden", "true");
            }
        });
    }

    // Clear cart and UI
    clearCart();
    if (customerInput) customerInput.value = "";
    const mobileCustomerInput = document.getElementById("mobile-customer-name");
    if (mobileCustomerInput) mobileCustomerInput.value = "";

    // Optional toast
    const toastEl = document.getElementById("checkout-toast");
    if (toastEl && window.bootstrap) {
        const bodyEl = toastEl.querySelector(".toast-body");
        if (bodyEl) bodyEl.textContent = `Order saved for: ${customerName}`;
        const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
        bsToast.show();
    }
}

// Generate sequential Order ID like GMO-001 and persist sequence
function getNextOrderId() {
  let seq = parseInt(localStorage.getItem("gm_lastOrderSeq") || "0", 10);

  
  if (!seq) {
    try {
      const existing = JSON.parse(localStorage.getItem("gm_orders") || "[]");
      const max = existing.reduce((m, o) => {
        const n = (o && typeof o.id === "string" && o.id.startsWith("GMO-"))
          ? parseInt(o.id.slice(4), 10)
          : 0;
        return Math.max(m, isNaN(n) ? 0 : n);
      }, 0);
      seq = max;
    } catch { 
      
    }
  }

  const next = seq + 1;
  localStorage.setItem("gm_lastOrderSeq", String(next));
  return `GMO-${String(next).padStart(3, "0")}`;
}