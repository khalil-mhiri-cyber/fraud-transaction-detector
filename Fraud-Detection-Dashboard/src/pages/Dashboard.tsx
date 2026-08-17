import { useNavigate } from 'react-router'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TRANSACTIONS, FRAUD_TREND, riskColor } from '../data/mockData'

const TOOLTIP = { background: '#131e35', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, padding: '8px 12px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#e2e8f0' }

function KPI({ label, value, sub, accent, delta }: { label: string; value: string; sub: string; accent?: string; delta?: { v: string; up: boolean } }) {
  return (
    <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '20px 22px' }}>
      <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 30, fontWeight: 700, color: accent || '#e2e8f0', lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{sub}</span>
        {delta && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: delta.up ? '#ef4444' : '#10b981' }}>{delta.up ? '▲' : '▼'} {delta.v}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const suspicious = TRANSACTIONS.filter(t => t.status === 'fraud').slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Real-time fraud monitoring — Aug 17, 2026</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPI label="Total Transactions" value="25,676" sub="Today across all channels" />
        <KPI label="Fraud Detected" value="47" sub="vs 38 yesterday" accent="#ef4444" delta={{ v: '+23.7%', up: true }} />
        <KPI label="Fraud Rate" value="1.82%" sub="7-day baseline 1.64%" accent="#f59e0b" delta={{ v: '+0.18%', up: true }} />
        <KPI label="Total Amount" value="$48.2M" sub="Processed today" accent="#38bdf8" />
      </div>

      {/* Chart + suspicious side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>

        {/* Fraud trend chart */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Fraud Trend — Last 8 Days</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 18 }}>Detected fraud transactions per day</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={FRAUD_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="date" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP} />
              <Area type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={1.5} fill="url(#totalGrad)" dot={false} name="Total" />
              <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fill="url(#fraudGrad)" dot={{ r: 3, fill: '#ef4444' }} name="Fraud" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent suspicious */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 4, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Suspicious Transactions</div>
            <button onClick={() => navigate('/admin/transactions')} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {suspicious.map(tx => (
              <div
                key={tx.id}
                onClick={() => navigate(`/admin/transactions/${tx.id}`)}
                style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.10)', borderRadius: 3, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.04)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#ef4444' }}>{tx.id}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>${tx.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8' }}>{tx.merchant}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 28, height: 5, borderRadius: 2, background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                      <div style={{ width: `${tx.riskScore}%`, height: '100%', background: riskColor(tx.riskScore), borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: riskColor(tx.riskScore) }}>{tx.riskScore}</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#4b5563', marginTop: 4 }}>{tx.location} · {tx.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Auto-blocked', value: '198', desc: 'High confidence rule matches', color: '#ef4444' },
          { label: 'Under Review', value: '84', desc: 'Awaiting analyst decision', color: '#f59e0b' },
          { label: 'Estimated Savings', value: '$2.41M', desc: 'Fraud prevented today', color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 4, height: 48, background: s.color, borderRadius: 2, flexShrink: 0, opacity: 0.7 }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
