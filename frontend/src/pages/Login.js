import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  function submit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('sentinel_auth', JSON.stringify({ email, role }));
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    }, 900);
  }

  const isAdmin = role === 'admin';

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(8,13,26,0.85)',
    border: '1px solid rgba(148,163,184,0.12)',
    borderRadius: 4,
    fontFamily: 'Instrument Sans',
    fontSize: 14,
    color: '#e2e8f0',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: `radial-gradient(ellipse, ${isAdmin ? 'rgba(245,158,11,0.06)' : 'rgba(56,189,248,0.06)'} 0%, transparent 70%)`, pointerEvents: 'none', transition: 'background 0.4s' }} />

      <div style={{ position: 'relative', width: 460, padding: '48px 40px', background: '#0d1528', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 8 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2Z" fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
            <path d="M9 12l2 2 4-4" stroke="#f59e0b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 20, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>SentinelAI</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fraud Detection Platform</div>
          </div>
        </div>

        {/* Role selector */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.04em', marginBottom: 10 }}>SIGN IN AS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { id: 'user', label: 'Customer', icon: '👤', desc: 'Submit & track your transactions', accent: '#38bdf8' },
              { id: 'admin', label: 'Analyst', icon: '🛡', desc: 'Manage fraud detection & alerts', accent: '#f59e0b' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRole(opt.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: role === opt.id ? `rgba(${opt.id === 'admin' ? '245,158,11' : '56,189,248'},0.08)` : 'rgba(148,163,184,0.03)',
                  border: `1.5px solid ${role === opt.id ? (opt.id === 'admin' ? 'rgba(245,158,11,0.35)' : 'rgba(56,189,248,0.35)') : 'rgba(148,163,184,0.08)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6 }}>{opt.icon}</div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: role === opt.id ? opt.accent : '#94a3b8', marginBottom: 3 }}>{opt.label}</div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Email address</label>
            <input
              type="email"
              placeholder={isAdmin ? 'analyst@sentinelai.io' : 'john.doe@email.com'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = isAdmin ? 'rgba(245,158,11,0.4)' : 'rgba(56,189,248,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.12)')}
            />
          </div>

          <div>
            <label style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = isAdmin ? 'rgba(245,158,11,0.4)' : 'rgba(56,189,248,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5Z" stroke="currentColor" strokeWidth={1.5} />
                  <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth={1.5} />
                  {!showPw && <path d="M2 2l12 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '8px 12px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: '12px',
              border: 'none',
              borderRadius: 4,
              fontFamily: 'Instrument Sans',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(100,100,100,0.4)' : (isAdmin ? '#f59e0b' : '#38bdf8'),
              color: isAdmin ? '#0a0f1e' : '#0a0f1e',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Authenticating...' : `Sign in as ${isAdmin ? 'Analyst' : 'Customer'}`}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>Don't have an account? </span>
          <Link to="/signup" style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: isAdmin ? '#f59e0b' : '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
            Create account
          </Link>
        </div>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(148,163,184,0.07)', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['JWT Auth', '256-bit AES', 'SOC 2 Type II'].map(t => (
            <span key={t} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 3, padding: '3px 8px' }}>
              {t}
            </span>
          ))}
        </div>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#4b5563', textAlign: 'center', marginTop: 10 }}>
          Demo: any email and password
        </p>
      </div>
    </div>
  );
}

export default Login;
