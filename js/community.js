class CommunityFacts {
  constructor() {
    this.factsContainer = document.getElementById('facts-container');
    this.loading = document.getElementById('loading-fact');
    this.error = document.getElementById('fact-error');
    this.apiKey = '';
    this.apiUrl = 'https://api.api-ninjas.com/v1/animals?name=horse'; // You can change to camel or randomize
    this.loadFacts();
  }

  async loadFacts() {
    try {
      const response = await fetch(this.apiUrl, {
        headers: this.apiKey ? { 'X-Api-Key': this.apiKey } : {}
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      this.displayFacts(data);
    } catch (err) {
      this.showError();
    }
  }

  displayFacts(data) {
    this.loading && this.loading.remove();
    if (!Array.isArray(data) || data.length === 0) {
      this.factsContainer.innerHTML = `<div class='col'><div class='card nobl-card h-100 text-center p-4'><p>No facts found. Try again later.</p></div></div>`;
      return;
    }
    // Show up to 2 facts
    this.factsContainer.innerHTML = data.slice(0, 2).map(animal => `
      <div class="col">
        <div class="card nobl-card h-100">
          <div class="card-body">
            <h5 class="card-title">${animal.name ? animal.name.charAt(0).toUpperCase() + animal.name.slice(1) : 'Animal Fact'}</h5>
            <p class="card-text">${animal.characteristics ? animal.characteristics : (animal.locations ? 'Found in: ' + animal.locations.join(', ') : 'No details available.')}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  showError() {
    this.loading && this.loading.remove();
    this.error.classList.remove('d-none');
  }
}
document.addEventListener('DOMContentLoaded', () => new CommunityFacts()); 