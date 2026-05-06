import React from 'react'
import { CheckCircle, Phone, MessageSquare } from 'lucide-react'

const PLANS = [
  {
    name: 'Free', price: '$0', period: 'forever', highlight: false,
    features: ['5 uploads per day', '20 MCQs per session', '10 Short questions', '5 Long questions', 'Basic difficulty'],
    cta: null, note: 'Your current plan'
  },
  {
    name: 'Basic', price: '$5', period: 'per month', highlight: true,
    features: ['20 uploads per day', '50 MCQs per session', '25 Short questions', '10 Long questions', 'All difficulty levels'],
    cta: 'Contact Admin to Upgrade'
  },
  {
    name: 'Advanced', price: '$15', period: 'per month', highlight: false,
    features: ['50 uploads per day', '300 MCQs per session', '75 Short questions', '25 Long questions', 'All difficulty levels'],
    cta: 'Contact Admin to Upgrade'
  },
]

export default function Plans() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>
          Choose Your <em style={{ color: 'var(--accent)', fontWeight: 300 }}>Plan</em>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>Unlock more power as you grow</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {PLANS.map(({ name, price, period, highlight, features, cta, note }) => (
          <div key={name} style={{
            background: highlight ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid ${highlight ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 20, padding: '36px 28px',
            position: 'relative',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = highlight ? '0 24px 60px rgba(200,169,110,0.3)' : '0 24px 60px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {highlight && (
              <div style={{
                position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--bg)', color: 'var(--accent)',
                fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.12em',
                padding: '4px 14px', borderRadius: 100, border: '1px solid var(--accent)'
              }}>POPULAR</div>
            )}

            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.12em', color: highlight ? 'rgba(5,5,8,0.6)' : 'var(--muted)', marginBottom: 12 }}>
              {name.toUpperCase()}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 28 }}>
              <span className="font-display" style={{ fontSize: '2.8rem', fontWeight: 700, color: highlight ? '#050508' : 'white', lineHeight: 1 }}>{price}</span>
              <span style={{ color: highlight ? 'rgba(5,5,8,0.5)' : 'var(--muted)', fontSize: '0.85rem' }}>/{period}</span>
            </div>

            <ul style={{ listStyle: 'none', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: highlight ? 'rgba(5,5,8,0.75)' : 'var(--muted)' }}>
                  <CheckCircle size={14} color={highlight ? '#050508' : 'var(--accent)'} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            {cta ? (
              <div style={{ background: highlight ? 'rgba(5,5,8,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '20px', border: `1px solid ${highlight ? 'rgba(5,5,8,0.15)' : 'var(--border)'}` }}>
                <p style={{ color: highlight ? 'rgba(5,5,8,0.8)' : 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 14, textAlign: 'center' }}>Contact Admin</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="tel:+923001234567" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    color: highlight ? '#050508' : 'var(--accent)', fontSize: '0.85rem',
                    textDecoration: 'none', fontWeight: 600
                  }}>
                    <Phone size={14} /> +92 300 123 4567
                  </a>
                  <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    color: highlight ? 'rgba(5,5,8,0.7)' : '#4ade80', fontSize: '0.85rem', textDecoration: 'none'
                  }}>
                    <MessageSquare size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{note}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment info */}
      <div className="card" style={{ padding: '28px 32px', display: 'flex', alignItems: 'flex-start', gap: 20, borderColor: 'rgba(200,169,110,0.15)' }}>
        <div style={{ width: 44, height: 44, background: 'var(--accent-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Phone size={18} color="var(--accent)" />
        </div>
        <div>
          <h3 style={{ color: 'white', fontWeight: 700, marginBottom: 8 }}>How to Upgrade</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Contact the admin via phone or WhatsApp. After payment confirmation (EasyPaisa, JazzCash, or bank transfer), your account will be upgraded within 24 hours.
          </p>
          <a href="tel:+923001234567" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: '0.875rem', marginTop: 12, textDecoration: 'none', fontWeight: 600 }}>
            <Phone size={14} /> +92 300 123 4567
          </a>
        </div>
      </div>
    </div>
  )
}
