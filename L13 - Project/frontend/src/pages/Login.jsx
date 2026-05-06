import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../hooks/useApi'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await api.post('/login', form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Sign in failed. Please check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', background: 'var(--bg)'
    }}>
      {/* Background orb */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--accent)', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <BookOpen size={22} color="#050508" />
          </div>
          <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '36px 32px'
        }}>
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 10, color: '#f87171', fontSize: '0.875rem'
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type="email" className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type="password" className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Signing in...</> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginTop: 24 }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
