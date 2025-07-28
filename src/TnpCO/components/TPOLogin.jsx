import React, { useState } from 'react';
import './TPOLogin.css';
import dmceLogo from '../../assets/images/dmce.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TPOLogin = () => {
  const [tpoId, setTpoId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Use environment variables or encoded values for credentials
  // This is safer than hardcoding in plain text
  const dummyCredentials = {
    // These values are obfuscated but still not secure for production
    // Just for development/testing purposes
    id: atob('YWRtaW5fcG9ydGFs'), 
    pass: atob('ZG1jZUBhZG1pbjEyMw==') 
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!tpoId.trim() || !password.trim()) {
      setError('❌ Both fields are required.');
      return;
    }

    if (tpoId.length < 4) {
      setError('❌ TPO ID must be at least 4 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // For development/testing, allow direct login with dummy credentials
      // This bypasses the actual API call during development
      if (
          tpoId === dummyCredentials.id && 
          password === dummyCredentials.pass) {
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock successful login
        localStorage.setItem('tpoAuthenticated', 'true');
        localStorage.setItem('tpo_id', tpoId);
        localStorage.setItem('tpo_email', 'tpo@dmce.ac.in');
        localStorage.setItem('tpo_name', 'TPO Administrator');
        localStorage.setItem('loginTime', '2025-07-13 08:48:24'); // Updated timestamp
        localStorage.setItem('currentUser', 'kshitij-dmce'); // Using the specified user
        
        // Redirect to /upload
        window.location.href = '/upload';
        return;
      }

      // Real API call for production
      const res = await fetch('https://placement.suyahsawant.com/api/auth/tpo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tpo_id: tpoId,
          password,
        }),
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text);
      }

      if (!res.ok) {
        setError(data?.error || '❌ Login failed');
        return;
      }

      // Store authentication information
      localStorage.setItem('tpoAuthenticated', 'true');
      localStorage.setItem('tpo_id', data.tpo_id || tpoId);
      localStorage.setItem('tpo_email', data.email || 'tpo@dmce.ac.in');
      localStorage.setItem('tpo_name', data.full_name || 'TPO Administrator');
      localStorage.setItem('loginTime', '2025-07-13 08:48:24'); // Updated timestamp
      localStorage.setItem('currentUser', 'kshitij-dmce'); // Using the specified user

      // Redirect to /upload
      window.location.href = '/upload';

    } catch (err) {
      console.error('Login error:', err);
      setError(`❌ ${err.message || 'Server error. Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpo-login-wrapper">
      <div className="tpo-left-panel">
        <img src={dmceLogo} alt="DMCE Logo" className="tpo-logo" />
        <h2>DMCE - Training & Placement Portal</h2>
      </div>

      <div className="tpo-right-panel">
        <form className="tpo-login-form" onSubmit={handleLogin}>
          <h2>TPO LOGIN</h2>

          <input
            type="text"
            placeholder="TPO ID"
            value={tpoId}
            onChange={(e) => setTpoId(e.target.value)}
            maxLength={25}
            className="tpo-input"
          />

          <div className="tpo-password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tpo-input"
            />
            <button
              type="button"
              className="tpo-password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="tpo-forgot-password-link">
            <Link to="/tpo-forgot-password">Forgot Password?</Link>
          </div>
          <br />

          {error && <p className="tpo-error">{error}</p>}

          <button type="submit" disabled={loading} className="tpo-login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TPOLogin