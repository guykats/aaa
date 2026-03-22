/* ================================================
   TEMPLE3 – Checkout (Stripe Payment Element)
   ================================================ */

let stripeInstance   = null;
let stripeElements   = null;
let checkoutSnapshot = [];   // cart copy at checkout open time

// ── Bootstrap ──────────────────────────────────────
async function initCheckout() {
  const { publishableKey } = await fetch('/api/config').then(r => r.json());
  if (!publishableKey) {
    console.warn('Stripe publishable key not configured');
    return;
  }
  stripeInstance = Stripe(publishableKey);  // Stripe.js loaded via <script>
}

// ── Open checkout modal ────────────────────────────
async function openCheckout() {
  if (!cart?.length) return;

  checkoutSnapshot = cart.map(i => ({
    id: i.id, name: i.name, price: i.price, size: i.size, qty: i.qty,
  }));

  document.getElementById('checkoutOverlay').classList.add('open');
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('checkoutError').textContent = '';
  document.getElementById('checkoutSuccess').classList.add('hidden');
  document.getElementById('checkoutFormWrap').classList.remove('hidden');

  renderCheckoutSummary();
  await mountStripeElement();
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Order summary ──────────────────────────────────
function renderCheckoutSummary() {
  const subtotal  = checkoutSnapshot.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal >= 300 ? 0 : 35;
  const total     = subtotal + shipping;

  document.getElementById('coSummaryItems').innerHTML =
    checkoutSnapshot.map(i => `
      <div class="co-row">
        <span>${i.name} · ${i.size} × ${i.qty}</span>
        <span>₪${(i.price * i.qty).toLocaleString()}</span>
      </div>`).join('');

  document.getElementById('coShipping').textContent =
    shipping === 0 ? 'חינם' : `₪${shipping}`;
  document.getElementById('coTotal').textContent = `₪${total.toLocaleString()}`;
  document.getElementById('coPayBtn').textContent = `שלם ₪${total.toLocaleString()}`;
}

// ── Mount Stripe Payment Element ───────────────────
async function mountStripeElement() {
  if (!stripeInstance) return;

  const subtotal     = checkoutSnapshot.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping     = subtotal >= 300 ? 0 : 35;
  const totalAgorot  = (subtotal + shipping) * 100;

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary:     '#d4a843',
      colorBackground:  '#181818',
      colorText:        '#e0dbd0',
      colorTextSecondary: '#a09a90',
      colorDanger:      '#e74c3c',
      fontFamily:       'Heebo, sans-serif',
      borderRadius:     '6px',
      spacingUnit:      '4px',
    },
    rules: {
      '.Input': { border: '1px solid #2e2e2e', backgroundColor: '#181818' },
      '.Input:focus': { border: '1px solid #d4a843', boxShadow: 'none' },
      '.Label': { color: '#a09a90', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' },
    },
  };

  stripeElements = stripeInstance.elements({
    mode:       'payment',
    amount:     totalAgorot,
    currency:   'ils',
    appearance,
  });

  const paymentEl = stripeElements.create('payment', { layout: 'tabs' });
  const container = document.getElementById('stripePaymentEl');
  container.innerHTML = '';
  paymentEl.mount(container);
}

// ── Submit checkout ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCheckout();

  document.getElementById('checkoutForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    await submitCheckout();
  });

  document.getElementById('checkoutOverlay')?.addEventListener('click', closeCheckout);
});

async function submitCheckout() {
  const btn = document.getElementById('coPayBtn');
  const errEl = document.getElementById('checkoutError');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'מעבד...';

  try {
    // 1. Validate the Stripe Element
    const { error: submitErr } = await stripeElements.submit();
    if (submitErr) throw new Error(submitErr.message);

    // 2. Collect shipping details from form
    const f = document.getElementById('checkoutForm');
    const shipping = {
      name:    f.querySelector('#co-name').value.trim(),
      address: f.querySelector('#co-address').value.trim(),
      city:    f.querySelector('#co-city').value.trim(),
      zip:     f.querySelector('#co-zip').value.trim(),
      country: f.querySelector('#co-country').value,
      phone:   f.querySelector('#co-phone').value.trim(),
    };
    const email = f.querySelector('#co-email').value.trim();

    // 3. Create PaymentIntent on our server
    const resp = await fetch('/api/create-payment-intent', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ cart: checkoutSnapshot, shipping, email }),
    });
    const { clientSecret, error: serverErr } = await resp.json();
    if (serverErr) throw new Error(serverErr);

    // 4. Confirm payment (redirects to success.html on 3DS or completes inline)
    const { error: confirmErr } = await stripeInstance.confirmPayment({
      elements:      stripeElements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success.html`,
        payment_method_data: {
          billing_details: { name: shipping.name, email },
        },
      },
    });

    if (confirmErr) throw new Error(confirmErr.message);
    // If no redirect was needed, show inline success
    showCheckoutSuccess();

  } catch (err) {
    errEl.textContent = err.message;
    btn.disabled = false;
    renderCheckoutSummary(); // restore button text
  }
}

function showCheckoutSuccess() {
  document.getElementById('checkoutFormWrap').classList.add('hidden');
  document.getElementById('checkoutSuccess').classList.remove('hidden');
  // Clear the cart
  cart = [];
  updateCartBadge();
  renderCartItems();
}
