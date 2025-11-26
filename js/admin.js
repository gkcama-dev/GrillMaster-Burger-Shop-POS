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

// Editing state
let editingProductId = null;
let pendingDeleteId = null; //new
let editFileData = null;    //new: holds chosen image in edit modal

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
    if (!tbody) return;

    tbody.innerHTML = adminProducts
        .map(
            (p) => `
        <tr>
            <td><img src="${p.image}" style="width:60px; height:60px; object-fit:cover;"></td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.category}</td>
            <td>
                <button onclick="openEditModal('${p.id}')">Edit</button>
                <button onclick="deleteProduct('${p.id}')">Delete</button>
            </td>
        </tr>`
        )
        .join("");
}

// Edit modal flow 
function openEditModal(id) {
    // handle numeric/string id mismatch
    const p = adminProducts.find(x => String(x.id) === String(id));
    if (!p) return alert("Product not found");

    editingProductId = p.id;
    editFileData = null;

    // preload values
    const nameEl = document.getElementById("edit-name");
    const priceEl = document.getElementById("edit-price");
    const catEl = document.getElementById("edit-category");
    const preview = document.getElementById("edit-image-preview");
    const fname = document.getElementById("edit-file-name");

    if (!nameEl || !priceEl || !catEl || !preview || !fname) {
        console.error("Edit modal elements missing in DOM");
        return;
    }

    nameEl.value = p.name || "";
    priceEl.value = p.price || 0;
    catEl.value = p.category || "";

    if (p.image) {
        preview.innerHTML = `<img src="${p.image}">`;
        fname.textContent = "Current image";
    } else {
        preview.innerHTML = `<div class="image-preview-placeholder">No image</div>`;
        fname.textContent = "No file chosen";
    }

    setEditInputsEnabled(false);
    document.getElementById("edit-subtext").textContent = "Review details. Click “Enable Editing” to make changes.";
    document.getElementById("edit-modal").setAttribute("aria-hidden", "false");
}

function setEditInputsEnabled(enabled) {
    const ids = ["edit-name","edit-price","edit-category","edit-image","edit-save"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = (id === "edit-save") ? !enabled : !enabled;
    });
}

function setupEditImageUpload() {
    const fileInput = document.getElementById("edit-image");
    const preview = document.getElementById("edit-image-preview");
    const fileName = document.getElementById("edit-file-name");
    if (!fileInput) return;

    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) {
            editFileData = null;
            preview.innerHTML = `<div class="image-preview-placeholder">No image</div>`;
            fileName.textContent = "No file chosen";
            return;
        }
        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            editFileData = e.target.result;
            preview.innerHTML = `<img src="${editFileData}">`;
        };
        reader.readAsDataURL(file);
    });
}

function closeEditModal() {
    const modal = document.getElementById("edit-modal");
    if (modal) modal.setAttribute("aria-hidden", "true");
    editingProductId = null;
    editFileData = null;
}

function saveEditModal() {
    if (!editingProductId) return closeEditModal();

    const name = document.getElementById("edit-name").value.trim();
    const price = Number(document.getElementById("edit-price").value);
    const category = document.getElementById("edit-category").value;

    if (!name || !price || !category) {
        alert("Fill all fields");
        return;
    }

    const idx = adminProducts.findIndex(p => p.id === editingProductId);
    if (idx === -1) {
        alert("Original product not found; cannot update.");
        return closeEditModal();
    }

    const image = editFileData !== null ? editFileData : (adminProducts[idx].image || "");
    adminProducts[idx] = { ...adminProducts[idx], name, price, category, image };

    saveData("gm_products", adminProducts);
    renderAdminProducts();
    closeEditModal();
}

function setupEditModal() {
    const modal = document.getElementById("edit-modal");
    const btnEnable = document.getElementById("edit-enable");
    const btnCancel = document.getElementById("edit-cancel");
    const btnSave = document.getElementById("edit-save");

    if (btnEnable) btnEnable.addEventListener("click", () => {
        setEditInputsEnabled(true);
        document.getElementById("edit-subtext").textContent = "Editing enabled. Make changes and click Save.";
    });

    if (btnCancel) btnCancel.addEventListener("click", (e) => {
        e.preventDefault();
        closeEditModal();
    });

    if (btnSave) btnSave.addEventListener("click", (e) => {
        e.preventDefault();
        saveEditModal();
    });

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeEditModal();
        });
    }

    setupEditImageUpload();
}
//end edit modal flow 

// Populate form for editing
function editProduct(id) {
    const p = adminProducts.find(x => x.id === id);
    if (!p) return alert("Product not found");

    document.getElementById("prod-name").value = p.name || "";
    document.getElementById("prod-price").value = p.price || "";
    const cat = document.getElementById("prod-category");
    if (cat) cat.value = p.category || "";

    const preview = document.getElementById("image-preview");
    if (preview) {
        preview.innerHTML = p.image
            ? `<img src="${p.image}">`
            : `<div class="image-preview-placeholder">No image selected</div>`;
    }

    const fileName = document.getElementById("file-name");
    if (fileName) fileName.textContent = p.image ? "Current image" : "No file chosen";

    const fileInput = document.getElementById("prod-image");
    if (fileInput) fileInput.value = "";

    editingProductId = id;

    // change button label to Save Product
    const addBtn = document.querySelector("#products .card > button");
    if (addBtn) addBtn.textContent = "Save Product";

    // ensure admin sees the form
    const panel = document.getElementById("products");
    if (panel) panel.scrollIntoView({ behavior: "smooth" });
}

