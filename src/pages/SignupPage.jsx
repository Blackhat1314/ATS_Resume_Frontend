import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';
import './LoginPage.css';

function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(getApiUrl('api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || 'Signup failed');
      }
      const data = await resp.json();
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Signup failed');
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
            <h2>Create Account</h2>
            <p className="login-card-subtitle">Sign up to get started</p>
            <form onSubmit={handleSignup}>
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
                  placeholder="Enter your password (min 6 characters)"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <p className="login-note">
              Already have an account?{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

