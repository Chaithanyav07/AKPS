import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Folder, FolderPlus, Trash2, Edit3, ArrowLeft, Heart, Paintbrush, Plus, Minus } from 'lucide-react';
import ApparelMockup from '../components/ApparelMockup';

export default function WishlistPage() {
  const { 
    wishlist, 
    wishlistFolders, 
    createFolder, 
    renameFolder, 
    deleteFolder, 
    addToFolder, 
    removeFromFolder, 
    toggleWishlist,
    setSelectedProduct, 
    navigate 
  } = useApp();

  const [activeFolderId, setActiveFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    setNewFolderName('');
  };

  const handleStartRename = (folder) => {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const handleSaveRename = (id) => {
    if (!editingName.trim()) return;
    renameFolder(id, editingName.trim());
    setEditingFolderId(null);
  };

  const handleCustomize = (product) => {
    setSelectedProduct(product);
    navigate('customizer');
  };

  const activeFolder = wishlistFolders.find(f => f.id === activeFolderId);
  
  // Determine which items to display
  let displayedItems = [];
  if (wishlistFolders.length === 0) {
    // 2. If no folders, directly show wishlist page with wishlisted items
    displayedItems = wishlist;
  } else if (activeFolderId === null) {
    // All items not in any folder, or just all wishlisted items generally
    displayedItems = wishlist;
  } else if (activeFolder) {
    // Show only items that belong to the active folder
    displayedItems = wishlist.filter(item => activeFolder.items.includes(item.id));
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Heart size={28} style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} /> Your Wishlist
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        
        {/* Wishlist Folders Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '20px', borderRadius: 'var(--border-radius-md)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Folder size={18} /> Folders
            </h3>

            {/* Folder creation form */}
            <form onSubmit={handleCreateFolder} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="New folder name..." 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
              <button 
                type="submit" 
                className="glow-btn"
                style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FolderPlus size={16} />
              </button>
            </form>

            {/* Folders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveFolderId(null)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: activeFolderId === null ? 'var(--bg-tertiary)' : 'transparent',
                  color: 'var(--text-main)',
                  fontWeight: activeFolderId === null ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-fast)'
                }}
              >
                <span>All Items</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({wishlist.length})</span>
              </button>

              {wishlistFolders.map(folder => (
                <div 
                  key={folder.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    background: activeFolderId === folder.id ? 'var(--bg-tertiary)' : 'transparent',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {editingFolderId === folder.id ? (
                    <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                      <input 
                        type="text" 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      />
                      <button 
                        onClick={() => handleSaveRename(folder.id)}
                        className="glow-btn"
                        style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveFolderId(folder.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-main)',
                          fontWeight: activeFolderId === folder.id ? 600 : 400,
                          cursor: 'pointer',
                          textAlign: 'left',
                          flexGrow: 1,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Folder size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{folder.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({folder.items.length})</span>
                      </button>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => handleStartRename(folder)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                          title="Rename Folder"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            if (activeFolderId === folder.id) setActiveFolderId(null);
                            deleteFolder(folder.id);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                          title="Delete Folder"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div>
          {displayedItems.length === 0 ? (
            <div className="glass" style={{ padding: '48px', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                No items found in this section.
              </p>
              <button 
                onClick={() => navigate('shop')}
                className="glow-btn"
                style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-full)' }}
              >
                Find Apparel templates
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {displayedItems.map(item => (
                <div key={item.id} className="glass" style={{
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative'
                }}>
                  {/* Item Image Swatch Placeholder */}
                  <div style={{
                    height: '170px',
                    background: 'linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    position: 'relative'
                  }}>
                    <div style={{ width: '130px', height: '130px' }}>
                      <ApparelMockup 
                        type={item.type} 
                        color={item.colors ? item.colors[0] : '#111111'} 
                      />
                    </div>
                  </div>

                  {/* Item Content */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</h4>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>
                      ₹{item.basePrice.toFixed(2)}
                    </p>

                    {/* Move folder selector option */}
                    {wishlistFolders.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Folder Location</label>
                        <select 
                          value={wishlistFolders.find(f => f.items.includes(item.id))?.id || ''}
                          onChange={(e) => {
                            const newFolderId = e.target.value;
                            // Remove from old folders first
                            wishlistFolders.forEach(f => {
                              if (f.items.includes(item.id)) {
                                removeFromFolder(item.id, f.id);
                              }
                            });
                            if (newFolderId) {
                              addToFolder(item.id, newFolderId);
                            }
                          }}
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                        >
                          <option value="">No Folder (All Items)</option>
                          {wishlistFolders.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button 
                        onClick={() => handleCustomize(item)}
                        className="glow-btn"
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: 'var(--border-radius-sm)',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Paintbrush size={12} /> Design
                      </button>
                      <button 
                        onClick={() => toggleWishlist(item)}
                        style={{
                          background: 'none',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '8px',
                          cursor: 'pointer',
                          color: 'var(--color-accent)'
                        }}
                        title="Remove from Wishlist"
                      >
                        <Heart size={14} style={{ fill: 'var(--color-accent)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
