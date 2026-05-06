import React, { useState, useRef, useEffect } from 'react'
import api from '../hooks/useApi'
import {
  Upload, Zap, Loader2, Check,
  AlertCircle, Download, RotateCcw, Lock
} from 'lucide-react'

const PLAN_LIMITS = {
  free:     { mcq_limit: 20,  short_limit: 10, long_limit: 5  },
  basic:    { mcq_limit: 50,  short_limit: 25, long_limit: 10 },
  advanced: { mcq_limit: 300, short_limit: 75, long_limit: 25 },
}

const PLAN_ORDER = ['free', 'basic', 'advanced']

function planAllows(userPlan, minPlan) {
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(minPlan)
}

const QUESTION_TYPES = [
  { value: 'mcq',   label: 'MCQs',        desc: 'Multiple choice with 4 options' },
  { value: 'short', label: 'Short Answer', desc: '2-4 sentence answers' },
  { value: 'long',  label: 'Long Answer',  desc: 'Detailed essay-style answers' },
]

const DIFFICULTIES = [
  { value: 'basic',     label: 'Basic',      desc: 'Recall & facts',           minPlan: 'free'  },
  { value: 'important', label: 'Important',  desc: 'Conceptual understanding', minPlan: 'free'  },
  { value: 'exam',      label: 'Exam Level', desc: 'Analysis & application',   minPlan: 'basic' },
]

