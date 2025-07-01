class BreedingMatcher {
  constructor() {
    this.form = document.getElementById('breeding-form');
    this.results = document.getElementById('results');
    this.breedSelect = document.getElementById('breedSelect');
    this.otherBreedInput = document.getElementById('otherBreedInput');
    this.traitsSelect = document.getElementById('traitsSelect');
    this.otherTraitInput = document.getElementById('otherTraitInput');
    // Always set a default mode if not set
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
    });
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    // Fallback: if the select is empty after DOMContentLoaded, populate it
    document.addEventListener('DOMContentLoaded', () => {
      if (this.breedSelect && this.breedSelect.options.length === 0) {
        this.populateBreeds();
      }
      if (this.traitsSelect && this.traitsSelect.options.length === 0) {
        this.populateTraits();
      }
    });
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
        traits: trait || (mode === 'camel' ? 'Stamina, Beauty' : 'Speed, Endurance')
      },
      {
        name: mode === 'camel' ? 'Sahra Moon' : 'Thunderhoof',
        type: breed,
        gender: gender === 'male' ? 'Female' : 'Male',
        traits: trait || (mode === 'camel' ? 'Strength, Grace' : 'Agility, Spirit')
      }
    ];
    this.results.innerHTML = matches.map(match => `
      <div class="col">
        <div class="card nobl-card h-100">
          <div class="card-body">
            <h5 class="card-title">${match.name}</h5>
            <p class="card-text">Breed: ${match.type}<br>Gender: ${match.gender}<br>Traits: ${match.traits}</p>
            <a href="#" class="btn btn-outline-primary">View Profile</a>
          </div>
        </div>
      </div>
    `).join('');
  }
}
document.addEventListener('DOMContentLoaded', () => new BreedingMatcher()); 