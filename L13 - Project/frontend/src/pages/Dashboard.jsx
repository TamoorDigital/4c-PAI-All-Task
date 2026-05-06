import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../hooks/useApi'
import { Upload, Zap, FileText, BarChart2, ArrowRight, Clock } from 'lucide-react'

function StatCard({ label, value, icon: Icon, accent = 'var(--accent)' }) {
  return (
    <div className="card" style={{ padding: '24px', transition: 'transform 0.25s, box-shadow 0.25s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>{label.toUpperCase()}</p>
        <Icon size={16} color={accent} />
      </div>
      <p className="font-display" style={{ fontSize: '2rem', fontWeight: 600, color: accent, lineHeight: 1 }}>{value}</p>
    </div>
  )
}

const TYPE_COLOR = { mcq: 'var(--accent)', short: '#4ade80', long: 'var(--muted)' }

export default function Dashboard() {
  const { user } = useAuth()
  const [planInfo, setPlanInfo] = useState(null)
  const [uploads, setUploads] = useState([])
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/user-plan'), api.get('/uploads'), api.get('/generations')])
      .then(([p, u, g]) => { setPlanInfo(p.data); setUploads(u.data.slice(0,5)); setGenerations(g.data.slice(0,5)) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'grid', gap: 16 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="loading-shimmer" style={{ height: 80, borderRadius: 16 }} />)}
    </div>
  )

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>
          Good day, <em style={{ color: 'var(--accent)', fontWeight: 300 }}>{user?.username}</em>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: '0.9rem' }}>Here's your study overview</p>
      </div>

      {/* Stats */}
      {planInfo && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <StatCard label="Plan" value={planInfo.current_plan.toUpperCase()} icon={BarChart2} />
          <StatCard label="Uploads Today" value={`${planInfo.uploads_today} / ${planInfo.limits.uploads_per_day}`} icon={Upload} accent="#4ade80" />
          <StatCard label="Max MCQs" value={planInfo.limits.mcq_limit} icon={Zap} accent="var(--accent)" />
          <StatCard label="Max Long Q" value={planInfo.limits.long_limit} icon={FileText} accent="var(--muted)" />
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent uploads */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Recent Uploads</h2>
            <Link to="/generator" style={{ color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Upload new <ArrowRight size={13} />
            </Link>
          </div>
          {uploads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Upload size={32} color="var(--border)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No uploads yet</p>
              <Link to="/generator" style={{ color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none', display: 'block', marginTop: 8 }}>Upload your first file →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {uploads.map((u, i) => (
                <div key={u.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: i < uploads.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <FileText size={14} color="var(--muted)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.filename}</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', flexShrink: 0, marginLeft: 12 }}>{u.char_count?.toLocaleString()}c</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent generations */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Recent Generations</h2>
            <Link to="/history" style={{ color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              All history <ArrowRight size={13} />
            </Link>
          </div>
          {generations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Zap size={32} color="var(--border)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No generations yet</p>
              <Link to="/generator" style={{ color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none', display: 'block', marginTop: 8 }}>Generate your first questions →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {generations.map((g, i) => (
                <div key={g.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: i < generations.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: TYPE_COLOR[g.type], fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: 700 }}>{g.type.toUpperCase()}</span>
                    <span style={{ color: 'var(--text)', fontSize: '0.85rem' }}>{g.count} questions</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>{g.difficulty}</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem', flexShrink: 0 }}>{new Date(g.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Ready to study?</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>Upload a document and generate questions instantly</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/generator" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={15} /> Generate Questions
          </Link>
          <Link to="/plans" className="btn-secondary">Upgrade Plan</Link>
        </div>
      </div>
    </div>
  )
}
