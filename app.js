/* =========================================
   TEMPLE3 – Sacred Streetwear
   E-Commerce Logic
   ========================================= */

// ─── PRODUCT DATA ────────────────────────────────────────────────────────────

const products = [
  {
    id: 1,
    name: "MENORAH OVERSIZED TEE",
    sub: "חולצת אוברסייז – מנורה",
    price: 249,
    badge: "BESTSELLER",
    desc: "חולצת אוברסייז כבדה 320gsm עם הדפס גרפי של מנורת המקדש שעוצבה בבינה מלאכותית. צבע שחור עמוק. הדפסה DTF מלאה. 100% כותנה פרמיום.",
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#d4a843",
    svgType: "menorah",
  },
  {
    id: 2,
    name: "CHERUBIM GRAPHIC TEE",
    sub: "חולצה גרפית – הכרובים",
    price: 219,
    badge: null,
    desc: "חולצת טי קצרה עם גרפיקת כרובים בסגנון סטריטוור עכשווי. הדפס חזה + גב מלא. בד premium 280gsm. נוחות מקסימלית.",
    sizes: ["XS","S","M","L","XL"],
    color: "#f5d080",
    svgType: "wings",
  },
  {
    id: 3,
    name: "TEMPLE GATES TEE",
    sub: "חולצה – שערי המקדש",
    price: 239,
    badge: "NEW",
    desc: "חולצת טי קצרה עם אמנות גנרטיבית של שערי קודש הקודשים. גרפיקת ארק מפורטת. 100% כותנה אורגנית 300gsm. חתוך ישר.",
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#a07830",
    svgType: "arch",
  },
  {
    id: 4,
    name: "ARK EDITION TEE",
    sub: "חולצה – ארון הברית",
    price: 259,
    badge: "LIMITED",
    desc: "חולצת טי קצרה עם ציור דיגיטלי מפורט של ארון הברית וכרובי הזהב. מהדורה מוגבלת 100 יחידות. הדפסה DTF כפולה חזה וגב.",
    sizes: ["S","M","L","XL"],
    color: "#d4a843",
    svgType: "ark",
  },
  {
    id: 5,
    name: "JERUSALEM SKYLINE TEE",
    sub: "חולצה – קו רקיע ירושלים",
    price: 229,
    badge: null,
    desc: "חולצת טי קצרה עם גרפיקת קו רקיע ירושלים הכוללת את בית המקדש השלם. עיצוב פנורמי. 280gsm בד כבד.",
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#c8a060",
    svgType: "skyline",
  },
  {
    id: 6,
    name: "SACRED SEAL TEE",
    sub: "חולצה – חותם שלמה",
    price: 219,
    badge: "NEW",
    desc: "חולצת טי קצרה עם חותם שלמה וגיאומטריה קדושה מבית המקדש. עיצוב מינימליסטי ועוצמתי. 280gsm כותנה פרמיום.",
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#d4a843",
    svgType: "star",
  },
];

// ─── SVG DESIGN INNER CONTENT ────────────────────────────────────────────────
// Each function returns SVG shapes only (no wrapper) for a defined coordinate space

function innerMenorah(c = "#d4a843") {
  return `
    <rect x="75" y="175" width="50" height="6" rx="3" fill="${c}"/>
    <rect x="85" y="158" width="30" height="18" rx="2" fill="${c}"/>
    <rect x="98" y="90" width="4" height="70" fill="${c}"/>
    <path d="M100 140 Q68 140 66 105" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 140 Q80 140 79 112" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 140 Q120 140 121 112" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 140 Q132 140 134 105" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="64" y="88" width="4" height="18" rx="2" fill="${c}"/>
    <rect x="77" y="94" width="4" height="18" rx="2" fill="${c}"/>
    <rect x="98" y="74" width="4" height="18" rx="2" fill="${c}"/>
    <rect x="119" y="94" width="4" height="18" rx="2" fill="${c}"/>
    <rect x="132" y="88" width="4" height="18" rx="2" fill="${c}"/>
    <ellipse cx="66" cy="85" rx="3" ry="5" fill="#f5d080" opacity="0.9"/>
    <ellipse cx="79" cy="91" rx="3" ry="5" fill="#f5d080" opacity="0.9"/>
    <ellipse cx="100" cy="71" rx="3" ry="5" fill="#f5d080" opacity="0.9"/>
    <ellipse cx="121" cy="91" rx="3" ry="5" fill="#f5d080" opacity="0.9"/>
    <ellipse cx="134" cy="85" rx="3" ry="5" fill="#f5d080" opacity="0.9"/>`;
}

