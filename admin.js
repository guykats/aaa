'use strict';
/* ================================================
   TEMPLE3 – Admin Panel Logic
   ================================================ */

// ─── CONFIG ──────────────────────────────────────
const ADMIN_PASS  = 'temple3';
const STORAGE_KEY = 't3_products';
const AUTH_KEY    = 't3_auth';
const ALL_SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SVG_TYPES   = ['menorah', 'arch', 'wings', 'ark', 'skyline', 'star'];
const SVG_LABELS  = {
  menorah: 'מנורה', arch: 'שערים', wings: 'כרובים',
  ark: 'ארון', skyline: 'ירושלים', star: 'חותם'
};
const BADGES = ['BESTSELLER', 'NEW', 'LIMITED', 'SALE', 'COLLAB', 'PRE-ORDER'];

// ─── STATE ───────────────────────────────────────
let allProducts    = [];
let currentId      = null;
let pendingDelete  = null;
let previewTimer   = null;
// mutable state for current edit session
let editSizes      = [];
let editColors     = [];
let editImages     = [];  // [{url, alt}]
let editLogoImg    = null;
let editLogoPlac   = 'front';
let editGraphicImg = null;
let editGraphicPlac = 'front';
let editBadge      = null;
let editSvgType    = 'menorah';
let editFeatured   = false;

// ─── DEFAULT PRODUCT DATA ────────────────────────
const DEFAULT_PRODUCTS = [
  { id:1, name:'MENORAH OVERSIZED TEE', sub:'חולצת אוברסייז – מנורה', price:249, comparePrice:null,
    badge:'BESTSELLER', status:'active', featured:true,
    desc:'חולצת אוברסייז כבדה 320gsm עם הדפס גרפי של מנורת המקדש שעוצבה בבינה מלאכותית. צבע שחור עמוק. הדפסה DTF מלאה. 100% כותנה פרמיום.',
    material:'100% Cotton', gsm:320, fitType:'Oversized', careInstructions:'כביסה קרה. אל תכנס למייבש.',
    printMethod:'DTF', gender:'Unisex', collection:'FW24',
    sizes:['XS','S','M','L','XL','XXL'], colors:[{name:'שחור',hex:'#111111'}],
    svgType:'menorah', color:'#d4a843', logoImage:null, logoPlacement:'front', graphicImage:null, graphicPlacement:'front',
    images:[], seoTitle:'Menorah Oversized Tee – TEMPLE3',
    seoDesc:'חולצת אוברסייז פרמיום עם הדפס מנורת המקדש. 320GSM, 100% כותנה.',
    slug:'menorah-oversized-tee', notes:'' },
  { id:2, name:'CHERUBIM GRAPHIC TEE', sub:'חולצה גרפית – הכרובים', price:219, comparePrice:null,
    badge:null, status:'active', featured:false,
    desc:'חולצת טי קצרה עם גרפיקת כרובים בסגנון סטריטוור עכשווי. הדפס חזה + גב מלא. בד premium 280gsm.',
    material:'100% Cotton', gsm:280, fitType:'Regular', careInstructions:'כביסה קרה. לאחסן מקופל.',
    printMethod:'Screen Print', gender:'Unisex', collection:'FW24',
    sizes:['XS','S','M','L','XL'], colors:[{name:'שחור',hex:'#111111'}],
    svgType:'wings', color:'#f5d080', logoImage:null, logoPlacement:'front', graphicImage:null, graphicPlacement:'front',
    images:[], seoTitle:'Cherubim Graphic Tee – TEMPLE3', seoDesc:'', slug:'cherubim-graphic-tee', notes:'' },
  { id:3, name:'TEMPLE GATES TEE', sub:'חולצה – שערי המקדש', price:239, comparePrice:null,
    badge:'NEW', status:'active', featured:false,
    desc:'חולצת טי קצרה עם אמנות גנרטיבית של שערי קודש הקודשים. 100% כותנה אורגנית 300gsm.',
    material:'100% Organic Cotton', gsm:300, fitType:'Regular', careInstructions:'כביסה קרה בלבד.',
    printMethod:'DTF', gender:'Unisex', collection:'FW24',
    sizes:['XS','S','M','L','XL','XXL'], colors:[{name:'שחור',hex:'#111111'}],
    svgType:'arch', color:'#a07830', logoImage:null, logoPlacement:'front', graphicImage:null, graphicPlacement:'front',
    images:[], seoTitle:'Temple Gates Tee – TEMPLE3', seoDesc:'', slug:'temple-gates-tee', notes:'' },
  { id:4, name:'ARK EDITION TEE', sub:'חולצה – ארון הברית', price:259, comparePrice:null,
    badge:'LIMITED', status:'active', featured:true,
    desc:'חולצת טי קצרה עם ציור דיגיטלי מפורט של ארון הברית וכרובי הזהב. מהדורה מוגבלת 100 יחידות.',
    material:'100% Cotton', gsm:300, fitType:'Regular', careInstructions:'כביסה יד בלבד.',
    printMethod:'DTF', gender:'Unisex', collection:'FW24',
    sizes:['S','M','L','XL'], colors:[{name:'שחור',hex:'#111111'}],
    svgType:'ark', color:'#d4a843', logoImage:null, logoPlacement:'front', graphicImage:null, graphicPlacement:'front',
    images:[], seoTitle:'Ark Edition Tee – TEMPLE3', seoDesc:'', slug:'ark-edition-tee', notes:'' },
  { id:5, name:'JERUSALEM SKYLINE TEE', sub:'חולצה – קו רקיע ירושלים', price:229, comparePrice:null,
    badge:null, status:'active', featured:false,
    desc:'חולצת טי קצרה עם גרפיקת קו רקיע ירושלים הכוללת את בית המקדש השלם. 280gsm.',
    material:'100% Cotton', gsm:280, fitType:'Regular', careInstructions:'כביסה קרה.',
    printMethod:'Screen Print', gender:'Unisex', collection:'FW24',
    sizes:['XS','S','M','L','XL','XXL'], colors:[{name:'שחור',hex:'#111111'}],
    svgType:'skyline', color:'#c8a060', logoImage:null, logoPlacement:'front', graphicImage:null, graphicPlacement:'front',
    images:[], seoTitle:'Jerusalem Skyline Tee – TEMPLE3', seoDesc:'', slug:'jerusalem-skyline-tee', notes:'' },
  { id:6, name:'SACRED SEAL TEE', sub:'חולצה – חותם שלמה', price:219, comparePrice:null,
    badge:'NEW', status:'active', featured:false,
    desc:'חולצת טי קצרה עם חותם שלמה וגיאומטריה קדושה מבית המקדש. 280gsm כותנה פרמיום.',
    material:'100% Cotton', gsm:280, fitType:'Regular', careInstructions:'כביסה קרה.',
    printMethod:'Screen Print', gender:'Unisex', collection:'FW24',
    sizes:['XS','S','M','L','XL','XXL'], colors:[{name:'שחור',hex:'#111111'}],
    svgType:'star', color:'#d4a843', logoImage:null, logoPlacement:'front', graphicImage:null, graphicPlacement:'front',
    images:[], seoTitle:'Sacred Seal Tee – TEMPLE3', seoDesc:'', slug:'sacred-seal-tee', notes:'' },
];

