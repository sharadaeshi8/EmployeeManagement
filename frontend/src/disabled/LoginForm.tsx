import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogIn } from 'lucide-react';
import './LoginForm.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'employee') => {
    if (role === 'admin') {
      setEmail('admin@company.com');
      setPassword('admin123');
    } else {
      setEmail('john.smith@company.com');
      setPassword('employee123');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-form">
        <div className="login-header">
          <LogIn size={32} />
          <h2>Employee Management Login</h2>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
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

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-text">Demo Accounts:</p>
          <div className="demo-buttons">
            <button 
              type="button"
              className="demo-button admin"
              onClick={() => fillDemo('admin')}
              disabled={loading}
            >
              Admin Demo
            </button>
            <button 
              type="button"
              className="demo-button employee"
              onClick={() => fillDemo('employee')}
              disabled={loading}
            >
              Employee Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;