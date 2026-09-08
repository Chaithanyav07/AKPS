import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory sessions storage (simple token mappings)
const sessions = new Map();

// Helper to authenticate request (persists across server restarts)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  let userId = sessions.get(token);

  // If memory map was reset on server restart, parse userId from token
  if (!userId && token.startsWith('token-')) {
    const parts = token.split('-');
    if (parts.length >= 3) {
      userId = parts.slice(2).join('-');
    }
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  const user = db.getUsers().find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }
  sessions.set(token, user.id);
  req.user = user;
  next();
}

// Mailer Setup with enhanced Gmail service configuration and detailed logs
async function sendOwnerEmail({ subject, text, html }) {
  const ownerEmail = process.env.OWNER_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

  console.log(`[Email] Dispatching notification to ${ownerEmail} using ${smtpUser}...`);

  if (!ownerEmail || !smtpUser || !smtpPass) {
    console.log('[Email] Warning: Email credentials missing in .env:');
    console.log(`- OWNER_EMAIL: ${ownerEmail || 'MISSING'}`);
    console.log(`- SMTP_USER: ${smtpUser || 'MISSING'}`);
    console.log(`- SMTP_PASS: ${smtpPass ? 'SET' : 'MISSING'}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"AKPS Store" <${smtpUser}>`,
      to: ownerEmail,
      subject,
      text,
      html
    });
    console.log(`[Email] SUCCESS! Notification delivered to ${ownerEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[Email] FAILED to send email:', error.message);
    return false;
  }
}

// Global Products List with accurate pricing and expanded apparel colors
const BASE_PRODUCTS = [
  {
    id: 'prod-tshirt',
    name: 'Classic Custom T-Shirt',
    type: 'tshirt',
    basePrice: 399,
    description: '100% premium combed ring-spun cotton (190 GSM). Ultra soft, pre-shrunk, standard fit, perfect for direct-to-garment and screen printing.',
    colors: ['#111111', '#F8F9FA', '#9CA3AF', '#1E293B', '#881337', '#14532D', '#D4A373', '#2563EB', '#A855F7', '#EA580C'],
    rating: 4.8,
    reviews: 142
  },
  {
    id: 'prod-hoodie',
    name: 'Premium Custom Hoodie',
    type: 'hoodie',
    basePrice: 799,
    description: '330 GSM heavyweight fleece hoodie. Double-lined hood, matching drawstrings, kangaroo pouch, ribbed cuffs and hem, relaxed cozy fit.',
    colors: ['#111111', '#9CA3AF', '#1E293B', '#14532D', '#881337', '#D4A373', '#374151', '#4D7C0F'],
    rating: 4.9,
    reviews: 98
  },
  {
    id: 'prod-sweatshirt',
    name: 'Essential Sweatshirt',
    type: 'sweatshirt',
    basePrice: 699,
    description: '300 GSM midweight French terry pullover. Classic crew neck, durable raglan construction, reinforced neckband, standard unisex fit.',
    colors: ['#F8F9FA', '#9CA3AF', '#111111', '#1E293B', '#881337', '#14532D', '#D4A373', '#C084FC'],
    rating: 4.7,
    reviews: 64
  },
  {
    id: 'prod-polo',
    name: 'Classic Polo T-Shirt',
    type: 'polo',
    basePrice: 359,
    description: '220 GSM pique knit cotton polo with structured flat-knit collar and cuffs. Classy styling with 3-button placket and split side vents.',
    colors: ['#F8F9FA', '#111111', '#1E293B', '#14532D', '#2563EB', '#881337', '#D4A373', '#4D7C0F'],
    rating: 4.6,
    reviews: 81
  }
];

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const existing = db.getUsers().find(u => u.email === email || u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'Username or Email already exists' });
  }

  const user = db.addUser({ username, email, password });
  const token = 'token-' + Math.random().toString(36).substring(2) + '-' + user.id;
  sessions.set(token, user.id);

  // Send introductory notification
  db.addNotification(user.id, 'Welcome to AKPS!', 'Welcome aboard! Start designing your custom shirts, hoodies, and sweatshirts today.');

  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.getUsers().find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = 'token-' + Math.random().toString(36).substring(2) + '-' + user.id;
  sessions.set(token, user.id);

  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username, email: req.user.email } });
});

// --- PRODUCT ROUTE ---
app.get('/api/products', (req, res) => {
  res.json(BASE_PRODUCTS);
});

// --- CART ROUTES ---
app.get('/api/cart', authenticate, (req, res) => {
  res.json(db.getCart(req.user.id));
});

app.post('/api/cart', authenticate, (req, res) => {
  db.saveCart(req.user.id, req.body.items || []);
  res.json({ success: true, items: db.getCart(req.user.id) });
});

// --- WISHLIST ROUTES ---
app.get('/api/wishlist', authenticate, (req, res) => {
  res.json(db.getWishlist(req.user.id));
});

app.post('/api/wishlist', authenticate, (req, res) => {
  db.saveWishlist(req.user.id, req.body.items || []);
  res.json({ success: true, items: db.getWishlist(req.user.id) });
});

// --- ORDER ROUTES ---
app.get('/api/orders', authenticate, (req, res) => {
  res.json(db.getOrders(req.user.id));
});

app.post('/api/orders', authenticate, async (req, res) => {
  const { items, paymentMethod, total, shippingAddress } = req.body;
  if (!items || items.length === 0 || !paymentMethod || !total) {
    return res.status(400).json({ error: 'Invalid order request' });
  }

  const order = db.addOrder(req.user.id, { items, paymentMethod, total, shippingAddress });
  
  // Clear Cart
  db.saveCart(req.user.id, []);

  // Send Order Notification to User (in-app)
  db.addNotification(
    req.user.id, 
    `Order Placed Successfully!`, 
    `Your order ${order.id} for ₹${total.toFixed(2)} is now processing. We will notify you once shipped.`
  );

  // Send Owner Email Notification
  const itemsText = items.map(item => 
    `- ${item.quantity}x ${item.name} (${item.size || 'L'}, Color: ${item.color || '#111'})${item.customization?.text ? ` [Text: "${item.customization.text}"]` : ''} - ₹${item.price}`
  ).join('\n');

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${item.name}</strong><br/>Size: ${item.size || 'L'} | Color: <span style="display:inline-block;width:12px;height:12px;background:${item.color || '#111'};border:1px solid #aaa;vertical-align:middle;"></span> ${item.color || '#111'}${item.customization?.text ? `<br/><em>Custom Text: "${item.customization.text}"</em>` : ''}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
    </tr>
  `).join('');

  await sendOwnerEmail({
    subject: `🚨 NEW ORDER RECEIVED: ${order.id}`,
    text: `You have received a new order!\n\nOrder ID: ${order.id}\nCustomer: ${req.user.username} (${req.user.email})\nTotal: ₹${total.toFixed(2)}\nPayment: ${paymentMethod}\n\nShipping Address:\n${shippingAddress || 'N/A'}\n\nItems:\n${itemsText}\n\nCheck your admin dashboard for more details.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 8px;">New Order Received! 🛍️</h2>
        <p><strong>Order ID:</strong> <span style="font-size: 16px; font-weight: bold; color: #18181b;">${order.id}</span></p>
        <p><strong>Customer Name:</strong> ${req.user.username}</p>
        <p><strong>Customer Email:</strong> ${req.user.email}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Shipping Address:</strong><br/>${(shippingAddress || 'N/A').replace(/\n/g, '<br/>')}</p>
        
        <h3 style="margin-top: 24px; border-bottom: 1px solid #eee; padding-bottom: 6px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f4f4f5; text-align: left;">
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Product Details</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; font-weight: bold; text-align: right;">Grand Total:</td>
              <td style="padding: 8px; font-weight: bold; text-align: right; color: #10b981; font-size: 18px;">₹${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `
  });

  res.json({ success: true, order });
});

