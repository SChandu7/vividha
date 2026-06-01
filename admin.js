/* ═══════════════════════════════════════════════════════════════
   विVIDHA — admin.js
   Full admin panel logic: auth, CRUD products/categories/orders
   Backend: api.chandus7.in/api/fashion/
   ═══════════════════════════════════════════════════════════════ */

const API = 'https://api.chandus7.in/api/fashion';

// ── HARDCODED ADMIN CREDENTIALS ───────────────────────────────
const ADMIN_EMAIL    = 'admin@vividha.in';
const ADMIN_PASSWORD = 'admin@123';

// ── STATE ──────────────────────────────────────────────────────
let admin = {
  token: localStorage.getItem('vividha_admin_token') || null,
  products: [],
  categories: [],
  orders: [],
  customers: [],
  banners: [],
  coupons: [],
  filteredProducts: [],
  filteredOrders: [],
  editingProductId: null,
  editingCategoryId: null,
  editingBannerId: null,
};

// ── DEMO DATA ─────────────────────────────────────────────────
const DEMO_CATEGORIES = [
  { id:1, name:'Sarees', slug:'sarees', image:'https://images.unsplash.com/photo-1611811960734-2b1b8b5d17b1?w=400&q=80', count:80, status:'active', sub:['Silk Sarees','Cotton Sarees','Banarasi','Kashmiri','Printed','Georgette'] },
  { id:2, name:'Kurtis', slug:'kurtis', image:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80', count:120, status:'active', sub:['Straight Kurtis','A-Line','Anarkali','Kaftan','Designer'] },
  { id:3, name:'Punjabi Suits', slug:'punjabi-suits', image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', count:65, status:'active', sub:[] },
  { id:4, name:'Lehengas', slug:'lehengas', image:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&q=80', count:45, status:'active', sub:['Bridal','Party Wear','Casual'] },
  { id:5, name:'Salwar Suits', slug:'salwar-suits', image:'https://images.unsplash.com/photo-1601936374000-e31f2735e972?w=400&q=80', count:70, status:'active', sub:[] },
  { id:6, name:'Kashmiri Wear', slug:'kashmiri', image:'https://images.unsplash.com/photo-1595039838779-f3780873afdd?w=400&q=80', count:30, status:'active', sub:[] },
  { id:7, name:'Pakistani Wear', slug:'pakistani', image:'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&q=80', count:40, status:'active', sub:[] },
  { id:8, name:'Dresses & Tops', slug:'western', image:'https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=400&q=80', count:90, status:'active', sub:[] },
];

const DEMO_PRODUCTS = [
  { id:1,  name:'Kanjivaram Pure Silk Saree',   category:'Sarees',        sub_category:'Silk Sarees',    brand:'Kanjivaram Heritage', sku:'VIV-SAR-001', price:4999,  original_price:7499,  stock:12,  tag:'hot',  image:'https://images.unsplash.com/photo-1611811960734-2b1b8b5d17b1?w=400&q=80',  description:'Exquisite pure Kanjivaram silk saree with traditional gold zari border. A timeless piece for weddings and celebrations.', fabric:'Pure Silk, Zari',    colors:['#8B0000','#1B2A4A','#2D5A1E'], status:'active' },
  { id:2,  name:'Banarasi Brocade Lehenga',      category:'Lehengas',      sub_category:'Bridal',         brand:'Royal Banaras',        sku:'VIV-LEH-001', price:2,  original_price:12999, stock:5,   tag:'hot',  image:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&q=80',  description:'Stunning Banarasi brocade lehenga with intricate gold work. Perfect for bridal occasions.', fabric:'Brocade Silk, Net',  colors:['#C9A84C','#E8789A','#1B2A4A'], status:'active' },
  { id:3,  name:'Floral Anarkali Kurti',          category:'Kurtis',        sub_category:'Anarkali',       brand:'Vividha Studio',       sku:'VIV-KUR-001', price:1299,  original_price:1799,  stock:50,  tag:'new',  image:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80',  description:'Beautiful floral printed Anarkali kurti with gota patti work.', fabric:'Rayon, Cotton',      colors:['#E8789A','#F7F0DC','#4A5E8A'], status:'active' },
  { id:4,  name:'Embroidered Punjabi Suit',       category:'Punjabi Suits', sub_category:null,             brand:'Punjab Pride',          sku:'VIV-PUN-001', price:2499,  original_price:3499,  stock:25,  tag:'new',  image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',  description:'Hand-embroidered Punjabi suit with phulkari dupatta.', fabric:'Cotton, Chiffon',    colors:['#C9A84C','#E8789A','#2D5A1E'], status:'active' },
  { id:5,  name:'Kashmiri Embroidery Pheran',     category:'Kashmiri Wear', sub_category:null,             brand:'Kashmir Valley',        sku:'VIV-KAS-001', price:3499,  original_price:4999,  stock:3,   tag:'hot',  image:'https://images.unsplash.com/photo-1595039838779-f3780873afdd?w=400&q=80',  description:'Authentic Kashmiri Pheran with hand-done sozni embroidery.', fabric:'Wool, Pashmina',    colors:['#1B2A4A','#8B4513','#2D5A1E'], status:'active' },
  { id:6,  name:'Pakistani Lawn Suit',             category:'Pakistani Wear',sub_category:null,             brand:'Lakhani Fabrics',       sku:'VIV-PAK-001', price:1899,  original_price:2499,  stock:40,  tag:'sale', image:'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&q=80',  description:'Premium Pakistani lawn suit with exquisite block print.', fabric:'Lawn Cotton',        colors:['#F7F0DC','#E8789A','#4A5E8A'], status:'active' },
  { id:7,  name:'Georgette Salwar Kameez',         category:'Salwar Suits',  sub_category:null,             brand:'Vividha Studio',       sku:'VIV-SAL-001', price:1599,  original_price:2199,  stock:4,   tag:'new',  image:'https://images.unsplash.com/photo-1601936374000-e31f2735e972?w=400&q=80',  description:'Elegant georgette salwar kameez with mirror work dupatta.', fabric:'Georgette, Net',    colors:['#C9A84C','#E8789A','#1B2A4A'], status:'active' },
  { id:8,  name:'Maxi Floral Dress',               category:'Dresses & Tops',sub_category:null,             brand:'Fusion by Vividha',    sku:'VIV-DRS-001', price:1199,  original_price:1699,  stock:60,  tag:'new',  image:'https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=400&q=80',  description:'Breezy floral maxi dress with contemporary Indian-fusion aesthetic.', fabric:'Rayon, Viscose',    colors:['#E8789A','#F7F0DC','#2D5A1E'], status:'active' },
  { id:9,  name:'Cotton Printed Straight Kurti',  category:'Kurtis',        sub_category:'Straight Kurtis',brand:'Daily Wear Co.',        sku:'VIV-KUR-002', price:699,   original_price:999,   stock:100, tag:'sale', image:'https://images.unsplash.com/photo-1594938298603-c8148c4b4f1a?w=400&q=80',  description:'Comfortable block-printed cotton kurti for daily wear.', fabric:'100% Cotton',        colors:['#C9A84C','#E8789A','#4A5E8A'], status:'active' },
  { id:10, name:'Bridal Red Silk Saree',           category:'Sarees',        sub_category:'Silk Sarees',    brand:'Bridal Vividha',        sku:'VIV-SAR-002', price:9999,  original_price:14999, stock:2,   tag:'hot',  image:'https://images.unsplash.com/photo-1617142137564-0dade1f5d27b?w=400&q=80',  description:'Luxurious bridal red silk saree with heavy gold embroidery.', fabric:'Pure Silk, Zari',    colors:['#8B0000','#C9A84C'],           status:'active' },
  { id:11, name:'Embroidered Palazzo Set',         category:'Kurtis',        sub_category:'Kaftan',         brand:'Vividha Studio',       sku:'VIV-KUR-003', price:1799,  original_price:2499,  stock:0,   tag:'new',  image:'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80',  description:'Boho-chic embroidered palazzo set with matching dupatta.', fabric:'Rayon',              colors:['#E8789A','#F7F0DC','#C9A84C'], status:'inactive' },
  { id:12, name:'Phulkari Dupatta',                category:'Punjabi Suits', sub_category:null,             brand:'Punjab Pride',          sku:'VIV-PUN-002', price:899,   original_price:1299,  stock:55,  tag:'sale', image:'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=400&q=80',  description:'Vibrant handwoven Phulkari dupatta from Punjab.', fabric:'Cotton, Silk Thread', colors:['#C9A84C','#E8789A','#8B0000'], status:'active' },
];

const DEMO_ORDERS = [
  { id:1, order_no:'VIV20241001', customer:'Priya Sharma',  email:'priya@example.com',  items:2, total:6298,  payment:'paid',    status:'delivered', date:'Dec 10, 2024' },
  { id:2, order_no:'VIV20241002', customer:'Anjali Verma',  email:'anjali@example.com', items:1, total:8999,  payment:'paid',    status:'shipped',   date:'Dec 18, 2024' },
  { id:3, order_no:'VIV20241003', customer:'Meera Nair',    email:'meera@example.com',  items:3, total:4197,  payment:'paid',    status:'confirmed', date:'Dec 22, 2024' },
  { id:4, order_no:'VIV20241004', customer:'Ritu Singh',    email:'ritu@example.com',   items:1, total:4999,  payment:'paid',    status:'pending',   date:'Dec 28, 2024' },
  { id:5, order_no:'VIV20241005', customer:'Sunita Yadav',  email:'sunita@example.com', items:2, total:3398,  payment:'pending', status:'pending',   date:'Dec 30, 2024' },
  { id:6, order_no:'VIV20241006', customer:'Lakshmi Iyer',  email:'lak@example.com',    items:1, total:9999,  payment:'paid',    status:'delivered', date:'Jan 02, 2025' },
  { id:7, order_no:'VIV20250107', customer:'Deepa Menon',   email:'deepa@example.com',  items:4, total:12496, payment:'paid',    status:'shipped',   date:'Jan 07, 2025' },
  { id:8, order_no:'VIV20250110', customer:'Kavya Reddy',   email:'kavya@example.com',  items:1, total:1299,  payment:'paid',    status:'confirmed', date:'Jan 10, 2025' },
];

const DEMO_CUSTOMERS = [
  { id:1, name:'Priya Sharma',  email:'priya@example.com',  phone:'+91 98765 43210', orders:5, total_spent:28495, joined:'Nov 2024', is_admin:false },
  { id:2, name:'Anjali Verma',  email:'anjali@example.com', phone:'+91 87654 32109', orders:3, total_spent:19998, joined:'Nov 2024', is_admin:false },
  { id:3, name:'Meera Nair',    email:'meera@example.com',  phone:'+91 76543 21098', orders:8, total_spent:42196, joined:'Oct 2024', is_admin:false },
  { id:4, name:'Ritu Singh',    email:'ritu@example.com',   phone:'+91 65432 10987', orders:2, total_spent:8598,  joined:'Dec 2024', is_admin:false },
  { id:5, name:'Sunita Yadav',  email:'sunita@example.com', phone:'+91 55432 10987', orders:1, total_spent:3398,  joined:'Dec 2024', is_admin:false },
  { id:6, name:'Lakshmi Iyer',  email:'lak@example.com',    phone:'+91 91234 56789', orders:6, total_spent:51294, joined:'Oct 2024', is_admin:false },
];

const DEMO_BANNERS = [
  { id:1, title:'Festive Collection 2024', image:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80', link:'/shop?tag=hot',      position:'hero',   status:'active' },
  { id:2, title:'Banarasi Heritage Edit',  image:'https://images.unsplash.com/photo-1611811960734-2b1b8b5d17b1?w=600&q=80', link:'/shop?cat=sarees',  position:'mid',    status:'active' },
  { id:3, title:'New Kurtis Arrival',       image:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', link:'/shop?cat=kurtis',  position:'bottom', status:'inactive' },
];

const DEMO_COUPONS = [
  { id:1, code:'VIVIDHA10',  discount:10, min_order:999,  max_uses:100, used:34, expiry:'2025-06-30', active:true  },
  { id:2, code:'NEWUSER20',  discount:20, min_order:1499, max_uses:50,  used:12, expiry:'2025-03-31', active:true  },
  { id:3, code:'FESTIVAL15', discount:15, min_order:2000, max_uses:200, used:89, expiry:'2024-12-31', active:false },
];

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (admin.token) {
    showApp();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
  }
});

// ── LOGIN ──────────────────────────────────────────────────────
async function adminLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPass').value;

  // Try real API first
  try {
    const data = await fetchAPI('/auth/login/', 'POST', { email, password });
    if (data && data.token && data.user && data.user.is_admin) {
      admin.token = data.token;
      localStorage.setItem('vividha_admin_token', data.token);
      hideLoginErr();
      showApp();
      return;
    }
  } catch (_) { /* fall through */ }

  // Fallback: hardcoded check
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    admin.token = 'demo-admin-token';
    localStorage.setItem('vividha_admin_token', 'demo-admin-token');
    hideLoginErr();
    showApp();
  } else {
    showLoginErr('Invalid email or password. Please try again.');
  }
}

function showLoginErr(msg) {
  const el = document.getElementById('loginErr');
  if (el) { el.textContent = msg; el.classList.add('show'); }
}
function hideLoginErr() {
  const el = document.getElementById('loginErr');
  if (el) el.classList.remove('show');
}

function adminLogout() {
  if (!confirm('Sign out of admin panel?')) return;
  admin.token = null;
  localStorage.removeItem('vividha_admin_token');
  document.getElementById('appShell').classList.remove('visible');
  document.getElementById('loginScreen').style.display = 'flex';
}

function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').classList.add('visible');
  loadAllData();
}

// ── API HELPER ────────────────────────────────────────────────
async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (admin.token) {
    headers['Authorization'] = `Token ${admin.token}`;
  }
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + endpoint, opts);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json().catch(() => null);
}

// ── LOAD ALL DATA ─────────────────────────────────────────────
async function loadAllData() {
  // Try API; fall back to demo data for each resource
 await safeLoad('/categories/', r => { admin.categories = r && r.length ? r : (JSON.parse(localStorage.getItem('vividha_admin_categories')||'null') || []); });
await safeLoad('/products/',   r => { admin.products = r && r.length ? r : (JSON.parse(localStorage.getItem('vividha_admin_products')||'null') || []); });
await safeLoad('/orders/',     r => { admin.orders = r && r.length ? r : (JSON.parse(localStorage.getItem('vividha_admin_orders')||'null') || []); });
await safeLoad('/customers/',  r => { admin.customers = r && r.length ? r : []; });
  await safeLoad('/banners/', r => { admin.banners = r && r.length ? r : []; });
await safeLoad('/coupons/', r => { admin.coupons = r && r.length ? r : []; });
  admin.filteredProducts = [...admin.products];
  admin.filteredOrders   = [...admin.orders];

  renderDashboard();
  renderAdminProducts();
  renderAdminCategories();
  renderOrders();
  renderCustomers();
  renderBanners();
  renderCoupons();
  renderLowStock();
  renderAnalytics();
  populateCategorySelects();
}

async function safeLoad(endpoint, setter) {
  try { setter(await fetchAPI(endpoint)); }
  catch (_) { setter(null); }
}

// ── PAGE NAVIGATION ───────────────────────────────────────────
function showAdminPage(page, el) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  if (el) el.classList.add('active');
  const titles = {
    dashboard: 'Dashboard', analytics: 'Analytics', products: 'Products',
    categories: 'Categories', banners: 'Banners & Hero', orders: 'Orders',
    customers: 'Customers', coupons: 'Coupons', lowstock: 'Low Stock Alerts',
  };
  document.getElementById('topbarTitle').textContent = titles[page] || 'Dashboard';
}

