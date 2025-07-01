class EcommerceProducts {
  constructor() {
    this.products = this.loadProducts();
    this.grid = null;
    document.addEventListener('DOMContentLoaded', () => this.init());
    window.addEventListener('storage', (e) => {
      if (e.key === 'noblMode' || e.key === 'noblUser' || e.key === 'noblProducts') this.render();
    });
  }
  loadProducts() {
    const saved = localStorage.getItem('noblProducts');
    if (saved) return JSON.parse(saved);
    return [
      { name: 'Premium Leather Saddle', description: 'Handcrafted for comfort and durability. Perfect for long rides.', price: 350, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', type: 'horse' },
      { name: 'Organic Camel Feed', description: 'Nutrient-rich feed to keep your camels healthy and strong.', price: 45, image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', type: 'camel' },
      { name: 'Horse Grooming Brush', description: 'Gentle and effective for daily grooming. Suitable for all breeds.', price: 18, image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80', type: 'horse' },
      { name: 'Stable Maintenance Kit', description: 'All-in-one kit for keeping your stables clean and organized.', price: 75, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', type: 'horse' },
      { name: 'Desert Camel Blanket', description: 'Warm and lightweight, designed for desert nights.', price: 60, image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', type: 'camel' },
      { name: 'Custom Horse Halter', description: 'Adjustable and durable, available in multiple colors.', price: 28, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', type: 'horse' }
    ];
  }
  saveProducts() {
    localStorage.setItem('noblProducts', JSON.stringify(this.products));
  }
  init() {
    this.grid = document.querySelector('.row.row-cols-1.row-cols-md-3.g-4');
    this.render();
    // Show add product bar for vendors
    const addBar = document.getElementById('add-product-bar');
    const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    if (addBar) addBar.style.display = user.role === 'vendor' ? '' : 'none';
    // Add product form
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => this.handleAddProduct(e));
    }
    // Listen for sign in/out to update add bar
    window.addEventListener('storage', (e) => {
      if (e.key === 'noblUser' && addBar) {
        const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
        addBar.style.display = user.role === 'vendor' ? '' : 'none';
      }
    });
  }
  getMode() {
    return localStorage.getItem('noblMode') || 'camel';
  }
  render() {
    if (!this.grid) return;
    this.products = this.loadProducts();
    const mode = this.getMode();
    const filtered = this.products.filter(p => p.type === mode);
    if (filtered.length === 0) {
      this.grid.innerHTML = `<div class='col'><div class='card nobl-card h-100 text-center p-4'><p>No products available for this mode.</p></div></div>`;
      return;
    }
    this.grid.innerHTML = filtered.map(product => `
      <div class="col">
        <div class="card nobl-card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <div class="mt-auto">
              <span class="fw-bold">$${product.price}</span>
              <a href="#" class="btn btn-outline-primary ms-3">Buy Now</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  handleAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-desc').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();
    const type = document.getElementById('product-type').value;
    if (!name || !description || !image || isNaN(price) || !type) return;
    this.products.push({ name, description, price, image, type });
    this.saveProducts();
    this.render();
    // Hide modal
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addProductModal'));
    modal.hide();
    e.target.reset();
  }
}
new EcommerceProducts(); 