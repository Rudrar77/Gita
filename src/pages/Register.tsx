import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, UserPlus, User, Loader2, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-400' };
    if (password.length < 8) return { level: 2, text: 'Fair', color: 'bg-yellow-400' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 4, text: 'Strong', color: 'bg-green-500' };
    return { level: 3, text: 'Good', color: 'bg-green-400' };
  };

  const passwordStrength = getPasswordStrength();

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div className="auth-success-icon">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="auth-card-title" style={{ marginTop: '1.5rem' }}>Account Created!</h2>
            <p className="auth-card-desc" style={{ marginTop: '0.5rem' }}>
              Welcome to your spiritual journey. Redirecting...
            </p>
            <div className="auth-success-loader" />
          </div>
        </div>
      </div>
    );
  }

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
          <p className="auth-subtitle">Begin Your Spiritual Journey</p>
        </div>

        {/* Register Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-desc">Join thousands on the path of wisdom</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">!</span>
                {error}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-name">Full Name</label>
              <div className="auth-input-wrap">
                <User className="auth-input-icon" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="auth-input"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-email">Email</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" />
                <input
                  id="register-email"
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
              <label className="auth-label" htmlFor="register-password">Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="auth-input"
                  autoComplete="new-password"
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
              {/* Password strength bar */}
              {password && (
                <div className="auth-password-strength">
                  <div className="auth-strength-bar">
                    <div
                      className={`auth-strength-fill ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                    />
                  </div>
                  <span className="auth-strength-text">{passwordStrength.text}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="register-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="auth-input"
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-eye-btn"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="auth-field-error">Passwords do not match</p>
              )}
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
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="auth-bottom-text">
          <span className="auth-sanskrit-quote">
            योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
