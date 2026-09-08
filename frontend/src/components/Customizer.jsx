import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingCart, Heart, ArrowLeft, Type, Upload, Check, 
  RotateCw, Sparkles, Scissors, Palette, Layers, Eye, Sliders
} from 'lucide-react';
import ApparelMockup from './ApparelMockup';
import { DESIGN_STYLES, COLOR_PALETTES } from '../data/mockupDesigns';

export default function Customizer() {
  const { selectedProduct, addToCart, setActiveView, toggleWishlist, wishlist } = useApp();

  // Redirect if no product is selected
  if (!selectedProduct) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No apparel template selected for customization.</p>
        <button onClick={() => setActiveView('shop')} className="glow-btn" style={{ padding: '10px 24px', borderRadius: 'var(--border-radius-full)' }}>
          Choose Template
        </button>
      </div>
    );
  }

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState('styles'); // 'styles' | 'color' | 'text' | 'upload'

  // Customizer States
  const [selectedColor, setSelectedColor] = useState(
    selectedProduct.selectedColor || (selectedProduct.colors ? selectedProduct.colors[0] : '#111111')
  );
  const [garmentView, setGarmentView] = useState('front'); // 'front' | 'back'
  
  // Design Styles States
  const [selectedDesign, setSelectedDesign] = useState(selectedProduct.selectedDesign || DESIGN_STYLES[0]);
  const [designCategory, setDesignCategory] = useState('All');
  const [designColor, setDesignColor] = useState('#FFFFFF');
  const [designPlacement, setDesignPlacement] = useState('chest'); // 'chest' | 'pocket' | 'back'

  // Custom Text States
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textFont, setTextFont] = useState('Outfit');
  const [textSize, setTextSize] = useState(18);
  const [textY, setTextY] = useState(50); // Elevation slider (30% to 75%)

  // Sizing and Quantity
  const [size, setSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  
  // Custom image / embroidery upload states
  const [customImage, setCustomImage] = useState(null);
  const [embroideryFile, setEmbroideryFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [embroideryError, setEmbroideryError] = useState('');

  const imageInputRef = useRef(null);
  const embroideryInputRef = useRef(null);

  // Accurate Base Prices
  const getBasePrice = () => {
    if (selectedProduct.basePrice) return selectedProduct.basePrice;
    switch (selectedProduct.type) {
      case 'tshirt': return 399;
      case 'hoodie': return 799;
      case 'sweatshirt': return 699;
      case 'polo': return 359;
      default: return 399;
    }
  };

  const basePrice = getBasePrice();
  const hasCustomization = Boolean(selectedDesign || customText.trim() || customImage || embroideryFile);
  const customizationFee = hasCustomization ? 150 : 0;
  const singlePrice = basePrice + customizationFee;
  const totalPrice = singlePrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: `${selectedProduct.id}-${Date.now()}`,
      name: `${selectedDesign ? selectedDesign.name : 'Custom'} ${selectedProduct.name}`,
      type: selectedProduct.type,
      price: singlePrice,
      size,
      quantity,
      color: selectedColor,
      designStyle: selectedDesign ? selectedDesign.name : null,
      customText: customText.trim() || null,
      customization: {
        color: selectedColor,
        view: garmentView,
        designPlacement,
        designStyleId: selectedDesign ? selectedDesign.id : null,
        designName: selectedDesign ? selectedDesign.name : null,
        text: customText,
        textColor,
        font: textFont,
        textSize,
        textY,
        customImageName: customImage ? customImage.name : null,
        embroideryFileName: embroideryFile ? embroideryFile.name : null
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'image/png') {
      setImageError('Please upload pictures in PNG format only.');
      setCustomImage(null);
      return;
    }
    setImageError('');
    setCustomImage(file);
  };

  const handleEmbroideryUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'dst') {
      setEmbroideryError('Embroidery designs must be in .dst format only.');
      setEmbroideryFile(null);
      return;
    }
    setEmbroideryError('');
    setEmbroideryFile(file);
  };

  const isWishlisted = wishlist.some(w => w.id === selectedProduct.id);

  const categories = ['All', 'Typography', 'Streetwear', 'Minimalist', 'Vintage', 'Embroidery', 'Outdoor'];
  const filteredDesigns = designCategory === 'All' 
    ? DESIGN_STYLES 
    : DESIGN_STYLES.filter(d => d.category === designCategory);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveView('shop')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 600, transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="glass" style={{ padding: '6px 14px', borderRadius: 'var(--border-radius-full)', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
            ✨ AKPS Custom Design Studio
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1.1fr) minmax(360px, 1.3fr)',
        gap: '36px',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: LIVE MOCKUP PREVIEW CANVAS */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass" style={{
            borderRadius: 'var(--border-radius-lg)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            
            {/* Top Toolbar on Mockup: View Switcher & Wishlist */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              {/* Front / Back Toggle Buttons */}
              <div style={{
                display: 'flex',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '3px',
                borderRadius: 'var(--border-radius-full)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}>
                <button
                  type="button"
                  onClick={() => setGarmentView('front')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'var(--border-radius-full)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: garmentView === 'front' ? 'var(--color-primary)' : 'transparent',
                    color: garmentView === 'front' ? '#FFFFFF' : '#333333',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => setGarmentView('back')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'var(--border-radius-full)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: garmentView === 'back' ? 'var(--color-primary)' : 'transparent',
                    color: garmentView === 'back' ? '#FFFFFF' : '#333333',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Back View
                </button>
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(selectedProduct)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '50%',
                  width: '38px', height: '38px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: isWishlisted ? 'var(--color-accent)' : '#111111',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <Heart size={18} style={{ fill: isWishlisted ? 'var(--color-accent)' : 'none' }} />
              </button>
            </div>

            {/* High-Definition Apparel Mockup Display */}
            <div style={{ width: '320px', height: '330px', position: 'relative' }}>
              <ApparelMockup 
                type={selectedProduct.type}
                color={selectedColor}
                view={garmentView}
                designStyle={selectedDesign}
                designColor={designColor}
                designPlacement={designPlacement}
                customText={customText}
                textColor={textColor}
                textFont={textFont}
                textSize={textSize}
                textY={textY}
                customImage={customImage}
                embroideryFile={embroideryFile}
              />
            </div>

            {/* Current Mockup Spec Bar */}
            <div style={{
              marginTop: '16px',
              padding: '10px 16px',
              borderRadius: 'var(--border-radius-md)',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(0,0,0,0.08)',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: '#666' }}>Apparel: </span>
                <strong style={{ color: '#111' }}>{selectedProduct.name}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#666' }}>Color:</span>
                <span style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: selectedColor,
                  border: '1px solid #ccc'
                }} />
                <span style={{ fontWeight: 600, color: '#111' }}>{selectedColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CUSTOMIZATION TOOLKIT */}
        <div className="glass" style={{
          borderRadius: 'var(--border-radius-lg)',
          padding: '32px',
          border: '1px solid var(--glass-border)'
        }}>
          
          {/* Header Title */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              {selectedProduct.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {selectedProduct.description}
            </p>
          </div>

          {/* Tool Tabs Switcher */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '12px',
            marginBottom: '24px',
            overflowX: 'auto'
          }}>
            {[
              { key: 'styles', label: 'Choose Style', icon: <Sparkles size={16} /> },
              { key: 'color', label: 'Color & Fit', icon: <Palette size={16} /> },
              { key: 'text', label: 'Custom Text', icon: <Type size={16} /> },
              { key: 'upload', label: 'Upload Art / Logo', icon: <Upload size={16} /> }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: activeTab === tab.key ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab.key ? '#FFFFFF' : 'var(--text-main)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ---------------- TAB 1: PRESET DESIGN STYLES ---------------- */}
          {activeTab === 'styles' && (
            <div>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDesignCategory(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: designCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                      background: designCategory === cat ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                      color: designCategory === cat ? 'var(--color-primary)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Placement & Color Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.02)',
                padding: '12px 16px',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: '16px',
                border: '1px solid var(--glass-border)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    PRINT PLACEMENT
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { key: 'chest', label: 'Center Chest' },
                      { key: 'pocket', label: 'Left Badge' }
                    ].map(p => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setDesignPlacement(p.key)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: designPlacement === p.key ? 'var(--color-primary)' : 'transparent',
                          color: designPlacement === p.key ? '#fff' : 'var(--text-main)',
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    INK / ARTWORK COLOR
                  </span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {['#FFFFFF', '#111111', '#F59E0B', '#00F2FE', '#F43F5E', '#10B981'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDesignColor(c)}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: designColor === c ? '2px solid var(--color-primary)' : '1px solid #999',
                          cursor: 'pointer',
                          transform: designColor === c ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Designs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
                maxHeight: '340px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {/* Option to clear/blank */}
                <div
                  onClick={() => setSelectedDesign(null)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--border-radius-md)',
                    border: selectedDesign === null ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: selectedDesign === null ? 'rgba(0, 242, 254, 0.08)' : 'rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '120px'
                  }}
                >
                  <span style={{ fontSize: '24px', marginBottom: '6px' }}>🚫</span>
                  <strong style={{ fontSize: '12px' }}>Blank Apparel</strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>No preset graphic</span>
                </div>

                {filteredDesigns.map(design => {
                  const isSelected = selectedDesign && selectedDesign.id === design.id;
                  return (
                    <div
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--border-radius-md)',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '60px', height: '60px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {design.renderGraphic(isSelected ? 'var(--color-primary)' : '#555555')}
                      </div>
                      <strong style={{ fontSize: '11px', lineHeight: '1.2', marginBottom: '3px' }}>{design.name}</strong>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{design.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- TAB 2: COLOR & SIZING ---------------- */}
          {activeTab === 'color' && (
            <div>
              {/* Apparel Palette Swatches */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                  CURATED APPAREL COLORS ({COLOR_PALETTES.length})
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '10px'
                }}>
                  {COLOR_PALETTES.map(palette => {
                    const isSelected = selectedColor.toLowerCase() === palette.hex.toLowerCase();
                    return (
                      <button
                        key={palette.hex}
                        type="button"
                        onClick={() => setSelectedColor(palette.hex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                          background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(0,0,0,0.02)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: palette.hex,
                          border: '1px solid rgba(0,0,0,0.2)',
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: 'var(--text-main)' }}>
                          {palette.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hex Color Picker */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  OR PICK CUSTOM HEX:
                </label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    background: 'none'
                  }}
                />
                <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700 }}>
                  {selectedColor.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* ---------------- TAB 3: CUSTOM TEXT & TYPOGRAPHY ---------------- */}
          {activeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  PERSONALIZED TEXT
                </label>
                <input
                  type="text"
                  placeholder="e.g. YOUR NAME, SQUAD, 1999"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--glass-border)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Font Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    FONT STYLE
                  </label>
                  <select
                    value={textFont}
                    onChange={(e) => setTextFont(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)' }}
                  >
                    <option value="Outfit">Modern Clean (Outfit)</option>
                    <option value="Inter">Tech Sans (Inter)</option>
                    <option value="Georgia">Vintage Serif (Georgia)</option>
                    <option value="Courier New">Monospace (Courier)</option>
                  </select>
                </div>

                {/* Text Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    TEXT COLOR
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '42px' }}>
                    {['#FFFFFF', '#111111', '#F59E0B', '#00F2FE', '#F43F5E', '#10B981'].map(col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setTextColor(col)}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: col,
                          border: textColor === col ? '2px solid var(--color-primary)' : '1px solid #999',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Vertical Position Elevation Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>VERTICAL PLACEMENT: {textY}%</span>
                  <span>(Chest to Bottom)</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="75"
                  value={textY}
                  onChange={(e) => setTextY(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* Font Size Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>FONT SIZE: {textSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}

          {/* ---------------- TAB 4: UPLOAD CUSTOM PNG / EMBROIDERY ---------------- */}
          {activeTab === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* PNG Upload */}
              <div style={{
                border: '1.5px dashed var(--glass-border)',
                borderRadius: 'var(--border-radius-md)',
                padding: '20px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.02)'
              }}>
                <Upload size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Upload Custom Logo / Image</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Supports transparent PNG files for crisp DTG print.
                </p>
                <input
                  type="file"
                  accept=".png"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {customImage ? `Change (${customImage.name.substring(0, 15)}...)` : 'Select PNG File'}
                </button>
                {imageError && (
                  <p style={{ color: 'var(--color-accent)', fontSize: '11px', marginTop: '8px' }}>{imageError}</p>
                )}
              </div>

              {/* Embroidery .DST Upload */}
              <div style={{
                border: '1.5px dashed rgba(245, 158, 11, 0.4)',
                borderRadius: 'var(--border-radius-md)',
                padding: '20px',
                textAlign: 'center',
                background: 'rgba(245, 158, 11, 0.04)'
              }}>
                <Scissors size={24} style={{ color: '#F59E0B', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Custom Embroidery Stitching (.dst)</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Upload embroidery digitized stitch pattern file.
                </p>
                <input
                  type="file"
                  accept=".dst"
                  ref={embroideryInputRef}
                  onChange={handleEmbroideryUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => embroideryInputRef.current?.click()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--border-radius-sm)',
                    background: '#F59E0B',
                    color: '#000',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {embroideryFile ? `Change (${embroideryFile.name.substring(0, 15)}...)` : 'Select .DST Embroidery File'}
                </button>
                {embroideryError && (
                  <p style={{ color: 'var(--color-accent)', fontSize: '11px', marginTop: '8px' }}>{embroideryError}</p>
                )}
              </div>
            </div>
          )}

          {/* ---------------- SIZING & QUANTITY BAR ---------------- */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Size selector */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                CHOOSE SIZE
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['S', 'M', 'L', 'XL', '2XL'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: size === s ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)',
                      color: size === s ? '#FFFFFF' : 'var(--text-main)',
                      border: size === s ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                QUANTITY
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '32px', height: '32px', borderRadius: '4px',
                    border: '1px solid var(--glass-border)', background: 'transparent',
                    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                  }}
                >-</button>
                <span style={{ fontSize: '15px', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '4px',
                    border: '1px solid var(--glass-border)', background: 'transparent',
                    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                  }}
                >+</button>
              </div>
            </div>
          </div>

          {/* ---------------- PRICING & ADD TO CART ---------------- */}
          <div style={{
            marginTop: '24px',
            padding: '16px 20px',
            borderRadius: 'var(--border-radius-md)',
            background: 'rgba(0, 242, 254, 0.06)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Base: ₹{basePrice} {hasCustomization ? `+ ₹${customizationFee} Custom Art` : ''}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary)' }}>
                ₹{totalPrice.toFixed(0)}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="glow-btn"
              style={{
                padding: '14px 28px',
                borderRadius: 'var(--border-radius-full)',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ShoppingCart size={18} /> Add Customized Item To Cart
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
