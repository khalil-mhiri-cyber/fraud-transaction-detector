import { useParams, useNavigate } from 'react-router'
import { riskColor, riskLevel } from '../../data/mockData'

const MY_TRANSACTIONS: Record<string, {
  id: string; merchant: string; category: string; amount: number; currency: string;
  date: string; time: string; status: 'approved' | 'flagged' | 'blocked';
  riskScore: number; reasons: string[]; ip: string; device: string; location: string; account: string;
}> = {
  'TX-1042': { id: 'TX-1042', merchant: 'Crypto Exchange Pro', category: 'Crypto', amount: 4892.50, currency: 'USD', date: '2026-08-17', time: '14:23', status: 'blocked', riskScore: 94, reasons: ['Unusual amount for your account', 'Suspicious device detected', 'Abnormal transaction pattern', 'High-risk destination country'], ip: '41.58.xx.xx', device: 'Unknown Device', location: 'Lagos, Nigeria', account: '••4821' },
  'TX-1040': { id: 'TX-1040', merchant: 'Wire Transfer', category: 'Transfer', amount: 1240.00, currency: 'USD', date: '2026-08-17', time: '14:22', status: 'flagged', riskScore: 72, reasons: ['High transaction velocity', 'Geographic anomaly detected'], ip: '205.4.xx.xx', device: 'Mobile iOS', location: 'Miami, US', account: '••4821' },
  'TX-1037': { id: 'TX-1037', merchant: 'Best Buy', category: 'Electronics', amount: 445.20, currency: 'USD', date: '2026-08-17', time: '14:20', status: 'flagged', riskScore: 47, reasons: ['Amount 6.2× above your 90-day average'], ip: '68.13.xx.xx', device: 'Safari/Mac', location: 'Austin, US', account: '••4821' },
  'TX-1039': { id: 'TX-1039', merchant: 'Spotify Premium', category: 'Subscription', amount: 59.99, currency: 'GBP', date: '2026-08-17', time: '14:21', status: 'approved', riskScore: 8, reasons: [], ip: '82.19.xx.xx', device: 'Firefox/Win', location: 'London, GB', account: '••4821' },
  'TX-1036': { id: 'TX-1036', merchant: 'Uber Eats', category: 'Food & Drink', amount: 12.50, currency: 'USD', date: '2026-08-17', time: '14:20', status: 'approved', riskScore: 6, reasons: [], ip: '73.4.xx.xx', device: 'iPhone App', location: 'New York, US', account: '••4821' },
  'TX-1034': { id: 'TX-1034', merchant: 'Adobe Creative Cloud', category: 'Subscription', amount: 199.99, currency: 'USD', date: '2026-08-16', time: '09:14', status: 'approved', riskScore: 11, reasons: [], ip: '50.2.xx.xx', device: 'Chrome/Win', location: 'Seattle, US', account: '••4821' },
  'TX-1033': { id: 'TX-1033', merchant: 'Coinbase', category: 'Crypto', amount: 850.00, currency: 'USD', date: '2026-08-16', time: '18:42', status: 'approved', riskScore: 38, reasons: ['Crypto purchase'], ip: '104.12.xx.xx', device: 'Mobile iOS', location: 'San Francisco, US', account: '••4821' },
}

export default function UserTransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tx = id ? MY_TRANSACTIONS[id] : null

  if (!tx) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 40, color: '#1e2d4a', marginBottom: 16 }}>404</div>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 15, color: '#64748b', marginBottom: 20 }}>Transaction not found</div>
        <button onClick={() => navigate('/user/transactions')} style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#38bdf8', background: 'none', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Back to Transactions</button>
      </div>
    )
  }

  const isFraud = tx.status === 'blocked' || tx.status === 'flagged'
  const color = riskColor(tx.riskScore)
  const level = riskLevel(tx.riskScore)

  const STATUS_CFG = {
    approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '✓', title: 'Transaction Approved', desc: 'This transaction was approved and processed successfully.' },
    flagged:  { label: 'Under Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '⚠', title: 'Transaction Under Review', desc: 'Our security team is reviewing this transaction. You will be notified within 24 hours.' },
    blocked:  { label: 'Blocked', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '✕', title: 'Transaction Blocked', desc: 'This transaction was blocked by our AI fraud detection system to protect your account.' },
  }
  const cfg = STATUS_CFG[tx.status]
  const circum = 2 * Math.PI * 44

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
      {/* Back */}
      <div>
        <button onClick={() => navigate(-1)} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{tx.id}</h1>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 3, background: cfg.bg, color: cfg.color }}>{cfg.label.toUpperCase()}</span>
        </div>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{tx.merchant} · {tx.date} at {tx.time}</p>
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
          {/* Amount highlight */}
          <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Amount</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 36, fontWeight: 700, color: tx.status === 'blocked' ? '#ef4444' : '#e2e8f0', lineHeight: 1 }}>
                {tx.currency} {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Account</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>{tx.account}</div>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>Transaction Details</div>
            {[
              ['Device', tx.device],
              ['Location', tx.location],
              ['IP Address', tx.ip],
              ['Category', tx.category],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>{k}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Why was this flagged */}
          {isFraud && (
            <div style={{ background: '#0d1528', border: `1px solid ${cfg.border}`, borderRadius: 4, padding: 22 }}>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Why was this {tx.status}?</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 14 }}>Our AI detected the following signals:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tx.reasons.map(r => (
                  <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.10)', borderRadius: 3 }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#cbd5e1' }}>{r}</span>
                  </div>
                ))}
              </div>
              {tx.status === 'blocked' && (
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
              strokeDashoffset={circum - (tx.riskScore / 100) * circum}
              strokeLinecap="round" transform="rotate(-90 50 50)"
            />
            <text x="50" y="46" textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: '18px', fontWeight: 'bold', fill: color }}>{tx.riskScore}</text>
            <text x="50" y="60" textAnchor="middle" style={{ fontFamily: 'Instrument Sans', fontSize: '7px', fill: '#64748b' }}>{level.toUpperCase()}</text>
          </svg>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
            Score of {tx.riskScore}/100 — transactions above 60 are flagged, above 85 are blocked automatically.
          </div>
          <div style={{ width: '100%', marginTop: 4 }}>
            {[{ label: 'Flag threshold', v: 60 }, { label: 'Block threshold', v: 85 }, { label: 'Your score', v: tx.riskScore }].map(({ label, v }) => (
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
