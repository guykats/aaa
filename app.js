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
    desc: "חולצת אוברסייז כבדה 320gsm עם הדפס גרפי של מנורת המקדש שעוצבה בבינה מלאכותית. צבע שחור עמוק. הדפסה DTF מלאה.",
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#d4a843",
    svgType: "menorah",
  },
  {
    id: 2,
    name: "HOLY OF HOLIES HOODIE",
    sub: "הודי – קודש הקודשים",
    price: 399,
    badge: "NEW",
    desc: "הודי פרמיום 400gsm עם אמנות גנרטיבית של קודש הקודשים. כיס קנגורו. קלוש רחב. 100% כותנה אורגנית.",
    sizes: ["S","M","L","XL","XXL"],
    color: "#a07830",
    svgType: "arch",
  },
  {
    id: 3,
    name: "CHERUBIM GRAPHIC TEE",
    sub: "חולצה – הכרובים",
    price: 219,
    badge: null,
    desc: "חולצה עם גרפיקת כרובים בסגנון עכשווי. הדפס חזה + גב מלא. בד premium 280gsm.",
    sizes: ["XS","S","M","L","XL"],
    color: "#f5d080",
    svgType: "wings",
  },
  {
    id: 4,
    name: "ARK OF THE COVENANT CREWNECK",
    sub: "קרוניק – ארון הברית",
    price: 349,
    badge: "LIMITED",
    desc: "קרוניק כבד 380gsm עם ציור דיגיטלי מפורט של ארון הברית. אדגינג זהב. מהדורה מוגבלת של 100 יחידות.",
    sizes: ["S","M","L","XL"],
    color: "#d4a843",
    svgType: "ark",
  },
  {
    id: 5,
    name: "JERUSALEM SKYLINE LONG-SLEEVE",
    sub: "שרוול ארוך – קו רקיע ירושלים",
    price: 279,
    badge: null,
    desc: "שרוול ארוך עם גרפיקת קו רקיע ירושלים שכוללת את בית המקדש השלם. רקמה על השרוול.",
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#c8a060",
    svgType: "skyline",
  },
  {
    id: 6,
    name: "SACRED GEOMETRY CAP",
    sub: "כובע – גיאומטריה קדושה",
    price: 159,
    badge: "NEW",
    desc: "כובע 6-פנל עם רקמת גיאומטריה קדושה מבית המקדש. בד ניילון כבד. מידת ראש מתכווננת.",
    sizes: ["ONE SIZE"],
    color: "#d4a843",
    svgType: "star",
  },
];

// ─── SVG GENERATORS ───────────────────────────────────────────────────────────

function svgMenorah(color = "#d4a843", size = 200) {
  const c = color;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="mg${Math.random().toString(36).slice(2)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5d080"/>
        <stop offset="50%" stop-color="${c}"/>
        <stop offset="100%" stop-color="#a07830"/>
      </linearGradient>
    </defs>
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
    <ellipse cx="134" cy="85" rx="3" ry="5" fill="#f5d080" opacity="0.9"/>
  </svg>`;
}

function svgArch(color = "#a07830", size = 200) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect x="30" y="110" width="20" height="80" fill="${color}"/>
    <rect x="150" y="110" width="20" height="80" fill="${color}"/>
    <path d="M30 110 Q30 30 100 30 Q170 30 170 110" fill="${color}" opacity="0.7"/>
    <path d="M50 120 Q50 55 100 55 Q150 55 150 120" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.6"/>
    <rect x="10" y="188" width="180" height="8" rx="2" fill="${color}"/>
    <circle cx="100" cy="75" r="18" fill="none" stroke="#f5d080" stroke-width="2.5" opacity="0.8"/>
    <polygon points="100,60 107,73 121,75 111,85 113,99 100,92 87,99 89,85 79,75 93,73" fill="#f5d080" opacity="0.7"/>
  </svg>`;
}

function svgWings(color = "#f5d080", size = 200) {
  return `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <path d="M110 80 Q60 20 10 40 Q40 60 60 100 Q80 90 110 80Z" fill="${color}" opacity="0.85"/>
    <path d="M110 80 Q80 30 30 55 Q55 70 75 105 Q90 92 110 80Z" fill="#f5d080" opacity="0.5"/>
    <path d="M110 80 Q160 20 210 40 Q180 60 160 100 Q140 90 110 80Z" fill="${color}" opacity="0.85"/>
    <path d="M110 80 Q140 30 190 55 Q165 70 145 105 Q130 92 110 80Z" fill="#f5d080" opacity="0.5"/>
    <ellipse cx="110" cy="90" rx="14" ry="18" fill="${color}"/>
    <ellipse cx="110" cy="86" rx="8" ry="10" fill="#f5d080" opacity="0.6"/>
  </svg>`;
}

