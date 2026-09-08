import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, Bell, User, Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    cart,
    wishlist,
    notifications,
    navigate
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view, category = 'all') => {
    setActiveView(view);
    setSelectedCategory(category);
    setMobileMenuOpen(false);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => handleNav('home')} 
        style={{ 
          cursor: 'pointer', 
          fontFamily: 'var(--font-display)', 
          fontSize: '24px', 
          fontWeight: 800,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>AKPS</span>
      </div>

      {/* Center Navigation Menu (Desktop) */}
      <div className="nav-links" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <span 
          onClick={() => handleNav('home')} 
          style={{ 
            cursor: 'pointer', 
            color: activeView === 'home' ? 'var(--color-primary)' : 'var(--text-main)',
            fontWeight: activeView === 'home' ? 600 : 400,
            transition: 'var(--transition-fast)'
          }}
        >
          Home
        </span>
        <span 
          onClick={() => handleNav('shop', 'all')} 
          style={{ 
            cursor: 'pointer', 
            color: activeView === 'shop' ? 'var(--color-primary)' : 'var(--text-main)',
            fontWeight: activeView === 'shop' ? 600 : 400,
            transition: 'var(--transition-fast)'
          }}
        >
          Shop
        </span>
        <span 
          onClick={() => handleNav('shop', 'bulk')} 
          style={{ 
            cursor: 'pointer', 
            color: activeView === 'bulk' ? 'var(--color-primary)' : 'var(--text-main)',
            fontWeight: activeView === 'bulk' ? 600 : 400,
            transition: 'var(--transition-fast)'
          }}
        >
          Bulk Orders
        </span>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', width: '280px', display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search custom apparel..." 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (activeView !== 'shop') setActiveView('shop');
          }}
          style={{
            padding: '8px 12px 8px 36px',
            fontSize: '14px',
            borderRadius: 'var(--border-radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-main)'
          }}
        />
        <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
      </div>

      {/* Actions (Cart, Wishlist, Notifications, User) */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* Wishlist Icon */}
        <button 
          onClick={() => navigate('wishlist')}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', position: 'relative' }}
        >
          <Heart size={20} style={{ fill: wishlist.length > 0 ? 'var(--color-accent)' : 'none', color: wishlist.length > 0 ? 'var(--color-accent)' : 'var(--text-main)' }} />
          {wishlist.length > 0 && (
            <span style={badgeStyle}>{wishlist.length}</span>
          )}
        </button>

        {/* Cart Icon */}
        <button 
          onClick={() => navigate('cart')}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', position: 'relative' }}
        >
          <ShoppingBag size={20} />
          {cartItemsCount > 0 && (
            <span style={badgeStyle}>{cartItemsCount}</span>
          )}
        </button>

        {/* Notifications Icon */}
        <button 
          onClick={() => navigate('notifications')}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', position: 'relative' }}
        >
          <Bell size={20} style={{ fill: unreadNotificationsCount > 0 ? 'var(--color-primary)' : 'none', color: unreadNotificationsCount > 0 ? 'var(--color-primary)' : 'var(--text-main)' }} />
          {unreadNotificationsCount > 0 && (
            <span style={{...badgeStyle, backgroundColor: 'var(--color-primary)', color: 'var(--text-dark)'}}>{unreadNotificationsCount}</span>
          )}
        </button>

        {user ? (
          <button
            onClick={() => navigate('account')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              padding: '6px 14px',
              borderRadius: 'var(--border-radius-full)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '14px'
            }}
          >
            <User size={14} />
            <span>{user.username}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('auth')}
            className="glow-btn"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--border-radius-full)',
              fontSize: '14px'
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

const badgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-8px',
  backgroundColor: 'var(--color-accent)',
  color: '#ffffff',
  fontSize: '10px',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
