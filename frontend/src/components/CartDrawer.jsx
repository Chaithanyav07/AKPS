import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity, setActiveView } = useApp();

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setActiveView('checkout');
    onClose();
  };

  return (
    <div style={drawerOverlayStyle}>
      <div className="glass" style={drawerContentStyle}>
        {/* Header */}
        <div style={drawerHeaderStyle}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>Your Cart</h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>

        {/* Cart items list */}
        <div style={drawerBodyStyle}>
          {cart.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Your cart is empty</p>
              <button 
                onClick={() => { setActiveView('shop'); onClose(); }}
                className="glow-btn"
                style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-full)' }}
              >
                Shop Apparel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div key={item.cartId} style={itemCardStyle}>
                  {/* Left: T-shirt preview swatch or mockup info */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    backgroundColor: item.customization?.color || item.color || '#111111',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#fff',
                    position: 'relative',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    fontSize: '11px'
                  }}>
                    {item.type ? item.type.toUpperCase() : 'APPAREL'}
                    {item.customization?.text && (
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        fontSize: '8px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        maxWidth: '90%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        "{item.customization.text}"
                      </span>
                    )}
                  </div>

                  {/* Mid: Info */}
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Size: <strong style={{ color: 'var(--text-main)' }}>{item.size}</strong> | Color: <span style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: item.customization?.color || item.color || '#111111',
                        verticalAlign: 'middle',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }} />
                    </p>
                    {item.customization?.text && (
                      <p style={{ fontSize: '11px', color: 'var(--color-primary)' }}>
                        Custom Text: "{item.customization.text}"
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)} 
                          style={qtyBtnStyle}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '12px' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)} 
                          style={qtyBtnStyle}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Right: Trash */}
                  <button 
                    onClick={() => removeFromCart(item.cartId)}
                    style={deleteBtnStyle}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={drawerFooterStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className="glow-btn"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--border-radius-sm)', fontSize: '16px' }}
            >
              Checkout Now
            </button>
          </div>
        )}
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

const qtyBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-main)',
  cursor: 'pointer',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '8px',
  transition: 'var(--transition-fast)'
};

const drawerFooterStyle = {
  padding: '24px',
  borderTop: '1px solid var(--glass-border)',
  background: 'var(--bg-secondary)'
};
