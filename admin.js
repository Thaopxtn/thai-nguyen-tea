const STORAGE_KEY = 'thai_nguyen_tea_products';
const ORDERS_KEY = 'thai_nguyen_orders';
const ARTICLES_KEY = 'thai_nguyen_articles';

class AdminApp {
    constructor() {
        this.checkLogin();
        this.products = this.loadProducts();
        this.products = this.loadProducts();
        this.articles = this.loadArticles();
        this.orders = this.loadOrders();
        this.initEventListeners();
        this.renderProductTable();
        this.renderArticleTable();
        this.renderArticleTable();
        this.renderOrderTable();
        this.initDashboard();
        this.updateStats();
    }

    checkLogin() {
        const loggedIn = localStorage.getItem('admin_logged_in');
        if (loggedIn !== 'true') {
            window.location.href = 'login.html';
        }
    }

    loadProducts() {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (stored && stored.length > 0) return stored;

        // Fallback for Admin if LS is empty
        return [
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
    }

    loadOrders() {
        return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    }

    loadArticles() {
        return JSON.parse(localStorage.getItem(ARTICLES_KEY)) || [];
    }

    saveProducts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
        this.renderProductTable();
        this.updateStats();
    }

    saveArticles() {
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(this.articles));
        this.renderArticleTable();
    }

    // CRUD Operations
    addProduct(product) {
        product.id = Date.now();
        this.products.push(product);
        this.saveProducts();
    }

    updateProduct(updatedProduct) {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
            this.saveProducts();
        }
    }

    deleteProduct(id) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
        }
    }

    // Article CRUD
    addArticle(article) {
        article.id = Date.now();
        this.articles.unshift(article);
        this.saveArticles();
    }

    updateArticle(updatedArticle) {
        const index = this.articles.findIndex(a => a.id === updatedArticle.id);
        if (index !== -1) {
            this.articles[index] = updatedArticle;
            this.saveArticles();
        }
    }

    deleteArticle(id) {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            this.saveArticles();
        }
    }

    getArticle(id) {
        return this.articles.find(a => a.id === id);
    }

    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    // UI Logic
    renderProductTable() {
        const tbody = document.getElementById('product-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.image}" class="product-thumb" alt="${p.name}"></td>
                <td><strong>${p.name}</strong></td>
                <td>${Number(p.price).toLocaleString('vi-VN')}₫</td>
                <td><span style="color: var(--secondary); font-weight: 500">${p.category}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="app.editProductBtn(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="app.deleteProduct(${p.id})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const totalEl = document.getElementById('total-products');
        if (totalEl) totalEl.textContent = this.products.length;
    }

    renderArticleTable() {
        const tbody = document.getElementById('article-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.articles.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${a.image}" class="product-thumb" alt="${a.title}"></td>
                <td><strong>${a.title}</strong></td>
                <td>${a.date}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="app.editArticleBtn(${a.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="app.deleteArticle(${a.id})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateStats() {
        // Update dashboard counts
        const totalEl = document.querySelector('#dashboard .stat-card:nth-child(2) .number');
        if (totalEl) totalEl.textContent = this.products.length;

        const ordersEl = document.querySelector('#dashboard .stat-card:nth-child(1) .number');
        if (ordersEl) ordersEl.textContent = this.orders.length;
    }

    renderOrderTable() {
        const tbody = document.getElementById('order-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        // Filter and Sort
        let filteredOrders = [...this.orders];

        // Search
        const searchTerm = document.getElementById('order-search') ? document.getElementById('order-search').value.toLowerCase() : '';
        if (searchTerm) {
            filteredOrders = filteredOrders.filter(o =>
                String(o.id).toLowerCase().includes(searchTerm) ||
                o.customer.toLowerCase().includes(searchTerm) ||
                o.phone.includes(searchTerm)
            );
        }

        // Filter Status
        const statusFilter = document.getElementById('order-filter-status') ? document.getElementById('order-filter-status').value : '';
        if (statusFilter) {
            filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
        }

        // Sort
        const sortType = document.getElementById('order-sort') ? document.getElementById('order-sort').value : 'newest';
        filteredOrders.sort((a, b) => {
            if (sortType === 'newest') return b.id - a.id; // Using ID as proxy for time as it is Date.now()
            if (sortType === 'oldest') return a.id - b.id;

            // Helper to parsing price string "xxx.xxx₫" to number
            const priceA = parseInt(String(a.total).replace(/\D/g, '')) || 0;
            const priceB = parseInt(String(b.total).replace(/\D/g, '')) || 0;

            if (sortType === 'price-high') return priceB - priceA;
            if (sortType === 'price-low') return priceA - priceB;
            return 0;
        });

        filteredOrders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}<br><span style="font-size: 0.8rem; color: #888">${order.phone}</span></td>
                <td>${order.date}</td>
                <td>${order.total}</td>
                <td><span class="status-badge ${this.getStatusClass(order.status)}">${order.status}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="app.viewOrder('${order.id}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn delete-btn" onclick="app.deleteOrder('${order.id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    getStatusClass(status) {
        if (status === 'Chờ xử lý') return 'status-pending';
        if (status === 'Đang giao') return 'status-shipping';
        if (status === 'Đã hoàn thành') return 'status-completed';
        if (status === 'Đã hủy') return 'status-cancelled';
        return '';
    }

    viewOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (!order) return;

        const detailContent = document.getElementById('order-detail-content');
        if (detailContent) {
            detailContent.innerHTML = `
                <div class="order-info-grid">
                    <div>
                        <h3>Thông Tin Khách Hàng</h3>
                        <p><strong>Họ tên:</strong> ${order.customer}</p>
                        <p><strong>SĐT:</strong> ${order.phone}</p>
                        <p><strong>Địa chỉ:</strong> ${order.address}</p>
                    </div>
                    <div>
                        <h3>Thông Tin Đơn Hàng</h3>
                        <p><strong>Mã Đơn:</strong> ${order.id}</p>
                        <p><strong>Ngày Đặt:</strong> ${order.date}</p>
                        <p><strong>Tổng Tiền:</strong> <span class="price">${order.total}</span></p>
                        <p><strong>Trạng Thái:</strong> 
                            <select onchange="app.updateOrderStatus('${order.id}', this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                                <option value="Chờ xử lý" ${order.status === 'Chờ xử lý' ? 'selected' : ''}>Chờ xử lý</option>
                                <option value="Đang giao" ${order.status === 'Đang giao' ? 'selected' : ''}>Đang giao</option>
                                <option value="Đã hoàn thành" ${order.status === 'Đã hoàn thành' ? 'selected' : ''}>Đã hoàn thành</option>
                                <option value="Đã hủy" ${order.status === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </p>
                    </div>
                </div>
                <div style="margin-top: 1.5rem;">
                    <h3>Sản Phẩm Đã Mua</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
                        <thead>
                            <tr style="background: #f8f9fa; text-align: left;">
                                <th style="padding: 8px;">Sản Phẩm</th>
                                <th style="padding: 8px;">Số Lượng</th>
                                <th style="padding: 8px;">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 8px;">${item.name}</td>
                                    <td style="padding: 8px;">x${item.quantity}</td>
                                    <td style="padding: 8px;">${Number(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        openOrderModal();
    }

    updateOrderStatus(id, newStatus) {
        const orderIndex = this.orders.findIndex(o => o.id === id);
        if (orderIndex !== -1) {
            this.orders[orderIndex].status = newStatus;
            localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders));
            this.renderOrderTable();
            this.initDashboard(); // Refresh dashboard list if needed
        }
    }

    deleteOrder(id) {
        if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
            this.orders = this.orders.filter(o => o.id !== id);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders));
            this.renderOrderTable();
            this.initDashboard();
            this.updateStats();
        }
    }

    initDashboard() {
        // Recent Orders
        const list = document.getElementById('recent-orders-list');
        if (list && this.orders.length > 0) {
            list.innerHTML = this.orders.slice(0, 5).map(order => `
                <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${order.id}</strong><br>
                        <span style="font-size: 0.8rem; color: #666;">${order.customer}</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight: bold; color: var(--primary);">${order.total}</span><br>
                        <span style="font-size: 0.8rem; color: orange;">${order.status}</span>
                    </div>
                </div>
            `).join('');
        }

        // Chart
        const ctx = document.getElementById('revenueChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                    datasets: [{
                        label: 'Doanh Thu (Triệu VNĐ)',
                        data: [12, 19, 3, 5, 2, 3, 15, 25, 22, 30, 28, 45],
                        borderColor: '#0F4C3A',
                        backgroundColor: 'rgba(15, 76, 58, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }

    editProductBtn(id) {
        const product = this.getProduct(id);
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image').value = product.image;
        document.getElementById('modal-title').innerText = "Cập Nhật Sản Phẩm";
        openProductModal();
    }

    editArticleBtn(id) {
        const article = this.getArticle(id);
        document.getElementById('article-id').value = article.id;
        document.getElementById('article-title').value = article.title;
        document.getElementById('article-excerpt').value = article.excerpt;
        document.getElementById('article-date').value = article.date;
        document.getElementById('article-image').value = article.image;
        document.getElementById('article-modal-title').innerText = "Cập Nhật Bài Viết";
        openArticleModal();
    }

    logout() {
        localStorage.removeItem('admin_logged_in');
        window.location.href = 'login.html';
    }

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.classList.contains('logout')) {
                    this.logout();
                    return;
                }

                // Active Class
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // View Switching
                const tab = item.getAttribute('data-tab');
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById(tab).classList.add('active');
            });
        });

        // Form Submit
        const form = document.getElementById('product-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('product-id').value;
                const product = {
                    name: document.getElementById('product-name').value,
                    price: parseInt(document.getElementById('product-price').value),
                    category: document.getElementById('product-category').value,
                    image: document.getElementById('product-image').value
                };

                if (id) {
                    product.id = parseInt(id);
                    this.updateProduct(product);
                } else {
                    this.addProduct(product);
                }
                closeProductModal();
            });
        }

        // Article Form Submit
        const articleForm = document.getElementById('article-form');
        if (articleForm) {
            articleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('article-id').value;
                const article = {
                    title: document.getElementById('article-title').value,
                    excerpt: document.getElementById('article-excerpt').value,
                    date: document.getElementById('article-date').value,
                    image: document.getElementById('article-image').value
                };

                if (id) {
                    article.id = parseInt(id);
                    this.updateArticle(article);
                } else {
                    this.addArticle(article);
                }
                closeArticleModal();
            });
        }

        // Order Filters
        const orderSearch = document.getElementById('order-search');
        if (orderSearch) orderSearch.addEventListener('input', () => this.renderOrderTable());

        const orderFilter = document.getElementById('order-filter-status');
        if (orderFilter) orderFilter.addEventListener('change', () => this.renderOrderTable());

        const orderSort = document.getElementById('order-sort');
        if (orderSort) orderSort.addEventListener('change', () => this.renderOrderTable());
    }
}

// Global UI Functions
function openProductModal() {
    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').innerText = "Thêm Sản Phẩm";
}

function openArticleModal() {
    document.getElementById('article-modal').classList.add('active');
}

function closeArticleModal() {
    document.getElementById('article-modal').classList.remove('active');
    document.getElementById('article-form').reset();
    document.getElementById('article-id').value = '';
    document.getElementById('article-modal-title').innerText = "Viết Bài Mới";
}

function openOrderModal() {
    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

// Initialize
const app = new AdminApp();
