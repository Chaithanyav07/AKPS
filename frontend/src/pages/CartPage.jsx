import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, user, removeFromCart, updateCartQuantity, navigate } = useApp();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('auth');
      return;
    }
    navigate('checkout');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('shop')}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          marginBottom: '24px', transition: 'var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Continue Shopping
      </button>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Your cart is empty.</p>
          <button 
            onClick={() => navigate('shop')}
            className="glow-btn"
            style={{ padding: '12px 24px', borderRadius: 'var(--border-radius-full)' }}
          >
            Shop Apparel
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.cartId} style={{
                display: 'flex',
                gap: '16px',
                padding: '20px',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                alignItems: 'center'
              }}>
                {/* Visual Swatch */}
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  backgroundColor: item.customization?.color || item.color || '#111111',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                  position: 'relative',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  fontSize: '12px'
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

                {/* Info */}
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Size: <strong style={{ color: 'var(--text-main)' }}>{item.size}</strong> | Color: <span style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: item.customization?.color || item.color || '#111111',
                      verticalAlign: 'middle',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }} />
                  </p>
                  {item.customization?.text && (
                    <p style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '2px' }}>
                      Custom Text: "{item.customization.text}"
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                      <button 
                        onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 12px', fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.cartId)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Subtotal</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)' }}>₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className="glow-btn"
              style={{ width: '100%', padding: '16px', borderRadius: 'var(--border-radius-sm)', fontSize: '16px' }}
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