// ── GLOBAL SEARCH ─────────────────────────────────────────────
function globalSearch(q) {
  const s = q.toLowerCase();
  if (!s) {
    admin.filteredProducts = [...admin.products];
    admin.filteredOrders   = [...admin.orders];
  } else {
    admin.filteredProducts = admin.products.filter(p =>
      p.name.toLowerCase().includes(s) || (p.sku||'').toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
    );
    admin.filteredOrders = admin.orders.filter(o =>
      (o.order_no||'').toLowerCase().includes(s) || (o.customer||'').toLowerCase().includes(s)
    );
  }
  renderAdminProducts();
  renderOrders(null, admin.filteredOrders);
}

// ── DASHBOARD ─────────────────────────────────────────────────
function renderDashboard() {
  const todayOrders  = admin.orders.filter(o => o.status !== 'cancelled').length;
  const revenue      = admin.orders.filter(o => o.payment === 'paid').reduce((s, o) => s + (o.total||0), 0);
  const pendingCount = admin.orders.filter(o => o.status === 'pending').length;
  const lowStockN    = admin.products.filter(p => p.stock <= 5).length;

  setText('statOrders',    todayOrders);
  setText('statRevenue',   '₹' + revenue.toLocaleString());
  setText('statProducts',  admin.products.length);
  setText('statPending',   pendingCount);
  setText('statCustomers', admin.customers.length);
  setText('statLowStock',  lowStockN);

  const badge = document.getElementById('lowStockBadge');
  if (badge) badge.textContent = lowStockN;

  const body = document.getElementById('recentOrdersBody');
  if (body) {
    body.innerHTML = admin.orders.slice(0, 6).map(o => `
      <tr>
        <td class="td-name">${o.order_no}</td>
        <td>${o.customer || '—'}</td>
        <td class="td-price">₹${(o.total||0).toLocaleString()}</td>
        <td><span class="payment-tag ${o.payment||'pending'}">${(o.payment||'PENDING').toUpperCase()}</span></td>
        <td><span class="order-status ${o.status}">${o.status}</span></td>
        <td>${o.date||'—'}</td>
        <td><button class="act-btn view" onclick="openOrderStatus(${o.id})" title="Update"><i class="fa-regular fa-pen-to-square"></i></button></td>
      </tr>`).join('');
  }
}

