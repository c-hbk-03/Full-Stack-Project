class AnimalMarket {
  constructor() {
    this.marketList = document.getElementById('market-animals-list');
    this.addBtn = document.getElementById('add-market-animal-btn');
    this.addForm = document.getElementById('add-market-animal-form');
    this.imageInput = document.getElementById('market-animal-image');
    this.imagePreview = document.getElementById('market-animal-image-preview');
    this.errorDiv = document.getElementById('add-market-animal-error');
    this.modal = document.getElementById('addMarketAnimalModal');
    this.user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    this.breeds = {
      horse: [
        'Arabian', 'Thoroughbred', 'Akhal-Teke', 'Andalusian', 'Friesian', 'Quarter Horse', 'Shire', 'Other'
      ],
      camel: [
        'Majaheem', 'Sofor', 'Waddah', 'Shaele', 'Homor', 'Shageh', 'Other'
      ]
    };
    this.traits = {
      horse: [
        'Speed', 'Endurance', 'Agility', 'Temperament', 'Strength', 'Beauty', 'Other'
      ],
      camel: [
        'Stamina', 'Milk Production', 'Racing', 'Beauty', 'Temperament', 'Strength', 'Other'
      ]
    };
    this.typeSelect = document.getElementById('market-animal-type');
    this.breedSelect = document.getElementById('market-animal-breed');
    this.breedOther = document.getElementById('market-animal-breed-other');
    this.traitsSelect = document.getElementById('market-animal-traits');
    this.traitsOther = document.getElementById('market-animal-traits-other');
    this.timelineDiv = document.getElementById('market-timeline');
    if (this.imageInput) {
      this.imageInput.addEventListener('change', (e) => this.handleImagePreview(e));
    }
    if (this.addForm) {
      this.addForm.addEventListener('submit', (e) => this.handleAddAnimal(e));
    }
    if (this.typeSelect) {
      this.typeSelect.addEventListener('change', () => this.populateBreedAndTraits());
    }
    if (this.breedSelect) {
      this.breedSelect.addEventListener('change', () => this.handleBreedChange());
    }
    if (this.traitsSelect) {
      this.traitsSelect.addEventListener('change', () => this.handleTraitsChange());
    }
    if (this.modal) {
      this.modal.addEventListener('show.bs.modal', () => {
        if (this.typeSelect) this.typeSelect.value = 'camel';
        this.populateBreedAndTraits();
      });
    }
    this.initMockData();
    this.renderMarket();
    this.populateBreedAndTraits();
    this.renderTimeline();
  }
  getMarketAnimals() {
    return JSON.parse(localStorage.getItem('noblMarketAnimals') || '[]');
  }
  saveMarketAnimals(animals) {
    localStorage.setItem('noblMarketAnimals', JSON.stringify(animals));
  }
  getTimeline() {
    return JSON.parse(localStorage.getItem('noblMarketTimeline') || '[]');
  }
  saveTimeline(events) {
    localStorage.setItem('noblMarketTimeline', JSON.stringify(events));
  }
  addTimelineEvent(type, details) {
    const events = this.getTimeline();
    const now = new Date();
    events.unshift({
      type,
      details,
      time: now.toLocaleString()
    });
    this.saveTimeline(events.slice(0, 30)); // keep last 30 events
    this.renderTimeline();
  }
  handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) {
      this.imagePreview.classList.add('d-none');
      this.imagePreview.src = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.imagePreview.src = ev.target.result;
      this.imagePreview.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  }
  populateBreedAndTraits() {
    const type = this.typeSelect.value;
    this.breedSelect.innerHTML = '<option value="">Choose...</option>' + (this.breeds[type] || []).map(b => `<option value="${b}">${b}</option>`).join('');
    this.breedOther.classList.add('d-none');
    this.traitsSelect.innerHTML = '<option value="">Choose...</option>' + (this.traits[type] || []).map(t => `<option value="${t}">${t}</option>`).join('');
    this.traitsOther.classList.add('d-none');
  }
  handleBreedChange() {
    if (this.breedSelect.value === 'Other') {
      this.breedOther.classList.remove('d-none');
      this.breedOther.required = true;
    } else {
      this.breedOther.classList.add('d-none');
      this.breedOther.required = false;
    }
  }
  handleTraitsChange() {
    if (this.traitsSelect.value === 'Other') {
      this.traitsOther.classList.remove('d-none');
      this.traitsOther.required = true;
    } else {
      this.traitsOther.classList.add('d-none');
      this.traitsOther.required = false;
    }
  }
  handleAddAnimal(e) {
    e.preventDefault();
    const name = document.getElementById('market-animal-name').value.trim();
    const type = this.typeSelect.value;
    let breed = this.breedSelect.value;
    if (breed === 'Other') breed = this.breedOther.value.trim();
    const gender = document.getElementById('market-animal-gender').value;
    let traits = this.traitsSelect.value;
    if (traits === 'Other') traits = this.traitsOther.value.trim();
    const price = document.getElementById('market-animal-price').value;
    let image = '';
    if (this.imageInput && this.imageInput.files[0]) {
      image = this.imagePreview.src;
    }
    if (!name || !type || !breed || !gender || !traits || !price) {
      this.errorDiv.textContent = 'All fields are required.';
      this.errorDiv.classList.remove('d-none');
      return;
    }
    const animals = this.getMarketAnimals();
    animals.push({
      name, type, breed, gender, traits, price,
      image,
      seller: this.user.username || 'Unknown'
    });
    this.saveMarketAnimals(animals);
    this.addTimelineEvent('list', {
      name, type, price,
      seller: this.user.username || 'Unknown'
    });
    this.renderMarket();
    const modal = bootstrap.Modal.getOrCreateInstance(this.modal);
    modal.hide();
    this.addForm.reset();
    if (this.typeSelect) this.typeSelect.value = 'camel';
    this.populateBreedAndTraits();
    this.imagePreview.src = '';
    this.imagePreview.classList.add('d-none');
    this.errorDiv.classList.add('d-none');
  }
  handleBuyAnimal(index) {
    const animals = this.getMarketAnimals();
    const animal = animals[index];
    if (!animal) return;
    // Remove from market
    animals.splice(index, 1);
    this.saveMarketAnimals(animals);
    // If client, add to their animals
    const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    if (user.role === 'client') {
      const all = JSON.parse(localStorage.getItem('noblAnimals') || '{}');
      if (!all[user.username]) all[user.username] = [];
      all[user.username].push({
        name: animal.name,
        type: animal.type,
        breed: animal.breed,
        gender: animal.gender,
        traits: animal.traits,
        image: animal.image
      });
      localStorage.setItem('noblAnimals', JSON.stringify(all));
    }
    this.addTimelineEvent('buy', {
      name: animal.name,
      type: animal.type,
      price: animal.price,
      seller: animal.seller,
      buyer: user.username || 'Unknown'
    });
    this.renderMarket();
  }
  renderMarket() {
    const animals = this.getMarketAnimals();
    const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    if (!this.marketList) return;
    this.marketList.innerHTML = animals.length === 0 ? '<div class="col"><div class="alert alert-info">No animals for sale yet.</div></div>' :
      animals.map((a, i) => `
        <div class="col">
          <div class="card nobl-card h-100">
            <div class="card-body text-center">
              <img src="${a.image ? a.image : (a.type === 'camel' ? 'https://placehold.co/120x90?text=Camel' : 'https://placehold.co/120x90?text=Horse')}" alt="${a.name}" class="img-fluid rounded mb-2" style="max-height:90px;max-width:100%;object-fit:cover;border:1.5px solid #ccc;" />
              <h5 class="card-title">${a.name}</h5>
              <p class="card-text mb-1"><strong>Type:</strong> ${a.type.charAt(0).toUpperCase() + a.type.slice(1)}</p>
              <p class="card-text mb-1"><strong>Breed:</strong> ${a.breed}</p>
              <p class="card-text mb-1"><strong>Gender:</strong> ${a.gender.charAt(0).toUpperCase() + a.gender.slice(1)}</p>
              <p class="card-text mb-1"><strong>Traits:</strong> ${a.traits}</p>
              <p class="card-text mb-1"><strong>Price:</strong> <span class="text-success">SAR ${a.price}</span></p>
              <p class="card-text mb-1"><strong>Seller:</strong> ${a.seller}</p>
              <button class="btn btn-success w-100 mt-2" ${user.username === a.seller ? 'disabled' : ''} data-buy-animal="${i}">Buy</button>
            </div>
          </div>
        </div>
      `).join('');
    // Add buy listeners
    this.marketList.querySelectorAll('[data-buy-animal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-buy-animal'));
        this.handleBuyAnimal(idx);
      });
    });
  }
  renderTimeline() {
    if (!this.timelineDiv) return;
    const events = this.getTimeline();
    if (events.length === 0) {
      this.timelineDiv.innerHTML = '<div class="text-muted">No recent activity yet.</div>';
      return;
    }
    this.timelineDiv.innerHTML = events.map(ev => {
      let icon = '🔔';
      let text = '';
      if (ev.type === 'list') {
        icon = ev.details.type === 'camel' ? '🐪' : '🐎';
        text = `<b>${ev.details.seller}</b> listed a <b>${ev.details.type}</b> (<b>${ev.details.name}</b>) for sale for <span class='text-success'>SAR ${ev.details.price}</span>.`;
      } else if (ev.type === 'buy') {
        icon = '💸';
        text = `<b>${ev.details.buyer}</b> bought <b>${ev.details.type}</b> (<b>${ev.details.name}</b>) from <b>${ev.details.seller}</b> for <span class='text-success'>SAR ${ev.details.price}</span>.`;
      }
      return `
        <div class="timeline-event">
          <div class="timeline-icon">${icon}</div>
          <div class="timeline-content">
            <div>${text}</div>
            <div class="timeline-time">${ev.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  initMockData() {
    if (!localStorage.getItem('noblMarketAnimals') && !localStorage.getItem('noblMarketTimeline')) {
      const demoAnimals = [
        {
          name: 'Desert Jewel',
          type: 'camel',
          breed: 'Majaheem',
          gender: 'female',
          traits: 'Stamina, Beauty',
          price: 25000,
          image: '',
          seller: 'camelFan'
        },
        {
          name: 'Thunderhoof',
          type: 'horse',
          breed: 'Arabian',
          gender: 'male',
          traits: 'Speed, Endurance',
          price: 40000,
          image: '',
          seller: 'horseLover'
        },
        {
          name: 'Sahra Moon',
          type: 'camel',
          breed: 'Waddah',
          gender: 'male',
          traits: 'Strength, Grace',
          price: 18000,
          image: '',
          seller: 'desertKing'
        },
        {
          name: 'Al Saqr',
          type: 'horse',
          breed: 'Thoroughbred',
          gender: 'female',
          traits: 'Agility, Spirit',
          price: 35000,
          image: '',
          seller: 'arabianQueen'
        }
      ];
      localStorage.setItem('noblMarketAnimals', JSON.stringify(demoAnimals));
      const now = new Date();
      const demoTimeline = [
        {
          type: 'list',
          details: { name: 'Desert Jewel', type: 'camel', price: 25000, seller: 'camelFan' },
          time: new Date(now.getTime() - 1000 * 60 * 60 * 2).toLocaleString()
        },
        {
          type: 'list',
          details: { name: 'Thunderhoof', type: 'horse', price: 40000, seller: 'horseLover' },
          time: new Date(now.getTime() - 1000 * 60 * 60 * 1.5).toLocaleString()
        },
        {
          type: 'buy',
          details: { name: 'Sahra Moon', type: 'camel', price: 18000, seller: 'desertKing', buyer: 'client' },
          time: new Date(now.getTime() - 1000 * 60 * 60 * 1.2).toLocaleString()
        },
        {
          type: 'list',
          details: { name: 'Al Saqr', type: 'horse', price: 35000, seller: 'arabianQueen' },
          time: new Date(now.getTime() - 1000 * 60 * 60 * 1).toLocaleString()
        }
      ];
      localStorage.setItem('noblMarketTimeline', JSON.stringify(demoTimeline));
    }
  }
}
document.addEventListener('DOMContentLoaded', () => new AnimalMarket()); 