// Storage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
function generateId() {
    return crypto.randomUUID();
}

// Data
let adminProducts = loadData("gm_products");
let adminCustomers = loadData("gm_customers");
let adminOrders = loadData("gm_orders");

// Image Upload Preview
function setupImageUpload() {
    const fileInput = document.getElementById("prod-image");
    const preview = document.getElementById("image-preview");
    const fileName = document.getElementById("file-name");

    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) {
            preview.innerHTML = `<div class="image-preview-placeholder">No image selected</div>`;
            fileName.textContent = "No file chosen";
            return;
        }

        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}">`;
        };
        reader.readAsDataURL(file);
    });
}

// Product CRUD
function renderAdminProducts() {
    const tbody = document.getElementById("product-table-body");

    tbody.innerHTML = adminProducts
        .map(
            (p) => `
        <tr>
            <td><img src="${p.image}" style="width:60px; height:60px; object-fit:cover;"></td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.category}</td>
            <td>
                <button onclick="editProduct('${p.id}')">Edit</button>
                <button onclick="deleteProduct('${p.id}')">Delete</button>
            </td>
        </tr>`
        )
        .join("");
}

function addProduct() {
    const name = document.getElementById("prod-name").value.trim();
    const price = Number(document.getElementById("prod-price").value);
    const category = document.getElementById("prod-category").value;
    const fileInput = document.getElementById("prod-image");

    if (!name || !price || !category) {
        return alert("Fill all fields");
    }

    let imageData = "";

    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageData = e.target.result;
            saveProduct(name, price, category, imageData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveProduct(name, price, category, imageData);
    }
}

function saveProduct(name, price, category, imageData) {
    adminProducts.push({
        id: generateId(),
        name,
        price,
        category,
        image: imageData,
    });

    saveData("gm_products", adminProducts);
    renderAdminProducts();
    resetProductForm();
}

function resetProductForm() {
    document.getElementById("prod-name").value = "";
    document.getElementById("prod-price").value = "";
    document.getElementById("prod-category").value = "";
    document.getElementById("prod-image").value = "";
    document.getElementById("image-preview").innerHTML =
        `<div class="image-preview-placeholder">No image selected</div>`;
    document.getElementById("file-name").textContent = "No file chosen";
}

function deleteProduct(id) {
    adminProducts = adminProducts.filter((p) => p.id !== id);
    saveData("gm_products", adminProducts);
    renderAdminProducts();
}

// CUSTOMER CRUD
function renderAdminCustomers() {
    const tbody = document.getElementById("customer-table-body");

    tbody.innerHTML = adminCustomers
        .map(
            (c) => `
        <tr>
            <td>${c.name}</td>
            <td><button onclick="deleteCustomer('${c.id}')">Delete</button></td>
        </tr>`
        )
        .join("");
}

function addCustomer() {
    const name = document.getElementById("cust-name").value.trim();
    if (!name) return alert("Enter customer name");

    adminCustomers.push({ id: generateId(), name });
    saveData("gm_customers", adminCustomers);
    renderAdminCustomers();

    document.getElementById("cust-name").value = "";
}

function deleteCustomer(id) {
    adminCustomers = adminCustomers.filter((c) => c.id !== id);
    saveData("gm_customers", adminCustomers);
    renderAdminCustomers();
}

// ORDERS
function renderAdminOrders() {
    const tbody = document.getElementById("order-table-body");

    tbody.innerHTML = adminOrders
        .map(
            (o) => `
        <tr>
            <td>${o.id}</td>
            <td>${o.date}</td>
            <td>${o.total}</td>
            <td>${o.items.length} items</td>
        </tr>`
        )
        .join("");
}

// UI Setup
function setupUIFeatures() {
    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".panel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            panels.forEach((p) => p.classList.remove("active"));
            document.getElementById(tab.dataset.target).classList.add("active");
        });
    });

    document.getElementById("moveToPOS").addEventListener("click", () => {
         window.location.href = "index.html"; 
    });
}

// Init
function initAdmin() {
    renderAdminProducts();
    renderAdminCustomers();
    renderAdminOrders();
    setupUIFeatures();
    setupImageUpload();
}

document.addEventListener("DOMContentLoaded", initAdmin);
