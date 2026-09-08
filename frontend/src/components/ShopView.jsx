import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

export default function ShopView() {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery,
    setActiveView 
  } = useApp();

  // Filter categories
  const categories = [
    { key: 'all', name: 'All Collection' },
    { key: 'tshirt', name: 'T-Shirts' },
    { key: 'hoodie', name: 'Hoodies' },
    { key: 'sweatshirt', name: 'Sweatshirts' },
    { key: 'polo', name: 'Polo T-Shirts' },
    { key: 'bulk', name: 'Bulk Orders' }
  ];

  // Apply filters
  const filteredProducts = products.filter(product => {
    // Search match
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category match
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (catKey) => {
    if (catKey === 'bulk') {
      setActiveView('bulk');
    } else {
      setSelectedCategory(catKey);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Category Navigation Pills */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className="category-pill"
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--border-radius-full)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 500,
              background: selectedCategory === cat.key ? 'var(--color-primary)' : 'transparent',
              color: selectedCategory === cat.key ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--glass-border)',
              transition: 'var(--transition-fast)'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Shop Results Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
          {selectedCategory === 'all' ? 'All Customizable Apparel' : `${selectedCategory.toUpperCase()} templates`}
        </h2>
        {searchQuery && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Showing search results for "{searchQuery}"
          </p>
        )}
      </div>

      {/* Grid listing */}
      {filteredProducts.length === 0 ? (
        <div style={{
          padding: '64px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <PackageOpen size={48} style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No apparel matches your description filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
