// ── JAM FRESH | main.js ── (fixed)

const STORE = {
  name: 'Jam Fresh',
  whatsapp: '2348069656266',
  phone: '08069656266',
  email: 'jamiucrown200@gmail.com',
  bankName: 'GTB Bank',
  accountNumber: '0035480122',
  accountName: 'Adepegba Jamiu Tunde',
};

const PRODUCTS = [
  {
    id: 'eggs',
    name: 'Fresh Farm Eggs',
    icon: '🥚',
    badge: 'Best Seller',
    desc: 'Farm-fresh eggs laid daily. Rich yolks, clean shells — straight from our healthy hens.',
    variants: [
      { id: 'eggs-tray', name: 'Per Tray', price: 5000, unit: 'tray' },
    ],
  },
  {
    id: 'broilers',
    name: 'Premium Broilers',
    icon: '🍗',
    badge: 'Fresh Daily',
    desc: 'Tender, well-raised broiler chickens available in three options to suit your preference.',
    variants: [
      { id: 'broiler-fresh',   name: 'Fresh Dress (per kg)', price: 4000, unit: 'kg' },
      { id: 'broiler-live',    name: 'Live Weight (per kg)',  price: 3000, unit: 'kg' },
      { id: 'broiler-blasted', name: 'Blasted (per kg)',      price: 4500, unit: 'kg' },
    ],
  },
];

// ── CART STORAGE ──
function getCart() {
  try { return JSON.parse(localStorage.getItem('jamfresh_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('jamfresh_cart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    // FIX: use consistent visibility toggle — don't mix display styles
    el.style.visibility = total === 0 ? 'hidden' : 'visible';
  });
}
function addToCart(productId, variantId, qty) {
  if (qty <= 0) return;
  const product = PRODUCTS.find(p => p.id === productId);
  const variant  = product.variants.find(v => v.id === variantId);
  const cart = getCart();
  const existing = cart.find(i => i.variantId === variantId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, variantId, qty,
      productName: product.name,
      variantName: variant.name,
      price: variant.price,
      icon: product.icon,
    });
  }
  saveCart(cart);
  showToast(`✅ Added ${qty} × ${product.name} (${variant.name}) to cart`);
}
// FIX: guard renderCart calls so they only run when on cart page
function removeFromCart(variantId) {
  saveCart(getCart().filter(i => i.variantId !== variantId));
  if (document.getElementById('cartItems')) renderCart();
}
function updateCartQty(variantId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.variantId === variantId);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    if (document.getElementById('cartItems')) renderCart();
  }
}
function clearCart() {
  localStorage.removeItem('jamfresh_cart');
  updateCartBadge();
}
function cartTotal(cart) {
  // FIX: accept cart param so we don't re-read after clear
  return (cart || getCart()).reduce((s, i) => s + i.price * i.qty, 0);
}
function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG');
}

// ── TOAST ──
function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ── MOBILE MENU ──
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  // FIX: toggle a class that CSS uses — remove conflicting hidden/display logic
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
}

// ── HOME: PRODUCT LISTING ──
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(product => `
    <div class="product-card" data-product="${product.id}">
      <div class="product-img-placeholder">
        <span class="product-emoji">${product.icon}</span>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-variants">
          ${product.variants.map(v => `
            <div class="variant-item">
              <div class="variant-info">
                <span class="variant-name">${v.name}</span>
                <span class="variant-price">${formatNGN(v.price)} / ${v.unit}</span>
              </div>
              <div class="variant-controls">
                <button class="qty-btn" type="button" onclick="changeQty('${v.id}', -1)" aria-label="Decrease">−</button>
                <span class="qty-display" id="qty-${v.id}">0</span>
                <button class="qty-btn" type="button" onclick="changeQty('${v.id}', 1)" aria-label="Increase">+</button>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="add-to-cart-btn" type="button" onclick="handleAddToCart('${product.id}')">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

window.changeQty = function(variantId, delta) {
  const el = document.getElementById('qty-' + variantId);
  if (!el) return;
  el.textContent = Math.max(0, (parseInt(el.textContent) || 0) + delta);
};

window.handleAddToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  let added = false;
  product.variants.forEach(v => {
    const el = document.getElementById('qty-' + v.id);
    const qty = el ? parseInt(el.textContent) || 0 : 0;
    if (qty > 0) {
      addToCart(productId, v.id, qty);
      if (el) el.textContent = '0';
      added = true;
    }
  });
  if (!added) showToast('⚠️ Please select a quantity first');
};

// ── CART PAGE ──
function renderCart() {
  const itemsContainer = document.getElementById('cartItems');
  if (!itemsContainer) return;
  const cart = getCart();

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Go back and add some fresh products!</p>
        <a href="index.html" style="margin-top:14px;display:inline-block;">← Continue Shopping</a>
      </div>`;
    updateOrderSummary([]);
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.productName}</div>
        <div class="cart-item-variant">${item.variantName}</div>
        <div class="cart-item-price">${formatNGN(item.price)} × ${item.qty} = ${formatNGN(item.price * item.qty)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" type="button" onclick="updateCartQty('${item.variantId}', -1)">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" type="button" onclick="updateCartQty('${item.variantId}', 1)">+</button>
      </div>
      <button class="remove-item-btn" type="button" onclick="removeFromCart('${item.variantId}')" title="Remove">✕</button>
    </div>
  `).join('');

  updateOrderSummary(cart);
}

