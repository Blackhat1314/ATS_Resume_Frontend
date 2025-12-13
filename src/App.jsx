import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AnalysisPage from './pages/AnalysisPage';
import MockQuestionsPage from './pages/MockQuestionsPage';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken('');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/signup" 
          element={!token ? <SignupPage onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={token ? <AnalysisPage token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/mock-questions" 
          element={token ? <MockQuestionsPage token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '0.75rem',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.8rem',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        Made with <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>❤️</span> by Mayank
      </footer>
    </Router>
  );
}

export default App;
