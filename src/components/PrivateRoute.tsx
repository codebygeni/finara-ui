// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
        Loading Application...
      </div>
    );
  }

  if (!user) {
    // Redirect to the sign-in page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;