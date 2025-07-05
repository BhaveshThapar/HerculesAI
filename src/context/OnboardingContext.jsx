import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState({
    goal: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    gym_access: '',
    experience: '',
    diet_preference: ''
  });

  const updateOnboardingData = (field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetOnboardingData = () => {
    setOnboardingData({
      goal: '',
      age: '',
      weight: '',
      height: '',
      gender: '',
      gym_access: '',
      experience: '',
      diet_preference: ''
    });
  };

  const value = {
    onboardingData,
    updateOnboardingData,
    resetOnboardingData
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}; 