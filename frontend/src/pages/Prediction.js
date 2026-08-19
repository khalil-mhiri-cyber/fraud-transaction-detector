import { useState } from 'react';
import api from '../services/api';

const INIT = { amount: '', device: 'PC', txType: 'Purchase', time: 'daytime', recurring: 'no', velocity: '1', country: 'TN' };

const HIGH_RISK_COUNTRIES = ['NG', 'PA', 'RO', 'RU', 'VE'];
const HIGH_RISK_DEVICES = ['Unknown'];
const HIGH_RISK_TYPES = ['Crypto', 'Transfer', 'ATM', 'TRANSFER', 'CASH_OUT'];

function getRiskColor(score) {
  if (score >= 90) return '#ef4444';
  if (score >= 75) return '#f97316';
  if (score >= 51) return '#f59e0b';
  return '#10b981';
}

function getRiskLevel(score) {
  if (score >= 90) return 'critical';
  if (score >= 75) return 'high';
  if (score >= 51) return 'medium';
  return 'safe';
}

function computeLocalScore(f) {
  let score = 10;
  const amt = parseFloat(f.amount) || 0;
  if (amt > 10000) score += 35;
  else if (amt > 5000) score += 25;
  else if (amt > 1000) score += 12;
  else if (amt > 500) score += 5;
  if (HIGH_RISK_COUNTRIES.includes(f.country)) score += 28;
  if (HIGH_RISK_DEVICES.includes(f.device)) score += 22;
  if (HIGH_RISK_TYPES.includes(f.txType)) score += 18;
  if (f.time === 'night') score += 12;
  const vel = parseInt(f.velocity) || 1;
  if (vel >= 10) score += 18;
  else if (vel >= 5) score += 10;
  else if (vel >= 3) score += 4;
  return Math.min(Math.max(Math.round(score), 0), 99);
}

