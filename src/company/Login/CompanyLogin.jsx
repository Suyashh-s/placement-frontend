import React, { useState } from 'react';
import './CompanyLogin.css';
import dmceLogo from '../../assets/images/dmce.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SiDatagrip } from 'react-icons/si';

const CompanyLogin = () => {
  const [companyEmail, setCompanyEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!companyEmail.trim() || !password.trim()) {
      setError('❌ Both fields are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://placement-portal-backend.placementportal.workers.dev/api/company-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email : companyEmail,
          password:password,
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
      console.log(data)

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('company_name', data.company_name);
      localStorage.setItem('email', data.email);
      localStorage.setItem('company_logo', data.company_logo);
      localStorage.setItem('loginTime', data.login_time || new Date().toISOString());

      if (data.password_updated === 0) {
        window.location.href = '/company/update-pass';
      } else if (data.profile_created === false) {
        window.location.href = '/companyRegi';
      } else {
        window.location.href = '/company-dashboard';
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(`❌ ${err.message || 'Server error. Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Announcement bar using <marquee> */}
  <div style={{ backgroundColor: '#1e1e3f', color: 'white', padding: '10px 0', fontWeight: 'bold' }}>
    <marquee scrollamount="6" behavior="scroll" direction="left">
    📣 We are proud to announce the NAAC accreditation (Cycle-2) of our institute with Grade 'A'! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    🏆 NBA accreditation of Civil and Chemical Engineering achieved! &nbsp;&nbsp;
    🎓 Your involvement in our placement process inspires us to continuously strive for excellence. 🎓 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    📣 We are proud to announce the NAAC accreditation (Cycle-2) of our institute with Grade 'A'! &nbsp;&nbsp;
    🏆 NBA accreditation of Civil and Chemical Engineering achieved! &nbsp;&nbsp;
    🎓 Your involvement in our placement process inspires us to continuously strive for excellence. 🎓 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </marquee>
    
  </div>
  

      <div className="login-wrapper">
        <div className="left-panel">
          <img src={dmceLogo} alt="DMCE Logo" className="logo" />
          <h2>DMCE - Training & Placement Portal</h2>
        </div>

        <div className="right-panel">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>COMPANY LOGIN</h2>

            <input
              type="text"
              placeholder="Registered Email ID"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />

            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="forgot-password-link">
              <Link to="/company/forgot-pass">Forgot Password?</Link>
            </div>
            <br />

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompanyLogin;

