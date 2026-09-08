import React from 'react';

export const COLOR_PALETTES = [
  { name: 'Midnight Black', hex: '#111111', textColor: '#FFFFFF' },
  { name: 'Pure White', hex: '#F8F9FA', textColor: '#111111' },
  { name: 'Ash Grey', hex: '#9CA3AF', textColor: '#111111' },
  { name: 'Deep Navy', hex: '#1E293B', textColor: '#FFFFFF' },
  { name: 'Forest Green', hex: '#14532D', textColor: '#FFFFFF' },
  { name: 'Crimson Wine', hex: '#881337', textColor: '#FFFFFF' },
  { name: 'Sand Khaki', hex: '#D4A373', textColor: '#111111' },
  { name: 'Cobalt Blue', hex: '#2563EB', textColor: '#FFFFFF' },
  { name: 'Dusty Lilac', hex: '#A855F7', textColor: '#FFFFFF' },
  { name: 'Terracotta', hex: '#EA580C', textColor: '#FFFFFF' },
  { name: 'Olive Green', hex: '#4D7C0F', textColor: '#FFFFFF' },
  { name: 'Charcoal', hex: '#374151', textColor: '#FFFFFF' }
];

export const DESIGN_STYLES = [
  {
    id: 'akps-athletic',
    name: 'AKPS Athletic 99',
    category: 'Typography',
    description: 'Vintage varsity arch typography with collegiate stars',
    renderGraphic: (color = '#FFFFFF') => (
      <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
        <defs>
          <path id="archCurve" d="M 15 75 Q 100 20 185 75" fill="transparent" />
        </defs>
        <text fill={color} fontSize="28" fontWeight="900" letterSpacing="4" fontFamily="'Outfit', sans-serif">
          <textPath href="#archCurve" startOffset="50%" textAnchor="middle">
            AKPS ATHLETIC
          </textPath>
        </text>
        <text x="100" y="95" fill={color} fontSize="22" fontWeight="800" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          ★ 1999 ★
        </text>
        <text x="100" y="112" fill={color} opacity="0.8" fontSize="10" letterSpacing="3" textAnchor="middle" fontFamily="'Inter', sans-serif">
          ALWAYS KEEP PUSHING
        </text>
      </svg>
    )
  },
  {
    id: 'tokyo-streetwear',
    name: 'Tokyo Underground',
    category: 'Streetwear',
    description: 'Modern cyberpunk Tokyo kanji with brutalist box layout',
    renderGraphic: (color = '#FFFFFF') => (
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%' }}>
        <rect x="20" y="20" width="120" height="120" fill="none" stroke={color} strokeWidth="3" />
        <rect x="28" y="28" width="104" height="24" fill={color} />
        <text x="80" y="44" fill="#000000" fontSize="13" fontWeight="900" letterSpacing="2" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          AKPS // 東京
        </text>
        <text x="80" y="85" fill={color} fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          STYLE
        </text>
        <text x="80" y="110" fill={color} fontSize="14" letterSpacing="6" textAnchor="middle" fontFamily="'Inter', sans-serif">
          限界突破
        </text>
        <line x1="28" y1="124" x2="132" y2="124" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    )
  },
  {
    id: 'minimal-box-logo',
    name: 'Monochrome Box Logo',
    category: 'Minimalist',
    description: 'Clean luxury minimalist branded chest box',
    renderGraphic: (color = '#FFFFFF') => (
      <svg viewBox="0 0 180 60" style={{ width: '100%', height: '100%' }}>
        <rect x="10" y="10" width="160" height="40" rx="4" fill={color} />
        <text x="90" y="36" fill="#111111" fontSize="16" fontWeight="900" letterSpacing="4" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          A · K · P · S
        </text>
      </svg>
    )
  },
  {
    id: 'mountain-trek',
    name: 'Alpine Adventure Trek',
    category: 'Outdoor',
    description: 'Geometric mountain peaks with rising sun adventure badge',
    renderGraphic: (color = '#FFFFFF') => (
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%' }}>
        <circle cx="80" cy="80" r="60" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="80" cy="55" r="16" fill={color} opacity="0.4" />
        <polygon points="40,110 80,45 120,110" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="65,110 95,65 125,110" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" opacity="0.7" />
        <text x="80" y="130" fill={color} fontSize="9" fontWeight="800" letterSpacing="3" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          SEEK HIGHER GROUND
        </text>
      </svg>
    )
  },
  {
    id: 'embroidered-crest',
    name: 'Heritage Crest Monogram',
    category: 'Embroidery',
    description: 'Stitched luxury laurel wreath and monogram emblem',
    renderGraphic: (color = '#F59E0B') => (
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%' }}>
        <circle cx="80" cy="80" r="58" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 2" />
        <path d="M 45 95 C 40 60 60 40 80 40 C 100 40 120 60 115 95" fill="none" stroke={color} strokeWidth="2" />
        <text x="80" y="86" fill={color} fontSize="26" fontWeight="900" textAnchor="middle" fontFamily="'Georgia', serif" fontStyle="italic">
          AK
        </text>
        <text x="80" y="112" fill={color} fontSize="9" fontWeight="700" letterSpacing="3" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          EST. 2024
        </text>
      </svg>
    )
  },
  {
    id: 'cyber-skull',
    name: 'Cyberwave Circuit',
    category: 'Streetwear',
    description: 'Neo-futuristic glowing tech grid with digital pulse',
    renderGraphic: (color = '#00F2FE') => (
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%' }}>
        <polygon points="80,25 130,55 130,110 80,140 30,110 30,55" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="80" cy="80" r="28" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="5 3" />
        <line x1="80" y1="35" x2="80" y2="130" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <line x1="38" y1="80" x2="122" y2="80" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <text x="80" y="85" fill={color} fontSize="12" fontWeight="900" letterSpacing="2" textAnchor="middle" fontFamily="'Courier New', monospace">
          AKPS//99
        </text>
      </svg>
    )
  },
  {
    id: 'botanical-rose',
    name: 'Stitched Botanical Rose',
    category: 'Embroidery',
    description: 'Delicate floral needlework outline for pocket or chest',
    renderGraphic: (color = '#F43F5E') => (
      <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%' }}>
        <path d="M70,35 C55,25 45,40 55,55 C65,70 70,85 70,115 M70,75 C85,60 100,70 95,85 C90,95 75,100 70,115 M70,55 C80,45 90,50 85,62" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="70" cy="38" r="8" fill="none" stroke={color} strokeWidth="2" />
        <text x="70" y="132" fill={color} fontSize="8" fontWeight="600" letterSpacing="2" textAnchor="middle" fontFamily="'Georgia', serif" fontStyle="italic">
          always keep pushing
        </text>
      </svg>
    )
  },
  {
    id: 'roaring-tiger',
    name: 'Vintage Tiger Mascot',
    category: 'Vintage',
    description: 'Classic heritage collegiate tiger badge',
    renderGraphic: (color = '#F59E0B') => (
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%' }}>
        <circle cx="80" cy="80" r="62" fill="none" stroke={color} strokeWidth="3" />
        <polygon points="55,55 45,35 65,45" fill={color} />
        <polygon points="105,55 115,35 95,45" fill={color} />
        <circle cx="80" cy="80" r="35" fill="none" stroke={color} strokeWidth="2" />
        <ellipse cx="68" cy="74" rx="4" ry="6" fill={color} />
        <ellipse cx="92" cy="74" rx="4" ry="6" fill={color} />
        <polygon points="80,88 74,80 86,80" fill={color} />
        <path d="M72,96 Q80,104 88,96" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <text x="80" y="128" fill={color} fontSize="11" fontWeight="900" letterSpacing="3" textAnchor="middle" fontFamily="'Outfit', sans-serif">
          AKPS ROAR
        </text>
      </svg>
    )
  }
];
