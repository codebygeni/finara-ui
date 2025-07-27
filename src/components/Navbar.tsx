// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, backendUser, setBackendUser } = useAuth(); // Also get setBackendUser to clear context
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken'); // Clear auth token
      localStorage.removeItem('userMobile'); // NEW: Clear user mobile
      setBackendUser(null); // Clear backend user from context
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) { // If no Firebase user, don't show navbar
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/chat">Finara</Link>
      </div>
      <ul className="navbar-links">
        {backendUser && (
          <li className="welcome-message">
            Hello, {backendUser.name}!
          </li>
        )}
        <li>
          <Link
            to="/chat"
            className={location.pathname === '/chat' ? 'active' : ''}
          >
            Chat
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;