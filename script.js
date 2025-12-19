// --- Global Global Constants ---
const STORAGE_KEY = 'thai_nguyen_tea_products';
const CART_KEY = 'thai_nguyen_tea_cart';
const DEFAULT_PRODUCTS = [
    { id: 1, name: "Trà Tân Cương Đặc Biệt", price: 450000, category: "Cao Cấp", image: "images/product-1.png" },
    { id: 2, name: "Trà Móc Câu Hảo Hạng", price: 320000, category: "Truyền Thống", image: "images/product-2.png" },
    { id: 3, name: "Trà Nõn Tôm Vương Giả", price: 850000, category: "Thượng Hạng", image: "images/product-1.png" }
];

// --- Global Functions ---

window.loadProducts = function () {
    let products = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!products || products.length === 0) {
        products = DEFAULT_PRODUCTS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
    return products;
};

window.getCart = function () {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

window.saveCart = function (cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.updateCartBadge(); // Call global updateCartBadge
    window.dispatchEvent(new Event('cartUpdated'));
};

window.addToCart = function (productId, quantity = 1) {
    let cart = window.getCart();
    const products = window.loadProducts();
    const product = products.find(p => p.id == productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id == productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }

    window.saveCart(cart);
    window.updateCartBadge();
};

window.removeFromCart = function (productId) {
    let cart = window.getCart();
    cart = cart.filter(item => item.id != productId);
    window.saveCart(cart);
    // If on cart page, re-render
    if (window.location.pathname.includes('cart.html')) window.renderCartPage();
};

window.updateCartQty = function (productId, change) {
    let cart = window.getCart();
    const item = cart.find(i => i.id == productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        window.saveCart(cart);
        if (window.location.pathname.includes('cart.html')) window.renderCartPage();
    }
};

window.updateCartBadge = function () {
    const cart = window.getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(el => el.textContent = totalQty);
}

window.renderCartPage = function () {
    const tbody = document.getElementById('cart-body');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartContent = document.getElementById('cart-content');
    const totalEl = document.getElementById('cart-total');

    if (!tbody) return;

    const cart = window.getCart();

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    cartContent.style.display = 'block';
    emptyMsg.style.display = 'none';

    let total = 0;
    tbody.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${item.image}" class="cart-item-image" alt="${item.name}">
                        <div>
                            <h4 style="margin: 0;">${item.name}</h4>
                            <span style="font-size: 0.9rem; color: #666;">${item.category}</span>
                        </div>
                    </div>
                </td>
                <td>${Number(item.price).toLocaleString('vi-VN')}₫</td>
                <td>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                        <input type="text" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight: bold; color: var(--color-primary);">${Number(itemTotal).toLocaleString('vi-VN')}₫</td>
                <td>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.textContent = Number(total).toLocaleString('vi-VN') + '₫';
}

window.attachCartListeners = function () {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        // Clone to remove existing listeners to be safe (simple way)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            const qtyInput = document.querySelector('input[type="number"]');
            let qty = 1;
            // Only use qty input if we are on detail page
            if (qtyInput && window.location.pathname.includes('detail.html')) {
                qty = parseInt(qtyInput.value) || 1;
            }

            let id = newBtn.getAttribute('data-id');
            if (!id && window.location.pathname.includes('detail.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                id = urlParams.get('id');
            }

            if (id) {
                window.addToCart(id, qty);

                const originalText = newBtn.textContent;
                const originalBg = newBtn.style.backgroundColor;

                newBtn.textContent = 'Đã Thêm!';
                newBtn.style.backgroundColor = 'var(--color-primary-dark)';

                setTimeout(() => {
                    newBtn.textContent = originalText;
                    newBtn.style.backgroundColor = originalBg;
                }, 1000);
            }
        });
    });


}

// Home Page: Render Featured
function renderFeaturedProducts() {
    const container = document.querySelector('.products-grid#featured-products') || document.querySelector('.products-grid');

    // Only run if we are on Homepage and NOT on products or cart page
    if (!container || window.location.pathname.includes('products.html') || window.location.pathname.includes('cart.html')) return;

    const products = window.loadProducts();
    const featured = products.slice(0, 3);

    container.innerHTML = featured.map(p => `
        <div class="product-card fade-in visible">
            <div class="product-image">
                <a href="detail.html?id=${p.id}">
                    <img src="${p.image}" alt="${p.name}">
                </a>
            </div>
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <a href="detail.html?id=${p.id}" style="text-decoration: none; color: inherit;">
                    <h3 class="product-title">${p.name}</h3>
                </a>
                <span class="product-price">${Number(p.price).toLocaleString('vi-VN')}₫ / 500g</span>
                <button class="btn btn-primary add-to-cart" data-id="${p.id}">Thêm Vào Giỏ</button>
            </div>
        </div>
    `).join('');

    window.attachCartListeners();
}

// --- Initialization ---

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // Global Cart Icon Click
    document.querySelectorAll('.cart-icon').forEach(icon => {
        icon.onclick = () => window.location.href = 'cart.html';
    });

    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Init Logic
    window.updateCartBadge();
    renderFeaturedProducts();
});
