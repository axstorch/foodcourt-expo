import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../../supabase'; // your supabase.js
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔹 Get session on load
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.log("Error getting session:", error.message);
      setSession(data.session);
      setIsLoading(false);
    };

    getSession();

    // 🔹 Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Session changed:", session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null); // clears both session and user automatically
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null, // ✅ derived from session
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
