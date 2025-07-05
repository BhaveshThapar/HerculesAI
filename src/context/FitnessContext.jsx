import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const FitnessContext = createContext();

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};

export const FitnessProvider = ({ children }) => {
  const { session } = UserAuth();
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkoutLogs = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkoutLogs(data || []);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionLogs = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNutritionLogs(data || []);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressLogs = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProgressLogs(data || []);
    } catch (error) {
      console.error('Error fetching progress logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkoutLog = async (workoutData) => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert([{ user_id: session.user.id, ...workoutData }])
        .select();

      if (error) throw error;
      setWorkoutLogs(prev => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding workout log:', error);
      return { success: false, error: error.message };
    }
  };

  const addNutritionLog = async (nutritionData) => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('nutrition_logs')
        .insert([{ user_id: session.user.id, ...nutritionData }])
        .select();

      if (error) throw error;
      setNutritionLogs(prev => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding nutrition log:', error);
      return { success: false, error: error.message };
    }
  };

  const addProgressLog = async (progressData) => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('progress_logs')
        .insert([{ user_id: session.user.id, ...progressData }])
        .select();

      if (error) throw error;
      setProgressLogs(prev => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding progress log:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteWorkoutLog = async (logId) => {
    try {
      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      setWorkoutLogs(prev => prev.filter(log => log.id !== logId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting workout log:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteNutritionLog = async (logId) => {
    try {
      const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      setNutritionLogs(prev => prev.filter(log => log.id !== logId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting nutrition log:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProgressLog = async (logId) => {
    try {
      const { error } = await supabase
        .from('progress_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      setProgressLogs(prev => prev.filter(log => log.id !== logId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting progress log:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchWorkoutLogs();
      fetchNutritionLogs();
      fetchProgressLogs();
    }
  }, [session]);

  const value = {
    workoutLogs,
    nutritionLogs,
    progressLogs,
    loading,
    addWorkoutLog,
    addNutritionLog,
    addProgressLog,
    deleteWorkoutLog,
    deleteNutritionLog,
    deleteProgressLog,
    fetchWorkoutLogs,
    fetchNutritionLogs,
    fetchProgressLogs
  };

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
}; 