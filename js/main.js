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
    let userDisplay = document.getElementById('user-display');
    let signInBtn = document.getElementById('signin-btn');
    const role = this.user ? this.user.role : null;
    if (this.user) {
      if (userDisplay) {
        userDisplay.innerHTML = `<span class='me-2 fw-bold text-uppercase'>${this.user.role} (${this.user.username})</span><button id='signout-btn' class='btn btn-outline-danger btn-sm ms-2'>Sign Out</button>`;
      }
      if (signInBtn) signInBtn.style.display = 'none';
    } else {
      if (userDisplay) userDisplay.innerHTML = '';
      if (signInBtn) signInBtn.style.display = '';
      document.body.classList.remove('vendor', 'client');
    }
    // Sidebar manage products link for vendors only
    const sidebarManage = document.getElementById('sidebar-manage-products');
    if (sidebarManage) sidebarManage.style.display = role === 'vendor' ? '' : 'none';
  }
  signOut() {
    this.user = null;
    localStorage.removeItem('noblUser');
    document.body.classList.remove('vendor', 'client');
    this.updateNavbar();
  }
}

// On DOMContentLoaded, update the sidebar manage products link visibility immediately
function updateSidebarManageOnLoad() {
  const sidebarManage = document.getElementById('sidebar-manage-products');
  const user = JSON.parse(localStorage.getItem('noblUser') || '{}');
  if (sidebarManage) sidebarManage.style.display = user.role === 'vendor' ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = 0;
  document.body.style.transition = 'opacity 0.5s';
  setTimeout(() => { document.body.style.opacity = 1; }, 50);

  new ThemeManager();
  if (document.getElementById('mode-switcher')) new ModeSwitcher();
  new AuthManager();
  updateSidebarManageOnLoad();

  // Make homepage buttons functional
  if (document.body.classList.contains('home-page')) {
    const navMap = {
      'breeding.html': 'breeding.html',
      'ecommerce.html': 'ecommerce.html',
      'services.html': 'services.html',
      'community.html': 'community.html',
      'animal-market.html': 'animal-market.html'
    };
    document.querySelectorAll('.nobl-card a.btn').forEach(btn => {
      const href = btn.getAttribute('href');
      if (navMap[href]) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          document.body.style.opacity = 0;
          setTimeout(() => {
            window.location.href = navMap[href];
          }, 500);
        });
      }
    });
  }
}); 