// ── ANALYTICS ────────────────────────────────────────────────
function renderAnalytics() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const vals = [12400, 8900, 15600, 11200, 18900, 24500, 16800];
  const max  = Math.max(...vals);

  const barsEl  = document.getElementById('revenueBars');
  const labelsEl = document.getElementById('revenueLabels');
  if (barsEl) {
    barsEl.innerHTML = vals.map(v => `
      <div class="chart-bar" style="height:${Math.round(v/max*100)}%;">
        <div class="bar-tip">₹${v.toLocaleString()}</div>
      </div>`).join('');
  }
  if (labelsEl) {
    labelsEl.innerHTML = days.map(d => `<div class="chart-label">${d}</div>`).join('');
  }

  const topCats = document.getElementById('topCatsAnalytics');
  if (topCats) {
    const pcts = [80,65,50,38,25];
    topCats.innerHTML = admin.categories.slice(0,5).map((c,i) => `
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span style="font-weight:500;">${c.name}</span>
          <span style="color:#A8872E;font-weight:600;">${pcts[i]}%</span>
        </div>
        <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${pcts[i]}%;background:linear-gradient(to right,var(--navy),var(--gold));border-radius:3px;"></div>
        </div>
      </div>`).join('');
  }

  const body = document.getElementById('topProductsBody');
  if (body) {
    const soldArr = [45,38,32,28,22];
    body.innerHTML = admin.products.slice(0,5).map((p,i) => {
      const sold = soldArr[i];
      return `<tr>
        <td class="td-name">${p.name}</td>
        <td class="td-cat">${p.category}</td>
        <td class="td-price">₹${p.price.toLocaleString()}</td>
        <td>${sold} units</td>
        <td class="td-price">₹${(p.price*sold).toLocaleString()}</td>
      </tr>`;
    }).join('');
  }
}

