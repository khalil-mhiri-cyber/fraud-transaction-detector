import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import { useState, useEffect } from 'react'

const TT = { background: '#131e35', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, padding: '8px 12px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#e2e8f0' }

const STATUS_CFG = {
  approved: { label: 'Approved', bg: 'rgba(16,185,129,0.10)', color: '#10b981' },
  flagged:  { label: 'Flagged',  bg: 'rgba(245,158,11,0.10)', color: '#f59e0b' },
  blocked:  { label: 'Blocked',  bg: 'rgba(239,68,68,0.10)',  color: '#ef4444' },
  pending:  { label: 'Pending',  bg: 'rgba(148,163,184,0.10)', color: '#94a3b8' },
}

const CAT_ICON = {
  Crypto: '₿', Transfer: '↗', Electronics: '💻', Subscription: '▶',
  'Food & Drink': '🍔', Shopping: '🛍', Grocery: '🛒', PAYMENT: '💳',
  CASH_OUT: '↙', CASH_IN: '↙', DEBIT: '↗',
}

function txStatus(tx) {
  if (tx.adminStatus === 'APPROVED') return 'approved'
  if (tx.adminStatus === 'BLOCKED') return 'blocked'
  return 'pending'
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/transactions')
      .then(r => setTransactions(r.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...transactions].sort((a, b) => new Date(b.time) - new Date(a.time))
  const recent = sorted.slice(0, 5)
  const adminBlocked = sorted.filter(t => t.adminStatus === 'BLOCKED')
  const firstBlocked = adminBlocked[0]

  const now = new Date()
  const thisMonth = sorted.filter(t => {
    const d = new Date(t.time)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const spent = thisMonth.filter(t => t.adminStatus === 'APPROVED').reduce((s, t) => s + Number(t.amount), 0)
  const pending = sorted.filter(t => !t.adminStatus).reduce((s, t) => s + Number(t.amount), 0)
  const blockedAmt = sorted.filter(t => t.adminStatus === 'BLOCKED').reduce((s, t) => s + Number(t.amount), 0)
  const totalBalance = sorted.filter(t => t.adminStatus === 'APPROVED').reduce((s, t) => s + Number(t.amount), 0)

  // Build spending chart from real data — empty if no transactions
  const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  const spendingData = MONTHS.map(m => {
    const amount = transactions
      .filter(tx => new Date(tx.time).toLocaleString('en-US', { month: 'short' }) === m)
      .reduce((s, tx) => s + Number(tx.amount), 0)
    return { month: m, amount }
  })

  const greeting = () => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  }

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 24, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>{greeting()}, {firstName}</h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
            Account ••4821 · Last login {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/user/new-transaction')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 7-14 7V9.5l9-1.5-9-1.5V1Z" fill="currentColor"/></svg>
          New Transfer
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Available Balance', value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#38bdf8', icon: '💳' },
          { label: 'Spent This Month', value: `$${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#e2e8f0', icon: '📊' },
          { label: 'Pending', value: `$${pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#f59e0b', icon: '⏳' },
          { label: 'Blocked Today', value: `$${blockedAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#ef4444', icon: '🚫' },
        ].map(c => (
          <div key={c.label} style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '20px 22px' }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700, color: c.color, lineHeight: 1, marginBottom: 6 }}>{c.value}</div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Fraud alert banner — only when admin blocked */}
      {firstBlocked && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L1.5 15h15L9 1.5Z" stroke="#ef4444" strokeWidth={1.5} strokeLinejoin="round"/><path d="M9 7v4" stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round"/><circle cx="9" cy="13" r="0.5" fill="#ef4444" stroke="#ef4444"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#ef4444' }}>
              Transaction TX-{firstBlocked.id} was blocked by our fraud system
            </div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              A ${Number(firstBlocked.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} transfer to {firstBlocked.place || firstBlocked.type} was blocked due to a high risk score ({Math.round(Number(firstBlocked.fraudProbability) * 100)}/100). If this was you, contact support.
            </div>
          </div>
          <button
            onClick={() => navigate(`/user/transactions/TX-${firstBlocked.id}`)}
            style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 3, padding: '6px 14px', cursor: 'pointer', flexShrink: 0 }}
          >
            View Details
          </button>
        </div>
      )}

      {/* Chart + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        {/* Spending chart */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Monthly Spending</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 20 }}>Last 6 months</div>
          {!loading && transactions.length === 0 ? (
            <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 32 }}>📊</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#475569' }}>No spending data yet</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#334155' }}>Make your first transfer to see your spending chart</div>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={spendingData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TT} formatter={v => [`$${Number(v).toLocaleString()}`, 'Spending']} />
              <Line type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0d1528' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Recent transactions */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Recent Transactions</div>
            <button onClick={() => navigate('/user/transactions')} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading && <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', padding: '32px 0', textAlign: 'center' }}>Loading...</div>}
            {!loading && recent.length === 0 && (
              <div style={{ padding: '32px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 28 }}>💳</div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#475569' }}>No transactions yet</div>
                <button
                  onClick={() => navigate('/user/new-transaction')}
                  style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#38bdf8', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginTop: 4 }}
                >
                  Make your first transfer →
                </button>
              </div>
            )}
            {recent.map(tx => {
              const status = txStatus(tx)
              const cfg = STATUS_CFG[status]
              const icon = CAT_ICON[tx.type] || '↗'
              return (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/user/transactions/TX-${tx.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 4, cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(148,163,184,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(148,163,184,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.place || tx.type}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', marginTop: 2 }}>
                      {new Date(tx.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(tx.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: status === 'blocked' ? '#ef4444' : '#e2e8f0' }}>
                      ${Number(tx.amount).toFixed(2)}
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: cfg.bg, color: cfg.color }}>
                      {cfg.label.toUpperCase()}
                    </span>
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
