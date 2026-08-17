import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Admin routes will be added later */}
        <Route path="/admin/*" element={<div style={{ color: 'white', padding: 20 }}>Admin Dashboard - Coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