function svgArk(color = "#d4a843", size = 200) {
  return `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect x="25" y="70" width="150" height="90" rx="4" fill="${color}" opacity="0.9"/>
    <rect x="25" y="60" width="150" height="18" rx="3" fill="#f5d080" opacity="0.9"/>
    <rect x="15" y="155" width="170" height="12" rx="3" fill="${color}"/>
    <rect x="35" y="90" width="12" height="55" rx="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="94" y="90" width="12" height="55" rx="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="153" y="90" width="12" height="55" rx="2" fill="rgba(0,0,0,0.25)"/>
    <!-- carrying poles -->
    <rect x="0" y="108" width="200" height="8" rx="4" fill="#a07830"/>
    <!-- cherub left -->
    <path d="M55 60 Q30 20 10 35 Q30 45 45 68Z" fill="#f5d080" opacity="0.75"/>
    <ellipse cx="55" cy="58" rx="10" ry="12" fill="#f5d080" opacity="0.9"/>
    <!-- cherub right -->
    <path d="M145 60 Q170 20 190 35 Q170 45 155 68Z" fill="#f5d080" opacity="0.75"/>
    <ellipse cx="145" cy="58" rx="10" ry="12" fill="#f5d080" opacity="0.9"/>
  </svg>`;
}

function svgSkyline(color = "#c8a060", size = 200) {
  return `<svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <!-- Temple Mount platform -->
    <rect x="40" y="110" width="200" height="15" fill="${color}" opacity="0.9"/>
    <!-- Main temple structure -->
    <rect x="95" y="65" width="90" height="50" fill="${color}"/>
    <!-- Temple columns -->
    <rect x="100" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="116" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="132" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="148" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <rect x="164" y="70" width="8" height="45" fill="rgba(0,0,0,0.2)"/>
    <!-- Temple roof -->
    <rect x="90" y="58" width="100" height="10" fill="#f5d080" opacity="0.9"/>
    <!-- Triangle pediment -->
    <polygon points="90,58 140,28 190,58" fill="${color}"/>
    <!-- Side buildings -->
    <rect x="55" y="85" width="45" height="30" fill="${color}" opacity="0.7"/>
    <rect x="180" y="80" width="50" height="35" fill="${color}" opacity="0.7"/>
    <!-- City walls -->
    <rect x="10" y="122" width="260" height="12" fill="${color}" opacity="0.5"/>
    <!-- Stars -->
    <circle cx="30" cy="35" r="2" fill="#f5d080" opacity="0.6"/>
    <circle cx="250" cy="25" r="2" fill="#f5d080" opacity="0.6"/>
    <circle cx="140" cy="15" r="3" fill="#f5d080" opacity="0.8"/>
  </svg>`;
}

function svgStar(color = "#d4a843", size = 200) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <polygon points="100,20 115,68 165,68 125,98 140,148 100,118 60,148 75,98 35,68 85,68"
      fill="none" stroke="${color}" stroke-width="2.5" opacity="0.9"/>
    <!-- Star of David -->
    <polygon points="100,45 128,95 72,95" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.7"/>
    <polygon points="100,155 72,105 128,105" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.7"/>
    <!-- Outer ring -->
    <circle cx="100" cy="100" r="75" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.35" stroke-dasharray="4 4"/>
    <circle cx="100" cy="100" r="55" fill="none" stroke="${color}" stroke-width="1" opacity="0.25" stroke-dasharray="2 6"/>
    <!-- Center -->
    <circle cx="100" cy="100" r="8" fill="${color}" opacity="0.8"/>
    <!-- Corner decorations -->
    <circle cx="100" cy="25" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="168" cy="62" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="168" cy="138" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="100" cy="175" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="32" cy="138" r="3" fill="#f5d080" opacity="0.6"/>
    <circle cx="32" cy="62" r="3" fill="#f5d080" opacity="0.6"/>
  </svg>`;
}

function getProductSVG(svgType, color, size = 200) {
  switch (svgType) {
    case "menorah":  return svgMenorah(color, size);
    case "arch":     return svgArch(color, size);
    case "wings":    return svgWings(color, size);
    case "ark":      return svgArk(color, size);
    case "skyline":  return svgSkyline(color, size);
    case "star":     return svgStar(color, size);
    default:         return svgMenorah(color, size);
  }
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
    <div class="product-card" onclick="openModal(products.find(x=>x.id===${p.id}))">
      <div class="product-image">
        ${getProductSVG(p.svgType, p.color, 180)}
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
        <div class="product-overlay">
          <button class="overlay-btn" onclick="event.stopPropagation(); openModal(products.find(x=>x.id===${p.id}))">
            בחר מידה
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-sub">${p.sub}</div>
        <div class="product-footer">
          <span class="product-price">₪${p.price.toLocaleString()}</span>
          <div class="product-sizes">
            ${p.sizes.slice(0, 4).map(() => '<div class="size-dot"></div>').join("")}
          </div>
        </div>
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
