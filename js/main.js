class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.applyTheme();
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
  applyTheme() {
    // Preserve other classes (like 'home-page')
    const body = document.body;
    const classes = Array.from(body.classList).filter(c => c !== 'light' && c !== 'dark');
    body.className = `${this.theme} ${classes.join(' ')}`.trim();
    localStorage.setItem('theme', this.theme);
    // Update icon
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }
  }
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }
}

class ModeSwitcher {
  constructor() {
    this.camelBtn = document.getElementById('camel-mode');
    this.horseBtn = document.getElementById('horse-mode');
    if (!this.camelBtn || !this.horseBtn) return;
    this.camelBtn.addEventListener('click', () => this.setMode('camel'));
    this.horseBtn.addEventListener('click', () => this.setMode('horse'));
    this.applyMode(localStorage.getItem('noblMode') || 'camel');
  }
  setMode(mode) {
    localStorage.setItem('noblMode', mode);
    this.applyMode(mode);
  }
  applyMode(mode) {
    document.body.classList.remove('camel-mode', 'horse-mode');
    document.body.classList.add(`${mode}-mode`);
    if (mode === 'camel') {
      this.camelBtn.classList.add('active');
      this.horseBtn.classList.remove('active');
    } else {
      this.horseBtn.classList.add('active');
      this.camelBtn.classList.remove('active');
    }
  }
}

class AuthManager {
  constructor() {
    this.user = null;
    this.init();
  }
  init() {
    this.loadUser();
    this.updateNavbar();
    const form = document.getElementById('signin-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSignIn(e));
    }
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'signout-btn') {
        this.signOut();
      }
    });
  }
  handleSignIn(e) {
    e.preventDefault();
    const username = document.getElementById('signin-username').value.trim();
    const password = document.getElementById('signin-password').value;
    const errorDiv = document.getElementById('signin-error');
    let valid = false;
    let role = '';
    if (username === 'vendor' && password === 'vendor123') {
      valid = true;
      role = 'vendor';
    } else if (username === 'client' && password === 'client123') {
      valid = true;
      role = 'client';
    }
    if (valid) {
      this.user = { username, role };
      localStorage.setItem('noblUser', JSON.stringify(this.user));
      document.body.classList.remove('vendor', 'client');
      document.body.classList.add(role);
      this.updateNavbar();
      const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('signinModal'));
      modal.hide();
      errorDiv.classList.add('d-none');
      e.target.reset();
    } else {
      errorDiv.classList.remove('d-none');
    }
  }
  loadUser() {
    const user = localStorage.getItem('noblUser');
    if (user) {
      this.user = JSON.parse(user);
      document.body.classList.add(this.user.role);
    }
  }
  updateNavbar() {
    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;
    let userDisplay = document.getElementById('user-display');
    let signInBtn = document.getElementById('signin-btn');
    // Show/hide Manage Products tab for vendors only
    const manageTab = document.getElementById('manage-products-tab');
    const role = this.user ? this.user.role : null;
    if (this.user) {
      if (!userDisplay) {
        userDisplay = document.createElement('li');
        userDisplay.className = 'nav-item d-flex align-items-center ms-2';
        userDisplay.id = 'user-display';
        nav.appendChild(userDisplay);
      }
      userDisplay.innerHTML = `<span class='me-2 fw-bold text-uppercase'>${this.user.role} (${this.user.username})</span><button id='signout-btn' class='btn btn-outline-danger btn-sm ms-2'>Sign Out</button>`;
      if (signInBtn) signInBtn.style.display = 'none';
      if (manageTab) manageTab.style.display = role === 'vendor' ? '' : 'none';
    } else {
      if (userDisplay) userDisplay.remove();
      if (signInBtn) signInBtn.style.display = '';
      document.body.classList.remove('vendor', 'client');
      if (manageTab) manageTab.style.display = 'none';
    }
  }
  signOut() {
    this.user = null;
    localStorage.removeItem('noblUser');
    document.body.classList.remove('vendor', 'client');
    this.updateNavbar();
  }
}

// On DOMContentLoaded, update the manage products tab visibility immediately
function updateManageTabOnLoad() {
  const manageTab = document.getElementById('manage-products-tab');
  const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
  if (manageTab) manageTab.style.display = user.role === 'vendor' ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  if (document.getElementById('mode-switcher')) new ModeSwitcher();
  new AuthManager();
  updateManageTabOnLoad();
}); 