import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onSuccess: (token: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/auth/validate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });

      if (!res.ok) {
        throw new Error('Invalid API Key');
      }

      const data = await res.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', data.email);
      onSuccess(data.token, data.email);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">💎 Gems SIMCE</h1>
        <p className="login-subtitle">Plataforma IA para Educadores</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="apiKey">Tu API Key</label>
            <input
              id="apiKey"
              type="text"
              placeholder="sk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading || !apiKey}
            className="login-button"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-help">
          <p>¿No tienes API Key?</p>
          <p>Cómpralo en <a href="https://jumpseller.com" target="_blank" rel="noopener">Jumpseller</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
