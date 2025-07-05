import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useUserProfile } from '../context/UserProfileContext';
import { useFitness } from '../context/FitnessContext';

const herculesImg = 'https://img.freepik.com/premium-vector/pixel-art-illustration-hercules-pixelated-greek-hercules-greek-mythology-hercules-pixelated_1038602-827.jpg';

const Dashboard = () => {
  const { session } = UserAuth();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const { 
    workoutLogs, 
    nutritionLogs, 
    progressLogs,
    loading 
  } = useFitness();

  useEffect(() => {
    document.title = 'HerculesAI';
  }, []);

  const getTodayData = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayWorkout = workoutLogs.find(log => 
      new Date(log.created_at).toISOString().split('T')[0] === today
    );
    
    const todayNutrition = nutritionLogs.filter(log => 
      new Date(log.created_at).toISOString().split('T')[0] === today
    );
    
    const todayProgress = progressLogs.find(log => 
      new Date(log.created_at).toISOString().split('T')[0] === today
    );
    
    return { todayWorkout, todayNutrition, todayProgress };
  };

  const getWeeklyData = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyWorkouts = workoutLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= weekAgo && logDate <= today;
    });
    
    const weeklyNutrition = nutritionLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= weekAgo && logDate <= today;
    });
    
    return { weeklyWorkouts, weeklyNutrition };
  };

  const { todayWorkout, todayNutrition, todayProgress } = getTodayData();
  const { weeklyWorkouts, weeklyNutrition } = getWeeklyData();

  const calculateWeeklyStats = () => {
    const totalWorkouts = weeklyWorkouts.length;
    const totalCalories = weeklyNutrition.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const avgCalories = totalCalories / 7;
    
    return { totalWorkouts, totalCalories, avgCalories };
  };

  const getWeightChange = () => {
    if (!todayProgress || !userProfile?.weight) return null;
    const change = todayProgress.weight_lbs - parseFloat(userProfile.weight);
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  const weeklyStats = calculateWeeklyStats();
  const weightChange = getWeightChange();

  if (profileLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <main className="ml-[220px] p-8 w-full flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="ml-[220px] p-8 w-full">
        <div className="flex flex-col items-center mb-8">
          <img src={herculesImg} alt="Hercules Pixel Art" className="w-24 h-24 rounded-full mb-4 border-4 border-teal-700" />
          {userProfile?.username ? (
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {userProfile.username}!</h1>
          ) : (
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome! <span className="text-teal-400">Please set your username in <Link to='/settings' className='underline hover:text-teal-300'>Settings</Link>.</span></h1>
          )}
        </div>

        {!userProfile?.goal && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6 mb-8 text-white">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">Complete Your Profile</h2>
            <p className="mb-4">To get your personalized fitness plan, please complete the onboarding questionnaire.</p>
            <Link to="/onboarding">
              <button className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">
                Start Onboarding
              </button>
            </Link>
          </div>
        )}

        {userProfile?.goal && (
          <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Your Plan Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-300">Goal:</span> 
                <span className="ml-2 text-teal-400 capitalize">{userProfile.goal}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Experience:</span> 
                <span className="ml-2 text-teal-400 capitalize">{userProfile.experience}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Gym Access:</span> 
                <span className="ml-2 text-teal-400 capitalize">{userProfile.gym_access}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Diet:</span> 
                <span className="ml-2 text-teal-400 capitalize">{userProfile.diet_preference}</span>
              </div>
            </div>
            <Link to="/settings" className="inline-block mt-4 text-teal-400 hover:text-teal-300 underline">
              Edit Plan Settings
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-2 text-teal-400">Today's Workout</h2>
            {todayWorkout ? (
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold">Type:</span> {todayWorkout.workout_type || 'Workout'}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span> {todayWorkout.duration_minutes || 0} min
                </div>
                <Link to="/workout" className="text-teal-400 hover:underline mt-2">View Details</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-gray-400">No workout logged today</div>
                <Link to="/workout" className="text-teal-400 hover:underline">Start Workout</Link>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-2 text-teal-400">Today's Nutrition</h2>
            {todayNutrition.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold">Meals:</span> {todayNutrition.length}
                </div>
                <div>
                  <span className="font-semibold">Calories:</span> {todayNutrition.reduce((sum, meal) => sum + (meal.calories || 0), 0)}
                </div>
                <div>
                  <span className="font-semibold">Protein:</span> {todayNutrition.reduce((sum, meal) => sum + (meal.protein_g || 0), 0)}g
                </div>
                <Link to="/nutrition" className="text-teal-400 hover:underline mt-2">View Details</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-gray-400">No meals logged today</div>
                <Link to="/nutrition" className="text-teal-400 hover:underline">Log Meal</Link>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-2 text-teal-400">Today's Progress</h2>
            {todayProgress ? (
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold">Weight:</span> {todayProgress.weight_lbs} lbs
                </div>
                {weightChange && (
                  <div>
                    <span className="font-semibold">Change:</span> 
                    <span className={`ml-1 ${weightChange.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                      {weightChange.direction === 'up' ? '+' : '-'}{weightChange.value} lbs
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-semibold">Body Fat:</span> {todayProgress.body_fat_percentage}%
                </div>
                <Link to="/progress" className="text-teal-400 hover:underline mt-2">View Details</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-gray-400">No progress logged today</div>
                <Link to="/progress" className="text-teal-400 hover:underline">Log Progress</Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Weekly Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Workouts:</span>
                <span className="text-teal-400 font-semibold">{weeklyStats.totalWorkouts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg Calories:</span>
                <span className="text-teal-400 font-semibold">{Math.round(weeklyStats.avgCalories)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Calories:</span>
                <span className="text-teal-400 font-semibold">{weeklyStats.totalCalories}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/workout" className="block w-full text-center py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition">
                Log Workout
              </Link>
              <Link to="/nutrition" className="block w-full text-center py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition">
                Log Meal
              </Link>
              <Link to="/progress" className="block w-full text-center py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition">
                Log Progress
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Recent Activity</h2>
            <div className="space-y-2 text-sm">
              {workoutLogs.slice(0, 3).map((log, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{log.workout_type || 'Workout'}</span>
                  <span className="text-teal-400">{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
              ))}
              {workoutLogs.length === 0 && (
                <div className="text-gray-400">No recent workouts</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 