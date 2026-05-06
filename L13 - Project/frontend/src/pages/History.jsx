import React, { useEffect, useState } from 'react'
import api from '../hooks/useApi'
import { History as HistoryIcon, Loader2, ChevronDown, ChevronUp, FileText } from 'lucide-react'

export default function History() {
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [detail, setDetail] = useState({})
  const [detailLoading, setDetailLoading] = useState(null)

  useEffect(() => {
    api.get('/generations').then(res => setGenerations(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const loadDetail = async (id) => {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    if (detail[id]) return
    setDetailLoading(id)
    try {
      const res = await api.get(`/generations/${id}`)
      setDetail(prev => ({ ...prev, [id]: res.data }))
    } catch (e) {}
    finally { setDetailLoading(null) }
  }

  const typeColors = { mcq: 'bg-gold-500/10 text-gold-400 border-gold-500/20', short: 'bg-sage-400/10 text-sage-400 border-sage-400/20', long: 'bg-ink-700 text-ink-300 border-ink-600' }

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="card p-4 loading-shimmer h-16 rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Generation History</h1>
        <p className="text-ink-400 mt-1">{generations.length} total generations</p>
      </div>

      {generations.length === 0 ? (
        <div className="card p-12 text-center">
          <HistoryIcon size={40} className="text-ink-700 mx-auto mb-4" />
          <p className="text-ink-400">No generations yet. Go to Generator to create questions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((g) => (
            <div key={g.id} className="card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-ink-700/30 transition-colors"
                onClick={() => loadDetail(g.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={`badge border ${typeColors[g.type]} text-xs font-bold uppercase`}>{g.type}</span>
                  <span className="text-ink-200 text-sm">{g.count} questions</span>
                  <span className="badge bg-ink-700 text-ink-400 text-xs">{g.difficulty}</span>
                </div>
                <div className="flex items-center gap-3 text-ink-500 text-xs">
                  <span>{new Date(g.created_at).toLocaleString()}</span>
                  {expanded === g.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {expanded === g.id && (
                <div className="border-t border-ink-700/50 px-5 py-4">
                  {detailLoading === g.id ? (
                    <div className="flex items-center gap-2 text-ink-400 text-sm py-4">
                      <Loader2 size={16} className="animate-spin" /> Loading...
                    </div>
                  ) : detail[g.id] ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {detail[g.id].data.map((item, i) => (
                        <div key={i} className="bg-ink-800 rounded-lg p-4">
                          <p className="text-sm font-semibold text-white mb-2">
                            <span className="text-gold-400">Q{i + 1}.</span> {item.question}
                          </p>
                          {item.options && (
                            <div className="space-y-1 mb-2">
                              {Object.entries(item.options).map(([k, v]) => (
                                <p key={k} className={`text-xs px-3 py-1.5 rounded ${k === item.answer ? 'bg-sage-400/10 text-sage-400' : 'text-ink-400'}`}>
                                  <span className="font-bold">{k}.</span> {v}
                                </p>
                              ))}
                            </div>
                          )}
                          {item.answer && !item.options && (
                            <p className="text-xs text-ink-300 leading-relaxed">{item.answer}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
