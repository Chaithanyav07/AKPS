import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(username, email, password);
    }
    setLoading(false);
    if (success) {
      // Clear forms
      setUsername('');
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.25s ease'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        borderRadius: 'var(--border-radius-lg)',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px', right: '16px',
            background: 'none', border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px', fontSize: '24px', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
          {isLogin ? 'Sign in to access your customized apparel collection' : 'Join us to design and purchase custom threads'}
        </p>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: '40px' }}
            />
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: '40px' }}
            />
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
          </div>

          <button 
            type="submit" 
            className="glow-btn"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: 'var(--border-radius-sm)',
              marginTop: '8px',
              fontSize: '16px'
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Modal Footer Toggle */}
        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}
