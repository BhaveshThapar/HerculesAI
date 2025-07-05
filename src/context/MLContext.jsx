import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAIRecommendations } from '../services/mlService';
import { useUserProfile } from './UserProfileContext';
import { transformProfile, isProfileCompleteForML } from '../utils/profileTransformer';

const MLContext = createContext();

export const useML = () => {
  const context = useContext(MLContext);
  if (!context) {
    throw new Error('useML must be used within an MLProvider');
  }
  return context;
};

export const MLProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userProfile } = useUserProfile();

  const fetchRecommendations = async () => {
    if (!userProfile || !isProfileCompleteForML(userProfile)) {
      setRecommendations(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transformedProfile = transformProfile(userProfile);
      const data = await getAIRecommendations(transformedProfile);
      setRecommendations(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations');
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    await fetchRecommendations();
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userProfile]);

  const value = {
    recommendations,
    loading,
    error,
    refreshRecommendations,
    fetchRecommendations
  };

  return (
    <MLContext.Provider value={value}>
      {children}
    </MLContext.Provider>
  );
}; 