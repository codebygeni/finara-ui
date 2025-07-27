// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../firebaseConfig';
import { User } from 'firebase/auth';
import { getUserDetails, getUserMobile, UserDetails } from '../services/apiService'; // Import getUserDetails and UserDetails type

interface AuthContextType {
  user: User | null; // Firebase User
  backendUser: UserDetails | null; // Your backend's user details
  loading: boolean;
  fetchBackendUser: () => Promise<void>; // Function to refetch backend user data
  setBackendUser: (user: UserDetails | null) => void; // Function to manually set backend user
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Firebase user
  const [backendUser, setBackendUser] = useState<UserDetails | null>(null); // Backend user
  const [loading, setLoading] = useState(true);

  // Function to fetch backend user details
  const fetchBackendUser = async () => {
    if (!user) { // Only fetch if Firebase user is authenticated
      setBackendUser(null);
      return;
    }
    // Assume Firebase user's UID is the same as your backend's userId
    // If your backend uses a different ID, you'll need a different mapping after login.
    const userId = getUserMobile() || ""; // Or fetch from a stored token/response after login

    try {
      // You might also pass the Firebase ID token if your backend verifies it
      const details = await getUserDetails(userId);
      setBackendUser(details);
    } catch (error) {
      console.error('Failed to fetch backend user details:', error);
      setBackendUser(null); // Clear backend user if fetch fails (e.g., user not found in backend)
      // Optionally, handle specific errors like token expiry by redirecting to login
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setBackendUser(null); // Clear backend user if Firebase user logs out
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchBackendUser, user?.uid]); // Re-run effect if Firebase user ID changes (e.g., different user logs in)
  // Added user?.uid as dependency to refetch backend user if firebase user changes.

  // Also, add an effect to fetch user details if the `user` object is set/updated (e.g. on login/register)
  useEffect(() => {
    if (user && !backendUser && !loading) { // If Firebase user exists but backend user isn't loaded yet
      fetchBackendUser();
    }
  }, [user, backendUser, loading, fetchBackendUser]); // Add dependencies

  return (
    <AuthContext.Provider value={{ user, backendUser, loading, fetchBackendUser, setBackendUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};