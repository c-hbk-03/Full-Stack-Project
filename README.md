# Full-Stack-Project
#Codebase files in "master"
This is the submission of my full stack project for the academic year 2025-2026, semester 8. Charbel Hobeika
NOBL – Network of Bloodlines Lineage
NOBL is a modern web platform for the horse and camel community in Saudi Arabia. It connects breeders, vendors, and enthusiasts, providing a unified space for breeding, e-commerce, services, community engagement, and a live animal marketplace.
Features
1. Home Page
Minimalistic, modern UI with a dark/light theme and orange accents.
Central logo, hamburger menu (sidebar), and role-aware controls.
Quick navigation to all major sections.
2. Role-Based Profiles
Vendor:
Can add and delete products/services.
Access to “Manage Products” section.
Cannot use the breeding platform.
Client:
Can buy products, book services, and use the breeding platform.
Can add, view, and delete their own animals (with photo upload).
Can list and buy animals in the marketplace.
Authentication:
Modal sign-in with hardcoded demo accounts:
Vendor: vendor / vendor123
Client: client / client123
Role is strictly enforced in the UI and feature access.
3. Theme & Mode Switching
Home page: black/white (dark/light) with orange accents.
Other pages:
Camel mode (brown theme)
Horse mode (dark green theme)
Mode switcher persists in localStorage and filters content site-wide.
4. Breeding Platform
Clients can add their own camels/horses (with images), view, and delete them.
Breeding form adapts to selected mode (camel/horse), with dynamic breed/trait dropdowns and “Other” options.
Only clients can use the breeding platform; vendors see a disabled form.
“Your Animals” section for clients, with prefill for breeding forms.
5. E-Commerce
Shop for animal products, filtered by mode (camel/horse).
Vendors can add/delete products (with images), changes persist in localStorage.
Clients can buy products.
Product images and demo data are auto-populated on first load.
6. Services
Book services (vet, maintenance, consultations), filtered by mode.
Vendors can manage service offerings.
7. Buy & Sell Animals Marketplace
Any user can list or buy animals (with photo, breed, traits, price, and seller).
Purchases remove the animal from the market and add it to the client’s animals.
Marketplace is auto-populated with mock/demo data on first load.
8. Community Page
“Latest Animal News” section, styled to match the site.
Fetches top camel/horse news from Saudi Arabia using the GNews API.
“Animal Facts” section using a public animal facts API.
Timeline section (CSS Grid/Flexbox) shows recent marketplace events (listing, buying) with icons and timestamps.
9. Navigation
Minimalistic navbar with sidebar for all navigation.
Sidebar and navbar are visually unified and theme-aware.
Role-based access: vendor-only and client-only links.
10. Persistence & Dynamic Content
All user data (profile, products, animals, mode/theme) is stored in localStorage.
Demo/mock data is auto-populated on first load for a seamless demo experience.
API Keys & Integrations
GNews API
Used for fetching the latest animal news from Saudi Arabia.
Endpoint: https://gnews.io/api/v4/search
Query: q=camel OR horse&lang=en&country=sa
API Key Used:
Apply to ecommerce.js
Animal Facts API
Used for fetching random animal facts for the community page.
No API key required.
Demo Accounts
Vendor:
Username: vendor
Password: vendor123
Client:
Username: client
Password: client123
Technologies Used
HTML5, CSS3 (Bootstrap 5 + custom styles)
Modern JavaScript (ES6 classes, modules)
Responsive, mobile-friendly design
No backend required (all data is stored in browser localStorage)
Public APIs for news and facts
How to Run
Clone the repository.
Open index.html in a browser.
For API features to work, use a local server (e.g., VSCode Live Server, Python’s http.server, or similar).
Sign in as a vendor or client to explore all features.
Notes
All demo data and user actions are stored in your browser’s localStorage.
To reset demo data, clear the site’s localStorage.
The GNews API key is for demo purposes

