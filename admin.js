// Product Data Structure
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Trà Tân Cương Đặc Biệt",
        price: 450000,
        category: "Cao Cấp",
        image: "images/product-1.png"
    },
    {
        id: 2,
        name: "Trà Móc Câu Hảo Hạng",
        price: 320000,
        category: "Truyền Thống",
        image: "images/product-2.png"
    },
    {
        id: 3,
        name: "Trà Nõn Tôm Vương Giả",
        price: 850000,
        category: "Thượng Hạng",
        image: "images/product-1.png"
    }
];

// LocalStorage Keys
const STORAGE_KEY = 'thai_nguyen_tea_products';

class AdminApp {
    constructor() {
        this.products = this.loadProducts();
        this.initEventListeners();
        this.renderProductTable();
        this.updateStats();
    }

    loadProducts() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
            return DEFAULT_PRODUCTS;
        }
        return JSON.parse(stored);
    }

    saveProducts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
        this.renderProductTable();
        this.updateStats();
    }

    // CRUD Operations
    addProduct(product) {
        product.id = Date.now(); // Simple ID generation
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

    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    // UI Logic
    renderProductTable() {
        const tbody = document.getElementById('product-table-body');
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

        document.getElementById('total-products').textContent = this.products.length;
    }

    updateStats() {
        // Just updating the counter in render for now
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

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.classList.contains('logout')) return;

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
        document.getElementById('product-form').addEventListener('submit', (e) => {
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

// Initialize
const app = new AdminApp();
