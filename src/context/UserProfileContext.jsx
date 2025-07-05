import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const { session } = UserAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    if (!session?.user?.id) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setUserProfile(null);
        } else {
          throw fetchError;
        }
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      setError(err.message);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const setProfileUsername = (username) => {
    if (userProfile) {
      setUserProfile(prev => ({ ...prev, username }));
    }
  };

  const updateUserProfile = async (updates) => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [session]);

  const value = {
    userProfile,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    setProfileUsername
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}; 