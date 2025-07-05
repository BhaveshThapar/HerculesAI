import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useUserProfile } from '../context/UserProfileContext';
import MLRecommendations from '../components/MLRecommendations';

const herculesImg = 'https://img.freepik.com/premium-vector/pixel-art-illustration-hercules-pixelated-greek-hercules-greek-mythology-hercules-pixelated_1038602-827.jpg';

const MLPage = () => {
  const { userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('meals');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');

  const mealTypes = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const bodyParts = ['all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="ml-[220px] p-8 w-full">
        <div className="flex flex-col items-center mb-8">
          <img src={herculesImg} alt="Hercules Pixel Art" className="w-20 h-20 rounded-full mb-4 border-4 border-teal-700" />
          <h1 className="text-3xl font-bold mb-2 text-white">AI Fitness Assistant</h1>
          <p className="text-teal-400">Personalized recommendations powered by machine learning</p>
        </div>

        {!userProfile?.goal ? (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6 mb-8 text-white">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">Complete Your Profile</h2>
            <p className="mb-4">To get personalized AI recommendations, please complete the onboarding questionnaire.</p>
            <a href="/onboarding" className="inline-block px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">
              Start Onboarding
            </a>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg p-6 mb-8 text-white border border-teal-900">
              <h2 className="text-2xl font-semibold mb-4 text-teal-400">Your Profile</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 p-3 rounded">
                  <div className="text-sm text-gray-400">Goal</div>
                  <div className="text-white font-semibold capitalize">{userProfile.goal}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="text-sm text-gray-400">Experience</div>
                  <div className="text-white font-semibold capitalize">{userProfile.experience}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="text-sm text-gray-400">Equipment</div>
                  <div className="text-white font-semibold capitalize">{userProfile.gym_access?.replace('_', ' ')}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="text-sm text-gray-400">Diet</div>
                  <div className="text-white font-semibold capitalize">{userProfile.diet_preference || 'All'}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8 text-white border border-teal-900">
              <h2 className="text-2xl font-semibold mb-4 text-teal-400">AI Recommendations</h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('meals')}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    activeTab === 'meals' 
                      ? 'bg-teal-700 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Meal Recommendations
                </button>
                <button
                  onClick={() => setActiveTab('exercises')}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    activeTab === 'exercises' 
                      ? 'bg-teal-700 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Exercise Recommendations
                </button>
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    activeTab === 'workout' 
                      ? 'bg-teal-700 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Complete Workout Plan
                </button>
              </div>

              {activeTab === 'meals' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">Filter by Meal Type:</label>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Meals' : type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'exercises' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">Filter by Body Part:</label>
                  <select
                    value={selectedBodyPart}
                    onChange={(e) => setSelectedBodyPart(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                  >
                    {bodyParts.map(part => (
                      <option key={part} value={part}>
                        {part === 'all' ? 'All Body Parts' : part}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-gray-900 rounded-lg p-4">
                {activeTab === 'meals' && (
                  <MLRecommendations
                    type="meals"
                    mealType={selectedMealType === 'all' ? null : selectedMealType}
                    nRecommendations={8}
                    showFilters={false}
                    onSelect={(meal) => {
                      console.log('Selected meal:', meal);
                      alert(`Selected: ${meal.meal_name}\nCalories: ${meal.calories}\nProtein: ${meal.protein_g}g\nCarbs: ${meal.carbs_g}g\nFat: ${meal.fat_g}g`);
                    }}
                  />
                )}

                {activeTab === 'exercises' && (
                  <MLRecommendations
                    type="exercises"
                    bodyPart={selectedBodyPart === 'all' ? null : selectedBodyPart}
                    nRecommendations={10}
                    showFilters={false}
                    onSelect={(exercise) => {
                      console.log('Selected exercise:', exercise);
                      alert(`Selected: ${exercise.exercise_name}\nBody Part: ${exercise.body_part}\nEquipment: ${exercise.equipment}\nDifficulty: ${exercise.difficulty}`);
                    }}
                  />
                )}

                {activeTab === 'workout' && (
                  <MLRecommendations
                    type="workout"
                    nRecommendations={12}
                    showFilters={false}
                    onSelect={(exercise) => {
                      console.log('Selected workout exercise:', exercise);
                      alert(`Added to workout: ${exercise.exercise_name}\n${exercise.sets} sets × ${exercise.reps} reps\nRest: ${exercise.rest_seconds}s`);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-teal-900">
              <h2 className="text-2xl font-semibold mb-4 text-teal-400">How the AI Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
                <div>
                  <h3 className="text-white font-medium mb-2">Content-Based Filtering</h3>
                  <p>Uses TF-IDF vectorization to find meals and exercises similar to your preferences and goals.</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Multi-Factor Scoring</h3>
                  <p>Each recommendation is scored based on goal alignment, equipment availability, and experience level.</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Personalized Programming</h3>
                  <p>Workout plans are customized with appropriate sets, reps, and rest periods for your fitness level.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mt-8 border border-teal-900">
              <h2 className="text-2xl font-semibold mb-4 text-teal-400">Recommendation Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h3 className="text-white font-medium mb-2">Smart Meal Suggestions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Goal-optimized calorie ranges</li>
                    <li>Dietary preference matching</li>
                    <li>Macro-nutrient balancing</li>
                    <li>Meal type filtering</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Intelligent Exercise Selection</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Equipment-based filtering</li>
                    <li>Experience level matching</li>
                    <li>Body part targeting</li>
                    <li>Difficulty progression</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Complete Workout Plans</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Progressive overload principles</li>
                    <li>Goal-specific rep ranges</li>
                    <li>Optimal rest periods</li>
                    <li>Balanced muscle targeting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Personalized Scoring</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Goal alignment (40%)</li>
                    <li>Equipment compatibility (20%)</li>
                    <li>Experience level (10%)</li>
                    <li>Dietary preferences (30%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MLPage; 