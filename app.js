/* ═══════════════════════════════════════════════════════════════
   विVIDHA — app.js
   Full frontend logic: API calls, cart, wishlist, auth, Razorpay
   Backend: api.chandus7.in/api/fashion/
   ═══════════════════════════════════════════════════════════════ */

const API = 'https://api.chandus7.in/api/fashion';

// ── STATE ──────────────────────────────────────────────────────
let state = {
  user: JSON.parse(localStorage.getItem('vividha_user') || 'null'),
  token: localStorage.getItem('vividha_token') || null,
  cart: JSON.parse(localStorage.getItem('vividha_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('vividha_wishlist') || '[]'),
  products: [],
  categories: [],
  filteredProducts: [],
  currentFilter: '',
  currentTag: '',
  currentSort: 'default',
  shopView: 'grid',
};

// ── DEMO DATA ──────────────────────────────────────────────────
const DEMO_CATEGORIES = [
  { id: 1, name: 'Sarees', slug: 'sarees', image: 'https://images.unsplash.com/photo-1611811960734-2b1b8b5d17b1?w=600&q=80', count: 80,
    sub: ['Silk Sarees','Cotton Sarees','Banarasi','Kashmiri','Printed','Georgette'] },
  { id: 2, name: 'Kurtis', slug: 'kurtis', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', count: 120,
    sub: ['Straight Kurtis','A-Line','Anarkali','Kaftan','Designer'] },
  { id: 3, name: 'Punjabi Suits', slug: 'punjabi-suits', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', count: 65 },
  { id: 4, name: 'Lehengas', slug: 'lehengas', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80', count: 45 },
  { id: 5, name: 'Salwar Suits', slug: 'salwar-suits', image: 'https://images.unsplash.com/photo-1601936374000-e31f2735e972?w=600&q=80', count: 70 },
  { id: 6, name: 'Kashmiri Wear', slug: 'kashmiri', image: 'https://images.unsplash.com/photo-1595039838779-f3780873afdd?w=600&q=80', count: 30 },
  { id: 7, name: 'Pakistani Wear', slug: 'pakistani', image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=600&q=80', count: 40 },
  { id: 8, name: 'Dresses & Tops', slug: 'western', image: 'https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=600&q=80', count: 90 },
];

const DEMO_PRODUCTS = [
  { id:1, name:'Kanjivaram Pure Silk Saree', category:'Sarees', sub_category:'Silk Sarees', brand:'Kanjivaram Heritage', price:4999, original_price:7499, stock:12, tag:'hot', image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', description:'Exquisite pure Kanjivaram silk saree with traditional gold zari border. A timeless piece for weddings and celebrations.', fabric:'Pure Silk, Zari', colors:['#8B0000','#1B2A4A','#2D5A1E','#C9A84C'], status:'active' },
  { id:2, name:'Banarasi Brocade Lehenga', category:'Lehengas', sub_category:'Bridal', brand:'Royal Banaras', price:2, original_price:12999, stock:5, tag:'hot', image:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80', description:'Stunning Banarasi brocade lehenga with intricate gold work. Perfect for bridal occasions and festive celebrations.', fabric:'Brocade Silk, Net', colors:['#C9A84C','#E8789A','#1B2A4A'], status:'active' },
  { id:3, name:'Floral Anarkali Kurti', category:'Kurtis', sub_category:'Anarkali', brand:'Vividha Studio', price:1299, original_price:1799, stock:50, tag:'new', image:'https://images.unsplash.com/photo-1597983073540-684a10b15ab1?w=600&q=80', description:'Beautiful floral printed Anarkali kurti with gota patti work. Pairs perfectly with churidar or palazzo.', fabric:'Rayon, Cotton', colors:['#E8789A','#F7F0DC','#4A5E8A'], status:'active' },
  { id:4, name:'Embroidered Punjabi Suit', category:'Punjabi Suits', sub_category:null, brand:'Punjab Pride', price:2499, original_price:3499, stock:25, tag:'new', image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', description:'Hand-embroidered Punjabi suit with phulkari dupatta. Vibrant colors celebrating the rich culture of Punjab.', fabric:'Cotton, Chiffon Dupatta', colors:['#C9A84C','#E8789A','#2D5A1E'], status:'active' },
  { id:5, name:'Kashmiri Embroidery Pheran', category:'Kashmiri Wear', sub_category:null, brand:'Kashmir Valley', price:3499, original_price:4999, stock:18, tag:'hot', image:'https://images.unsplash.com/photo-1595039838779-f3780873afdd?w=600&q=80', description:'Authentic Kashmiri Pheran with hand-done sozni embroidery. A rare piece of Kashmir\'s living artistry.', fabric:'Wool, Pashmina blend', colors:['#1B2A4A','#8B4513','#2D5A1E'], status:'active' },
  { id:6, name:'Pakistani Lawn Suit', category:'Pakistani Wear', sub_category:null, brand:'Lakhani Fabrics', price:1899, original_price:2499, stock:40, tag:'sale', image:'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=600&q=80', description:'Premium Pakistani lawn suit with exquisite block print. Lightweight and comfortable for all-day wear.', fabric:'Lawn Cotton, Chiffon', colors:['#F7F0DC','#E8789A','#4A5E8A'], status:'active' },
  { id:7, name:'Georgette Salwar Kameez', category:'Salwar Suits', sub_category:null, brand:'Vividha Studio', price:1599, original_price:2199, stock:35, tag:'new', image:'https://images.unsplash.com/photo-1601936374000-e31f2735e972?w=600&q=80', description:'Elegant georgette salwar kameez with mirror work dupatta. Effortlessly chic for parties and family events.', fabric:'Georgette, Net', colors:['#C9A84C','#E8789A','#1B2A4A'], status:'active' },
  { id:8, name:'Maxi Floral Dress', category:'Dresses & Tops', sub_category:null, brand:'Fusion by Vividha', price:1199, original_price:1699, stock:60, tag:'new', image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', description:'Breezy floral maxi dress with a contemporary Indian-fusion aesthetic. Perfect for day outings and brunches.', fabric:'Rayon, Viscose', colors:['#E8789A','#F7F0DC','#2D5A1E'], status:'active' },
  { id:9, name:'Cotton Printed Straight Kurti', category:'Kurtis', sub_category:'Straight Kurtis', brand:'Daily Wear Co.', price:699, original_price:999, stock:100, tag:'sale', image:'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80', description:'Comfortable and stylish block-printed cotton kurti for daily wear. Available in multiple vibrant prints.', fabric:'100% Cotton', colors:['#C9A84C','#E8789A','#4A5E8A','#2D5A1E'], status:'active' },
  { id:10, name:'Bridal Red Silk Saree', category:'Sarees', sub_category:'Silk Sarees', brand:'Bridal Vividha', price:9999, original_price:14999, stock:8, tag:'hot', image:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80', description:'Luxurious bridal red silk saree with heavy gold embroidery. The ultimate choice for your most special day.', fabric:'Pure Silk, Gold Zari', colors:['#8B0000','#C9A84C'], status:'active' },
  { id:11, name:'Embroidered Palazzo Set', category:'Kurtis', sub_category:'Kaftan', brand:'Vividha Studio', price:1799, original_price:2499, stock:30, tag:'new', image:'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80', description:'Boho-chic embroidered palazzo set with matching dupatta. Flowy, comfortable, and effortlessly stylish.', fabric:'Rayon, Cotton Blend', colors:['#E8789A','#F7F0DC','#C9A84C'], status:'active' },
  { id:12, name:'Phulkari Dupatta', category:'Punjabi Suits', sub_category:null, brand:'Punjab Pride', price:899, original_price:1299, stock:55, tag:'sale', image:'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80', description:'Vibrant handwoven Phulkari dupatta from Punjab. Adds a pop of color to any ethnic outfit instantly.', fabric:'Cotton, Silk Thread', colors:['#C9A84C','#E8789A','#8B0000','#2D5A1E'], status:'active' },
];

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  loadData();
  setupScrollEffects();
  updateCartUI();
  updateAuthUI();
});

function initUI() {
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  });
  // Filter pills home
  document.querySelectorAll('.collection-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('.collection-pill[data-filter]').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      filterHomeProducts(this.dataset.filter);
    });
  });
}

// ── DATA LOADING ──────────────────────────────────────────────
async function loadData() {
  try {
    await loadCategories();
    await loadProducts();
  } catch (e) {
    console.warn('API unavailable, using demo data:', e.message);
    state.categories = DEMO_CATEGORIES;
    state.products = DEMO_PRODUCTS;
    renderAll();
  }
}

async function loadCategories() {
  const res = await fetchAPI('/categories/', 'GET');
  if (res && res.length) {
    state.categories = res;
  } else {
    state.categories = DEMO_CATEGORIES;
  }
  renderCategoryNav();
  renderCategoryDropdown();
  renderCategoryGrid();
  populateSidebarCategories();
  renderFooterCategories();
  renderMobileCategoryLinks();
}

async function loadProducts() {
  const res = await fetchAPI('/products/', 'GET');
  if (res && res.length) {
    state.products = res;
  } else {
    // Check admin localStorage first, then fall back to demo
    const adminSaved = JSON.parse(localStorage.getItem('vividha_admin_products') || 'null');
    state.products = adminSaved && adminSaved.length ? adminSaved : DEMO_PRODUCTS;
  }
  state.filteredProducts = [...state.products];
  renderHomeProducts();
  renderShopProducts();
}

function renderAll() {
  renderCategoryNav();
  renderCategoryDropdown();
  renderCategoryGrid();
  populateSidebarCategories();
  renderFooterCategories();
  renderMobileCategoryLinks();
  state.filteredProducts = [...state.products];
  renderHomeProducts();
  renderShopProducts();
}

// ── API HELPER ────────────────────────────────────────────────
async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  // Don't send local-mode tokens to real API
  if (state.token && !state.token.startsWith('local-')) {
    headers['Authorization'] = `Token ${state.token}`;
  }
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  // Will throw on network error (file://, CORS, offline) — callers catch this
  const res = await fetch(API + endpoint, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || 'HTTP ' + res.status);
  }
  return res.json().catch(() => null);
}

// ── RENDER: CATEGORIES ────────────────────────────────────────
function renderCategoryDropdown() {
  const dd = document.getElementById('categoriesDropdown');
  if (!dd) return;
  dd.innerHTML = state.categories.slice(0, 8).map(c => `
    <a href="#" onclick="filterByCategory('${c.name}');showPage('shop');return false;">
      <span class="dot"></span> ${c.name}
    </a>
  `).join('') + `<a href="#" onclick="showPage('shop');return false;" style="border-top:1px solid var(--border-soft); margin-top:4px; padding-top:12px; font-weight:600; color:var(--gold-dark);">View All Categories →</a>`;
}

function renderCategoryGrid() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  const cats = state.categories.slice(0, 6);
  grid.innerHTML = cats.map((c, i) => `
    <div class="category-card${i === 0 ? ' featured' : ''}" onclick="filterByCategory('${c.name}');showPage('shop')">
      <img src="${c.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'}" alt="${c.name}" loading="lazy" />
      <div class="category-card-overlay"></div>
      ${i === 0 ? '<div class="category-card-badge">⭐ Featured</div>' : ''}
      <div class="category-card-content">
        <h3>${c.name}</h3>
        <p>${c.count || ''} styles</p>
      </div>
    </div>
  `).join('');
  observeReveal();
}