function innerArch(c = "#a07830") {
  return `
    <rect x="30" y="110" width="20" height="80" fill="${c}"/>
    <rect x="150" y="110" width="20" height="80" fill="${c}"/>
    <path d="M30 110 Q30 30 100 30 Q170 30 170 110" fill="${c}" opacity="0.7"/>
    <path d="M50 120 Q50 55 100 55 Q150 55 150 120" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.6"/>
    <rect x="10" y="188" width="180" height="8" rx="2" fill="${c}"/>
    <circle cx="100" cy="75" r="18" fill="none" stroke="#f5d080" stroke-width="2.5" opacity="0.8"/>
    <polygon points="100,60 107,73 121,75 111,85 113,99 100,92 87,99 89,85 79,75 93,73" fill="#f5d080" opacity="0.7"/>`;
}

function innerWings(c = "#f5d080") {
  return `
    <path d="M110 80 Q60 20 10 40 Q40 60 60 100 Q80 90 110 80Z" fill="${c}" opacity="0.85"/>
    <path d="M110 80 Q80 30 30 55 Q55 70 75 105 Q90 92 110 80Z" fill="#f5d080" opacity="0.5"/>
    <path d="M110 80 Q160 20 210 40 Q180 60 160 100 Q140 90 110 80Z" fill="${c}" opacity="0.85"/>
    <path d="M110 80 Q140 30 190 55 Q165 70 145 105 Q130 92 110 80Z" fill="#f5d080" opacity="0.5"/>
    <ellipse cx="110" cy="90" rx="14" ry="18" fill="${c}"/>
    <ellipse cx="110" cy="86" rx="8" ry="10" fill="#f5d080" opacity="0.6"/>`;
}

function innerArk(c = "#d4a843") {
  return `
    <rect x="25" y="70" width="150" height="90" rx="4" fill="${c}" opacity="0.9"/>
    <rect x="25" y="60" width="150" height="18" rx="3" fill="#f5d080" opacity="0.9"/>
    <rect x="15" y="155" width="170" height="12" rx="3" fill="${c}"/>
    <rect x="35" y="90" width="12" height="55" rx="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="94" y="90" width="12" height="55" rx="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="153" y="90" width="12" height="55" rx="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="0" y="108" width="200" height="8" rx="4" fill="#a07830"/>
    <path d="M55 60 Q30 20 10 35 Q30 45 45 68Z" fill="#f5d080" opacity="0.75"/>
    <ellipse cx="55" cy="58" rx="10" ry="12" fill="#f5d080" opacity="0.9"/>
    <path d="M145 60 Q170 20 190 35 Q170 45 155 68Z" fill="#f5d080" opacity="0.75"/>
    <ellipse cx="145" cy="58" rx="10" ry="12" fill="#f5d080" opacity="0.9"/>`;
}

function innerSkyline(c = "#c8a060") {
  return `
    <rect x="40" y="110" width="200" height="15" fill="${c}" opacity="0.9"/>
    <rect x="95" y="65" width="90" height="50" fill="${c}"/>
    <rect x="100" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="116" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="132" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="148" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="164" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="90" y="58" width="100" height="10" fill="#f5d080" opacity="0.9"/>
    <polygon points="90,58 140,28 190,58" fill="${c}"/>
    <rect x="55" y="85" width="45" height="30" fill="${c}" opacity="0.7"/>
    <rect x="180" y="80" width="50" height="35" fill="${c}" opacity="0.7"/>
    <rect x="10" y="122" width="260" height="12" fill="${c}" opacity="0.5"/>
    <circle cx="30" cy="35" r="2" fill="#f5d080" opacity="0.6"/>
    <circle cx="250" cy="25" r="2" fill="#f5d080" opacity="0.6"/>
    <circle cx="140" cy="15" r="3" fill="#f5d080" opacity="0.8"/>`;
}

