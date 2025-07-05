import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useFitness } from '../context/FitnessContext';
import Sidebar from '../components/Sidebar';

const herculesImg = 'https://img.freepik.com/premium-vector/pixel-art-illustration-hercules-pixelated-greek-hercules-greek-mythology-hercules-pixelated_1038602-827.jpg';

const Nutrition = () => {
  const { session } = UserAuth();
  const { userProfile } = useUserProfile();
  const { nutritionLogs, addNutritionLog, loading } = useFitness();
  
  const [showLogForm, setShowLogForm] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: 'Breakfast',
    meal_name: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    fiber_g: '',
    notes: ''
  });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const mealData = {
      meal_type: formData.meal_type,
      meal_name: formData.meal_name,
      calories: parseInt(formData.calories) || 0,
      protein_g: parseFloat(formData.protein_g) || 0,
      carbs_g: parseFloat(formData.carbs_g) || 0,
      fat_g: parseFloat(formData.fat_g) || 0,
      fiber_g: parseFloat(formData.fiber_g) || 0,
      notes: formData.notes
    };

    const result = await addNutritionLog(mealData);
    if (result.success) {
      setFormData({
        meal_type: 'Breakfast',
        meal_name: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
        fiber_g: '',
        notes: ''
      });
      setShowLogForm(false);
    }
  };

  const getTodayNutrition = () => {
    const today = new Date().toISOString().split('T')[0];
    return nutritionLogs.filter(log => 
      new Date(log.created_at).toISOString().split('T')[0] === today
    );
  };

  const getWeeklyNutrition = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return nutritionLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= weekAgo && logDate <= today;
    });
  };

  const calculateDailyStats = (meals) => {
    return meals.reduce((stats, meal) => ({
      calories: stats.calories + (meal.calories || 0),
      protein: stats.protein + (meal.protein_g || 0),
      carbs: stats.carbs + (meal.carbs_g || 0),
      fat: stats.fat + (meal.fat_g || 0),
      fiber: stats.fiber + (meal.fiber_g || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const todayMeals = getTodayNutrition();
  const weeklyMeals = getWeeklyNutrition();
  const todayStats = calculateDailyStats(todayMeals);
  const weeklyStats = calculateDailyStats(weeklyMeals);

  const getCalorieColor = (calories) => {
    if (calories < 1500) return 'text-red-400';
    if (calories < 2000) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProteinColor = (protein) => {
    if (protein < 50) return 'text-red-400';
    if (protein < 80) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="ml-[220px] p-8 w-full">
        <div className="flex flex-col items-center mb-8">
          <img src={herculesImg} alt="Hercules Pixel Art" className="w-20 h-20 rounded-full mb-4 border-4 border-teal-700" />
          <h1 className="text-3xl font-bold mb-2 text-white">Nutrition Tracking</h1>
          <p className="text-teal-400">Log your meals and track your nutrition</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Today's Nutrition</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Calories:</span>
                <span className={`font-semibold ${getCalorieColor(todayStats.calories)}`}>
                  {todayStats.calories}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Protein:</span>
                <span className={`font-semibold ${getProteinColor(todayStats.protein)}`}>
                  {todayStats.protein.toFixed(1)}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Carbs:</span>
                <span className="text-white font-semibold">{todayStats.carbs.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fat:</span>
                <span className="text-white font-semibold">{todayStats.fat.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fiber:</span>
                <span className="text-white font-semibold">{todayStats.fiber.toFixed(1)}g</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Weekly Average</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Avg Calories:</span>
                <span className="text-white font-semibold">
                  {Math.round(weeklyStats.calories / 7)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg Protein:</span>
                <span className="text-white font-semibold">
                  {(weeklyStats.protein / 7).toFixed(1)}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Meals Logged:</span>
                <span className="text-white font-semibold">{weeklyMeals.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowLogForm(true)}
                className="w-full py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
              >
                Log New Meal
              </button>
              <button
                onClick={() => setShowLogForm(false)}
                className="w-full py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                View Logged Meals
              </button>
            </div>
          </div>
        </div>

        {showLogForm && (
          <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Log New Meal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Meal Type</label>
                  <select
                    name="meal_type"
                    value={formData.meal_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    required
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Meal Name</label>
                  <input
                    type="text"
                    name="meal_name"
                    value={formData.meal_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    placeholder="e.g., Grilled Chicken Salad"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Protein (g)</label>
                  <input
                    type="number"
                    name="protein_g"
                    value={formData.protein_g}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs_g"
                    value={formData.carbs_g}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Fat (g)</label>
                  <input
                    type="number"
                    name="fat_g"
                    value={formData.fat_g}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Fiber (g)</label>
                  <input
                    type="number"
                    name="fiber_g"
                    value={formData.fiber_g}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-teal-700 rounded text-white"
                  placeholder="Any additional notes about this meal..."
                  rows="3"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Meal'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showLogForm && (
          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Logged Meals</h2>
            {nutritionLogs.length > 0 ? (
              <div className="space-y-4">
                {nutritionLogs.slice(0, 10).map((meal) => (
                  <div key={meal.id} className="bg-gray-900 rounded-lg p-4 border border-teal-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{meal.meal_name}</h3>
                      <span className="text-sm text-teal-400 bg-teal-900 px-2 py-1 rounded">
                        {meal.meal_type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-300 mb-2">
                      <div>Calories: {meal.calories}</div>
                      <div>Protein: {meal.protein_g}g</div>
                      <div>Carbs: {meal.carbs_g}g</div>
                      <div>Fat: {meal.fat_g}g</div>
                      <div>Fiber: {meal.fiber_g}g</div>
                    </div>
                    {meal.notes && (
                      <div className="text-sm text-gray-400 italic">"{meal.notes}"</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(meal.created_at).toLocaleDateString()} at {new Date(meal.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400">No meals logged yet</div>
                <div className="text-gray-500 text-sm mt-2">Start by logging your first meal!</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Nutrition; 