function populateSidebarCategories() {
  const sel = document.getElementById('shopCategoryFilter');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">All Categories</option>' +
    state.categories.map(c => `<option value="${c.name}" ${c.name === current ? 'selected' : ''}>${c.name}</option>`).join('');
}

function renderFooterCategories() {
  const el = document.getElementById('footerCategoryLinks');
  if (!el) return;
  el.innerHTML = state.categories.slice(0, 6).map(c => `
    <li><a href="#" onclick="filterByCategory('${c.name}');showPage('shop');return false;">${c.name}</a></li>
  `).join('');
}

function renderMobileCategoryLinks() {
  const el = document.getElementById('mobileCategoryLinks');
  if (!el) return;
  el.innerHTML = state.categories.map(c => `
    <a class="mobile-nav-link" href="#" onclick="filterByCategory('${c.name}');showPage('shop');closeMobileMenu();return false;">👗 ${c.name}</a>
  `).join('');
}

function renderCategoryNav() {} // handled by dropdown

// ── RENDER: PRODUCTS ──────────────────────────────────────────
function productCard(p) {
  const discount = p.original_price > p.price ? Math.round((1 - p.price/p.original_price)*100) : 0;
  const inCart = state.cart.find(i => i.id === p.id);
  const inWish = state.wishlist.includes(p.id);
  const outOfStock = p.stock === 0;

  return `
  <div class="product-card" onclick="openProductDetail(${p.id})">
    <div class="product-img-wrap">
      <img src="${p.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}" alt="${p.name}" loading="lazy" />
      ${p.tag ? `<div class="product-tag ${p.tag}">${p.tag.toUpperCase()}</div>` : ''}
      ${discount > 0 ? `<div class="product-tag sale" style="top:${p.tag?'46':'12'}px;">${discount}% OFF</div>` : ''}
      <div class="product-actions">
        <button class="product-action-btn${inWish?' wishlisted':''}" onclick="event.stopPropagation();toggleWishlist(${p.id})" title="Wishlist">
          <i class="fa-${inWish?'solid':'regular'} fa-heart"></i>
        </button>
        <button class="product-action-btn" onclick="event.stopPropagation();openProductDetail(${p.id})" title="Quick View">
          <i class="fa-regular fa-eye"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-brand">${p.brand || p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-meta">${p.sub_category || p.category}</div>
      <div class="product-price-row">
        <span class="price-current">₹${p.price.toLocaleString()}</span>
        ${p.original_price > p.price ? `<span class="price-old">₹${p.original_price.toLocaleString()}</span>` : ''}
        ${discount > 0 ? `<span class="price-off">-${discount}%</span>` : ''}
      </div>
      <button class="btn-add-to-cart${outOfStock?' out-of-stock':''}"
        ${outOfStock ? 'disabled' : `onclick="event.stopPropagation();addToCart(${p.id})"`}>
        ${outOfStock ? '<i class="fa-solid fa-circle-xmark"></i> Out of Stock' : '<i class="fa-solid fa-bag-shopping"></i> Add to Bag'}
      </button>
    </div>
  </div>`;
}

