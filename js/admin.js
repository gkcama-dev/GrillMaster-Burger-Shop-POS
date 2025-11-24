
//    CRUD Management for:
//    - Products
//    - Customers
//    - Orders
//    - Dark Mode
//    - Tab Switching


// Load data from storage
let adminProducts = loadData("gm_products");
let adminCustomers = loadData("gm_customers");
let adminOrders = loadData("gm_orders");


// Product Management


function renderAdminProducts() {
    const tbody = document.getElementById("product-table-body");
    tbody.innerHTML = adminProducts.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>Rs ${p.price}</td>
            <td>${p.category}</td>
            <td>
                <button onclick="editProduct(${p.id})">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function addProduct() {
    const name = document.getElementById("prod-name").value.trim();
    const price = Number(document.getElementById("prod-price").value);
    const category = document.getElementById("prod-category").value;
    const image = document.getElementById("prod-image").value.trim();

    if (!name || !price || !category || !image) {
        alert("Please fill all fields");
        return;
    }

    adminProducts.push({
        id: generateId(),
        name,
        price,
        category,
        image
    });

    saveData("gm_products", adminProducts);
    renderAdminProducts();
    alert("Product Added!");
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    adminProducts = adminProducts.filter(p => p.id !== id);
    saveData("gm_products", adminProducts);

    renderAdminProducts();
}

function editProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (!product) return;

    const newName = prompt("Name:", product.name);
    const newPrice = prompt("Price:", product.price);
    const newImage = prompt("Image URL:", product.image);

    product.name = newName;
    product.price = Number(newPrice);
    product.image = newImage;

    saveData("gm_products", adminProducts);
    renderAdminProducts();
}


// CUSTOMER MANAGEMENT


function renderAdminCustomers() {
    const tbody = document.getElementById("customer-table-body");

    tbody.innerHTML = adminCustomers.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>
                <button onclick="deleteCustomer(${c.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function addCustomer() {
    const name = document.getElementById("cust-name").value.trim();
    if (!name) return alert("Enter customer name");

    adminCustomers.push({
        id: generateId(),
        name
    });

    saveData("gm_customers", adminCustomers);
    renderAdminCustomers();
}

function deleteCustomer(id) {
    adminCustomers = adminCustomers.filter(c => c.id !== id);
    saveData("gm_customers", adminCustomers);

    renderAdminCustomers();
}

// ORDER MANAGEMENT


function renderAdminOrders() {
    const tbody = document.getElementById("order-table-body");

    tbody.innerHTML = adminOrders.map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.date}</td>
            <td>Rs ${o.total}</td>
            <td>${o.items.length} items</td>
        </tr>
    `).join("");
}

//    TAB SWITCHING + DARK MODE


function setupUIFeatures() {
    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".panel");
    const toggle = document.getElementById("darkToggle");

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const target = tab.dataset.target;

            panels.forEach(p => {
                p.classList.remove("active");
                if (p.id === target) p.classList.add("active");
            });
        });
    });

    // Dark mode toggle
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
}

// INIT ADMIN PANEL


function initAdmin() {
    renderAdminProducts();
    renderAdminCustomers();
    renderAdminOrders();
    setupUIFeatures();
}

document.addEventListener("DOMContentLoaded", initAdmin);
