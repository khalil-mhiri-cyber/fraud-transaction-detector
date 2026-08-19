import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FRAUD_TREND, TRANSACTIONS } from '../data/mockData';
import { getTransactions, getTransactionStats } from '../services/api';

const TOOLTIP_STYLE = { 
  background: '#131e35', 
  border: '1px solid rgba(148,163,184,0.12)', 
  borderRadius: 4, 
  padding: '8px 12px', 
  fontFamily: 'JetBrains Mono', 
  fontSize: 11, 
  color: '#e2e8f0' 
};

function KPI({ label, value, sub, accent, delta }) {
  return (
    <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '20px 22px' }}>
      <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 30, fontWeight: 700, color: accent || '#e2e8f0', lineHeight: 1, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{sub}</span>
        {delta && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: delta.up ? '#ef4444' : '#10b981' }}>
            {delta.up ? '▲' : '▼'} {delta.v}
          </span>
        )}
      </div>
    </div>
  );
}

function getRiskColor(score) {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f59e0b';
  return '#10b981';
}

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [simulatedStats, setSimulatedStats] = useState({
    totalTransactions: 25676,
    fraudulentCount: 47,
    totalAmount: 152300000
  });

  async function fetchData() {
    try {
      const [txData, statsData] = await Promise.all([
        getTransactions(),
        getTransactionStats().catch(() => null)
      ]);
      setTransactions(txData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTransactions([]);
      setStats(null);
      setLoading(false);
    }
  }

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Simulate live stats updates
  useEffect(() => {
    const simulateInterval = setInterval(() => {
      setSimulatedStats(prev => {
        const newTx = Math.floor(Math.random() * 15) + 5; // 5-20 new transactions
        const newFraud = Math.random() > 0.85 ? 1 : 0; // ~15% chance of fraud
        const newAmount = (Math.random() * 50000) + 10000; // 10k-60k DT per transaction batch
        
        return {
          totalTransactions: prev.totalTransactions + newTx,
          fraudulentCount: prev.fraudulentCount + newFraud,
          totalAmount: prev.totalAmount + (newAmount * newTx)
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(simulateInterval);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch from backend every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const suspicious = transactions
    .filter(t => t.fraud === true || t.fraudulent === true || t.adminStatus === 'BLOCKED')
    .slice(0, 5)
    .map(t => ({
      id: `TX-${t.id}`,
      amount: Math.round(Number(t.amount || 0)),
      merchant: t.place || t.type || 'Transaction',
      location: t.device || 'Unknown',
      time: t.time ? new Date(t.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      status: 'fraud',
      riskScore: Math.round(Number(t.fraudProbability || 0) * 100) || 85,
    }));

  const totalTx = stats?.totalTransactions || transactions.length || simulatedStats.totalTransactions;
  const fraudCount = stats?.fraudulentCount || transactions.filter(t => t.fraud).length || simulatedStats.fraudulentCount;
  const totalAmount = stats?.totalAmount || transactions.reduce((s, t) => s + Number(t.amount || 0), 0) || simulatedStats.totalAmount;
  const fraudRate = totalTx > 0 ? ((fraudCount / totalTx) * 100).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, color: '#64748b' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
            Real-time fraud monitoring — Aug 17, 2026
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'block', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#10b981', fontWeight: 600 }}>
            LIVE · {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPI label="Total Transactions" value={totalTx.toLocaleString()} sub="Today across all channels" />
        <KPI label="Fraud Detected" value={fraudCount.toString()} sub={`vs ${Math.max(0, fraudCount - 9)} yesterday`} accent="#ef4444" delta={{ v: `+${((9 / Math.max(fraudCount - 9, 1)) * 100).toFixed(1)}%`, up: true }} />
        <KPI label="Fraud Rate" value={`${fraudRate}%`} sub="7-day baseline 1.64%" accent="#f59e0b" delta={{ v: `+${(parseFloat(fraudRate) - 1.64).toFixed(2)}%`, up: parseFloat(fraudRate) > 1.64 }} />
        <KPI label="Total Amount" value={`${(totalAmount / 1000000).toFixed(1)}M DT`} sub="Processed today" accent="#38bdf8" />
      </div>

      {/* Chart + suspicious side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>
        
        {/* Fraud trend chart */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 22 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
            Fraud Trend — Last 8 Days
          </div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 18 }}>
            Detected fraud transactions per day
          </div>
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
              <XAxis 
                dataKey="date" 
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#38bdf8" 
                strokeWidth={1.5} 
                fill="url(#totalGrad)" 
                dot={false} 
                name="Total" 
              />
              <Area 
                type="monotone" 
                dataKey="fraud" 
                stroke="#ef4444" 
                strokeWidth={2} 
                fill="url(#fraudGrad)" 
                dot={{ r: 3, fill: '#ef4444' }} 
                name="Fraud" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent suspicious */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 4, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
              Suspicious Transactions
            </div>
            <button 
              onClick={() => navigate('/admin/transactions')} 
              style={{ 
                fontFamily: 'Instrument Sans', 
                fontSize: 12, 
                color: '#f59e0b', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: 0 
              }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {suspicious.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>No suspicious transactions detected</div>
              </div>
            ) : (
              suspicious.map(tx => (
                <div
                  key={tx.id}
                  style={{ 
                    padding: '12px 14px', 
                    background: 'rgba(239,68,68,0.04)', 
                    border: '1px solid rgba(239,68,68,0.10)', 
                    borderRadius: 3, 
                    cursor: 'pointer', 
                    transition: 'background 0.15s' 
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.04)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#ef4444' }}>
                      {tx.id}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                      {tx.amount.toLocaleString()} DT
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8' }}>
                      {tx.merchant}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 28, height: 5, borderRadius: 2, background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${tx.riskScore}%`, 
                          height: '100%', 
                          background: getRiskColor(tx.riskScore), 
                          borderRadius: 2 
                        }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: getRiskColor(tx.riskScore) }}>
                        {tx.riskScore}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#4b5563', marginTop: 4 }}>
                    {tx.location} · {tx.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Auto-blocked', value: '198', desc: 'High confidence rule matches', color: '#ef4444' },
          { label: 'Under Review', value: '84', desc: 'Awaiting analyst decision', color: '#f59e0b' },
          { label: 'Estimated Savings', value: '7.6M DT', desc: 'Fraud prevented today', color: '#10b981' },
        ].map(s => (
          <div 
            key={s.label} 
            style={{ 
              background: '#0d1528', 
              border: '1px solid rgba(148,163,184,0.08)', 
              borderRadius: 4, 
              padding: '18px 22px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 16 
            }}
          >
            <div style={{ 
              width: 4, 
              height: 48, 
              background: s.color, 
              borderRadius: 2, 
              flexShrink: 0, 
              opacity: 0.7 
            }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginTop: 4 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginTop: 2 }}>
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
