import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUserName(decoded.name || decoded.email || 'User');
      } catch (error) {
        setIsAuthenticated(false);
        setUserName('');
      }
    } else {
      setIsAuthenticated(false);
      setUserName('');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Don't show navbar on signup and login pages
  if (location.pathname === '/signup' || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🐾</span>
          <span className="brand-text">HuskyHub</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link 
                to="/homepage" 
                className={`nav-link ${isActive('/homepage') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/events" 
                className={`nav-link ${isActive('/events') ? 'active' : ''}`}
              >
                Browse Events
              </Link>
              <Link 
                to="/events/new" 
                className={`nav-link ${isActive('/events/new') ? 'active' : ''}`}
              >
                Create Event
              </Link>
              <div className="user-menu">
                <span className="user-name">👤 {userName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className={`nav-link ${isActive('/events') ? 'active' : ''}`}
              >
                Browse Events
              </Link>
              <Link to="/login" className="nav-link login-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link signup-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


