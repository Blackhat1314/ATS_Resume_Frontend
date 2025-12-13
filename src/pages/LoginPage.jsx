import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(getApiUrl('api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || 'Login failed');
      }
      const data = await resp.json();
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <h1>📄 ATS Resume Analyzer</h1>
            <p className="login-subtitle">Get instant feedback on how well your resume matches job descriptions</p>
            <div className="login-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>ATS Score Analysis</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Mock Interview Questions</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Resume Improvement Suggestions</span>
              </div>
            </div>
          </div>
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p className="login-card-subtitle">Sign in to your account</p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="login-note">
              Don't have an account?{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
                style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


