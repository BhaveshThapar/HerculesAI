import { supabase } from '../supabaseClient';

const API_BASE = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5001/api';

export async function getMealRecommendations(userProfile, mealType, nRecommendations = 5) {
  const response = await fetch(`${API_BASE}/ml/recommend-meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_profile: userProfile,
      meal_type: mealType,
      n_recommendations: nRecommendations
    })
  });
  return response.json();
}

export async function getExerciseRecommendations(userProfile, bodyPart, nRecommendations = 8) {
  const response = await fetch(`${API_BASE}/ml/recommend-exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_profile: userProfile,
      body_part: bodyPart,
      n_recommendations: nRecommendations
    })
  });
  return response.json();
}

export async function generateWorkoutPlan(userProfile) {
  const response = await fetch(`${API_BASE}/ml/generate-workout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile: userProfile })
  });
  return response.json();
}

export async function findSimilarUsers(userProfile, nRecommendations = 5) {
  const response = await fetch(`${API_BASE}/ml/similar-users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_profile: userProfile,
      n_recommendations: nRecommendations
    })
  });
  return response.json();
}

export async function getProgressRecommendations(userProfile, progressData) {
  const response = await fetch(`${API_BASE}/ml/progress-recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_profile: userProfile,
      progress_data: progressData
    })
  });
  return response.json();
}

class MLDataService {
  async logRecommendation(userId, recommendationType, recommendationData, userFeedback = null) {
    try {
      const { data, error } = await supabase
        .from('ml_recommendation_logs')
        .insert({
          user_id: userId,
          recommendation_type: recommendationType,
          recommendation_data: recommendationData,
          user_feedback: userFeedback
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging recommendation:', error);
      throw error;
    }
  }

  async getUserPreferences(userId, preferenceType = null) {
    try {
      let query = supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);

      if (preferenceType) {
        query = query.eq('preference_type', preferenceType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId, preferenceType, preferenceData) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preference_type: preferenceType,
          preference_data: preferenceData
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async addMealToFavorites(userId, mealData) {
    try {
      const { data, error } = await supabase
        .from('meal_favorites')
        .insert({
          user_id: userId,
          meal_id: mealData.meal_id,
          meal_name: mealData.meal_name,
          meal_type: mealData.meal_type,
          calories: mealData.calories,
          protein_g: mealData.protein_g,
          carbs_g: mealData.carbs_g,
          fat_g: mealData.fat_g
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding meal to favorites:', error);
      throw error;
    }
  }

  async getMealFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('meal_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meal favorites:', error);
      throw error;
    }
  }

  async addWorkoutToFavorites(userId, workoutName, workoutData) {
    try {
      const { data, error } = await supabase
        .from('workout_favorites')
        .insert({
          user_id: userId,
          workout_name: workoutName,
          workout_data: workoutData
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding workout to favorites:', error);
      throw error;
    }
  }

  async getWorkoutFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('workout_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching workout favorites:', error);
      throw error;
    }
  }

  async setUserGoal(userId, goalType, targetValue, currentValue = null, targetDate = null) {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .upsert({
          user_id: userId,
          goal_type: goalType,
          target_value: targetValue,
          current_value: currentValue,
          target_date: targetDate,
          is_active: true
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting user goal:', error);
      throw error;
    }
  }

  async getUserGoals(userId) {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user goals:', error);
      throw error;
    }
  }

  async createInsight(userId, insightType, insightTitle, insightContent, insightData = null) {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .insert({
          user_id: userId,
          insight_type: insightType,
          insight_title: insightTitle,
          insight_content: insightContent,
          insight_data: insightData
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating AI insight:', error);
      throw error;
    }
  }

  async getInsights(userId, isRead = null) {
    try {
      let query = supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (isRead !== null) {
        query = query.eq('is_read', isRead);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  }

  async markInsightAsRead(insightId) {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .update({ is_read: true })
        .eq('id', insightId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking insight as read:', error);
      throw error;
    }
  }

  async getMLUserData(userId) {
    try {
      const { data, error } = await supabase
        .from('ml_user_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching ML user data:', error);
      throw error;
    }
  }

  async getRecommendationHistory(userId, recommendationType = null, limit = 50) {
    try {
      let query = supabase
        .from('ml_recommendation_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (recommendationType) {
        query = query.eq('recommendation_type', recommendationType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recommendation history:', error);
      throw error;
    }
  }

  async updateUserProfileML(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          weight: profileData.weight_kg,
          height: profileData.height_cm,
          gym_access: profileData.equipment_access
        })
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile ML data:', error);
      throw error;
    }
  }
}

export default MLDataService; 