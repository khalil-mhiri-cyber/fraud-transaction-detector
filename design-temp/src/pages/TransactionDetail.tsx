import { useParams, useNavigate } from 'react-router'
import { TRANSACTIONS, riskColor, riskLevel } from '../data/mockData'

export default function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tx = TRANSACTIONS.find(t => t.id === id)

  if (!tx) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 16 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 48, color: '#1e2d4a' }}>404</div>
      <div style={{ fontFamily: 'Instrument Sans', fontSize: 16, color: '#64748b' }}>Transaction not found</div>
      <button onClick={() => navigate('/transactions')} style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#f59e0b', background: 'none', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Back to Transactions</button>
    </div>
  )

  const score = tx.riskScore
  const color = riskColor(score)
  const level = riskLevel(score)
  const isFraud = tx.status === 'fraud'

  const circumference = 2 * Math.PI * 44
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
      {/* Back + header */}
      <div>
        <button onClick={() => navigate(-1)} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Transaction {tx.id}</h1>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 3, background: isFraud ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: isFraud ? '#ef4444' : '#10b981' }}>
            {isFraud ? '⚠ FRAUD' : '✓ SAFE'}
          </span>
        </div>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{tx.date} at {tx.time} · {tx.merchant}</p>
      </div>

      {/* Main cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 220px', gap: 12 }}>

        {/* Transaction details */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 18 }}>Transaction Details</div>
          {[
            ['Amount', `${tx.currency} ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
            ['Device', tx.device],
            ['Location', tx.location],
            ['Account', tx.account],
            ['Category', tx.category],
            ['Velocity', `${tx.velocity}× in 60 min`],
            ['IP Address', tx.ip],
            ['Recurring', tx.recurring ? 'Yes' : 'No'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '9px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
              <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{k}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, color: '#e2e8f0', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* AI Assessment */}
        <div style={{ background: '#0d1528', border: `1px solid ${isFraud ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}`, borderRadius: 4, padding: 22 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 18 }}>AI Assessment</div>

          <div style={{ background: isFraud ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)', borderRadius: 4, padding: '16px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 32, fontWeight: 700, color: isFraud ? '#ef4444' : '#10b981', lineHeight: 1 }}>
              {isFraud ? '⚠' : '✓'}
            </span>
            <div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 16, fontWeight: 700, color: isFraud ? '#ef4444' : '#10b981' }}>
                {isFraud ? 'FRAUD' : 'LEGITIMATE'}
              </div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Model confidence: {isFraud ? Math.round(score * 0.95) : Math.round((100 - score) * 0.95)}%
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Detection Reasons</div>

          {tx.reasons.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tx.reasons.map(reason => (
                <div key={reason} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 3 }}>
                  <span style={{ color: '#ef4444', flexShrink: 0, fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#cbd5e1' }}>{reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 3, fontFamily: 'Instrument Sans', fontSize: 13, color: '#10b981' }}>
              No anomalies detected. Transaction follows expected behavioral patterns.
            </div>
          )}
        </div>

        {/* Risk score gauge */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Risk Score</div>

          {/* SVG gauge */}
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke={color} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <text x="50" y="46" textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: '18px', fontWeight: 'bold', fill: color }}>{score}</text>
            <text x="50" y="60" textAnchor="middle" style={{ fontFamily: 'Instrument Sans', fontSize: '7px', fill: '#64748b' }}>{level.toUpperCase()}</text>
          </svg>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Amount Risk', v: score > 70 ? 82 : 20 },
              { label: 'Geo Risk', v: score > 80 ? 91 : score > 50 ? 55 : 15 },
              { label: 'Device Risk', v: score > 85 ? 95 : score > 50 ? 40 : 10 },
              { label: 'Velocity Risk', v: Math.min(score + 5, 99) },
            ].map(({ label, v }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 10, color: '#64748b' }}>{label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: riskColor(v) }}>{v}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(148,163,184,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${v}%`, height: '100%', background: riskColor(v), borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, padding: '10px 20px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, color: '#ef4444', cursor: 'pointer' }}>Block Account</button>
        <button style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, padding: '10px 20px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, color: '#f59e0b', cursor: 'pointer' }}>Escalate to Team</button>
        <button style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, padding: '10px 20px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 4, color: '#10b981', cursor: 'pointer' }}>Mark as Safe</button>
        <button style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 400, padding: '10px 20px', background: 'transparent', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, color: '#64748b', cursor: 'pointer' }}>Export Report</button>
      </div>
    </div>
  )
}