function innerStar(c = "#d4a843") {
  return `
    <polygon points="100,20 115,68 165,68 125,98 140,148 100,118 60,148 75,98 35,68 85,68"
      fill="none" stroke="${c}" stroke-width="2.5" opacity="0.9"/>
    <polygon points="100,45 128,95 72,95" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.7"/>
    <polygon points="100,155 72,105 128,105" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.7"/>
    <circle cx="100" cy="100" r="75" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.35" stroke-dasharray="4 4"/>
    <circle cx="100" cy="100" r="55" fill="none" stroke="${c}" stroke-width="1" opacity="0.25" stroke-dasharray="2 6"/>
    <circle cx="100" cy="100" r="8" fill="${c}" opacity="0.8"/>
    <circle cx="100" cy="25" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="168" cy="62" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="168" cy="138" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="100" cy="175" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="32" cy="138" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="32" cy="62" r="3" fill="#f5d080" opacity="0.6"/>`;
}

// ─── T-SHIRT MOCKUP GENERATOR ────────────────────────────────────────────────

function getDesignInner(svgType, color) {
  switch (svgType) {
    case "menorah":  return { inner: innerMenorah(color), vb: "0 0 200 200" };
    case "arch":     return { inner: innerArch(color),    vb: "0 0 200 200" };
    case "wings":    return { inner: innerWings(color),   vb: "0 0 220 160" };
    case "ark":      return { inner: innerArk(color),     vb: "0 0 200 180" };
    case "skyline":  return { inner: innerSkyline(color), vb: "0 0 280 160" };
    case "star":     return { inner: innerStar(color),    vb: "0 0 200 200" };
    default:         return { inner: innerMenorah(color), vb: "0 0 200 200" };
  }
}

function getProductSVG(svgType, color, size = 200) {
  const uid = Math.random().toString(36).slice(2, 8);
  const { inner, vb } = getDesignInner(svgType, color);

  // Chest area: x=82 y=108 w=136 h=136 within the 300×360 shirt viewBox
  return `<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="sb_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#101010"/>
        <stop offset="38%"  stop-color="#1d1d1d"/>
        <stop offset="62%"  stop-color="#1d1d1d"/>
        <stop offset="100%" stop-color="#101010"/>
      </linearGradient>
      <linearGradient id="sl_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#181818"/>
        <stop offset="100%" stop-color="#0c0c0c"/>
      </linearGradient>
      <filter id="ds_${uid}" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <clipPath id="cc_${uid}">
        <rect x="82" y="108" width="136" height="136" rx="2"/>
      </clipPath>
    </defs>

    <!-- Shirt body with drop shadow -->
    <g filter="url(#ds_${uid})">
      <path d="M 107 28 C 123 60 177 60 193 28
               L 234 41 L 278 57 L 269 99 L 243 111
               L 245 234 L 241 346 Q 150 354 59 346
               L 55 234 L 57 111 L 31 99 L 22 57
               L 66 41 Z"
        fill="url(#sb_${uid})"/>
    </g>

    <!-- Left sleeve fill -->
    <path d="M 66 41 L 22 57 L 31 99 L 57 111 Z" fill="url(#sl_${uid})"/>
    <!-- Right sleeve fill -->
    <path d="M 234 41 L 278 57 L 269 99 L 243 111 Z" fill="url(#sl_${uid})"/>

    <!-- Seam lines -->
    <path d="M 110 32 C 125 54 175 54 190 32"
      fill="none" stroke="#2c2c2c" stroke-width="1.8"/>
    <line x1="57" y1="111" x2="31" y2="99" stroke="#1e1e1e" stroke-width="1.2"/>
    <line x1="243" y1="111" x2="269" y2="99" stroke="#1e1e1e" stroke-width="1.2"/>

    <!-- Side shadow strips -->
    <line x1="59" y1="346" x2="55" y2="111" stroke="rgba(0,0,0,0.22)" stroke-width="5"/>
    <line x1="241" y1="346" x2="245" y2="111" stroke="rgba(0,0,0,0.22)" stroke-width="5"/>

    <!-- Centre highlight -->
    <path d="M 143 111 L 141 346" stroke="rgba(255,255,255,0.028)" stroke-width="14"/>

    <!-- Hem line -->
    <path d="M 59 346 Q 150 354 241 346"
      fill="none" stroke="#272727" stroke-width="1.5"/>

    <!-- Design printed on chest (nested SVG keeps its own coordinate space) -->
    <g clip-path="url(#cc_${uid})">
      <svg x="82" y="108" width="136" height="136" viewBox="${vb}" overflow="visible">
        ${inner}
      </svg>
    </g>

    <!-- Brand label under design -->
    <text x="150" y="282" text-anchor="middle"
      font-family="Cinzel, serif" font-size="8" fill="${color}"
      opacity="0.5" letter-spacing="4">TEMPLE3</text>
  </svg>`;
}

