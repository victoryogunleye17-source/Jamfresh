# Jam Fresh — Website Setup Guide

## Folder Structure
```
jamfresh/
├── index.html          ← Homepage (product listing)
├── cart.html           ← Cart & checkout page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Cart logic, email, product rendering
└── assets/
    └── images/         ← Add your product images here (optional)
```

## How to Use
1. Simply open `index.html` in any web browser — no server needed.
2. Products display with quantity selectors.
3. Add items to cart → go to cart.html → fill in delivery info → Place Order.

## Email Notification (How it Works)
When a customer places an order:
1. **Mailto link** opens automatically — this drafts an email to `jamiucrown200@gmail.com` with full order details (works on mobile & desktop).
2. **WhatsApp modal** appears after order — customer can send proof of payment directly.

## Optional: Automatic Email via EmailJS (Free)
For fully automated email (no customer action needed):
1. Go to https://www.emailjs.com and create a free account.
2. Create a service (Gmail) and note your **Service ID**.
3. Create a template — use any field names you like.
4. Copy your **Public Key** from Account settings.
5. In `js/main.js`, update these three values in `sendViaEmailJS()`:
   - `service_id: 'your_service_id'`
   - `template_id: 'your_template_id'`  
   - `user_id: 'your_public_key'`
6. Add this script to both HTML files before `</body>`:
   `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>`

## Adding Product Images
- Add image files to `assets/images/`
- In `js/main.js`, update the product object to include `img: 'assets/images/eggs.jpg'`
- The product card HTML can use `<img>` instead of the emoji placeholder.

## Deployment Options
- **Free hosting**: Upload to Netlify (drag & drop), Vercel, or GitHub Pages.
- Just zip the entire `jamfresh/` folder and drop it on netlify.com/drop

## Customization
All business details are in `js/main.js` at the top `STORE` object:
```js
const STORE = {
  name: 'Jam Fresh',
  whatsapp: '2348069656266',
  phone: '08069656266',
  email: 'jamiucrown200@gmail.com',
  bankName: 'GTB Bank',
  accountNumber: '0035480122',
  accountName: 'Adepegba Jamiu Tunde',
};
```
