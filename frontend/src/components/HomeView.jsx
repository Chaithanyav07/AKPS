import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShoppingCart, ShieldCheck, Truck, Scissors } from 'lucide-react';

export default function HomeView() {
  const { setActiveView, setSelectedCategory, products, setSelectedProduct } = useApp();

  const handleShopNow = (cat = 'all') => {
    setActiveView('shop');
    setSelectedCategory(cat);
  };

  const handleFeaturedDesign = () => {
    const defaultProduct = products.find(p => p.type === 'tshirt') || products[0];
    if (defaultProduct) {
      setSelectedProduct(defaultProduct);
      setActiveView('customizer');
    }
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'radial-gradient(circle at top right, rgba(24, 24, 27, 0.04), transparent 45%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative AKPS — top-left large italic watermark */}
        <span style={{
          position: 'absolute',
          top: '8%',
          left: '5%',
          fontFamily: "'Georgia', serif",
          fontStyle: 'italic',
          fontSize: '52px',
          fontWeight: 900,
          color: 'rgba(24, 24, 27, 0.05)',
          letterSpacing: '-4px',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1
        }}>AKPS</span>

        {/* Decorative AKPS — top-right monospace dots */}
        <span style={{
          position: 'absolute',
          top: '6%',
          right: '5%',
          fontFamily: "'Courier New', monospace",
          fontSize: '28px',
          fontWeight: 700,
          color: 'rgba(24, 24, 27, 0.06)',
          letterSpacing: '8px',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>A·K·P·S</span>

        {/* Decorative AKPS — bottom-left outlined */}
        <span style={{
          position: 'absolute',
          bottom: '10%',
          left: '3%',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '18px',
          fontWeight: 800,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(24, 24, 27, 0.10)',
          letterSpacing: '6px',
          userSelect: 'none',
          pointerEvents: 'none',
          textTransform: 'uppercase'
        }}>AKPS</span>

        {/* Decorative — bottom-right vertical rotated tagline */}
        <span style={{
          position: 'absolute',
          bottom: '15%',
          right: '3%',
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(24, 24, 27, 0.09)',
          letterSpacing: '3px',
          userSelect: 'none',
          pointerEvents: 'none',
          writingMode: 'vertical-rl',
          textTransform: 'uppercase'
        }}>always keep pushing style</span>

        {/* Decorative — mid-left subtle italic tagline */}
        <span style={{
          position: 'absolute',
          top: '45%',
          left: '2%',
          fontFamily: "'Georgia', serif",
          fontStyle: 'italic',
          fontSize: '11px',
          color: 'rgba(24, 24, 27, 0.12)',
          letterSpacing: '2px',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>Always Keep Pushing</span>

        {/* Main heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 64px)',
          lineHeight: 1.1,
          maxWidth: '850px',
          fontWeight: 800,
          position: 'relative',
          zIndex: 1
        }}>
          Wear Your Identity. <br />
          <span style={{
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Fully Customized Apparel.
          </span>
        </h1>

        {/* Subtitle with AKPS brand mention */}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(14px, 2vw, 18px)',
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <strong style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '1px'
          }}>AKPS</strong> — Always Keep Pushing Style.
          Create bespoke T-shirts, hoodies, sweatshirts, and polo shirts. Add text, pick colors, or upload logos instantly. <strong style={{ color: 'var(--text-main)' }}>Embroidery customisation also available.</strong>
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', position: 'relative', zIndex: 1 }}>
          <button onClick={handleFeaturedDesign} className="glow-btn" style={{ padding: '14px 28px', borderRadius: 'var(--border-radius-full)', fontSize: '16px' }}>
            Start Designing
          </button>
          <button onClick={() => handleShopNow('all')} className="outline-btn" style={{ padding: '14px 28px', borderRadius: 'var(--border-radius-full)', fontSize: '16px' }}>
            Explore Styles
          </button>
        </div>

        {/* A-K-P-S letter watermark row */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          opacity: 0.15,
          marginTop: '8px',
          userSelect: 'none',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '14px', letterSpacing: '4px' }}>A</span>
          <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '11px', fontWeight: 400 }}>always</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '14px', letterSpacing: '4px' }}>K</span>
          <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '11px', fontWeight: 400 }}>keep</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '14px', letterSpacing: '4px' }}>P</span>
          <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '11px', fontWeight: 400 }}>pushing</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '14px', letterSpacing: '4px' }}>S</span>
          <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '11px', fontWeight: 400 }}>style</span>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '24px', textAlign: 'center' }}>
          Choose A Category
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {[
            { name: 'T-Shirts', key: 'tshirt', icon: '👕' },
            { name: 'Hoodies', key: 'hoodie', icon: '🧥' },
            { name: 'Sweatshirts', key: 'sweatshirt', icon: '👚' },
            { name: 'Polo Shirts', key: 'polo', icon: '👔' },
            { name: 'Bulk Orders', key: 'bulk', icon: '📦' }
          ].map(cat => (
            <div
              key={cat.key}
              onClick={() => cat.key === 'bulk' ? setActiveView('bulk') : handleShopNow(cat.key)}
              className="glass"
              style={{
                padding: '32px 24px',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                border: '1px solid var(--glass-border)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{cat.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                {cat.key === 'bulk' ? 'Special wholesale pricing' : 'Premium materials & print'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Value Props */}
      <section style={{
        margin: '64px auto',
        maxWidth: '1200px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px'
      }}>
        {[
          { title: 'Dynamic Editor', desc: 'Personalize designs, font styles, colors, and layout on our custom canvas editor.', icon: <Sparkles size={24} style={{ color: 'var(--color-primary)' }} /> },
          { title: 'Embroidery Available', desc: 'Premium thread embroidery stitched directly onto your garment — built to last and looks stunning.', icon: <Scissors size={24} style={{ color: '#F59E0B' }} /> },
          { title: 'Zero Minimums', desc: 'No minimum order quantities for custom items. Order 1 or 1,000 apparel.', icon: <ShoppingCart size={24} style={{ color: 'var(--color-secondary)' }} /> },
          { title: 'Eco Friendly Ink', desc: 'We print using water-based non-toxic inks, safe for both skin and nature.', icon: <ShieldCheck size={24} style={{ color: 'var(--color-accent)' }} /> },
          { title: 'Bulk Discounts', desc: 'Need outfits for team members? Request bulk quotes with customized specs.', icon: <Truck size={24} style={{ color: '#10B981' }} /> }
        ].map((f, idx) => (
          <div key={idx} className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
            <div style={{ marginBottom: '16px' }}>{f.icon}</div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