// ─── CART STATE ───────────────────────────────────────────────────────────────

let cart = [];

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  document.getElementById("cartBadge").textContent = getCartCount();
}

function addToCart(product, size) {
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, size, qty: 1 });
  }
  updateCartBadge();
  renderCartItems();
  showToast(`${product.name} נוסף לעגלה`);
  closeModal();
}

function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  updateCartBadge();
  renderCartItems();
}

function changeQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id, size);
  else {
    updateCartBadge();
    renderCartItems();
  }
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
  const totalEl = document.getElementById("cartTotal");

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">העגלה ריקה</p>';
    footer.style.display = "none";
    return;
  }

  footer.style.display = "block";
  totalEl.textContent = `₪${getCartTotal().toLocaleString()}`;

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${getProductSVG(item.svgType, item.color, 55)}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">מידה: ${item.size}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, '${item.size}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, '${item.size}', 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">הסר</button>
        </div>
      </div>
      <div class="cart-item-price">₪${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join("");
}

// ─── CART TOGGLE ──────────────────────────────────────────────────────────────

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  const isOpen = sidebar.classList.contains("open");
  sidebar.classList.toggle("open", !isOpen);
  overlay.classList.toggle("open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
}

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────

let selectedSize = null;

function openModal(product) {
  selectedSize = product.sizes.length === 1 ? product.sizes[0] : null;
  const modal = document.getElementById("productModal");
  const overlay = document.getElementById("modalOverlay");
  const inner = document.getElementById("modalInner");

  inner.innerHTML = `
    <div class="modal-img">
      ${getProductSVG(product.svgType, product.color, 220)}
    </div>
    <div class="modal-details">
      <p class="section-sub">${product.sub}</p>
      <h2 class="modal-title">${product.name}</h2>
      <div class="modal-price">₪${product.price.toLocaleString()}</div>
      <p class="modal-desc">${product.desc}</p>
      <div>
        <p class="size-label">בחר מידה</p>
        <div class="size-grid" id="sizeGrid">
          ${product.sizes.map(s => `
            <button class="size-option ${selectedSize === s ? 'selected' : ''}"
              onclick="selectSize('${s}', this)">${s}</button>
          `).join("")}
        </div>
      </div>
      <button class="btn-add" onclick="handleAddToCart(${product.id})">
        הוסף לעגלה
      </button>
    </div>
  `;

  modal.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function selectSize(size, el) {
  selectedSize = size;
  document.querySelectorAll(".size-option").forEach(b => b.classList.remove("selected"));
  el.classList.add("selected");
}

function handleAddToCart(productId) {
  if (!selectedSize) {
    showToast("אנא בחר מידה");
    return;
  }
  const product = products.find(p => p.id === productId);
  addToCart(product, selectedSize);
}

function closeModal() {
  document.getElementById("productModal").classList.remove("open");
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  selectedSize = null;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

let toastTimer;

function showToast(msg) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ─── RENDER PRODUCTS ─────────────────────────────────────────────────────────

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image" onclick="openModal(products.find(x=>x.id===${p.id}))">
        ${getProductSVG(p.svgType, p.color, 180)}
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-sub">${p.sub}</div>
        <div class="product-price-row">
          <span class="product-price">₪${p.price.toLocaleString()}</span>
          <span class="product-sizes-label">${p.sizes.slice(0,5).join(" · ")}</span>
        </div>
        <button class="btn-card-cta" onclick="openModal(products.find(x=>x.id===${p.id}))">
          בחר מידה והוסף לעגלה
        </button>
      </div>
    </div>
  `).join("");
}

// ─── NAVBAR SCROLL EFFECT ─────────────────────────────────────────────────────

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 80) {
    nav.style.borderBottomColor = "rgba(212,168,67,0.3)";
  } else {
    nav.style.borderBottomColor = "rgba(212,168,67,0.15)";
  }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartBadge();

  // Keyboard close modal
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      if (document.getElementById("cartSidebar").classList.contains("open")) {
        toggleCart();
      }
    }
  });
});
