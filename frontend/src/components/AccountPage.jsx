import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User, Clock, Package, Phone, Mail, ChevronDown, ChevronUp,
  Truck, RotateCcw, FileText, Gift, Copy, CheckCircle, LogOut
} from 'lucide-react';

const SECTIONS = ['orders', 'customerCare', 'policies', 'inviteFriends'];

function SectionCard({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--text-main)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px' }}>
          {icon}{title}
        </span>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--glass-border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function PolicySection({ title, content }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', marginBottom: '10px', color: 'var(--color-primary)' }}>{title}</h4>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
        {content}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, orders, setActiveView, logout } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = user ? `AKPS-${user.id.slice(-6).toUpperCase()}` : '';

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode).catch(() => { });
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Please sign in to view your account details.</p>
        <button onClick={() => setActiveView('home')} className="glow-btn" style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-full)' }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>

      {/* Profile Header */}
      <div className="glass" style={{ padding: '28px 32px', borderRadius: 'var(--border-radius-lg)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 'bold', fontSize: '28px'
        }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div style={{ flexGrow: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '4px' }}>{user.username}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.email}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>ID: {user.id}</p>
        </div>
      </div>

      {/* --- ORDER HISTORY --- */}
      <SectionCard title="Order History" icon={<Clock size={18} />} defaultOpen={true}>
        {orders.length === 0 ? (
          <div style={{ paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>You haven't placed any orders yet.</p>
            <button
              onClick={() => setActiveView('shop')}
              className="glow-btn"
              style={{ padding: '8px 20px', borderRadius: 'var(--border-radius-full)', fontSize: '14px' }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '13px' }}>
                  <div>
                    <strong style={{ color: 'var(--color-primary)' }}>{order.id}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span style={{
                    background: 'rgba(24,24,27,0.07)', color: 'var(--color-primary)',
                    padding: '4px 10px', borderRadius: 'var(--border-radius-full)',
                    fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Package size={12} /> {order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>{item.name} <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(Size: {item.size} × {item.quantity})</span></span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Payment: </span><strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Total: </span><strong style={{ color: 'var(--color-primary)', fontSize: '15px' }}>₹{order.total.toFixed(2)}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* --- CUSTOMER CARE --- */}
      <SectionCard title="Customer Care" icon={<Phone size={18} />}>
        <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px', lineHeight: 1.7 }}>
            Our support team is available <strong>Monday – Saturday, 9 AM – 7 PM IST</strong>. Reach out through any of the options below and we'll get back to you shortly.
          </p>

          {/* Phone */}
          <a href="tel:+91-9148973040" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-sm)', padding: '16px 20px',
              cursor: 'pointer', transition: 'var(--transition-fast)'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Phone size={20} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Call Us</p>
                <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-primary)' }}>+91-9148973040</p>
              </div>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:happyadithya@gmail.com" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-sm)', padding: '16px 20px',
              cursor: 'pointer', transition: 'var(--transition-fast)'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #e11d48, #be123c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Mail size={20} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Email Us</p>
                <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-primary)' }}>happyadithya@gmail.com</p>
              </div>
            </div>
          </a>
        </div>
      </SectionCard>

      {/* --- POLICIES --- */}
      <SectionCard title="Policies" icon={<FileText size={18} />}>
        {/* Terms & Conditions */}
        <PolicySection
          title="📋 Terms & Conditions"
          content={
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>By placing an order on AKPS, you agree to our terms of service and privacy policy.</li>
              <li>All custom-designed products are made to order. Once production begins, cancellations are not accepted.</li>
              <li>Design files uploaded by customers remain their intellectual property. AKPS is not liable for copyright infringement caused by customer-uploaded designs.</li>
              <li>Prices are subject to change without prior notice. The price at checkout is final.</li>
              <li>AKPS reserves the right to refuse service for orders that violate our community guidelines.</li>
              <li>Disputes are governed under the jurisdiction of Bengaluru, Karnataka, India.</li>
            </ul>
          }
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '20px 0' }} />

        {/* Delivery & Shipping */}
        <PolicySection
          title="🚚 Delivery & Shipping Policy"
          content={
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Processing Time:</strong> 2–3 business days for standard items; 5–7 business days for bulk orders.</li>
              <li><strong>Standard Delivery:</strong> 5–8 business days after dispatch.</li>
              <li><strong>Express Delivery:</strong> 2–3 business days (additional charges apply at checkout).</li>
              <li><strong>Shipping Charge:</strong> Flat ₹17 on all orders.</li>
              <li>Tracking details will be shared via email and SMS once the order is dispatched.</li>
              <li>AKPS is not responsible for delays caused by courier partners or natural events beyond our control.</li>
              <li>Currently shipping within India only. International shipping coming soon!</li>
            </ul>
          }
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '20px 0' }} />

        {/* Returns & Refunds */}
        <PolicySection
          title="↩️ Return & Refunds Policy"
          content={
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Returns Window:</strong> 7 days from date of delivery for eligible items.</li>
              <li>Custom-printed products are <strong>non-returnable</strong> unless there is a manufacturing defect or wrong item delivered.</li>
              <li>To initiate a return, email us at <a href="mailto:happyadithya@gmail.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>happyadithya@gmail.com</a> with your order ID and photos of the issue.</li>
              <li><strong>Refunds:</strong> Approved refunds are processed within 5–7 business days to the original payment method.</li>
              <li>If the order is cancelled after shipping, the delivery charge will not be refunded.</li>
              <li>If returned and the order was placed via Cash on Delivery, shipping charges will not be refunded.</li>
              <li>Size exchange requests (for non-custom items) are accepted within 7 days, subject to availability.</li>
            </ul>
          }
        />
      </SectionCard>

      {/* --- INVITE FRIENDS & EARN --- */}
      <SectionCard title="Invite Friends & Earn" icon={<Gift size={18} />}>
        <div style={{ paddingTop: '20px' }}>
          {/* Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #52525b 100%)',
            borderRadius: 'var(--border-radius-md)',
            padding: '28px',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <Gift size={36} style={{ marginBottom: '10px', opacity: 0.9 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Share the Style, Earn Rewards!</h3>
            <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.6 }}>
              Invite your friends to AKPS. When they place their first order, <strong>you earn ₹150 credit</strong> and <strong>they get ₹100 off</strong> their first purchase!
            </p>
          </div>

          {/* Referral Code */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', fontWeight: 600 }}>Your Referral Code</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                flex: 1,
                background: 'var(--bg-tertiary)',
                border: '2px dashed var(--glass-border)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '14px 20px',
                fontFamily: 'monospace',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--color-primary)',
                textAlign: 'center'
              }}>
                {referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="glow-btn"
                style={{ padding: '14px 20px', borderRadius: 'var(--border-radius-sm)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                {copiedCode ? <CheckCircle size={15} /> : <Copy size={15} />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* How it works */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>How It Works</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { step: '1', text: 'Share your unique referral code with friends.' },
                { step: '2', text: 'Friend signs up on AKPS and places their first order using your code.' },
                { step: '3', text: 'Your friend gets ₹100 off their first order automatically.' },
                { step: '4', text: 'You receive ₹150 as wallet credit within 24 hours of their purchase.' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: 'var(--color-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '13px'
                  }}>
                    {item.step}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', paddingTop: '4px', lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings summary */}
          <div style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '14px'
          }}>
            {[
              { label: 'Total Referrals', value: '0' },
              { label: 'Credits Earned', value: '₹0' },
              { label: 'Pending Credits', value: '₹0' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>{stat.value}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Logout Button */}
      <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '16px' }}>
        <button
          onClick={logout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-full)',
            padding: '10px 28px',
            fontSize: '14px',
            color: 'var(--color-accent)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.07)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
        >
          <LogOut size={15} /> Log Out
        </button>
      </div>

    </div>
  );
}
