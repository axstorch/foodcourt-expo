import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import supabase from '../../supabase';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

const SUPABASE_URL = supabase?.url || process.env.EXPO_PUBLIC_SUPABASE_URL || '';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      // ✅ Wait for Supabase to restore persisted session from storage
      const keys = await AsyncStorage.getAllKeys();
      console.log('🗝️ Stored keys:', keys);

      const supaData = await AsyncStorage.getItem('sb-' + SUPABASE_URL.split('//')[1] + '-auth-token');
      console.log('🔑 Stored Supabase auth data:', supaData);

      const { data, error } = await supabase.auth.getSession();
      console.log('🧩 Session from getSession():', data.session);
      if (mounted) {
        if (error) console.warn('Error restoring session:', error.message);
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      }
      await supabase.auth.startAutoRefresh();

    };

    initSession();


    // Listen for login/logout/refresh events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
      console.log('Auth state changed:', _event, newSession?.user?.id);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;
