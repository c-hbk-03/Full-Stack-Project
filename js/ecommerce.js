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
      { name: 'Premium Leather Saddle', description: 'Handcrafted for comfort and durability. Perfect for long rides.', price: 350, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7s1dE4C9TdR1SEJzaORsbAKpxj62wL24A3w&s', type: 'horse' },
      { name: 'Organic Camel Feed', description: 'Nutrient-rich feed to keep your camels healthy and strong.', price: 45, image: 'https://static.wixstatic.com/media/b650ce_37b11a46a0924f588edbace2d414d65d~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg', type: 'camel' },
      { name: 'Horse Grooming Brush', description: 'Gentle and effective for daily grooming. Suitable for all breeds.', price: 18, image: 'https://m.media-amazon.com/images/I/61e0YjPzikL.jpg', type: 'horse' },
      { name: 'Stable Maintenance Kit', description: 'All-in-one kit for keeping your stables clean and organized.', price: 75, image: 'https://i0.wp.com/stablestyle.net/wp-content/uploads/2022/03/New-barn-tour-on-Stable-Style.jpg?fit=1500%2C1001&ssl=1', type: 'horse' },
      { name: 'Desert Camel Blanket', description: 'Warm and lightweight, designed for desert nights.', price: 60, image: 'https://media.istockphoto.com/id/494924154/photo/camel-resting-in-the-desert.jpg?s=612x612&w=0&k=20&c=vG6wr_y93bFRO6ss7LJ3ZZroVdSLA4Ln0w27fifT_3A=', type: 'camel' },
      { name: 'Custom Horse Halter', description: 'Adjustable and durable, available in multiple colors.', price: 28, image: 'https://perrisleather.com/img/product/190PHBB_1-B.jpg?fv=79ED08F65B6F92C4EF4BEFCC20855ADA', type: 'horse' }
    ];
  }
  saveProducts() {
    localStorage.setItem('noblProducts', JSON.stringify(this.products));
  }
  getUserRole() {
    const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    return user.role || null;
  }
  init() {
    this.grid = document.querySelector('.row.row-cols-1.row-cols-md-3.g-4');
    this.render();
    // Show add product bar for vendors only
    const addBar = document.getElementById('add-product-bar');
    if (addBar) addBar.style.display = this.getUserRole() === 'vendor' ? '' : 'none';
    // Add product form
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => this.handleAddProduct(e));
    }
    // Prevent modal opening for non-vendors
    const addProductModalBtn = addBar ? addBar.querySelector('button[data-bs-toggle="modal"]') : null;
    if (addProductModalBtn) {
      addProductModalBtn.addEventListener('click', (e) => {
        if (this.getUserRole() !== 'vendor') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
    }
    // Listen for sign in/out to update add bar
    window.addEventListener('storage', (e) => {
      if (e.key === 'noblUser' && addBar) {
        addBar.style.display = this.getUserRole() === 'vendor' ? '' : 'none';
        this.render();
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
    const role = this.getUserRole();
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
              ${role === 'client' ? `<a href="#" class="btn btn-outline-primary ms-3">Buy Now</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
    // Hide all buy buttons for non-clients
    if (role !== 'client') {
      const buyBtns = this.grid.querySelectorAll('.btn.btn-outline-primary');
      buyBtns.forEach(btn => btn.style.display = 'none');
    }
    // Hide add product bar for non-vendors
    const addBar = document.getElementById('add-product-bar');
    if (addBar) addBar.style.display = role === 'vendor' ? '' : 'none';
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