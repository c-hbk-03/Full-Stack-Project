class BreedingMatcher {
  constructor() {
    this.form = document.getElementById('breeding-form');
    this.results = document.getElementById('results');
    this.breedSelect = document.getElementById('breedSelect');
    this.otherBreedInput = document.getElementById('otherBreedInput');
    this.traitsSelect = document.getElementById('traitsSelect');
    this.otherTraitInput = document.getElementById('otherTraitInput');
    this.permissionMsg = null;
    if (!localStorage.getItem('noblMode')) localStorage.setItem('noblMode', 'horse');
    this.mode = localStorage.getItem('noblMode') || 'horse';
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
    this.animalsSection = document.getElementById('your-animals-section');
    this.animalsList = document.getElementById('your-animals-list');
    this.addAnimalBtn = document.getElementById('add-animal-btn');
    this.addAnimalForm = document.getElementById('add-animal-form');
    this.addAnimalModal = document.getElementById('addAnimalModal');
    this.animalType = document.getElementById('animal-type');
    this.animalBreed = document.getElementById('animal-breed');
    this.animalBreedOther = document.getElementById('animal-breed-other');
    this.animalTraits = document.getElementById('animal-traits');
    this.animalTraitsOther = document.getElementById('animal-traits-other');
    this.animalError = document.getElementById('add-animal-error');
    this.selectedAnimalId = null;
    this.animalImage = document.getElementById('animal-image');
    this.animalImagePreview = document.getElementById('animal-image-preview');
    if (this.breedSelect) {
      this.populateBreeds();
      this.breedSelect.addEventListener('change', () => this.handleBreedChange());
    }
    if (this.traitsSelect) {
      this.populateTraits();
      this.traitsSelect.addEventListener('change', () => this.handleTraitChange());
    }
    // Listen for mode switcher clicks directly
    const camelBtn = document.getElementById('camel-mode');
    const horseBtn = document.getElementById('horse-mode');
    if (camelBtn && horseBtn) {
      camelBtn.addEventListener('click', () => {
        setTimeout(() => {
          this.mode = 'camel';
          this.populateBreeds();
          this.populateTraits();
        }, 10);
      });
      horseBtn.addEventListener('click', () => {
        setTimeout(() => {
          this.mode = 'horse';
          this.populateBreeds();
          this.populateTraits();
        }, 10);
      });
    }
    window.addEventListener('storage', (e) => {
      if (e.key === 'noblMode') {
        this.mode = localStorage.getItem('noblMode') || 'horse';
        this.populateBreeds();
        this.populateTraits();
      }
      if (e.key === 'noblUser') {
        this.updatePermissions();
      }
    });
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    if (this.addAnimalBtn) {
      this.addAnimalBtn.addEventListener('click', () => this.resetAddAnimalForm());
    }
    if (this.addAnimalForm) {
      this.addAnimalForm.addEventListener('submit', (e) => this.handleAddAnimal(e));
      this.animalType.addEventListener('change', () => this.populateAnimalBreedsAndTraits());
      this.animalBreed.addEventListener('change', () => this.handleAnimalBreedChange());
      this.animalTraits.addEventListener('change', () => this.handleAnimalTraitsChange());
    }
    if (this.animalImage) {
      this.animalImage.addEventListener('change', (e) => this.handleImagePreview(e));
    }
    if (this.breedSelect && this.breedSelect.options.length === 0) {
      this.populateBreeds();
    }
    if (this.traitsSelect && this.traitsSelect.options.length === 0) {
      this.populateTraits();
    }
    this.updatePermissions();
    this.renderAnimals();
  }
  getUserRole() {
    const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
    return user.role || null;
  }
  getUser() {
    return JSON.parse(localStorage.getItem('noblUser') || '{}');
  }
  getUserAnimals() {
    const user = this.getUser();
    if (!user.username) return [];
    const all = JSON.parse(localStorage.getItem('noblAnimals') || '{}');
    return all[user.username] || [];
  }
  saveUserAnimals(animals) {
    const user = this.getUser();
    if (!user.username) return;
    const all = JSON.parse(localStorage.getItem('noblAnimals') || '{}');
    all[user.username] = animals;
    localStorage.setItem('noblAnimals', JSON.stringify(all));
  }
  renderAnimals() {
    const role = this.getUserRole();
    if (role !== 'client') {
      if (this.animalsSection) this.animalsSection.style.display = 'none';
      return;
    }
    if (this.animalsSection) this.animalsSection.style.display = '';
    const animals = this.getUserAnimals();
    if (!this.animalsList) return;
    this.animalsList.innerHTML = animals.length === 0 ? '<div class="col"><div class="alert alert-info">No animals added yet.</div></div>' :
      animals.map((a, i) => `
        <div class="col">
          <div class="card nobl-card h-100${this.selectedAnimalId === i ? ' border-primary' : ''}" style="cursor:pointer;">
            <div class="card-body" data-animal-id="${i}">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0">${a.name}</h5>
                <button class="btn btn-sm btn-outline-danger ms-2" data-delete-animal="${i}" title="Delete">&times;</button>
              </div>
              <div class="mb-2 text-center">
                <img src="${a.image ? a.image : (a.type === 'camel' ? 'Images/camel-default.png' : 'Images/horse-default.png')}" alt="${a.name}" class="img-fluid rounded" style="max-height:90px;max-width:100%;object-fit:cover;border:1.5px solid #ccc;" />
              </div>
              <p class="card-text mb-1"><strong>Type:</strong> ${a.type.charAt(0).toUpperCase() + a.type.slice(1)}</p>
              <p class="card-text mb-1"><strong>Breed:</strong> ${a.breed}</p>
              <p class="card-text mb-1"><strong>Gender:</strong> ${a.gender.charAt(0).toUpperCase() + a.gender.slice(1)}</p>
              <p class="card-text mb-1"><strong>Traits:</strong> ${a.traits}</p>
            </div>
          </div>
        </div>
      `).join('');
    // Add listeners for select and delete
    this.animalsList.querySelectorAll('.card-body').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = parseInt(el.getAttribute('data-animal-id'));
        this.selectedAnimalId = id;
        this.prefillBreedingFormFromAnimal();
        this.renderAnimals();
      });
    });
    this.animalsList.querySelectorAll('[data-delete-animal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-delete-animal'));
        this.deleteAnimal(id);
      });
    });
  }
  prefillBreedingFormFromAnimal() {
    const animals = this.getUserAnimals();
    const a = animals[this.selectedAnimalId];
    if (!a) return;
    // Set mode to animal type
    localStorage.setItem('noblMode', a.type);
    this.mode = a.type;
    this.populateBreeds();
    this.populateTraits();
    this.breedSelect.value = this.breeds[a.type].includes(a.breed) ? a.breed : 'Other';
    this.handleBreedChange();
    if (this.breedSelect.value === 'Other') this.otherBreedInput.value = a.breed;
    document.getElementById('gender').value = a.gender;
    this.traitsSelect.value = this.traits[a.type].includes(a.traits) ? a.traits : 'Other';
    this.handleTraitChange();
    if (this.traitsSelect.value === 'Other') this.otherTraitInput.value = a.traits;
  }
  deleteAnimal(id) {
    const animals = this.getUserAnimals();
    animals.splice(id, 1);
    this.saveUserAnimals(animals);
    this.selectedAnimalId = null;
    this.renderAnimals();
  }
  resetAddAnimalForm() {
    if (!this.addAnimalForm) return;
    this.addAnimalForm.reset();
    this.animalBreed.innerHTML = '';
    this.animalBreedOther.classList.add('d-none');
    this.animalTraits.innerHTML = '';
    this.animalTraitsOther.classList.add('d-none');
    this.animalError.classList.add('d-none');
    if (this.animalImagePreview) {
      this.animalImagePreview.src = '';
      this.animalImagePreview.classList.add('d-none');
    }
  }
  populateAnimalBreedsAndTraits() {
    const type = this.animalType.value;
    this.animalBreed.innerHTML = '<option value="">Choose...</option>' + (this.breeds[type] || []).map(b => `<option value="${b}">${b}</option>`).join('');
    this.animalBreedOther.classList.add('d-none');
    this.animalTraits.innerHTML = '<option value="">Choose...</option>' + (this.traits[type] || []).map(t => `<option value="${t}">${t}</option>`).join('');
    this.animalTraitsOther.classList.add('d-none');
  }
  handleAnimalBreedChange() {
    if (this.animalBreed.value === 'Other') {
      this.animalBreedOther.classList.remove('d-none');
      this.animalBreedOther.required = true;
    } else {
      this.animalBreedOther.classList.add('d-none');
      this.animalBreedOther.required = false;
    }
  }
  handleAnimalTraitsChange() {
    if (this.animalTraits.value === 'Other') {
      this.animalTraitsOther.classList.remove('d-none');
      this.animalTraitsOther.required = true;
    } else {
      this.animalTraitsOther.classList.add('d-none');
      this.animalTraitsOther.required = false;
    }
  }
  handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) {
      this.animalImagePreview.classList.add('d-none');
      this.animalImagePreview.src = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.animalImagePreview.src = ev.target.result;
      this.animalImagePreview.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  }
  handleAddAnimal(e) {
    e.preventDefault();
    const name = document.getElementById('animal-name').value.trim();
    const type = this.animalType.value;
    let breed = this.animalBreed.value;
    if (breed === 'Other') breed = this.animalBreedOther.value.trim();
    const gender = document.getElementById('animal-gender').value;
    let traits = this.animalTraits.value;
    if (traits === 'Other') traits = this.animalTraitsOther.value.trim();
    let image = '';
    if (this.animalImage && this.animalImage.files[0]) {
      image = this.animalImagePreview.src;
    }
    if (!name || !type || !breed || !gender || !traits) {
      this.animalError.textContent = 'All fields are required.';
      this.animalError.classList.remove('d-none');
      return;
    }
    const animals = this.getUserAnimals();
    animals.push({ name, type, breed, gender, traits, image });
    this.saveUserAnimals(animals);
    this.renderAnimals();
    const modal = bootstrap.Modal.getOrCreateInstance(this.addAnimalModal);
    modal.hide();
  }
  updatePermissions() {
    const role = this.getUserRole();
    if (!this.form) return;
    if (role !== 'client') {
      Array.from(this.form.elements).forEach(el => el.disabled = true);
      if (!this.permissionMsg) {
        this.permissionMsg = document.createElement('div');
        this.permissionMsg.className = 'alert alert-warning mt-2';
        this.permissionMsg.textContent = 'Only clients can use the breeding match platform.';
        this.form.parentNode.insertBefore(this.permissionMsg, this.form.nextSibling);
      }
      if (this.animalsSection) this.animalsSection.style.display = 'none';
    } else {
      Array.from(this.form.elements).forEach(el => el.disabled = false);
      if (this.permissionMsg) {
        this.permissionMsg.remove();
        this.permissionMsg = null;
      }
      if (this.animalsSection) this.animalsSection.style.display = '';
    }
    this.renderAnimals();
  }
  populateBreeds() {
    const mode = localStorage.getItem('noblMode') || 'horse';
    this.breedSelect.innerHTML = `<option value="">Choose...</option>` +
      this.breeds[mode].map(breed => `<option value="${breed}">${breed}</option>`).join('');
    this.otherBreedInput.classList.add('d-none');
    this.breedSelect.value = '';
  }

  handleBreedChange() {
    if (this.breedSelect.value === 'Other') {
      this.otherBreedInput.classList.remove('d-none');
      this.otherBreedInput.required = true;
    } else {
      this.otherBreedInput.classList.add('d-none');
      this.otherBreedInput.required = false;
    }
  }

  populateTraits() {
    const mode = localStorage.getItem('noblMode') || 'horse';
    this.traitsSelect.innerHTML = `<option value="">Choose...</option>` +
      this.traits[mode].map(trait => `<option value="${trait}">${trait}</option>`).join('');
    this.otherTraitInput.classList.add('d-none');
    this.traitsSelect.value = '';
  }

  handleTraitChange() {
    if (this.traitsSelect.value === 'Other') {
      this.otherTraitInput.classList.remove('d-none');
      this.otherTraitInput.required = true;
    } else {
      this.otherTraitInput.classList.add('d-none');
      this.otherTraitInput.required = false;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let breed = this.breedSelect.value;
    if (breed === 'Other') {
      breed = this.otherBreedInput.value.trim() || 'Other';
    }
    let trait = this.traitsSelect.value;
    if (trait === 'Other') {
      trait = this.otherTraitInput.value.trim() || 'Other';
    }
    const gender = document.getElementById('gender').value;
    this.showMatches(breed, gender, trait);
  }

  showMatches(breed, gender, trait) {
    const mode = localStorage.getItem('noblMode') || 'horse';
    // For demo, generate 2 static cards using the form values
    const matches = [
      {
        name: mode === 'camel' ? 'Desert Jewel' : 'Al Saqr',
        type: breed,
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        traits: trait || (mode === 'camel' ? 'Stamina, Beauty' : 'Speed, Endurance'),
        image: mode === 'camel'
          ? 'https://placehold.co/120x90?text=Camel' // Replace with camel image
          : 'https://placehold.co/120x90?text=Horse' // Replace with horse image
      },
      {
        name: mode === 'camel' ? 'Sahra Moon' : 'Thunderhoof',
        type: breed,
        gender: gender === 'male' ? 'Female' : 'Male',
        traits: trait || (mode === 'camel' ? 'Strength, Grace' : 'Agility, Spirit'),
        image: mode === 'camel'
          ? 'https://placehold.co/120x90?text=Camel' // Replace with camel image
          : 'https://placehold.co/120x90?text=Horse' // Replace with horse image
      }
    ];
    this.results.innerHTML = matches.map(match => `
      <div class="col">
        <div class="card nobl-card h-100">
          <div class="card-body text-center">
            <img src="${match.image}" alt="${match.name}" class="img-fluid rounded mb-2" style="max-height:90px;max-width:100%;object-fit:cover;border:1.5px solid #ccc;" />
            <h5 class="card-title">${match.name}</h5>
            <p class="card-text">Breed: ${match.type}<br>Gender: ${match.gender}<br>Traits: ${match.traits}</p>
            <a href="#" class="btn btn-outline-primary">View Profile</a>
          </div>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
  const animalsSection = document.getElementById('your-animals-section');
  if (animalsSection) animalsSection.style.display = user.role === 'client' ? '' : 'none';
  new BreedingMatcher();
}); 