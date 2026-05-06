import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Zap, History, CreditCard,
  Shield, LogOut, BookOpen, ChevronRight, Menu
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/generator',  icon: Zap,             label: 'Generator'  },
  { to: '/history',    icon: History,          label: 'History'    },
  { to: '/plans',      icon: CreditCard,       label: 'Plans'      },
]

const PLAN_STYLE = {
  free:     { bg: 'rgba(255,255,255,0.04)', color: '#6b6b80' },
  basic:    { bg: 'rgba(200,169,110,0.1)',  color: '#c8a96e' },
  advanced: { bg: 'rgba(74,222,128,0.08)', color: '#4ade80' },
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const ps = PLAN_STYLE[user?.plan] || PLAN_STYLE.free

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden'
      }}>

        {/* Logo row */}
        <div style={{
          padding: collapsed ? '20px 14px' : '20px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{
              width: 32, height: 32, background: 'var(--accent)', borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <BookOpen size={15} color="#050508" />
            </div>
            {!collapsed && (
              <span className="font-display" style={{ color: 'white', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                Mentra
              </span>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{
              background: 'none', border: 'none', color: 'var(--muted)',
              cursor: 'none', padding: 4, borderRadius: 6,
              transition: 'color 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <ChevronRight size={16} />
            </button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} style={{
              background: 'none', border: 'none', color: 'var(--muted)',
              cursor: 'none', padding: 4
            }}>
              <Menu size={16} />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 12,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px' : '10px 14px',
                  borderRadius: 10,
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(200,169,110,0.2)' : 'transparent'}`,
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  fontSize: '0.875rem', fontWeight: 600,
                  transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden'
                }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' } }}
                >
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  {!collapsed && label}
                </div>
              )}
            </NavLink>
          ))}

          {user?.is_admin && (
            <NavLink to="/admin" style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 12,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px' : '10px 14px',
                  borderRadius: 10,
                  background: isActive ? 'rgba(74,222,128,0.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(74,222,128,0.2)' : 'transparent'}`,
                  color: isActive ? '#4ade80' : 'var(--muted)',
                  fontSize: '0.875rem', fontWeight: 600,
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>
                  <Shield size={17} style={{ flexShrink: 0 }} />
                  {!collapsed && 'Admin'}
                </div>
              )}
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          {!collapsed ? (
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--accent-dim)', border: '1px solid rgba(200,169,110,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.username}
                    </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: ps.bg, color: ps.color, borderRadius: 100, padding: '1px 8px', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', marginTop: 2 }}>
                    {user?.plan?.toUpperCase()}
                  </div>
                </div>
              </div>
              <button onClick={() => { logout(); navigate('/login') }} style={{
                width: '100%', background: 'none', border: '1px solid var(--border)',
                borderRadius: 8, padding: '7px 12px', color: 'var(--muted)',
                cursor: 'none', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'border-color 0.2s, color 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => { logout(); navigate('/login') }} style={{
              width: '100%', background: 'none', border: 'none',
              color: 'var(--muted)', cursor: 'none', padding: '10px',
              display: 'flex', justifyContent: 'center',
              transition: 'color 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
        <Outlet />
      </main>
    </div>
  )
}
