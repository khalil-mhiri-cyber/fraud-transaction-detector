import { NavLink, Outlet, useNavigate } from 'react-router'

const NAV = [
  { to: '/user/dashboard', label: 'My Account', icon: HomeIcon },
  { to: '/user/transactions', label: 'Transactions', icon: TxIcon },
  { to: '/user/new-transaction', label: 'New Transfer', icon: SendIcon },
  { to: '/user/profile', label: 'Profile', icon: UserIcon },
]

export default function UserLayout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('sentinel_auth')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080d1a', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <header style={{ height: 60, background: '#0a1020', borderBottom: '1px solid rgba(148,163,184,0.07)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 32, flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2Z" fill="#38bdf8" fillOpacity={0.15} stroke="#38bdf8" strokeWidth={1.5} />
            <path d="M9 12l2 2 4-4" stroke="#38bdf8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <span style={{ fontFamily: 'Instrument Sans', fontSize: 15, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>SentinelAI</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 8 }}>Customer Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 2 }}>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
                borderRadius: 4, textDecoration: 'none',
                background: isActive ? 'rgba(56,189,248,0.10)' : 'transparent',
                color: isActive ? '#38bdf8' : '#64748b',
                fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s', borderBottom: isActive ? '2px solid #38bdf8' : '2px solid transparent',
              })}
            >
              {({ isActive }) => <><Icon active={isActive} />{label}</>}
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Balance pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 6, padding: '6px 14px' }}>
          <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>Balance</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#38bdf8' }}>$12,480.50</span>
        </div>

        <div style={{ width: 1, height: 20, background: 'rgba(148,163,184,0.1)' }} />

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 700, color: '#fff' }}>JD</span>
          </div>
          <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>John Doe</span>
        </div>

        <button onClick={logout} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 4, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
          Logout
        </button>
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box' as const }}>
        <Outlet />
      </main>
    </div>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 6L7 1l6 5v7H9V9H5v4H1V6Z" stroke="currentColor" strokeWidth={1.4} fill={active ? 'rgba(56,189,248,0.2)' : 'none'} strokeLinejoin="round"/></svg>
}
function TxIcon({ active: _a }: { active: boolean }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3.5h12M1 7h8M1 10.5h10" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"/></svg>
}
function SendIcon({ active: _a }: { active: boolean }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 6-12 6V8.5l8-1.5-8-1.5V1Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round"/></svg>
}
function UserIcon({ active: _a }: { active: boolean }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth={1.4}/><path d="M1.5 13c0-3.036 2.462-5.5 5.5-5.5s5.5 2.464 5.5 5.5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"/></svg>
}
