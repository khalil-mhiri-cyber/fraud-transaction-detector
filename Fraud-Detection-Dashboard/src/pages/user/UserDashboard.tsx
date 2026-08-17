import { useNavigate } from 'react-router'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { riskColor } from '../../data/mockData'

const MY_TRANSACTIONS = [
  { id: 'TX-1042', merchant: 'Crypto Exchange Pro', amount: 4892.50, date: 'Aug 17', time: '14:23', status: 'blocked', riskScore: 94, category: 'Crypto' },
  { id: 'TX-1040', merchant: 'Wire Transfer', amount: 1240.00, date: 'Aug 17', time: '14:22', status: 'flagged', riskScore: 72, category: 'Transfer' },
  { id: 'TX-1037', merchant: 'Best Buy', amount: 445.20, date: 'Aug 17', time: '14:20', status: 'flagged', riskScore: 47, category: 'Electronics' },
  { id: 'TX-1036', merchant: 'Uber Eats', amount: 12.50, date: 'Aug 17', time: '14:20', status: 'approved', riskScore: 6, category: 'Food' },
  { id: 'TX-1039', merchant: 'Spotify', amount: 59.99, date: 'Aug 17', time: '14:21', status: 'approved', riskScore: 8, category: 'Subscription' },
]

const SPENDING = [
  { month: 'Mar', amount: 2100 },
  { month: 'Apr', amount: 3400 },
  { month: 'May', amount: 1800 },
  { month: 'Jun', amount: 4200 },
  { month: 'Jul', amount: 2900 },
  { month: 'Aug', amount: 6650 },
]

const TT = { background: '#131e35', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, padding: '8px 12px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#e2e8f0' }

const STATUS_CFG = {
  approved: { label: 'Approved', bg: 'rgba(16,185,129,0.10)', color: '#10b981' },
  flagged:  { label: 'Flagged',  bg: 'rgba(245,158,11,0.10)', color: '#f59e0b' },
  blocked:  { label: 'Blocked',  bg: 'rgba(239,68,68,0.10)',  color: '#ef4444' },
}

export default function UserDashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 24, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Good morning, John</h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Account ••4821 · Last login Aug 17, 2026 at 14:19</p>
        </div>
        <button
          onClick={() => navigate('/user/new-transaction')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 7-14 7V9.5l9-1.5-9-1.5V1Z" fill="currentColor"/></svg>
          New Transfer
        </button>
      </div>

      {/* Account cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Available Balance', value: '$12,480.50', color: '#38bdf8', icon: '💳' },
          { label: 'Spent This Month', value: '$6,650.19', color: '#e2e8f0', icon: '📊' },
          { label: 'Pending', value: '$1,685.20', color: '#f59e0b', icon: '⏳' },
          { label: 'Blocked Today', value: '$4,892.50', color: '#ef4444', icon: '🚫' },
        ].map(c => (
          <div key={c.label} style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '20px 22px' }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700, color: c.color, lineHeight: 1, marginBottom: 6 }}>{c.value}</div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Fraud alert banner (if any blocked) */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L1.5 15h15L9 1.5Z" stroke="#ef4444" strokeWidth={1.5} strokeLinejoin="round"/><path d="M9 7v4" stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round"/><circle cx="9" cy="13" r="0.5" fill="#ef4444" stroke="#ef4444"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#ef4444' }}>Transaction TX-1042 was blocked by our fraud system</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8', marginTop: 2 }}>A $4,892.50 transfer to Crypto Exchange Pro was blocked due to a high risk score (94/100). If this was you, contact support.</div>
        </div>
        <button onClick={() => navigate('/user/transactions/TX-1042')} style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 3, padding: '6px 14px', cursor: 'pointer', flexShrink: 0 }}>View Details</button>
      </div>

      {/* Chart + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        {/* Spending chart */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Monthly Spending</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 20 }}>Last 6 months</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SPENDING} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TT} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Spending']} />
              <Line type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0d1528' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Recent Transactions</div>
            <button onClick={() => navigate('/user/transactions')} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MY_TRANSACTIONS.map(tx => {
              const cfg = STATUS_CFG[tx.status as keyof typeof STATUS_CFG]
              return (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/user/transactions/${tx.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 4, cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(148,163,184,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(148,163,184,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                    {tx.category === 'Crypto' ? '₿' : tx.category === 'Food' ? '🍔' : tx.category === 'Subscription' ? '▶' : '↗'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', marginTop: 2 }}>{tx.date} · {tx.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: tx.status === 'blocked' ? '#ef4444' : '#e2e8f0' }}>${tx.amount.toFixed(2)}</div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: cfg.bg, color: cfg.color }}>{cfg.label.toUpperCase()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
