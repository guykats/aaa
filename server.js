/* ================================================
   TEMPLE3 – Backend Server
   Express · Stripe Checkout · Printify Orders
   ================================================ */

import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const port = process.env.PORT || 3000;

// Stripe initialisation – key is validated at startup
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌  STRIPE_SECRET_KEY is missing in .env');
  process.exit(1);
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── Middleware ────────────────────────────────────
// Keep raw body for Stripe webhook signature verification
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// ── Expose publishable key to frontend ───────────
app.get('/api/config', (_req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
});

// ── Products helper ───────────────────────────────
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

function readProducts() {
  if (!existsSync(PRODUCTS_FILE)) return [];
  try { return JSON.parse(readFileSync(PRODUCTS_FILE, 'utf8')); }
  catch { return []; }
}

// ── Admin: save products ──────────────────────────
app.post('/api/admin/save-products', (req, res) => {
  const key = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    writeFileSync(PRODUCTS_FILE, JSON.stringify(req.body.products, null, 2));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Create PaymentIntent ──────────────────────────
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { cart, shipping, email } = req.body;
    if (!cart?.length) return res.status(400).json({ error: 'עגלה ריקה' });

    // Server-side price calculation (never trust the client amount)
    const products = readProducts();
    let subtotalAgorot = 0;

    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product) return res.status(400).json({ error: `מוצר לא נמצא: ${item.id}` });
      subtotalAgorot += Math.round(product.price * 100) * (item.qty || 1);
    }

    const subtotalILS    = subtotalAgorot / 100;
    const shippingAgorot = subtotalILS >= 300 ? 0 : 35 * 100;
    const totalAgorot    = subtotalAgorot + shippingAgorot;

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   totalAgorot,
      currency: 'ils',
      receipt_email: email || undefined,
      metadata: {
        cart:     JSON.stringify(cart),
        shipping: JSON.stringify(shipping),
        email:    email || '',
      },
    });

    res.json({
      clientSecret:  paymentIntent.client_secret,
      totalAgorot,
      shippingFree: shippingAgorot === 0,
    });
  } catch (err) {
    console.error('[PaymentIntent]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Stripe Webhook ────────────────────────────────
app.post('/api/webhook/stripe', async (req, res) => {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = secret
      ? stripe.webhooks.constructEvent(req.body, sig, secret)
      : JSON.parse(req.body); // allow unsigned events in dev (no webhook secret)
  } catch (err) {
    console.error('[Webhook] Signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    console.log(`[Webhook] Payment succeeded: ${pi.id}`);
    await createPrintifyOrder(pi).catch(e =>
      console.error('[Printify] Order creation failed:', e.message)
    );
  }

  res.json({ received: true });
});

// ── Printify Order Creation ───────────────────────
async function createPrintifyOrder(paymentIntent) {
  const apiKey  = process.env.PRINTIFY_API_KEY;
  const shopId  = process.env.PRINTIFY_SHOP_ID;
  if (!apiKey || !shopId) {
    console.warn('[Printify] API key or shop ID not configured – skipping order');
    return;
  }

  const cart     = JSON.parse(paymentIntent.metadata.cart     || '[]');
  const shipping = JSON.parse(paymentIntent.metadata.shipping || '{}');
  const email    = paymentIntent.metadata.email || '';

  const products  = readProducts();
  const lineItems = [];

  for (const item of cart) {
    const product = products.find(p => p.id === item.id);
    if (!product?.printifyProductId) continue;
    const variantId = product.printifyVariants?.[item.size];
    if (!variantId) continue;
    lineItems.push({
      product_id: product.printifyProductId,
      variant_id: parseInt(variantId, 10),
      quantity:   item.qty || 1,
    });
  }

  if (!lineItems.length) {
    console.warn('[Printify] No mappable line items for', paymentIntent.id);
    return;
  }

  const nameParts = (shipping.name || 'Customer').split(' ');
  const firstName = nameParts[0];
  const lastName  = nameParts.slice(1).join(' ') || nameParts[0];

  const body = {
    external_id:                paymentIntent.id,
    line_items:                 lineItems,
    shipping_method:            1,
    send_shipping_notification: true,
    address_to: {
      first_name: firstName,
      last_name:  lastName,
      email,
      country:    shipping.country  || 'IL',
      region:     shipping.region   || '',
      address1:   shipping.address  || '',
      city:       shipping.city     || '',
      zip:        shipping.zip      || '',
      phone:      shipping.phone    || '',
    },
  };

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/orders.json`,
    {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();
  if (response.ok) {
    console.log('[Printify] Order created:', result.id);
  } else {
    console.error('[Printify] API error:', JSON.stringify(result));
  }
}

// ── Fallback → serve index.html ───────────────────
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.listen(port, () =>
  console.log(`\n🏛  TEMPLE3 server running → http://localhost:${port}\n`)
);
