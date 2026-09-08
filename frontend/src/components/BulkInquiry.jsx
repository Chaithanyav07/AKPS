import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, User, Send, Sparkles } from 'lucide-react';

export default function BulkInquiry() {
  const { submitBulkOrder, setActiveView, user } = useApp();
  const [name, setName] = useState(user ? user.username : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('tshirt');
  const [quantity, setQuantity] = useState(5);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    // Must have format: something@domain.extension
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com)');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Final email validation before submit
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }
    if (!phone.trim()) {
      return; // phone is required, HTML5 validation handles it
    }
    setSubmitting(true);
    const success = await submitBulkOrder({
      name, email, phone, category, quantity: Number(quantity), description
    });
    setSubmitting(false);
    if (success) {
      setDescription('');
      setPhone('');
      setActiveView('home');
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass" style={{
        padding: '40px',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="glass" style={{
            padding: '6px 12px',
            borderRadius: 'var(--border-radius-full)',
            fontSize: '12px',
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px'
          }}>
            <Sparkles size={12} /> Bulk Wholesale Discount
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '8px' }}>
            Request Bulk Quote
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Ordering 5+ pieces? Submit details below to unlock exclusive tier discounts.
          </p>
        </div>

        {/* Inquiry Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Grid row: Name & Email */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>NAME</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>EMAIL</label>
              <input 
                type="email" 
                placeholder="yourname@company.com" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                required 
                style={{
                  borderColor: emailError ? 'var(--color-accent)' : undefined
                }}
              />
              {emailError && (
                <span style={{ fontSize: '11px', color: 'var(--color-accent)', marginTop: '4px', display: 'block' }}>
                  {emailError}
                </span>
              )}
            </div>
          </div>

          {/* Grid row: Phone & Category */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>PHONE NUMBER</label>
              <input 
                type="tel" 
                placeholder="+91 9876543210" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>APPAREL TYPE</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="tshirt">Custom T-Shirts</option>
                <option value="hoodie">Custom Hoodies</option>
                <option value="sweatshirt">Custom Sweatshirts</option>
                <option value="polo">Custom Polo T-Shirts</option>
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>ESTIMATED QUANTITY</label>
            <input 
              type="number" 
              min="5"
              placeholder="Enter quantity"
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(5, Number(e.target.value)))} 
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Minimum of 5 units required for bulk tier discount.
            </span>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>CUSTOMIZATION SPECIFICATIONS</label>
            <textarea 
              placeholder="Describe printing positions (front/back), logo sizes, thread configurations, colors, and design instructions..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="glow-btn"
            disabled={submitting || !!emailError}
            style={{
              padding: '14px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '16px',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: submitting || emailError ? 0.7 : 1
            }}
          >
            <Send size={16} /> {submitting ? 'Submitting Request...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
