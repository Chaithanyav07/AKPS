import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api';

// Fetch with a hard timeout so requests never hang forever
const fetchWithTimeout = (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeView, setActiveView] = useState('home'); // home, shop, customizer, bulk, checkout, account
  const [activePage, setActivePage] = useState('home'); // new page navigation (home, cart, wishlist, checkout, account, etc.)
  const [previousPage, setPreviousPage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // base product for customizer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, tshirt, hoodie, sweatshirt, polo, bulk
  
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [toast, setToast] = useState(null);

  // Show dynamic banner feedback
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth headers helper
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // Load Products initially
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products', err));
  }, []);

  // Sync token to localstorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserData();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setCart([]);
      setWishlist([]);
      setNotifications([]);
      setOrders([]);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        fetchCart();
        fetchWishlist();
        fetchNotifications();
        fetchOrders();
      } else {
        setToken('');
      }
    } catch (e) {
      // Token was stale or server unreachable — silently clear it
      setToken('');
      console.error('Could not restore session:', e.message);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart`, { headers: getHeaders() });
      if (res.ok) setCart(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/wishlist`, { headers: getHeaders() });
      if (res.ok) setWishlist(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
      if (res.ok) setNotifications(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
      if (res.ok) setOrders(await res.json());
    } catch (e) { console.error(e); }
  };

  // Sync state modifications to backend
  const updateCartOnBackend = async (newCart) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items: newCart })
      });
    } catch (e) { console.error(e); }
  };

  const updateWishlistOnBackend = async (newWishlist) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/wishlist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items: newWishlist })
      });
    } catch (e) { console.error(e); }
  };

  // --- Actions ---
  const register = async (username, email, password) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        showToast('Registration successful! Welcome.', 'success');
        return true;
      } else {
        showToast(data.error || 'Registration failed', 'error');
        return false;
      }
    } catch (e) {
      const msg = e.name === 'AbortError'
        ? 'Server not responding. Please try again.'
        : 'Connection error. Check your network.';
      showToast(msg, 'error');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        showToast('Welcome back!', 'success');
        return true;
      } else {
        showToast(data.error || 'Invalid credentials', 'error');
        return false;
      }
    } catch (e) {
      const msg = e.name === 'AbortError'
        ? 'Server not responding. Please try again.'
        : 'Connection error. Check your network.';
      showToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    setToken('');
    showToast('Logged out successfully', 'success');
    setActiveView('home');
  };

  const addToCart = (item) => {
    if (!token) {
      showToast('Please sign in to add items to cart.', 'error');
      return;
    }
    const updated = [...cart];
    // Check if identical customization and product exists
    const idx = updated.findIndex(c => 
      c.id === item.id && 
      JSON.stringify(c.customization) === JSON.stringify(item.customization) &&
      c.size === item.size
    );

    if (idx > -1) {
      updated[idx].quantity += item.quantity || 1;
    } else {
      updated.push({
        cartId: Date.now().toString(),
        quantity: 1,
        ...item
      });
    }

    setCart(updated);
    updateCartOnBackend(updated);
    showToast(`${item.name} added to cart!`, 'success');
  };

  const removeFromCart = (cartId) => {
    const updated = cart.filter(c => c.cartId !== cartId);
    setCart(updated);
    updateCartOnBackend(updated);
    showToast('Item removed from cart.', 'success');
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    const updated = cart.map(c => c.cartId === cartId ? { ...c, quantity } : c);
    setCart(updated);
    updateCartOnBackend(updated);
  };

  const toggleWishlist = (product) => {
    if (!token) {
      showToast('Please sign in to add items to wishlist.', 'error');
      navigate('auth');
      return;
    }
    let updated;
    const isWishlisted = wishlist.some(w => w.id === product.id);
    if (isWishlisted) {
      updated = wishlist.filter(w => w.id !== product.id);
      showToast('Removed from wishlist.', 'info');
    } else {
      updated = [...wishlist, product];
      showToast('Added to wishlist!', 'success');
    }
    setWishlist(updated);
    updateWishlistOnBackend(updated);
  };

  // ----- Wishlist Folder State & CRUD -----
  const [wishlistFolders, setWishlistFolders] = useState([]);
  const createFolder = (name) => {
    setWishlistFolders(prev => [...prev, { id: crypto.randomUUID(), name, items: [] }]);
    showToast(`Folder "${name}" created.`, 'success');
  };
  const renameFolder = (id, newName) => {
    setWishlistFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    showToast('Folder renamed.', 'success');
  };
  const deleteFolder = (id) => {
    setWishlistFolders(prev => prev.filter(f => f.id !== id));
    showToast('Folder deleted.', 'info');
  };
  const addToFolder = (productId, folderId) => {
    setWishlistFolders(prev => prev.map(f => f.id === folderId ? { ...f, items: [...f.items, productId] } : f));
    showToast('Item added to folder.', 'success');
  };
  const removeFromFolder = (productId, folderId) => {
    setWishlistFolders(prev => prev.map(f => f.id === folderId ? { ...f, items: f.items.filter(id => id !== productId) } : f));
    showToast('Item removed from folder.', 'info');
  };

  // Navigation helper
  const navigate = (page) => {
    setPreviousPage(activePage);
    setActivePage(page);
    setActiveView(page);
  };

  const readNotification = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/read`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) { console.error(e); }
  };

  const placeOrder = async (shippingAddress, paymentMethod) => {
    if (!token) {
      showToast('Please sign in or create an account to place your order.', 'error');
      navigate('auth');
      return false;
    }
    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return false;
    }
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 17;
    const tax = subtotal * 0.12;
    const total = subtotal + shipping + tax;
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          items: cart,
          paymentMethod,
          shippingAddress,
          total
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCart([]);
        fetchNotifications();
        fetchOrders();
        showToast(`Order placed successfully! (${data.order?.id || ''})`, 'success');
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Failed to place order. Please try again.', 'error');
        if (res.status === 401) {
          navigate('auth');
        }
        return false;
      }
    } catch (e) {
      console.error('Order placement error:', e);
      showToast('Network error while placing order.', 'error');
      return false;
    }
  };

  const submitBulkOrder = async (inquiryData) => {
    try {
      const res = await fetch(`${API_BASE}/bulk-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        showToast('Bulk inquiry submitted! We will email you shortly.', 'success');
        if (token) fetchNotifications();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      token,
      activeView,
      setActiveView,
      activePage,
      setActivePage,
      previousPage,
      setPreviousPage,
      selectedProduct,
      setSelectedProduct,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      cart,
      wishlist,
      notifications,
      products,
      orders,
      toast,
      showToast,
      register,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      readNotification,
      placeOrder,
      submitBulkOrder,
      // Wishlist folder state and actions
      wishlistFolders,
      createFolder,
      renameFolder,
      deleteFolder,
      addToFolder,
      removeFromFolder,
      navigate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
