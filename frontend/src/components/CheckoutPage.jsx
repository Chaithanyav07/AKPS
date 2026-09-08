import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, placeOrder, setActiveView, setSelectedProduct, products, user, token, showToast, navigate } = useApp();

  const [shippingAddress, setShippingAddress] = useState({
    street: '12th Main Road, Indiranagar',
    city: 'Bengaluru',
    zip: '560038',
    district: 'Bengaluru Urban'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const VALID_COUPON = 'happy1729';
  const COUPON_DISCOUNT_PCT = 10; // 10% off

  const handleApplyCoupon = () => {
    if (couponInput.trim().toLowerCase() === VALID_COUPON) {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponError('Invalid coupon code. Try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Your shopping cart is currently empty.</p>
        <button onClick={() => setActiveView('shop')} className="glow-btn" style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-full)' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 17; // flat ₹17
  const tax = subtotal * 0.12; // 12% GST
  const discount = couponApplied ? (subtotal * COUPON_DISCOUNT_PCT) / 100 : 0;
  const total = subtotal + shipping + tax - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && !token) {
      if (showToast) showToast('Please sign in or create an account to place your order.', 'error');
      if (navigate) navigate('auth');
      else setActiveView('auth');
      return;
    }
    setSubmitting(true);
    const fullAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.zip}, ${shippingAddress.district}, Karnataka, India`;
    const success = await placeOrder(fullAddress, paymentMethod);
    setSubmitting(false);
    if (success) {
      if (navigate) navigate('account');
      else setActiveView('account');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '24px' }}>Checkout Details</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1.8fr))',
        gap: '32px'
      }}>
        {/* Left Form Panel */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Shipping Form */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} style={{ color: 'var(--color-primary)' }} /> Shipping Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>STREET ADDRESS</label>
                <input 
                  type="text" 
                  value={shippingAddress.street} 
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} 
                  placeholder="123 Creative St" 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CITY</label>
                  <input 
                    type="text" 
                    value={shippingAddress.city} 
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} 
                    placeholder="Mumbai" 
                    required 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>ZIP / POSTAL CODE</label>
                  <input 
                    type="text" 
                    value={shippingAddress.zip} 
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })} 
                    placeholder="400001" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>DISTRICT (KARNATAKA)</label>
                <select
                  value={shippingAddress.district}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                  required
                >
                  {[
                    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
                    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
                    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
                    'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
                    'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
                    'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Vijayanagara'
                  ].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Form */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} style={{ color: 'var(--color-primary)' }} /> Payment Options
            </h3>

            {/* Select Method */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { key: 'card', name: 'Credit Card' },
                { key: 'paypal', name: 'PayPal' },
                { key: 'cod', name: 'Cash on Delivery (COD)' },
                { key: 'upi', name: 'UPI' }
              ].map(method => (
                <button
                  key={method.key}
                  type="button"
                  onClick={() => setPaymentMethod(method.key)}
                  style={{
                    flex: 1, minWidth: '100px',
                    padding: '10px',
                    borderRadius: 'var(--border-radius-sm)',
                    cursor: 'pointer',
                    background: paymentMethod === method.key ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: paymentMethod === method.key ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    color: paymentMethod === method.key ? 'var(--color-primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* Simulated Form inputs depending on selection */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>CARD NUMBER</label>
                  <input 
                    type="text" 
                    placeholder="4000 1234 5678 9010" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    required 
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>EXPIRY DATE</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      required 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>CVC / CVV</label>
                    <input 
                      type="password" 
                      placeholder="123" 
                      maxLength="3" 
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Redirecting to PayPal securely upon submission.
              </p>
            )}

            {paymentMethod === 'cod' && (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Pay in cash when the order is delivered to your shipping address.
              </p>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label style={labelStyle}>UPI ID</label>
                <input type="text" placeholder="username@upi" required />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="glow-btn"
            disabled={submitting}
            style={{
              padding: '16px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '18px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={20} /> 
            {submitting 
              ? 'Placing Order...' 
              : paymentMethod === 'cod' 
                ? 'Place Order' 
                : `Pay ₹${total.toFixed(2)}`}
          </button>
        </form>

        {/* Right Summary Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} style={{ color: 'var(--color-primary)' }} /> Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cart.map(item => {
                const handleItemClick = () => {
                  const originalProduct = products.find(p => p.id === item.id || p.type === item.type);
                  if (originalProduct) {
                    setSelectedProduct(originalProduct);
                    setActiveView('customizer');
                  }
                };
                return (
                  <div 
                    key={item.cartId} 
                    onClick={handleItemClick}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '4px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    title="Click to customize this item"
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'underline' }}>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>
                        Size: {item.size} | Qty: {item.quantity}
                      </span>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', marginBottom: '16px' }} />

            {/* Pricing details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (GST 12%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                  <span>Coupon ({COUPON_DISCOUNT_PCT}% off)</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Coupon Code */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>COUPON CODE</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: couponApplied ? '1px solid #16a34a' : couponError ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                  disabled={couponApplied}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponInput.trim()}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--glass-border)',
                    background: couponApplied ? '#16a34a' : 'var(--color-primary)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: couponApplied || !couponInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: couponApplied || !couponInput.trim() ? 0.7 : 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {couponApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
              {couponError && <p style={{ fontSize: '12px', color: 'var(--color-accent)', marginTop: '6px' }}>{couponError}</p>}
              {couponApplied && <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px' }}>🎉 Coupon applied! You saved ₹{discount.toFixed(2)}.</p>}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', marginBottom: '16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
              <span>Total Cost</span>
              <span style={{ color: 'var(--color-primary)' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  fontWeight: 600
};
