import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { riskColor, riskLevel } from '../../data/mockData'

const HIGH_RISK_COUNTRIES = ['NG', 'PA', 'RO', 'RU', 'VE']
const HIGH_RISK_TYPES = ['Crypto', 'Transfer', 'ATM']

function computeScore(amount: number, txType: string, country: string, isNight: boolean, velocity: number): number {
  let score = 8
  if (amount > 10000) score += 35
  else if (amount > 5000) score += 24
  else if (amount > 1000) score += 10
  else if (amount > 500) score += 4
  if (HIGH_RISK_COUNTRIES.includes(country)) score += 28
  if (HIGH_RISK_TYPES.includes(txType)) score += 18
  if (isNight) score += 10
  if (velocity >= 8) score += 16
  else if (velocity >= 4) score += 8
  return Math.min(Math.max(score, 0), 99)
}

type Step = 'form' | 'review' | 'result'

interface FormData {
  recipientName: string
  recipientAccount: string
  amount: string
  currency: string
  txType: string
  country: string
  description: string
}

const INIT: FormData = { recipientName: '', recipientAccount: '', amount: '', currency: 'USD', txType: 'Purchase', country: 'US', description: '' }

export default function NewTransaction() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<FormData>(INIT)
  const [processing, setProcessing] = useState(false)
  const [liveScore, setLiveScore] = useState(0)
  const [result, setResult] = useState<{ score: number; status: 'approved' | 'flagged' | 'blocked'; txId: string } | null>(null)

  function set(k: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  // Live risk score preview
  useEffect(() => {
    const hr = new Date().getHours()
    const isNight = hr >= 22 || hr < 6
    const score = computeScore(parseFloat(form.amount) || 0, form.txType, form.country, isNight, 1)
    setLiveScore(score)
  }, [form.amount, form.txType, form.country])

  function submit(e: FormEvent) {
    e.preventDefault()
    setStep('review')
  }

  function confirm() {
    setProcessing(true)
    const hr = new Date().getHours()
    const score = computeScore(parseFloat(form.amount), form.txType, form.country, hr >= 22 || hr < 6, 1)
    setTimeout(() => {
      const status = score >= 85 ? 'blocked' : score >= 55 ? 'flagged' : 'approved'
      setResult({ score, status, txId: `TX-${Math.floor(1000 + Math.random() * 9000)}` })
      setStep('result')
      setProcessing(false)
    }, 1600)
  }

  const amt = parseFloat(form.amount) || 0
  const color = riskColor(liveScore)
  const level = riskLevel(liveScore)

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)',
    border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4,
    fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0',
    outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
  }
  const labelStyle = { fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600 as const, color: '#94a3b8', display: 'block' as const, marginBottom: 6 }

  if (step === 'result' && result) {
    const cfg = {
      approved: { title: 'Transfer Sent!', desc: 'Your transaction has been approved and is being processed.', color: '#10b981', icon: '✓', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
      flagged:  { title: 'Transfer Under Review', desc: "Your transaction has been flagged for manual review. You'll be notified within 24 hours.", color: '#f59e0b', icon: '⚠', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
      blocked:  { title: 'Transfer Blocked', desc: 'Our AI system detected a high risk pattern and blocked this transaction to protect your account.', color: '#ef4444', icon: '✕', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
    }[result.status]

    return (
      <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#0d1528', border: `1px solid ${cfg.border}`, borderRadius: 8, padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32, color: cfg.color }}>
            {cfg.icon}
          </div>
          <h2 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: cfg.color, margin: '0 0 10px' }}>{cfg.title}</h2>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 14, color: '#94a3b8', margin: '0 0 28px', lineHeight: 1.6 }}>{cfg.desc}</p>

          <div style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '16px 20px', textAlign: 'left', marginBottom: 28 }}>
            {[
              ['Transaction ID', result.txId],
              ['Recipient', form.recipientName],
              ['Amount', `${form.currency} ${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
              ['Type', form.txType],
              ['Risk Score', `${result.score}/100`],
              ['Status', result.status.toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{k}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, color: k === 'Status' ? cfg.color : k === 'Risk Score' ? riskColor(result.score) : '#e2e8f0' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => navigate('/user/transactions')} style={{ padding: '10px 20px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#38bdf8', cursor: 'pointer' }}>View Transactions</button>
            <button onClick={() => { setForm(INIT); setStep('form'); setResult(null) }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', cursor: 'pointer' }}>New Transfer</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>New Transfer</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Transfers are screened in real-time by our AI fraud detection system</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {[{ n: 1, label: 'Details' }, { n: 2, label: 'Review' }, { n: 3, label: 'Complete' }].map((s, i) => {
          const done = (step === 'review' && s.n < 2) || (step === 'result' && s.n < 3)
          const active = (step === 'form' && s.n === 1) || (step === 'review' && s.n === 2) || (step === 'result' && s.n === 3)
          return (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#10b981' : active ? '#38bdf8' : 'rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: done || active ? '#0a0f1e' : '#64748b', transition: 'all 0.2s' }}>
                  {done ? '✓' : s.n}
                </div>
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: active ? '#e2e8f0' : '#64748b', fontWeight: active ? 600 : 400 }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ width: 40, height: 1, background: done ? '#10b981' : 'rgba(148,163,184,0.12)', margin: '0 12px' }} />}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Form / Review */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>

          {step === 'form' && (
            <form onSubmit={submit}>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Recipient Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Recipient Name</label>
                  <input placeholder="Jane Smith" value={form.recipientName} onChange={set('recipientName')} style={inputStyle} required onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')} />
                </div>
                <div>
                  <label style={labelStyle}>Account / IBAN</label>
                  <input placeholder="GB29 NWBK 6016 1331 9268 19" value={form.recipientAccount} onChange={set('recipientAccount')} style={inputStyle} required onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')} />
                </div>
              </div>

              <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: '24px 0 16px' }}>Transaction Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Amount</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={form.currency} onChange={set('currency')} style={{ ...inputStyle, width: 80, flexShrink: 0, appearance: 'none' as const }}>
                      {['USD', 'EUR', 'GBP', 'SAR', 'AED'].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input type="number" min="1" placeholder="0.00" value={form.amount} onChange={set('amount')} style={{ ...inputStyle, flex: 1 }} required onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Transaction Type</label>
                  <select value={form.txType} onChange={set('txType')} style={{ ...inputStyle, appearance: 'none' as const }}>
                    {['Purchase', 'Transfer', 'Investment', 'Subscription', 'Crypto', 'ATM'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Recipient Country</label>
                <select value={form.country} onChange={set('country')} style={{ ...inputStyle, appearance: 'none' as const }}>
                  {[['US','United States'],['GB','United Kingdom'],['DE','Germany'],['FR','France'],['SA','Saudi Arabia'],['AE','UAE'],['CA','Canada'],['AU','Australia'],['NG','Nigeria ⚠'],['PA','Panama ⚠'],['RO','Romania ⚠']].map(([c,l]) => <option key={c} value={c}>{l}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Description (optional)</label>
                <textarea value={form.description} onChange={set('description')} placeholder="Invoice payment, goods purchase..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}>
                Review Transfer →
              </button>
            </form>
          )}

          {step === 'review' && (
            <div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Confirm Transfer</div>

              {/* Summary */}
              <div style={{ background: 'rgba(148,163,184,0.03)', border: '1px solid rgba(148,163,184,0.07)', borderRadius: 4, padding: '16px 20px', marginBottom: 20 }}>
                {[
                  ['Recipient', form.recipientName],
                  ['Account', form.recipientAccount],
                  ['Amount', `${form.currency} ${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
                  ['Type', form.txType],
                  ['Country', form.country],
                  ...(form.description ? [['Note', form.description]] : []),
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>{k}</span>
                    <span style={{ fontFamily: k === 'Amount' ? 'JetBrains Mono' : 'Instrument Sans', fontSize: 13, fontWeight: k === 'Amount' ? 700 : 500, color: '#e2e8f0' }}>{v}</span>
                  </div>
                ))}
              </div>

              {liveScore >= 55 && (
                <div style={{ background: liveScore >= 85 ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)', border: `1px solid ${liveScore >= 85 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: 4, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{liveScore >= 85 ? '⚠' : '⚡'}</span>
                  <div>
                    <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: liveScore >= 85 ? '#ef4444' : '#f59e0b' }}>
                      {liveScore >= 85 ? 'High fraud risk detected' : 'This transfer may require review'}
                    </div>
                    <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                      Risk score: {liveScore}/100 — {liveScore >= 85 ? 'This transfer is likely to be blocked.' : 'Our team may contact you to verify.'}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('form')} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', cursor: 'pointer' }}>← Edit</button>
                <button onClick={confirm} disabled={processing} style={{ flex: 2, padding: '11px', background: processing ? 'rgba(56,189,248,0.4)' : '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: processing ? 'not-allowed' : 'pointer' }}>
                  {processing ? 'Processing...' : 'Confirm & Send'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live risk panel */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22, position: 'sticky', top: 20 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Live Risk Assessment</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginBottom: 20 }}>Updates as you type</div>

          {/* Mini gauge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 - (liveScore / 100) * 2 * Math.PI * 42}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
              />
              <text x="50" y="46" textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: '18px', fontWeight: 'bold', fill: color }}>{liveScore}</text>
              <text x="50" y="60" textAnchor="middle" style={{ fontFamily: 'Instrument Sans', fontSize: '7px', fill: '#64748b' }}>{level.toUpperCase()} RISK</text>
            </svg>
          </div>

          {/* Prediction */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: liveScore >= 85 ? '#ef4444' : liveScore >= 55 ? '#f59e0b' : '#10b981' }}>
              {liveScore >= 85 ? '⚠ LIKELY BLOCKED' : liveScore >= 55 ? '⚡ MAY BE REVIEWED' : '✓ LIKELY APPROVED'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Amount Risk', score: Math.min(Math.round(amt / 150), 99) },
              { label: 'Country Risk', score: HIGH_RISK_COUNTRIES.includes(form.country) ? 85 : 12 },
              { label: 'Type Risk', score: HIGH_RISK_TYPES.includes(form.txType) ? 72 : 18 },
            ].map(({ label, score }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b' }}>{label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: riskColor(score) }}>{score}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(148,163,184,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${score}%`, height: '100%', background: riskColor(score), borderRadius: 2, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(148,163,184,0.06)', fontFamily: 'Instrument Sans', fontSize: 11, color: '#4b5563', lineHeight: 1.6 }}>
            🔒 Powered by SentinelAI GBM v4.2 — 14.2M training samples, 97.4% precision
          </div>
        </div>
      </div>
    </div>
  )
}
