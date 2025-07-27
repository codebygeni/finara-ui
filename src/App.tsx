// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register'; // Ensure this path is correct
import SignIn from './pages/SignIn';     // Ensure this path is correct
import ChatUI from './pages/ChatUI';     // Ensure this path is correct
import Dashboard from './pages/Dashboard'; // Ensure this path is correct

import { AuthProvider, useAuth } from './context/AuthContext'; // NEW: Import AuthProvider and useAuth
import PrivateRoute from './components/PrivateRoute';         // NEW: Import PrivateRoute
import Navbar from './components/Navbar';                     // NEW: Import Navbar

// Main AppContent component that uses the authentication context and renders routes
const AppContent: React.FC = () => {
  const { user, loading } = useAuth(); // Use auth context here to determine rendering logic

  // Display a loading indicator while the authentication state is being determined
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
        Loading Application...
      </div>
    );
  }

  return (
    <>
      {/* Conditionally render Navbar only if a user is logged in */}
      {user && <Navbar />}
      <Routes>
        {/* Public routes, accessible to anyone */}
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes: accessible only if the user is authenticated */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatUI />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Root path logic:
            - If authenticated, redirect to /chat
            - If not authenticated, redirect to /signin
        */}
        <Route
          path="/"
          element={user ? <Navigate to="/chat" replace /> : <Navigate to="/signin" replace />}
        />
         {/* Catch-all route: Redirects any unknown paths to the root, which then handles auth */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// Root App component that provides the AuthContext to its children
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;