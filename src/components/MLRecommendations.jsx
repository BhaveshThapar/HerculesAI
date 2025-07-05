import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';

const MLRecommendations = ({ 
  type = 'exercises', 
  bodyPart = null, 
  mealType = null, 
  nRecommendations = 5,
  onSelect = null,
  showFilters = true 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userProfile } = useUserProfile();

  const generateRecommendations = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      let requestBody = {
        user_profile: {
          goal: userProfile.goal,
          experience: userProfile.experience,
          equipment_access: userProfile.gym_access,
          gender: userProfile.gender,
          age: userProfile.age,
          height_cm: userProfile.height,
          weight: userProfile.weight,
          diet_preference: userProfile.diet_preference
        },
        n_recommendations: nRecommendations
      };

      if (type === 'exercises') {
        endpoint = '/api/ml/recommend-exercises';
        if (bodyPart) {
          requestBody.body_part = bodyPart;
        }
      } else if (type === 'meals') {
        endpoint = '/api/ml/recommend-meals';
        if (mealType) {
          requestBody.meal_type = mealType;
        }
      } else if (type === 'workout') {
        endpoint = '/api/ml/generate-workout';
        requestBody.workout_type = 'strength';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.exercises || data.meals || data.workout_plan || [];
        setRecommendations(items);
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [userProfile, type, bodyPart, mealType, nRecommendations]);

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const getItemCard = (item, index) => {
    if (type === 'exercises') {
      return (
        <div 
          key={item.exercise_id || index} 
          className="bg-gray-800 rounded-lg p-4 border border-teal-900 hover:border-teal-700 transition cursor-pointer"
          onClick={() => handleSelect(item)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">{item.exercise_name}</h3>
            <span className="text-xs text-teal-400 bg-teal-900 px-2 py-1 rounded">
              {item.difficulty}
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">
            {item.body_part} • {item.equipment}
          </div>
          {item.similarity_score && (
            <div className="text-xs text-teal-300">
              Similarity: {(item.similarity_score * 100).toFixed(1)}%
            </div>
          )}
        </div>
      );
    } else if (type === 'meals') {
      return (
        <div 
          key={item.meal_id || index} 
          className="bg-gray-800 rounded-lg p-4 border border-teal-900 hover:border-teal-700 transition cursor-pointer"
          onClick={() => handleSelect(item)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">{item.meal_name}</h3>
            <span className="text-xs text-teal-400 bg-teal-900 px-2 py-1 rounded">
              {item.meal_type}
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">
            {item.calories} cal • {item.protein_g}g protein • {item.carbs_g}g carbs • {item.fat_g}g fat
          </div>
          {item.dietary_tags && (
            <div className="flex flex-wrap gap-1">
              {item.dietary_tags.split(';').map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-xs bg-teal-900 text-teal-300 px-1 py-0.5 rounded"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    } else if (type === 'workout') {
      return (
        <div 
          key={item.exercise_id || index} 
          className="bg-gray-800 rounded-lg p-4 border border-teal-900 hover:border-teal-700 transition cursor-pointer"
          onClick={() => handleSelect(item)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">{item.exercise_name}</h3>
            <span className="text-xs text-teal-400 bg-teal-900 px-2 py-1 rounded">
              {item.difficulty}
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">
            {item.body_part} • {item.equipment}
          </div>
          <div className="text-sm text-teal-300">
            {item.sets} sets × {item.reps} reps • {item.rest_seconds}s rest
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-white">Loading AI recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-2">Error loading recommendations</div>
        <button 
          onClick={generateRecommendations}
          className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={generateRecommendations}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition text-sm"
          >
            Refresh Recommendations
          </button>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((item, index) => getItemCard(item, index))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400">No recommendations available</div>
          <div className="text-gray-500 text-sm mt-1">Try adjusting your preferences</div>
        </div>
      )}
    </div>
  );
};

export default MLRecommendations; 