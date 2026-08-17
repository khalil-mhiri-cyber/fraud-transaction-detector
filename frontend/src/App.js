import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="prediction" element={<div style={{ color: '#94a3b8' }}>Prediction - Coming soon</div>} />
          <Route path="analytics" element={<div style={{ color: '#94a3b8' }}>Analytics - Coming soon</div>} />
          <Route path="alerts" element={<div style={{ color: '#94a3b8' }}>Alerts - Coming soon</div>} />
          <Route path="settings" element={<div style={{ color: '#94a3b8' }}>Settings - Coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
