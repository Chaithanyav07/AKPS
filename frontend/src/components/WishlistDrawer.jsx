import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Paintbrush } from 'lucide-react';

export default function WishlistDrawer({ isOpen, onClose }) {
  const { wishlist, toggleWishlist, setSelectedProduct, setActiveView } = useApp();

  if (!isOpen) return null;

  const handleCustomize = (product) => {
    setSelectedProduct(product);
    setActiveView('customizer');
    onClose();
  };

  return (
    <div style={drawerOverlayStyle}>
      <div className="glass" style={drawerContentStyle}>
        {/* Header */}
        <div style={drawerHeaderStyle}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} /> Wishlist
          </h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={drawerBodyStyle}>
          {wishlist.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Your wishlist is empty</p>
              <button 
                onClick={() => { setActiveView('shop'); onClose(); }}
                className="glow-btn"
                style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-full)' }}
              >
                Explore Shop
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlist.map((item) => (
                <div key={item.id} style={itemCardStyle}>
                  {/* Color circle/icon */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    color: 'var(--color-primary)'
                  }}>
                    {item.type.toUpperCase()}
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>{item.name}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
                      Starting at ${item.basePrice.toFixed(2)}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button 
                        onClick={() => handleCustomize(item)}
                        className="glow-btn"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Paintbrush size={12} /> Design
                      </button>
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="outline-btn"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'var(--text-muted)'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const drawerOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  zIndex: 500,
  display: 'flex',
  justifyContent: 'flex-end',
  animation: 'fadeIn 0.2s ease'
};

const drawerContentStyle = {
  width: '100%',
  maxWidth: '440px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
};

const drawerHeaderStyle = {
  padding: '24px',
  borderBottom: '1px solid var(--glass-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer'
};

const drawerBodyStyle = {
  flexGrow: 1,
  padding: '24px',
  overflowY: 'auto'
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '70%',
  textAlign: 'center'
};

const itemCardStyle = {
  display: 'flex',
  gap: '16px',
  padding: '16px',
  borderRadius: 'var(--border-radius-sm)',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--glass-border)',
  alignItems: 'center'
};
