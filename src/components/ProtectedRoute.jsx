import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check localStorage first
        const authStatus = localStorage.getItem('isAuthenticated');
        const grNumber = localStorage.getItem('gr_number');

        if (!authStatus || authStatus !== 'true' || !grNumber) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        const response = await fetch('https://placement-portal-backend.placementportal.workers.dev/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            // Clear invalid auth data
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('gr_number');
            localStorage.removeItem('loginTime');
            setIsAuthenticated(false);
          }
        } else {
          // Token is invalid, clear auth data
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('gr_number');
          localStorage.removeItem('loginTime');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // On network error, check localStorage as fallback
        const localAuth = localStorage.getItem('isAuthenticated');
        if (localAuth === 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#1e40af',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '20px' }}>🔐 Verifying authentication...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-06-20 09:13:17
        </div>

      </div>
    );
  }

  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;