export default function Generator() {
  const [userPlan, setUserPlan]               = useState('free')
  const [file, setFile]                       = useState(null)
  const [upload, setUpload]                   = useState(null)
  const [uploads, setUploads]                 = useState([])
  const [selectedUploadId, setSelectedUploadId] = useState(null)
  const [qType, setQType]                     = useState('mcq')
  const [difficulty, setDifficulty]           = useState('important')
  const [count, setCount]                     = useState(5)
  const [uploading, setUploading]             = useState(false)
  const [generating, setGenerating]           = useState(false)
  const [result, setResult]                   = useState(null)
  const [error, setError]                     = useState('')
  const fileInputRef = useRef()

  // max questions allowed for current plan + question type
  const limits   = PLAN_LIMITS[userPlan] ?? PLAN_LIMITS.free
  const maxCount = qType === 'mcq' ? limits.mcq_limit
                 : qType === 'short' ? limits.short_limit
                 : limits.long_limit

  useEffect(() => {
    // fetch real plan from backend
    api.get('/user-plan')
      .then(res => {
        const plan = res.data.current_plan || 'free'
        setUserPlan(plan)
        if (plan === 'free' && difficulty === 'exam') setDifficulty('important')
      })
      .catch(() => {})

    api.get('/uploads')
      .then(res => setUploads(res.data))
      .catch(() => {})
  }, [])

  // clamp count whenever plan or type changes
  useEffect(() => {
    setCount(prev => Math.min(prev, maxCount))
  }, [maxCount])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) { setFile(f); setUpload(null); setResult(null); setError('') }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setUpload(res.data)
      setSelectedUploadId(res.data.upload_id)
      setUploads(prev => [{ id: res.data.upload_id, filename: res.data.filename, char_count: res.data.char_count }, ...prev])
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleGenerate = async () => {
    if (!selectedUploadId) { setError('Please upload or select a file first'); return }
    setGenerating(true); setError(''); setResult(null)
    try {
      const res = await api.post(`/generate-${qType}`, { upload_id: selectedUploadId, count, difficulty })
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Generation failed')
    } finally { setGenerating(false) }
  }

  const exportText = () => {
    if (!result) return
    let content = `AI Study Assistant — ${result.type.toUpperCase()} Questions\n`
    content += `Generated: ${new Date().toLocaleString()}\nDifficulty: ${difficulty}\n${'='.repeat(60)}\n\n`
    result.data.forEach((item, i) => {
      content += `Q${i + 1}: ${item.question}\n`
      if (item.options) {
        Object.entries(item.options).forEach(([k, v]) => { content += `  ${k}) ${v}\n` })
        content += `Answer: ${item.answer}\n`
        if (item.explanation) content += `Explanation: ${item.explanation}\n`
      } else {
        content += `Answer: ${item.answer}\n`
        if (item.key_points) content += `Key Points: ${item.key_points.join(', ')}\n`
      }
      content += '\n'
    })
    const blob = new Blob([content], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `questions-${qType}-${Date.now()}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const planBadge = {
    free:     'bg-ink-700 text-ink-300',
    basic:    'bg-gold-500/10 text-gold-400 border border-gold-500/30',
    advanced: 'bg-sage-400/10 text-sage-400 border border-sage-400/30',
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Question Generator</h1>
          <p className="text-ink-400 mt-1">Upload a file and generate AI-powered study questions</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${planBadge[userPlan]}`}>
          {userPlan} plan
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Left ── */}
        <div className="space-y-5">

          {/* Upload box */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-white mb-4">Upload File</h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                file ? 'border-gold-500/50 bg-gold-500/5' : 'border-ink-600 hover:border-ink-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files[0]
                if (f) { setFile(f); setUpload(null); setResult(null) }
              }}
            >
              <input ref={fileInputRef} type="file" className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp,.webp" onChange={handleFileChange} />
              <Upload size={28} className="text-ink-500 mx-auto mb-3" />
              {file ? (
                <div>
                  <p className="text-gold-400 font-medium">{file.name}</p>
                  <p className="text-ink-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-ink-300 font-medium">Drop file here or click to browse</p>
                  <p className="text-ink-500 text-sm mt-1">PDF, PNG, JPG, JPEG, TIFF, BMP, WEBP</p>
                </div>
              )}
            </div>

            {file && !upload && (
              <button onClick={handleUpload} disabled={uploading}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Extracting text...</> : 'Upload & Extract Text'}
              </button>
            )}

            {upload && (
              <div className="mt-4 bg-sage-400/10 border border-sage-400/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sage-400 text-sm">
                  <Check size={16} /><span className="font-medium">Text extracted!</span>
                </div>
                <p className="text-ink-400 text-xs mt-1">{upload.char_count.toLocaleString()} characters</p>
                <p className="text-ink-500 text-xs mt-1 font-mono leading-relaxed line-clamp-3">{upload.text_preview}...</p>
              </div>
            )}
          </div>

          {/* Previous uploads */}
          {uploads.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Or use a previous upload</h3>
              <select className="input-field text-sm" value={selectedUploadId || ''}
                onChange={(e) => { setSelectedUploadId(Number(e.target.value) || null); setUpload(null); setFile(null) }}>
                <option value="">-- Select a previous upload --</option>
                {uploads.map((u) => (
                  <option key={u.id} value={u.id}>{u.filename} ({u.char_count?.toLocaleString()} chars)</option>
                ))}
              </select>
            </div>
          )}

          {/* Settings card */}
          <div className="card p-6 space-y-6">
            <h2 className="font-display font-semibold text-white">Settings</h2>

            {/* Question type */}
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Question Type</label>
              <div className="grid grid-cols-3 gap-2">
                {QUESTION_TYPES.map((t) => (
                  <button key={t.value} onClick={() => setQType(t.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      qType === t.value
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-ink-600 text-ink-400 hover:border-ink-400'
                    }`}>
                    <p className="font-semibold text-sm">{t.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty — exam locked on free */}
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => {
                  const locked = !planAllows(userPlan, d.minPlan)
                  return (
                    <button key={d.value}
                      onClick={() => { if (!locked) setDifficulty(d.value) }}
                      disabled={locked}
                      className={`p-3 rounded-lg border text-left transition-all relative ${
                        locked
                          ? 'border-ink-700 bg-ink-800/30 opacity-50 cursor-not-allowed'
                          : difficulty === d.value
                          ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                          : 'border-ink-600 text-ink-400 hover:border-ink-400'
                      }`}>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{d.label}</p>
                        {locked && <Lock size={12} className="text-ink-600 flex-shrink-0" />}
                      </div>
                      <p className="text-xs opacity-70 mt-0.5">{d.desc}</p>
                      {locked && <p className="text-xs text-ink-600 mt-1">Basic+ only</p>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Count slider — max from plan */}
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1">
                Number of Questions: <span className="text-gold-400 font-bold">{count}</span>
                <span className="text-ink-500 text-xs ml-2">/ max {maxCount}</span>
              </label>

              {/* Plan limits reference row */}
              <div className="flex gap-3 mb-3">
                {Object.entries(PLAN_LIMITS).map(([plan, lims]) => {
                  const thisMax = qType === 'mcq' ? lims.mcq_limit : qType === 'short' ? lims.short_limit : lims.long_limit
                  return (
                    <span key={plan}
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        userPlan === plan
                          ? 'border-gold-500 text-gold-400 bg-gold-500/10 font-bold'
                          : 'border-ink-700 text-ink-500'
                      }`}>
                      {plan}: {thisMax}
                    </span>
                  )
                })}
              </div>

              <input type="range" min={1} max={maxCount} value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-gold-500" />
              <div className="flex justify-between text-xs text-ink-500 mt-1">
                <span>1</span><span>{maxCount}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <AlertCircle size={16} />{error}
              </div>
            )}

            <button onClick={handleGenerate}
              disabled={generating || !selectedUploadId}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {generating
                ? <><Loader2 size={16} className="animate-spin" /> Your assistant is working...</>
                : <><Zap size={16} /> Generate {count} {QUESTION_TYPES.find(t => t.value === qType)?.label}</>}
            </button>
          </div>
        </div>

        {/* ── Right: results ── */}
        <div>
          {!result && !generating && (
            <div className="card p-8 text-center h-full flex items-center justify-center min-h-64">
              <div>
                <Zap size={40} className="text-ink-700 mx-auto mb-4" />
                <p className="text-ink-400 font-medium">Generated questions will appear here</p>
                <p className="text-ink-600 text-sm mt-2">Upload a file and click Generate</p>
              </div>
            </div>
          )}
          {generating && (
            <div className="card p-8 text-center h-full flex items-center justify-center min-h-64">
              <div>
                <Loader2 size={40} className="text-gold-400 mx-auto mb-4 animate-spin" />
                <p className="text-white font-medium">Your assistant is working on it...</p>
                <p className="text-ink-400 text-sm mt-2">This may take 10–30 seconds</p>
              </div>
            </div>
          )}
          {result && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-white">
                    {result.count} {QUESTION_TYPES.find(t => t.value === result.type)?.label}
                  </h2>
                  <p className="text-ink-400 text-sm">Difficulty: {difficulty} · Gemini AI</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={exportText} className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-4">
                    <Download size={14} /> Export
                  </button>
                  <button onClick={() => setResult(null)} className="btn-secondary text-sm py-2 px-3">
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {result.type === 'mcq'   && result.data.map((item, i) => <MCQCard   key={i} item={item} index={i+1} />)}
                {result.type === 'short' && result.data.map((item, i) => <ShortCard key={i} item={item} index={i+1} />)}
                {result.type === 'long'  && result.data.map((item, i) => <LongCard  key={i} item={item} index={i+1} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MCQCard({ item, index }) {
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState(null)
  return (
    <div className="card p-5 space-y-3">
      <p className="font-semibold text-white text-sm leading-relaxed">
        <span className="text-gold-400 font-mono">Q{index}.</span> {item.question}
      </p>
      <div className="space-y-2">
        {item.options && Object.entries(item.options).map(([key, val]) => (
          <button key={key} onClick={() => { setSelected(key); setRevealed(true) }}
            className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
              revealed
                ? key === item.answer ? 'border-sage-400 bg-sage-400/10 text-sage-400'
                  : key === selected  ? 'border-red-600 bg-red-900/10 text-red-400'
                  : 'border-ink-700 text-ink-400'
                : selected === key ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                : 'border-ink-700 text-ink-300 hover:border-ink-500'
            }`}>
            <span className="font-bold mr-2">{key}.</span>{val}
          </button>
        ))}
      </div>
      {revealed && item.explanation && (
        <p className="text-xs text-ink-400 bg-ink-800 rounded-lg px-3 py-2 leading-relaxed">💡 {item.explanation}</p>
      )}
      {!revealed && <button onClick={() => setRevealed(true)} className="text-xs text-gold-400 hover:underline">Reveal answer</button>}
    </div>
  )
}

function ShortCard({ item, index }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="card p-5 space-y-3">
      <p className="font-semibold text-white text-sm leading-relaxed">
        <span className="text-sage-400 font-mono">Q{index}.</span> {item.question}
      </p>
      {revealed ? (
        <div className="bg-ink-800 rounded-lg px-4 py-3">
          <p className="text-xs text-ink-500 font-medium mb-1 uppercase tracking-wide">Answer</p>
          <p className="text-ink-200 text-sm leading-relaxed">{item.answer}</p>
        </div>
      ) : (
        <button onClick={() => setRevealed(true)} className="text-xs text-gold-400 hover:underline">Show answer</button>
      )}
    </div>
  )
}

function LongCard({ item, index }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="card p-5 space-y-3">
      <p className="font-semibold text-white text-sm leading-relaxed">
        <span className="text-ink-300 font-mono">Q{index}.</span> {item.question}
      </p>
      {revealed ? (
        <div className="space-y-3">
          <div className="bg-ink-800 rounded-lg px-4 py-3">
            <p className="text-xs text-ink-500 font-medium mb-2 uppercase tracking-wide">Detailed Answer</p>
            <p className="text-ink-200 text-sm leading-relaxed">{item.answer}</p>
          </div>
          {item.key_points?.length > 0 && (
            <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-gold-500 font-medium mb-2 uppercase tracking-wide">Key Points</p>
              <ul className="space-y-1">
                {item.key_points.map((kp, i) => (
                  <li key={i} className="text-ink-300 text-sm flex items-start gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>{kp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setRevealed(true)} className="text-xs text-gold-400 hover:underline">Show answer & key points</button>
      )}
    </div>
  )
}
