// --- Global Global Constants ---
const STORAGE_KEY = 'thai_nguyen_tea_products';
const CART_KEY = 'thai_nguyen_tea_cart';
const ARTICLES_KEY = 'thai_nguyen_articles';

const FALLBACK_PRODUCTS = [
    {
        "id": 1,
        "name": "Trà Tân Cương Đặc Biệt",
        "price": 450000,
        "category": "Cao Cấp",
        "image": "images/product-1.png",
        "desc": "Hương vị đậm đà, nước xanh, vị chát dịu hậu ngọt sâu."
    },
    {
        "id": 2,
        "name": "Trà Móc Câu Hảo Hạng",
        "price": 320000,
        "category": "Truyền Thống",
        "image": "images/product-2.png",
        "desc": "Cánh trà xoăn nhỏ, hương cốm non nồng nàn."
    },
    {
        "id": 3,
        "name": "Trà Nõn Tôm Vương Giả",
        "price": 850000,
        "category": "Thượng Hạng",
        "image": "images/product-1.png",
        "desc": "Tuyệt phẩm trà Việt. Chỉ lấy 1 tôm 1 lá non nhất."
    },
    {
        "id": 4,
        "name": "Trà Shan Tuyết Cổ Thụ",
        "price": 550000,
        "category": "Cao Cấp",
        "image": "images/product-2.png",
        "desc": "Thu hái từ những cây chè cổ thụ trên núi cao, hương vị tinh khiết."
    },
    {
        "id": 5,
        "name": "Trà Lài Tự Nhiên",
        "price": 280000,
        "category": "Hương Hoa",
        "image": "images/product-1.png",
        "desc": "Ướp hương hoa lài tự nhiên, thơm ngát, dễ uống."
    },
    {
        "id": 6,
        "name": "Trà Sen Tây Hồ",
        "price": 1200000,
        "category": "Thượng Hạng",
        "image": "images/product-2.png",
        "desc": "Tinh hoa trà Việt. Ướp trong bông sen bách diệp hồ Tây."
    }
];

const FALLBACK_ARTICLES = [
    {
        "id": 1,
        "title": "Lễ Hội Trà Thái Nguyên 2024",
        "image": "images/hero-bg.png",
        "date": "2024-12-20",
        "excerpt": "Hòa mình vào không khí lễ hội đặc sắc với các hoạt động văn hóa trà truyền thống."
    },
    {
        "id": 2,
        "title": "Cách Pha Trà Ngon Đúng Điệu",
        "image": "images/product-2.png",
        "date": "2024-12-18",
        "excerpt": "Hướng dẫn chi tiết từ các nghệ nhân trà để có được ấm trà thơm ngon, chuẩn vị."
    },
    {
        "id": 3,
        "title": "Tác Dụng Của Trà Xanh Với Sức Khỏe",
        "image": "images/product-1.png",
        "date": "2024-12-15",
        "excerpt": "Khám phá những lợi ích tuyệt vời của trà xanh đối với sức khỏe và sắc đẹp."
    }
];

// --- Global Functions ---

window.loadProducts = function () {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        if (parsed.length > 0) return parsed;
    } catch (e) {
        console.warn(e);
    }
    return FALLBACK_PRODUCTS;
};

window.loadArticles = function () {
    try {
        const stored = localStorage.getItem(ARTICLES_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        if (parsed.length > 0) return parsed;
    } catch (e) {
        console.warn(e);
    }
    return FALLBACK_ARTICLES;
};
// ... (keep getCart etc)

// ...

// --- Initialization ---

async function initData() {
    // Try to update from JSON file if possible
    try {
        const response = await fetch('products.json');
        if (response.ok) {
            const products = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        }
    } catch (error) {
        // Ignore fetch errors, we have fallback in loadProducts
        console.log('Using built-in product data');
        // Ensure data exists for other apps (like Admin) that rely on localStorage
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_PRODUCTS));
        }

        // Ensure articles exist
        if (!localStorage.getItem(ARTICLES_KEY)) {
            localStorage.setItem(ARTICLES_KEY, JSON.stringify(FALLBACK_ARTICLES));
        }
    }
}

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

// --- UI Effects ---

window.showToast = function (message, type = 'success') {
    const container = document.querySelector('.toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
};

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

window.flyToCart = function (imgElement) {
    if (!imgElement) return;

    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;

    const flyImg = imgElement.cloneNode();
    flyImg.classList.add('flying-img');

    const rect = imgElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    flyImg.style.top = `${rect.top}px`;
    flyImg.style.left = `${rect.left}px`;
    flyImg.style.width = `${rect.width}px`;
    flyImg.style.height = `${rect.height}px`;

    document.body.appendChild(flyImg);

    // Force reflow
    void flyImg.offsetWidth;

    flyImg.style.top = `${cartRect.top + 10}px`;
    flyImg.style.left = `${cartRect.left + 10}px`;
    flyImg.style.width = '20px';
    flyImg.style.height = '20px';
    flyImg.style.opacity = '0.5';

    flyImg.addEventListener('transitionend', () => {
        flyImg.remove();
        // Optional: Bump effect on cart icon
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
    });
};

window.attachCartListeners = function () {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            const qtyInput = document.querySelector('input[type="number"]');
            let qty = 1;
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

                // UI Effects
                window.showToast(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`);

                // Find image to fly
                let img = newBtn.closest('.product-card')?.querySelector('img');
                if (!img && window.location.pathname.includes('detail.html')) {
                    img = document.querySelector('.detail-image img'); // Assume detail page main image
                }

                if (img) window.flyToCart(img);
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

window.renderRelatedProducts = function (containerId, currentProductId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = window.loadProducts();
    const currentProduct = products.find(p => p.id == currentProductId);

    if (!currentProduct) return;

    // Filter by same category or just excludes current
    const related = products.filter(p => p.id != currentProductId).slice(0, 3);

    if (related.length === 0) {
        container.innerHTML = '<p>Không có sản phẩm tương tự.</p>';
        return;
    }

    container.innerHTML = related.map(p => `
        <div class="product-card">
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
                <span class="product-price">${Number(p.price).toLocaleString('vi-VN')}₫</span>
                <button class="btn btn-primary add-to-cart" data-id="${p.id}">Thêm Vào Giỏ</button>
            </div>
        </div>
    `).join('');

    window.attachCartListeners();
}

// --- Initialization ---

// --- Initialization ---



document.addEventListener('DOMContentLoaded', async () => {

    // Initialize Data first
    await initData();

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

    // Dispatch event for other scripts (like products.html inline script)
    window.appIsReady = true;
    window.dispatchEvent(new Event('appReady'));
});