export default function Prediction() {
  const [form, setForm] = useState(INIT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function set(k) {
    return (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function predict(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // Try real Python API via backend
      const res = await api.post('/transactions/predict', {
        type: form.txType.toUpperCase(),
        amount: parseFloat(form.amount),
        oldbalanceOrg: parseFloat(form.amount) * 2,
        newbalanceOrig: parseFloat(form.amount),
        oldbalanceDest: 0,
        newbalanceDest: 0,
        place: form.country,
        device: form.device,
        time: new Date().toISOString().slice(0, 19),
      });
      const score = Math.round(Number(res.data.fraudProbability) * 100);
      setResult({ score, fraud: res.data.fraud });
    } catch {
      // Fallback to local rules
      const score = computeLocalScore(form);
      setResult({ score, fraud: score >= 60 });
    }
    setLoading(false);
  }

  function reset() { setForm(INIT); setResult(null); }

  const color = result ? getRiskColor(result.score) : '#64748b';
  const level = result ? getRiskLevel(result.score) : 'safe';
  const circumference = 2 * Math.PI * 52;
  const offset = result ? circumference - (result.score / 100) * circumference : circumference;

  const selectStyle = { width: '100%', padding: '10px 12px', background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', appearance: 'none' };
  const inputStyle = { ...selectStyle };
  const labelStyle = { fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em', display: 'block', marginBottom: 6 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Fraud Prediction</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Enter transaction parameters to get an AI risk assessment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Form */}
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>
          <form onSubmit={predict} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Amount (DT)</label>
                <input type="number" min="0" placeholder="e.g. 5000" value={form.amount} onChange={set('amount')} style={inputStyle} required onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')} />
              </div>
              <div>
                <label style={labelStyle}>Velocity (tx/hr)</label>
                <input type="number" min="1" max="50" placeholder="1" value={form.velocity} onChange={set('velocity')} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Device</label>
                <select value={form.device} onChange={set('device')} style={selectStyle}>
                  {['PC', 'Mobile', 'Tablet', 'Unknown'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Transaction Type</label>
                <select value={form.txType} onChange={set('txType')} style={selectStyle}>
                  {['Purchase', 'Transfer', 'ATM', 'Subscription', 'Crypto', 'Investment'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Origin Country</label>
                <select value={form.country} onChange={set('country')} style={selectStyle}>
                  {[['TN','Tunisia'],['US','United States'],['GB','United Kingdom'],['DE','Germany'],['FR','France'],['NG','Nigeria ⚠'],['PA','Panama ⚠'],['RO','Romania ⚠'],['MX','Mexico'],['CA','Canada']].map(([c,l]) => <option key={c} value={c}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Transaction Time</label>
                <select value={form.time} onChange={set('time')} style={selectStyle}>
                  <option value="daytime">Daytime (06:00–22:00)</option>
                  <option value="night">Night (22:00–06:00)</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Recurring Transaction?</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['yes', 'Yes — known pattern'], ['no', 'No — first occurrence']].map(([v, l]) => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1, padding: '10px 14px', background: form.recurring === v ? 'rgba(245,158,11,0.08)' : 'rgba(148,163,184,0.03)', border: `1px solid ${form.recurring === v ? 'rgba(245,158,11,0.3)' : 'rgba(148,163,184,0.08)'}`, borderRadius: 4 }}>
                    <input type="radio" name="recurring" value={v} checked={form.recurring === v} onChange={set('recurring')} style={{ accentColor: '#f59e0b' }} />
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: form.recurring === v ? '#f59e0b' : '#94a3b8' }}>{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={loading || !form.amount}
                style={{ flex: 1, padding: '12px', background: loading || !form.amount ? 'rgba(245,158,11,0.4)' : '#f59e0b', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: loading || !form.amount ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Analyzing...' : '→ Run Prediction'}
              </button>
              {result && (
                <button type="button" onClick={reset} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', cursor: 'pointer' }}>Reset</button>
              )}
            </div>
          </form>
        </div>

        {/* Result */}
        <div style={{ background: '#0d1528', border: `1px solid ${result ? (result.fraud ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)') : 'rgba(148,163,184,0.08)'}`, borderRadius: 4, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {!result && !loading && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 40, color: '#1e2d45', marginBottom: 12 }}>◎</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, color: '#64748b' }}>Enter transaction details and click Predict</div>
            </div>
          )}
          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#f59e0b', letterSpacing: '0.1em' }}>ANALYZING...</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginTop: 8 }}>Running AI fraud model</div>
            </div>
          )}
          {result && (
            <>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Prediction Result</div>
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                <text x="60" y="54" textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: '22px', fontWeight: 'bold', fill: color }}>{result.score}</text>
                <text x="60" y="68" textAnchor="middle" style={{ fontFamily: 'Instrument Sans', fontSize: '8px', fill: '#64748b' }}>{level.toUpperCase()} RISK</text>
              </svg>
              <div style={{ width: '100%', padding: '16px 20px', background: result.fraud ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${result.fraud ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 4, textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, color: result.fraud ? '#ef4444' : '#10b981' }}>
                  {result.fraud ? '⚠ FRAUD DETECTED' : '✓ LEGITIMATE'}
                </div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginTop: 6 }}>
                  {result.fraud ? 'High probability of fraudulent activity' : 'Transaction appears normal'}
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Risk Factors</div>
                {[
                  { label: 'Amount', v: Math.min((parseFloat(form.amount) || 0) / 200, 100) },
                  { label: 'Country Risk', v: HIGH_RISK_COUNTRIES.includes(form.country) ? 85 : 12 },
                  { label: 'Device Risk', v: form.device === 'Unknown' ? 90 : form.device === 'Mobile' ? 35 : 15 },
                  { label: 'Tx Type Risk', v: HIGH_RISK_TYPES.includes(form.txType.toUpperCase()) ? 75 : 20 },
                  { label: 'Velocity', v: Math.min((parseInt(form.velocity) || 1) * 6, 99) },
                ].map(({ label, v }) => {
                  const val = Math.min(Math.round(v), 99);
                  return (
                    <div key={label} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b' }}>{label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: getRiskColor(val) }}>{val}</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(148,163,184,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${val}%`, height: '100%', background: getRiskColor(val), borderRadius: 2, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