// ── PRODUCTS ─────────────────────────────────────────────────
function renderAdminProducts(list) {
  const prods = list || admin.filteredProducts;
  const body  = document.getElementById('adminProductsBody');
  if (!body) return;

  if (!prods.length) {
    body.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--text-muted);">No products found</td></tr>';
    return;
  }

  body.innerHTML = prods.map(p => {
    const sc = p.stock === 0 ? 'zero' : p.stock <= 5 ? 'low' : 'ok';
    const si = p.stock === 0 ? '✕' : p.stock <= 5 ? '⚠' : '✓';
    const disc = p.original_price > p.price ? Math.round((1-p.price/p.original_price)*100) : 0;
    return `<tr>
      <td><img class="td-img" src="${p.image||''}" alt="" loading="lazy" onerror="this.src='https://via.placeholder.com/44x54/F2EDE3/999?text=img'" /></td>
      <td>
        <div class="td-name">${p.name}</div>
        ${p.tag ? `<span style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 7px;border-radius:10px;background:${p.tag==='hot'?'var(--pink)':p.tag==='new'?'var(--navy)':'var(--gold)'};color:white;">${p.tag}</span>` : ''}
      </td>
      <td style="font-family:monospace;font-size:11px;color:var(--text-muted);">${p.sku||'—'}</td>
      <td>
        <div class="td-cat" style="font-weight:500;">${p.category}</div>
        ${p.sub_category ? `<div style="font-size:11px;color:var(--text-light);">${p.sub_category}</div>` : ''}
      </td>
      <td>
        <div class="td-price">₹${p.price.toLocaleString()}</div>
        ${disc>0?`<div style="font-size:11px;color:var(--text-light);text-decoration:line-through;">₹${p.original_price.toLocaleString()}</div>`:''}
      </td>
      <td><span class="stock-badge ${sc}">${si} ${p.stock}</span></td>
      <td><span class="status-tag ${p.status||'active'}">${p.status||'active'}</span></td>
      <td>
        <div class="action-btns">
          <button class="act-btn edit" onclick="openProductModal(${p.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="act-btn del"  onclick="deleteProduct(${p.id})"    title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterAdminProducts(catName) {
  admin.filteredProducts = catName
    ? admin.products.filter(p => p.category === catName)
    : [...admin.products];
  renderAdminProducts();
}

function searchAdminProducts(q) {
  const s = q.toLowerCase();
  admin.filteredProducts = s
    ? admin.products.filter(p => p.name.toLowerCase().includes(s) || (p.sku||'').toLowerCase().includes(s))
    : [...admin.products];
  renderAdminProducts();
}

function populateCategorySelects() {
  const pCat  = document.getElementById('pCategory');
  const fCat  = document.getElementById('adminCatFilter');
  const opts  = '<option value="">Select Category...</option>' +
    admin.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  if (pCat)  pCat.innerHTML  = opts;
  if (fCat) {
    fCat.innerHTML = '<option value="">All Categories</option>' +
      admin.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  }
}

function updateSubCatOptions() {
  const catName = document.getElementById('pCategory')?.value;
  const cat     = admin.categories.find(c => c.name === catName);
  const subSel  = document.getElementById('pSubCategory');
  if (!subSel) return;
  subSel.innerHTML = '<option value="">None</option>';
  if (cat && cat.sub && cat.sub.length) {
    cat.sub.forEach(s => subSel.insertAdjacentHTML('beforeend', `<option value="${s}">${s}</option>`));
  }
}
function resetToDemo() {
  if (!confirm('Reset all products to demo data? Your added products will be lost.')) return;
  localStorage.removeItem('vividha_admin_products');
  admin.products = [...DEMO_PRODUCTS];
  admin.filteredProducts = [...admin.products];
  renderAdminProducts();
  renderDashboard();
  renderLowStock();
  showToast('Demo products restored ✓', 'success');
}

function openProductModal(id) {
  admin.editingProductId = id || null;
  populateCategorySelects();
  document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add Product';

  if (id) {
    const p = admin.products.find(x => x.id === id);
    if (!p) return;
    setVal('editProductId', id);
    setVal('pName', p.name||'');
    setVal('pSku',  p.sku||'');
    setVal('pBrand', p.brand||'');
    setVal('pFabric', p.fabric||'');
    setVal('pShortDesc', p.short_desc||'');
    setVal('pDesc', p.description||'');
    setVal('pPrice', p.price||'');
    setVal('pOriginalPrice', p.original_price||'');
    setVal('pStock', p.stock||0);
    setVal('pTag', p.tag||'');
    setVal('pStatus', p.status||'active');
    setVal('pColors', (p.colors||[]).join(', '));
    setVal('pImageUrl', p.image||'');
    setVal('pCategory', p.category||'');
    updateSubCatOptions();
    setVal('pSubCategory', p.sub_category||'');
    previewImageUrl(p.image||'');
  } else {
    ['editProductId','pName','pSku','pBrand','pFabric','pShortDesc','pDesc',
     'pPrice','pOriginalPrice','pStock','pColors','pImageUrl'].forEach(id => setVal(id,''));
    setVal('pTag',''); setVal('pStatus','active');
    const prev = document.getElementById('pImagePreview');
    if (prev) prev.style.display = 'none';
    populateCategorySelects();
    const subSel = document.getElementById('pSubCategory');
    if (subSel) subSel.innerHTML = '<option value="">None</option>';
  }
  openModal('productModal');
}

async function saveProduct() {
  const name     = document.getElementById('pName')?.value.trim();
  const category = document.getElementById('pCategory')?.value;
  const price    = parseFloat(document.getElementById('pPrice')?.value);
  const stock    = parseInt(document.getElementById('pStock')?.value || '0');

  if (!name || !category || isNaN(price)) {
    showToast('Fill required fields: Name, Category, Price', 'error');
    return;
  }

  const productData = {
    name, category,
    sub_category:   document.getElementById('pSubCategory')?.value || null,
    brand:          document.getElementById('pBrand')?.value || '',
    fabric:         document.getElementById('pFabric')?.value || '',
    sku:            document.getElementById('pSku')?.value || generateSKU(name),
    description:    document.getElementById('pDesc')?.value || '',
    price,
    original_price: parseFloat(document.getElementById('pOriginalPrice')?.value) || price,
    stock,
    tag:            document.getElementById('pTag')?.value || null,
    status:         document.getElementById('pStatus')?.value || 'active',
    colors:         document.getElementById('pColors')?.value.split(',').map(s=>s.trim()).filter(Boolean),
    image:          document.getElementById('pImageUrl')?.value || '',
  };

  const editId = admin.editingProductId;

  try {
    if (editId) {
      await fetchAPI(`/products/${editId}/`, 'PUT', productData);
    } else {
      const res = await fetchAPI('/products/', 'POST', productData);
      if (res && res.id) productData.id = res.id;
    }
  } catch (_) { /* demo mode */ }

  if (editId) {
    const idx = admin.products.findIndex(p => p.id === editId);
    if (idx >= 0) admin.products[idx] = { ...admin.products[idx], ...productData };
    localStorage.setItem('vividha_admin_products', JSON.stringify(admin.products));
    showToast('Product updated successfully ✓', 'success');
  } else {
    productData.id = productData.id || Date.now();
    admin.products.push(productData);
    localStorage.setItem('vividha_admin_products', JSON.stringify(admin.products));
    showToast('Product added successfully ✓', 'success');
  }

  admin.filteredProducts = [...admin.products];
  renderAdminProducts();
  renderDashboard();
  renderLowStock();
  populateCategorySelects();
  closeModal('productModal');
}

async function deleteProduct(id) {
  if (!confirm('Delete this product? This action cannot be undone.')) return;
  try { await fetchAPI(`/products/${id}/`, 'DELETE'); } catch (_) {}
  admin.products         = admin.products.filter(p => p.id !== id);
  admin.filteredProducts = admin.filteredProducts.filter(p => p.id !== id);
  localStorage.setItem('vividha_admin_products', JSON.stringify(admin.products));
  renderAdminProducts();
  renderDashboard();
  renderLowStock();
  showToast('Product deleted.', 'success');
}

function previewImageUrl(url) {
  const img = document.getElementById('pImagePreview');
  if (!img) return;
  if (url) {
    img.src = url;
    img.style.display = 'block';
    img.onerror = () => { img.style.display = 'none'; };
  } else {
    img.style.display = 'none';
  }
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('pImagePreview');
    if (img) { img.src = e.target.result; img.style.display = 'block'; }
    // In production, upload to S3 here and set the URL
    showToast('Image selected — will upload to S3 on save.', 'success');
  };
  reader.readAsDataURL(file);
}

