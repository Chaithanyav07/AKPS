import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  users: [],
  orders: [],
  bulkRequests: [],
  notifications: [],
  carts: {}, // userId -> array of items
  wishlists: {} // userId -> array of items
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading DB file:', error);
    return INITIAL_DATA;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing DB file:', error);
  }
}

export const db = {
  getUsers: () => readDB().users,
  addUser: (user) => {
    const data = readDB();
    const newUser = { id: Date.now().toString(), ...user };
    data.users.push(newUser);
    // Initialize empty cart, wishlist
    data.carts[newUser.id] = [];
    data.wishlists[newUser.id] = [];
    writeDB(data);
    return newUser;
  },
  
  getCart: (userId) => {
    const data = readDB();
    return data.carts[userId] || [];
  },
  saveCart: (userId, items) => {
    const data = readDB();
    data.carts[userId] = items;
    writeDB(data);
  },

  getWishlist: (userId) => {
    const data = readDB();
    return data.wishlists[userId] || [];
  },
  saveWishlist: (userId, items) => {
    const data = readDB();
    data.wishlists[userId] = items;
    writeDB(data);
  },

  getOrders: (userId) => {
    const data = readDB().orders;
    return data.filter(order => order.userId === userId);
  },
  addOrder: (userId, orderDetails) => {
    const data = readDB();
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      userId,
      ...orderDetails,
      status: 'Processing',
      createdAt: new Date().toISOString()
    };
    data.orders.push(newOrder);
    writeDB(data);
    return newOrder;
  },

  addBulkRequest: (request) => {
    const data = readDB();
    const newRequest = {
      id: 'BLK-' + Math.floor(100000 + Math.random() * 900000),
      ...request,
      status: 'Received',
      createdAt: new Date().toISOString()
    };
    data.bulkRequests.push(newRequest);
    writeDB(data);
    return newRequest;
  },

  getNotifications: (userId) => {
    const data = readDB().notifications;
    return data.filter(n => n.userId === userId || n.userId === 'all');
  },
  addNotification: (userId, title, message) => {
    const data = readDB();
    const newNotification = {
      id: Date.now().toString(),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    data.notifications.unshift(newNotification);
    writeDB(data);
    return newNotification;
  },
  markNotificationRead: (userId, notificationId) => {
    const data = readDB();
    data.notifications = data.notifications.map(n => {
      if (n.id === notificationId && (n.userId === userId || n.userId === 'all')) {
        return { ...n, read: true };
      }
      return n;
    });
    writeDB(data);
  }
};
