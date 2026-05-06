import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Zap, Shield, ArrowRight, CheckCircle,
  FileText, Brain, Sparkles, ChevronDown, Star,
  Upload, Layers, Award
} from 'lucide-react'

// Floating orb component
function Orb({ style }) {
  return (
    <div className="gradient-blob gradient-blob--soft" style={{ ...style }} />
  )
}

// Animated counter
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = end / 60
        const timer = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Marquee strip
const MARQUEE_ITEMS = [
  'MCQ Generation', 'PDF Analysis', 'Short Questions', 'Long Questions',
  'Smart OCR', 'Instant Results', 'Exam Ready', 'Study Smarter',
]

export default function Home() {
  const heroRef = useRef()

  // Parallax on mouse move
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      if (heroRef.current) {
        heroRef.current.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Background gradient blobs (animated) */}
      <div className="gradient-blob gradient-blob--soft" style={{ width: 720, height: 720, top: -160, left: -220, opacity: 0.9, transform: 'translateZ(0)' }} />
      <div className="gradient-blob gradient-blob--teal" style={{ width: 520, height: 520, top: '30%', right: -160, opacity: 0.7, animationDuration: '18s' }} />
      <div className="gradient-blob gradient-blob--purple" style={{ width: 420, height: 420, bottom: -80, left: '40%', opacity: 0.6, animationDuration: '14s' }} />
      <div className="gradient-blob gradient-blob--soft" style={{ width: 260, height: 260, top: '55%', left: '65%', opacity: 0.5, animationDuration: '10s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(20px)',
        padding: '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BookOpen size={18} color="#050508" />
          </div>
          <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
            Mentra
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: '10px 22px' }}>Sign In</Link>
          <Link to="/signup" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '120px 48px 80px', textAlign: 'center', position: 'relative' }}>

        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent-dim)', border: '1px solid rgba(200,169,110,0.25)',
          borderRadius: 100, padding: '6px 18px', marginBottom: 32,
          color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono',
          letterSpacing: '0.1em'
        }}>
          <Sparkles size={13} />
          AI-POWERED STUDY ASSISTANT
        </div>

        {/* Headline */}
        <div ref={heroRef} style={{ transition: 'transform 0.1s ease-out' }}>
          <h1 className="animate-fade-up delay-100 font-display" style={{
            fontSize: 'clamp(3rem, 8vw, 7.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: 8
          }}>
            Turn Notes Into
          </h1>
          <h1 className="animate-fade-up delay-200 font-display" style={{
            fontSize: 'clamp(3rem, 8vw, 7.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: 'var(--accent)',
            marginBottom: 32
          }}>
            Exam Mastery
          </h1>
        </div>

        <p className="animate-fade-up delay-300" style={{
          color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8,
          maxWidth: 520, margin: '0 auto 48px', fontFamily: 'Syne'
        }}>
          Upload any PDF or image. Our AI extracts knowledge and generates
          exam-ready questions instantly — MCQs, short answers, essays.
        </p>

        <div className="animate-fade-up delay-400" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 8 }}>
            Start Free Today <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
            Sign In
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-up delay-600" style={{
          marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em'
        }}>
          <ChevronDown size={18} style={{ animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '18px 0', overflow: 'hidden', position: 'relative', marginBottom: 80
      }}>
        <div style={{ display: 'flex', width: 'max-content' }} className="animate-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              whiteSpace: 'nowrap', padding: '0 40px',
              color: i % 2 === 0 ? 'var(--muted)' : 'var(--accent)',
              fontFamily: 'JetBrains Mono', fontSize: '0.8rem',
              letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 16
            }}>
              {item}
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-hover)', display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ padding: '0 48px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
          {[
            { num: 300, suffix: '+', label: 'Questions per session' },
            { num: 3,   suffix: ' Plans', label: 'From free to advanced' },
            { num: 100, suffix: '%', label: 'AI-powered generation' },
          ].map(({ num, suffix, label }, i) => (
            <div key={i} style={{
              background: 'var(--bg)', padding: '48px 40px', textAlign: 'center',
              transition: 'background 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
            >
              <div className="font-display" style={{
                fontSize: '3.5rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1
              }}>
                <Counter end={num} suffix={suffix} />
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 8, letterSpacing: '0.05em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '0 48px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: 16 }}>
            CAPABILITIES
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>
            Everything you need<br />
            <em style={{ fontWeight: 300, color: 'var(--accent)' }}>to ace your exams</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            {
              icon: <Upload size={22} color="var(--accent)" />,
              title: 'Smart Document Reading',
              desc: 'Upload PDFs, images, handwritten notes — our OCR engine reads everything with high accuracy.'
            },
            {
              icon: <Brain size={22} color="var(--accent)" />,
              title: 'AI Question Generation',
              desc: 'Powered by state-of-the-art language models. Generates contextually accurate questions from your content.'
            },
            {
              icon: <Layers size={22} color="var(--accent)" />,
              title: 'Three Question Formats',
              desc: 'MCQs with explanations, short answers, and detailed essay questions — all from one upload.'
            },
            {
              icon: <Zap size={22} color="var(--accent)" />,
              title: 'Instant Results',
              desc: 'No waiting. Questions are generated in seconds, formatted cleanly and ready to study.'
            },
            {
              icon: <Shield size={22} color="var(--accent)" />,
              title: 'Difficulty Control',
              desc: 'Choose Basic, Important, or Exam Level difficulty. Higher tiers unlock advanced analytical questions.'
            },
            {
              icon: <Award size={22} color="var(--accent)" />,
              title: 'Export & Review',
              desc: 'Download your questions as text files. Review with interactive reveal — test yourself as you go.'
            },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="card" style={{
              padding: '36px 32px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = 'rgba(200,169,110,0.3)'
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(200,169,110,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'var(--accent-dim)', border: '1px solid rgba(200,169,110,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24
              }}>
                {icon}
              </div>
              <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLANS ── */}
      <section style={{ padding: '0 48px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: 16 }}>
            PRICING
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>
            Simple, honest pricing
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              name: 'Free', price: '$0', period: 'forever',
              highlight: false,
              features: ['5 uploads per day', '20 MCQs per session', '10 Short questions', '5 Long questions', 'Basic difficulty only'],
              cta: 'Start Free', link: '/signup'
            },
            {
              name: 'Basic', price: '$5', period: 'per month',
              highlight: true,
              features: ['20 uploads per day', '50 MCQs per session', '25 Short questions', '10 Long questions', 'All difficulty levels'],
              cta: 'Contact Admin', link: '/signup'
            },
            {
              name: 'Advanced', price: '$15', period: 'per month',
              highlight: false,
              features: ['50 uploads per day', '300 MCQs per session', '75 Short questions', '25 Long questions', 'All difficulty levels'],
              cta: 'Contact Admin', link: '/signup'
            },
          ].map(({ name, price, period, highlight, features, cta, link }) => (
            <div key={name} style={{
              background: highlight ? 'var(--accent)' : 'var(--surface)',
              border: `1px solid ${highlight ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 20,
              padding: '40px 32px',
              position: 'relative',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = highlight
                  ? '0 32px 80px rgba(200,169,110,0.4)'
                  : '0 32px 80px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {highlight && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: '#050508', color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.12em',
                  padding: '4px 16px', borderRadius: 100, border: '1px solid var(--accent)'
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 32 }}>
                <p style={{
                  fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.1em',
                  color: highlight ? 'rgba(5,5,8,0.7)' : 'var(--muted)', marginBottom: 12
                }}>{name.toUpperCase()}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="font-display" style={{
                    fontSize: '3rem', fontWeight: 700,
                    color: highlight ? '#050508' : 'white'
                  }}>{price}</span>
                  <span style={{ color: highlight ? 'rgba(5,5,8,0.6)' : 'var(--muted)', fontSize: '0.85rem' }}>/{period}</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem',
                    color: highlight ? 'rgba(5,5,8,0.8)' : 'var(--muted)' }}>
                    <CheckCircle size={15} color={highlight ? '#050508' : 'var(--accent)'} style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={link} style={{
                display: 'block', textAlign: 'center',
                padding: '13px 24px', borderRadius: 10, fontWeight: 700,
                fontSize: '0.875rem', letterSpacing: '0.04em',
                background: highlight ? '#050508' : 'transparent',
                color: highlight ? 'var(--accent)' : 'var(--text)',
                border: highlight ? 'none' : '1px solid var(--border)',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                textDecoration: 'none'
              }}
                onMouseEnter={e => {
                  if (!highlight) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = 'var(--border-hover)'
                  }
                }}
                onMouseLeave={e => {
                  if (!highlight) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }
                }}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{
        margin: '0 48px 120px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '72px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Orb style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <p style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: 20 }}>
          GET STARTED TODAY
        </p>
        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Ready to study smarter?
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: 40, fontSize: '1rem' }}>
          Free forever. No credit card required.
        </p>
        <Link to="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 48px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Create Free Account <ArrowRight size={17} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '36px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--accent)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BookOpen size={13} color="#050508" />
          </div>
          <span className="font-display" style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>StudyAI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: '0.85rem' }}>
          Made with
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--accent)" style={{ margin: '0 2px' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          by{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Muhammad Tamoor</span>
          <span style={{ color: 'var(--border-hover)' }}>·</span>
          <span style={{ color: 'var(--muted)' }}>AI / ML Engineer</span>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'JetBrains Mono' }}>
          © {new Date().getFullYear()} Mentra
        </p>
      </footer>
    </div>
  )
}
