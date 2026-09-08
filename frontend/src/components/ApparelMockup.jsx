import React from 'react';

/**
 * High-definition, realistic SVG Apparel Mockup Generator
 * Handles dynamic fabric tinting, realistic highlights, shadows, folds, and artwork overlays.
 */
export default function ApparelMockup({
  type = 'tshirt',
  color = '#111111',
  view = 'front', // 'front' | 'back'
  designStyle = null,
  designColor = '#FFFFFF',
  designPlacement = 'chest', // 'chest' | 'pocket' | 'back'
  customText = '',
  textColor = '#FFFFFF',
  textFont = 'Outfit',
  textSize = 16,
  textY = 50,
  customImage = null,
  embroideryFile = null,
  width = '100%',
  height = '100%',
  showShadow = true
}) {
  // Determine if apparel color is light or dark for optimal contrast
  const isLightColor = (hex) => {
    if (!hex) return false;
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return false;
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160;
  };

  const lightGarment = isLightColor(color);
  const shadowOpacity = lightGarment ? 0.25 : 0.45;
  const highlightOpacity = lightGarment ? 0.4 : 0.15;
  const strokeColor = lightGarment ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.15)';

  // Calculate design graphics placement
  const getDesignPlacementStyle = () => {
    if (view === 'back') {
      return {
        position: 'absolute',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '55%',
        height: '45%',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }

    if (designPlacement === 'pocket') {
      return {
        position: 'absolute',
        top: type === 'polo' ? '38%' : '34%',
        left: '34%',
        transform: 'translate(-50%, -50%)',
        width: '24%',
        height: '24%',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }

    // Default: Chest Center
    return {
      position: 'absolute',
      top: type === 'hoodie' ? '46%' : type === 'polo' ? '48%' : '42%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '46%',
      height: '38%',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
  };

  return (
    <div style={{
      position: 'relative',
      width: width,
      height: height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Dynamic Realistic Garment SVG */}
      <svg
        viewBox="0 0 500 520"
        style={{
          width: '100%',
          height: '100%',
          filter: showShadow ? 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.25))' : 'none'
        }}
      >
        <defs>
          {/* Subtle realistic lighting gradients */}
          <linearGradient id={`fabric-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={highlightOpacity} />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="85%" stopColor="#000000" stopOpacity={shadowOpacity} />
          </linearGradient>

          <radialGradient id={`fabric-center-${type}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={highlightOpacity * 0.8} />
            <stop offset="100%" stopColor="#000000" stopOpacity={shadowOpacity * 0.8} />
          </radialGradient>

          {/* Heather texture pattern */}
          <filter id="fabric-texture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
            <feComposite in2="SourceGraphic" in="gl" operator="in" />
          </filter>
        </defs>

        {/* ----------------- 1. T-SHIRT MOCKUP ----------------- */}
        {type === 'tshirt' && (
          <g>
            {/* Main Body Silhouette */}
            <path
              d="M 170 85 
                 C 150 88, 120 100, 75 145 
                 C 65 155, 55 180, 45 225 
                 C 40 245, 60 260, 85 250 
                 C 105 240, 125 215, 135 195 
                 L 130 450 
                 C 130 460, 140 470, 160 470 
                 L 340 470 
                 C 360 470, 370 460, 370 450 
                 L 365 195 
                 C 375 215, 395 240, 415 250 
                 C 440 260, 460 245, 455 225 
                 C 445 180, 435 155, 425 145 
                 C 380 100, 350 88, 330 85 
                 C 300 85, 290 120, 250 120 
                 C 210 120, 200 85, 170 85 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Fabric Lighting Gradients */}
            <path
              d="M 170 85 
                 C 150 88, 120 100, 75 145 
                 C 65 155, 55 180, 45 225 
                 C 40 245, 60 260, 85 250 
                 C 105 240, 125 215, 135 195 
                 L 130 450 
                 C 130 460, 140 470, 160 470 
                 L 340 470 
                 C 360 470, 370 460, 370 450 
                 L 365 195 
                 C 375 215, 395 240, 415 250 
                 C 440 260, 460 245, 455 225 
                 C 445 180, 435 155, 425 145 
                 C 380 100, 350 88, 330 85 
                 C 300 85, 290 120, 250 120 
                 C 210 120, 200 85, 170 85 Z"
              fill={`url(#fabric-grad-${type})`}
            />

            {/* Collar Detail */}
            {view === 'front' ? (
              <>
                {/* Inner collar back */}
                <path
                  d="M 195 86 C 220 98, 280 98, 305 86 C 290 75, 210 75, 195 86 Z"
                  fill="rgba(0,0,0,0.3)"
                />
                {/* Front Ribbed Collar */}
                <path
                  d="M 180 85 C 205 130, 295 130, 320 85 C 300 115, 200 115, 180 85 Z"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
              </>
            ) : (
              /* Back Collar */
              <path
                d="M 185 85 C 215 95, 285 95, 315 85"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
              />
            )}

            {/* Sleeve Seams & Hem Details */}
            <path d="M 135 195 C 150 160, 165 125, 170 85" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M 365 195 C 350 160, 335 125, 330 85" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M 60 235 L 85 250" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 440 235 L 415 250" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 132 455 L 368 455" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 2" />
          </g>
        )}

        {/* ----------------- 2. HOODIE MOCKUP ----------------- */}
        {type === 'hoodie' && (
          <g>
            {/* Hood Back Layer */}
            <path
              d="M 170 95 
                 C 150 30, 210 15, 250 15 
                 C 290 15, 350 30, 330 95 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <path
              d="M 170 95 C 150 30, 210 15, 250 15 C 290 15, 350 30, 330 95 Z"
              fill="rgba(0,0,0,0.25)"
            />

            {/* Main Body Silhouette */}
            <path
              d="M 175 105 
                 C 145 110, 110 130, 65 175 
                 C 50 195, 40 230, 35 285 
                 C 30 315, 55 330, 80 315 
                 C 95 305, 120 260, 130 220 
                 L 125 435 
                 L 120 470 
                 L 380 470 
                 L 375 435 
                 L 370 220 
                 C 380 260, 405 305, 420 315 
                 C 445 330, 470 315, 465 285 
                 C 460 230, 450 195, 435 175 
                 C 390 130, 355 110, 325 105 
                 C 290 115, 210 115, 175 105 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Lighting Overlay */}
            <path
              d="M 175 105 C 145 110, 110 130, 65 175 C 50 195, 40 230, 35 285 C 30 315, 55 330, 80 315 C 95 305, 120 260, 130 220 L 125 435 L 120 470 L 380 470 L 375 435 L 370 220 C 380 260, 405 305, 420 315 C 445 330, 470 315, 465 285 C 460 230, 450 195, 435 175 C 390 130, 355 110, 325 105 C 290 115, 210 115, 175 105 Z"
              fill={`url(#fabric-grad-${type})`}
            />

            {/* Front Kangaroo Pocket */}
            {view === 'front' && (
              <g>
                <path
                  d="M 175 340 
                     L 325 340 
                     L 355 435 
                     L 145 435 Z"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
                <path
                  d="M 175 340 L 325 340 L 355 435 L 145 435 Z"
                  fill="rgba(255,255,255,0.06)"
                />
                {/* Pocket Entry Openings */}
                <path d="M 175 340 L 145 435" stroke={strokeColor} strokeWidth="2.5" strokeDasharray="4 2" />
                <path d="M 325 340 L 355 435" stroke={strokeColor} strokeWidth="2.5" strokeDasharray="4 2" />
              </g>
            )}

            {/* Front Hood Collar & Drawstrings */}
            {view === 'front' ? (
              <g>
                {/* Overlapping Hood Collar */}
                <path
                  d="M 185 100 C 215 145, 285 145, 315 100 C 280 120, 220 120, 185 100 Z"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
                {/* Left Drawstring */}
                <path d="M 225 125 Q 220 180 215 220" fill="none" stroke={lightGarment ? '#111111' : '#FFFFFF'} strokeWidth="3" strokeLinecap="round" />
                <rect x="213" y="220" width="4" height="12" rx="1.5" fill="#D4AF37" />
                {/* Right Drawstring */}
                <path d="M 275 125 Q 280 180 285 220" fill="none" stroke={lightGarment ? '#111111' : '#FFFFFF'} strokeWidth="3" strokeLinecap="round" />
                <rect x="283" y="220" width="4" height="12" rx="1.5" fill="#D4AF37" />
              </g>
            ) : (
              /* Back Hood Drape */
              <path
                d="M 180 90 C 220 145, 280 145, 320 90"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
              />
            )}

            {/* Ribbed Hem & Cuffs */}
            <rect x="120" y="440" width="260" height="30" rx="3" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="45" y="295" width="35" height="20" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" transform="rotate(-30 45 295)" strokeDasharray="3 2" />
            <rect x="420" y="295" width="35" height="20" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" transform="rotate(30 420 295)" strokeDasharray="3 2" />
          </g>
        )}

        {/* ----------------- 3. SWEATSHIRT MOCKUP ----------------- */}
        {type === 'sweatshirt' && (
          <g>
            {/* Main Body Silhouette */}
            <path
              d="M 175 90 
                 C 145 95, 115 120, 70 165 
                 C 55 185, 45 220, 38 275 
                 C 32 305, 58 320, 80 305 
                 C 95 295, 120 250, 130 210 
                 L 125 435 
                 L 120 468 
                 L 380 468 
                 L 375 435 
                 L 370 210 
                 C 380 250, 405 295, 420 305 
                 C 442 320, 468 305, 462 275 
                 C 455 220, 445 185, 430 165 
                 C 385 120, 355 95, 325 90 
                 C 295 90, 285 120, 250 120 
                 C 215 120, 205 90, 175 90 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Lighting Overlay */}
            <path
              d="M 175 90 C 145 95, 115 120, 70 165 C 55 185, 45 220, 38 275 C 32 305, 58 320, 80 305 C 95 295, 120 250, 130 210 L 125 435 L 120 468 L 380 468 L 375 435 L 370 210 C 380 250, 405 295, 420 305 C 442 320, 468 305, 462 275 C 455 220, 445 185, 430 165 C 385 120, 355 95, 325 90 C 295 90, 285 120, 250 120 C 215 120, 205 90, 175 90 Z"
              fill={`url(#fabric-grad-${type})`}
            />

            {/* Classic Sweatshirt V-Stitch triangle at neck */}
            {view === 'front' && (
              <polygon points="238,125 262,125 250,142" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            )}

            {/* Raglan Sleeve Diagonal Seams */}
            <path d="M 195 95 L 130 210" fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 305 95 L 370 210" fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 2" />

            {/* Crew Neckline */}
            <path
              d="M 185 90 C 210 128, 290 128, 315 90 C 295 115, 205 115, 185 90 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Ribbed Hem & Cuffs */}
            <rect x="120" y="440" width="260" height="28" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="48" y="285" width="32" height="18" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" transform="rotate(-30 48 285)" strokeDasharray="3 2" />
            <rect x="420" y="285" width="32" height="18" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" transform="rotate(30 420 285)" strokeDasharray="3 2" />
          </g>
        )}

        {/* ----------------- 4. POLO T-SHIRT MOCKUP ----------------- */}
        {type === 'polo' && (
          <g>
            {/* Main Body Silhouette */}
            <path
              d="M 170 85 
                 C 150 88, 120 100, 75 145 
                 C 65 155, 55 180, 45 225 
                 C 40 245, 60 260, 85 250 
                 C 105 240, 125 215, 135 195 
                 L 130 450 
                 C 130 460, 140 470, 160 470 
                 L 340 470 
                 C 360 470, 370 460, 370 450 
                 L 365 195 
                 C 375 215, 395 240, 415 250 
                 C 440 260, 460 245, 455 225 
                 C 445 180, 435 155, 425 145 
                 C 380 100, 350 88, 330 85 
                 C 300 85, 290 120, 250 120 
                 C 210 120, 200 85, 170 85 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Fabric Gradient */}
            <path
              d="M 170 85 C 150 88, 120 100, 75 145 C 65 155, 55 180, 45 225 C 40 245, 60 260, 85 250 C 105 240, 125 215, 135 195 L 130 450 C 130 460, 140 470, 160 470 L 340 470 C 360 470, 370 460, 370 450 L 365 195 C 375 215, 395 240, 415 250 C 440 260, 460 245, 455 225 C 445 180, 435 155, 425 145 C 380 100, 350 88, 330 85 C 300 85, 290 120, 250 120 C 210 120, 200 85, 170 85 Z"
              fill={`url(#fabric-grad-${type})`}
            />

            {/* Front Polo Collar & 3-Button Placket */}
            {view === 'front' ? (
              <g>
                {/* 3-Button Placket Strip */}
                <rect x="238" y="115" width="24" height="90" fill={color} stroke={strokeColor} strokeWidth="1.5" />
                {/* 3 Pearl Buttons */}
                <circle cx="250" cy="135" r="3.5" fill="#FAFAFA" stroke="#999" strokeWidth="1" />
                <circle cx="250" cy="160" r="3.5" fill="#FAFAFA" stroke="#999" strokeWidth="1" />
                <circle cx="250" cy="185" r="3.5" fill="#FAFAFA" stroke="#999" strokeWidth="1" />

                {/* Left Collar Lapel */}
                <polygon points="175,85 250,118 215,145 180,110" fill={color} stroke={strokeColor} strokeWidth="2" />
                {/* Right Collar Lapel */}
                <polygon points="325,85 250,118 285,145 320,110" fill={color} stroke={strokeColor} strokeWidth="2" />
              </g>
            ) : (
              /* Back Collar */
              <path d="M 180 85 C 220 95, 280 95, 320 85" fill="none" stroke={strokeColor} strokeWidth="3" />
            )}

            {/* Ribbed Sleeve Cuffs */}
            <rect x="58" y="235" width="28" height="15" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 2" />
            <rect x="414" y="235" width="28" height="15" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        )}
      </svg>

      {/* ----------------- ARTWORK & TEXT OVERLAY LAYERS ----------------- */}

      {/* 1. Chosen Preset Design Graphic */}
      {designStyle && (
        <div style={getDesignPlacementStyle()}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}>
            {typeof designStyle.renderGraphic === 'function' ? (
              designStyle.renderGraphic(designColor || (lightGarment ? '#111111' : '#FFFFFF'))
            ) : (
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: designColor }}>
                {designStyle.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Custom User Text Layer */}
      {customText && (
        <div style={{
          position: 'absolute',
          top: `${textY}%`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          textAlign: 'center',
          pointerEvents: 'none',
          color: textColor,
          fontFamily: textFont,
          fontSize: `${textSize}px`,
          fontWeight: 800,
          wordBreak: 'break-word',
          lineHeight: 1.2,
          textShadow: lightGarment 
            ? '0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.4)' 
            : '0 2px 4px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.6)',
          transition: 'top 0.1s ease',
          zIndex: 5
        }}>
          {customText}
        </div>
      )}

      {/* 3. Uploaded PNG Custom Image */}
      {customImage && (
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '6px 12px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1.5px dashed var(--color-primary)',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          zIndex: 6
        }}>
          🖼️ {customImage.name ? (customImage.name.length > 14 ? customImage.name.substring(0, 11) + '...' : customImage.name) : 'Custom PNG Logo'}
        </div>
      )}

      {/* 4. Uploaded Embroidery .DST File */}
      {embroideryFile && (
        <div style={{
          position: 'absolute',
          top: '68%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '4px 10px',
          background: 'rgba(245, 158, 11, 0.95)',
          color: '#000',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '1px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          zIndex: 6
        }}>
          🧵 EMBROIDERY (.DST)
        </div>
      )}
    </div>
  );
}