function updateOrderSummary(cart) {
  const container = document.getElementById('summaryLines');
  const totalEl   = document.getElementById('summaryTotal');
  if (!container) return;

  if (!cart || cart.length === 0) {
    container.innerHTML = '<div class="summary-row"><span style="color:var(--text-light)">No items yet</span></div>';
    if (totalEl) totalEl.textContent = '₦0';
    return;
  }

  container.innerHTML = cart.map(item =>
    `<div class="summary-row">
      <span>${item.productName} (${item.variantName}) ×${item.qty}</span>
      <span>${formatNGN(item.price * item.qty)}</span>
    </div>`
  ).join('');

  if (totalEl) totalEl.textContent = formatNGN(cartTotal(cart));
}

// ── EMAIL & WHATSAPP ──
function buildOrderText(orderDetails, cart) {
  const lines = cart.map(i =>
    `  - ${i.productName} (${i.variantName}) x${i.qty} = NGN ${(i.price * i.qty).toLocaleString()}`
  ).join('\n');
  const total = cartTotal(cart);
  return [
    `New Order Received - Jam Fresh`,
    `=============================================`,
    `Customer: ${orderDetails.name}`,
    `Phone   : ${orderDetails.phone}`,
    `Address : ${orderDetails.address}`,
    `Notes   : ${orderDetails.notes || 'None'}`,
    ``,
    `Payment : Bank Transfer`,
    `Bank    : ${STORE.bankName}`,
    `Account : ${STORE.accountNumber}`,
    `Acct Name: ${STORE.accountName}`,
    ``,
    `Order Items:`,
    lines,
    `---------------------------------------------`,
    `TOTAL: NGN ${total.toLocaleString()}`,
    `=============================================`,
  ].join('\n');
}

// FIX: pass snapshot of cart (before clear) everywhere
function sendOrderEmail(orderDetails, cart) {
  const subject = encodeURIComponent(`New Order from ${orderDetails.name} - Jam Fresh`);
  const body    = encodeURIComponent(buildOrderText(orderDetails, cart));
  const a = document.createElement('a');
  a.href = `mailto:${STORE.email}?subject=${subject}&body=${body}`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 100);
}

function buildWhatsAppMessage(orderDetails, cart) {
  const lines = cart.map(i =>
    `• ${i.productName} (${i.variantName}) x${i.qty} = NGN ${(i.price * i.qty).toLocaleString()}`
  ).join('\n');
  return [
    `*New Order - Jam Fresh* 🐓`,
    ``,
    `*Customer:* ${orderDetails.name}`,
    `*Phone:* ${orderDetails.phone}`,
    `*Address:* ${orderDetails.address}`,
    ``,
    `*Order:*`,
    lines,
    ``,
    `*TOTAL: ${formatNGN(cartTotal(cart))}*`,
    ``,
    `Payment: Bank Transfer`,
    `${STORE.bankName} | ${STORE.accountNumber} | ${STORE.accountName}`,
  ].join('\n');
}

// FIX: update WhatsApp modal button with real order data before clearing cart
function updateWhatsAppModalLink(orderDetails, cart) {
  const waBtn = document.getElementById('whatsappConfirmBtn');
  if (!waBtn) return;
  const msg = buildWhatsAppMessage(orderDetails, cart);
  waBtn.href = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// ── CHECKOUT FORM ──
function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      showToast('⚠️ Your cart is empty!');
      return;
    }

    const name    = document.getElementById('fullName').value.trim();
    const phone   = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim();
    const notes   = document.getElementById('orderNotes').value.trim();

    if (!name)    { showToast('⚠️ Please enter your full name'); return; }
    if (!phone)   { showToast('⚠️ Please enter your phone number'); return; }
    if (!address) { showToast('⚠️ Please enter your delivery address'); return; }
    if (!/^[0-9]{10,14}$/.test(phone.replace(/[\s\-\+]/g, ''))) {
      showToast('⚠️ Please enter a valid phone number (10–14 digits)');
      return;
    }

    const orderDetails = { name, phone, address, notes };
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';

    // FIX: capture cart snapshot BEFORE clearing, update WA link BEFORE clearing
    const cartSnapshot = [...cart];
    sendOrderEmail(orderDetails, cartSnapshot);
    updateWhatsAppModalLink(orderDetails, cartSnapshot);

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '✅ Place Order';
      clearCart();
      renderCart();
      form.reset();
      showSuccessModal();
    }, 800);
  });
}

function showSuccessModal() {
  const overlay = document.getElementById('successModal');
  if (!overlay) return;
  overlay.classList.add('active');

  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) {
    // FIX: use once:true so listener doesn't stack on repeat orders
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      window.location.href = 'index.html';
    }, { once: true });
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initMobileMenu();

  // Only call page-specific functions if their root element exists
  if (document.getElementById('productsGrid')) renderProducts();
  if (document.getElementById('cartItems'))    renderCart();
  if (document.getElementById('checkoutForm')) initCheckoutForm();

  // Copy account number on click
  const accNum = document.getElementById('accNum');
  if (accNum) {
    accNum.addEventListener('click', () => {
      navigator.clipboard.writeText(STORE.accountNumber)
        .then(() => showToast('📋 Account number copied!'))
        .catch(() => showToast('Account: ' + STORE.accountNumber));
    });
  }
});
