import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend
} from 'recharts'
import { FRAUD_TREND, FRAUD_BY_DEVICE, FRAUD_BY_TYPE, RISK_DIST } from '../data/mockData'

const TT = { background: '#131e35', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, padding: '8px 12px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#e2e8f0' }

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
      <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: sub ? 2 : 16 }}>{title}</div>
      {sub && <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 16 }}>{sub}</div>}
      {children}
    </div>
  )
}

export default function Analytics() {
  const total = RISK_DIST.reduce((s, d) => s + d.count, 0)

  const deviceData = FRAUD_BY_DEVICE.map(d => ({
    ...d,
    rate: ((d.fraud / d.total) * 100).toFixed(1),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Fraud Analytics</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Aggregated fraud intelligence — last 8 days</p>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Fraud Rate', value: '1.82%', delta: '+0.18%', up: true },
          { label: 'Avg Risk Score', value: '44.2', delta: '+3.1', up: true },
          { label: 'False Positives', value: '2.6%', delta: '-0.4%', up: false },
          { label: 'Model Precision', value: '97.4%', delta: '+0.6%', up: false },
        ].map(s => (
          <div key={s.label} style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, fontWeight: 700, color: '#e2e8f0', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: s.up ? '#ef4444' : '#10b981' }}>{s.up ? '▲' : '▼'} {s.delta}</span>
          </div>
        ))}
      </div>

      {/* Fraud over time */}
      <Section title="Fraud Over Time" sub="Total vs fraud transactions per day">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={FRAUD_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
            <XAxis dataKey="date" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TT} />
            <Area type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={1.5} fill="url(#fg1)" dot={false} name="Total Tx" />
            <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fill="url(#fg2)" dot={{ r: 3, fill: '#ef4444' }} name="Fraud" />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* By device + by type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <Section title="Fraud by Device" sub="Fraud count and rate per device type">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deviceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="device" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="fraud" name="Fraud Tx" radius={[3, 3, 0, 0]}>
                {deviceData.map((d) => (
                  <Cell key={d.device} fill={d.device === 'Unknown' ? '#ef4444' : d.device === 'Mobile' ? '#f59e0b' : '#38bdf8'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
            {deviceData.map(d => (
              <div key={d.device} style={{ textAlign: 'center', padding: '8px', background: 'rgba(148,163,184,0.03)', borderRadius: 3 }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: d.device === 'Unknown' ? '#ef4444' : '#e2e8f0' }}>{d.rate}%</div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 10, color: '#64748b', marginTop: 2 }}>{d.device}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Fraud by Transaction Type" sub="Safe vs fraud split per category">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FRAUD_BY_TYPE} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={68} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="fraud" name="Fraud" fill="#ef4444" fillOpacity={0.7} radius={[0, 3, 3, 0]} stackId="a" />
              <Bar dataKey="safe" name="Safe" fill="#38bdf8" fillOpacity={0.2} radius={[0, 3, 3, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Risk distribution */}
      <Section title="Risk Score Distribution" sub={`${total.toLocaleString()} transactions classified today`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={RISK_DIST} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {RISK_DIST.map(d => <Cell key={d.label} fill={d.color} fillOpacity={0.8} />)}
              </Pie>
              <Tooltip contentStyle={TT} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RISK_DIST.map(d => {
              const pct = (d.count / total * 100).toFixed(1)
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8', flex: 1 }}>{d.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{d.count.toLocaleString()}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: d.color, width: 40, textAlign: 'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}
