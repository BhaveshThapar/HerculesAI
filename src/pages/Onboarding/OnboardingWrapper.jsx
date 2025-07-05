import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { supabase } from '../../supabaseClient';
import { transformProfileData } from '../../utils/profileTransformer';
import Step1Goal from './Step1Goal';
import Step2Stats from './Step2Stats';
import Step3Gym from './Step3Gym';
import Step4Experience from './Step4Experience';
import Step5Diet from './Step5Diet';
import GeneratingPlan from './GeneratingPlan';

const steps = [
  { label: 'Goal', component: Step1Goal },
  { label: 'Stats', component: Step2Stats },
  { label: 'Gym', component: Step3Gym },
  { label: 'Experience', component: Step4Experience },
  { label: 'Diet', component: Step5Diet },
];

const OnboardingWrapper = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { session } = UserAuth();
  const { updateOnboardingData } = useOnboarding();
  const { fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();

  const handleNext = (data) => {
    const stepKey = steps[step].label.toLowerCase();
    const updatedAnswers = { ...answers, [stepKey]: data };
    setAnswers(updatedAnswers);
    updateOnboardingData(stepKey, data);
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setGenerating(true);
      saveOnboardingData(updatedAnswers);
    }
  };

  const saveOnboardingData = async (answersToSave = answers) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('user_id', session.user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Profile not found. Please complete signup first.');
        } else {
          throw fetchError;
        }
      }

      const profileData = transformProfileData(answersToSave, session.user.id);


      if (!profileData.goal) {
        throw new Error('Goal is required');
      }
      if (!profileData.gender) {
        throw new Error('Gender is required');
      }
      if (!profileData.age || profileData.age < 13 || profileData.age > 120) {
        throw new Error('Valid age is required (13-120)');
      }
      if (!profileData.height || profileData.height < 100 || profileData.height > 250) {
        throw new Error('Valid height is required (100-250 cm)');
      }
      if (!profileData.weight || profileData.weight < 30 || profileData.weight > 500) {
        throw new Error('Valid weight is required (30-500 lbs)');
      }
      if (!profileData.diet_preference) {
        throw new Error('Diet preference is required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', session.user.id)
        .select();

      if (error) {
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(profileData);
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
        } else {
          console.error('Error updating profile:', error);
          throw error;
        }
      } else {
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setError(error.message || 'Failed to save onboarding data. Please try again.');
      setGenerating(false);
      return;
    }

    await fetchUserProfile();
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  if (generating) {
    if (success) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h2 className="text-2xl font-bold mb-4 text-teal-400">Onboarding Complete!</h2>
          <div className="text-6xl mb-4"></div>
          <p className="text-gray-300">Redirecting to your dashboard...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setGenerating(false);
            }}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    return <GeneratingPlan />;
  }

  const StepComponent = steps[step].component;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 py-12">
      <h1 className="text-3xl font-bold mb-8 text-teal-400">Onboarding Questionnaire</h1>
      <div className="w-80 mb-6">
        <div className="bg-gray-800 h-2 rounded-full">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-300 mt-2">
          Step {step + 1} of {steps.length}
        </div>
      </div>
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow text-white">
        <StepComponent onNext={handleNext} />
      </div>
    </div>
  );
};

export default OnboardingWrapper; 