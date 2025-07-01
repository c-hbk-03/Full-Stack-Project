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

const apikey = '05116f9fa7d3be356a08e0c4ef9951cf';
const url = 'https://gnews.io/api/v4/search?q=camel%20OR%20horse&lang=en&country=sa&max=9&apikey=' + apikey;

document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('animal-news-list');
  if (!newsList) return;
  newsList.innerHTML = '<div class="text-center w-100 py-4">Loading news...</div>';

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const articles = data.articles;
      if (!articles || articles.length === 0) {
        newsList.innerHTML = '<div class="text-muted w-100">No news found.</div>';
        return;
      }
      newsList.innerHTML = articles.map(function(article) {
        return `
          <div class="col">
            <div class="card animal-news-card h-100">
              <img src="${article.image || 'https://placehold.co/400x180?text=No+Image'}" alt="${article.title}" onerror="this.src='https://placehold.co/400x180?text=No+Image'">
              <div class="card-body d-flex flex-column">
                <div class="card-title mb-2">${article.title}</div>
                <div class="card-text mb-2">${article.description || ''}</div>
                <a href="${article.url}" class="btn btn-outline-primary mt-auto" target="_blank" rel="noopener">Read More</a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    })
    .catch(function () {
      newsList.innerHTML = '<div class="text-danger w-100">Failed to load news. Please try again later.</div>';
    });
});

document.addEventListener('DOMContentLoaded', () => new CommunityFacts()); 