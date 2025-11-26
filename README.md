# GrillMaster POS

Professional, lightweight client-side Point of Sale (POS) system for a burger shop.  
Built with plain HTML, CSS and JavaScript — perfect for demos, small shops, or as a starting point for a server-backed POS.

---

## Key features
- Product catalog with categories, search and responsive grid
- Add-to-order cart with per-line quantities, subtotal / tax / total
- Capture customer name per order and save orders
- Admin panel: add / edit / delete products & customers, view order history
- Local image upload with preview for products (compressed & fallback handling)
- Mobile-friendly cart UI with slide-up panel and mobile cart bar
- Client-side admin login (session-based)
- Data persisted in browser storage (localStorage); optional IndexedDB image pattern available

---

## Project structure
- `index.html` — POS interface
- `admin.html` — Admin interface
- `css/` — styles (`style.css`, `admin.css`)
- `js/` — scripts (`pos.js`, `cart.js`, `admin.js`, `storage.js`, `seed.js`)
- `assets/` — logos and sample images

---

## Quick start (Windows)

Requirements: modern browser (Chrome/Edge/Firefox). Node is optional for a local static server.

1. Open project in VS Code:
   - d:\ICET\Internet Technologies\GrillMaster POS
2. Recommended: run a local static server (prevents some file/loading restrictions)
   - With npm:  
     Open PowerShell in project folder and run:
     ```
     npx http-server -c-1
     ```
   - Or use the Live Server VS Code extension: Right‑click `index.html` → *Open with Live Server*
3. Open the served URL (eg. `http://127.0.0.1:8080`) or open `index.html` in a browser.

---

## Admin access
- Default client-side credential (change for production):
  - Username: `admin`
  - Password: `gmadmin`
- On successful login a short session is stored in `sessionStorage` and user is redirected to `admin.html`.
- To add additional admin users, store an array under localStorage key `gm_admins`:
  ```json
  [{ "username": "alice", "password": "alicepass" }]
  ```

---

## Data storage details
- Products: `localStorage` key `gm_products`
- Customers: `localStorage` key `gm_customers`
- Orders: `localStorage` key `gm_orders`
- Images: stored inline as compressed data-URLs by default. Large images may exceed localStorage quota — the admin implementation:
  - compresses images before saving;
  - falls back to saving product without image if quota exceeded;
  - optional IndexedDB helper is available in the code to store image blobs and reference them from `localStorage`.

Order IDs in admin list are displayed as `GMO-001`, `GMO-002`, etc.

---

## Troubleshooting
- QuotaExceededError when adding images:
  - Use smaller images, or
  - Clear localStorage keys (DevTools → Application → Local Storage) or run:
    ```javascript
    localStorage.removeItem('gm_products');
    localStorage.removeItem('gm_orders');
    location.reload();
    ```
  - Consider enabling the IndexedDB image storage option in `admin.js` (recommended for production).
- If UI scripts do not work, verify script load order in `index.html`:
  - `storage.js`, `seed.js`, `cart.js`, `pos.js` (order matters).

---

## Development notes
- This is a client-only prototype. For production:
  - Move auth and persistence to a backend (do not use client-side passwords).
  - Use a server or IndexedDB for robust image and order storage.
  - Add proper validation, error handling, and concurrency safeguards.
- Useful improvements:
  - Receipt printing / PDF export
  - Inventory tracking & low-stock alerts
  - POS hardware integration (receipt printer, cash drawer, barcode scanner)

---

## Contributing
Fork the repo, create a feature branch, and open a pull request with a clear description. Keep changes scoped and include any migration notes for storage changes.

---

## License
MIT — modify as needed for your project.