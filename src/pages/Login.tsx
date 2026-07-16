import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background elements */}
      <div className="auth-bg-ornament auth-bg-ornament-1">ॐ</div>
      <div className="auth-bg-ornament auth-bg-ornament-2">☸</div>
      <div className="auth-bg-ornament auth-bg-ornament-3">🙏</div>
      <div className="auth-bg-ornament auth-bg-ornament-4">✦</div>

      <div className="auth-container">
        {/* Logo Section */}
        <div className="auth-logo-section">
          <div className="auth-logo-ring">
            <div className="auth-logo-inner">
              <BookOpen className="w-10 h-10 text-amber-100" />
            </div>
          </div>
          <h1 className="auth-title">श्रीमद्भगवद्गीता</h1>
          <p className="auth-subtitle">जीवन का दिव्य मार्गदर्शन</p>
        </div>

        {/* Login Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Welcome Back</h2>
            <p className="auth-card-desc">Sign in to continue your spiritual journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">!</span>
                {error}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="auth-input"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-btn"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="auth-bottom-text">
          <span className="auth-sanskrit-quote">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
