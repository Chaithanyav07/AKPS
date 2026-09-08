import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Star, Paintbrush, MessageSquare, Sparkles } from 'lucide-react';
import ApparelMockup from './ApparelMockup';
import { DESIGN_STYLES } from '../data/mockupDesigns';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, setSelectedProduct, setActiveView } = useApp();
  const [selectedCardColor, setSelectedCardColor] = useState(product.colors ? product.colors[0] : '#111111');
  const [previewDesign, setPreviewDesign] = useState(DESIGN_STYLES[0]);

  const isWishlisted = wishlist.some(w => w.id === product.id);

  const handleCustomize = () => {
    setSelectedProduct({
      ...product,
      selectedColor: selectedCardColor,
      selectedDesign: previewDesign
    });
    setActiveView('customizer');
  };

  return (
    <div className="glass" style={{
      borderRadius: 'var(--border-radius-md)',
      overflow: 'hidden',
      transition: 'var(--transition-normal)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid var(--glass-border)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      {/* Wishlist Toggle Button */}
      <button 
        onClick={() => toggleWishlist(product)}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          color: isWishlisted ? 'var(--color-accent)' : '#111111',
          transition: 'var(--transition-fast)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Heart size={18} style={{ fill: isWishlisted ? 'var(--color-accent)' : 'none' }} />
      </button>

      {/* Realistic Mockup Visual Container */}
      <div style={{
        height: '270px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        borderBottom: '1px solid var(--glass-border)',
        overflow: 'hidden'
      }}>
        {/* Subtle background radial glow */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)',
          position: 'absolute'
        }} />

        {/* High-Definition Apparel Mockup */}
        <div style={{ width: '220px', height: '220px', position: 'relative' }}>
          <ApparelMockup 
            type={product.type}
            color={selectedCardColor}
            designStyle={previewDesign}
            designPlacement="chest"
          />
        </div>

        {/* Color Swatches on Hover / Interactive Row */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 'var(--border-radius-full)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.06)'
        }}>
          {product.colors && product.colors.slice(0, 6).map(col => (
            <button
              key={col}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCardColor(col);
              }}
              title={col}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: col,
                border: selectedCardColor === col ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transform: selectedCardColor === col ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            />
          ))}
          {product.colors && product.colors.length > 6 && (
            <span style={{ fontSize: '10px', color: '#666', lineHeight: '14px', fontWeight: 600 }}>
              +{product.colors.length - 6}
            </span>
          )}
        </div>
      </div>

      {/* Info & Reviews */}
      <ProductCardInfo 
        product={product} 
        onCustomize={handleCustomize}
        previewDesign={previewDesign}
        onSelectDesign={setPreviewDesign}
      />
    </div>
  );
}

function StarRating({ value, onChange, readonly = false, size = 16 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            padding: '1px',
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hovered || value) ? '#F59E0B' : '#d4d4d8'
          }}
        >
          <Star size={size} style={{ fill: star <= (hovered || value) ? '#F59E0B' : 'none', color: star <= (hovered || value) ? '#F59E0B' : '#d4d4d8' }} />
        </button>
      ))}
    </div>
  );
}

function ProductCardInfo({ product, onCustomize, previewDesign, onSelectDesign }) {
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setReviews(prev => [{
        id: Date.now(),
        name: reviewName.trim() || 'Anonymous',
        rating: reviewRating,
        text: reviewText.trim(),
        date: new Date().toLocaleDateString()
      }, ...prev]);
      setReviewText('');
      setReviewRating(0);
      setReviewName('');
      setSubmitting(false);
      setShowReviews(true);
      setShowAddReviewForm(false);
    }, 400);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>{product.name}</h3>
        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
          ₹{product.basePrice.toFixed(0)}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', flexGrow: 1, lineHeight: '1.4' }}>
        {product.description}
      </p>

      {/* Quick Design Style Picker */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
          ✨ Choose Style Graphic:
        </span>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {DESIGN_STYLES.slice(0, 4).map(design => (
            <button
              key={design.id}
              type="button"
              onClick={() => onSelectDesign(design)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: 'var(--border-radius-sm)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                background: previewDesign.id === design.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)',
                color: previewDesign.id === design.id ? '#FFFFFF' : 'var(--text-main)',
                border: previewDesign.id === design.id ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                transition: 'all 0.15s ease'
              }}
            >
              {design.name}
            </button>
          ))}
        </div>
      </div>

      {/* Customize Button */}
      <button
        onClick={onCustomize}
        className="glow-btn"
        style={{
          width: '100%',
          padding: '11px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        <Paintbrush size={16} /> Open Studio & Customize
      </button>

      {/* Reviews Section */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
            <MessageSquare size={12} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
            Reviews ({reviews.length})
          </p>
          <button
            onClick={() => setShowAddReviewForm(!showAddReviewForm)}
            style={{
              background: 'none',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {showAddReviewForm ? 'Cancel' : 'Write Review'}
          </button>
        </div>

        {showAddReviewForm && (
          <div style={{
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '12px',
            marginBottom: '10px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Rating:</label>
              <StarRating value={reviewRating} onChange={setReviewRating} size={18} />
            </div>
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={reviewName}
              onChange={e => setReviewName(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', fontSize: '12px', marginBottom: '6px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
            />
            <textarea
              placeholder="Share your thoughts on the quality, fit, and print..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '6px 8px', fontSize: '12px', marginBottom: '8px', borderRadius: '4px', border: '1px solid var(--glass-border)', resize: 'vertical' }}
            />
            <button
              onClick={handleSubmitReview}
              disabled={submitting || !reviewText.trim() || reviewRating === 0}
              style={{
                width: '100%',
                padding: '6px',
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        )}

        {reviews.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
            {reviews.map(r => (
              <div key={r.id} style={{ fontSize: '11px', background: 'rgba(0,0,0,0.02)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{r.name}</strong>
                  <StarRating value={r.rating} readonly size={10} />
                </div>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