// --- BULK INQUIRIES ROUTE ---
app.post('/api/bulk-orders', async (req, res) => {
  const { name, email, phone, category, quantity, description } = req.body;
  if (!name || !email || !category || !quantity || !description) {
    return res.status(400).json({ error: 'Please provide all details' });
  }

  const request = db.addBulkRequest({ name, email, phone, category, quantity, description });
  
  // If request contains an email that matches a registered user, send them a notification too.
  const matchedUser = db.getUsers().find(u => u.email === email);
  if (matchedUser) {
    db.addNotification(
      matchedUser.id,
      'Bulk Order Quote Received',
      `Thank you for your bulk inquiry of ${quantity} ${category}s. Our sales team will email you a quote shortly.`
    );
  }

  // Send Owner Email Notification
  await sendOwnerEmail({
    subject: `📦 NEW BULK INQUIRY: ${request.id}`,
    text: `You have received a new bulk order inquiry!\n\nInquiry ID: ${request.id}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCategory: ${category}\nQuantity: ${quantity}\n\nDescription:\n${description}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 8px;">New Bulk Order Inquiry! 📦</h2>
        <p><strong>Inquiry ID:</strong> <span style="font-size: 16px; font-weight: bold; color: #18181b;">${request.id}</span></p>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Customer Phone:</strong> ${phone}</p>
        <p><strong>Apparel Type:</strong> ${category.toUpperCase()}</p>
        <p><strong>Requested Quantity:</strong> ${quantity}</p>
        
        <h3 style="margin-top: 24px; border-bottom: 1px solid #eee; padding-bottom: 6px;">Customization Specs / Message</h3>
        <blockquote style="background: #f4f4f5; border-left: 4px solid #18181b; padding: 12px 16px; margin: 0; font-style: italic;">
          ${description.replace(/\n/g, '<br/>')}
        </blockquote>
      </div>
    `
  });

  res.json({ success: true, request });
});

// --- NOTIFICATIONS ROUTES ---
app.get('/api/notifications', authenticate, (req, res) => {
  res.json(db.getNotifications(req.user.id));
});

app.post('/api/notifications/read', authenticate, (req, res) => {
  const { id } = req.body;
  db.markNotificationRead(req.user.id, id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`AKPS backend running on http://localhost:${PORT}`);
});
