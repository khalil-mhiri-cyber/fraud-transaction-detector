import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

// User
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserTransactions from './pages/user/UserTransactions';
import UserTransactionDetail from './pages/user/UserTransactionDetail';
import NewTransaction from './pages/user/NewTransaction';
import UserProfile from './pages/user/UserProfile';

import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Prediction from './pages/Prediction';
import Settings from './pages/Settings';

function PrivateRoute({ children, requiredRole }) {
  const auth = (() => {
    try { return JSON.parse(localStorage.getItem('sentinel_auth') || '{}'); }
    catch { return {}; }
  })();
  const hasAuth = auth.email || localStorage.getItem('jwt_token');
  if (!hasAuth) return <Navigate to="/login" replace />;
  if (requiredRole && auth.role !== requiredRole) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* User routes */}
          <Route path="/user" element={<PrivateRoute><UserLayout /></PrivateRoute>}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="transactions" element={<UserTransactions />} />
            <Route path="transactions/:id" element={<UserTransactionDetail />} />
            <Route path="new-transaction" element={<NewTransaction />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
