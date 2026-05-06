import React, { useEffect, useState } from 'react'
import api from '../hooks/useApi'
import { Shield, Users, Upload, Zap, Trash2, Edit, Loader2, CheckCircle } from 'lucide-react'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [newPlan, setNewPlan] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId, email) => {
    if (!confirm(`Deactivate user ${email}?`)) return
    try {
      await api.post('/admin/delete-user', { user_id: userId })
      setActionMsg(`User ${email} deactivated`)
      fetchData()
    } catch (e) {
      setActionMsg(e.response?.data?.detail || 'Error')
    }
  }

  const changePlan = async (userId) => {
    if (!newPlan) return
    try {
      await api.post('/admin/change-plan', { user_id: userId, plan: newPlan })
      setActionMsg('Plan updated successfully')
      setEditingUser(null)
      setNewPlan('')
      fetchData()
    } catch (e) {
      setActionMsg(e.response?.data?.detail || 'Error')
    }
  }

  const planColors = {
    free: 'bg-ink-700 text-ink-300',
    basic: 'bg-gold-500/10 text-gold-400',
    advanced: 'bg-sage-400/10 text-sage-400',
  }

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="card p-6 loading-shimmer h-24 rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Shield size={28} className="text-sage-400" />
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Admin Panel</h1>
          <p className="text-ink-400 text-sm">Manage users and platform</p>
        </div>
      </div>

      {actionMsg && (
        <div className="bg-sage-400/10 border border-sage-400/20 text-sage-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          {actionMsg}
          <button className="ml-auto text-sage-600 hover:text-sage-400" onClick={() => setActionMsg('')}>✕</button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total_users, icon: Users },
            { label: 'Active Users', value: stats.active_users, icon: Users },
            { label: 'Total Uploads', value: stats.total_uploads, icon: Upload },
            { label: 'Generations', value: stats.total_generations, icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-ink-400 uppercase tracking-wide">{label}</p>
                <Icon size={14} className="text-ink-500" />
              </div>
              <p className="text-2xl font-bold font-display text-gold-400">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Plan distribution */}
      {stats?.users_by_plan && (
        <div className="card p-5">
          <h2 className="font-display font-semibold text-white mb-4">Users by Plan</h2>
          <div className="flex gap-4">
            {Object.entries(stats.users_by_plan).map(([plan, count]) => (
              <div key={plan} className={`badge border ${planColors[plan]} px-3 py-1.5 text-sm`}>
                {plan.toUpperCase()}: {count}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-700/50">
          <h2 className="font-display font-bold text-white">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/50">
              <tr>
                {['ID', 'Username', 'Email', 'Plan', 'Uploads Today', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-ink-400 text-xs font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700/30">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-ink-800/30 transition-colors">
                  <td className="px-4 py-3 text-ink-500 font-mono text-xs">{u.id}</td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{u.username}</span>
                    {u.is_admin && <span className="ml-2 badge bg-sage-400/10 text-sage-400 text-xs">ADMIN</span>}
                  </td>
                  <td className="px-4 py-3 text-ink-300">{u.email}</td>
                  <td className="px-4 py-3">
                    {editingUser === u.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          className="input-field text-xs py-1 px-2"
                          value={newPlan}
                          onChange={(e) => setNewPlan(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="advanced">Advanced</option>
                        </select>
                        <button onClick={() => changePlan(u.id)} className="text-sage-400 hover:text-sage-300 text-xs font-medium">Save</button>
                        <button onClick={() => setEditingUser(null)} className="text-ink-500 hover:text-ink-300 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <span className={`badge ${planColors[u.plan]} border border-current/20 text-xs`}>{u.plan}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-400">{u.uploads_today}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${u.is_active ? 'bg-sage-400/10 text-sage-400' : 'bg-red-900/20 text-red-400'}`}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!u.is_admin && (
                        <>
                          <button
                            onClick={() => { setEditingUser(u.id); setNewPlan(u.plan) }}
                            className="text-gold-400 hover:text-gold-300 transition-colors"
                            title="Change plan"
                          >
                            <Edit size={14} />
                          </button>
                          {u.is_active && (
                            <button
                              onClick={() => deleteUser(u.id, u.email)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                              title="Deactivate user"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
