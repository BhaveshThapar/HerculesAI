import React, { useState } from 'react';
import MLRecommendations from '../components/MLRecommendations';

const MLDemo = () => {
  const [activeTab, setActiveTab] = useState('meals');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');

  const demoUserProfile = {
    goal: 'bulk',
    experience_level: 'intermediate',
    equipment_access: 'full_gym',
    gender: 'male',
    age: 25,
    height_cm: 180,
    weight: 75,
    diet_preference: 'all'
  };

  const mealTypes = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const bodyParts = ['all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-teal-400">HerculesAI ML Demo</h1>
          <p className="text-gray-300 text-lg">Experience AI-powered fitness recommendations</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-teal-900">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">Demo User Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-3 rounded">
              <div className="text-sm text-gray-400">Goal</div>
              <div className="text-white font-semibold capitalize">{demoUserProfile.goal}</div>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <div className="text-sm text-gray-400">Experience</div>
              <div className="text-white font-semibold capitalize">{demoUserProfile.experience_level}</div>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <div className="text-sm text-gray-400">Equipment</div>
              <div className="text-white font-semibold capitalize">{demoUserProfile.equipment_access.replace('_', ' ')}</div>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <div className="text-sm text-gray-400">Diet</div>
              <div className="text-white font-semibold capitalize">{demoUserProfile.diet_preference}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-teal-900">
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
                nRecommendations={6}
                showFilters={false}
                onSelect={(meal) => {
                  console.log('Selected meal:', meal);
                  alert(`Selected: ${meal.meal_name}\nCalories: ${meal.calories}\nProtein: ${meal.protein_g}g`);
                }}
              />
            )}

            {activeTab === 'exercises' && (
              <MLRecommendations
                type="exercises"
                bodyPart={selectedBodyPart === 'all' ? null : selectedBodyPart}
                nRecommendations={8}
                showFilters={false}
                onSelect={(exercise) => {
                  console.log('Selected exercise:', exercise);
                  alert(`Selected: ${exercise.exercise_name}\nBody Part: ${exercise.body_part}\nDifficulty: ${exercise.difficulty}`);
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
                  alert(`Added to workout: ${exercise.exercise_name}\n${exercise.sets} sets × ${exercise.reps} reps`);
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

        <div className="text-center mt-8">
          <p className="text-gray-400">
            This demo uses the ML recommendation system with sample user data. 
            In the full app, recommendations are personalized based on your actual profile and progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MLDemo; 