function renderHomeProducts(filter = 'all') {
  const grid = document.getElementById('homeProductsGrid');
  if (!grid) return;
  let prods = state.products.filter(p => p.status === 'active' || !p.status);
  if (filter !== 'all') prods = prods.filter(p => p.tag === filter);
  grid.innerHTML = prods.slice(0, 8).map(productCard).join('');
}

function renderShopProducts() {
  const grid = document.getElementById('shopProductsGrid');
  const empty = document.getElementById('shopEmpty');
  const count = document.getElementById('shopProductCount');
  if (!grid) return;

  let prods = [...state.filteredProducts].filter(p => p.status === 'active' || !p.status);

  // Sort
  if (state.currentSort === 'price_asc') prods.sort((a,b) => a.price - b.price);
  else if (state.currentSort === 'price_desc') prods.sort((a,b) => b.price - a.price);
  else if (state.currentSort === 'name') prods.sort((a,b) => a.name.localeCompare(b.name));
  else if (state.currentSort === 'new') prods.sort((a,b) => b.id - a.id);

  if (count) count.textContent = prods.length;

  if (!prods.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
  } else {
    if (empty) empty.style.display = 'none';
    grid.innerHTML = prods.map(productCard).join('');
  }
}

function filterHomeProducts(filter) { renderHomeProducts(filter); }

