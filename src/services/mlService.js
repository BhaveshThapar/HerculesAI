const API_BASE = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5001/api';

export async function getAIRecommendations(userProfile) {
  const mealRes = await fetch(`${API_BASE}/recommend/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile: userProfile })
  });
  const mealData = await mealRes.json();

  const workoutRes = await fetch(`${API_BASE}/recommend/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile: userProfile })
  });
  const workoutData = await workoutRes.json();

  return {
    meal: mealData.meal,
    workout: workoutData.workout
  };
} 