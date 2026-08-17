import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import UserLayout from './layouts/UserLayout.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
import UserTransactions from './pages/user/UserTransactions.jsx'
import UserTransactionDetail from './pages/user/UserTransactionDetail.jsx'
import NewTransaction from './pages/user/NewTransaction.jsx'
import UserProfile from './pages/user/UserProfile.jsx'

function PrivateRoute({ children }) {
  // Check either JWT token (real auth) or sentinel_auth (demo)
  const hasAuth = localStorage.getItem('jwt_token') || localStorage.getItem('sentinel_auth')
  return hasAuth ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User (protected) */}
        <Route path="/user" element={<PrivateRoute><UserLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="transactions" element={<UserTransactions />} />
          <Route path="transactions/:id" element={<UserTransactionDetail />} />
          <Route path="new-transaction" element={<NewTransaction />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Admin placeholder */}
        <Route path="/admin/*" element={
          <PrivateRoute>
            <div style={{ minHeight: '100vh', background: '#080d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 16, color: '#64748b' }}>Admin Dashboard — Coming soon</div>
            </div>
          </PrivateRoute>
        } />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
