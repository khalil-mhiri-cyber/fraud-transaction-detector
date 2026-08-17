import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { riskColor, riskLevel } from '../../utils/risk.js'
import api from '../../services/api.js'

function txStatus(tx) {
  if (tx.adminStatus === 'APPROVED') return 'approved'
  if (tx.adminStatus === 'BLOCKED') return 'blocked'
  return 'pending'
}

export default function UserTransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tx, setTx] = useState(null)
  const [loading, setLoading] = useState(true)

  // id is like "TX-42" — extract the number
  const numericId = id?.replace('TX-', '')

  useEffect(() => {
    if (!numericId) return
    api.get(`/transactions/${numericId}`)
      .then(r => setTx(r.data))
      .catch(() => setTx(null))
      .finally(() => setLoading(false))
  }, [numericId])

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'Instrument Sans', fontSize: 14, color: '#64748b' }}>Loading...</div>
  }

  if (!tx) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 40, color: '#1e2d4a', marginBottom: 16 }}>404</div>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 15, color: '#64748b', marginBottom: 20 }}>Transaction not found</div>
        <button onClick={() => navigate('/user/transactions')} style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#38bdf8', background: 'none', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Back to Transactions</button>
      </div>
    )
  }

  const status = txStatus(tx)
  const riskPct = Math.round(Number(tx.fraudProbability) * 100)
  const color = riskColor(riskPct)
  const level = riskLevel(riskPct)

  const STATUS_CFG = {
    approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '✓', title: 'Transaction Approved', desc: 'This transaction was approved and processed successfully.' },
    flagged:  { label: 'Under Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '⚠', title: 'Transaction Under Review', desc: "Our security team is reviewing this transaction. You will be notified within 24 hours." },
    blocked:  { label: 'Blocked', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '✕', title: 'Transaction Blocked', desc: 'This transaction was blocked by our security team to protect your account.' },
    pending:  { label: 'Pending Review', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', icon: '⏳', title: 'Awaiting Review', desc: 'Your transaction is pending review by our security team. You will be notified once a decision is made.' },
  }
  const cfg = STATUS_CFG[status]
  const circum = 2 * Math.PI * 44
  const isFraud = status === 'blocked'

  const reasons = status === 'blocked'
    ? ['Transaction flagged by security team', 'High risk pattern detected', 'Unusual transaction behavior']
    : []

  const date = new Date(tx.time).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const time = new Date(tx.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
      <div>
        <button onClick={() => navigate(-1)} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>TX-{tx.id}</h1>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 3, background: cfg.bg, color: cfg.color }}>{cfg.label.toUpperCase()}</span>
        </div>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{tx.place || tx.type} · {date} at {time}</p>
      </div>

      {/* Status banner */}
      <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 4, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 28, color: cfg.color }}>{cfg.icon}</span>
        <div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 15, fontWeight: 700, color: cfg.color }}>{cfg.title}</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{cfg.desc}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Amount */}
          <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Amount</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 36, fontWeight: 700, color: status === 'blocked' ? '#ef4444' : '#e2e8f0', lineHeight: 1 }}>
                USD {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Type</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>{tx.type}</div>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>Transaction Details</div>
            {[
              ['Device', tx.device || '—'],
              ['Place', tx.place || '—'],
              ['Date', `${date} at ${time}`],
              ['Risk Level', tx.riskLevel],
              ['Fraud Probability', `${riskPct}%`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>{k}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Why flagged */}
          {isFraud && reasons.length > 0 && (
            <div style={{ background: '#0d1528', border: `1px solid ${cfg.border}`, borderRadius: 4, padding: 22 }}>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Why was this {status}?</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 14 }}>Our AI detected the following signals:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reasons.map(r => (
                  <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.10)', borderRadius: 3 }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#cbd5e1' }}>{r}</span>
                  </div>
                ))}
              </div>
              {status === 'blocked' && (
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 3 }}>
                  <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#38bdf8', marginBottom: 4 }}>Was this you?</div>
                  <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8' }}>If you believe this transaction was mistakenly blocked, please contact our support team. We will review it within 2 business hours.</div>
                  <button style={{ marginTop: 10, fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#38bdf8', background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 3, padding: '6px 14px', cursor: 'pointer' }}>Contact Support</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Risk gauge */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Risk Score</div>
          <svg width="130" height="130" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="8" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={circum}
              strokeDashoffset={circum - (riskPct / 100) * circum}
              strokeLinecap="round" transform="rotate(-90 50 50)"
            />
            <text x="50" y="46" textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: '18px', fontWeight: 'bold', fill: color }}>{riskPct}</text>
            <text x="50" y="60" textAnchor="middle" style={{ fontFamily: 'Instrument Sans', fontSize: '7px', fill: '#64748b' }}>{level.toUpperCase()}</text>
          </svg>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
            Score of {riskPct}/100 — transactions above 60 are flagged, above 85 are blocked automatically.
          </div>
          <div style={{ width: '100%', marginTop: 4 }}>
            {[{ label: 'Flag threshold', v: 60 }, { label: 'Block threshold', v: 85 }, { label: 'Your score', v: riskPct }].map(({ label, v }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b' }}>{label}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: label === 'Your score' ? color : '#94a3b8' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
