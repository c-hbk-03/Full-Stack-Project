class ManageProducts {
  constructor() {
    this.grid = document.getElementById('manage-products-grid');
    this.vendorAccess = document.getElementById('vendor-access');
    this.accessDenied = document.getElementById('access-denied');
    this.addBar = document.getElementById('add-product-bar');
    document.addEventListener('DOMContentLoaded', () => this.init());
    window.addEventListener('storage', (e) => {
      if (e.key === 'noblUser' || e.key === 'noblProducts') this.updateAccess();
    });
  }
  getUserRole() {
    const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    return user.role || null;
  }
  loadProducts() {
    const saved = localStorage.getItem('noblProducts');
    if (saved) return JSON.parse(saved);
    return [];
  }
  saveProducts(products) {
    localStorage.setItem('noblProducts', JSON.stringify(products));
  }
  init() {
    this.updateAccess();
    // Add product form
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => this.handleAddProduct(e));
    }
  }
  updateAccess() {
    const role = this.getUserRole();
    if (role !== 'vendor') {
      if (this.vendorAccess) this.vendorAccess.style.display = 'none';
      if (this.accessDenied) this.accessDenied.style.display = '';
    } else {
      if (this.vendorAccess) this.vendorAccess.style.display = '';
      if (this.accessDenied) this.accessDenied.style.display = 'none';
      this.render();
    }
  }
  render() {
    if (!this.grid) return;
    const products = this.loadProducts();
    if (products.length === 0) {
      this.grid.innerHTML = `<div class='col'><div class='card nobl-card h-100 text-center p-4'><p>No products found.</p></div></div>`;
      return;
    }
    this.grid.innerHTML = products.map((product, idx) => `
      <div class="col">
        <div class="card nobl-card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold">$${product.price}</span>
              <button class="btn btn-outline-danger btn-sm ms-3" data-idx="${idx}">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    // Add delete listeners
    this.grid.querySelectorAll('button[data-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleDeleteProduct(e));
    });
  }
  handleAddProduct(e) {
    e.preventDefault();
    if (this.getUserRole() !== 'vendor') return;
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-desc').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();
    const type = document.getElementById('product-type').value;
    if (!name || !description || !image || isNaN(price) || !type) return;
    const products = this.loadProducts();
    products.push({ name, description, price, image, type });
    this.saveProducts(products);
    this.render();
    // Hide modal
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addProductModal'));
    modal.hide();
    e.target.reset();
  }
  handleDeleteProduct(e) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    let products = this.loadProducts();
    if (isNaN(idx) || idx < 0 || idx >= products.length) return;
    products.splice(idx, 1);
    this.saveProducts(products);
    this.render();
  }
}
new ManageProducts(); 