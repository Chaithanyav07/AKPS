import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Check } from 'lucide-react';

export default function NotificationsDrawer({ isOpen, onClose }) {
  const { notifications, readNotification } = useApp();

  if (!isOpen) return null;

  return (
    <div style={drawerOverlayStyle}>
      <div className="glass" style={drawerContentStyle}>
        {/* Header */}
        <div style={drawerHeaderStyle}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} /> Notifications
          </h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={drawerBodyStyle}>
          {notifications.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => !n.read && readNotification(n.id)}
                  style={{
                    ...notificationCardStyle,
                    borderLeft: n.read ? '1px solid var(--glass-border)' : '4px solid var(--color-primary)',
                    backgroundColor: n.read ? 'rgba(24,24,27,0.01)' : 'rgba(24, 24, 27, 0.03)',
                    cursor: n.read ? 'default' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: n.read ? 500 : 700 }}>{n.title}</h4>
                    {!n.read && (
                      <span style={{ 
                        fontSize: '9px', 
                        backgroundColor: 'var(--color-primary)', 
                        color: '#ffffff', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: n.read ? 'var(--text-muted)' : 'var(--text-main)', marginBottom: '8px' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const drawerOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  zIndex: 500,
  display: 'flex',
  justifyContent: 'flex-end',
  animation: 'fadeIn 0.2s ease'
};

const drawerContentStyle = {
  width: '100%',
  maxWidth: '440px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
};

const drawerHeaderStyle = {
  padding: '24px',
  borderBottom: '1px solid var(--glass-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer'
};

const drawerBodyStyle = {
  flexGrow: 1,
  padding: '24px',
  overflowY: 'auto'
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '70%',
  textAlign: 'center'
};

const notificationCardStyle = {
  padding: '16px',
  borderRadius: 'var(--border-radius-sm)',
  border: '1px solid var(--glass-border)',
  transition: 'var(--transition-fast)'
};