function generateSKU(name) {
  const prefix = name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  return `VIV-${prefix}-${Date.now().toString().slice(-4)}`;
}

// ── CATEGORIES ───────────────────────────────────────────────
function renderAdminCategories() {
  const body = document.getElementById('adminCategoriesBody');
  if (!body) return;
  body.innerHTML = admin.categories.map(c => `
    <tr>
      <td><img class="td-img" src="${c.image||''}" alt="" loading="lazy" onerror="this.src='https://via.placeholder.com/44x54/F2EDE3/999?text=img'" /></td>
      <td class="td-name">${c.name}</td>
      <td style="font-family:monospace;font-size:11px;color:var(--text-muted);">${c.slug||slugify(c.name)}</td>
      <td>${c.count||0}</td>
      <td style="font-size:12px;color:var(--text-muted);">${(c.sub||[]).length ? (c.sub||[]).slice(0,3).join(', ') + (c.sub.length>3?' …':'') : '—'}</td>
      <td><span class="status-tag ${c.status||'active'}">${c.status||'active'}</span></td>
      <td>
        <div class="action-btns">
          <button class="act-btn edit" onclick="openCategoryModal(${c.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="act-btn del"  onclick="deleteCategory(${c.id})"    title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function openCategoryModal(id) {
  admin.editingCategoryId = id || null;
  document.getElementById('catModalTitle').textContent = id ? 'Edit Category' : 'Add Category';

  if (id) {
    const c = admin.categories.find(x => x.id === id);
    if (!c) return;
    setVal('editCatId', id);
    setVal('cName',  c.name||'');
    setVal('cSlug',  c.slug||'');
    setVal('cImage', c.image||'');
    setVal('cSubs',  (c.sub||[]).join(', '));
  } else {
    ['editCatId','cName','cSlug','cImage','cSubs'].forEach(id => setVal(id,''));
  }
  openModal('categoryModal');
}

async function saveCategory() {
  const name = document.getElementById('cName')?.value.trim();
  if (!name) { showToast('Category name is required', 'error'); return; }

  const catData = {
    name,
    slug:   document.getElementById('cSlug')?.value.trim() || slugify(name),
    image:  document.getElementById('cImage')?.value.trim() || '',
    sub:    document.getElementById('cSubs')?.value.split(',').map(s=>s.trim()).filter(Boolean),
    status: 'active',
  };

  const editId = admin.editingCategoryId;

  try {
    if (editId) {
      await fetchAPI(`/categories/${editId}/`, 'PUT', catData);
    } else {
      const res = await fetchAPI('/categories/', 'POST', catData);
      if (res && res.id) catData.id = res.id;
    }
  } catch (_) {}

  if (editId) {
    const idx = admin.categories.findIndex(c => c.id === editId);
    if (idx >= 0) admin.categories[idx] = { ...admin.categories[idx], ...catData };
    showToast('Category updated ✓', 'success');
  } else {
    catData.id = catData.id || Date.now();
    admin.categories.push(catData);
    showToast('Category added ✓', 'success');
  }

  renderAdminCategories();
  populateCategorySelects();
  closeModal('categoryModal');
}

async function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  try { await fetchAPI(`/categories/${id}/`, 'DELETE'); } catch (_) {}
  admin.categories = admin.categories.filter(c => c.id !== id);
  renderAdminCategories();
  populateCategorySelects();
  showToast('Category deleted.', 'success');
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
}

// ── ORDERS ───────────────────────────────────────────────────
function renderOrders(statusFilter, list) {
  const orders = list || (statusFilter
    ? admin.orders.filter(o => o.status === statusFilter)
    : admin.orders);

  const body = document.getElementById('adminOrdersBody');
  if (!body) return;

  if (!orders.length) {
    body.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--text-muted);">No orders found</td></tr>';
    return;
  }

  body.innerHTML = orders.map(o => `
    <tr>
      <td class="td-name">${o.order_no}</td>
      <td>
        <div style="font-weight:500;">${o.customer||'—'}</div>
        <div style="font-size:11px;color:var(--text-muted);">${o.email||''}</div>
      </td>
      <td>${o.items||0} item${(o.items||0)!==1?'s':''}</td>
      <td class="td-price">₹${(o.total||0).toLocaleString()}</td>
      <td><span class="payment-tag ${o.payment||'pending'}">${(o.payment||'PENDING').toUpperCase()}</span></td>
      <td><span class="order-status ${o.status}">${o.status}</span></td>
      <td>${o.date||'—'}</td>
      <td>
        <div class="action-btns">
          <button class="act-btn edit" onclick="openOrderStatus(${o.id})" title="Update Status"><i class="fa-solid fa-pen"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function filterOrders(status, el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderOrders(status || null);
}

function openOrderStatus(id) {
  const o = admin.orders.find(x => x.id === id);
  if (!o) return;
  setVal('editOrderId', id);
  setVal('orderStatusSelect', o.status || 'pending');
  openModal('orderStatusModal');
}

async function updateOrderStatus() {
  const id     = parseInt(document.getElementById('editOrderId')?.value);
  const status = document.getElementById('orderStatusSelect')?.value;
  if (!id || !status) return;

  try { await fetchAPI(`/orders/${id}/status/`, 'PATCH', { status }); } catch (_) {}

  const order = admin.orders.find(o => o.id === id);
  if (order) order.status = status;
  renderOrders();
  renderDashboard();
  closeModal('orderStatusModal');
  showToast(`Order status updated to "${status}" ✓`, 'success');
}

// ── CUSTOMERS ────────────────────────────────────────────────
function renderCustomers() {
  const body = document.getElementById('adminCustomersBody');
  if (!body) return;
  body.innerHTML = admin.customers.map(c => `
    <tr>
      <td class="td-name">${c.name}</td>
      <td style="font-size:13px;">${c.email}</td>
      <td style="font-size:13px;">${c.phone||'—'}</td>
      <td>${c.orders||0}</td>
      <td class="td-price">₹${(c.total_spent||0).toLocaleString()}</td>
      <td style="font-size:12px;color:var(--text-muted);">${c.joined||'—'}</td>
      <td>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;">
          <input type="checkbox" ${c.is_admin?'checked':''} onchange="toggleAdminFlag(${c.id},this.checked)" style="accent-color:var(--navy);" />
          Admin
        </label>
      </td>
    </tr>`).join('');
}

async function toggleAdminFlag(id, val) {
  try { await fetchAPI(`/customers/${id}/`, 'PATCH', { is_admin: val }); } catch (_) {}
  const c = admin.customers.find(x => x.id === id);
  if (c) c.is_admin = val;
  showToast(`Admin access ${val ? 'granted' : 'revoked'} ✓`, 'success');
}

// ── BANNERS ──────────────────────────────────────────────────
function renderBanners() {
  const grid = document.getElementById('bannersGrid');
  if (!grid) return;
  if (!admin.banners.length) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">No banners yet. Add your first banner.</div>';
    return;
  }
  grid.innerHTML = admin.banners.map(b => `
    <div class="banner-card">
      <img src="${b.image||''}" alt="${b.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x140/F2EDE3/999?text=Banner'" />
      <div class="banner-card-info">
        <div class="banner-card-title">${b.title}</div>
        <div class="banner-card-meta">
          <span style="text-transform:capitalize;color:var(--gold-dark);">${b.position}</span>
          &nbsp;·&nbsp;
          <span class="status-tag ${b.status||'active'}" style="font-size:9px;">${b.status||'active'}</span>
        </div>
        <div class="banner-card-actions">
          <button class="btn btn-sm btn-outline" onclick="openBannerModal(${b.id})"><i class="fa-solid fa-pen"></i> Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBanner(${b.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

function openBannerModal(id) {
  admin.editingBannerId = id || null;
  if (id) {
    const b = admin.banners.find(x => x.id === id);
    if (!b) return;
    setVal('editBannerId', id);
    setVal('bTitle',    b.title||'');
    setVal('bImage',    b.image||'');
    setVal('bLink',     b.link||'');
    setVal('bPosition', b.position||'hero');
  } else {
    ['editBannerId','bTitle','bImage','bLink'].forEach(i => setVal(i,''));
    setVal('bPosition','hero');
  }
  openModal('bannerModal');
}

function saveBanner() {
  const title = document.getElementById('bTitle')?.value.trim();
  if (!title) { showToast('Banner title is required', 'error'); return; }
  const data = {
    title,
    image:    document.getElementById('bImage')?.value||'',
    link:     document.getElementById('bLink')?.value||'',
    position: document.getElementById('bPosition')?.value||'hero',
    status:  'active',
  };
  const editId = admin.editingBannerId;
  if (editId) {
    const idx = admin.banners.findIndex(b => b.id === editId);
    if (idx >= 0) admin.banners[idx] = { ...admin.banners[idx], ...data };
    showToast('Banner updated ✓', 'success');
  } else {
    data.id = Date.now();
    admin.banners.push(data);
    showToast('Banner added ✓', 'success');
  }
  renderBanners();
  closeModal('bannerModal');
}

function deleteBanner(id) {
  if (!confirm('Delete this banner?')) return;
  admin.banners = admin.banners.filter(b => b.id !== id);
  renderBanners();
  showToast('Banner deleted.', 'success');
}

// ── COUPONS ──────────────────────────────────────────────────
function renderCoupons() {
  const grid = document.getElementById('couponsGrid');
  if (!grid) return;
  if (!admin.coupons.length) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">No coupons yet.</div>';
    return;
  }
  grid.innerHTML = admin.coupons.map(c => `
    <div class="coupon-card">
      <div>
        <div class="coupon-code">${c.code}</div>
        <div class="coupon-meta" style="margin-top:4px;">
          ${c.discount}% OFF · Min ₹${c.min_order} · ${c.used}/${c.max_uses} used · Expires ${c.expiry}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="status-tag ${c.active?'active':'inactive'}">${c.active?'Active':'Expired'}</span>
        <button class="act-btn del" onclick="deleteCoupon(${c.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function openCouponModal() {
  ['couCode','couDiscount','couMin','couMax','couExpiry'].forEach(id => setVal(id,''));
  openModal('couponModal');
}

function saveCoupon() {
  const code     = document.getElementById('couCode')?.value.trim().toUpperCase();
  const discount = parseInt(document.getElementById('couDiscount')?.value||'0');
  if (!code || !discount) { showToast('Code and discount % are required', 'error'); return; }
  const data = {
    id:        Date.now(),
    code,
    discount,
    min_order: parseInt(document.getElementById('couMin')?.value||'0'),
    max_uses:  parseInt(document.getElementById('couMax')?.value||'100'),
    used:      0,
    expiry:    document.getElementById('couExpiry')?.value || '',
    active:    true,
  };
  admin.coupons.push(data);
  renderCoupons();
  closeModal('couponModal');
  showToast(`Coupon "${code}" created ✓`, 'success');
}

function deleteCoupon(id) {
  if (!confirm('Delete this coupon?')) return;
  admin.coupons = admin.coupons.filter(c => c.id !== id);
  renderCoupons();
  showToast('Coupon deleted.', 'success');
}

// ── LOW STOCK ────────────────────────────────────────────────
function renderLowStock() {
  const body = document.getElementById('lowStockBody');
  if (!body) return;
  const lowItems = admin.products.filter(p => p.stock <= 5);

  if (!lowItems.length) {
    body.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:48px;color:var(--text-muted);">✓ All products are well-stocked</td></tr>';
    return;
  }

  body.innerHTML = lowItems.map(p => {
    const cls = p.stock === 0 ? 'zero' : 'low';
    const label = p.stock === 0 ? '✕ Out of Stock' : `⚠ Only ${p.stock} left`;
    return `<tr>
      <td class="td-name">${p.name}</td>
      <td class="td-cat">${p.category}</td>
      <td><span class="stock-badge ${cls}">${label}</span></td>
      <td><span class="status-tag ${p.status||'active'}">${p.status||'active'}</span></td>
      <td>
        <button class="btn btn-gold btn-sm" onclick="openProductModal(${p.id})">
          <i class="fa-solid fa-pen"></i> Restock
        </button>
      </td>
    </tr>`;
  }).join('');

  const badge = document.getElementById('lowStockBadge');
  if (badge) badge.textContent = lowItems.length;
}

// ── MODALS ────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

// ── TOAST ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  const toast  = document.getElementById('toast');
  const msgEl  = document.getElementById('toastMsg');
  const iconEl = document.getElementById('toastIcon');
  if (!toast) return;
  if (msgEl)  msgEl.textContent  = msg;
  if (iconEl) iconEl.textContent = type === 'success' ? '✓' : '✕';
  toast.style.background = type === 'success' ? 'var(--navy)' : '#C0392B';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── HELPERS ───────────────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}