// ─── SVG FUNCTIONS (identical to app.js) ─────────
function innerMenorah(c = '#d4a843') {
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
function innerArch(c = '#a07830') {
  return `
    <rect x="30" y="110" width="20" height="80" fill="${c}"/>
    <rect x="150" y="110" width="20" height="80" fill="${c}"/>
    <path d="M30 110 Q30 30 100 30 Q170 30 170 110" fill="${c}" opacity="0.7"/>
    <path d="M50 120 Q50 55 100 55 Q150 55 150 120" fill="none" stroke="#f5d080" stroke-width="2" opacity="0.6"/>
    <rect x="10" y="188" width="180" height="8" rx="2" fill="${c}"/>
    <circle cx="100" cy="75" r="18" fill="none" stroke="#f5d080" stroke-width="2.5" opacity="0.8"/>
    <polygon points="100,60 107,73 121,75 111,85 113,99 100,92 87,99 89,85 79,75 93,73" fill="#f5d080" opacity="0.7"/>`;
}
function innerWings(c = '#f5d080') {
  return `
    <path d="M110 80 Q60 20 10 40 Q40 60 60 100 Q80 90 110 80Z" fill="${c}" opacity="0.85"/>
    <path d="M110 80 Q80 30 30 55 Q55 70 75 105 Q90 92 110 80Z" fill="#f5d080" opacity="0.5"/>
    <path d="M110 80 Q160 20 210 40 Q180 60 160 100 Q140 90 110 80Z" fill="${c}" opacity="0.85"/>
    <path d="M110 80 Q140 30 190 55 Q165 70 145 105 Q130 92 110 80Z" fill="#f5d080" opacity="0.5"/>
    <ellipse cx="110" cy="90" rx="14" ry="18" fill="${c}"/>
    <ellipse cx="110" cy="86" rx="8" ry="10" fill="#f5d080" opacity="0.6"/>`;
}
function innerArk(c = '#d4a843') {
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
function innerSkyline(c = '#c8a060') {
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
function innerStar(c = '#d4a843') {
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
function getDesignInner(svgType, color) {
  const map = {
    menorah:  { fn: innerMenorah, vb: '0 0 200 200' },
    arch:     { fn: innerArch,    vb: '0 0 200 200' },
    wings:    { fn: innerWings,   vb: '0 0 220 160' },
    ark:      { fn: innerArk,     vb: '0 0 200 180' },
    skyline:  { fn: innerSkyline, vb: '0 0 280 160' },
    star:     { fn: innerStar,    vb: '0 0 200 200' },
  };
  const d = map[svgType] || map.menorah;
  return { inner: d.fn(color), vb: d.vb };
}
function getProductSVG(svgType, color, size = 200) {
  const uid = Math.random().toString(36).slice(2, 8);
  const { inner, vb } = getDesignInner(svgType, color);
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
    <g filter="url(#ds_${uid})">
      <path d="M 107 28 C 123 60 177 60 193 28 L 234 41 L 278 57 L 269 99 L 243 111 L 245 234 L 241 346 Q 150 354 59 346 L 55 234 L 57 111 L 31 99 L 22 57 L 66 41 Z"
        fill="url(#sb_${uid})"/>
    </g>
    <path d="M 66 41 L 22 57 L 31 99 L 57 111 Z" fill="url(#sl_${uid})"/>
    <path d="M 234 41 L 278 57 L 269 99 L 243 111 Z" fill="url(#sl_${uid})"/>
    <path d="M 110 32 C 125 54 175 54 190 32" fill="none" stroke="#2c2c2c" stroke-width="1.8"/>
    <line x1="57" y1="111" x2="31" y2="99" stroke="#1e1e1e" stroke-width="1.2"/>
    <line x1="243" y1="111" x2="269" y2="99" stroke="#1e1e1e" stroke-width="1.2"/>
    <line x1="59" y1="346" x2="55" y2="111" stroke="rgba(0,0,0,0.22)" stroke-width="5"/>
    <line x1="241" y1="346" x2="245" y2="111" stroke="rgba(0,0,0,0.22)" stroke-width="5"/>
    <path d="M 143 111 L 141 346" stroke="rgba(255,255,255,0.028)" stroke-width="14"/>
    <path d="M 59 346 Q 150 354 241 346" fill="none" stroke="#272727" stroke-width="1.5"/>
    <g clip-path="url(#cc_${uid})">
      <svg x="82" y="108" width="136" height="136" viewBox="${vb}" overflow="visible">
        ${inner}
      </svg>
    </g>
    <text x="150" y="282" text-anchor="middle" font-family="Cinzel, serif" font-size="8" fill="${color}" opacity="0.5" letter-spacing="4">TEMPLE3</text>
  </svg>`;
}

// ─── SHIRT PREVIEW WITH UPLOADED IMAGES ──────────
function getShirtPreview(logoImg, graphicImg, size = 190) {
  const uid = Math.random().toString(36).slice(2, 8);
  const showGraphicFront = !!(graphicImg && editGraphicPlac === 'front');
  const showLogoFront    = !!(logoImg    && editLogoPlac    === 'front');
  const showGraphicBack  = !!(graphicImg && editGraphicPlac === 'back');
  const showLogoBack     = !!(logoImg    && editLogoPlac    === 'back');

  let overlays = '';
  if (showGraphicFront && showLogoFront) {
    // Logo small at top-center, graphic fills main body below
    overlays += `<image href="${logoImg}" x="115" y="113" width="70" height="34" preserveAspectRatio="xMidYMid meet"/>`;
    overlays += `<image href="${graphicImg}" x="88" y="150" width="124" height="106" preserveAspectRatio="xMidYMid meet"/>`;
  } else if (showGraphicFront) {
    overlays += `<image href="${graphicImg}" x="82" y="108" width="136" height="136" clip-path="url(#cc_${uid})" preserveAspectRatio="xMidYMid meet"/>`;
  } else if (showLogoFront) {
    overlays += `<image href="${logoImg}" x="100" y="138" width="100" height="80" preserveAspectRatio="xMidYMid meet"/>`;
  }

  // Back-placement labels
  const backItems = [];
  if (showGraphicBack) backItems.push('גרפיקה – אחורה');
  if (showLogoBack)    backItems.push('לוגו – אחורה');
  backItems.forEach((label, i) => {
    overlays += `<text x="150" y="${262 + i * 14}" text-anchor="middle"
      font-family="Heebo,sans-serif" font-size="9" fill="#444">${label}</text>`;
  });

  // Empty-state placeholder
  if (!showGraphicFront && !showLogoFront) {
    overlays += `
      <rect x="88" y="118" width="124" height="124" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)"
        stroke-width="1" stroke-dasharray="4 4"/>
      <text x="150" y="173" text-anchor="middle"
        font-family="Heebo,sans-serif" font-size="9" fill="#383838">העלה לוגו</text>
      <text x="150" y="186" text-anchor="middle"
        font-family="Heebo,sans-serif" font-size="9" fill="#383838">או גרפיקה</text>`;
  }

  return `<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}">
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
    <g filter="url(#ds_${uid})">
      <path d="M 107 28 C 123 60 177 60 193 28 L 234 41 L 278 57 L 269 99 L 243 111 L 245 234 L 241 346 Q 150 354 59 346 L 55 234 L 57 111 L 31 99 L 22 57 L 66 41 Z"
        fill="url(#sb_${uid})"/>
    </g>
    <path d="M 66 41 L 22 57 L 31 99 L 57 111 Z" fill="url(#sl_${uid})"/>
    <path d="M 234 41 L 278 57 L 269 99 L 243 111 Z" fill="url(#sl_${uid})"/>
    <path d="M 110 32 C 125 54 175 54 190 32" fill="none" stroke="#2c2c2c" stroke-width="1.8"/>
    <line x1="57"  y1="111" x2="31"  y2="99"  stroke="#1e1e1e" stroke-width="1.2"/>
    <line x1="243" y1="111" x2="269" y2="99"  stroke="#1e1e1e" stroke-width="1.2"/>
    <line x1="59"  y1="346" x2="55"  y2="111" stroke="rgba(0,0,0,0.22)" stroke-width="5"/>
    <line x1="241" y1="346" x2="245" y2="111" stroke="rgba(0,0,0,0.22)" stroke-width="5"/>
    <path d="M 143 111 L 141 346" stroke="rgba(255,255,255,0.028)" stroke-width="14"/>
    <path d="M 59 346 Q 150 354 241 346" fill="none" stroke="#272727" stroke-width="1.5"/>
    ${overlays}
  </svg>`;
}

// ─── LOADING STATE ────────────────────────────────
let loadingCount = 0;
function showPreviewLoading() {
  loadingCount++;
  document.getElementById('previewLoadingBar')?.classList.remove('hidden');
  document.getElementById('previewShirt')?.classList.add('loading');
}
function hidePreviewLoading() {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    document.getElementById('previewLoadingBar')?.classList.add('hidden');
    document.getElementById('previewShirt')?.classList.remove('loading');
  }
}

// ─── AUTH ─────────────────────────────────────────
function checkAuth() {
  if (localStorage.getItem(AUTH_KEY) === '1') showAdmin();
}
function login() {
  const val = document.getElementById('passInput').value;
  const err = document.getElementById('loginErr');
  if (val === ADMIN_PASS) {
    localStorage.setItem(AUTH_KEY, '1');
    err.classList.add('hidden');
    showAdmin();
  } else {
    err.classList.remove('hidden');
    document.getElementById('passInput').value = '';
    document.getElementById('passInput').focus();
  }
}
function logout() {
  localStorage.removeItem(AUTH_KEY);
  location.reload();
}
function showAdmin() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminShell').classList.remove('hidden');
  loadProducts();
  renderSidebar();
}

// ─── PRODUCT CRUD ─────────────────────────────────
function loadProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  allProducts = stored
    ? JSON.parse(stored)
    : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}
function saveProductsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
}
async function syncProductsToServer() {
  const adminKey = localStorage.getItem('t3_admin_key');
  if (!adminKey) return; // server sync only when key is configured
  try {
    await fetch('/api/admin/save-products', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body:    JSON.stringify({ products: allProducts }),
    });
  } catch (e) { /* server not running – silent, localStorage is the source of truth */ }
}
function nextId() {
  return allProducts.length ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
}
function newEmptyProduct() {
  const id = nextId();
  return {
    id, name: 'מוצר חדש', sub: '', price: 249, comparePrice: null,
    badge: null, status: 'draft', featured: false,
    desc: '', material: '100% Cotton', gsm: 280, fitType: 'Oversized',
    careInstructions: 'כביסה קרה.', printMethod: 'DTF', gender: 'Unisex', collection: 'FW24',
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'שחור', hex: '#111111' }],
    svgType: 'menorah', color: '#d4a843',
    logoImage: null, logoPlacement: 'front', graphicImage: null, graphicPlacement: 'front',
    images: [],
    seoTitle: '', seoDesc: '', slug: '', notes: ''
  };
}

// ─── SIDEBAR ──────────────────────────────────────
function renderSidebar() {
  const el = document.getElementById('sidebarList');
  if (!allProducts.length) {
    el.innerHTML = '<p class="sidebar-empty">אין מוצרים עדיין</p>';
    return;
  }
  el.innerHTML = allProducts.map(p => `
    <div class="sidebar-item${p.id === currentId ? ' active' : ''}${p.status === 'draft' ? ' draft' : ''}"
         onclick="selectProduct(${p.id})">
      <div class="si-preview">${getProductSVG(p.svgType, p.color, 44)}</div>
      <div class="si-info">
        <div class="si-name">${escHtml(p.name)}</div>
        <div class="si-meta">
          <span class="si-price">₪${p.price}</span>
          ${p.badge ? `<span class="si-badge">${p.badge}</span>` : ''}
          ${p.status === 'draft' ? '<span class="si-draft">טיוטה</span>' : ''}
        </div>
      </div>
    </div>`).join('');
}

function selectProduct(id) {
  currentId = id;
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  renderSidebar();
  openEditor(p);
}

// ─── EDITOR ───────────────────────────────────────
function openEditor(p) {
  // Initialise mutable edit state from product
  editSizes        = [...p.sizes];
  editColors       = p.colors ? p.colors.map(c => ({...c})) : [{name:'שחור', hex:'#111111'}];
  editImages       = p.images ? p.images.map(i => ({...i})) : [];
  editLogoImg      = p.logoImage || null;
  editLogoPlac     = p.logoPlacement || 'front';
  editGraphicImg   = p.graphicImage || null;
  editGraphicPlac  = p.graphicPlacement || 'front';
  editBadge        = p.badge || null;
  editSvgType      = p.svgType || 'menorah';
  editFeatured     = !!p.featured;

  document.getElementById('editorEmpty').classList.add('hidden');
  const form = document.getElementById('editorForm');
  form.classList.remove('hidden');

  form.innerHTML = buildEditorHTML(p);
  bindEditorEvents(p);
  updatePreview();
}

function buildEditorHTML(p) {
  return `
  <!-- TOOLBAR -->
  <div class="editor-toolbar">
    <div class="toolbar-name-wrap">
      <input id="f-name" class="toolbar-name" type="text"
        placeholder="שם המוצר (באנגלית)" value="${escHtml(p.name)}" oninput="schedulePreview()"/>
    </div>
    <div class="toolbar-actions">
      <select id="f-status" class="status-select">
        <option value="active"${p.status==='active'?' selected':''}>פעיל</option>
        <option value="draft"${p.status==='draft'?' selected':''}>טיוטה</option>
      </select>
      <button class="btn-danger-sm" onclick="promptDelete(${p.id})">מחק</button>
      <button class="btn-save" onclick="saveProduct()">שמור שינויים</button>
    </div>
  </div>

  <!-- SECTIONS -->
  <div class="sections-wrap">

    <!-- 1. GENERAL -->
    ${buildSection('general', '📋', 'פרטים כלליים', `
      <div class="field-row">
        <label class="field-label">תת-כותרת (עברית)</label>
        <input id="f-sub" class="field-input" type="text" value="${escHtml(p.sub)}" oninput="schedulePreview()"/>
      </div>
      <div class="field-row-2">
        <div class="field-row">
          <label class="field-label">מחיר <span class="field-required">*</span></label>
          <div class="price-input-wrap">
            <span class="currency">₪</span>
            <input id="f-price" class="field-input" type="number" min="0" step="1" value="${p.price}" oninput="schedulePreview()"/>
          </div>
        </div>
        <div class="field-row">
          <label class="field-label">מחיר מקורי (מחוק)</label>
          <div class="price-input-wrap">
            <span class="currency">₪</span>
            <input id="f-compare-price" class="field-input" type="number" min="0" step="1"
              value="${p.comparePrice || ''}" placeholder="ריק = ללא" oninput="schedulePreview()"/>
          </div>
        </div>
      </div>
      <div class="field-row">
        <label class="field-label">תווית / BADGE</label>
        <div class="badge-chips" id="badgeChips">
          <div class="badge-chip none-chip${!editBadge?' active':''}" onclick="setBadge(null)">ללא</div>
          ${BADGES.map(b => `<div class="badge-chip${editBadge===b?' active':''}" onclick="setBadge('${b}')">${b}</div>`).join('')}
        </div>
        <input id="f-badge-custom" class="field-input" type="text" style="margin-top:0.4rem"
          placeholder="או כתוב תווית מותאמת..." value="${!BADGES.includes(p.badge) && p.badge ? p.badge : ''}"
          oninput="setBadge(this.value||null)"/>
      </div>
      <div class="toggle-row">
        <span class="toggle-label">מוצר מומלץ (Featured)</span>
        <label class="toggle-switch">
          <input type="checkbox" id="f-featured"${editFeatured?' checked':''} onchange="editFeatured=this.checked;schedulePreview()"/>
          <span class="toggle-track"></span>
          <span class="toggle-thumb"></span>
        </label>
      </div>
    `)}

    <!-- 2. DESCRIPTION -->
    ${buildSection('desc', '📝', 'תיאור ומפרט', `
      <div class="field-row">
        <label class="field-label">תיאור קצר</label>
        <textarea id="f-desc" class="field-textarea" rows="3" oninput="schedulePreview()">${escHtml(p.desc)}</textarea>
      </div>
      <div class="field-row-2">
        <div class="field-row">
          <label class="field-label">חומר / בד</label>
          <input id="f-material" class="field-input" type="text" value="${escHtml(p.material||'')}"/>
        </div>
        <div class="field-row">
          <label class="field-label">משקל GSM</label>
          <input id="f-gsm" class="field-input" type="number" min="100" max="500" value="${p.gsm||280}" placeholder="גרם/מ״ר"/>
        </div>
      </div>
      <div class="field-row-3">
        <div class="field-row">
          <label class="field-label">חיתוך / Fit</label>
          <select id="f-fit" class="field-select">
            ${['Oversized','Regular','Slim','Boxy','Relaxed'].map(f =>
              `<option${p.fitType===f?' selected':''}>${f}</option>`).join('')}
          </select>
        </div>
        <div class="field-row">
          <label class="field-label">שיטת הדפסה</label>
          <select id="f-print" class="field-select">
            ${['DTF','Screen Print','DTG','Embroidery','Puff Ink'].map(m =>
              `<option${p.printMethod===m?' selected':''}>${m}</option>`).join('')}
          </select>
        </div>
        <div class="field-row">
          <label class="field-label">מגדר</label>
          <select id="f-gender" class="field-select">
            ${['Unisex',"Men's","Women's",'Youth'].map(g =>
              `<option${p.gender===g?' selected':''}>${g}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field-row-2">
        <div class="field-row">
          <label class="field-label">קולקציה / Drop</label>
          <input id="f-collection" class="field-input" type="text" value="${escHtml(p.collection||'')}" placeholder="FW24, SS25, Drop 3..."/>
        </div>
        <div class="field-row">
          <label class="field-label">הוראות כביסה</label>
          <input id="f-care" class="field-input" type="text" value="${escHtml(p.careInstructions||'')}"/>
        </div>
      </div>
    `)}

    <!-- 3. SIZES & COLORS -->
    ${buildSection('variants', '📐', 'מידות וצבעים', `
      <div class="field-row">
        <label class="field-label">מידות זמינות</label>
        <div class="size-chips" id="sizeChips">
          ${ALL_SIZES.map(s => `
            <div class="size-chip${editSizes.includes(s)?' active':''}"
                 data-size="${s}" onclick="toggleSize('${s}',this)">${s}</div>`).join('')}
        </div>
      </div>
      <div class="field-row">
        <label class="field-label">גרסאות צבע</label>
        <div class="color-variants" id="colorVariants">
          ${renderColorVariantsHTML()}
        </div>
        <button class="btn-add-color" onclick="addColor()">+ הוסף צבע</button>
      </div>
    `)}

    <!-- 4. LOGO & GRAPHIC -->
    ${buildSection('media-design', '🖼', 'לוגו וגרפיקה', `
      <div class="field-row">
        <label class="field-label">לוגו מותג</label>
        <div class="asset-upload-row">
          <div class="asset-preview" id="logoPreview">
            ${editLogoImg
              ? `<img src="${editLogoImg}" alt="logo"/>`
              : '<span style="font-size:0.65rem;color:#666">אין לוגו</span>'}
          </div>
          <div class="asset-upload-controls">
            <label class="btn-upload-asset">
              העלה לוגו (PNG/SVG)
              <input type="file" accept="image/*" onchange="handleLogoUpload(event)"/>
            </label>
            ${editLogoImg ? `<button class="btn-clear-asset" onclick="clearLogo()">הסר לוגו</button>` : ''}
            <div class="placement-row">
              <span class="placement-label">מיקום:</span>
              <div class="placement-opts" id="logoPlacOpts">
                <div class="placement-opt${editLogoPlac==='front'?' active':''}"
                     onclick="setLogoPlac('front',this)">קדימה</div>
                <div class="placement-opt${editLogoPlac==='back'?' active':''}"
                     onclick="setLogoPlac('back',this)">אחורה</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="field-row">
        <label class="field-label">גרפיקה על החולצה</label>
        <div class="asset-upload-row">
          <div class="asset-preview" id="graphicPreview">
            ${editGraphicImg
              ? `<img src="${editGraphicImg}" alt="graphic"/>`
              : '<span style="font-size:0.65rem;color:#666">אין גרפיקה</span>'}
          </div>
          <div class="asset-upload-controls">
            <label class="btn-upload-asset">
              העלה גרפיקה (PNG/JPG/SVG)
              <input type="file" accept="image/*" onchange="handleGraphicUpload(event)"/>
            </label>
            ${editGraphicImg ? `<button class="btn-clear-asset" onclick="clearGraphic()">הסר גרפיקה</button>` : ''}
            <div class="placement-row">
              <span class="placement-label">מיקום:</span>
              <div class="placement-opts" id="graphicPlacOpts">
                <div class="placement-opt${editGraphicPlac==='front'?' active':''}"
                     onclick="setGraphicPlac('front',this)">קדימה</div>
                <div class="placement-opt${editGraphicPlac==='back'?' active':''}"
                     onclick="setGraphicPlac('back',this)">אחורה</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)}

    <!-- 6. PRODUCT IMAGES -->
    ${buildSection('images', '📷', 'תמונות מוצר', `
      <div class="field-row">
        <div class="upload-zone" id="imageDropZone">
          <input type="file" accept="image/*" multiple onchange="handleImageUpload(event)"/>
          <div class="upload-icon">⬆</div>
          <div class="upload-text">גרור תמונות לכאן או לחץ להעלאה</div>
          <div class="upload-hint">PNG, JPG, WEBP · מומלץ 800×800 ומעלה</div>
        </div>
        <div class="image-gallery" id="imageGallery">
          ${renderImageGalleryHTML()}
        </div>
      </div>
    `)}

    <!-- 7. SEO -->
    ${buildSection('seo', '🔍', 'SEO', `
      <div class="field-row">
        <label class="field-label">כותרת SEO <span id="seoTitleCount" class="char-count" style="display:inline;margin-right:0.5rem">0/60</span></label>
        <input id="f-seo-title" class="field-input" type="text" maxlength="80"
          value="${escHtml(p.seoTitle||'')}" oninput="updateCharCount('f-seo-title','seoTitleCount',60)"/>
      </div>
      <div class="field-row">
        <label class="field-label">תיאור SEO <span id="seoDescCount" class="char-count" style="display:inline;margin-right:0.5rem">0/160</span></label>
        <textarea id="f-seo-desc" class="field-textarea" rows="2" maxlength="200"
          oninput="updateCharCount('f-seo-desc','seoDescCount',160)">${escHtml(p.seoDesc||'')}</textarea>
      </div>
      <div class="field-row">
        <label class="field-label">URL Slug</label>
        <input id="f-slug" class="field-input" type="text" style="direction:ltr"
          value="${escHtml(p.slug||'')}" placeholder="my-product-slug"
          oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9-]/g,'-')"/>
        <span class="field-hint">temple3.co/products/<strong id="slugPreview">${p.slug||'...'}</strong></span>
      </div>
      <div id="seoPreviewBox" class="seo-preview">
        <div class="seo-preview-title">${escHtml(p.seoTitle||p.name)}</div>
        <div class="seo-preview-url">temple3.co/products/${p.slug||''}</div>
        <div class="seo-preview-desc">${escHtml(p.seoDesc||p.desc||'')}</div>
      </div>
    `)}

    <!-- 8. PRINTIFY -->
    ${buildSection('printify', '🖨', 'Printify', `
      <div class="field-row">
        <label class="field-label">Printify Product ID</label>
        <input id="f-printify-pid" class="field-input" type="text" style="direction:ltr"
          value="${escHtml(p.printifyProductId||'')}" placeholder="5f3b8e2b3aced40ac8c3b456..."/>
        <span class="field-hint">Printify → My Products → בחר מוצר → ID ב-URL</span>
      </div>
      <div class="field-row">
        <label class="field-label">Variant IDs לפי מידה</label>
        <div class="printify-variants">
          ${ALL_SIZES.map(size => `
            <div class="pv-row">
              <span class="pv-size">${size}</span>
              <input class="field-input pv-input" type="text" style="direction:ltr"
                data-psize="${size}"
                value="${escHtml((p.printifyVariants||{})[size]||'')}"
                placeholder="Variant ID"/>
            </div>`).join('')}
        </div>
        <span class="field-hint">Printify → My Products → מוצר → לחץ על variant → Copy ID</span>
      </div>
    `)}

    <!-- 9. INTERNAL NOTES -->
    ${buildSection('notes', '🗒', 'הערות פנימיות', `
      <div class="field-row">
        <label class="field-label">הערות (לא מוצגות לקונים)</label>
        <textarea id="f-notes" class="field-textarea" rows="3" placeholder="הערות לצוות, מידע על מלאי, עיצוב...">${escHtml(p.notes||'')}</textarea>
      </div>
    `)}

  </div>
  `;
}

function buildSection(id, icon, title, bodyHTML) {
  return `
  <div class="section-card" data-section="${id}">
    <div class="section-head" onclick="toggleSection('${id}')">
      <div class="section-head-left">
        <span class="section-icon">${icon}</span>
        <span class="section-title">${title}</span>
      </div>
      <span class="section-chevron">▾</span>
    </div>
    <div class="section-body">${bodyHTML}</div>
  </div>`;
}

function bindEditorEvents(p) {
  // Slug auto-generation from name
  document.getElementById('f-name').addEventListener('blur', function() {
    const slugEl = document.getElementById('f-slug');
    if (!slugEl.value) slugEl.value = toSlug(this.value);
    updateSeoPreview();
  });
  // SEO live preview
  ['f-seo-title','f-seo-desc','f-slug'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateSeoPreview);
  });
  // Init char counts
  updateCharCount('f-seo-title', 'seoTitleCount', 60);
  updateCharCount('f-seo-desc', 'seoDescCount', 160);

  // Drag-over styling for image drop zone
  const dz = document.getElementById('imageDropZone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
    dz.addEventListener('drop', e => {
      e.preventDefault();
      dz.classList.remove('drag-over');
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    });
  }
}

// ─── SECTION TOGGLE ───────────────────────────────
function toggleSection(id) {
  const card = document.querySelector(`.section-card[data-section="${id}"]`);
  if (card) card.classList.toggle('collapsed');
}

// ─── BADGE ────────────────────────────────────────
function setBadge(val) {
  editBadge = val;
  // Update chips
  document.querySelectorAll('#badgeChips .badge-chip').forEach(el => {
    el.classList.toggle('active',
      val === null ? el.classList.contains('none-chip') : el.textContent === val);
  });
  // If custom, clear standard chips
  if (val && !BADGES.includes(val)) {
    document.querySelectorAll('#badgeChips .badge-chip:not(.none-chip)').forEach(el => el.classList.remove('active'));
    document.querySelector('#badgeChips .none-chip').classList.remove('active');
  }
  schedulePreview();
}

// ─── SIZES ────────────────────────────────────────
function toggleSize(size, el) {
  const idx = editSizes.indexOf(size);
  if (idx >= 0) editSizes.splice(idx, 1);
  else editSizes.push(size);
  // Keep canonical order
  editSizes.sort((a,b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b));
  el.classList.toggle('active', editSizes.includes(size));
}

// ─── COLOR VARIANTS ───────────────────────────────
function renderColorVariantsHTML() {
  return editColors.map((c, i) => `
    <div class="color-variant-row" data-idx="${i}">
      <input type="color" class="color-swatch-input" value="${c.hex}"
             onchange="updateColorHex(${i},this.value)"/>
      <input type="text" class="color-name-input" value="${escHtml(c.name)}"
             placeholder="שם צבע..." onchange="updateColorName(${i},this.value)"/>
      <button class="btn-remove-color" onclick="removeColor(${i})" title="הסר">✕</button>
    </div>`).join('');
}
function refreshColorVariants() {
  const el = document.getElementById('colorVariants');
  if (el) el.innerHTML = renderColorVariantsHTML();
}
function addColor() {
  editColors.push({ name: 'צבע חדש', hex: '#333333' });
  refreshColorVariants();
}
function removeColor(i) {
  if (editColors.length <= 1) { showToast('חייב להיות לפחות צבע אחד', 'error'); return; }
  editColors.splice(i, 1);
  refreshColorVariants();
}
function updateColorHex(i, val) { editColors[i].hex = val; }
function updateColorName(i, val) { editColors[i].name = val; }

// ─── SVG TYPE ─────────────────────────────────────
function setSvgType(type, el) {
  editSvgType = type;
  document.querySelectorAll('.svg-type-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  schedulePreview();
}

// ─── DESIGN COLOR ─────────────────────────────────
function onDesignColorChange(val) {
  const hex = document.getElementById('f-color-hex');
  if (hex) hex.value = val;
  schedulePreview();
}
function onDesignHexChange(val) {
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    const picker = document.getElementById('f-color-picker');
    if (picker) picker.value = val;
    schedulePreview();
  }
}
function validateHex() {
  const hex = document.getElementById('f-color-hex');
  if (hex && !/^#[0-9a-fA-F]{6}$/.test(hex.value)) {
    hex.value = document.getElementById('f-color-picker').value;
  }
}

// ─── IMAGE UPLOAD ─────────────────────────────────
function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      editImages.push({ url: e.target.result, alt: file.name.replace(/\.[^.]+$/, '') });
      refreshImageGallery();
    };
    reader.readAsDataURL(file);
  });
}
function renderImageGalleryHTML() {
  if (!editImages.length) return '';
  return editImages.map((img, i) => `
    <div class="image-item-wrap">
      <div class="image-item">
        <img src="${img.url}" alt="${escHtml(img.alt)}"/>
        <div class="image-item-actions">
          <button class="btn-remove-img" onclick="removeImage(${i})" title="הסר">✕</button>
        </div>
      </div>
      <input class="image-alt-input" type="text" value="${escHtml(img.alt)}"
             placeholder="תיאור alt..." onchange="editImages[${i}].alt=this.value"/>
    </div>`).join('');
}
function refreshImageGallery() {
  const el = document.getElementById('imageGallery');
  if (el) el.innerHTML = renderImageGalleryHTML();
}
function removeImage(i) {
  editImages.splice(i, 1);
  refreshImageGallery();
}

// ─── LOGO / GRAPHIC UPLOAD ────────────────────────
function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  showPreviewLoading();
  const reader = new FileReader();
  reader.onload = e => {
    editLogoImg = e.target.result;
    const prev = document.getElementById('logoPreview');
    if (prev) prev.innerHTML = `<img src="${editLogoImg}" alt="logo"/>`;
    setTimeout(() => { hidePreviewLoading(); updatePreview(); }, 500);
  };
  reader.readAsDataURL(file);
}
function handleGraphicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  showPreviewLoading();
  const reader = new FileReader();
  reader.onload = e => {
    editGraphicImg = e.target.result;
    const prev = document.getElementById('graphicPreview');
    if (prev) prev.innerHTML = `<img src="${editGraphicImg}" alt="graphic"/>`;
    setTimeout(() => { hidePreviewLoading(); updatePreview(); }, 500);
  };
  reader.readAsDataURL(file);
}
function clearLogo() {
  editLogoImg = null;
  const prev = document.getElementById('logoPreview');
  if (prev) prev.innerHTML = '<span style="font-size:0.65rem;color:#666">אין לוגו</span>';
  updatePreview();
}
function clearGraphic() {
  editGraphicImg = null;
  const prev = document.getElementById('graphicPreview');
  if (prev) prev.innerHTML = '<span style="font-size:0.65rem;color:#666">אין גרפיקה</span>';
  updatePreview();
}
function setLogoPlac(val) {
  editLogoPlac = val;
  document.querySelectorAll('#logoPlacOpts .placement-opt').forEach(el => {
    el.classList.toggle('active', el.textContent.trim() === (val === 'front' ? 'קדימה' : 'אחורה'));
  });
  updatePreview();
}
function setGraphicPlac(val) {
  editGraphicPlac = val;
  document.querySelectorAll('#graphicPlacOpts .placement-opt').forEach(el => {
    el.classList.toggle('active', el.textContent.trim() === (val === 'front' ? 'קדימה' : 'אחורה'));
  });
  updatePreview();
}

// ─── SEO ─────────────────────────────────────────
function updateCharCount(fieldId, countId, limit) {
  const field = document.getElementById(fieldId);
  const count = document.getElementById(countId);
  if (!field || !count) return;
  const len = field.value.length;
  count.textContent = `${len}/${limit}`;
  count.className = 'char-count' + (len > limit ? ' over' : len > limit * 0.85 ? ' warn' : '');
}
function updateSeoPreview() {
  const title = document.getElementById('f-seo-title')?.value || '';
  const desc  = document.getElementById('f-seo-desc')?.value  || '';
  const slug  = document.getElementById('f-slug')?.value       || '';
  const box   = document.getElementById('seoPreviewBox');
  const slugPrev = document.getElementById('slugPreview');
  if (box) {
    box.querySelector('.seo-preview-title').textContent = title;
    box.querySelector('.seo-preview-url').textContent = `temple3.co/products/${slug}`;
    box.querySelector('.seo-preview-desc').textContent = desc;
  }
  if (slugPrev) slugPrev.textContent = slug || '...';
}

// ─── PREVIEW ─────────────────────────────────────
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 150);
}
function getFormSnapshot() {
  const v = id => document.getElementById(id)?.value || '';
  return {
    name:         v('f-name'),
    price:        parseInt(v('f-price')) || 0,
    comparePrice: parseInt(v('f-compare-price')) || null,
    badge:        editBadge,
    status:       v('f-status'),
    featured:     editFeatured,
  };
}
function updatePreview() {
  const snap    = getFormSnapshot();
  const shirtEl = document.getElementById('previewShirt');
  const metaEl  = document.getElementById('previewMeta');
  if (!shirtEl || !metaEl) return;
  shirtEl.innerHTML = getShirtPreview(editLogoImg, editGraphicImg, 190);
  metaEl.innerHTML = `
    <div class="pm-name">${escHtml(snap.name || 'שם מוצר')}</div>
    <div class="pm-price">₪${snap.price}</div>
    ${snap.comparePrice ? `<div class="pm-compare">₪${snap.comparePrice}</div>` : ''}
    ${snap.badge ? `<div class="pm-badge">${snap.badge}</div>` : ''}`;
}

// ─── SAVE ─────────────────────────────────────────
function saveProduct() {
  const v = id => document.getElementById(id)?.value?.trim() || '';
  const name = v('f-name');
  if (!name) { showToast('חובה להזין שם מוצר', 'error'); return; }
  const price = parseInt(v('f-price')) || 0;
  if (!price) { showToast('חובה להזין מחיר', 'error'); return; }
  if (!editSizes.length) { showToast('חובה לבחור לפחות מידה אחת', 'error'); return; }

  const idx = allProducts.findIndex(p => p.id === currentId);
  if (idx < 0) return;

  const existing = allProducts[idx];
  allProducts[idx] = {
    ...existing,
    name,
    sub:              v('f-sub'),
    price,
    comparePrice:     parseInt(v('f-compare-price')) || null,
    badge:            editBadge,
    status:           v('f-status') || 'active',
    featured:         editFeatured,
    desc:             v('f-desc') ? document.getElementById('f-desc').value.trim() : existing.desc,
    material:         v('f-material'),
    gsm:              parseInt(v('f-gsm')) || 280,
    fitType:          v('f-fit'),
    careInstructions: v('f-care'),
    printMethod:      v('f-print'),
    gender:           v('f-gender'),
    collection:       v('f-collection'),
    sizes:            [...editSizes],
    colors:           editColors.map(c => ({...c})),
    svgType:          editSvgType,
    color:            document.getElementById('f-color-picker')?.value || existing.color,
    logoImage:        editLogoImg,
    logoPlacement:    editLogoPlac,
    graphicImage:     editGraphicImg,
    graphicPlacement: editGraphicPlac,
    images:           editImages.map(i => ({...i})),
    seoTitle:         v('f-seo-title'),
    seoDesc:          document.getElementById('f-seo-desc')?.value?.trim() || '',
    slug:             v('f-slug') || toSlug(name),
    notes:            document.getElementById('f-notes')?.value?.trim() || '',
    printifyProductId: v('f-printify-pid'),
    printifyVariants: Object.fromEntries(
      Array.from(document.querySelectorAll('.pv-input[data-psize]'))
        .map(el => [el.dataset.psize, el.value.trim()])
        .filter(([, val]) => val)
    ),
    updatedAt:        new Date().toISOString(),
  };

  saveProductsToStorage();
  syncProductsToServer();
  renderSidebar();
  showToast('המוצר נשמר בהצלחה ✓', 'success');
}

function createNewProduct() {
  const p = newEmptyProduct();
  allProducts.push(p);
  saveProductsToStorage();
  currentId = p.id;
  renderSidebar();
  openEditor(p);
  showToast('מוצר חדש נוצר');
}

function promptDelete(id) {
  pendingDelete = id;
  document.getElementById('deleteOverlay').classList.remove('hidden');
}
function deleteProduct(id) {
  allProducts = allProducts.filter(p => p.id !== id);
  saveProductsToStorage();
  currentId = null;
  renderSidebar();
  document.getElementById('editorEmpty').classList.remove('hidden');
  document.getElementById('editorForm').classList.add('hidden');
  document.getElementById('previewShirt').innerHTML = '';
  document.getElementById('previewMeta').innerHTML = '';
  showToast('המוצר נמחק');
}

// ─── TOAST ────────────────────────────────────────
let toastTimer2;
function showToast(msg, type = '') {
  const el = document.getElementById('adminToast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'admin-toast' + (type ? ' ' + type : '') + ' show';
  clearTimeout(toastTimer2);
  toastTimer2 = setTimeout(() => el.classList.remove('show'), 2800);
}

// ─── HELPERS ──────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function toSlug(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('passInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('newProductBtn').addEventListener('click', createNewProduct);
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('deleteOverlay').classList.add('hidden');
    pendingDelete = null;
  });
  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (pendingDelete != null) deleteProduct(pendingDelete);
    document.getElementById('deleteOverlay').classList.add('hidden');
    pendingDelete = null;
  });

  // Close delete modal on overlay click
  document.getElementById('deleteOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.add('hidden');
      pendingDelete = null;
    }
  });
  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.getElementById('deleteOverlay').classList.add('hidden');
  });
});
