'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange, getCurrentUser, getUserProfile, signIn as supabaseSignIn, signOut as supabaseSignOut } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  profile: any | null;
  branch: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [branch, setBranch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await getUserProfile(user.id);
        if (profileData) {
          setProfile(profileData as any);
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await getUserProfile(session.user.id);
        if (profileData) {
          setProfile(profileData as any);
        }
      } else {
        setUser(null);
        setProfile(null);
        setBranch(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    branch,
    loading,
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabaseSignIn(email, password);
      if (data?.user) {
        const { data: profileData } = await getUserProfile(data.user.id);
        if (profileData) {
          setProfile(profileData as any);
        }
      }
      return { data, error };
    },
    signOut: async () => {
      await supabaseSignOut();
      setUser(null);
      setProfile(null);
      setBranch(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
