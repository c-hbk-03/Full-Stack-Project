class ServicesPage {
  constructor() {
    this.services = [
      {
        name: 'Camel Vet Visit',
        description: 'Professional veterinary care for your camels, including checkups and vaccinations.',
        icon: '🐪',
        type: 'camel'
      },
      {
        name: 'Camel Stable Maintenance',
        description: 'Keep your camel stables clean and safe with our maintenance team.',
        icon: '🧹',
        type: 'camel'
      },
      {
        name: 'Camel Nutrition Consultation',
        description: 'Get expert advice on camel diets and supplements.',
        icon: '🥕',
        type: 'camel'
      },
      {
        name: 'Horse Vet Visit',
        description: 'Comprehensive veterinary services for your horses, from routine care to emergencies.',
        icon: '🐎',
        type: 'horse'
      },
      {
        name: 'Horse Stable Maintenance',
        description: 'Ensure your horse stables are in top condition with our maintenance experts.',
        icon: '🧹',
        type: 'horse'
      },
      {
        name: 'Horse Training Consultation',
        description: 'Book a session with a professional horse trainer for tips and guidance.',
        icon: '🏇',
        type: 'horse'
      }
    ];
    this.grid = null;
    document.addEventListener('DOMContentLoaded', () => this.init());
    window.addEventListener('storage', (e) => {
      if (e.key === 'noblMode') this.render();
    });
  }
  init() {
    this.grid = document.getElementById('services-grid');
    this.render();
    // Listen for mode switcher clicks
    const camelBtn = document.getElementById('camel-mode');
    const horseBtn = document.getElementById('horse-mode');
    if (camelBtn && horseBtn) {
      camelBtn.addEventListener('click', () => setTimeout(() => this.render(), 10));
      horseBtn.addEventListener('click', () => setTimeout(() => this.render(), 10));
    }
  }
  getMode() {
    return localStorage.getItem('noblMode') || 'camel';
  }
  render() {
    if (!this.grid) return;
    const mode = this.getMode();
    const filtered = this.services.filter(s => s.type === mode);
    if (filtered.length === 0) {
      this.grid.innerHTML = `<div class='col'><div class='card nobl-card h-100 text-center p-4'><p>No services available for this mode.</p></div></div>`;
      return;
    }
    this.grid.innerHTML = filtered.map(service => `
      <div class="col">
        <div class="card nobl-card h-100">
          <div class="card-body d-flex flex-column align-items-center text-center">
            <div style="font-size:2.5rem;">${service.icon}</div>
            <h5 class="card-title mt-2">${service.name}</h5>
            <p class="card-text flex-grow-1">${service.description}</p>
            <a href="#" class="btn btn-outline-primary mt-auto">Book Now</a>
          </div>
        </div>
      </div>
    `).join('');
  }
}
new ServicesPage(); 