// Create or update product on same handler
function addProduct() {
    const name = document.getElementById("prod-name").value.trim();
    const price = Number(document.getElementById("prod-price").value);
    const category = document.getElementById("prod-category").value;
    const fileInput = document.getElementById("prod-image");

    if (!name || !price || !category) {
        return alert("Fill all fields");
    }

    // Helper to finalize save (handles both create/update)
    function finalizeSave(imageData) {
        if (editingProductId) {
            // update existing
            const idx = adminProducts.findIndex(p => p.id === editingProductId);
            if (idx === -1) {
                alert("Original product not found; cannot update.");
                editingProductId = null;
                return;
            }
            // keep existing image if no new image provided
            const existingImg = adminProducts[idx].image || "";
            adminProducts[idx] = {
                ...adminProducts[idx],
                name,
                price,
                category,
                image: imageData !== null ? imageData : existingImg
            };
            editingProductId = null;
        } else {
            // create new
            adminProducts.push({
                id: generateId(),
                name,
                price,
                category,
                image: imageData || ""
            });
        }

        saveData("gm_products", adminProducts);
        renderAdminProducts();
        resetProductForm();
    }

    // If a new file selected, read it and then finalize
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            finalizeSave(e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // No new file: pass null so finalizeSave knows to keep existing image on edit,
        // or empty string for new product
        finalizeSave(editingProductId ? null : "");
    }
}

// Reset form and editing state
function resetProductForm() {
    document.getElementById("prod-name").value = "";
    document.getElementById("prod-price").value = "";
    const cat = document.getElementById("prod-category");
    if (cat) cat.selectedIndex = 0;
    document.getElementById("prod-image").value = "";
    const preview = document.getElementById("image-preview");
    if (preview) preview.innerHTML = `<div class="image-preview-placeholder">No image selected</div>`;
    const fn = document.getElementById("file-name");
    if (fn) fn.textContent = "No file chosen";

    editingProductId = null;
    const addBtn = document.querySelector("#products .card > button");
    if (addBtn) addBtn.textContent = "Add Product";
}

// Confirmed delete (open modal)
function deleteProduct(id) {
    // open confirm modal instead of immediate delete
    pendingDeleteId = id;
    const modal = document.getElementById("confirm-modal");
    const text = document.getElementById("confirm-text");
    if (text) text.textContent = "Delete this product? This action cannot be undone.";
    if (modal) modal.setAttribute("aria-hidden", "false");
}

// perform actual deletion
function performDeleteProduct() {
    if (!pendingDeleteId) return closeConfirmModal();
    adminProducts = adminProducts.filter((p) => p.id !== pendingDeleteId);
    saveData("gm_products", adminProducts);
    renderAdminProducts();
    pendingDeleteId = null;
    closeConfirmModal();
}

function closeConfirmModal() {
    const modal = document.getElementById("confirm-modal");
    if (modal) modal.setAttribute("aria-hidden", "true");
}

// setup modal buttons - call this during initAdmin()
function setupConfirmModal() {
    const ok = document.getElementById("confirm-ok");
    const cancel = document.getElementById("confirm-cancel");
    const modal = document.getElementById("confirm-modal");

    if (ok) ok.addEventListener("click", (e) => {
        e.preventDefault();
        performDeleteProduct();
    });

    if (cancel) cancel.addEventListener("click", (e) => {
        e.preventDefault();
        pendingDeleteId = null;
        closeConfirmModal();
    });

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                pendingDeleteId = null;
                closeConfirmModal();
            }
        });
    }
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
    if (!tbody) return;

    const orders = loadData("gm_orders") || [];

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="muted">No orders yet</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map((order, index) => {
        // Format order ID as GMO-001, GMO-002, etc.
        const orderNumber = String(index + 1).padStart(3, '0');
        const formattedOrderId = `GMO-${orderNumber}`;

        const date = order.date ? new Date(order.date).toLocaleString() : "";
        const total = Number(order.total || 0).toFixed(2);
        const customer = order.customer || "Guest";

        // items detail HTML
        const itemsHtml = (order.items || []).map(it =>
            `<div>${it.qty} × ${it.name} — Rs ${(Number(it.price) * Number(it.qty)).toFixed(2)}</div>`
        ).join("");

        return `
            <tr>
                <td>${formattedOrderId}</td>
                <td>${date}</td>
                <td>${customer}</td>
                <td>Rs ${total}</td>
                <td>
                    <details>
                        <summary>${(order.items || []).length} item(s)</summary>
                        <div style="margin-top:8px">${itemsHtml}</div>
                    </details>
                </td>
            </tr>
        `;
    }).join("");
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
    setupConfirmModal();
    setupEditModal(); 
}

document.addEventListener("DOMContentLoaded", initAdmin);

