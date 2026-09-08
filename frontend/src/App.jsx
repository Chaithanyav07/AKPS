import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import Customizer from './components/Customizer';
import BulkInquiry from './components/BulkInquiry';
import CheckoutPage from './components/CheckoutPage';
import AccountPage from './components/AccountPage';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import NotificationsDrawer from './components/NotificationsDrawer';
import AuthModal from './components/AuthModal';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';

function MainAppLayout() {
  const { activeView, toast, previousPage, navigate } = useApp();
  
  // Drawer open states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const authOpen = activeView === 'auth';
  const setAuthOpen = (val) => {
    if (!val) {
      const targetPage = (previousPage && previousPage !== 'auth') ? previousPage : 'home';
      navigate(targetPage);
    }
  };

  // View routing with smooth fade-in animations
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <div className="animate-fade"><HomeView /></div>;
      case 'shop':
        return <div className="animate-fade"><ShopView /></div>;
      case 'customizer':
        return <div className="animate-fade"><Customizer /></div>;
      case 'bulk':
        return <div className="animate-fade"><BulkInquiry /></div>;
      case 'checkout':
        return <div className="animate-fade"><CheckoutPage /></div>;
      case 'account':
        return <div className="animate-fade"><AccountPage /></div>;
      case 'cart':
        return <div className="animate-fade"><CartPage /></div>;
      case 'wishlist':
        return <div className="animate-fade"><WishlistPage /></div>;
      default:
        return <div className="animate-fade"><HomeView /></div>;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert Banner */}
      {toast && (
        <div 
          className="glass" 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            padding: '12px 24px',
            borderRadius: 'var(--border-radius-sm)',
            borderLeft: `4px solid ${
              toast.type === 'error' ? 'var(--color-accent)' : 
              toast.type === 'info' ? 'var(--color-secondary)' : 'var(--color-primary)'
            }`,
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease',
            color: 'var(--text-main)',
            fontWeight: 500,
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main>
        {renderView()}
      </main>

      {/* Footnote */}
      <footer className="glass" style={{
        padding: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--glass-border)'
      }}>
        © 2026 AKPS - Always Keep Pushing Style. Premium Customized Apparel. All rights reserved.
      </footer>

      {/* Slide-out Drawers */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <NotificationsDrawer isOpen={activeView === 'notifications'} onClose={() => navigate('home')} />
      
      {/* Dialog Overlays */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