function filterByCategory(catName) {
  state.currentFilter = catName;
  const catSel = document.getElementById('shopCategoryFilter');
  if (catSel) catSel.value = catName;

  // handle sub cats
  const cat = state.categories.find(c => c.name === catName);
  const subSec = document.getElementById('subCategorySection');
  const subSel = document.getElementById('shopSubCategoryFilter');
  if (cat && cat.sub && cat.sub.length && subSec && subSel) {
    subSec.style.display = 'block';
    subSel.innerHTML = '<option value="">All</option>' + cat.sub.map(s => `<option value="${s}">${s}</option>`).join('');
  } else {
    if (subSec) subSec.style.display = 'none';
  }

  const label = document.getElementById('shopCategoryLabel');
  if (label) label.textContent = catName ? `EXPLORE ${catName.toUpperCase()}` : 'EXPLORE PREMIUM WOMEN\'S FASHION';

  filterShopProducts();
}

function filterByTag(tag) {
  state.currentTag = tag;
  filterShopProducts();
}

function filterShopProducts() {
  const search = (document.getElementById('shopSearchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('shopCategoryFilter')?.value || state.currentFilter || '';
  const subCat = document.getElementById('shopSubCategoryFilter')?.value || '';
  const minP = parseFloat(document.getElementById('priceMin')?.value) || 0;
  const maxP = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
  const wantNew = document.getElementById('filterNew')?.checked;
  const wantHot = document.getElementById('filterHot')?.checked;
  const wantSale = document.getElementById('filterSale')?.checked;
  const wantStock = document.getElementById('filterStock')?.checked;

  state.filteredProducts = state.products.filter(p => {
    if (cat && p.category !== cat) return false;
    if (subCat && p.sub_category !== subCat) return false;
    if (search && !p.name.toLowerCase().includes(search) && !p.category.toLowerCase().includes(search)) return false;
    if (p.price < minP || p.price > maxP) return false;
    if (wantNew && p.tag !== 'new') return false;
    if (wantHot && p.tag !== 'hot') return false;
    if (wantSale && p.tag !== 'sale') return false;
    if (wantStock && p.stock === 0) return false;
    return true;
  });

  renderShopProducts();
}

function clearFilters() {
  state.filteredProducts = [...state.products];
  state.currentFilter = '';
  state.currentTag = '';
  const fields = ['shopSearchInput','priceMin','priceMax'];
  fields.forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  const checks = ['filterNew','filterHot','filterSale','filterStock'];
  checks.forEach(id => { const el = document.getElementById(id); if(el) el.checked = false; });
  const catSel = document.getElementById('shopCategoryFilter');
  if (catSel) catSel.value = '';
  const subSec = document.getElementById('subCategorySection');
  if (subSec) subSec.style.display = 'none';
  renderShopProducts();
}

function sortProducts(val) { state.currentSort = val; renderShopProducts(); }
function setView(view) {
  state.shopView = view;
  const grid = document.getElementById('shopProductsGrid');
  if (!grid) return;
  if (view === 'list') {
    grid.style.gridTemplateColumns = '1fr';
  } else {
    grid.style.gridTemplateColumns = '';
  }
  document.getElementById('viewGrid')?.classList.toggle('active', view==='grid');
  document.getElementById('viewList')?.classList.toggle('active', view==='list');
}

function handleSearch(val) {
  const search = val.toLowerCase();
  if (!search) { state.filteredProducts = [...state.products]; }
  else { state.filteredProducts = state.products.filter(p => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)); }
  renderShopProducts();
}

// ── PRODUCT DETAIL ────────────────────────────────────────────
function openProductDetail(id) {
  const p = state.products.find(pr => pr.id === id);
  if (!p) return;
  const discount = p.original_price > p.price ? Math.round((1 - p.price/p.original_price)*100) : 0;
  const colorsHtml = (p.colors || []).map((c,i) => `
    <div class="color-dot${i===0?' active':''}" style="background:${c};" onclick="this.parentElement.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));this.classList.add('active')"></div>
  `).join('');

  document.getElementById('pdmContent').innerHTML = `
    <div class="pdm-img">
      <img src="${p.image}" alt="${p.name}" />
    </div>
    <div class="pdm-info">
      <div class="pdm-brand">${p.brand || p.category}</div>
      <h2 class="pdm-name">${p.name}</h2>
      <div class="pdm-price">
        <span class="current">₹${p.price.toLocaleString()}</span>
        ${p.original_price > p.price ? `<span class="old">₹${p.original_price.toLocaleString()}</span>` : ''}
        ${discount > 0 ? `<span class="price-off" style="font-size:13px; font-weight:700; color:white; background:var(--pink); padding:4px 10px; border-radius:20px;">-${discount}%</span>` : ''}
      </div>
      <p class="pdm-desc">${p.description || ''}</p>
      ${p.fabric ? `<div class="pdm-fabric-tag"><i class="fa-solid fa-shirt" style="margin-right:6px;"></i>${p.fabric}</div>` : ''}
      ${p.colors && p.colors.length ? `
        <div class="pdm-color-label">Available Colors</div>
        <div class="pdm-colors">${colorsHtml}</div>
      ` : ''}
      <div style="font-size:13px; margin-bottom:20px;">
        ${p.stock > 0 ? `<span style="color:#4CAF50; font-weight:600;"><i class="fa-solid fa-circle-check"></i> In Stock (${p.stock} left)</span>` : '<span style="color:var(--pink); font-weight:600;"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>'}
      </div>
      <div class="pdm-actions">
        ${p.stock > 0 ? `<button class="btn btn-primary" style="justify-content:center;" onclick="addToCart(${p.id}); closeModal('productDetailModal')"><i class="fa-solid fa-bag-shopping"></i> Add to Bag — ₹${p.price.toLocaleString()}</button>` : ''}
        <button class="btn btn-outline" style="justify-content:center;" onclick="toggleWishlist(${p.id})">
          <i class="fa-${state.wishlist.includes(p.id)?'solid':'regular'} fa-heart"></i> ${state.wishlist.includes(p.id)?'Wishlisted':'Add to Wishlist'}
        </button>
      </div>
    </div>
  `;
  openModal('productDetailModal');
}

// ── CART ──────────────────────────────────────────────────────
function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  const existing = state.cart.find(i => i.id === productId);
  if (existing) { existing.qty++; }
  else { state.cart.push({ ...product, qty: 1 }); }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to bag! 🛍️`, 'success');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); renderCartItems(); }
}

function saveCart() { localStorage.setItem('vividha_cart', JSON.stringify(state.cart)); }

function updateCartUI() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
}

function openCart() {
  renderCartItems();
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartFooter');
  const headerCount = document.getElementById('cartHeaderCount');
  if (!list) return;
  const total = state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
  if (headerCount) headerCount.textContent = state.cart.length > 0 ? `(${state.cart.length})` : '';
  if (!state.cart.length) {
    list.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p>Your bag is empty</p>
        <span>Start adding some beautiful pieces!</span>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  list.innerHTML = state.cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${i.image}" alt="${i.name}" /></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-meta">${i.category}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQty(${i.id},-1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${i.id},1)">+</button>
          <span class="cart-item-price" style="margin-left:auto;">₹${(i.price*i.qty).toLocaleString()}</span>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i.id})"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

// ── WISHLIST ──────────────────────────────────────────────────
function toggleWishlist(id) {
  const idx = state.wishlist.indexOf(id);
  const prod = state.products.find(p => p.id === id);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast(`Removed from wishlist`, 'success');
  } else {
    state.wishlist.push(id);
    showToast(`${prod?.name || 'Item'} added to wishlist ❤️`, 'success');
  }
  localStorage.setItem('vividha_wishlist', JSON.stringify(state.wishlist));
  // refresh cards
  renderHomeProducts();
  renderShopProducts();
}

// ── AUTH ──────────────────────────────────────────────────────
// Local user store for demo/offline mode (file:// or when API is down)
const LOCAL_USERS_KEY = 'vividha_local_users';

function getLocalUsers() {
  return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
}
function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}
function localLogin(email, password) {
  const users = getLocalUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}
function localRegister(name, email, phone, password) {
  const users = getLocalUsers();
  if (users.find(u => u.email === email)) return null; // duplicate
  const newUser = { id: Date.now(), name, email, phone, password, is_admin: false };
  users.push(newUser);
  saveLocalUsers(users);
  return newUser;
}
function makeLocalToken(user) {
  return 'local-' + btoa(user.email + ':' + Date.now());
}

async function submitLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  document.getElementById('loginError').classList.remove('show');

  if (!email || !password) {
    showAuthError('loginError', 'Please enter email and password.');
    return;
  }

  // ── Try live API first ──
  try {
    const data = await fetchAPI('/auth/login/', 'POST', { email, password });
    if (data && data.token) {
      state.token = data.token;
      state.user  = data.user;
      localStorage.setItem('vividha_token', data.token);
      localStorage.setItem('vividha_user', JSON.stringify(data.user));
      closeModal('loginModal');
      updateAuthUI();
      showToast(`Welcome back, ${(data.user.name||'Friend').split(' ')[0]}! ✨`, 'success');
      return;
    }
  } catch (_) { /* API down or file:// mode — fall through to local auth */ }

  // ── Fallback: local user store ──
  const localUser = localLogin(email, password);
  if (localUser) {
    const token = makeLocalToken(localUser);
    state.token = token;
    state.user  = localUser;
    localStorage.setItem('vividha_token', token);
    localStorage.setItem('vividha_user', JSON.stringify(localUser));
    closeModal('loginModal');
    updateAuthUI();
    showToast(`Welcome back, ${localUser.name.split(' ')[0]}! ✨`, 'success');
  } else {
    showAuthError('loginError', 'Invalid email or password. Please try again.');
  }
}

async function submitRegister() {
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const phone    = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) {
    showAuthError('registerError', 'Please fill all required fields.');
    return;
  }
  if (password.length < 8) {
    showAuthError('registerError', 'Password must be at least 8 characters.');
    return;
  }

  // ── Try live API first ──
  try {
    const data = await fetchAPI('/auth/register/', 'POST', { name, email, phone, password });
    if (data && data.token) {
      state.token = data.token;
      state.user  = data.user;
      localStorage.setItem('vividha_token', data.token);
      localStorage.setItem('vividha_user', JSON.stringify(data.user));
      closeModal('registerModal');
      updateAuthUI();
      showToast(`Welcome to विVIDHA, ${name.split(' ')[0]}! 🎉`, 'success');
      return;
    }
  } catch (_) { /* API down — fall through to local register */ }

  // ── Fallback: local user store ──
  const existing = getLocalUsers().find(u => u.email === email);
  if (existing) {
    showAuthError('registerError', 'An account with this email already exists.');
    return;
  }
  const newUser = localRegister(name, email, phone, password);
  const token   = makeLocalToken(newUser);
  state.token = token;
  state.user  = newUser;
  localStorage.setItem('vividha_token', token);
  localStorage.setItem('vividha_user', JSON.stringify(newUser));
  closeModal('registerModal');
  updateAuthUI();
  showToast(`Welcome to विVIDHA, ${name.split(' ')[0]}! 🎉`, 'success');
}

function logout() {
  state.user = null;
  state.token = null;
  localStorage.removeItem('vividha_token');
  localStorage.removeItem('vividha_user');
  updateAuthUI();
  showToast('You have been signed out.', 'success');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const joinBtn = document.getElementById('joinBtn');
  const avatarBtn = document.getElementById('userAvatarBtn');
  if (state.user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (joinBtn) joinBtn.style.display = 'none';
    if (avatarBtn) {
      avatarBtn.style.display = 'flex';
      avatarBtn.textContent = (state.user.name || 'U')[0].toUpperCase();
      avatarBtn.onclick = () => {
        if (confirm(`Signed in as ${state.user.email}\nSign out?`)) logout();
      };
    }
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (joinBtn) joinBtn.style.display = '';
    if (avatarBtn) avatarBtn.style.display = 'none';
  }
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function switchAuth(to) {
  closeModal('loginModal');
  closeModal('registerModal');
  setTimeout(() => openModal(to === 'login' ? 'loginModal' : 'registerModal'), 200);
}

// ── CHECKOUT / RAZORPAY ───────────────────────────────────────
function openCheckout() {
  if (!state.cart.length) { showToast('Your cart is empty!', 'error'); return; }
  if (!state.user) {
    showToast('Please login to checkout!', 'error');
    closeCart();
    setTimeout(() => openModal('loginModal'), 400);
    return;
  }
  closeCart();
  const total = state.cart.reduce((s,i) => s + i.price * i.qty, 0);
  document.getElementById('coSubtotal').textContent = `₹${total.toLocaleString()}`;
  document.getElementById('coTotal').textContent = `₹${total.toLocaleString()}`;
  document.getElementById('coName').value = state.user.name || '';
  const listEl = document.getElementById('checkoutItemsList');
  if (listEl) {
    listEl.innerHTML = state.cart.map(i => `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-soft); font-size:13px;">
        <span>${i.name} × ${i.qty}</span>
        <span style="font-weight:600; color:var(--navy);">₹${(i.price*i.qty).toLocaleString()}</span>
      </div>
    `).join('');
  }
  openModal('checkoutModal');
}

async function initiateRazorpay() {
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const city = document.getElementById('coCity').value.trim();
  const pincode = document.getElementById('coPincode').value.trim();
  if (!name || !phone || !address || !city || !pincode) {
    showToast('Please fill all delivery details!', 'error');
    return;
  }
  const total = state.cart.reduce((s,i) => s + i.price * i.qty, 0);

  try {
    // Create order on backend
    const orderData = await fetchAPI('/orders/create/', 'POST', {
      items: state.cart.map(i => ({ product_id: i.id, qty: i.qty, price: i.price })),
      total_amount: total,
      delivery: { name, phone, address, city, pincode }
    });

    // Load Razorpay script if not loaded
    if (!window.Razorpay) {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }

    const options = {
key: 'rzp_live_SBfHnaNXR06cuM',
      amount: total * 100, // in paise
      currency: 'INR',
      name: 'विVIDHA',
      description: 'Premium Women\'s Fashion',
      image: '',
      order_id: orderData?.razorpay_order_id || '',
      handler: async function(response) {
        try {
          await fetchAPI('/orders/verify/', 'POST', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          state.cart = [];
          saveCart();
          updateCartUI();
          closeModal('checkoutModal');
          showToast('Order placed successfully! 🎉 You\'ll receive a confirmation shortly.', 'success');
        } catch(e) {
          showToast('Payment verification failed. Please contact support.', 'error');
        }
      },
      prefill: { name, contact: phone, email: state.user?.email || '' },
      theme: { color: '#1B2A4A' },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => showToast('Payment failed. Please try again.', 'error'));
    rzp.open();
  } catch(e) {
    showToast(e.message || 'Failed to initiate payment. Please try again.', 'error');
  }
}

function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

// ── NAVIGATION ────────────────────────────────────────────────
function showPage(page) {
  // Hide all pages
// Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
    p.style.visibility = 'hidden';
    p.style.position = 'absolute';
    p.style.height = '0';
    p.style.overflow = 'hidden';
    p.style.top = '0';
    p.style.left = '0';
    p.style.pointerEvents = 'none';
  });

  // Show target page
  const target = document.getElementById('page-' + page);
if (target) {
    target.classList.add('active');
    target.style.display = 'block';
    target.style.visibility = 'visible';
    target.style.position = 'relative';
    target.style.height = 'auto';
    target.style.overflow = 'visible';
    target.style.top = 'auto';
    target.style.left = 'auto';
    target.style.pointerEvents = 'auto';
  }

  // Instantly jump to top — no smooth scroll (avoids appearing to scroll down)
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('onclick') && l.getAttribute('onclick').includes("'" + page + "'")) {
      l.classList.add('active');
    }
  });

  // Re-render shop products when shop opens
  if (page === 'shop') {
    renderShopProducts();
    populateSidebarCategories();
  }
}

// ── MODALS ────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

// ── SEARCH ────────────────────────────────────────────────────
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  const isOpen = bar.style.display === 'flex' || bar.style.display === 'block';
  bar.style.display = isOpen ? 'none' : 'flex';
  if (!isOpen) setTimeout(() => document.getElementById('searchInput')?.focus(), 50);
}
function closeSearch() {
  const bar = document.getElementById('searchBar');
  if (bar) bar.style.display = 'none';
}

// ── MOBILE MENU ───────────────────────────────────────────────
document.getElementById('hamburgerBtn')?.addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('mobileMenuOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
});
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileMenuOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── BUTTON EVENT BINDINGS ──────────────────────────────────────
document.getElementById('loginBtn')?.addEventListener('click', () => openModal('loginModal'));
document.getElementById('joinBtn')?.addEventListener('click', () => openModal('registerModal'));
document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('searchToggleBtn')?.addEventListener('click', toggleSearch);
document.getElementById('wishlistBtn')?.addEventListener('click', () => {
  if (!state.wishlist.length) { showToast('Your wishlist is empty! ♡', 'error'); return; }
  showToast(`${state.wishlist.length} item(s) in your wishlist ❤️`, 'success');
});

// ── NEWSLETTER ────────────────────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type=email]').value;
  if (!email) return;
  showToast(`You're subscribed! Welcome to विVIDHA ✨`, 'success');
  e.target.reset();
}

// ── TOAST ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = document.getElementById('toastIcon');
  if (!toast) return;
  if (msgEl) msgEl.textContent = msg;
  if (iconEl) iconEl.textContent = type === 'success' ? '✓' : '✕';
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ── SCROLL TO CATEGORIES ──────────────────────────────────────
function scrollToCategories() {
  document.getElementById('categoriesSection')?.scrollIntoView({ behavior: 'smooth' });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────
function setupScrollEffects() {
  observeReveal();
  window.addEventListener('scroll', observeReveal, { passive: true });
}
function observeReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
}
